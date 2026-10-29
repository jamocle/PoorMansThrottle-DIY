(() => {
    "use strict";

    class FaqSearchSyntaxError extends Error {
        constructor(message) {
            super(message);
            this.name = "FaqSearchSyntaxError";
        }
    }

    function normalizeFaqSearchText(value) {
        return String(value ?? "")
            .toLowerCase()
            .replace(/\s+/g, " ")
            .trim();
    }

    function tokenizeFaqSearch(query) {
        const tokens = [];
        let index = 0;

        const pushToken = (type, value = "") => {
            tokens.push({ type, value });
        };

        while (index < query.length) {
            const character = query[index];

            if (/\s/.test(character)) {
                index += 1;
                continue;
            }

            if (character === "(") {
                pushToken("leftParen");
                index += 1;
                continue;
            }

            if (character === ")") {
                pushToken("rightParen");
                index += 1;
                continue;
            }

            if (character === '"') {
                index += 1;
                let phrase = "";
                let closed = false;

                while (index < query.length) {
                    const phraseCharacter = query[index];

                    if (phraseCharacter === "\\") {
                        const escapedCharacter = query[index + 1];
                        if (escapedCharacter !== '"' && escapedCharacter !== "\\") {
                            throw new FaqSearchSyntaxError(
                                'Invalid escape sequence. Inside quotes, use \\" for a quote or \\\\ for a backslash.'
                            );
                        }

                        phrase += escapedCharacter;
                        index += 2;
                        continue;
                    }

                    if (phraseCharacter === '"') {
                        closed = true;
                        index += 1;
                        break;
                    }

                    phrase += phraseCharacter;
                    index += 1;
                }

                if (!closed) {
                    throw new FaqSearchSyntaxError("Unmatched quotation mark.");
                }

                const normalizedPhrase = normalizeFaqSearchText(phrase);
                if (!normalizedPhrase) {
                    throw new FaqSearchSyntaxError("Quoted phrases cannot be empty.");
                }

                pushToken("phrase", normalizedPhrase);
                continue;
            }

            const start = index;
            while (
                index < query.length &&
                !/\s/.test(query[index]) &&
                query[index] !== "(" &&
                query[index] !== ")" &&
                query[index] !== '"'
            ) {
                index += 1;
            }

            const rawValue = query.slice(start, index);
            const normalizedValue = normalizeFaqSearchText(rawValue);
            if (!normalizedValue) {
                continue;
            }

            const operator = normalizedValue.toUpperCase();
            if (operator === "AND" || operator === "OR" || operator === "NOT") {
                pushToken(operator.toLowerCase());
            } else {
                pushToken("term", normalizedValue);
            }
        }

        const tokensWithImplicitAnd = [];
        const canEndExpression = (token) =>
            token?.type === "term" ||
            token?.type === "phrase" ||
            token?.type === "rightParen";
        const canStartExpression = (token) =>
            token?.type === "term" ||
            token?.type === "phrase" ||
            token?.type === "leftParen" ||
            token?.type === "not";

        for (const token of tokens) {
            const previous = tokensWithImplicitAnd.at(-1);
            if (canEndExpression(previous) && canStartExpression(token)) {
                pushImplicitAnd(tokensWithImplicitAnd);
            }

            tokensWithImplicitAnd.push(token);
        }

        return tokensWithImplicitAnd;
    }

    function pushImplicitAnd(tokens) {
        tokens.push({ type: "and", value: "" });
    }

    function parseFaqSearch(query) {
        const tokens = tokenizeFaqSearch(query);
        if (tokens.length === 0) {
            return null;
        }

        let position = 0;

        const currentToken = () => tokens[position];

        const parsePrimary = () => {
            const token = currentToken();
            if (!token) {
                throw new FaqSearchSyntaxError("Search expression is incomplete.");
            }

            if (token.type === "term" || token.type === "phrase") {
                position += 1;
                return { type: token.type, value: token.value };
            }

            if (token.type === "leftParen") {
                position += 1;
                if (currentToken()?.type === "rightParen") {
                    throw new FaqSearchSyntaxError("Empty parentheses are not allowed.");
                }

                const expression = parseOr();
                if (currentToken()?.type !== "rightParen") {
                    throw new FaqSearchSyntaxError("Missing closing parenthesis.");
                }

                position += 1;
                return expression;
            }

            if (token.type === "rightParen") {
                throw new FaqSearchSyntaxError("Unexpected closing parenthesis.");
            }

            throw new FaqSearchSyntaxError(`Unexpected ${token.type.toUpperCase()} operator.`);
        };

        const parseNot = () => {
            if (currentToken()?.type === "not") {
                position += 1;
                return { type: "not", operand: parseNot() };
            }

            return parsePrimary();
        };

        const parseAnd = () => {
            let expression = parseNot();

            while (currentToken()?.type === "and") {
                position += 1;
                expression = {
                    type: "and",
                    left: expression,
                    right: parseNot()
                };
            }

            return expression;
        };

        const parseOr = () => {
            let expression = parseAnd();

            while (currentToken()?.type === "or") {
                position += 1;
                expression = {
                    type: "or",
                    left: expression,
                    right: parseAnd()
                };
            }

            return expression;
        };

        const expression = parseOr();
        if (position !== tokens.length) {
            const token = currentToken();
            if (token?.type === "rightParen") {
                throw new FaqSearchSyntaxError("Unexpected closing parenthesis.");
            }

            throw new FaqSearchSyntaxError("Invalid search expression.");
        }

        return expression;
    }

    function evaluateFaqSearch(expression, searchableText) {
        if (!expression) {
            return true;
        }

        switch (expression.type) {
            case "term":
            case "phrase":
                return searchableText.includes(expression.value);
            case "not":
                return !evaluateFaqSearch(expression.operand, searchableText);
            case "and":
                return (
                    evaluateFaqSearch(expression.left, searchableText) &&
                    evaluateFaqSearch(expression.right, searchableText)
                );
            case "or":
                return (
                    evaluateFaqSearch(expression.left, searchableText) ||
                    evaluateFaqSearch(expression.right, searchableText)
                );
            default:
                return false;
        }
    }

    function collectPositiveSearchValues(expression, isNegated = false, values = []) {
        if (!expression) {
            return values;
        }

        switch (expression.type) {
            case "term":
            case "phrase":
                if (!isNegated) {
                    values.push(expression.value);
                }
                break;
            case "not":
                collectPositiveSearchValues(expression.operand, true, values);
                break;
            case "and":
            case "or":
                collectPositiveSearchValues(expression.left, isNegated, values);
                collectPositiveSearchValues(expression.right, isNegated, values);
                break;
            default:
                break;
        }

        return values;
    }

    function escapeRegularExpression(value) {
        return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    function createHighlightRegularExpression(expression) {
        const values = collectPositiveSearchValues(expression);
        const patterns = [...new Set(values)]
            .filter(Boolean)
            .sort((left, right) => right.length - left.length)
            .map((value) =>
                value
                    .split(/\s+/)
                    .map(escapeRegularExpression)
                    .join("\\s+")
            );

        if (patterns.length === 0) {
            return null;
        }

        return new RegExp(`(${patterns.join("|")})`, "gi");
    }

    function clearFaqSearchHighlights(root) {
        for (const highlight of root.querySelectorAll("mark.faq-search-highlight")) {
            highlight.replaceWith(document.createTextNode(highlight.textContent ?? ""));
        }

        root.normalize();
    }

    function highlightFaqSearchMatches(root, expression) {
        const regularExpression = createHighlightRegularExpression(expression);
        if (!regularExpression) {
            return;
        }

        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode(node) {
                    const parent = node.parentElement;
                    if (
                        !parent ||
                        parent.closest("mark.faq-search-highlight") ||
                        parent.closest("script, style, textarea")
                    ) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    regularExpression.lastIndex = 0;
                    return regularExpression.test(node.nodeValue ?? "")
                        ? NodeFilter.FILTER_ACCEPT
                        : NodeFilter.FILTER_REJECT;
                }
            }
        );

        const textNodes = [];
        while (walker.nextNode()) {
            textNodes.push(walker.currentNode);
        }

        for (const textNode of textNodes) {
            const text = textNode.nodeValue ?? "";
            regularExpression.lastIndex = 0;

            const fragment = document.createDocumentFragment();
            let lastIndex = 0;
            let match;

            while ((match = regularExpression.exec(text)) !== null) {
                if (match.index > lastIndex) {
                    fragment.append(document.createTextNode(text.slice(lastIndex, match.index)));
                }

                const mark = document.createElement("mark");
                mark.className = "faq-search-highlight";
                mark.textContent = match[0];
                fragment.append(mark);

                lastIndex = match.index + match[0].length;

                if (match[0].length === 0) {
                    regularExpression.lastIndex += 1;
                }
            }

            if (lastIndex < text.length) {
                fragment.append(document.createTextNode(text.slice(lastIndex)));
            }

            textNode.replaceWith(fragment);
        }
    }

    function initializeFaqSearch() {
        const faqSection = document.querySelector('details.section[data-section-url="faq"]');
        const search = document.getElementById("faqSearch");
        const input = document.getElementById("faqSearchInput");
        const clearButton = document.getElementById("faqSearchClear");
        const status = document.getElementById("faqSearchStatus");
        const sectionContent = faqSection?.querySelector(":scope > .section-content");

        if (!faqSection || !search || !input || !clearButton || !status || !sectionContent) {
            return;
        }

        const faqItems = Array.from(sectionContent.children)
            .filter((element) =>
                element.matches('details.subsection[data-section-url^="faq-"]')
            )
            .map((element) => {
                const summary = element.querySelector(":scope > summary");
                const content = element.querySelector(":scope > .subsection-content");
                return {
                    element,
                    searchableText: normalizeFaqSearchText(
                        `${summary?.textContent ?? ""} ${content?.textContent ?? ""}`
                    )
                };
            });

        const setStatus = (message, isError = false) => {
            status.textContent = message;
            status.classList.toggle("faq-search-status-error", isError);
        };

        const showAllFaqs = () => {
            for (const faq of faqItems) {
                clearFaqSearchHighlights(faq.element);
                faq.element.hidden = false;
            }
        };

        const updateSearch = () => {
            const query = input.value.trim();
            clearButton.hidden = query.length === 0;

            if (!query) {
                showAllFaqs();
                setStatus(`${faqItems.length} FAQs`);
                return;
            }

            let expression;
            try {
                expression = parseFaqSearch(query);
            } catch (error) {
                if (error instanceof FaqSearchSyntaxError) {
                    setStatus(`Invalid search: ${error.message} Previous results are unchanged.`, true);
                    return;
                }

                throw error;
            }

            let matchCount = 0;
            for (const faq of faqItems) {
                const isMatch = evaluateFaqSearch(expression, faq.searchableText);
                clearFaqSearchHighlights(faq.element);
                faq.element.hidden = !isMatch;

                if (isMatch) {
                    highlightFaqSearchMatches(faq.element, expression);
                    matchCount += 1;
                }
            }

            if (matchCount === 0) {
                setStatus(`No FAQs found for “${query}”. Try fewer or different words.`);
                return;
            }

            setStatus(
                matchCount === 1
                    ? "1 matching FAQ"
                    : `${matchCount} matching FAQs`
            );
        };

        input.addEventListener("input", updateSearch);
        clearButton.addEventListener("click", () => {
            input.value = "";
            updateSearch();
            input.focus();
        });

        showAllFaqs();
        setStatus(`${faqItems.length} FAQs`);
        search.hidden = false;
    }

    const startFaqSearch = () => {
        initializeFaqSearch();
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", startFaqSearch, { once: true });
    } else {
        startFaqSearch();
    }
})();
