var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(function () {
    window.uiHelper = {
        getOverlay: getOverlay,
        renderMobileUi: renderMobileUi,
        renderMobileNavBar: renderMobileNavBar,
        renderDesktopUi: renderDesktopUi,
        refreshUndoRedoState: refreshUndoRedoState,
        refreshPagination: refreshPagination,
        receiveMessage: receiveMessage,
        refreshPriceDisplay: refreshPriceDisplay,
        updatePageThumbnail: updatePageThumbnail,
        viewPortScroll: viewPortScroll,
        viewPortResize: viewPortResize,
        viewPortScrollInIFrame: viewPortScrollInIFrame,
        resize: resize,
        resetUi: resetUi,
        closeMobileFullscreenContainer: closeMobileFullscreenContainer,
        customLayoutSnippetRenderCallback: undefined
    };
    const resolvedPromise = Promise.resolve();
    function asyncTimeout(ms) {
        if (ms === 0) {
            return resolvedPromise;
        }
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    function createValidationRegex(pattern) {
        let flag = undefined;
        const fidx = pattern.indexOf("/");
        const lidx = pattern.lastIndexOf("/");
        if (fidx !== -1 && lidx !== -1) {
            flag = pattern.slice(lidx + 1);
            pattern = pattern.slice(fidx + 1, lidx);
        }
        return new RegExp(pattern, flag);
    }
    const canUseStorage = (function () {
        try {
            sessionStorage.setItem("test", "value");
            return true;
        }
        catch (error) {
            return false;
        }
    })();
    const fallbackStorage = {};
    function setStorageItemSafe(key, value) {
        if (canUseStorage) {
            sessionStorage.setItem(key, value);
        }
        else {
            fallbackStorage[key] = value;
        }
    }
    function getStorageItemSafe(key) {
        var _a;
        if (canUseStorage) {
            return sessionStorage.getItem(key);
        }
        else {
            return (_a = fallbackStorage[key]) !== null && _a !== void 0 ? _a : null;
        }
    }
    function resetUi() {
        uih_currentTabId = "LOADING";
        uih_currentRender = "never";
        uih_currentPriceDisplay = undefined;
        uih_mobilePriceDisplay = "none";
        tableDragRowIndex = -1;
        tableEditRow = {};
        tableEditRowIndex = -1;
        setCurrentMenuCategories("layout", null);
        setCurrentMenuCategories("sticker", null);
        setCurrentSnippetCategory("layout", "");
        setCurrentSnippetCategory("sticker", "");
        setCurrentSnippetTopic("layout", null);
        setCurrentSnippetTopic("sticker", null);
        setCurrentSnippetKeywords("layout", []);
        setCurrentSnippetKeywords("sticker", []);
        setLastSnippetKeywords("layout", []);
        setLastSnippetKeywords("sticker", []);
        setLastSnippetKeywordsResults("layout", []);
        setLastSnippetKeywordsResults("sticker", []);
        uih_currentLayoutSnippetImageAmount = "";
        uih_scrollPositions.clear();
    }
    let uih_viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    let uih_viewportWidth = window.visualViewport ? window.visualViewport.width : window.innerWidth;
    let uih_viewportOffsetTop = 0;
    let uih_currentGroupSnippets = [];
    let uih_currentProperties = [];
    let uih_currentTabs = [];
    let uih_currentTabId = "LOADING";
    let uih_currentStep = null;
    let uih_hasSteps = undefined;
    let uih_currentLayoutSnippets = [];
    let uih_previousLayoutSnippets = [];
    let uih_currentState = "document";
    let uih_currentRender = "never";
    let uih_currentVisiblePage;
    let uih_currentPriceDisplay;
    let uih_mobilePriceDisplay = "none";
    let uih_lastMobileState = null;
    let uih_autoSelectPending = false;
    let uih_lastPrintessHeight = 0;
    let uih_lastPrintessWidth = 0;
    let uih_lastPrintessTop = null;
    let uih_lastMobileUiHeight = 0;
    let uih_lastZoomMode = "unset";
    let uih_lastFormFieldId = undefined;
    let uih_stepTabOffset = 0;
    let uih_stepTabsScrollPosition = 0;
    const uih_scrollPositions = new Map();
    const uih_scrollHandlerApplied = false;
    let uih_lastOverflowState = false;
    let uih_activeImageAccordion = "Buyer Upload";
    let uih_ignoredLowResolutionErrors = [];
    let uih_ignoredEmptyPageError = false;
    let uih_layoutSelectionDialogHasBeenRendered = false;
    let uih_lastDragTarget;
    let uih_oneTimeShowSplitterLayoutSelection = false;
    let uih_externalUploadInfo;
    let uih_imagePollingStarted = false;
    let uih_currentLayoutSnippetImageAmount = "";
    let uih_lastSpreadAspect = "not set";
    let uih_currentStickerMenuTags;
    let _uih_lastLayoutSnippetKeywordsResults = [];
    let _uih_lastStickerSnippetKeywordsResults = [];
    function getLastSnippetKeywordsResults(which) {
        return which === "layout" ? _uih_lastLayoutSnippetKeywordsResults : _uih_lastStickerSnippetKeywordsResults;
    }
    function setLastSnippetKeywordsResults(which, value) {
        if (which === "layout") {
            _uih_lastLayoutSnippetKeywordsResults = value;
        }
        else {
            _uih_lastStickerSnippetKeywordsResults = value;
        }
    }
    let _uih_lastLayoutSnippetKeywords = [];
    let _uih_lastStickerSnippetKeywords = [];
    function getLastSnippetKeywords(which) {
        return which === "layout" ? _uih_lastLayoutSnippetKeywords : _uih_lastStickerSnippetKeywords;
    }
    function setLastSnippetKeywords(which, value) {
        if (which === "layout") {
            _uih_lastLayoutSnippetKeywords = value;
        }
        else {
            _uih_lastStickerSnippetKeywords = value;
        }
    }
    let _uih_currentLayoutSnippetKeywords = [];
    let _uih_currentStickerSnippetKeywords = [];
    function getCurrentSnippetKeywords(which) {
        return which === "layout" ? _uih_currentLayoutSnippetKeywords : _uih_currentStickerSnippetKeywords;
    }
    function setCurrentSnippetKeywords(which, value) {
        if (which === "layout") {
            _uih_currentLayoutSnippetKeywords = value;
        }
        else {
            _uih_currentStickerSnippetKeywords = value;
        }
    }
    let _uih_currentLayoutSnippetTopic = null;
    let _uih_currentStickerSnippetTopic = null;
    function getCurrentSnippetTopic(which) {
        return which === "layout" ? _uih_currentLayoutSnippetTopic : _uih_currentStickerSnippetTopic;
    }
    function setCurrentSnippetTopic(which, value) {
        if (which === "layout") {
            _uih_currentLayoutSnippetTopic = value;
        }
        else {
            _uih_currentStickerSnippetTopic = value;
        }
    }
    let _uih_currentLayoutSnippetCategory = "";
    let _uih_currentStickerSnippetCategory = "";
    function getCurrentSnippetCategory(which) {
        return which === "layout" ? _uih_currentLayoutSnippetCategory : _uih_currentStickerSnippetCategory;
    }
    function setCurrentSnippetCategory(which, value) {
        if (which === "layout") {
            _uih_currentLayoutSnippetCategory = value;
        }
        else {
            _uih_currentStickerSnippetCategory = value;
        }
    }
    let _uih_currentMenuCategories_Layout = null;
    let _uih_currentMenuCategories_Sticker = null;
    function getCurrentMenuCategories(which) {
        return which === "layout" ? _uih_currentMenuCategories_Layout : _uih_currentMenuCategories_Sticker;
    }
    function setCurrentMenuCategories(which, value) {
        if (which === "layout") {
            _uih_currentMenuCategories_Layout = value;
        }
        else {
            _uih_currentMenuCategories_Sticker = value;
        }
    }
    function getCurrentMenuEntry(which) {
        var _a, _b;
        const cats = getCurrentMenuCategories(which);
        if (!cats || !cats.length)
            return null;
        const categories = cats;
        const category = (_a = cats.filter(c => c.name === getCurrentSnippetCategory(which))[0]) !== null && _a !== void 0 ? _a : cats[0];
        const topic = (_b = category.topics.filter(t => { var _a; return t.name === ((_a = getCurrentSnippetTopic(which)) === null || _a === void 0 ? void 0 : _a.name); })[0]) !== null && _b !== void 0 ? _b : category.topics[0];
        return { categories, category, topic };
    }
    function receiveMessage(printess, topic, data) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (topic) {
                case "ShowAlert":
                    alert("New Message: " + data.text);
                    break;
                case "SplitterFrameToText":
                    uih_oneTimeShowSplitterLayoutSelection = true;
                    break;
                case "OpenImageUpload": {
                    const ele = document.querySelector('input[type="file"].form-control');
                    if (ele)
                        ele.click();
                    break;
                }
                case "MobileImagesUpload": {
                    const content = yield getMobileImagesUploadContent(printess, data.state);
                    const ele = document.getElementById("mobileUploadContent");
                    if (ele) {
                        ele.replaceWith(content);
                    }
                    else if (data.state === "completed") {
                        renderMobileUploadSuccessOverlay(printess);
                    }
                    break;
                }
            }
        });
    }
    function validateAllInputs(printess, buttonType) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = getActualErrors(yield printess.validateAsync("all"));
            if (errors.length > 0) {
                printess.bringErrorIntoView(errors[0]);
                getValidationOverlay(printess, errors, buttonType);
                return false;
            }
            return true;
        });
    }
    function handleBackButtonCallback(printess, callback) {
        if (printess.userInBuyerSide()) {
            if (confirm("Do you want to log out?\n(Please print your current work before leaving)")) {
                printess.logout();
            }
        }
        else if (printess.isInDesignerMode()) {
            callback("");
        }
        else {
            printess.save().then((token) => {
                callback(token);
            }).catch(reason => {
                console.error(reason);
                callback("");
            });
        }
        const closeLayoutsButton = document.getElementById("closeLayoutOffCanvas");
        if (closeLayoutsButton) {
            closeLayoutsButton.click();
        }
        window.setTimeout(() => {
            removeAllUiHints();
            uih_ignoredLowResolutionErrors = [];
            uih_ignoredEmptyPageError = false;
            uih_layoutSelectionDialogHasBeenRendered = false;
        }, 200);
    }
    function removeAllUiHints() {
        if (renderEditableFramesHintTimer) {
            window.clearTimeout(renderEditableFramesHintTimer);
        }
        const layoutHint = document.getElementById("ui-hint-changeLayout");
        if (layoutHint)
            layoutHint.remove();
        const expertHint = document.getElementById("ui-hint-expertMode");
        if (expertHint)
            expertHint.remove();
        const editableFrameHint = document.querySelector("div#frame-pulse.frame-hint-pulse");
        if (editableFrameHint) {
            editableFrameHint.remove();
        }
    }
    function getQuotes(printess) {
        return [
            printess.gl("ui.quote1"),
            printess.gl("ui.quote2"),
            printess.gl("ui.quote3"),
            printess.gl("ui.quote4"),
        ];
    }
    function postQuote(quotes, condition, callBack, waitMs = 10000) {
        const myQuotes = quotes;
        if (condition) {
            setTimeout(() => postQuote(myQuotes, condition, callBack), waitMs);
            const index = Math.floor(Math.random() * myQuotes.length);
            const quote = myQuotes[index];
            if (myQuotes.length > 2)
                myQuotes.splice(index, 1);
            callBack(quote);
        }
    }
    function addToBasket(printess) {
        return __awaiter(this, void 0, void 0, function* () {
            if (printess.getUploadsInProgress() > 0 || printess.getPendingImageUploadsCount() > 0 || printess.getDirectImageMetadataFinalizationPromises().size) {
                const backdrop = document.createElement("div");
                backdrop.className = "modal modal-dialog-centered bg-dark";
                backdrop.style.opacity = "0.9";
                document.body.appendChild(backdrop);
                const modal = document.createElement("div");
                modal.className = "modal-content modal-body modal-lg position-absolute top-50 start-50 translate-middle";
                modal.style.opacity = "1";
                backdrop.appendChild(modal);
                const modalTitle = document.createElement("div");
                modalTitle.innerHTML = printess.gl("ui.imageUploadInfoboxTitle");
                modalTitle.className = "h2";
                modal.appendChild(modalTitle);
                const modalQuote = document.createElement("div");
                modal.appendChild(modalQuote);
                postQuote(getQuotes(printess), true, (quote) => {
                    modalQuote.innerHTML = `<p><i>${quote}</i></p>`;
                });
                const explainationText = document.createElement("p");
                explainationText.innerHTML = printess.gl("ui.imageUploadInfoboxInstruction");
                modal.appendChild(explainationText);
                const text = document.createElement("span");
                text.innerHTML = printess.gl("ui.imageUploadProgressPreparing");
                modal.appendChild(text);
                const progress = document.createElement("div");
                progress.className = "progress";
                modal.appendChild(progress);
                const progressBar = document.createElement("div");
                const progressBarClasses = progressBar.classList;
                progressBarClasses.add("progress-bar");
                progressBarClasses.add("progress-bar-striped");
                progressBarClasses.add("progress-bar-animated");
                progressBarClasses.add("bg-success");
                progressBar.setAttribute("role", "progressbar");
                progressBar.style.width = "2%";
                progress.appendChild(progressBar);
                while (printess.getUploadsInProgress() && !printess.getPendingImageUploads().size) {
                    yield new Promise(resolve => setTimeout(resolve, 2000));
                }
                const uploadImagePromises = printess.getPendingImageUploads();
                const uploadedImagesCount = printess.getPendingImageUploadsCount();
                const metaSteps = 1;
                const steps = uploadedImagesCount + metaSteps + 1;
                while (uploadImagePromises.size > 0) {
                    const pendingImagesCount = printess.getPendingImageUploadsCount();
                    const procent = Math.floor(100 - (pendingImagesCount + metaSteps) * 100 / steps);
                    progressBar.style.width = String(procent) + "%";
                    const imagesAlready = uploadedImagesCount + metaSteps - pendingImagesCount;
                    text.innerHTML = printess.gl("ui.imageUploadProgress")
                        + ": " + imagesAlready + " " + printess.gl("ui.of")
                        + " " + uploadedImagesCount;
                    yield Promise.race(uploadImagePromises);
                }
                const uploadMetaPromises = printess.getDirectImageMetadataFinalizationPromises();
                while (uploadMetaPromises.size > 0) {
                    const procent = Math.floor(100 - 100 / (steps - metaSteps));
                    progressBar.style.width = String(procent) + "%";
                    text.innerHTML = printess.gl("ui.imageUploadProgressMeta");
                    yield Promise.race(uploadMetaPromises);
                }
                backdrop.remove();
            }
            const isValid = yield validateAllInputs(printess, "validateAll");
            if (!isValid) {
                return;
            }
            const callback = printess.getAddToBasketCallback();
            if (callback) {
                yield printess.clearSelection();
                const basketBtn = document.querySelector(".printess-basket-button");
                if (basketBtn) {
                    basketBtn.classList.add("disabled-button");
                    yield asyncTimeout(100);
                }
                printess.showOverlay(printess.gl("ui.saveProgress"));
                const saveToken = yield printess.save();
                let url = "";
                if (printess.noBasketThumbnail() !== true) {
                    url = yield printess.renderFirstPageImage("thumbnail.png");
                }
                callback(saveToken, url);
                printess.hideOverlay();
                if (basketBtn) {
                    basketBtn.classList.remove("disabled-button");
                }
            }
            else {
                alert(printess.gl("ui.addToBasketCallback"));
            }
        });
    }
    function saveTemplate(printess, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const callback = printess.getSaveTemplateCallback();
            const saveButton = document.getElementById("printess-save-button");
            if (callback) {
                yield printess.clearSelection();
                if (saveButton) {
                    saveButton.classList.add("disabled-button");
                    yield asyncTimeout(100);
                }
                printess.showOverlay(printess.gl("ui.saveProgress"));
                const saveToken = yield printess.save();
                callback(saveToken, type);
                printess.hideOverlay();
                if (saveButton) {
                    saveButton.classList.remove("disabled-button");
                }
            }
            else {
                alert(printess.gl("ui.saveTemplateCallback"));
            }
        });
    }
    function gotoNextStep(printess) {
        return __awaiter(this, void 0, void 0, function* () {
            const buttonType = printess.isNextStepPreview() ? "preview" : "next";
            const errors = getActualErrors(yield printess.validateAsync(printess.hasNextStep() ? "until-current-step" : "all"));
            if (errors.length > 0) {
                printess.bringErrorIntoView(errors[0]);
                getValidationOverlay(printess, errors, buttonType);
                return;
            }
            if (printess.hasNextStep()) {
                printess.nextStep();
            }
            else {
                addToBasket(printess);
            }
        });
    }
    function hasIgnoreableErrors(errors) {
        return getActualErrors(errors).filter(e => e.errorCode === "imageResolutionLow" || e.errorCode === "emptyBookPage").length > 0;
    }
    function getActualErrors(errors) {
        return errors.filter(e => {
            if (e.errorCode === "imageResolutionLow") {
                return !uih_ignoredLowResolutionErrors.includes(e.boxIds[0]);
            }
            else if (e.errorCode === "emptyBookPage") {
                return !uih_ignoredEmptyPageError;
            }
            return true;
        });
    }
    function gotoStep(printess, stepIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = getActualErrors(yield printess.validateAsync("until-current-step"));
            if (errors.length > 0) {
                printess.bringErrorIntoView(errors[0]);
                getValidationOverlay(printess, errors, "next", stepIndex);
                return;
            }
            return printess.setStep(stepIndex);
        });
    }
    function viewPortScroll(printess) {
        if (printess) {
            _viewPortScroll(printess, "scroll");
        }
    }
    function viewPortResize(printess) {
        if (printess) {
            checkAndSwitchViews(printess);
            _viewPortScroll(printess, "resize");
        }
    }
    function resize(printess) {
        if (printess) {
            checkAndSwitchViews(printess);
            printess.resizePrintess(false, false, undefined);
        }
    }
    function checkAndSwitchViews(printess) {
        if (printess) {
            const mobile = printess.isMobile();
            if (mobile && uih_currentRender !== "mobile") {
                renderMobileUi(printess);
                renderMobileNavBar(printess);
                removeExternalSnippetsContainer();
            }
            if (!mobile && uih_currentRender !== "desktop") {
                renderDesktopUi(printess);
                removeExternalSnippetsContainer();
            }
        }
    }
    function refreshPriceDisplay(printess, priceDisplay) {
        uih_currentPriceDisplay = priceDisplay;
        if (priceDisplay && uih_currentRender === "mobile") {
            document.body.classList.add("has-mobile-price-bar");
            resizeMobileUi(printess);
        }
        else {
            document.body.classList.remove("has-mobile-price-bar");
        }
        const priceDiv = document.getElementById("total-price-display");
        if (priceDiv) {
            getPriceDisplay(printess, priceDiv, priceDisplay, uih_currentRender === "mobile");
        }
    }
    function getIframeOverlay(printess, title, infoUrl, forMobile) {
        const iframe = document.createElement("iframe");
        iframe.title = printess.gl(title);
        iframe.src = infoUrl.startsWith("/") ? window.origin + infoUrl : infoUrl;
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        if (forMobile) {
            const productInfoDiv = document.getElementById("PRICE-INFO");
            if (productInfoDiv) {
                productInfoDiv.remove();
            }
            renderMobileDialogFullscreen(printess, "PRICE-INFO", title, iframe, false);
        }
        else {
            showModal(printess, "PRICE-MODAL", iframe, title);
        }
    }
    function getPriceDisplay(printess, priceDiv, priceDisplay, forMobile = false) {
        const price = (priceDisplay === null || priceDisplay === void 0 ? void 0 : priceDisplay.price) || "";
        const oldPrice = (priceDisplay === null || priceDisplay === void 0 ? void 0 : priceDisplay.oldPrice) || "";
        const legalNotice = (priceDisplay === null || priceDisplay === void 0 ? void 0 : priceDisplay.legalNotice) || "";
        const productName = (priceDisplay === null || priceDisplay === void 0 ? void 0 : priceDisplay.productName) || printess.getTemplateTitle();
        const infoUrl = printess.getProductInfoUrl() || (priceDisplay === null || priceDisplay === void 0 ? void 0 : priceDisplay.infoUrl) || "";
        priceDiv.innerHTML = "";
        const headline = document.createElement("div");
        headline.className = "total-price-headline";
        if (productName) {
            const dekstopTitle = document.querySelector(".desktop-title-bar > h3") || document.querySelector(".desktop-title-bar > h2");
            if (dekstopTitle)
                dekstopTitle.style.display = "none";
            const productNameSpan = document.createElement("span");
            productNameSpan.className = "product-name";
            productNameSpan.innerText = printess.gl(productName);
            const currentStep = printess.getStep();
            const showStepTitle = printess.stepHeaderDisplay() === "only title" || printess.stepHeaderDisplay() === "title and badge";
            if (currentStep && showStepTitle) {
                productNameSpan.innerText = printess.gl(currentStep.title) || printess.gl("ui.step") + (currentStep.index + 1);
            }
            headline.appendChild(productNameSpan);
        }
        if (!legalNotice) {
            priceDiv.classList.add("price-info-only");
        }
        else {
            priceDiv.classList.remove("price-info-only");
        }
        const oldPriceSpan = document.createElement("span");
        oldPriceSpan.style.textDecoration = "line-through";
        oldPriceSpan.className = "me-2";
        oldPriceSpan.innerText = printess.gl(oldPrice);
        const newPriceSpan = document.createElement("span");
        if (oldPrice)
            newPriceSpan.style.color = "red";
        newPriceSpan.innerText = printess.gl(price);
        const hasOnlySpaces = (x) => /^\s+$/.test(x);
        if (infoUrl && !hasOnlySpaces(infoUrl)) {
            const infoIcon = printess.getIcon("info-circle");
            infoIcon.classList.add("price-info-icon");
            if (oldPrice)
                infoIcon.style.marginRight = "6px";
            infoIcon.onclick = () => getIframeOverlay(printess, printess.gl("ui.productOverview"), infoUrl, forMobile);
            headline.appendChild(infoIcon);
        }
        headline.appendChild(oldPriceSpan);
        headline.appendChild(newPriceSpan);
        priceDiv.appendChild(headline);
        const subline = document.createElement("span");
        subline.className = "total-price-subline";
        subline.innerHTML = getLegalNoticeText(printess, legalNotice, forMobile);
        priceDiv.appendChild(subline);
    }
    function getLegalNoticeText(printess, legalNotice, forMobile, label) {
        const regex = /\[([^)]*)\]\(([^\]]*)\)/gm;
        const listOfLinks = legalNotice.match(regex) || "";
        if (listOfLinks) {
            for (let i = 0; i < listOfLinks.length; i++) {
                const text = listOfLinks[i].split("](")[0].replace("[", "");
                const link = listOfLinks[i].split("](")[1].replace(")", "");
                const id = label ? label.replace(/\s/g, '') : "legal-notice-link-" + i;
                const a = `<span id=${id} style="color: var(--bs-primary); cursor: pointer;">${text}</span>`;
                legalNotice = legalNotice.replace(listOfLinks[i], a);
                window.setTimeout(() => {
                    const agb = document.getElementById(id);
                    if (agb)
                        agb.onclick = () => getIframeOverlay(printess, label || text, link, forMobile);
                }, 100);
            }
            return legalNotice;
        }
        else {
            return printess.gl(legalNotice);
        }
    }
    function refreshPagination(printess) {
        if (uih_currentRender === "mobile") {
            renderPageNavigation(printess, getMobilePageBarDiv(), false, true);
            renderMobileNavBar(printess);
        }
        else {
            renderPageNavigation(printess);
        }
    }
    function _viewPortScroll(printess, _what) {
        var _a, _b, _c, _d, _f, _g, _h, _j, _k, _l, _m;
        if (uih_viewportOffsetTop !== ((_a = window.visualViewport) === null || _a === void 0 ? void 0 : _a.offsetTop) || uih_viewportHeight !== ((_b = window.visualViewport) === null || _b === void 0 ? void 0 : _b.height) || uih_viewportWidth !== ((_c = window.visualViewport) === null || _c === void 0 ? void 0 : _c.width)) {
            console.log("!!!! View-Port-" + _what + "-Event: top=" + ((_d = window.visualViewport) === null || _d === void 0 ? void 0 : _d.offsetTop) + "   Height=" + ((_f = window.visualViewport) === null || _f === void 0 ? void 0 : _f.height), window.visualViewport);
            uih_viewportOffsetTop = (_h = (_g = window.visualViewport) === null || _g === void 0 ? void 0 : _g.offsetTop) !== null && _h !== void 0 ? _h : 0;
            uih_viewportHeight = (_k = (_j = window.visualViewport) === null || _j === void 0 ? void 0 : _j.height) !== null && _k !== void 0 ? _k : 0;
            uih_viewportWidth = (_m = (_l = window.visualViewport) === null || _l === void 0 ? void 0 : _l.width) !== null && _m !== void 0 ? _m : 0;
            const printessDiv = document.getElementById("desktop-printess-container");
            if (printessDiv) {
                if (printess.isMobile()) {
                    printessDiv.style.height = "";
                    resizeMobileUi(printess);
                }
                else {
                    const desktopGrid = document.getElementById("printess-desktop-grid");
                    if (desktopGrid) {
                        if (printess.autoScaleDetails().enabled) {
                            printessDiv.style.height = Math.floor(printess.autoScaleDetails().height - 1) + "px";
                            printessDiv.style.width = Math.floor(printess.autoScaleDetails().width - 1) + "px";
                            printess.resizePrintess();
                        }
                        else {
                            const height = uih_viewportHeight || window.innerHeight;
                            const calcHeight = "calc(" + Math.floor(height) + "px - var(--editor-pagebar-height) - var(--editor-margin-top) - var(--editor-margin-bottom))";
                            printessDiv.style.height = calcHeight;
                            desktopGrid.style.height = height + "px";
                            const desktopProperties = document.getElementById("desktop-properties");
                            const tabsContainer = document.querySelector(".tabs-navigation");
                            if (printess.showTabNavigation() && desktopProperties) {
                                desktopProperties.style.height = calcHeight;
                                if (tabsContainer) {
                                    renderTabsNavigation(printess, tabsContainer, false);
                                }
                            }
                            printess.resizePrintess();
                        }
                    }
                }
            }
        }
    }
    function getActiveFormFieldId() {
        const ele = document.querySelector('.mobile-control-host input[type="text"]');
        if (ele && ele.id && ele.id.startsWith("inp_FF_")) {
            return ele.id.substr(7);
        }
        return undefined;
    }
    function viewPortScrollInIFrame(printess, vpHeight, vpOffsetTop) {
        console.log("!!!! View-Port-Scroll in iFrame: offsetTop=" + vpOffsetTop + "   height=" + vpHeight);
        uih_viewportHeight = vpHeight;
        uih_viewportOffsetTop = vpOffsetTop;
        uih_viewportWidth = window.innerWidth;
        printess.setIFrameViewPort({ offsetTop: vpOffsetTop, height: vpHeight });
        const printessDiv = document.getElementById("desktop-printess-container");
        if (printessDiv) {
            resizeMobileUi(printess);
        }
    }
    function renderDesktopUi(printess, properties = uih_currentProperties, state = uih_currentState, groupSnippets = uih_currentGroupSnippets, layoutSnippets = uih_currentLayoutSnippets, tabs = uih_currentTabs) {
        var _a, _b, _c;
        if (uih_currentRender === "never") {
            if (window.visualViewport && !printess.autoScaleDetails().enabled) {
                uih_viewportHeight = -1;
                _viewPortScroll(printess, "resize");
            }
            else {
                printess.resizePrintess();
            }
        }
        else if (uih_currentRender === "mobile" && printess.autoScaleDetails().enabled) {
            printess.resizePrintess();
        }
        tableEditRowIndex = -1;
        tableEditRow = {};
        uih_currentTabs = tabs;
        uih_currentGroupSnippets = groupSnippets;
        uih_currentLayoutSnippets = layoutSnippets;
        uih_currentState = state;
        uih_currentProperties = properties;
        uih_currentRender = "desktop";
        const mobileUi = document.querySelector(".mobile-ui");
        if (mobileUi) {
            mobileUi.innerHTML = "";
        }
        removeMobileFullscreenContainer();
        const mobilePricebar = document.querySelector(".mobile-pricebar");
        if (mobilePricebar) {
            mobilePricebar.remove();
        }
        const mobilePricebarOpener = document.querySelector(".mobile-price-display-opener");
        if (mobilePricebarOpener) {
            mobilePricebarOpener.remove();
        }
        const printessDiv = document.getElementById("desktop-printess-container");
        const container = document.getElementById("desktop-properties");
        if (!container || !printessDiv) {
            throw new Error("#desktop-properties or #desktop-printess-container not found, please add to html.");
        }
        if (!uih_scrollHandlerApplied) {
            container.addEventListener("scroll", () => {
                const hash = uih_currentTabId;
                const sp = container.scrollTop;
                if (uih_scrollPositions.has(hash) && sp === 0) {
                }
                else {
                    uih_scrollPositions.set(hash, sp);
                }
            });
        }
        const isPageIconsNavigation = printess.pageNavigationDisplay() === "icons";
        const isDocTabs = printess.pageNavigationDisplay() === "doc-tabs";
        const isStepTabsList = printess.stepHeaderDisplay() === "tabs list";
        const isStepBadgeList = printess.stepHeaderDisplay() === "badge list";
        if (isStepTabsList || isDocTabs || isPageIconsNavigation) {
            container.classList.add("move-down");
        }
        else {
            container.classList.remove("move-down");
        }
        printessDiv.style.position = "relative";
        printessDiv.style.top = "";
        printessDiv.style.left = "";
        printessDiv.style.bottom = "";
        printessDiv.style.right = "";
        container.innerHTML = "";
        container.style.height = "-webkit-fill-available";
        let t = [];
        const nav = getMobileNavbarDiv();
        if (nav)
            (_a = nav.parentElement) === null || _a === void 0 ? void 0 : _a.removeChild(nav);
        renderPageNavigation(printess);
        let desktopTitleOrSteps = document.querySelector("div.desktop-title-or-steps");
        if (!desktopTitleOrSteps) {
            desktopTitleOrSteps = document.createElement("div");
            desktopTitleOrSteps.className = "desktop-title-or-steps";
        }
        else {
            desktopTitleOrSteps.innerHTML = "";
        }
        if (!isPageIconsNavigation && !isStepTabsList && !isStepBadgeList && !isDocTabs) {
            if (printess.hasSteps()) {
                const desktopStepsUi = getDesktopStepsUi(printess);
                if (printess.showTabNavigation()) {
                    desktopTitleOrSteps.appendChild(desktopStepsUi);
                }
                else {
                    container.appendChild(desktopStepsUi);
                }
            }
            else {
                const desktopTitle = getDesktopTitle(printess);
                if (printess.showTabNavigation()) {
                    desktopTitleOrSteps.appendChild(desktopTitle);
                }
                else {
                    container.appendChild(desktopTitle);
                }
            }
        }
        if (printess.hasPreviewBackButton() && !printess.showTabNavigation()) {
            printessDiv.classList.add("preview-fullwidth-grid");
            printess.resizePrintess();
        }
        else if (printessDiv.classList.contains("preview-fullwidth-grid")) {
            printessDiv.classList.remove("preview-fullwidth-grid");
            printess.resizePrintess();
        }
        adjustDesktopView(printess, desktopTitleOrSteps, container, printessDiv, state);
        container.style.padding = "10px";
        if (printess.hasSelection()) {
            setStorageItemSafe("editableFrames", "hint closed");
            const framePulse = document.getElementById("frame-pulse");
            if (framePulse)
                (_b = framePulse.parentElement) === null || _b === void 0 ? void 0 : _b.removeChild(framePulse);
        }
        const layoutSnippetAmount = printess.hasSnippetMenu("layout") ? 1 : layoutSnippets.map(ls => ls.snippets.length).reduce((prev, curr) => prev + curr, 0);
        const layoutsButton = document.querySelector(".show-layouts-button");
        if (layoutsButton) {
            layoutsButton.textContent = printess.gl("ui.changeLayout");
            if (printess.showTabNavigation()) {
                layoutsButton.style.visibility = "hidden";
            }
            else if (layoutSnippetAmount > 0) {
                layoutsButton.style.visibility = "visible";
            }
        }
        renderUiButtonHints(printess, document.body, state, false);
        renderEditableFramesHint(printess);
        const printessBuyerPropertiesButton = document.getElementById("printessBuyerPropertiesButton");
        if (printessBuyerPropertiesButton) {
            if (printess.hasPreviewBackButton()) {
                printessBuyerPropertiesButton.style.display = "none";
            }
            else {
                printessBuyerPropertiesButton.style.display = "block";
            }
        }
        if (!printess.hasSnippetMenu("layout")) {
            if (!uih_layoutSelectionDialogHasBeenRendered && layoutSnippetAmount > 0 && printess.showLayoutsDialog()) {
                uih_layoutSelectionDialogHasBeenRendered = true;
                renderLayoutSelectionDialog(printess, layoutSnippets, false);
            }
        }
        else if (printess.selectLayoutsTabOneTime()) {
            window.setTimeout(() => {
                const layoutTab = document.querySelector('[data-tabid="#LAYOUTS"]');
                if (layoutTab)
                    layoutTab.click();
            }, 1000);
        }
        if (state === "document" && printess.hasLayoutSnippets() && !getStorageItemSafe("changeLayout") && !printess.showTabNavigation()) {
            toggleChangeLayoutButtonHint();
        }
        uih_currentTabId = printess.validateCurrentTabId(uih_currentTabId);
        const externalLayoutsContainer = document.getElementById("external-layouts-container");
        if (externalLayoutsContainer && (uih_currentTabId !== "#LAYOUTS" || layoutSnippetAmount === 0)) {
            externalLayoutsContainer.style.display = "none";
        }
        if (!printess.showTabNavigation() && layoutSnippetAmount > 0) {
            handleOffcanvasLayoutsContainer(printess, false);
        }
        if (printess.showTabNavigation()) {
            const newTab = getFormFieldTab(properties);
            if (newTab && newTab !== uih_currentTabId) {
                selectTab(printess, false, newTab);
            }
        }
        if (printess.hasPreviewBackButton()) {
        }
        else if (state === "document") {
            const propsDiv = document.createElement("div");
            const props = getProperties(printess, state, properties, propsDiv);
            t = t.concat(props);
            if (printess.hasBackground() && !printess.showTabNavigation()) {
                propsDiv.appendChild(getChangeBackgroundButton(printess));
            }
            if (printess.showTabNavigation()) {
                container.style.padding = "10px";
                if (uih_currentTabId === "#LAYOUTS" && printess.hasSnippetMenu("layout")) {
                    container.classList.add("keyword-menu");
                }
                else {
                    container.classList.remove("keyword-menu");
                }
                if (uih_currentTabId) {
                    container.appendChild(getPropertiesTitle(printess));
                    if (uih_currentTabId.startsWith("#FORMFIELDS")) {
                        container.appendChild(propsDiv);
                    }
                    else if (uih_currentTabId === "#LAYOUTS" && layoutSnippetAmount === 0 && !((_c = window.uiHelper) === null || _c === void 0 ? void 0 : _c.customLayoutSnippetRenderCallback)) {
                        uih_currentTabId = printess.getInitialTabId();
                        renderTabNavigationProperties(printess, container, false);
                    }
                    else {
                        renderTabNavigationProperties(printess, container, false);
                    }
                }
                else {
                    container.appendChild(propsDiv);
                }
            }
            else {
                container.appendChild(propsDiv);
                container.appendChild(renderGroupSnippets(printess, groupSnippets, false));
            }
            if (printess.showTabNavigation() && printess.stepHeaderDisplay() === "tabs list") {
            }
            else if (printess.hasSteps()) {
                container.appendChild(getDoneButton(printess));
            }
        }
        else {
            container.classList.remove("keyword-menu");
            const isTextSplitterMenu = printess.hasSplitterMenu() && properties.length && properties[0].kind !== "image";
            const renderPhotoTabForEmptyImage = false;
            if (!getStorageItemSafe("splitter-frame-hint") && printess.hasSplitterMenu() && printess.uiHintsDisplay().includes("splitterGuide")) {
                const edges = printess.splitterEdgesCount();
                const isImage = properties.filter(p => p.imageMeta).length > 0;
                if (isImage && edges > 0) {
                    showSplitterGuide(printess, properties[0], false);
                    setStorageItemSafe("splitter-frame-hint", "hint displayed");
                }
            }
            if (isTextSplitterMenu) {
                const tabsDiv = document.createElement("div");
                const tabs = [];
                const propsDiv = document.createElement("div");
                getProperties(printess, state, properties, propsDiv);
                tabs.push({ id: "printess-splitter-props", title: printess.gl("ui.tabTextAndColor"), content: propsDiv });
                if (printess.hasSplitterTextSnippets()) {
                    tabs.push({ id: "printess-splitter-layouts", title: printess.gl("ui.changeLayout"), content: getSplitterSnippetsControl(printess, properties[0]) });
                }
                const tabPanel = getTabPanel(printess, tabs, "printess-splitter");
                tabsDiv.appendChild(tabPanel);
                if (printess.showTabNavigation()) {
                    container.appendChild(getPropertiesTitle(printess));
                }
                container.appendChild(tabsDiv);
            }
            else if (renderPhotoTabForEmptyImage) {
                container.appendChild(getPropertiesTitle(printess));
                renderTabNavigationProperties(printess, container, false);
            }
            else {
                if (printess.showTabNavigation()) {
                    container.appendChild(getPropertiesTitle(printess));
                }
                if (state === "text") {
                    if (!printess.isTextEditorOpen() && printess.showEnterTextEditorButton()) {
                        const textEditInfo = document.createElement("p");
                        textEditInfo.textContent = printess.gl("ui.editTextButtonInfo");
                        const textEditBtn = document.createElement("button");
                        textEditBtn.className = "btn btn-primary mt-2 d-flex align-items-center";
                        textEditBtn.style.width = "fit-content";
                        const icon = printess.getIcon("pen-solid");
                        icon.classList.add("me-2");
                        icon.style.width = "16px";
                        icon.style.height = "16px";
                        const span = document.createElement("span");
                        span.textContent = printess.gl("ui.editTextButton");
                        textEditBtn.appendChild(icon);
                        textEditBtn.appendChild(span);
                        textEditBtn.onclick = () => {
                            printess.showTextEditor();
                        };
                        container.appendChild(textEditInfo);
                        container.appendChild(textEditBtn);
                    }
                }
                const props = getProperties(printess, state, properties, container);
                t = t.concat(props);
            }
            if (properties.length === 0 && state !== "text") {
                if (!printess.showTabNavigation()) {
                    container.appendChild(renderGroupSnippets(printess, groupSnippets, false));
                }
            }
            else if (renderPhotoTabForEmptyImage || (printess.showTabNavigation() && printess.stepHeaderDisplay() === "tabs list")) {
            }
            else {
                if (printess.hasSteps() || !printess.showTabNavigation()) {
                    const hr = document.createElement("hr");
                    container.appendChild(hr);
                }
                container.appendChild(getDoneButton(printess));
            }
        }
        if (printess.zoomToFrames()) {
            const lastZoomMode = printess.getZoomMode();
            printess.setZoomMode(printess.isTextEditorOpen() ? "frame" : "spread");
            if (lastZoomMode === "frame" || printess.getZoomMode() === "frame") {
                printess.centerSelection();
            }
        }
        setPropertyVisibilities(printess);
        return t;
    }
    function showSplitterGuide(printess, p, forMobile) {
        const id = "splitter-guide-overlay";
        const content = document.createElement("div");
        content.className = "carousel carousel-dark slide";
        content.id = "splitterGuideCarousel";
        content.setAttribute("data-bs-interval", "false");
        const steps = [
            {
                idx: 0,
                label: printess.gl("ui.createImages"),
                img: printess.getResourcePath() + "/img/gifs/Splitter-Cut-Gif.gif",
                text: printess.gl("ui.createSplitterImagesInfo"),
            }, {
                idx: 1,
                label: printess.gl("ui.removeImages"),
                img: printess.getResourcePath() + "/img/gifs/Splitter-Join-Gif.gif",
                text: printess.gl("ui.removeSplitterImageInfo")
            }, {
                idx: 2,
                label: printess.gl("ui.adjustGap"),
                img: printess.getResourcePath() + "/img/gifs/Splitter-Gap-Gif.gif",
                text: printess.gl("ui.adjustGapInfo")
            }, {
                idx: 3,
                label: printess.gl("ui.addText"),
                img: printess.getResourcePath() + "/img/gifs/Splitter-Text-Gif.gif",
                text: printess.gl("ui.addSplitterTextInfo")
            }
        ];
        const indicatorsDiv = document.createElement("div");
        indicatorsDiv.className = "carousel-indicators";
        steps.forEach(step => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.setAttribute("data-bs-target", "#splitterGuideCarousel");
            btn.setAttribute("data-bs-slide-to", step.idx.toString());
            btn.ariaLabel = "Slide " + step.idx;
            if (step.idx === 0) {
                btn.classList.add("active");
                btn.ariaCurrent = "true";
            }
            indicatorsDiv.appendChild(btn);
        });
        content.appendChild(indicatorsDiv);
        const slidesDiv = document.createElement("div");
        slidesDiv.className = "carousel-inner";
        steps.forEach(step => {
            const item = document.createElement("div");
            item.className = "carousel-item";
            item.setAttribute("data-bs-interval", "false");
            item.setAttribute("data-pause", "true");
            if (step.idx === 0) {
                item.classList.add("active");
            }
            const imgWrapper = document.createElement("div");
            imgWrapper.style.width = "600px";
            imgWrapper.style.height = "450px";
            const img = document.createElement("img");
            img.src = step.img;
            img.className = "d-block";
            img.alt = step.label;
            const text = document.createElement("div");
            text.className = "carousel-caption d-md-block";
            const header = document.createElement("h3");
            const badge = document.createElement("span");
            badge.className = "badge rounded-pill bg-primary";
            badge.style.verticalAlign = "bottom";
            badge.style.marginRight = "10px";
            badge.textContent = (step.idx + 1).toString();
            header.appendChild(badge);
            header.appendChild(document.createTextNode(step.label));
            const subheader = document.createElement("p");
            subheader.textContent = step.text;
            text.appendChild(header);
            text.appendChild(subheader);
            if (forMobile) {
                item.appendChild(img);
            }
            else {
                imgWrapper.appendChild(img);
                item.appendChild(imgWrapper);
            }
            item.appendChild(text);
            slidesDiv.appendChild(item);
        });
        content.appendChild(slidesDiv);
        const prevBtn = getCarouselControlButton(printess, "prev");
        const nextBtn = getCarouselControlButton(printess, "next");
        content.appendChild(prevBtn);
        content.appendChild(nextBtn);
        const footer = document.createElement("div");
        footer.className = "modal-footer";
        const closeBtn = document.createElement("button");
        closeBtn.className = "btn btn-primary";
        closeBtn.textContent = printess.gl("ui.buttonGotIt");
        closeBtn.onclick = () => {
            hideModal(id);
        };
        footer.appendChild(closeBtn);
        if (forMobile) {
            renderMobileDialogFullscreen(printess, p.id, "ui.photoGridHeader", content, false);
        }
        else {
            showModal(printess, id, content, printess.gl("ui.photoGridHeader"), footer);
        }
    }
    function getCarouselControlButton(printess, type) {
        const btn = document.createElement("button");
        btn.className = "carousel-control-" + type;
        btn.setAttribute("data-bs-target", "#splitterGuideCarousel");
        btn.setAttribute("data-bs-slide", type);
        const icon = document.createElement("span");
        icon.className = "carousel-control-" + type + "-icon";
        icon.ariaHidden = "true";
        const text = document.createElement("span");
        text.className = "visually-hidden";
        text.textContent = type === "prev" ? printess.gl("ui.previous") : printess.gl("ui.next");
        btn.appendChild(icon);
        btn.appendChild(text);
        return btn;
    }
    function getFormFieldTab(properties) {
        if (!uih_currentTabId.startsWith("#FORMFIELDS") && !uih_currentTabId.startsWith("#NONE")) {
            return null;
        }
        const ffProps = properties.filter(p => p.id.startsWith("FF_"));
        const ffTabs = new Set();
        if (ffProps.length === properties.length && ffProps.length > 0) {
            for (const ffProp of ffProps) {
                if (ffProp.tabId) {
                    ffTabs.add(ffProp.tabId);
                }
                else {
                    ffTabs.add("#FORMFIELDS");
                }
            }
            if (ffTabs.size === 1) {
                return ffTabs.values().next().value;
            }
        }
        return null;
    }
    function getProperties(printess, state = uih_currentState, properties, propsDiv) {
        const t = [];
        let controlGroup = 0;
        let controlGroupDiv = null;
        let controlGroupTCs = "";
        let colorsContainer = null;
        for (const p of properties) {
            if (printess.showTabNavigation()) {
                if (p.tabId && uih_currentTabId && uih_currentTabId.startsWith("#FORMFIELDS") && p.tabId !== uih_currentTabId) {
                    continue;
                }
                if (!p.tabId && (uih_currentTabId === "#FORMFIELDS1" || uih_currentTabId === "#FORMFIELDS2")) {
                    continue;
                }
            }
            t.push(JSON.stringify(p, undefined, 2));
            const mixedColorTypes = p.kind === "color" && p.id.startsWith("FF_") && uih_currentProperties.filter(p => p.kind === "color" && !p.id.startsWith("FF_")).length > 0;
            if (p.kind === "color" && !p.id.startsWith("FF_") && state !== "document" || mixedColorTypes) {
                const twoColorProps = uih_currentProperties.length === 2 && uih_currentProperties.filter(p => p.kind === "color").length === 2 && printess.enableCustomColors();
                if (!colorsContainer) {
                    colorsContainer = document.createElement("div");
                    colorsContainer.className = "color-drop-down-list mb-3";
                    if (twoColorProps) {
                        colorsContainer.style.flexDirection = "column";
                    }
                    propsDiv.appendChild(colorsContainer);
                }
                if (twoColorProps) {
                    const label = document.createElement("span");
                    label.className = "mb-2";
                    label.innerText = printess.gl("ui.color") + " " + (uih_currentProperties.findIndex(cp => cp.id === p.id) + 1);
                    colorsContainer.appendChild(label);
                }
                colorsContainer.appendChild(getPropertyControl(printess, p));
            }
            else {
                colorsContainer = null;
                if (controlGroupDiv && p.controlGroup === controlGroup) {
                    controlGroupTCs += " " + getControlGroupWidth(p);
                    controlGroupDiv.appendChild(getPropertyControl(printess, p));
                }
                else {
                    if (controlGroupDiv) {
                        propsDiv.appendChild(controlGroupDiv);
                        controlGroupDiv.style.gridTemplateColumns = controlGroupTCs;
                        controlGroupDiv = null;
                        controlGroup = 0;
                    }
                    if (p.controlGroup) {
                        controlGroup = p.controlGroup;
                        controlGroupDiv = document.createElement("div");
                        controlGroupDiv.className = "control-group";
                        controlGroupTCs = getControlGroupWidth(p);
                        controlGroupDiv.appendChild(getPropertyControl(printess, p));
                    }
                    else {
                        propsDiv.appendChild(getPropertyControl(printess, p));
                    }
                }
            }
        }
        if (controlGroupDiv) {
            propsDiv.appendChild(controlGroupDiv);
            controlGroupDiv.style.gridTemplateColumns = controlGroupTCs;
            controlGroupDiv = null;
            controlGroup = 0;
        }
        return t;
    }
    function handleOffcanvasLayoutsContainer(printess, forMobile) {
        const layoutsDiv = document.getElementById("layoutSnippets");
        if (layoutsDiv && printess.hasSnippetMenu("layout")) {
            layoutsDiv.style.padding = "0px";
        }
        const currentSnippets = uih_currentLayoutSnippets.map(g => g.name + "_" + g.snippets.length).join("|");
        const previousSnippets = uih_previousLayoutSnippets.map(g => g.name + "_" + g.snippets.length).join("|");
        const snippetsChanged = currentSnippets !== previousSnippets;
        if (layoutsDiv && snippetsChanged) {
            layoutsDiv.innerHTML = "";
            layoutsDiv.scrollTop = 0;
            layoutsDiv.appendChild(renderLayoutSnippets(printess, uih_currentLayoutSnippets, forMobile, false));
        }
        const showLayoutsButton = document.querySelector(".show-layouts-button");
        if (showLayoutsButton)
            showLayoutsButton.style.visibility = "visible";
    }
    function getExternalSnippetsContainer(printess, forMobile) {
        let layoutsDiv = document.getElementById("external-layouts-container");
        const currentSnippets = uih_currentLayoutSnippets.map(g => g.name + "_" + g.snippets.length).join("|");
        const previousSnippets = uih_previousLayoutSnippets.map(g => g.name + "_" + g.snippets.length).join("|");
        const snippetsChanged = currentSnippets !== previousSnippets;
        if (!layoutsDiv) {
            uih_previousLayoutSnippets = uih_currentLayoutSnippets;
            layoutsDiv = document.createElement("div");
            layoutsDiv.id = "external-layouts-container";
            const titleDiv = getPropertiesTitle(printess, true);
            const content = renderLayoutSnippets(printess, uih_currentLayoutSnippets, forMobile, false);
            if (!forMobile)
                layoutsDiv.appendChild(titleDiv);
            layoutsDiv.appendChild(content);
            document.body.appendChild(layoutsDiv);
        }
        else if (snippetsChanged && layoutsDiv) {
            uih_previousLayoutSnippets = uih_currentLayoutSnippets;
            layoutsDiv.innerHTML = "";
            const titleDiv = getPropertiesTitle(printess, true);
            const content = renderLayoutSnippets(printess, uih_currentLayoutSnippets, forMobile, false);
            if (!forMobile)
                layoutsDiv.appendChild(titleDiv);
            layoutsDiv.appendChild(content);
        }
        const layoutSnippetAmount = printess.hasSnippetMenu("layout") ? 1 : uih_currentLayoutSnippets.map(ls => ls.snippets.length).reduce((prev, curr) => prev + curr, 0);
        if (layoutSnippetAmount === 0) {
            layoutsDiv.style.display = "none";
        }
        else if (!forMobile) {
            layoutsDiv.style.display = "block";
        }
    }
    function removeExternalSnippetsContainer() {
        const layoutsDiv = document.getElementById("external-layouts-container");
        if (layoutsDiv)
            layoutsDiv.remove();
    }
    function getControlGroupWidth(p) {
        var _a, _b;
        if (p.kind === "label") {
            return "auto";
        }
        else if ((_a = p.validation) === null || _a === void 0 ? void 0 : _a.maxChars) {
            return ((_b = p.validation) === null || _b === void 0 ? void 0 : _b.maxChars) + "fr ";
        }
        else if (p.listMeta && p.listMeta.list && p.listMeta.list.length > 0) {
            let c = 1;
            for (const itm of p.listMeta.list) {
                c = c < itm.label.length ? itm.label.length : c;
            }
            return (c) + "fr ";
        }
        else {
            return "10fr ";
        }
    }
    function getBuyerOverlayType(printess, properties) {
        const isSingleLineText = properties.filter(p => p.kind === "single-line-text").length > 0;
        const isImage = properties.filter(p => p.kind === "image").length > 0;
        const isColor = properties.filter(p => p.kind === "color").length > 0;
        const isStory = properties.filter(p => p.kind === "multi-line-text" || p.kind === "selection-text-style").length > 0;
        const hasFont = properties.filter(p => p.kind === "font").length > 0;
        const isLabel = properties.filter(p => p.kind === "label").length > 0;
        const isText = hasFont || isSingleLineText || isStory || properties.length === 0;
        if (isText && isImage) {
            return printess.gl("ui.tabStickers");
        }
        else if (isText) {
            return printess.gl("ui.textFrame");
        }
        else if (isImage) {
            return printess.gl("ui.photoFrame");
        }
        else if (isColor) {
            return printess.gl("ui.color");
        }
        else if (isLabel) {
            return printess.gl("ui.infoFrame");
        }
        return "Sticker";
    }
    function getDesktopTabsContainer(printessDesktopGrid) {
        let tabsContainer = document.querySelector("div.tabs-navigation");
        if (!tabsContainer) {
            tabsContainer = document.createElement("div");
            tabsContainer.className = "tabs-navigation";
            printessDesktopGrid.appendChild(tabsContainer);
        }
        return tabsContainer;
    }
    function removeDesktopTabsContainer() {
        const tabsContainer = document.querySelector("div.tabs-navigation");
        if (tabsContainer && tabsContainer.parentElement) {
            tabsContainer.parentElement.removeChild(tabsContainer);
        }
    }
    function adjustDesktopView(printess, desktopTitleOrSteps, propsContainer, printessDiv, state) {
        var _a;
        if (printess.showTabNavigation()) {
            if (printess.hasPreviewBackButton()) {
                printessDiv.classList.add("preview-grid");
                propsContainer.style.display = "none";
            }
            else {
                printessDiv.classList.remove("preview-grid");
                propsContainer.style.display = "flex";
                propsContainer.style.height = "100%";
            }
            if (uih_currentTabId === "LOADING" || (uih_currentTabId === "#PHOTOS" && !printess.showPhotoTab())) {
                uih_currentTabId = printess.getInitialTabId();
            }
            if (uih_currentTabId === "#LAYOUTS") {
                setStorageItemSafe("changeLayout", "hint closed");
            }
            const printessDesktopGrid = document.getElementById("printess-desktop-grid");
            if (printessDesktopGrid) {
                printessDesktopGrid.classList.add("main-tabs");
                if (printess.stepHeaderDisplay() !== "tabs list" && printess.pageNavigationDisplay() !== "icons" && printess.pageNavigationDisplay() !== "doc-tabs") {
                    printessDesktopGrid.appendChild(desktopTitleOrSteps);
                }
                else {
                    const desktopTitle = document.querySelector("div.desktop-title-or-steps");
                    if (desktopTitle)
                        printessDesktopGrid.removeChild(desktopTitle);
                }
                const tabsContainer = getDesktopTabsContainer(printessDesktopGrid);
                const isBackgroundSelected = printess.isBackgroundSelected();
                if (isBackgroundSelected) {
                    uih_currentTabId = "#BACKGROUND";
                }
                else {
                    if (uih_currentTabId === "#BACKGROUND") {
                        uih_currentTabId = "#NONE";
                    }
                    if (uih_currentTabId === "#NONE" && (state === "document" || uih_currentProperties.length === 0)) {
                        uih_currentTabId = printess.getInitialTabId();
                    }
                    if (state === "document" && uih_currentTabId === "#NONE") {
                        if (uih_currentProperties.length) {
                            uih_currentTabId = "#FORMFIELDS";
                        }
                        else {
                            uih_currentTabId = printess.getInitialTabId();
                        }
                    }
                    if (state === "text" || (state === "frames" && uih_currentProperties.length)) {
                        uih_currentTabId = "#NONE";
                    }
                    if (uih_currentProperties.length === 1 && uih_currentProperties[0].kind === "image") {
                        const p = uih_currentProperties[0];
                        if (p.value === ((_a = p.validation) === null || _a === void 0 ? void 0 : _a.defaultValue)) {
                        }
                    }
                }
                renderTabsNavigation(printess, tabsContainer, false);
            }
        }
        else {
            removeDesktopTabsNavigation();
        }
    }
    function removeDesktopTabsNavigation() {
        const printessDesktopGrid = document.getElementById("printess-desktop-grid");
        if (printessDesktopGrid === null || printessDesktopGrid === void 0 ? void 0 : printessDesktopGrid.classList.contains("main-tabs")) {
            printessDesktopGrid.classList.remove("main-tabs");
            removeDesktopTabsContainer();
            const desktopTitle = document.querySelector(".desktop-title-or-steps");
            if (desktopTitle === null || desktopTitle === void 0 ? void 0 : desktopTitle.parentElement) {
                desktopTitle.parentElement.removeChild(desktopTitle);
            }
        }
    }
    function getSelectedTab() {
        return uih_currentTabs.filter(t => t.id === uih_currentTabId)[0] || null;
    }
    function selectTab(printess, forMobile, newTabId = "", openTab = false) {
        if (printess.showTabNavigation()) {
            if (newTabId === "") {
                newTabId = printess.getInitialTabId();
            }
            if (newTabId === "#NONE") {
                newTabId = "";
            }
            if (newTabId === "#BACKGROUND") {
                return;
            }
            document.querySelectorAll("div.tabs-navigation li.nav-item.selected").forEach(i => i.classList.remove("selected"));
            if (newTabId) {
                document.querySelectorAll('div.selectable-tabs-navigation li.nav-item[data-tabid="' + newTabId.replace("\\n", " ") + '"]').forEach(i => i.classList.add("selected"));
                ;
            }
            if (uih_currentTabId !== newTabId) {
                const content = document.querySelector("#desktop-properties");
                if (content && content.style.padding === "0px") {
                    content.style.padding = "10px 10px 0 10px";
                }
                uih_currentTabId = newTabId;
                if (printess.showMobileTabNavigation() && mobileTabNavigationActive(forMobile)) {
                    renderMobilePropertiesFullscreen(printess, "add-design", "open");
                }
            }
        }
    }
    function getPropertiesTitle(printess, forExternalLayoutsContainer = false) {
        const currentTab = uih_currentTabs.filter(t => t.id === uih_currentTabId)[0] || "";
        if (currentTab.id === "#LAYOUTS" && !forExternalLayoutsContainer) {
            return document.createElement("div");
        }
        if (isStickerTabSelected() && !forExternalLayoutsContainer) {
            return document.createElement("div");
        }
        const hasFormFieldTab = uih_currentTabs.filter(t => t.id === "#FORMFIELDS").length > 0;
        const titleDiv = document.createElement("div");
        titleDiv.className = "properties-title";
        titleDiv.classList.add("only-title");
        const title = document.createElement("h3");
        let caption = "";
        if (forExternalLayoutsContainer) {
            caption = printess.gl("ui.changeLayout");
        }
        else if (uih_currentState === "text") {
            caption = printess.gl("ui.textFrame");
        }
        else if (uih_currentState === "frames") {
            caption = getBuyerOverlayType(printess, uih_currentProperties);
        }
        else if (currentTab) {
            caption = currentTab.head || currentTab.caption;
        }
        title.textContent = caption.replace(/\\n/g, "");
        titleDiv.appendChild(title);
        if (printess.hasSplitterMenu()) {
            const icon = printess.getIcon("info-circle");
            icon.style.width = "25px";
            icon.style.height = "25px";
            icon.style.color = "var(--bs-primary)";
            icon.style.cursor = "pointer";
            icon.onclick = () => {
                showSplitterGuide(printess, uih_currentProperties[0], uih_currentRender === "mobile");
            };
            titleDiv.appendChild(icon);
            titleDiv.style.display = "flex";
        }
        return titleDiv;
    }
    function renderTabsNavigation(printess, tabsContainer, forMobile, isMobileNavBar = false) {
        var _a, _b;
        let tabs = uih_currentTabs;
        tabsContainer.innerHTML = "";
        let selected = getSelectedTab();
        const tabsToolbar = document.createElement("ul");
        tabsToolbar.className = "nav";
        if (!isMobileNavBar) {
            tabsContainer.classList.add("selectable-tabs-navigation");
        }
        if (tabs.findIndex(t => t.id === "#PHOTOS") >= 0 && !printess.showPhotoTab()) {
            tabs = tabs.filter(t => t.id !== "#PHOTOS");
        }
        if (!forMobile) {
            if (selected && tabs.filter(t => t.id === (selected === null || selected === void 0 ? void 0 : selected.id)).length === 0) {
                const newTabId = (_b = (_a = tabs[0]) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : "#NONE";
                selectTab(printess, forMobile, newTabId);
                selected = getSelectedTab();
            }
        }
        if (tabs.length > 2 && !forMobile && tabsContainer.clientHeight - (120 * tabs.length) < 100) {
            tabsToolbar.style.height = "100%";
            tabsToolbar.style.justifyContent = "space-between";
        }
        for (const t of tabs) {
            if (t.id === "#PHOTOS" && !printess.showPhotoTab())
                continue;
            const mobileTabBar = printess.showMobileTabNavigation();
            if ((forMobile && !mobileTabBar) && (t.id === "#BACKGROUND" || t.id.startsWith("#FORMFIELDS")))
                continue;
            const tabItem = document.createElement("li");
            tabItem.className = "nav-item";
            tabItem.dataset.tabid = t.id.replace("\\n", " ");
            if (!isMobileNavBar && (selected === null || selected === void 0 ? void 0 : selected.id) === t.id) {
                tabItem.classList.add("selected");
            }
            tabItem.style.maxHeight = forMobile ? "unset" : tabsContainer.clientHeight / tabs.length + "px";
            tabItem.onclick = () => {
                if (t.id === "#BACKGROUND") {
                    closeLayoutOverlays(printess, true);
                    printess.selectBackground();
                    const content = document.querySelector("#desktop-properties");
                    if (content && content.style.padding === "0px") {
                        content.style.padding = "10px 10px 0 10px";
                    }
                    return;
                }
                const inButtonBarView = mobileTabNavigationActive(forMobile);
                if (inButtonBarView && t.id !== "#BACKGROUND") {
                    uih_currentTabId = t.id;
                    renderMobilePropertiesFullscreen(printess, "add-design", "open");
                }
                selectTab(printess, forMobile, t.id);
                if (!inButtonBarView) {
                    printess.clearSelection();
                }
                const externalLayoutsContainer = document.getElementById("external-layouts-container");
                if (externalLayoutsContainer && forMobile) {
                    externalLayoutsContainer.classList.remove("open-external-layouts-container");
                    if (t.id === "#LAYOUTS") {
                        externalLayoutsContainer.classList.add("show-external-layouts-container");
                    }
                    else {
                        externalLayoutsContainer.classList.remove("show-external-layouts-container");
                    }
                }
            };
            const iconName = printess.gl(t.icon);
            const tabIcon = printess.getIcon(iconName);
            tabIcon.classList.add("desktop-tab-icon");
            const tabLink = document.createElement("a");
            tabLink.className = "nav-link " + ((selected === null || selected === void 0 ? void 0 : selected.id) === t.id ? "active" : "");
            tabLink.innerHTML = t.caption.replace(/\\n/g, "<br>");
            tabItem.appendChild(tabIcon);
            if (forMobile || tabsContainer.clientHeight / tabs.length > 100) {
                tabItem.appendChild(tabLink);
            }
            else {
                tabIcon.style.marginBottom = "10px";
            }
            tabsToolbar.appendChild(tabItem);
        }
        tabsContainer.appendChild(tabsToolbar);
    }
    function mobileTabNavigationActive(forMobile) {
        if (!forMobile)
            return false;
        const mobileOverlay = document.querySelector(".fullscreen-add-properties");
        return forMobile && (!mobileOverlay || mobileOverlay.classList.contains("hide-image-list"));
    }
    function renderTabNavigationProperties(printess, container, forMobile) {
        if (forMobile) {
            addMobileOverlayPaddings();
        }
        switch (uih_currentTabId) {
            case "#PHOTOS": {
                const tabs = [{ title: printess.gl("ui.selectImage"), id: "select-images", content: renderMyImagesTab(printess, forMobile, undefined, undefined, undefined, printess.showSearchBar(), true) }];
                const groupSnippets = uih_currentGroupSnippets.filter(gs => gs.tabId === "#PHOTOS");
                if (groupSnippets.length) {
                    tabs.push({ title: printess.gl("ui.addPhotoFrame"), id: "photo-frames", content: renderGroupSnippets(printess, groupSnippets, forMobile) });
                    container.appendChild(getTabPanel(printess, tabs, "photo-frames"));
                    recallCurTabScrollPosition(container);
                }
                else {
                    container.appendChild(renderMyImagesTab(printess, forMobile, undefined, undefined, undefined, printess.showSearchBar(), true));
                }
                break;
            }
            case "#LAYOUTS": {
                if (window.uiHelper.customLayoutSnippetRenderCallback) {
                    getExternalSnippetsContainer(printess, forMobile);
                }
                else {
                    removeExternalSnippetsContainer();
                    const currentSnippets = uih_currentLayoutSnippets.map(g => g.name + "_" + g.snippets.length).join("|");
                    const previousSnippets = uih_previousLayoutSnippets.map(g => g.name + "_" + g.snippets.length).join("|");
                    if (currentSnippets !== previousSnippets) {
                        uih_previousLayoutSnippets = uih_currentLayoutSnippets;
                        resetCurTabScrollPosition();
                    }
                    const layoutsDiv = renderLayoutSnippets(printess, uih_currentLayoutSnippets, forMobile);
                    container.appendChild(layoutsDiv);
                    container.style.padding = "0px";
                    recallCurTabScrollPosition(container);
                }
                break;
            }
            case "#BACKGROUND": {
                printess.selectBackground();
                break;
            }
            case "#FORMFIELDS":
            case "#FORMFIELDS1":
            case "#FORMFIELDS2":
                if (forMobile && printess.showMobileTabNavigation()) {
                    const propsDiv = document.createElement("div");
                    const props = getProperties(printess, uih_currentState, uih_currentProperties, propsDiv);
                    const doneButton = document.createElement("button");
                    doneButton.className = "btn btn-primary mb-3";
                    doneButton.innerText = printess.gl("ui.buttonDone");
                    doneButton.onclick = () => {
                        closeLayoutOverlays(printess, true);
                    };
                    propsDiv.appendChild(doneButton);
                    container.appendChild(propsDiv);
                }
                break;
            default: {
                const layoutHint = document.getElementById("ui-hint-changeLayout");
                if (layoutHint)
                    layoutHint.remove();
                const groupSnippets = uih_currentGroupSnippets.filter(gs => gs.tabId === uih_currentTabId);
                if (groupSnippets.length) {
                    const snippetsDiv = renderGroupSnippets(printess, groupSnippets, forMobile);
                    container.appendChild(snippetsDiv);
                    recallCurTabScrollPosition(container);
                }
                break;
            }
        }
    }
    function isStickerTabSelected() {
        switch (uih_currentTabId) {
            case "#PHOTOS":
            case "#LAYOUTS":
            case "#BACKGROUND":
            case "#FORMFIELDS":
            case "#FORMFIELDS1":
            case "#FORMFIELDS2":
                return false;
            default: {
                return true;
            }
        }
    }
    function recallCurTabScrollPosition(container) {
        const s = uih_scrollPositions.get(uih_currentTabId);
        if (s !== undefined) {
            container = container || document.getElementById("desktop-properties");
            if (container) {
                if (s <= container.scrollHeight) {
                    container.scrollTop = s;
                }
                else {
                    window.setTimeout(() => {
                        if (container) {
                            container.scrollTo({ top: s, behavior: 'smooth' });
                        }
                    }, 500);
                }
            }
        }
    }
    function resetCurTabScrollPosition() {
        uih_scrollPositions.set(uih_currentTabId, 0);
    }
    function getPropertyControl(printess, p, metaProperty, forMobile = false) {
        var _a, _b, _c, _d, _f, _g, _h, _j, _k, _l, _m, _o, _q;
        switch (p.kind) {
            case "label":
                return getSimpleLabel(printess, p, p.label, p.controlGroup > 0, forMobile);
            case "checkbox":
                return getSwitchControl(printess, p, forMobile);
            case "patternTileWidth":
                return getNumberSlider(printess, p, undefined, forMobile);
            case "single-line-text":
                return getSingleLineTextBox(printess, p, forMobile);
            case "font":
                return getFontDropDown(printess, p, forMobile);
            case "text-area":
                return getTextArea(printess, p, forMobile);
            case "multi-line-text":
            case "selection-text-style":
                if (forMobile) {
                    switch (metaProperty) {
                        case "text-style-color":
                            return getColorDropDown(printess, p, "color", true);
                        case "text-style-font":
                            return getFontDropDown(printess, p, true);
                        case "text-style-hAlign":
                            return getHAlignControl(printess, p, true);
                        case "text-style-line-height":
                            return getNumberSlider(printess, p, "text-style-line-height", true);
                        case "text-style-size":
                            return getFontSizeDropDown(printess, p, true);
                        case "text-style-vAlign":
                            return getVAlignControl(printess, p, true);
                        case "text-style-vAlign-hAlign":
                            return getVAlignAndHAlignControl(printess, p, true);
                        case "text-style-paragraph-style":
                            return getParagraphStyleDropDown(printess, p, true);
                        case "handwriting-image":
                            return getImageUploadControl(printess, p, undefined, forMobile);
                        case "letter-generator":
                            return getOpenLetterGeneratorControl(printess, p, forMobile);
                        default:
                            return getMultiLineTextBox(printess, p, forMobile);
                    }
                }
                else if (p.kind === "selection-text-style") {
                    return getInlineTextStyleControl(printess, p);
                }
                else {
                    return getMultiLineTextBox(printess, p, forMobile);
                }
            case "color":
                if (!forMobile && uih_currentProperties.length <= 3 && uih_currentProperties.filter(p => p.kind === "color").length <= 1 && !p.id.startsWith("FF_")) {
                    return getTextPropertyScrollContainer(getColorDropDown(printess, p, undefined, true));
                }
                else if (!forMobile && uih_currentProperties.length === 2 && uih_currentProperties.filter(p => p.kind === "color").length === 2 && printess.enableCustomColors() && !p.id.startsWith("FF_")) {
                    const colorsContainer = getTextPropertyScrollContainer(getColorDropDown(printess, p, undefined, true));
                    colorsContainer.classList.add("mb-4");
                    return colorsContainer;
                }
                else {
                    return getColorDropDown(printess, p, undefined, forMobile);
                }
            case "number":
            case "pixelLength":
                return getNumberSlider(printess, p);
            case "image-id":
                if (forMobile) {
                    if (metaProperty) {
                        switch (metaProperty) {
                            case "image-rotation":
                                return getImageRotateControl(printess, p, forMobile);
                            case "image-crop":
                                renderMobileDialogFullscreen(printess, "CROPMODAL", "ui.buttonCrop", getImageCropControl(printess, p, false));
                        }
                    }
                    return getImageUploadControl(printess, p, undefined, forMobile);
                }
                else {
                    const tabs = [];
                    if ((_a = p.imageMeta) === null || _a === void 0 ? void 0 : _a.canUpload) {
                        tabs.push({ id: "upload-" + p.id, title: printess.gl("ui.imageTab"), content: getImageUploadControl(printess, p) });
                    }
                    else {
                        tabs.push({ id: "upload-" + p.id, title: printess.gl("ui.imageTabSelect"), content: getImageUploadControl(printess, p) });
                    }
                    if (((_b = p.imageMeta) === null || _b === void 0 ? void 0 : _b.canUpload) && p.value !== ((_c = p.validation) === null || _c === void 0 ? void 0 : _c.defaultValue)) {
                        tabs.push({ id: "rotate-" + p.id, title: printess.gl("ui.rotateTab"), content: getImageRotateControl(printess, p, forMobile) });
                        if ((_d = p.imageMeta) === null || _d === void 0 ? void 0 : _d.hasFFCropEditor) {
                            tabs.push({ id: "crop-" + p.id, title: printess.gl("ui.cropTab"), content: getImageCropControl(printess, p, false, !forMobile) });
                        }
                    }
                    const tabPanel = getTabPanel(printess, tabs, p.id);
                    tabPanel.style.display = printess.isPropertyVisible(p.id) ? "block" : "none";
                    return tabPanel;
                }
            case "image": {
                if (forMobile) {
                    if (metaProperty) {
                        switch (metaProperty) {
                            case "image-contrast":
                                return getNumberSlider(printess, p, metaProperty, true);
                            case "image-sepia":
                            case "image-brightness":
                            case "image-hueRotate":
                            case "image-vivid":
                                return getNumberSlider(printess, p, metaProperty, true);
                            case "image-invert":
                                return getInvertImageChecker(printess, p, "image-invert", forMobile);
                            case "image-placement":
                                return getImagePlacementControl(printess, p, forMobile);
                            case "image-scale":
                            {
                                const div = document.createElement("div");
                                const s = getImageScaleControl(printess, p, true);
                                if (forMobile && s && ((_f = p.imageMeta) === null || _f === void 0 ? void 0 : _f.canSetPlacement)) {
                                    div.appendChild(getImagePlacementControl(printess, p, forMobile));
                                    div.appendChild(s);
                                    return div;
                                }
                                if (!s)
                                    return document.createElement("div");
                                return s;
                            }
                            case "image-rotation":
                                return getImageRotateControl(printess, p, forMobile);
                            case "image-filter":
                            {
                                const tags = (_g = p.imageMeta) === null || _g === void 0 ? void 0 : _g.filterTags;
                                if (tags && tags.length > 0 && !printess.hasSplitterMenu()) {
                                    return getImageFilterButtons(printess, p, tags);
                                }
                            }
                                break;
                        }
                        const d = document.createElement("div");
                        d.innerText = printess.gl("ui.missingControl");
                        return d;
                    }
                    else {
                        return getImageUploadControl(printess, p, undefined, forMobile);
                    }
                }
                const tabs = [];
                const hasImageSplitterMenu = printess.hasSplitterMenu() && printess.hasSplitterTextSnippets() && ((_h = p.imageMeta) === null || _h === void 0 ? void 0 : _h.canUpload);
                if ((_j = p.imageMeta) === null || _j === void 0 ? void 0 : _j.canUpload) {
                    const aiSettings = printess.showText2Image();
                    if (!aiSettings || aiSettings.allowUpload) {
                        tabs.push({ id: "upload-" + p.id, title: printess.gl("ui.imageTab"), content: getImageUploadControl(printess, p) });
                    }
                    if (aiSettings) {
                        tabs.push({ id: "txt2image-" + p.id, title: printess.gl("ui.imageTabGenerate"), content: getText2ImageControl(printess, p, forMobile, aiSettings) });
                    }
                }
                else {
                    const title = ((_k = p.imageMeta) === null || _k === void 0 ? void 0 : _k.isHandwriting) ? printess.gl("ui.imageTabHandwriting") : printess.gl("ui.imageTabSelect");
                    tabs.push({ id: "upload-" + p.id, title: title, content: getImageUploadControl(printess, p) });
                }
                if (((_l = p.imageMeta) === null || _l === void 0 ? void 0 : _l.canUpload) && p.value !== ((_m = p.validation) === null || _m === void 0 ? void 0 : _m.defaultValue)) {
                    if (((_o = p.imageMeta) === null || _o === void 0 ? void 0 : _o.allows.length) > 2 && p.value !== ((_q = p.validation) === null || _q === void 0 ? void 0 : _q.defaultValue)) {
                        tabs.push({ id: "filter-" + p.id, title: printess.gl("ui.filterTab"), content: getImageFilterControl(printess, p) });
                    }
                    tabs.push({ id: "rotate-" + p.id, title: printess.gl("ui.rotateTab"), content: getImageRotateControl(printess, p, forMobile) });
                }
                if (hasImageSplitterMenu) {
                    tabs.push({ id: "printess-splitter-layouts", title: printess.gl("ui.changeLayout"), content: getSplitterSnippetsControl(printess, p) });
                }
                return getTabPanel(printess, tabs, p.id);
            }
            case "select-list":
            case "tab-list":
                return getDropDown(printess, p, forMobile);
            case "select-list+info":
                return getDropDown(printess, p, forMobile, undefined, true);
            case "image-list":
            case "color-list":
                return getImageSelectList(printess, p, forMobile);
            case "table":
                return getTableControl(printess, p, forMobile);
            case "grid-gap-button":
                return getGridGapControl(printess, p);
        }
        const div = document.createElement("div");
        div.innerText = printess.gl("ui.missingProperty", p.kind);
        return div;
    }
    function getInfoStyle(p) {
        const s = p.infoStyle.split(" ");
        const style = s[0] || "text";
        const size = s[1] || "medium";
        const color = s[2] || "default";
        return { color, size, style };
    }
    function getSimpleLabel(printess, p, text, forControlGroup = false, forMobile = false) {
        const ls = getInfoStyle(p);
        if (forControlGroup) {
            const para = document.createElement("span");
            para.className = "printess-text-" + p.kind;
            para.setAttribute("data-visibility-id", p.id.replace("#", "_hash_"));
            para.style.marginTop = "38px";
            para.style.marginBottom = "0";
            para.style.marginLeft = "5px";
            para.style.marginRight = "5px";
            para.style.fontSize = "16pt";
            para.textContent = printess.gl(text);
            return para;
        }
        else if (p.info) {
            if (ls.style === "card") {
                const card = getBootstrapCardLabel(printess, p, text, ls.color, ls.size, forMobile);
                return card;
            }
            else if (ls.style === "panel") {
                const alert = getBootstrapPanelLabel(printess, p, text, ls.color, ls.size, forMobile);
                return alert;
            }
            const container = document.createElement("div");
            container.className = "mb-1 printess-text-" + p.kind;
            container.setAttribute("data-visibility-id", p.id.replace("#", "_hash_"));
            if (ls.style !== "html") {
                let el = "h4";
                if (ls.size === "large") {
                    el = "h3";
                }
                else if (ls.size === "small") {
                    el = "h5";
                }
                const header = document.createElement(el);
                header.textContent = printess.gl(text);
                if (ls.color !== "default") {
                    header.classList.add("text-" + ls.color);
                }
                container.appendChild(header);
            }
            if (ls.style === "html") {
                const div = document.createElement("div");
                div.innerHTML = p.info;
                container.className = "mb-1 printess-html-" + p.kind;
                container.appendChild(div);
            }
            else if (ls.style === "bullets" || ls.style === "numbers") {
                container.className = "mb1 printess-" + ls.style + "-" + p.kind;
                const items = p.info.split("\n");
                const list = document.createElement(ls.style === "numbers" ? "ol" : "ul");
                for (const item of items) {
                    const li = document.createElement("li");
                    li.innerHTML = getLegalNoticeText(printess, item, forMobile, text);
                    if (ls.size === "large") {
                        li.style.fontSize = "18px";
                    }
                    else if (ls.size === "small") {
                        li.style.fontSize = "14px";
                    }
                    list.appendChild(li);
                }
                container.appendChild(list);
            }
            else {
                const para = document.createElement("p");
                para.innerHTML = getLegalNoticeText(printess, p.info, forMobile, text);
                para.style.whiteSpace = "pre-line";
                container.appendChild(para);
                if (ls.size === "large") {
                    para.style.fontSize = "1.125rem";
                }
                else if (ls.size === "small") {
                    para.style.fontSize = "0.875rem";
                }
            }
            return container;
        }
        else {
            const para = document.createElement("h4");
            para.setAttribute("data-visibility-id", p.id.replace("#", "_hash_"));
            para.className = "mb-1 printess-text-" + p.kind;
            para.innerHTML = text;
            if (ls.color !== "default") {
                para.style.color = `var(--bs-${ls.color})`;
            }
            if (forMobile) {
                para.style.fontSize = "0.85em";
            }
            else if (ls.size === "large") {
                para.style.fontSize = "28px";
            }
            else if (ls.size === "small") {
                para.style.fontSize = "20px";
            }
            return para;
        }
    }
    function getBootstrapCardLabel(printess, p, text, color, size, forMobile = false) {
        const container = document.createElement("div");
        const headerColor = color === "default" ? "" : "text-" + color;
        container.className = "card mb-4 printess-card-" + p.kind;
        container.setAttribute("data-visibility-id", p.id.replace("#", "_hash_"));
        const header = document.createElement("div");
        header.className = "card-header " + headerColor;
        header.textContent = printess.gl(text);
        if (size === "large") {
            header.style.fontSize = "18px";
        }
        else if (size === "small") {
            header.style.fontSize = "14px";
        }
        const body = document.createElement("div");
        body.className = "card-body";
        const para = document.createElement("p");
        para.className = "mb-0";
        para.innerHTML = getLegalNoticeText(printess, p.info, forMobile);
        body.appendChild(para);
        if (size === "large") {
            para.style.fontSize = "18px";
        }
        else if (size === "small") {
            para.style.fontSize = "14px";
        }
        container.appendChild(header);
        container.appendChild(body);
        return container;
    }
    function getBootstrapPanelLabel(printess, p, text, color, size, forMobile = false) {
        const container = document.createElement("div");
        const bgColor = color === "default" ? "secondary" : color;
        container.className = "alert alert-" + bgColor + " mb-4 printess-panel-" + p.kind;
        container.setAttribute("data-visibility-id", p.id.replace("#", "_hash_"));
        const h4 = document.createElement("h4");
        h4.className = "alert-heading";
        h4.textContent = printess.gl(text);
        if (size === "large") {
            h4.style.fontSize = "28px";
        }
        else if (size === "small") {
            h4.style.fontSize = "20px";
        }
        const para = document.createElement("p");
        para.classList.add("mb-0");
        para.innerHTML = getLegalNoticeText(printess, p.info, forMobile);
        if (size === "large") {
            para.style.fontSize = "18px";
        }
        else if (size === "small") {
            para.style.fontSize = "14px";
        }
        container.appendChild(h4);
        container.appendChild(para);
        return container;
    }
    function getSwitchControl(printess, p, forMobile) {
        const switchControl = document.createElement("div");
        switchControl.className = "form-check form-switch mb-3 printess-" + p.kind;
        switchControl.setAttribute("data-visibility-id", p.id.replace("#", "_hash_"));
        const input = document.createElement("input");
        input.className = "form-check-input";
        input.id = p.id + "_switch";
        input.type = "checkbox";
        input.setAttribute("role", "switch");
        input.checked = p.value === "true";
        const label = document.createElement("label");
        label.className = "form-check-label";
        label.setAttribute("for", p.id + "_switch");
        label.textContent = printess.gl(p.label);
        switchControl.appendChild(input);
        if (!forMobile) {
            switchControl.appendChild(label);
        }
        switchControl.onchange = () => {
            printess.setProperty(p.id, input.checked ? "true" : "false").then(() => setPropertyVisibilities(printess));
            p.value = input.checked ? "true" : "false";
            const mobileButtonDiv = document.getElementById(p.id + ":");
            if (mobileButtonDiv) {
                drawButtonContent(printess, mobileButtonDiv, [p], p.controlGroup);
            }
        };
        const infoText = (p === null || p === void 0 ? void 0 : p.info) ? printess.gl(p.info) : "";
        if (infoText && !forMobile) {
            switchControl.classList.remove("mb-3");
            return addLabel(printess, p, switchControl, p.id, false, p.kind, p.label, false, p.controlGroup > 0);
        }
        else {
            return switchControl;
        }
    }
    function getChangeBackgroundButton(printess) {
        const ok = document.createElement("button");
        ok.className = "btn btn-primary w-100 align-self-start mb-3";
        ok.innerText = printess.gl("ui.buttonChangeBackground");
        ok.onclick = () => {
            printess.selectBackground();
        };
        return ok;
    }
    function getDesktopNavButton(btn) {
        const ok = document.createElement("button");
        ok.className = "btn btn-primary";
        ok.style.marginRight = "4px";
        ok.style.alignSelf = "start";
        ok.style.padding = "5px";
        if (btn.name === "basket") {
            ok.classList.add("printess-basket-button");
        }
        ok.textContent = btn.text;
        ok.onclick = () => btn.task();
        return ok;
    }
    function getDoneButton(printess) {
        const buttons = {
            previous: {
                name: "previous",
                text: printess.gl("ui.buttonPrevStep"),
                task: () => {
                    var _a;
                    printess.previousStep();
                    getCurrentTab(printess, (Number((_a = printess.getStep()) === null || _a === void 0 ? void 0 : _a.index) - 1), true);
                }
            },
            next: {
                name: "next",
                text: printess.gl("ui.buttonNext"),
                task: () => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    yield gotoNextStep(printess);
                    getCurrentTab(printess, (Number((_a = printess.getStep()) === null || _a === void 0 ? void 0 : _a.index) + 1), true);
                })
            },
            done: {
                name: "done",
                text: printess.gl("ui.buttonDone"),
                task: () => {
                    const errors = getActualErrors(printess.validate("selection"));
                    if (errors.length > 0) {
                        getValidationOverlay(printess, errors, "done");
                        return;
                    }
                    printess.clearSelection();
                }
            },
            basket: {
                name: "basket",
                text: printess.userInBuyerSide() ? printess.gl("ui.buttonPrint") : printess.gl("ui.buttonBasket"),
                task: () => addToBasket(printess)
            }
        };
        const container = document.createElement("div");
        if (printess.isCurrentStepActive()) {
            if (printess.hasPreviousStep()) {
                container.appendChild(getDesktopNavButton(buttons.previous));
            }
            if (printess.hasNextStep()) {
                container.appendChild(getDesktopNavButton(buttons.next));
            }
            else {
                container.appendChild(getDesktopNavButton(buttons.basket));
            }
        }
        else if (!printess.isCurrentStepActive() && printess.hasSteps()) {
            container.appendChild(getDesktopNavButton(buttons.done));
            if (printess.hasNextStep()) {
                container.appendChild(getDesktopNavButton(buttons.next));
            }
            else {
                container.appendChild(getDesktopNavButton(buttons.basket));
            }
        }
        else if (!printess.showTabNavigation()) {
            container.appendChild(getDesktopNavButton(buttons.done));
        }
        return container;
    }
    function getFormTextStyleControl(printess, p) {
        const textPropertiesDiv = document.createElement("div");
        textPropertiesDiv.classList.add("mb-3");
        if (!p.textStyle) {
            return textPropertiesDiv;
        }
        const group1 = document.createElement("div");
        group1.className = "input-group mb-3";
        const pre1 = document.createElement("div");
        pre1.className = "input-group-prepend";
        const hasColor = p.textStyle.allows.indexOf("color") >= 0;
        const hasSize = p.textStyle.allows.indexOf("size") >= 0;
        const hasLineHeight = p.textStyle.allows.indexOf("lineHeight") >= 0;
        const hasFont = p.textStyle.allows.indexOf("font") >= 0;
        const hasParagraphStyles = p.textStyle.allows.indexOf("styles") >= 0;
        const hasVerticalAlign = p.textStyle.allows.indexOf("verticalAlignment") >= 0;
        const hasHorizontalAlign = p.textStyle.allows.indexOf("horizontalAlignment") >= 0;
        const displayColorControl = hasColor && (hasSize || hasFont || hasVerticalAlign || hasHorizontalAlign);
        const setColorCaption = hasColor && !hasSize && !hasFont && !hasParagraphStyles;
        const caption = setColorCaption ? printess.gl("ui.colorDropDownCaption") : "";
        if (printess.showTextStyleCaptions() && displayColorControl) {
            const label = document.createElement("div");
            label.style.marginBottom = "0.5rem";
            label.style.width = "100%";
            label.textContent = caption;
            group1.appendChild(label);
        }
        if (displayColorControl) {
            getColorDropDown(printess, p, "color", false, pre1);
        }
        if (hasSize) {
            getFontSizeDropDown(printess, p, false, pre1, false);
        }
        if (hasLineHeight) {
            getNumberSlider(printess, p, "text-style-line-height", false);
        }
        group1.appendChild(pre1);
        if (hasFont) {
            getFontDropDown(printess, p, false, group1, false);
        }
        if (hasParagraphStyles) {
            getParagraphStyleDropDown(printess, p, false, group1, false);
        }
        if (hasParagraphStyles && !hasFont && !hasSize && uih_currentProperties.filter(p => p.kind === "multi-line-text").length === 1) {
            textPropertiesDiv.appendChild(getTextPropertyScrollContainer(getParagraphStyleDropDown(printess, p, true, undefined, true)));
        }
        else if (setColorCaption && uih_currentProperties.length === 1) {
            textPropertiesDiv.appendChild(getTextPropertyScrollContainer(getColorDropDown(printess, p, "color", true, undefined)));
        }
        else {
            textPropertiesDiv.appendChild(group1);
        }
        textPropertiesDiv.appendChild(getTextAlignmentControl(printess, p));
        return textPropertiesDiv;
    }
    function getInlineTextStyleControl(printess, p) {
        const textPropertiesDiv = document.createElement("div");
        textPropertiesDiv.classList.add("mb-3");
        if (!p.textStyle) {
            return textPropertiesDiv;
        }
        if (p.textStyle.allows.indexOf("styles") >= 0) {
            textPropertiesDiv.appendChild(getTextPropertyScrollContainer(getParagraphStyleDropDown(printess, p, true, undefined, true)));
        }
        if (p.textStyle.allows.indexOf("font") >= 0) {
            const group1 = document.createElement("div");
            group1.className = "input-group mb-3";
            group1.appendChild(getFontDropDown(printess, p, false, undefined, true));
            textPropertiesDiv.appendChild(group1);
        }
        if (p.textStyle.allows.indexOf("color") >= 0) {
            textPropertiesDiv.appendChild(getTextPropertyScrollContainer(getColorDropDown(printess, p, "color", true)));
        }
        if (p.textStyle.allows.indexOf("size") >= 0) {
            textPropertiesDiv.appendChild(getTextPropertyScrollContainer(getFontSizeDropDown(printess, p, true, undefined, true)));
        }
        if (p.textStyle.allows.indexOf("lineHeight") >= 0) {
            textPropertiesDiv.appendChild(getTextPropertyScrollContainer(getNumberSlider(printess, p, "text-style-line-height", true)));
        }
        textPropertiesDiv.appendChild(getTextAlignmentControl(printess, p));
        if (p.kind === "selection-text-style" && p.textStyle.allows.indexOf("handWriting") >= 0) {
            const infoBox = getHandwritingInfoBox(printess, false);
            textPropertiesDiv.appendChild(infoBox);
            const upload = getImageUploadButton(printess, p, p.id, false, false, "ui.uploadHandwriting", true);
            textPropertiesDiv.appendChild(upload);
            if (printess.showMobileUploadButton()) {
                const mobileUploadButton = document.createElement("button");
                mobileUploadButton.className = "btn btn-secondary w-100 mt-1 mb-3";
                mobileUploadButton.innerText = printess.gl("ui.mobileImageUpload");
                mobileUploadButton.onclick = () => __awaiter(this, void 0, void 0, function* () {
                    yield getMobileImagesUploadOverlay(printess);
                });
                textPropertiesDiv.appendChild(mobileUploadButton);
            }
        }
        if ((p.textStyle.allows.indexOf("letterGenerator") >= 0)) {
            textPropertiesDiv.appendChild(getOpenLetterGeneratorControl(printess, p, false));
        }
        return textPropertiesDiv;
    }
    function getOpenLetterGeneratorControl(printess, p, forMobile) {
        const div = document.createElement("div");
        div.classList.add("letter-writer-button");
        const openLetterConfigurationButton = document.createElement("button");
        openLetterConfigurationButton.className = "btn btn-primary w-100 mt-1 mb-3";
        openLetterConfigurationButton.innerText = printess.gl("ui.openLetterGenerator");
        openLetterConfigurationButton.onclick = () => __awaiter(this, void 0, void 0, function* () {
            yield createLetterGeneratorModal(printess, p);
        });
        const inf1 = document.createElement("div");
        const inf2 = document.createElement("div");
        inf1.textContent = printess.gl("ui.infoLetterGenerator1");
        inf2.textContent = printess.gl("ui.infoLetterGenerator2");
        div.appendChild(inf1);
        div.appendChild(inf2);
        div.appendChild(openLetterConfigurationButton);
        return div;
    }
    function createLetterGeneratorModal(printess, _p) {
        return __awaiter(this, void 0, void 0, function* () {
            let firstGeneration = true;
            const modal = document.createElement("div");
            modal.id = "lettergenerator-modal";
            modal.className = "modal show align-items-center";
            modal.setAttribute("tabindex", "-1");
            modal.style.backgroundColor = "rgba(0,0,0,0.7)";
            modal.style.display = "flex";
            const dialog = document.createElement("div");
            dialog.className = "modal-dialog";
            const content = document.createElement("div");
            content.className = "modal-content";
            const modalHeader = document.createElement("div");
            modalHeader.className = "modal-header bg-primary";
            const title = document.createElement("h3");
            title.className = "modal-title";
            title.innerHTML = printess.gl("lettergenerator.title").replace(/\n/g, "<br>");
            title.style.color = "#fff";
            const modalBody = document.createElement("div");
            modalBody.className = "modal-body";
            const ui = document.createElement("wc-letter-generator");
            ui.state = yield printess.loadLetterGeneratorState();
            const textArea = document.createElement("textarea");
            textArea.classList.add("letter-text-area");
            textArea.textContent = printess.gl("ui.letterGeneratorHint");
            let currentPrompt = "";
            modalBody.classList.add("letter-modal-body");
            modalBody.appendChild(ui);
            modalBody.appendChild(textArea);
            const modalFooter = document.createElement("div");
            modalFooter.className = "modal-footer";
            const ok = document.createElement("button");
            ok.className = "btn btn-primary";
            ok.disabled = true;
            ok.textContent = printess.gl("ui.buttonOk");
            ok.onclick = () => {
                var _a;
                printess.setEditorText((_a = textArea.textContent) !== null && _a !== void 0 ? _a : "");
                modal.remove();
            };
            const close = document.createElement("button");
            close.className = "btn btn-secondary";
            close.textContent = printess.gl("ui.buttonClose");
            close.onclick = () => {
                modal.remove();
            };
            function streamPromptResult() {
                if (isStreaming) {
                    console.error("Is already streaming GPT results ...");
                    return;
                }
                isStreaming = true;
                generate.disabled = true;
                ok.disabled = true;
                printess.streamPrompt(currentPrompt, message => {
                    textArea.textContent += message;
                }, () => {
                    isStreaming = false;
                    ok.disabled = false;
                    generate.disabled = false;
                });
            }
            let isStreaming = false;
            const generate = document.createElement("button");
            generate.className = "btn btn-secondary";
            generate.disabled = true;
            generate.textContent = printess.gl("re-generate");
            generate.onclick = () => {
                textArea.textContent = "";
                streamPromptResult();
            };
            ui.promptCangedCallback = (data) => {
                if (firstGeneration) {
                    firstGeneration = false;
                    currentPrompt = data.evaluatedPrompt;
                    textArea.textContent = "";
                    streamPromptResult();
                }
            };
            modalFooter.appendChild(generate);
            modalFooter.appendChild(ok);
            modalFooter.appendChild(close);
            content.appendChild(modalHeader);
            content.appendChild(modalBody);
            content.appendChild(modalFooter);
            dialog.appendChild(content);
            modal.appendChild(dialog);
            document.body.appendChild(modal);
        });
    }
    function getHandwritingInfoBox(printess, forMobile) {
        const container = document.createElement("div");
        if (!forMobile) {
            const header = document.createElement("h4");
            header.className = "mb-3";
            header.textContent = printess.gl("ui.imageTabHandwriting");
            container.appendChild(header);
        }
        const infoBox = document.createElement("div");
        infoBox.className = "alert alert-secondary mb-1 handwriting-info-box";
        const icons = [{
            icon: "handwriting",
            text: "Write Text"
        }, {
            icon: "arrow-right-long",
            text: ""
        }, {
            icon: "camera-solid",
            text: "Take Photo"
        }, {
            icon: "arrow-right-long",
            text: ""
        }, {
            icon: "cloud-upload-alt",
            text: "Upload Photo"
        }];
        icons.forEach(i => {
            const div = document.createElement("div");
            div.className = "d-flex flex-column align-items-center";
            const icon = printess.getIcon(i.icon);
            if (forMobile) {
                icon.style.width = i.icon === "arrow-right-long" ? "20px" : "25px";
                icon.style.height = "28px";
            }
            else {
                icon.style.width = i.icon === "arrow-right-long" ? "25px" : "30px";
                icon.style.height = i.icon === "arrow-right-long" ? "25px" : "30px";
            }
            const text = document.createElement("div");
            text.textContent = printess.gl(i.text);
            div.appendChild(icon);
            div.appendChild(text);
            infoBox.appendChild(div);
            container.appendChild(infoBox);
        });
        return container;
    }
    function getTextPropertyScrollContainer(child) {
        const d = document.createElement("div");
        d.className = "mb-3 text-large-properties";
        d.appendChild(child);
        return d;
    }
    function getTextAlignmentControl(printess, p) {
        const group2 = document.createElement("div");
        if (p.textStyle && (p.textStyle.allows.indexOf("horizontalAlignment") >= 0 || p.textStyle.allows.indexOf("verticalAlignment") >= 0)) {
            group2.className = "input-group mb-3";
            group2.style.padding = "1px";
            group2.style.marginLeft = "0px";
            const caption = printess.gl("ui.textAlignmentCaption");
            if (printess.showTextStyleCaptions()) {
                const label = document.createElement("div");
                label.style.marginBottom = "0.5rem";
                label.style.width = "100%";
                label.textContent = caption;
                group2.appendChild(label);
            }
            const pre2 = document.createElement("div");
            pre2.className = "input-group-prepend";
            if (p.textStyle.allows.indexOf("horizontalAlignment") >= 0) {
                group2.appendChild(getHAlignControl(printess, p, false));
            }
            const spacer = document.createElement("div");
            spacer.style.width = "10px";
            if (p.textStyle.allows.indexOf("horizontalAlignment") >= 0 && p.textStyle.allows.indexOf("verticalAlignment")) {
                group2.appendChild(spacer);
            }
            if (p.textStyle.allows.indexOf("verticalAlignment") >= 0) {
                group2.appendChild(getVAlignControl(printess, p, false));
            }
        }
        return group2;
    }
    function getMultiLineTextBox(printess, p, forMobile) {
        const ta = getTextArea(printess, p, forMobile);
        if (forMobile) {
            return ta;
        }
        else {
            const container = document.createElement("div");
            container.appendChild(getFormTextStyleControl(printess, p));
            container.appendChild(ta);
            return container;
        }
    }
    function getSingleLineTextBox(printess, p, forMobile) {
        var _a;
        const inp = document.createElement("input");
        inp.type = "text";
        inp.value = p.value.toString();
        inp.autocomplete = "off";
        inp.autocapitalize = "off";
        inp.spellcheck = false;
        if (p.validation && p.validation.maxChars) {
            inp.maxLength = p.validation.maxChars;
        }
        inp.oninput = () => {
            printess.setProperty(p.id, inp.value).then(() => setPropertyVisibilities(printess));
            p.value = inp.value;
            validate(printess, p);
            const mobileButtonDiv = document.getElementById(p.id + ":");
            if (mobileButtonDiv) {
                drawButtonContent(printess, mobileButtonDiv, [p], p.controlGroup);
            }
        };
        inp.onfocus = () => {
            const ffId = p.id.startsWith("FF_") ? p.id.substr(3) : undefined;
            if (ffId || printess.zoomToFrames()) {
                printess.setZoomMode("frame");
                printess.resizePrintess(false, undefined, undefined, undefined, ffId);
            }
            if (inp.value && p.validation && p.validation.clearOnFocus && inp.value === p.validation.defaultValue) {
                inp.value = "";
            }
            else {
                window.setTimeout(() => inp.select(), 0);
            }
        };
        inp.onblur = () => {
            const lastZoomMode = printess.getZoomMode();
            printess.setZoomMode("spread");
            if (forMobile === false && lastZoomMode === "frame") {
                printess.centerSelection(undefined, "spread");
            }
        };
        const r = addLabel(printess, p, inp, p.id, forMobile, p.kind, p.label, !!((_a = p.validation) === null || _a === void 0 ? void 0 : _a.maxChars) && p.controlGroup === 0, p.controlGroup > 0);
        return r;
    }
    function getDesktopTitle(printess) {
        const container = document.createElement("div");
        const forCornerTools = printess.pageNavigationDisplay() === "icons";
        const basketBtnBehaviour = printess.getBasketButtonBehaviour();
        const inner = document.createElement("div");
        inner.className = "desktop-title-bar";
        if (!printess.showTabNavigation()) {
            inner.classList.add("mb-2");
        }
        else {
            inner.style.alignItems = "center";
        }
        if (!forCornerTools) {
            const h3 = document.createElement("h3");
            h3.innerText = printess.gl(printess.getTemplateTitle());
            h3.style.margin = "0px";
            h3.style.display = uih_currentPriceDisplay ? "none" : "hidden";
            inner.appendChild(h3);
            const priceDiv = document.createElement("div");
            priceDiv.className = "total-price-container";
            priceDiv.id = "total-price-display";
            if (uih_currentPriceDisplay) {
                getPriceDisplay(printess, priceDiv, uih_currentPriceDisplay);
            }
            else if (printess.getProductInfoUrl()) {
                const infoIcon = printess.getIcon("info-circle");
                infoIcon.classList.add("product-info-icon");
                infoIcon.onclick = () => getIframeOverlay(printess, printess.gl("ui.productOverview"), printess.getProductInfoUrl(), false);
                priceDiv.appendChild(infoIcon);
            }
            inner.appendChild(priceDiv);
        }
        if (printess.hasPreviewBackButton()) {
            inner.appendChild(getPreviewBackButton(printess));
        }
        else if (basketBtnBehaviour === "go-to-preview") {
            const previewBtn = document.createElement("button");
            previewBtn.className = "btn btn-outline-primary";
            previewBtn.classList.add("me-1");
            if (printess.showTabNavigation() && printess.pageNavigationDisplay() !== "icons") {
                previewBtn.classList.add("ms-1");
            }
            previewBtn.innerText = printess.gl("ui.buttonPreview");
            previewBtn.onclick = () => __awaiter(this, void 0, void 0, function* () {
                const validation = yield validateAllInputs(printess, "preview");
                if (validation) {
                    yield printess.gotoNextPreviewDocument(0);
                    if (printess.showTabNavigation()) {
                        printess.resizePrintess();
                    }
                }
            });
            inner.appendChild(previewBtn);
        }
        else {
            inner.appendChild(document.createElement("div"));
        }
        const hasSaveAndCloseBtnInPageIconView = printess.pageNavigationDisplay() === "icons" && printess.showSaveAndCloseButton();
        const wrapper = document.createElement("div");
        wrapper.style.display = "flex";
        wrapper.style.flexDirection = "row";
        if (printess.showSaveAndCloseButton()) {
            const saveAndQuitButton = document.createElement("button");
            saveAndQuitButton.className = "btn btn-primary me-2";
            saveAndQuitButton.style.flex = "1 1 0";
            saveAndQuitButton.textContent = printess.gl("ui.buttonSaveAndClose");
            saveAndQuitButton.onclick = () => saveTemplate(printess, "close");
            wrapper.appendChild(saveAndQuitButton);
        }
        const basketBtn = document.createElement("button");
        const caption = hasSaveAndCloseBtnInPageIconView ? "" : printess.userInBuyerSide() ? printess.gl("ui.buttonPrint") : printess.gl("ui.buttonBasket");
        basketBtn.className = "btn btn-primary d-flex justify-content-center printess-basket-button";
        basketBtn.style.whiteSpace = "nowrap";
        if (!hasSaveAndCloseBtnInPageIconView && printess.pageNavigationDisplay() === "icons") {
            basketBtn.style.flex = "1 1 0";
        }
        basketBtn.innerText = caption;
        const basketIcon = printess.userInBuyerSide() ? "print-solid" : printess.gl("ui.buttonBasketIcon") || "shopping-cart-add";
        const icon = hasSaveAndCloseBtnInPageIconView ? basketIcon : printess.gl("ui.buttonBasketIcon");
        if (icon) {
            const svg = printess.getIcon(icon);
            svg.style.height = "24px";
            svg.style.float = "left";
            svg.style.fill = "var(--bs-light)";
            svg.style.marginLeft = caption ? "10px" : "0px";
            basketBtn.appendChild(svg);
        }
        basketBtn.onclick = () => addToBasket(printess);
        if (!printess.showAddToBasketButton()) {
            wrapper.appendChild(document.createElement("div"));
        }
        else {
            wrapper.appendChild(basketBtn);
        }
        inner.appendChild(wrapper);
        container.appendChild(inner);
        if (!forCornerTools && !printess.showTabNavigation() && !printess.hasPreviewBackButton()) {
            const hr = document.createElement("hr");
            container.appendChild(hr);
        }
        return container;
    }
    function getPreviewBackButton(printess) {
        const btn = document.createElement("button");
        btn.className = "btn btn-outline-primary";
        if (printess.pageNavigationDisplay() === "doc-tabs") {
            btn.classList.add("ms-2");
        }
        else if (printess.showTabNavigation() && printess.pageNavigationDisplay() !== "icons") {
            btn.classList.add("ms-1");
        }
        else {
            btn.classList.add("me-1");
        }
        const svg = printess.getIcon("arrow-left");
        svg.style.width = "18px";
        svg.style.verticalAlign = "sub";
        btn.appendChild(svg);
        btn.onclick = () => __awaiter(this, void 0, void 0, function* () {
            yield printess.gotoPreviousPreviewDocument(0);
            if (printess.showTabNavigation()) {
                printess.resizePrintess();
            }
        });
        return btn;
    }
    function getExpertModeButton(printess, forMobile) {
        const btn = document.createElement("button");
        btn.id = "printess-expert-button";
        if (printess.pageNavigationDisplay() === "icons") {
            btn.className = "btn me-1 button-with-caption";
        }
        else if (forMobile) {
            btn.className = "btn me-2 button-mobile-with-caption";
        }
        else {
            btn.className = "btn me-2 button-with-caption";
        }
        if (printess.isInExpertMode()) {
            const btnClass = forMobile ? "btn-light" : "btn-primary";
            btn.classList.add(btnClass);
        }
        else {
            const btnClass = forMobile ? "btn-outline-light" : "btn-outline-primary";
            btn.classList.add(btnClass);
        }
        const svg = printess.getIcon("pen-swirl");
        btn.appendChild(svg);
        const txt = document.createElement("div");
        txt.textContent = "EXPERT";
        btn.appendChild(txt);
        btn.onclick = () => {
            if (printess.isInExpertMode()) {
                printess.leaveExpertMode();
                if (forMobile) {
                    btn.classList.remove("btn-light");
                    btn.classList.add("btn-outline-light");
                }
                else {
                    btn.classList.remove("btn-primary");
                    btn.classList.add("btn-outline-primary");
                }
            }
            else {
                printess.enterExpertMode();
                if (forMobile) {
                    btn.classList.add("btn-light");
                    btn.classList.remove("btn-outline-light");
                }
                else {
                    btn.classList.add("btn-primary");
                    btn.classList.remove("btn-outline-primary");
                }
            }
        };
        return btn;
    }
    function getSaveButton(printess, forMobile) {
        const btn = document.createElement("button");
        btn.id = "printess-save-button";
        if (printess.pageNavigationDisplay() === "icons") {
            btn.className = "btn me-1 button-with-caption";
        }
        else if (forMobile) {
            btn.className = "btn me-2 button-mobile-with-caption";
        }
        else {
            btn.className = "btn me-2 button-with-caption";
        }
        const btnClass = forMobile ? "btn-outline-light" : "btn-outline-primary";
        btn.classList.add(btnClass);
        const svg = printess.getIcon("cloud-upload-light");
        btn.appendChild(svg);
        const txt = document.createElement("div");
        txt.textContent = printess.gl("ui.buttonSave");
        btn.appendChild(txt);
        btn.onclick = () => __awaiter(this, void 0, void 0, function* () {
            btn.classList.add("disabled");
            saveTemplate(printess, "save");
            window.setTimeout(() => btn.classList.remove("disabled"), 1500);
        });
        return btn;
    }
    function getLoadButton(printess, forMobile) {
        const btn = document.createElement("button");
        btn.id = "printess-load-button";
        if (printess.pageNavigationDisplay() === "icons") {
            btn.className = "btn me-1 button-with-caption";
        }
        else if (forMobile) {
            btn.className = "btn me-2 button-mobile-with-caption";
        }
        else {
            btn.className = "btn me-2 button-with-caption";
        }
        const btnClass = forMobile ? "btn-outline-light" : "btn-outline-primary";
        btn.classList.add(btnClass);
        const svg = printess.getIcon("folder-open-solid");
        btn.appendChild(svg);
        const txt = document.createElement("div");
        txt.textContent = printess.gl("ui.buttonLoad").toUpperCase();
        btn.appendChild(txt);
        btn.onclick = () => __awaiter(this, void 0, void 0, function* () {
            btn.classList.add("disabled-button");
            yield asyncTimeout(100);
            const cb = printess.getLoadTemplateButtonCallback();
            if (cb) {
                yield printess.clearSelection();
                cb();
            }
            else {
                alert("Please add your callback in attachPrintess. [loadTemplateButtonCallback]");
            }
            window.setTimeout(() => btn.classList.remove("disabled-button"), 1500);
        });
        return btn;
    }
    function getProofButton(printess, forMobile) {
        const btn = document.createElement("button");
        btn.id = "printess-proof-button";
        if (printess.pageNavigationDisplay() === "icons") {
            btn.className = "btn me-1 button-with-caption";
        }
        else if (forMobile) {
            btn.className = "btn me-2 button-mobile-with-caption";
        }
        else {
            btn.className = "btn me-2 button-with-caption";
        }
        const btnClass = forMobile ? "btn-outline-light" : "btn-outline-primary";
        btn.classList.add(btnClass);
        const svg = printess.getIcon("print-solid");
        btn.appendChild(svg);
        const txt = document.createElement("div");
        txt.textContent = printess.gl("ui.buttonProof").toUpperCase();
        btn.appendChild(txt);
        btn.onclick = () => __awaiter(this, void 0, void 0, function* () {
            btn.classList.add("disabled-button");
            try {
                yield renderProofPdfs(printess);
            }
            finally {
                btn.classList.remove("disabled-button");
            }
        });
        return btn;
    }
    function renderProofPdfs(printess) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobStatus = yield printess.renderProofPdfs();
                if (jobStatus.isSuccess) {
                    const pdfs = Object.keys(jobStatus.result.r).map(key => ({ document: key, url: jobStatus.result.r[key] }));
                    for (const document of pdfs) {
                        window.open(document.url, "_blank");
                    }
                    if (jobStatus.result.p) {
                        for (let i = 0; i < jobStatus.result.p.length; i++) {
                            const distributionFile = jobStatus.result.p[i];
                            window.open(distributionFile.u, "_blank");
                        }
                    }
                }
                else {
                    alert("Cannot render proof pdfs: " + jobStatus.errorDetails);
                }
            }
            catch (error) {
                alert(error);
            }
        });
    }
    function getValidationOverlay(printess, errors, buttonType, stepIndex) {
        const error = errors[0];
        const imageResolutionErrors = errors.filter(e => e.errorCode === "imageResolutionLow");
        const modal = document.createElement("div");
        modal.id = "validation-modal";
        modal.className = "modal show align-items-center";
        modal.setAttribute("tabindex", "-1");
        modal.style.backgroundColor = "rgba(0,0,0,0.7)";
        modal.style.display = "flex";
        const dialog = document.createElement("div");
        dialog.className = "modal-dialog";
        const content = document.createElement("div");
        content.className = "modal-content";
        const modalHeader = document.createElement("div");
        modalHeader.className = "modal-header bg-primary";
        const title = document.createElement("h3");
        title.className = "modal-title";
        title.innerHTML = printess.gl(`errors.${error.errorCode}Title`).replace(/\n/g, "<br>");
        title.style.color = "#fff";
        const modalBody = document.createElement("div");
        modalBody.className = "modal-body";
        const footer = document.createElement("div");
        footer.className = "modal-footer";
        const ignore = document.createElement("button");
        ignore.className = "btn btn-outline-primary";
        ignore.textContent = printess.gl("ui.buttonIgnore");
        ignore.onclick = () => __awaiter(this, void 0, void 0, function* () {
            modal.style.display = "none";
            if (error.errorCode === "imageResolutionLow") {
                uih_ignoredLowResolutionErrors.push(error.boxIds[0]);
            }
            if (error.errorCode === "emptyBookPage") {
                uih_ignoredEmptyPageError = true;
            }
            errors = getActualErrors(errors);
            modal.remove();
            if (errors.length > 0) {
                getValidationOverlay(printess, errors, buttonType, stepIndex);
                return;
            }
            if (stepIndex && buttonType === "next") {
                yield gotoStep(printess, stepIndex);
            }
            else if (printess.hasNextStep() && buttonType === "next") {
                yield gotoNextStep(printess);
            }
            else if (printess.getBasketButtonBehaviour() === "go-to-preview" && buttonType === "preview") {
                const validation = yield validateAllInputs(printess, "preview");
                if (validation) {
                    yield printess.gotoNextPreviewDocument(0);
                    if (printess.showTabNavigation()) {
                        printess.resizePrintess();
                    }
                }
            }
            else if (buttonType === "validateAll") {
                addToBasket(printess);
            }
            else {
                printess.clearSelection();
            }
        });
        const ignoreAll = document.createElement("button");
        ignoreAll.className = "btn btn-outline-primary";
        ignoreAll.textContent = printess.gl("ui.buttonIgnoreAll");
        ignoreAll.onclick = () => __awaiter(this, void 0, void 0, function* () {
            modal.style.display = "none";
            imageResolutionErrors.forEach(err => uih_ignoredLowResolutionErrors.push(err.boxIds[0]));
            modal.remove();
            errors = errors.filter(err => err.errorCode !== "imageResolutionLow");
            if (errors.length > 0) {
                getValidationOverlay(printess, errors, buttonType, stepIndex);
                return;
            }
            if (buttonType === "preview") {
                const validation = yield validateAllInputs(printess, "preview");
                if (validation) {
                    yield printess.gotoNextPreviewDocument(0);
                    if (printess.showTabNavigation()) {
                        printess.resizePrintess();
                    }
                }
            }
            else if (buttonType === "validateAll") {
                addToBasket(printess);
            }
        });
        const ok = document.createElement("button");
        ok.className = "btn btn-primary";
        ok.textContent = printess.gl("ui.buttonOk");
        ok.onclick = () => {
            var _a, _b;
            printess.bringErrorIntoView(error);
            if (error.boxIds.length === 0 && printess.showTabNavigation()) {
                const ffTabId = (_b = (_a = uih_currentProperties.filter(p => p.id === "FF_" + error.errorValue3)[0]) === null || _a === void 0 ? void 0 : _a.tabId) !== null && _b !== void 0 ? _b : "#FORMFIELDS";
                selectTab(printess, printess.isMobile(), ffTabId);
                printess.clearSelection();
            }
            modal.style.display = "none";
            modal.remove();
            window.setTimeout(() => {
                if (error.errorValue3) {
                    const inp = document.getElementById("inp_FF_" + error.errorValue3);
                    if (inp)
                        inp.classList.add("input-error");
                    const tab = document.getElementById("tabs-panel-FF_" + error.errorValue3);
                    if (tab)
                        tab.classList.add("image-missing");
                }
            }, 100);
        };
        const p = document.createElement("p");
        p.className = "error-message";
        p.textContent = `${printess.gl(`errors.${error.errorCode}`, error.errorValue1)}`;
        const hint = document.createElement("p");
        hint.className = "error-message";
        hint.innerHTML = `<b>[${error.errorValue2}]: </b>` + printess.gl("errors." + error.errorCode + "Short", error.errorValue1);
        if (error.errorCode === "regExpNotMatching") {
            hint.innerHTML = `<b>[${error.errorValue2}]: </b>` + printess.gl(error.errorValue1.toString());
        }
        const errorLink = document.createElement("p");
        errorLink.className = "text-primary d-flex align-items-center";
        const numberOfErrors = errors.length - 1 > 1 ? "errors.moreProblems" : "errors.oneMoreProblem";
        errorLink.textContent = printess.gl(numberOfErrors, (errors.length - 1));
        errorLink.style.marginBottom = "0px";
        const svg = printess.getIcon("angle-down-light");
        svg.style.width = "15px";
        svg.style.marginLeft = "15px";
        svg.style.cursor = "pointer";
        errorLink.appendChild(svg);
        const errorList = document.createElement("ul");
        errorList.className = "list-group list-group-flush error-list";
        for (let i = 1; i < errors.length; i++) {
            const item = document.createElement("li");
            const editBtn = printess.getIcon("edit");
            const errorText = "errors." + errors[i].errorCode + "Short";
            item.className = "list-group-item d-flex justify-content-between align-items-center";
            item.textContent = printess.gl(errorText, errors[i].errorValue1) + (errors[i].errorValue2 ? ` @ ${errors[i].errorValue2}` : '');
            editBtn.onclick = () => {
                var _a, _b;
                printess.bringErrorIntoView(errors[i]);
                if (errors[i].boxIds.length === 0 && printess.showTabNavigation()) {
                    const ffTabId = (_b = (_a = uih_currentProperties.filter(p => p.id === "FF_" + errors[i].errorValue3)[0]) === null || _a === void 0 ? void 0 : _a.tabId) !== null && _b !== void 0 ? _b : "#FORMFIELDS";
                    selectTab(printess, printess.isMobile(), "#FORMFIELDS");
                    printess.clearSelection();
                }
                modal.style.display = "none";
                modal.remove();
                const errorId = errors[i].errorValue3;
                window.setTimeout(() => {
                    if (errorId) {
                        const inp = document.getElementById("inp_FF_" + errorId);
                        if (inp)
                            inp.classList.add("input-error");
                        const tab = document.getElementById("tabs-panel-FF_" + errorId);
                        if (tab)
                            tab.classList.add("image-missing");
                    }
                }, 100);
            };
            item.appendChild(editBtn);
            errorList.appendChild(item);
        }
        modalHeader.appendChild(title);
        modalBody.appendChild(p);
        if (error.errorValue2) {
            modalBody.appendChild(hint);
        }
        if (errors.length > 1) {
            let showErrorList = false;
            modalBody.appendChild(errorLink);
            svg.onclick = () => {
                showErrorList = !showErrorList;
                if (showErrorList) {
                    modalBody.appendChild(errorList);
                    svg.style.transform = "rotate(180deg)";
                }
                else if (!showErrorList && errorList) {
                    modalBody.removeChild(errorList);
                    svg.style.transform = "rotate(0deg)";
                }
            };
        }
        const validateAllLowResolution = buttonType === "preview" || buttonType === "validateAll";
        if (error.errorCode === "imageResolutionLow") {
            footer.appendChild(ignore);
        }
        else if (error.errorCode === "emptyBookPage" && !uih_ignoredEmptyPageError) {
            footer.appendChild(ignore);
        }
        if (error.errorCode === "imageResolutionLow" && validateAllLowResolution && imageResolutionErrors.length > 1) {
            footer.appendChild(ignoreAll);
        }
        footer.appendChild(ok);
        content.appendChild(modalHeader);
        content.appendChild(modalBody);
        content.appendChild(footer);
        dialog.appendChild(content);
        modal.appendChild(dialog);
        document.body.appendChild(modal);
    }
    function getDesktopStepsUi(printess) {
        var _a, _b;
        const container = document.createElement("div");
        const hr = document.createElement("hr");
        if (!printess.showTabNavigation() && !printess.hasPreviewBackButton()) {
            container.appendChild(hr);
        }
        const grid = document.createElement("div");
        grid.className = "desktop-title-bar mb-2";
        const cur = printess.getStep();
        const hd = printess.stepHeaderDisplay();
        if (cur && printess.isCurrentStepActive() && hd !== "never") {
            if (hd === "only title" || hd === "title and badge") {
                grid.classList.add("active-step");
                if (hd === "only title") {
                    grid.appendChild(document.createElement("div"));
                }
                else {
                    grid.appendChild(getStepBadge((cur.index + 1).toString()));
                }
                const h2 = document.createElement("h2");
                h2.style.flexGrow = "1";
                h2.className = "mb-0";
                h2.style.display = uih_currentPriceDisplay ? "none" : "hidden";
                h2.innerText = printess.gl(cur.title) || printess.gl("ui.step") + (cur.index + 1);
                grid.appendChild(h2);
            }
            else if (hd === "badge list" || hd === "tabs list") {
                grid.classList.add("active-step");
                grid.appendChild(document.createElement("div"));
                const h2 = document.createElement("h2");
                h2.style.flexGrow = "1";
                h2.className = "mb-0";
                h2.innerText = printess.gl(cur.title) || printess.gl("ui.step") + (cur.index + 1);
                grid.appendChild(h2);
            }
            else {
                grid.classList.add("active-step-only-badge");
                grid.appendChild(document.createElement("div"));
            }
        }
        else {
            grid.classList.add("steps");
            const h2 = document.createElement("h2");
            h2.style.flexGrow = "1";
            h2.style.display = uih_currentPriceDisplay ? "none" : "hidden";
            h2.className = "mb-0";
            h2.innerText = printess.getTemplateTitle();
            grid.appendChild(h2);
        }
        if (hd === "only badge" && cur && printess.isCurrentStepActive()) {
            const div = document.createElement("div");
            div.className = "step-n-of";
            const text1 = document.createElement("h2");
            text1.innerText = printess.gl("ui.step");
            const badge = getStepBadge((cur.index + 1).toString());
            const text2 = document.createElement("h2");
            text2.innerText = printess.gl("ui.of");
            const badge2 = getStepBadge((((_b = (_a = printess.lastStep()) === null || _a === void 0 ? void 0 : _a.index) !== null && _b !== void 0 ? _b : 0) + 1).toString());
            badge2.classList.add("gray");
            div.appendChild(text1);
            div.appendChild(badge);
            div.appendChild(text2);
            div.appendChild(badge2);
            grid.appendChild(div);
        }
        const priceDiv = document.createElement("div");
        priceDiv.className = "total-price-container";
        priceDiv.id = "total-price-display";
        if (uih_currentPriceDisplay) {
            getPriceDisplay(printess, priceDiv, uih_currentPriceDisplay);
        }
        else if (printess.getProductInfoUrl()) {
            const infoIcon = printess.getIcon("info-circle");
            infoIcon.classList.add("product-info-icon");
            infoIcon.onclick = () => getIframeOverlay(printess, printess.gl("ui.productOverview"), printess.getProductInfoUrl(), false);
            priceDiv.appendChild(infoIcon);
        }
        grid.appendChild(priceDiv);
        if (printess.hasPreviousStep()) {
            const prevStep = document.createElement("button");
            prevStep.className = "btn btn-outline-primary me-1";
            const svg = printess.getIcon("arrow-left");
            svg.style.width = "18px";
            svg.style.verticalAlign = "sub";
            prevStep.appendChild(svg);
            prevStep.onclick = () => printess.previousStep();
            grid.appendChild(prevStep);
        }
        else {
            grid.appendChild(document.createElement("div"));
        }
        if (printess.hasNextStep()) {
            const wrapper = document.createElement("div");
            wrapper.style.display = "flex";
            wrapper.style.flexDirection = "row";
            const nextStep = document.createElement("button");
            nextStep.className = "btn btn-outline-primary";
            if (printess.isNextStepPreview()) {
                nextStep.innerText = printess.gl("ui.buttonPreview");
            }
            else {
                const svg = printess.getIcon("arrow-right");
                svg.style.width = "18px";
                svg.style.verticalAlign = "sub";
                nextStep.appendChild(svg);
            }
            nextStep.onclick = () => __awaiter(this, void 0, void 0, function* () { return yield gotoNextStep(printess); });
            wrapper.appendChild(nextStep);
            if (printess.showSaveAndCloseButton()) {
                const saveAndQuitButton = document.createElement("button");
                saveAndQuitButton.className = "btn btn-primary ms-2 me-2";
                saveAndQuitButton.textContent = printess.gl("ui.buttonSaveAndClose");
                saveAndQuitButton.onclick = () => saveTemplate(printess, "close");
                wrapper.appendChild(saveAndQuitButton);
            }
            grid.appendChild(wrapper);
        }
        else {
            const wrapper = document.createElement("div");
            wrapper.style.display = "flex";
            wrapper.style.flexDirection = "row";
            if (printess.showSaveAndCloseButton()) {
                const saveAndQuitButton = document.createElement("button");
                saveAndQuitButton.className = "btn btn-primary me-2";
                saveAndQuitButton.textContent = printess.gl("ui.buttonSaveAndClose");
                saveAndQuitButton.onclick = () => saveTemplate(printess, "close");
                wrapper.appendChild(saveAndQuitButton);
            }
            if (!printess.showAddToBasketButton()) {
                wrapper.appendChild(document.createElement("div"));
            }
            else {
                wrapper.appendChild(getStepsPutToBasketButton(printess));
            }
            grid.appendChild(wrapper);
        }
        container.appendChild(grid);
        if (!printess.showTabNavigation() && !printess.hasPreviewBackButton()) {
            container.appendChild(hr);
        }
        return container;
    }
    function getStepBadge(content) {
        const badge = document.createElement("div");
        badge.className = "step-badge";
        if (typeof content === "string") {
            badge.innerText = content;
        }
        else {
            badge.appendChild(content);
        }
        return badge;
    }
    function getCurrentTab(printess, value, forMobile = true) {
        const isDocTabs = printess.pageNavigationDisplay() === "doc-tabs";
        const isStepTabsList = printess.stepHeaderDisplay() === "tabs list";
        const isStepBadgeList = printess.stepHeaderDisplay() === "badge list";
        if (isDocTabs || isStepTabsList || isStepBadgeList) {
            const tabsListScrollbar = document.getElementById("tabs-list-scrollbar");
            const curStepTab = document.getElementById("tab-step-" + value);
            setTabScrollPosition(tabsListScrollbar, curStepTab, forMobile);
        }
    }
    function setTabScrollPosition(tabsListScrollbar, tab, forMobile) {
        const stepTabs = document.getElementById("step-tab-list");
        uih_stepTabsScrollPosition = tabsListScrollbar.scrollLeft;
        if (stepTabs && tab && stepTabs.offsetWidth / tab.offsetLeft < 2) {
            if (forMobile) {
                uih_stepTabOffset = tab.offsetLeft - (stepTabs.offsetWidth / 2) + (tab.clientWidth / 2);
            }
            else {
                uih_stepTabOffset = tab.offsetLeft - (stepTabs.offsetWidth / 2) + 40 + (tab.clientWidth / 2);
            }
        }
        else {
            uih_stepTabOffset = 0;
        }
    }
    function getStepsTabsList(printess, _forMobile = false, displayType) {
        var _a, _b, _c, _d, _f, _g;
        const docs = displayType === "doc tabs" ? printess.getAllDocsAndSpreads() : [];
        const div = document.createElement("div");
        div.className = "tabs-list";
        div.id = "tabs-list-scrollbar";
        const isDesktopTabs = (!_forMobile && (displayType === "tabs list" || displayType === "doc tabs"));
        const ul = document.createElement("ul");
        ul.className = "nav nav-tabs flex-nowrap " + (_forMobile ? "" : "step-tabs-desktop");
        if (displayType === "badge list")
            ul.style.borderBottomColor = "var(--bs-white)";
        if (displayType === "badge list" && _forMobile) {
            const prev = document.createElement("li");
            prev.className = "nav-item tab-item badge-item";
            const prevLink = document.createElement("a");
            prevLink.className = "nav-link badge-link prev-badge";
            if (!printess.hasPreviousStep())
                prevLink.classList.add("disabled");
            const icon = printess.getIcon("carret-left-solid");
            icon.style.width = "25px";
            icon.style.height = "25px";
            icon.style.paddingRight = "2px";
            prev.onclick = () => {
                var _a;
                const curStepTab = document.getElementById("tab-step-" + (Number((_a = printess.getStep()) === null || _a === void 0 ? void 0 : _a.index) - 1));
                setTabScrollPosition(div, curStepTab, _forMobile);
                printess.previousStep();
            };
            prevLink.appendChild(icon);
            prev.appendChild(prevLink);
            ul.appendChild(prev);
        }
        let curIndex = -1;
        let maxIndex = 0;
        if (displayType === "doc tabs") {
            curIndex = 0;
            for (let idx = 0; idx < docs.length; idx++) {
                if (docs[idx].docId === printess.getCurrentDocumentId()) {
                    curIndex = idx;
                }
            }
            maxIndex = docs.length - 1;
        }
        else {
            curIndex = (_b = (_a = printess.getStep()) === null || _a === void 0 ? void 0 : _a.index) !== null && _b !== void 0 ? _b : -1;
            maxIndex = (_d = (_c = printess.lastStep()) === null || _c === void 0 ? void 0 : _c.index) !== null && _d !== void 0 ? _d : 0;
        }
        if (curIndex >= 0) {
            for (let i = 0; i <= (maxIndex); i++) {
                const tab = document.createElement("li");
                tab.className = "nav-item " + (isDesktopTabs ? "" : "tab-item");
                if (displayType === "badge list")
                    tab.classList.add("badge-item");
                tab.id = "tab-step-" + i;
                if (maxIndex < 2) {
                    tab.style.maxWidth = "100%";
                    tab.style.width = (1 / (maxIndex + 1) * 100).toFixed(0) + "%";
                }
                const tabLink = document.createElement("a");
                tabLink.className = "nav-link text-truncate ";
                if (maxIndex < 2) {
                    tabLink.style.maxWidth = "none";
                }
                if (displayType === "badge list")
                    tabLink.classList.add("badge-link");
                if (curIndex === i) {
                    if (isDesktopTabs) {
                        tab.classList.add("active");
                        tabLink.classList.add("active");
                    }
                    else {
                        tab.classList.add("active-step-tab");
                        tabLink.classList.add("active-step-tablink");
                    }
                }
                else {
                    if (isDesktopTabs) {
                        tab.classList.remove("active");
                        tabLink.classList.remove("active");
                    }
                    else {
                        tab.classList.remove("active-step-tab");
                        tabLink.classList.remove("active-step-tab");
                    }
                }
                let stepTitle = "";
                if (displayType === "doc tabs") {
                    stepTitle = docs[i].docTitle;
                }
                else {
                    stepTitle = (_g = (_f = printess.getStepByIndex(i)) === null || _f === void 0 ? void 0 : _f.title) !== null && _g !== void 0 ? _g : "";
                }
                tabLink.innerText = stepTitle.length === 0 || displayType === "badge list" ? (i + 1).toString() : stepTitle;
                tab.appendChild(tabLink);
                tab.onclick = () => __awaiter(this, void 0, void 0, function* () {
                    const comingFromPreview = printess.hasPreviewBackButton();
                    setTabScrollPosition(div, tab, _forMobile);
                    if (displayType === "doc tabs") {
                        yield printess.selectDocumentAndSpread(docs[i].docId, 0);
                    }
                    else {
                        yield gotoStep(printess, i);
                    }
                    if (printess.hasPreviewBackButton()) {
                        printess.resizePrintess();
                    }
                    if (comingFromPreview) {
                        printess.resizePrintess();
                    }
                });
                ul.appendChild(tab);
            }
        }
        if (displayType === "badge list" && _forMobile) {
            const next = document.createElement("li");
            next.className = "nav-item tab-item badge-item";
            const nextLink = document.createElement("a");
            nextLink.className = "nav-link badge-link next-badge";
            if (!printess.hasNextStep())
                nextLink.classList.add("disabled");
            const icon = printess.getIcon("carret-right-solid");
            icon.style.width = "25px";
            icon.style.height = "25px";
            icon.style.paddingLeft = "2px";
            next.onclick = () => {
                var _a;
                const curStepTab = document.getElementById("tab-step-" + (Number((_a = printess.getStep()) === null || _a === void 0 ? void 0 : _a.index) + 1));
                setTabScrollPosition(div, curStepTab, _forMobile);
                printess.nextStep();
            };
            nextLink.appendChild(icon);
            next.appendChild(nextLink);
            ul.appendChild(next);
        }
        scrollToLeft(div, uih_stepTabOffset, 300, uih_stepTabsScrollPosition);
        div.appendChild(ul);
        return div;
    }
    function getStepsPutToBasketButton(printess) {
        const basketButton = document.createElement("button");
        basketButton.className = "btn btn-primary printess-basket-button";
        basketButton.style.whiteSpace = "nowrap";
        basketButton.innerText = printess.userInBuyerSide() ? printess.gl("ui.buttonPrint") : printess.gl("ui.buttonBasket");
        basketButton.onclick = () => addToBasket(printess);
        return basketButton;
    }
    function getTextArea(printess, p, forMobile) {
        const inp = document.createElement("textarea");
        inp.value = p.value.toString();
        inp.autocomplete = "off";
        inp.rows = 6;
        inp.placeholder = printess.gl("errors.enterText");
        inp.oninput = () => __awaiter(this, void 0, void 0, function* () {
            yield printess.setProperty(p.id, inp.value).then(() => setPropertyVisibilities(printess));
            p.value = inp.value;
            validate(printess, p);
            const mobileButtonDiv = document.getElementById(p.id + ":");
            if (mobileButtonDiv) {
                drawButtonContent(printess, mobileButtonDiv, [p], p.controlGroup);
            }
        });
        inp.onfocus = () => {
            if (inp.value && p.validation && p.validation.clearOnFocus && inp.value === p.validation.defaultValue) {
                inp.value = "";
            }
            else {
                window.setTimeout(() => !printess.isIPhone() && inp.select(), 0);
            }
            if (!forMobile && printess.zoomToFrames()) {
                printess.setZoomMode("frame");
                printess.centerSelection();
            }
        };
        inp.onblur = () => {
            if (!forMobile && printess.zoomToFrames()) {
                printess.setZoomMode("spread");
                printess.centerSelection();
            }
        };
        if (forMobile) {
            inp.className = "mobile-text-area";
            return addLabel(printess, p, inp, p.id, forMobile, p.kind, p.label);
        }
        else {
            inp.className = "desktop-text-area";
            return addLabel(printess, p, inp, p.id, forMobile, p.kind, p.label);
        }
    }
    function addLabel(printess, p, input, id, forMobile, kind, label, hasMaxChars = false, inControlGroup = false) {
        var _a, _b;
        input.classList.add("form-control");
        if (label === "Single Line Text") {
            label = "";
        }
        const container = document.createElement("div");
        container.className = "printess-" + kind;
        if ((_a = p === null || p === void 0 ? void 0 : p.imageMeta) === null || _a === void 0 ? void 0 : _a.isHandwriting) {
            container.classList.add("mb-1");
        }
        else if (!forMobile && !((_b = p === null || p === void 0 ? void 0 : p.textStyle) === null || _b === void 0 ? void 0 : _b.allows.includes("handWriting"))) {
            container.classList.add("mb-3");
        }
        container.id = "cnt_" + id;
        container.setAttribute("data-visibility-id", id.replace("#", "_hash_"));
        container.style.display = printess.isPropertyVisible(id) || kind === "image" ? "block" : "none";
        const infoText = (p === null || p === void 0 ? void 0 : p.info) ? printess.gl(p.info) : "";
        if (label) {
            if (label.trim() === "")
                label = "&nbsp;";
            const htmlLabel = document.createElement("label");
            htmlLabel.className = "form-label";
            htmlLabel.setAttribute("for", "inp_" + id.replace("#", "-HASH-"));
            htmlLabel.innerHTML = printess.gl(label) || "";
            htmlLabel.style.display = forMobile ? "none" : "inline-block";
            if (inControlGroup) {
                htmlLabel.style.fontSize = "0.85em";
                htmlLabel.style.opacity = "0.7";
            }
            if (infoIsWebLink(infoText)) {
                const infoIcon = printess.getIcon("info-circle");
                infoIcon.classList.add("price-info-icon");
                infoIcon.style.alignSelf = "center";
                infoIcon.onclick = () => {
                    label = label ? printess.gl(label) : "Info";
                    getIframeOverlay(printess, printess.gl(label), infoText.trim(), forMobile);
                };
                htmlLabel.style.display = "flex";
                htmlLabel.appendChild(infoIcon);
            }
            if (kind === "image" && !forMobile) {
                const button = document.createElement("button");
                button.className = "btn btn-primary image-upload-btn";
                button.id = "upload-btn-" + id;
                htmlLabel.className = "image-upload-label";
                button.appendChild(htmlLabel);
                container.appendChild(button);
            }
            else if (kind === "image" && forMobile) {
                const upload = document.createElement("button");
                upload.className = "btn btn-outline-primary upload-image-btn";
                upload.id = "upload-btn-" + id;
                upload.textContent = printess.gl(label);
                upload.style.position = "relative";
                const uploadIcon = printess.getIcon("cloud-upload-light");
                uploadIcon.style.height = "50px";
                const uploadLabel = document.createElement("label");
                uploadLabel.className = "image-upload-label-mobile";
                uploadLabel.setAttribute("for", "inp_" + id.replace("#", "-HASH-"));
                upload.appendChild(uploadIcon);
                upload.appendChild(uploadLabel);
                container.appendChild(upload);
            }
            else {
                container.appendChild(htmlLabel);
            }
        }
        input.id = "inp_" + id.replace("#", "-HASH-");
        container.appendChild(input);
        const validation = document.createElement("div");
        validation.id = "val_" + id;
        validation.classList.add("invalid-feedback");
        validation.innerText = printess.gl("errors.textMissingInline");
        if (kind !== "image" && kind !== "table")
            container.appendChild(validation);
        if (hasMaxChars)
            getCharValidationLabel(printess, id, container);
        if (infoText && (p === null || p === void 0 ? void 0 : p.kind) !== "table" && !infoIsWebLink(infoText)) {
            const inf = document.createElement("p");
            inf.innerHTML = getLegalNoticeText(printess, infoText, forMobile, label || "link_" + id);
            inf.style.fontSize = "0.875rem";
            inf.style.marginTop = "0.25rem";
            container.appendChild(inf);
        }
        return container;
    }
    function infoIsWebLink(info) {
        const infoArr = info.trim().split(" ");
        if (infoArr.length === 1 && infoArr[0].toLowerCase().startsWith("http")) {
            return true;
        }
        return false;
    }
    function getCharValidationLabel(printess, id, container) {
        const validation = document.createElement("div");
        validation.id = "char_" + id;
        validation.className = "chars-remaining";
        validation.innerText = "";
        if (container)
            container.appendChild(validation);
    }
    function validate(printess, p, error, cell) {
        var _a;
        const cellName = (_a = cell === null || cell === void 0 ? void 0 : cell.name) !== null && _a !== void 0 ? _a : "";
        if (p.validation) {
            const container = document.getElementById("cnt_" + p.id + cellName);
            const input = document.getElementById("inp_" + p.id.replace("#", "-HASH-") + cellName);
            const validation = document.getElementById("val_" + p.id);
            const charValidation = document.getElementById("char_" + p.id + cellName);
            if (charValidation && p.controlGroup === 0) {
                if (p.validation.maxChars && p.value.toString().length <= p.validation.maxChars && (p.value && p.value !== p.validation.defaultValue)) {
                    charValidation.innerText = printess.gl("errors.maxCharsLeftInline", p.validation.maxChars - p.value.toString().length);
                }
                else if (p.kind === "table" && cell && cell.maxChar > 0) {
                    charValidation.innerText = printess.gl("errors.maxCharsLeftInline", cell.maxChar - cell.value.toString().length);
                }
                else {
                    charValidation.innerText = "";
                }
            }
            if (container && input && validation) {
                if (p.validation.isMandatory && (!p.value || p.value === p.validation.defaultValue)) {
                    input.classList.add("is-invalid");
                    validation.innerText = printess.gl("errors.enterText");
                    return;
                }
                if (p.validation.maxChars) {
                    if (p.value.toString().length > p.validation.maxChars) {
                        input.classList.add("is-invalid");
                        validation.innerText = printess.gl("errors.maxCharsExceededInline", p.validation.maxChars);
                        return;
                    }
                }
                if (p.kind === "multi-line-text") {
                    window.setTimeout(() => {
                        uih_lastOverflowState = printess.hasTextOverflow(p.id);
                        if (uih_lastOverflowState) {
                            input.classList.add("is-invalid");
                            validation.innerText = printess.gl("errors.textOverflowShort");
                        }
                        else {
                            input.classList.remove("is-invalid");
                        }
                    }, 500);
                    if (uih_lastOverflowState) {
                        input.classList.add("is-invalid");
                        validation.innerText = printess.gl("errors.textOverflowShort");
                        return;
                    }
                }
                if (p.kind === "table" && error) {
                    input.classList.add("is-invalid");
                    validation.classList.add("table-validation-message");
                    validation.innerHTML = "";
                    const icon = printess.getIcon("info-circle");
                    const msg = document.createElement("span");
                    msg.innerText = printess.gl("errors." + error.errorCode, error.errorValue1);
                    validation.appendChild(icon);
                    validation.appendChild(msg);
                    return;
                }
                if (p.validation.regExp) {
                    try {
                        const regex = createValidationRegex(p.validation.regExp);
                        if (!regex.test(p.value.toString())) {
                            input.classList.add("is-invalid");
                            validation.innerText = printess.gl(p.validation.regExpMessage);
                            return;
                        }
                    }
                    catch (_b) {
                    }
                }
                input.classList.remove("is-invalid");
                if (p.kind === "table")
                    validation.classList.remove("table-validation-message");
            }
        }
        return;
    }
    function setPropertyVisibilities(printess) {
        for (const p of uih_currentProperties) {
            if (p.validation && p.validation.visibility !== "always") {
                const div = document.querySelector(`[data-visibility-id=${p.id.replace("#", "_hash_")}]`);
                if (div) {
                    const v = printess.isPropertyVisible(p.id, div.style.display === "block" || div.style.display === "flex");
                    if (v) {
                        if (div.style.display === "none") {
                            div.style.display = div.id.startsWith("color_") ? "flex" : "block";
                        }
                    }
                    else {
                        div.style.display = "none";
                    }
                }
                else {
                    const div = document.getElementById(p.id + ":") || document.querySelector(`[id^="${p.id}$$$"]`);
                    const nextRecord = document.getElementById("nextRecordButton:");
                    const prevRecord = document.getElementById("previousRecordButton:");
                    if (div) {
                        const v = printess.isPropertyVisible(p.id);
                        if (v) {
                            if (div.style.display === "none") {
                                if (div.classList.contains("mobile-property-text")) {
                                    div.style.display = "flex";
                                }
                                else {
                                    div.style.display = "grid";
                                }
                                if (nextRecord)
                                    nextRecord.style.display = "grid";
                                if (prevRecord)
                                    prevRecord.style.display = "grid";
                            }
                        }
                        else {
                            div.style.display = "none";
                            if (nextRecord)
                                nextRecord.style.display = "none";
                            if (prevRecord)
                                prevRecord.style.display = "none";
                        }
                    }
                }
            }
        }
    }
    function getImageSelectList(printess, p, forMobile) {
        var _a, _b, _c;
        const container = document.createElement("div");
        if (p.listMeta && p.listMeta.list) {
            const cssId = p.id.replace("#", "-");
            if (p.listMeta.imageCss) {
                const st = document.createElement("style");
                const css = p.listMeta.imageCss.replace(/\.image/g, ".image" + cssId);
                st.innerHTML = css.split("\n").join("");
                container.appendChild(st);
            }
            const imageList = document.createElement("div");
            imageList.classList.add("image-select-list");
            for (const entry of p.listMeta.list) {
                const thumb = document.createElement("div");
                thumb.className = "no-selection image" + cssId;
                thumb.style.position = "relative";
                if (entry.imageUrl) {
                    thumb.style.backgroundImage = "url('" + entry.imageUrl + "')";
                }
                else if (p.kind === "color-list") {
                    thumb.style.backgroundColor = entry.key;
                }
                if (!entry.enabled) {
                    thumb.classList.add("disabled");
                }
                thumb.style.width = p.listMeta.thumbWidth + "px";
                thumb.style.height = p.listMeta.thumbHeight + "px";
                if (entry.key === p.value && entry.enabled) {
                    thumb.classList.add("selected");
                }
                thumb.onclick = () => {
                    printess.setProperty(p.id, entry.key).then(() => setPropertyVisibilities(printess));
                    imageList.childNodes.forEach((c) => c.classList.remove("selected"));
                    thumb.classList.add("selected");
                    p.value = entry.key;
                    const mobileButtonDiv = document.getElementById(p.id + ":");
                    if (mobileButtonDiv) {
                        drawButtonContent(printess, mobileButtonDiv, [p], p.controlGroup);
                    }
                    const labelText = document.querySelector("label[for='inp_" + p.id + "']");
                    if (labelText) {
                        labelText.textContent = entry.label && !entry.label.startsWith("#") ? printess.gl(p.label) + " - " + printess.gl(entry.label) : printess.gl(p.label);
                    }
                };
                const priceLabel = printess.getFormFieldPriceLabelByTag(entry.tag, p.id);
                if (priceLabel) {
                    const priceBadge = document.createElement("div");
                    priceBadge.className = "badge bg-primary";
                    priceBadge.textContent = printess.gl(priceLabel);
                    thumb.appendChild(priceBadge);
                }
                imageList.appendChild(thumb);
            }
            container.appendChild(imageList);
        }
        const label = (_c = (_b = (_a = p.listMeta) === null || _a === void 0 ? void 0 : _a.list) === null || _b === void 0 ? void 0 : _b.filter(e => (e.key === p.value && e.enabled))[0]) === null || _c === void 0 ? void 0 : _c.label;
        const caption = label && !label.startsWith("#") ? printess.gl(p.label) + " - " + printess.gl(label) : p.label;
        if (forMobile) {
            return container;
        }
        else {
            return addLabel(printess, p, container, p.id, forMobile, p.kind, caption);
        }
    }
    function hexToRgb(hexColor) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);
        return result ? `rgb(${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)})` : hexColor;
    }
    function getColorDropDown(printess, p, metaProperty, forMobile = false, dropdown) {
        if (!dropdown) {
            dropdown = document.createElement("div");
            dropdown.id = "color_" + p.id;
            dropdown.setAttribute("data-visibility-id", p.id.replace("#", "_hash_"));
            dropdown.className = "btn-group me-1";
        }
        const colors = printess.getColors(p.id);
        const button = document.createElement("button");
        const curColor = (metaProperty === "color" && p.textStyle) ? p.textStyle.color : p.value.toString();
        const curColorSwatch = colors.filter(c => c.name === curColor)[0];
        const curColorRgb = curColorSwatch ? curColorSwatch.color : hexToRgb(curColor);
        const ffColor = p.id.startsWith("FF_") && uih_currentProperties.filter(p => p.kind === "color" && !p.id.startsWith("FF_")).length === 0;
        if (!forMobile) {
            button.className = "btn btn-light dropdown-toggle btn-color-select";
            button.dataset.bsToggle = "dropdown";
            button.dataset.bsAutoClose = "true";
            button.setAttribute("aria-expanded", "false");
            button.style.backgroundColor = curColorRgb;
            window.setTimeout(() => {
                var _a;
                const caret = (_a = button.parentElement) === null || _a === void 0 ? void 0 : _a.querySelector(".dropdown-toggle:empty");
                if (caret)
                    caret.style.color = printess.invertColor(curColor, true);
            }, 20);
            if (p.value === "transparent") {
                const redLine = document.createElement("div");
                redLine.id = "red-line-" + p.id;
                redLine.className = "red-line-for-transparent-color";
                redLine.style.width = "33px";
                redLine.style.top = "18px";
                button.appendChild(redLine);
            }
            dropdown.appendChild(button);
            if (ffColor) {
                dropdown.className = "btn-group form-control me-1 printess-color-label";
                const colorProps = uih_currentProperties.filter(p => p.kind === "color");
                if (colorProps.length && colorProps[colorProps.length - 1].id === p.id) {
                    dropdown.classList.add("mb-3");
                }
                button.classList.add("me-2");
                const label = document.createElement("div");
                label.className = "color-formfield-label";
                label.textContent = printess.gl(p.label);
                label.dataset.bsToggle = "dropdown";
                label.dataset.bsAutoClose = "true";
                label.setAttribute("aria-expanded", "false");
                dropdown.appendChild(label);
                const flexBreak = document.createElement("div");
                flexBreak.className = "d-flex w-100";
                dropdown.insertAdjacentElement("beforebegin", flexBreak);
            }
        }
        const ddContent = document.createElement("div");
        ddContent.className = "dropdown-menu";
        ddContent.setAttribute("aria-labelledby", "defaultDropdown");
        ddContent.style.width = !forMobile && ffColor ? "auto" : "240px";
        const colorList = document.createElement("div");
        colorList.className = "color-picker-drop-down";
        if (forMobile) {
            colorList.style.paddingRight = "30px";
        }
        if (printess.enableCustomColors()) {
        }
        for (const f of colors) {
            const color = document.createElement("a");
            color.className = "color-picker-color dropdown-item";
            color.style.backgroundColor = f.color;
            color.dataset.color = f.name;
            const isCustom = f.name.includes("custom color");
            color.title = isCustom ? "custom color" : f.name;
            if (f.color === curColorRgb && (!isCustom || !curColorSwatch)) {
                color.classList.add("selected");
            }
            if (f.color.toLowerCase() === "transparent") {
                const redLine = document.createElement("div");
                redLine.id = (f.name.includes("custom color") ? "custom-" : "") + "red-line-picker-" + p.id;
                redLine.className = "red-line-for-transparent-color";
                color.appendChild(redLine);
            }
            color.onclick = () => {
                var _a;
                if (f.name.includes("custom color")) {
                    return;
                }
                setColor(printess, p, f.color, f.name, metaProperty);
                const colorInput = document.getElementById("hex-color-input_" + p.id);
                const hexColor = printess.getHexColor(f.color);
                if (colorInput && hexColor) {
                    colorInput.value = hexColor;
                    colorInput.style.backgroundColor = hexColor;
                    colorInput.style.color = printess.invertColor(hexColor, true);
                }
                colorList.querySelectorAll(".selected").forEach(c => c.classList.remove("selected"));
                color.classList.add("selected");
                if (!forMobile) {
                    let redLine = document.getElementById("red-line-" + p.id);
                    if (redLine && f.color !== "transparent") {
                        redLine.remove();
                    }
                    else if (!redLine && f.color === "transparent") {
                        redLine = document.createElement("div");
                        redLine.id = "red-line-" + p.id;
                        redLine.className = "red-line-for-transparent-color";
                        redLine.style.width = "33px";
                        redLine.style.top = "18px";
                        button.appendChild(redLine);
                    }
                    button.style.backgroundColor = f.color;
                    const caret = (_a = button.parentElement) === null || _a === void 0 ? void 0 : _a.querySelector(".dropdown-toggle:empty");
                    if (caret)
                        caret.style.color = printess.invertColor(f.color, true);
                }
            };
            colorList.appendChild(color);
        }
        if (printess.enableCustomColors()) {
            colorList.appendChild(getCustomColorPicker(printess, p, forMobile, colorList, button, curColorSwatch ? curColorSwatch.color : curColor, metaProperty));
        }
        const caption = printess.gl("ui.colorDropDownCaption");
        let container = document.getElementById("printess-color-label");
        if (printess.showTextStyleCaptions() && uih_currentRender === "desktop") {
            ddContent.appendChild(colorList);
            dropdown.appendChild(ddContent);
            const content = forMobile ? colorList : dropdown;
            if (container) {
                container.appendChild(content);
            }
            else {
                container = getDropDownCaption(content, caption);
                container.id = "printess-color-label";
            }
            container.style.display = printess.isPropertyVisible(p.id) ? "flex" : "none";
            return container;
        }
        if (forMobile) {
            return colorList;
        }
        else {
            ddContent.appendChild(colorList);
            dropdown.appendChild(ddContent);
            dropdown.style.display = printess.isPropertyVisible(p.id) ? "flex" : "none";
            return dropdown;
        }
    }
    function setColor(printess, p, color, name, metaProperty) {
        return __awaiter(this, void 0, void 0, function* () {
            if (metaProperty === "color") {
                printess.setTextStyleProperty(p.id, metaProperty, name);
                const mobileButtonDiv = document.getElementById(p.id + ":color") || document.getElementById(p.id + ":text-style-color");
                if (mobileButtonDiv && p.textStyle) {
                    p.textStyle.color = color;
                    drawButtonContent(printess, mobileButtonDiv, [p], p.controlGroup);
                }
            }
            else {
                yield printess.setProperty(p.id, name).then(() => setPropertyVisibilities(printess));
                p.value = color;
                const mobileButtonDiv = document.getElementById(p.id + ":" + (metaProperty !== null && metaProperty !== void 0 ? metaProperty : ""));
                if (mobileButtonDiv) {
                    drawButtonContent(printess, mobileButtonDiv, [p], p.controlGroup);
                }
            }
        });
    }
    function getCustomColorPicker(printess, p, forMobile, colorList, button, curColor, metaProperty) {
        const hexGroup = document.createElement("div");
        hexGroup.className = "input-group input-group-sm mt-3 mb-2 ms-1 me-1 w-100";
        const hexPicker = document.createElement("span");
        hexPicker.className = "input-group-text";
        hexPicker.style.cursor = "pointer";
        const hexIcon = printess.getIcon("eye-dropper-light");
        hexIcon.style.height = "20px";
        const hexInput = document.createElement("input");
        hexInput.className = "form-control";
        hexInput.id = "hex-color-input_" + p.id;
        hexInput.type = "text";
        hexInput.placeholder = "#000000";
        hexInput.value = curColor;
        hexInput.maxLength = 7;
        const submitHex = document.createElement("button");
        submitHex.className = "btn btn-primary";
        const extColor = printess.getColorInfo(p);
        if (!extColor) {
            console.error("Color not found for property: " + p.id, p);
        }
        else {
            submitHex.innerText = printess.gl("ui.buttonMoreColors");
            hexInput.style.cursor = "pointer";
            hexInput.style.backgroundColor = curColor;
            hexInput.style.color = printess.invertColor(curColor, true);
            hexInput.style.borderColor = "black";
            submitHex.style.borderColor = "black";
            hexPicker.style.borderColor = "black";
            if (extColor.mode === "cmyk") {
                hexInput.value = extColor.label;
            }
            hexInput.onclick = submitHex.onclick = (e) => {
                e.stopImmediatePropagation();
                printess.showColorDialog(p).then(r => {
                    if (r) {
                        const rgb = "rgb(" + r.r + "," + r.g + "," + r.b + ")";
                        colorList.querySelectorAll(".selected").forEach(c => c.classList.remove("selected"));
                        const colorItem = document.querySelector(`a[data-color='custom color_${p.id}']`);
                        if (colorItem) {
                            colorItem.classList.add("selected");
                            colorItem.style.backgroundColor = rgb;
                        }
                        else if (p.id.startsWith("FF_")) {
                            const colorButton = document.querySelector(`#color_${p.id} > button`);
                            if (colorButton) {
                                colorButton.style.backgroundColor = rgb;
                            }
                        }
                        hexInput.value = r.label;
                        hexInput.style.backgroundColor = rgb;
                        hexInput.style.color = printess.invertColor(rgb, true);
                    }
                });
            };
        }
        hexPicker.onclick = () => __awaiter(this, void 0, void 0, function* () {
            const colorInput = document.getElementById("hex-color-input_" + p.id);
            try {
                const eyeDropper = new EyeDropper();
                const { sRGBHex: color } = yield eyeDropper.open();
                if (color) {
                    colorInput.value = color;
                    const colorItem = document.querySelector(`a[data-color='custom color_${p.id}']`);
                    if (colorItem) {
                        colorList.querySelectorAll(".selected").forEach(c => c.classList.remove("selected"));
                        colorItem.classList.add("selected");
                        colorItem.style.backgroundColor = color;
                    }
                    setColor(printess, p, color, color, metaProperty);
                    const redLine = document.getElementById("custom-red-line-picker-" + p.id);
                    if (redLine)
                        redLine.remove();
                    if (!forMobile) {
                        const buttonRedLine = document.getElementById("red-line-" + p.id);
                        if (buttonRedLine)
                            buttonRedLine.remove();
                        button.style.backgroundColor = color;
                    }
                }
            }
            catch (error) {
                alert("Sorry, eye-dropper tool is only available in Chrome Desktop.");
            }
        });
        hexPicker.appendChild(hexIcon);
        hexGroup.appendChild(hexPicker);
        hexGroup.appendChild(hexInput);
        hexGroup.appendChild(submitHex);
        return hexGroup;
    }
    function getDropDown(printess, p, asList, fullWidth = true, addInfo = false) {
        var _a;
        const dropdown = document.createElement("div");
        dropdown.classList.add("btn-group");
        if (p.controlGroup > 0 && asList)
            dropdown.classList.add("dropup");
        const ddContent = document.createElement("ul");
        if (p.listMeta && p.listMeta.list) {
            const selectedItem = (_a = p.listMeta.list.filter(itm => (itm.key === p.value && itm.enabled))[0]) !== null && _a !== void 0 ? _a : null;
            const button = document.createElement("button");
            button.className = "btn btn-light dropdown-toggle w-100";
            if (fullWidth) {
                button.classList.add("full-width");
            }
            button.dataset.bsToggle = "dropdown";
            button.dataset.bsAutoClose = "true";
            button.setAttribute("aria-expanded", "false");
            if (selectedItem) {
                button.appendChild(getDropdownItemContent(printess, p.listMeta, selectedItem, addInfo, p));
            }
            dropdown.appendChild(button);
            if (asList) {
                ddContent.classList.add("list-group");
            }
            else {
                ddContent.classList.add("dropdown-menu");
                ddContent.setAttribute("aria-labelledby", "defaultDropdown");
                ddContent.style.width = "100%";
                if (p.listMeta.list.length > 10) {
                    const searchLi = document.createElement("li");
                    const search = document.createElement("input");
                    searchLi.style.fontSize = "11pt";
                    searchLi.style.padding = "2px 12px";
                    search.style.width = "100%";
                    search.placeholder = printess.gl("search");
                    search.addEventListener("input", (_e) => {
                        var _a;
                        const s = search.value.toLowerCase();
                        for (const x of Array.from(ddContent.children)) {
                            const li = x;
                            if (searchLi === li) {
                                continue;
                            }
                            if ((_a = li.dataset.label) === null || _a === void 0 ? void 0 : _a.includes(s)) {
                                li.style.display = "block";
                            }
                            else {
                                li.style.display = "none";
                            }
                        }
                    });
                    searchLi.appendChild(search);
                    ddContent.appendChild(searchLi);
                    dropdown.addEventListener("click", () => {
                        search.focus();
                    });
                }
            }
            for (const entry of p.listMeta.list) {
                const li = document.createElement("li");
                if (asList) {
                    li.classList.add("list-group-item");
                    if (entry === selectedItem) {
                        li.classList.add("active");
                    }
                }
                li.dataset.label = entry.label.toLowerCase();
                const a = document.createElement("a");
                a.classList.add("dropdown-item");
                if (addInfo) {
                    a.classList.add("printess-add-info");
                }
                if (!entry.enabled) {
                    li.classList.add("disabled");
                }
                a.onclick = () => {
                    p.value = entry.key;
                    printess.setProperty(p.id, entry.key).then(() => {
                        setPropertyVisibilities(printess);
                        const mobileButtonDiv = document.getElementById(p.id + ":");
                        if (mobileButtonDiv) {
                            drawButtonContent(printess, mobileButtonDiv, [p], p.controlGroup);
                        }
                    });
                    if (p.listMeta) {
                        button.innerHTML = "";
                        button.appendChild(getDropdownItemContent(printess, p.listMeta, entry, addInfo, p));
                        if (asList) {
                            ddContent.querySelectorAll("li").forEach(li => li.classList.remove("active"));
                            li.classList.add("active");
                        }
                    }
                };
                a.appendChild(getDropdownItemContent(printess, p.listMeta, entry, addInfo, p));
                li.appendChild(a);
                ddContent.appendChild(li);
            }
            dropdown.appendChild(ddContent);
        }
        if (asList) {
            return ddContent;
        }
        else {
            return addLabel(printess, p, dropdown, p.id, false, p.kind, p.label, false, p.controlGroup > 0);
        }
    }
    function getDropdownItemContent(printess, meta, entry, addInfo, p) {
        const div = document.createElement("div");
        div.classList.add("dropdown-list-entry");
        if (entry.imageUrl) {
            let tw = meta.thumbWidth;
            let th = meta.thumbHeight;
            const aspect = tw / th;
            if (th > 50) {
                th = 50;
                tw = th * aspect;
            }
            const img = document.createElement("div");
            img.classList.add("dropdown-list-image");
            img.style.backgroundImage = `url('${entry.imageUrl}')`;
            img.style.minWidth = tw + "px";
            img.style.width = tw + "px";
            img.style.height = th + "px";
            img.style.marginRight = "10px";
            div.appendChild(img);
        }
        if (addInfo) {
            const block = document.createElement("div");
            block.classList.add("dropdown-list-block");
            const label = document.createElement("div");
            label.classList.add("dropdown-list-label");
            label.innerText = printess.gl(entry.label);
            const info = document.createElement("div");
            info.classList.add("dropdown-list-info");
            info.innerText = printess.gl(entry.description);
            block.appendChild(label);
            block.appendChild(info);
            div.appendChild(block);
        }
        else {
            const label = document.createElement("div");
            label.classList.add("dropdown-list-label");
            label.innerText = printess.gl(entry.label);
            div.appendChild(label);
        }
        const priceLabel = printess.getFormFieldPriceLabelByTag(entry.tag, p.id);
        if (priceLabel) {
            const priceBadge = document.createElement("div");
            priceBadge.className = "badge bg-primary";
            priceBadge.style.marginLeft = "auto";
            priceBadge.textContent = printess.gl(priceLabel);
            div.appendChild(priceBadge);
        }
        return div;
    }
    function getTabPanel(printess, tabs, id) {
        const panel = document.createElement("div");
        panel.id = "tabs-panel-" + id;
        panel.setAttribute("data-visibility-id", id.replace("#", "_hash_"));
        const ul = document.createElement("ul");
        ul.className = "nav nav-tabs";
        ul.setAttribute("role", "tablist");
        for (const t of tabs) {
            const li = document.createElement("li");
            li.className = "nav-item";
            li.style.cursor = "pointer";
            const a = document.createElement("a");
            a.className = "nav-link";
            a.innerText = t.title;
            a.dataset.bsToggle = "tab";
            a.dataset.bsTarget = "#tab-" + t.id;
            if (uih_oneTimeShowSplitterLayoutSelection && printess.hasSplitterMenu() && tabs.length > 1 && tabs[1].id === "printess-splitter-layouts") {
                if (t.id === "printess-splitter-layouts") {
                    a.classList.add("active");
                }
            }
            else if (t === tabs[0]) {
                a.classList.add("active");
            }
            li.appendChild(a);
            ul.appendChild(li);
        }
        const content = document.createElement("div");
        content.className = "tab-content card";
        content.style.borderTop = "none";
        for (const t of tabs) {
            const pane = document.createElement("div");
            pane.id = "tab-" + t.id;
            pane.className = "tab-pane card-body fade";
            pane.setAttribute("role", "tabpanel");
            if (uih_oneTimeShowSplitterLayoutSelection && printess.hasSplitterMenu() && tabs.length > 1 && tabs[1].id === "printess-splitter-layouts") {
                if (t.id === "printess-splitter-layouts") {
                    pane.classList.add("show");
                    pane.classList.add("active");
                }
            }
            else if (t === tabs[0]) {
                pane.classList.add("show");
                pane.classList.add("active");
            }
            pane.appendChild(t.content);
            content.appendChild(pane);
        }
        uih_oneTimeShowSplitterLayoutSelection = false;
        panel.appendChild(ul);
        panel.appendChild(content);
        return panel;
    }
    function getImageFilterButtons(printess, p, tags) {
        const div = document.createElement("div");
        printess.getImageFilterSnippets(tags).then((snippets) => {
            const filters = document.createElement("div");
            filters.className = "d-flex flex-wrap mb-3";
            for (const sn of snippets) {
                const img = document.createElement("div");
                img.className = "image-filter-snippet m-1 position-relative border border-dark text-center";
                img.style.backgroundImage = "url('" + sn.thumbUrl + "')";
                img.onclick = () => {
                    printess.applyImageFilterSnippet(sn.snippetUrl);
                };
                const title = document.createElement("div");
                title.className = "image-filter-title";
                title.innerText = sn.title;
                img.appendChild(title);
                filters.append(img);
            }
            div.appendChild(filters);
        });
        return div;
    }
    let lastSelectedGridSize;
    function getGridGapControl(printess, _p) {
        const div = document.createElement("div");
        div.className = "d-flex h-100 justify-content-center align-items-center";
        let btnGroup = document.createElement("div");
        btnGroup.className = "btn-group btn-group-lg";
        btnGroup.setAttribute("role", "group");
        btnGroup.ariaLabel = "Basic radio toggle button group";
        const gaps = [{
            label: "XS", size: 0.3
        }, {
            label: "S", size: 0.6
        }, {
            label: "M", size: 1.1
        }, {
            label: "XL", size: 1.6
        }];
        gaps.forEach(g => {
            const input = document.createElement("input");
            input.className = "btn-check";
            input.id = "btnradio" + g.label;
            input.name = "btnradio";
            input.type = "radio";
            input.autocomplete = "off";
            const label = document.createElement("label");
            label.className = "btn btn-outline-primary";
            label.setAttribute("for", "btnradio" + g.label);
            label.textContent = g.label;
            if (lastSelectedGridSize === g.label) {
                input.checked = true;
            }
            label.onclick = () => {
                lastSelectedGridSize = g.label;
                printess.setSplitterGaps(g.size);
            };
            btnGroup.appendChild(input);
            btnGroup.appendChild(label);
        });
        div.appendChild(btnGroup);
        btnGroup = document.createElement("div");
        btnGroup.className = "btn-group btn-group-lg";
        btnGroup.style.marginLeft = "10px";
        btnGroup.setAttribute("role", "group");
        btnGroup.ariaLabel = "Basic radio toggle button group";
        const hasGapAround = printess.hasGapAround();
        ["border", "no-border"].forEach(g => {
            const input = document.createElement("input");
            input.className = "btn-check";
            input.id = "btnradio" + g;
            input.name = "btnradio-border";
            input.type = "radio";
            input.autocomplete = "off";
            const label = document.createElement("label");
            label.className = "btn btn-outline-primary";
            label.setAttribute("for", "btnradio" + g);
            if (g === "border") {
                label.appendChild(printess.getIcon("add-gap-around"));
            }
            else {
                label.appendChild(printess.getIcon("remove-gap-around"));
            }
            label.style.width = "48px";
            label.style.height = "48px";
            label.style.padding = "6px 10px 14px 10px";
            if ((hasGapAround && g === "border") || (!hasGapAround && g === "no-border")) {
                input.checked = true;
            }
            label.onclick = () => {
                if (g === "border") {
                    printess.addGapAround();
                }
                else {
                    printess.removeGapAround();
                }
            };
            btnGroup.appendChild(input);
            btnGroup.appendChild(label);
        });
        div.appendChild(btnGroup);
        return div;
    }
    function getSplitterSnippets(printess, p) {
        const div = document.createElement("div");
        printess.getSplitterSnippets().then((snippets) => {
            const splittersDiv = document.createElement("div");
            splittersDiv.className = "d-flex flex-wrap mb-3";
            if (uih_currentRender === "mobile") {
                splittersDiv.classList.add("justify-content-center");
            }
            for (const sn of snippets) {
                const img = document.createElement("div");
                img.className = "splitter-content-snippet m-1 position-relative border border-dark text-center";
                img.style.backgroundImage = "url('" + sn.thumbUrl + "')";
                img.onclick = () => {
                    printess.applySplitterCellSnippet(sn.snippetUrl);
                    if (uih_currentRender === "mobile") {
                        hideModal(p.id);
                    }
                };
                splittersDiv.append(img);
            }
            div.appendChild(splittersDiv);
        });
        return div;
    }
    function getImageFilterControl(printess, p, filterDiv, hasReset = true) {
        var _a, _b;
        const container = filterDiv || document.createElement("div");
        const tags = (_a = p.imageMeta) === null || _a === void 0 ? void 0 : _a.filterTags;
        if (!printess.hasSplitterMenu() && ((tags === null || tags === void 0 ? void 0 : tags.length) || printess.hasStaticImageFilters())) {
            container.appendChild(getImageFilterButtons(printess, p, tags !== null && tags !== void 0 ? tags : []));
        }
        (_b = p.imageMeta) === null || _b === void 0 ? void 0 : _b.allows.forEach(metaProperty => {
            switch (metaProperty) {
                case "brightness":
                    container.appendChild(getNumberSlider(printess, p, "image-brightness"));
                    break;
                case "contrast":
                    if (p.imageMeta && p.imageMeta.allows.indexOf("invert") >= 0) {
                        const d = document.createElement("div");
                        d.style.display = "grid";
                        d.style.gridTemplateColumns = "1fr auto";
                        d.style.gap = "9px";
                        d.appendChild(getNumberSlider(printess, p, "image-contrast", true));
                        d.appendChild(getInvertImageChecker(printess, p, "image-invert", false));
                        container.appendChild(d);
                    }
                    else {
                        container.appendChild(getNumberSlider(printess, p, "image-contrast"));
                    }
                    break;
                case "vivid":
                    container.appendChild(getNumberSlider(printess, p, "image-vivid"));
                    break;
                case "sepia":
                    container.appendChild(getNumberSlider(printess, p, "image-sepia"));
                    break;
                case "hueRotate":
                    container.appendChild(getNumberSlider(printess, p, "image-hueRotate"));
                    break;
                case "invert":
                    if (!p.imageMeta || p.imageMeta.allows.indexOf("contrast") === -1) {
                        container.appendChild(getInvertImageChecker(printess, p, "image-invert"));
                    }
                    break;
            }
        });
        if (hasReset) {
            const filterBtn = document.createElement("button");
            filterBtn.className = "btn btn-secondary mt-4 w-100";
            filterBtn.textContent = printess.gl("ui.buttonResetFilter");
            filterBtn.onclick = () => __awaiter(this, void 0, void 0, function* () {
                if (p.imageMeta) {
                    p.imageMeta.brightness = 0;
                    p.imageMeta.sepia = 0;
                    p.imageMeta.hueRotate = 0;
                    p.imageMeta.contrast = 0;
                    p.imageMeta.vivid = 0;
                    p.imageMeta.invert = 0;
                    yield printess.resetImageFilters(p.id, p.imageMeta);
                }
                container.innerHTML = "";
                getImageFilterControl(printess, p, container);
            });
            container.appendChild(filterBtn);
        }
        return container;
    }
    function getSplitterSnippetsControl(printess, p, splitterDiv, _hasReset = true) {
        const container = splitterDiv || document.createElement("div");
        container.appendChild(getSplitterSnippets(printess, p));
        return container;
    }
    function getImageRotateControl(printess, p, forMobile) {
        var _a;
        const container = document.createElement("div");
        if (p.imageMeta && p.value !== "fallback" && (p.value !== ((_a = p.validation) === null || _a === void 0 ? void 0 : _a.defaultValue))) {
            const imagePanel = document.createElement("div");
            imagePanel.className = "image-rotate-panel";
            if (!forMobile) {
                imagePanel.classList.add("d-flex", "flex-column");
            }
            for (let i = 1; i < 4; i++) {
                const thumbDiv = document.createElement("div");
                thumbDiv.className = "snippet-thumb";
                if (!forMobile) {
                    thumbDiv.classList.add("large");
                }
                const thumb = document.createElement("img");
                thumb.src = p.imageMeta.thumbUrl;
                thumbDiv.appendChild(thumb);
                thumbDiv.onclick = () => {
                    const overlay = document.createElement("div");
                    overlay.className = "image-rotate-overlay";
                    const spinner = document.createElement("div");
                    spinner.className = "spinner-border text-light";
                    spinner.style.width = "3rem";
                    spinner.style.height = "3rem";
                    overlay.appendChild(spinner);
                    container.appendChild(overlay);
                    const rotAngle = (i * 90).toString();
                    printess.rotateImage(p.id, rotAngle).finally(() => {
                        imagePanel.innerHTML = "";
                    });
                    for (const c of [...imagePanel.childNodes]) {
                        if (c !== thumbDiv) {
                            c.style.opacity = "0.4";
                        }
                        else {
                            c.style.border = "2px solid red";
                        }
                    }
                };
                thumbDiv.style.transformOrigin = "50% 50%";
                thumbDiv.style.transform = "rotate(" + i * 90 + "deg)";
                imagePanel.appendChild(thumbDiv);
            }
            container.appendChild(imagePanel);
        }
        else {
            container.innerText = printess.gl("ui.selectImageFirst");
        }
        return container;
    }
    function hideModal(id) {
        const modal = document.getElementById(id);
        if (modal) {
            document.body.removeChild(modal);
        }
    }
    function showModal(printess, id, content, titelHtml, footer) {
        const modal = document.createElement("div");
        modal.className = "modal show align-items-center";
        modal.id = id;
        modal.setAttribute("tabindex", "-1");
        modal.style.backgroundColor = "rgba(0,0,0,0.7)";
        modal.style.display = "flex";
        modal.style.width = "100%";
        modal.style.height = "100%";
        const dialog = document.createElement("div");
        dialog.className = "modal-dialog";
        const modalContent = document.createElement("div");
        modalContent.className = "modal-content";
        const modalHeader = document.createElement("div");
        modalHeader.className = "modal-header bg-primary";
        const title = document.createElement("h3");
        title.className = "modal-title";
        title.innerHTML = titelHtml;
        title.style.color = "#fff";
        const closer = printess.getIcon("close");
        closer.classList.add("modal-closer-icon");
        closer.onclick = () => {
            hideModal(id);
            if (id === "MOBILEUPLOADMODAL") {
                const imageTabContainer = document.getElementById("image-tab-container");
                if (imageTabContainer) {
                    const p = uih_currentProperties.filter(p => p.kind === "image")[0] || undefined;
                    imageTabContainer.replaceWith(renderMyImagesTab(printess, false, p, undefined));
                }
            }
        };
        const modalBody = document.createElement("div");
        modalBody.className = "modal-body";
        modalBody.style.padding = "1.75rem";
        modalBody.appendChild(content);
        modalHeader.appendChild(title);
        if (id !== "layoutSnippetsSelection") {
            modalHeader.appendChild(closer);
        }
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);
        if (footer)
            modalContent.appendChild(footer);
        dialog.appendChild(modalContent);
        modal.appendChild(dialog);
        document.body.appendChild(modal);
    }
    function getImageCropControl(printess, p, showSkipBtn, forDesktopDialog = false) {
        const container = document.createElement("div");
        if (p) {
            const ui = printess.createCropUi(p.id, forDesktopDialog);
            if (!ui) {
                container.innerText = printess.gl("ui.selectImageFirst");
                return container;
            }
            ui.container.classList.add("mb-3");
            const rangeLabel = document.createElement("label");
            rangeLabel.id = "range-label";
            const range = document.createElement("input");
            range.className = "form-range";
            range.type = "range";
            range.min = "1";
            range.max = "5";
            range.step = "0.01";
            range.value = "1";
            const span = document.createElement("span");
            if (p.imageMeta) {
                span.textContent = printess.gl("ui.scale");
            }
            rangeLabel.appendChild(span);
            rangeLabel.appendChild(range);
            rangeLabel.classList.add("mb-3");
            range.oninput = () => {
                const newScale = parseFloat(range.value);
                ui.setScale(newScale);
            };
            const skipBtn = document.createElement("button");
            skipBtn.className = "btn btn-outline-primary mb-3 me-2";
            skipBtn.innerText = printess.gl("ui.buttonSkip");
            skipBtn.onclick = () => {
                hideModal("CROPMODAL");
            };
            const okBtn = document.createElement("button");
            okBtn.className = "btn btn-primary mb-3";
            okBtn.innerText = printess.gl("ui.applyChanges");
            okBtn.onclick = () => __awaiter(this, void 0, void 0, function* () {
                const spinner = document.createElement("span");
                spinner.className = "spinner-border spinner-border-sm me-3";
                const spinnerText = document.createElement("span");
                spinnerText.textContent = printess.gl("ui.cropping");
                okBtn.textContent = "";
                okBtn.appendChild(spinner);
                okBtn.appendChild(spinnerText);
                okBtn.classList.add("disabled");
                yield printess.cropImage(p.id, ui.getCropBox());
                hideModal("CROPMODAL");
            });
            container.appendChild(rangeLabel);
            container.appendChild(ui.container);
            if (showSkipBtn) {
                container.appendChild(skipBtn);
            }
            container.appendChild(okBtn);
        }
        return container;
    }
    let _uih_currentTxt2ImgStyle = "photographic";
    let _uih_currentTxt2ImgPrompt = "";
    function getText2ImageControl(printess, p, forMobile, aiSettings) {
        if (aiSettings.style) {
            _uih_currentTxt2ImgStyle = aiSettings.style;
        }
        const txt2ImgDiv = document.createElement("div");
        txt2ImgDiv.classList.add("txt-2-img-ui");
        const styleSelector = document.createElement("div");
        styleSelector.classList.add("txt-2-img-styles");
        const promptUi = document.createElement("div");
        promptUi.classList.add("txt-2-img-prompt");
        function renderText2Image(prompt, style) {
            return __awaiter(this, void 0, void 0, function* () {
                if (txt2ImgInput.value) {
                    txt2ImgButton.disabled = true;
                    progress.style.visibility = "visible";
                    let prog = 0;
                    progress.max = 100;
                    const proInterval = window.setInterval(() => {
                        prog += 1;
                        progress.value = prog;
                        if ((prog) >= 100) {
                            window.clearInterval(proInterval);
                        }
                    }, 40);
                    txt2ImgButton.textContent = "Please wait ...";
                    _uih_currentTxt2ImgPrompt = prompt;
                    _uih_currentTxt2ImgStyle = style;
                    try {
                        yield printess.createText2Image(_uih_currentTxt2ImgPrompt, _uih_currentTxt2ImgStyle);
                    }
                    catch (error) {
                        txt2ImgButton.textContent = "Retry";
                        txt2ImgButton.disabled = false;
                        progress.style.visibility = "hidden";
                    }
                    txt2ImgButton.textContent = "Create Image";
                    txt2ImgButton.disabled = false;
                    progress.style.visibility = "hidden";
                }
            });
        }
        function createStyleThumb(s, forList, visible = true) {
            const sd = document.createElement("div");
            sd.dataset.style = s;
            sd.classList.add("txt-2-im-style-thumb");
            if (!visible) {
                sd.style.visibility = "hidden";
            }
            if (s === _uih_currentTxt2ImgStyle) {
                sd.classList.add("selected");
            }
            if (forList) {
                sd.addEventListener("click", (e) => {
                    styleSelector.childNodes.forEach(element => {
                        element.classList.remove("selected");
                    });
                    e.target.classList.add("selected");
                    const style = (e.target.dataset.style);
                    if (styleThumb && style) {
                        _uih_currentTxt2ImgStyle = style;
                        setStyleThumbBgImage(styleThumb, style);
                    }
                });
            }
            const caption = document.createElement("span");
            sd.appendChild(caption);
            setStyleThumbBgImage(sd, s);
            return sd;
        }
        function setStyleThumbBgImage(div, style) {
            div.style.backgroundImage = "url(" + printess.getResourcePath() + "/img/style-images/" + style.toLowerCase().replace(/\s/gm, "-") + ".png)";
            const span = div.querySelector("span");
            if (span)
                span.textContent = style;
        }
        const styles = printess.getText2ImageStyles();
        for (const s of styles) {
            const sd = createStyleThumb(s, true);
            styleSelector.appendChild(sd);
        }
        const promptLabel = document.createElement("p");
        promptLabel.textContent = "Describe the image and click 'Create Image'";
        promptUi.appendChild(promptLabel);
        const txt2ImgInput = document.createElement("textarea");
        txt2ImgInput.value = aiSettings.prompt || _uih_currentTxt2ImgPrompt || aiSettings.defaultPrompt;
        const styleThumb = createStyleThumb(_uih_currentTxt2ImgStyle, false, aiSettings.selectStyle);
        const txt2ImgButton = document.createElement("button");
        txt2ImgButton.textContent = "Create Image";
        txt2ImgButton.className = "btn btn-primary";
        txt2ImgButton.addEventListener("click", () => {
            renderText2Image(txt2ImgInput.value, _uih_currentTxt2ImgStyle);
        });
        const progress = document.createElement("progress");
        if (aiSettings.selectStyle === false) {
            progress.style.bottom = "-10px";
        }
        promptUi.appendChild(txt2ImgInput);
        promptUi.appendChild(styleThumb);
        promptUi.appendChild(txt2ImgButton);
        promptUi.appendChild(progress);
        if (aiSettings.selectStyle) {
            const styleLabel = document.createElement("p");
            styleLabel.textContent = "Select a style for the image generation";
            promptUi.appendChild(styleLabel);
            txt2ImgDiv.appendChild(promptUi);
            txt2ImgDiv.appendChild(styleSelector);
        }
        else {
            txt2ImgDiv.appendChild(promptUi);
        }
        return txt2ImgDiv;
    }
    function getImageUploadControl(printess, p, container, forMobile = false) {
        var _a, _b, _c, _d, _f, _g, _h, _j;
        container = container || document.createElement("div");
        container.innerHTML = "";
        const imagePanel = document.createElement("div");
        imagePanel.className = "image-panel";
        imagePanel.id = "image-panel" + p.id;
        const images = printess.getImages(p.id);
        const imageList = document.createElement("div");
        if (forMobile || (uih_currentProperties.length < 5 && uih_currentProperties.filter(p => p.kind === "image" || p.kind === "image-id").length <= 1)) {
            if (!forMobile) {
                if (p.imageMeta && p.imageMeta.allows.length <= 2 && p.value !== ((_a = p.validation) === null || _a === void 0 ? void 0 : _a.defaultValue)) {
                    const filtersControl = getImageFilterControl(printess, p, undefined, false);
                    filtersControl.classList.add("mb-3");
                    container.appendChild(filtersControl);
                }
                const placementControl = getImagePlacementControl(printess, p, forMobile);
                if (placementControl && ((_b = p.imageMeta) === null || _b === void 0 ? void 0 : _b.canSetPlacement) && p.value !== ((_c = p.validation) === null || _c === void 0 ? void 0 : _c.defaultValue)) {
                    container.appendChild(placementControl);
                }
                const scaleControl = getImageScaleControl(printess, p);
                if (scaleControl) {
                    scaleControl.classList.add("mb-3");
                    container.appendChild(scaleControl);
                }
            }
            if (((_d = p.imageMeta) === null || _d === void 0 ? void 0 : _d.isHandwriting) === true && !forMobile) {
                const b = document.createElement("button");
                b.className = "btn btn-success w-100 mb-1";
                b.innerText = printess.gl("ui.buttonBackToTextEditing");
                b.onclick = () => {
                    printess.removeHandwritingImage();
                };
                imagePanel.appendChild(b);
            }
            if (forMobile) {
                imagePanel.appendChild(renderImageControlButtons(printess, images, p));
            }
            else {
                imagePanel.appendChild(renderMyImagesTab(printess, forMobile, p, images));
            }
            imagePanel.style.gridTemplateRows = "auto";
            imagePanel.style.gridTemplateColumns = "1fr";
            container.appendChild(imagePanel);
            return container;
        }
        else {
            if ((_f = p.imageMeta) === null || _f === void 0 ? void 0 : _f.canUpload) {
                container.appendChild(getImageUploadButton(printess, p, p.id, forMobile, false));
            }
            const imageListWrapper = document.createElement("div");
            imageListWrapper.classList.add("image-list-wrapper");
            imageList.classList.add("image-list");
            const mainThumb = document.createElement("div");
            if ((_g = p.imageMeta) === null || _g === void 0 ? void 0 : _g.thumbCssUrl) {
                mainThumb.className = "main";
                mainThumb.style.backgroundImage = p.imageMeta.thumbCssUrl;
                imagePanel.appendChild(mainThumb);
            }
            for (const im of images) {
                const thumb = document.createElement("div");
                thumb.style.backgroundImage = im.thumbCssUrl;
                if (im.id === p.value)
                    thumb.style.border = "2px solid red";
                thumb.onclick = () => __awaiter(this, void 0, void 0, function* () {
                    const scaleHints = yield printess.setProperty(p.id, im.id);
                    p.value = im.id;
                    if (scaleHints && p.imageMeta) {
                        p.imageMeta.scaleHints = scaleHints;
                        p.imageMeta.scale = scaleHints.scale;
                        p.imageMeta.thumbCssUrl = im.thumbCssUrl;
                        p.imageMeta.thumbUrl = im.thumbUrl;
                        p.imageMeta.canScale = printess.canScale(p.id);
                    }
                    getImageUploadControl(printess, p, container, forMobile);
                    const propsDiv = document.getElementById("tabs-panel-" + p.id);
                    if (propsDiv) {
                        propsDiv.replaceWith(getPropertyControl(printess, p));
                    }
                    if (forMobile)
                        closeMobileFullscreenContainer();
                });
                imageList.appendChild(thumb);
            }
            imageListWrapper.appendChild(imageList);
            imagePanel.appendChild(imageListWrapper);
            if (forMobile) {
                container.classList.add("form-control");
                container.appendChild(imageList);
                return container;
            }
            else {
                container.appendChild(imagePanel);
                const placementControl = getImagePlacementControl(printess, p, forMobile);
                if (placementControl && ((_h = p.imageMeta) === null || _h === void 0 ? void 0 : _h.canSetPlacement) && p.value !== ((_j = p.validation) === null || _j === void 0 ? void 0 : _j.defaultValue)) {
                    container.appendChild(placementControl);
                }
                const scaleControl = getImageScaleControl(printess, p);
                if (scaleControl) {
                    container.appendChild(scaleControl);
                }
                return container;
            }
        }
    }
    function getImageUploadButton(printess, p, id, forMobile = false, isMyImagesTab, label = "", isHandwritingImage = false) {
        const container = document.createElement("div");
        const progressDiv = document.createElement("div");
        progressDiv.className = "progress";
        const progressBar = document.createElement("div");
        progressBar.className = "progress-bar";
        progressBar.style.width = "0%";
        progressDiv.style.display = "none";
        progressDiv.appendChild(progressBar);
        const inp = document.createElement("input");
        inp.type = "file";
        inp.id = "inp_" + id.replace("#", "-HASH-");
        inp.className = "form-control";
        inp.accept = printess.allowOnlyVectorImageUpload() ? "image/svg+xml" : `image/png,image/jpg,image/webp,image/heic,image/heif,image/jpeg,image/svg+xml${printess.allowPdfUpload() ? ",application/pdf" : ""}`;
        inp.multiple = !id.startsWith("FF_");
        inp.style.display = "none";
        inp.onchange = () => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (inp && ((_a = inp.files) === null || _a === void 0 ? void 0 : _a.length)) {
                inp.disabled = true;
                inp.style.display = "none";
                const imageQualityInfoText = document.getElementById("image-quality-info");
                if (imageQualityInfoText)
                    imageQualityInfoText.style.display = "none";
                const scaleControl = document.getElementById("range-label");
                if (scaleControl)
                    scaleControl.style.display = "none";
                const twoButtons = document.getElementById("two-buttons");
                if (twoButtons)
                    twoButtons.style.gridTemplateColumns = "1fr";
                const distributeBtn = document.getElementById("distribute-button");
                if (distributeBtn)
                    distributeBtn.style.display = "none";
                const multipleImagesHint = document.getElementById("multiple-images-hint");
                if (multipleImagesHint)
                    multipleImagesHint.style.display = "none";
                const imageControl = document.getElementById("image-control-buttons");
                if (imageControl && forMobile) {
                    imageControl.innerHTML = "";
                    imageControl.style.gridTemplateColumns = "1fr";
                    imageControl.appendChild(progressDiv);
                }
                progressDiv.style.display = "flex";
                const label = document.getElementById("upload-btn-" + id);
                if (label) {
                    label.style.display = "none";
                }
                printess.showOverlay("Uploading Images ...");
                try {
                    yield printess.uploadAndDistributeImages(inp.files, id, (progress) => {
                        progressBar.style.width = (progress * 100) + "%";
                    }, isHandwritingImage);
                }
                finally {
                    printess.hideOverlay();
                }
                if (isMyImagesTab) {
                    const imageTabContainer = document.getElementById("tab-my-images");
                    if (imageTabContainer) {
                        imageTabContainer.innerHTML = "";
                        imageTabContainer.appendChild(renderMyImagesTab(printess, forMobile));
                    }
                }
                if (id.startsWith("FF_")) {
                    const p = uih_currentProperties.filter(p => p.id === id && p.kind === "image-id");
                    if (p.length > 0 && ((_b = p[0].imageMeta) === null || _b === void 0 ? void 0 : _b.hasFFCropEditor)) {
                        if (forMobile) {
                            renderMobileDialogFullscreen(printess, "CROPMODAL", "ui.buttonCrop", getImageCropControl(printess, p[0], true));
                        }
                        else {
                            showModal(printess, "CROPMODAL", getImageCropControl(printess, p[0], true, true), printess.gl("ui.buttonCrop"));
                        }
                    }
                }
                uih_activeImageAccordion = "Buyer Upload";
                if (printess.showTabNavigation()) {
                    closeMobileFullscreenContainer();
                }
            }
        });
        if (printess.showMobileUploadButton() && !forMobile) {
            label = "ui.desktopImageUpload";
        }
        if (printess.allowOnlyVectorImageUpload()) {
            label = "ui.uploadVectorImage";
        }
        container.appendChild(progressDiv);
        container.appendChild(addLabel(printess, p, inp, id, forMobile, "image", label || "ui.changeImage"));
        return container;
    }
    function getImagePlacementControl(printess, p, forMobile, container) {
        var _a;
        const placementControls = [{
            name: "fit",
            icon: "fit-image",
        }, {
            name: "fill",
            icon: "fill-image"
        }, {
            name: "face",
            icon: "focus-face"
        }, {
            name: "group",
            icon: "focus-group"
        }];
        if (!container) {
            container = document.createElement("div");
            container.className = "image-placement-container mb-3";
        }
        else {
            container.innerHTML = "";
        }
        for (const pc of placementControls) {
            const button = document.createElement("button");
            button.className = "btn image-placement-button";
            const txt = document.createElement("div");
            txt.textContent = printess.gl("ui.placement-" + pc.name);
            const icon = printess.getIcon(pc.icon);
            icon.style.width = "30px";
            icon.style.height = "30px";
            if (((_a = p.imageMeta) === null || _a === void 0 ? void 0 : _a.placement) === pc.name) {
                button.classList.add("btn-primary");
            }
            else {
                button.classList.add("btn-outline-primary");
            }
            button.appendChild(icon);
            button.appendChild(txt);
            button.onclick = () => __awaiter(this, void 0, void 0, function* () {
                const scaleHints = yield printess.setImagePlacement(pc.name, p.id);
                if (scaleHints && p.imageMeta) {
                    p.imageMeta.scaleHints = scaleHints;
                    p.imageMeta.scale = scaleHints.scale;
                    p.imageMeta.placement = pc.name;
                    getImagePlacementControl(printess, p, forMobile, container);
                    const scaleControl = document.getElementById("range-label");
                    if (scaleControl) {
                        getImageScaleControl(printess, p, forMobile, scaleControl);
                    }
                }
            });
            container.appendChild(button);
        }
        return container;
    }
    function getImageScaleControl(printess, p, forMobile = false, element) {
        var _a, _b, _c, _d, _f, _g, _h, _j, _k;
        if (!((_a = p.imageMeta) === null || _a === void 0 ? void 0 : _a.canScale) || ((_b = p.validation) === null || _b === void 0 ? void 0 : _b.defaultValue) === p.value) {
            return null;
        }
        if (p.kind === "image-id" || !p.imageMeta) {
            return null;
        }
        if (element) {
            element.innerHTML = "";
        }
        const rangeLabel = element || document.createElement("label");
        rangeLabel.id = "range-label";
        const range = document.createElement("input");
        range.className = "form-range";
        if (forMobile || ((_c = p.imageMeta) === null || _c === void 0 ? void 0 : _c.isHandwriting))
            range.style.marginLeft = "0px";
        if (printess.isIPhone()) {
            range.classList.add("slider-catch-radius");
        }
        range.type = "range";
        range.min = (_f = (_d = p.imageMeta) === null || _d === void 0 ? void 0 : _d.scaleHints.min.toString()) !== null && _f !== void 0 ? _f : "0";
        range.max = (_h = (_g = p.imageMeta) === null || _g === void 0 ? void 0 : _g.scaleHints.max.toString()) !== null && _h !== void 0 ? _h : "0";
        range.step = "0.01";
        range.value = (_k = (_j = p.imageMeta) === null || _j === void 0 ? void 0 : _j.scale.toString()) !== null && _k !== void 0 ? _k : "0";
        const span = document.createElement("span");
        span.textContent = forMobile ? "" : printess.gl("ui.imageScale", Math.floor(p.imageMeta.scaleHints.dpiAtScale1 / p.imageMeta.scale));
        if (p.imageMeta) {
            const maxScale = Math.floor(p.imageMeta.scaleHints.dpiAtScale1 / p.imageMeta.scaleHints.max);
            const minScale = Math.floor(p.imageMeta.scaleHints.dpiAtScale1 / p.imageMeta.scaleHints.min);
            const veryLowQuality = p.imageMeta.scaleHints.max < 0.8;
            const lowQuality = p.imageMeta.scaleHints.max < p.imageMeta.scaleHints.min;
            if (minScale - maxScale < 15) {
                rangeLabel.id = "image-quality-info";
                rangeLabel.classList.add("align-items-center");
                rangeLabel.style.display = "flex";
                range.style.display = "none";
                let icon = printess.getIcon("warning");
                icon.classList.add("scale-warning");
                if (veryLowQuality) {
                    span.textContent = printess.gl("ui.imageVeryLowQuality");
                    span.style.color = "red";
                    icon.style.color = "red";
                }
                else if (lowQuality) {
                    span.textContent = printess.gl("ui.imageLowQuality");
                    span.style.color = "orange";
                    icon.style.color = "orange";
                }
                else {
                    icon = printess.getIcon("check-circle-solid");
                    icon.classList.add("scale-warning");
                    span.textContent = printess.gl("ui.imageGoodQuality");
                    span.style.color = "green";
                    icon.style.color = "green";
                }
                if (forMobile)
                    span.style.fontSize = "12px";
                rangeLabel.appendChild(icon);
                rangeLabel.appendChild(span);
            }
            else if (!forMobile) {
                rangeLabel.appendChild(span);
            }
        }
        rangeLabel.appendChild(range);
        if (forMobile) {
            rangeLabel.classList.add("form-control");
        }
        range.oninput = () => {
            const newScale = parseFloat(range.value);
            printess.setImageMetaProperty(p.id, "scale", newScale);
            if (p.imageMeta) {
                p.imageMeta.scale = newScale;
                span.textContent = forMobile ? "" : printess.gl("ui.imageScale", Math.floor(p.imageMeta.scaleHints.dpiAtScale1 / newScale));
                const mobileButtonDiv = document.getElementById(p.id + ":image-scale");
                if (mobileButtonDiv) {
                    drawButtonContent(printess, mobileButtonDiv, [p], p.controlGroup);
                }
            }
        };
        return rangeLabel;
    }
    function getInvertImageChecker(printess, p, metaProperty, forMobile = false) {
        var _a;
        if (forMobile) {
            return getInvertImageCheckerMobile(printess, p, metaProperty, forMobile);
        }
        const f = document.createElement("div");
        f.classList.add("invert-image-checker-container");
        f.classList.add("form-control");
        const label = document.createElement("label");
        label.innerText = printess.gl("ui.invertImage");
        f.appendChild(label);
        const svg = printess.getIcon("image-solid");
        svg.classList.add("invert-image-checker-svg");
        const svg2 = printess.getIcon("image-regular");
        svg2.classList.add("invert-image-checker-svg");
        if (((_a = p.imageMeta) === null || _a === void 0 ? void 0 : _a.invert) !== 0) {
            svg.classList.add("selected");
            svg2.classList.remove("selected");
        }
        else {
            svg2.classList.add("selected");
            svg.classList.remove("selected");
        }
        svg.onclick = () => {
            printess.setNumberUiProperty(p, "image-invert", 100);
            if (metaProperty && p.imageMeta) {
                p.imageMeta["invert"] = 100;
            }
            svg.classList.add("selected");
            svg2.classList.remove("selected");
        };
        svg2.onclick = () => {
            printess.setNumberUiProperty(p, "image-invert", 0);
            if (metaProperty && p.imageMeta) {
                p.imageMeta["invert"] = 0;
            }
            svg2.classList.add("selected");
            svg.classList.remove("selected");
        };
        f.appendChild(svg2);
        f.appendChild(svg);
        return f;
    }
    function getInvertImageCheckerMobile(printess, p, metaProperty, forMobile = false) {
        var _a;
        const container = document.createElement("div");
        container.className = "form-check mt-3";
        if (forMobile) {
            container.classList.add("form-switch");
        }
        const id = "invert-image-checker";
        const input = document.createElement("input");
        input.className = "form-check-input";
        input.id = id;
        input.type = "checkbox";
        input.checked = ((_a = printess.getNumberUi(p, metaProperty)) === null || _a === void 0 ? void 0 : _a.value) === 0 ? false : true;
        const label = document.createElement("label");
        label.className = "form-check-label";
        label.setAttribute("for", id);
        if (forMobile)
            label.style.color = input.checked ? "var(--bs-light)" : "var(--bs-primary)";
        label.textContent = input.checked && forMobile ? printess.gl("ui.revertImage") : printess.gl("ui.invertImage");
        input.onchange = () => {
            const newValue = input.checked ? 100 : 0;
            printess.setNumberUiProperty(p, "image-invert", newValue);
            if (metaProperty && p.imageMeta) {
                p.imageMeta["invert"] = newValue;
            }
            if (forMobile)
                label.style.color = input.checked ? "var(--bs-light)" : "var(--bs-primary)";
            label.textContent = input.checked && forMobile ? printess.gl("ui.revertImage") : printess.gl("ui.invertImage");
        };
        container.appendChild(input);
        container.appendChild(label);
        return container;
    }
    function getNumberSlider(printess, p, metaProperty = null, forMobile = false) {
        const ui = printess.getNumberUi(p, metaProperty);
        if (!ui) {
            const er = document.createElement("div");
            er.textContent = printess.gl("ui.numberSlider", p.id, (metaProperty || ""));
            return er;
        }
        const rangeLabel = document.createElement("label");
        const range = document.createElement("input");
        range.className = "form-range";
        range.id = metaProperty !== null && metaProperty !== void 0 ? metaProperty : "";
        range.style.marginLeft = "0px";
        range.type = "range";
        range.min = ui.meta.min.toString();
        range.max = ui.meta.max.toString();
        range.step = ui.meta.step.toString();
        range.value = ui.value.toString();
        if (printess.isIPhone()) {
            range.classList.add("slider-catch-radius");
        }
        range.oninput = () => {
            const newValue = parseFloat(range.value);
            printess.setNumberUiProperty(p, metaProperty, newValue);
            if (metaProperty && p.imageMeta) {
                const imProp = metaProperty.replace("image-", "");
                p.imageMeta[imProp] = newValue;
            }
            else if (!metaProperty) {
                p.value = newValue;
            }
            const mobileButtonDiv = document.getElementById(p.id + ":" + (metaProperty !== null && metaProperty !== void 0 ? metaProperty : ""));
            if (mobileButtonDiv) {
                drawButtonContent(printess, mobileButtonDiv, [p], p.controlGroup);
            }
        };
        const span = document.createElement("span");
        span.textContent = metaProperty === "text-style-line-height" ? printess.gl("ui.lineHeight") : metaProperty ? printess.gl('ui.' + metaProperty) : printess.gl(p.label);
        rangeLabel.appendChild(span);
        rangeLabel.appendChild(range);
        if (forMobile) {
            rangeLabel.classList.add("form-control");
        }
        return rangeLabel;
    }
    function getFontSizeDropDown(printess, p, asList, dropdown, fullWidth = true) {
        var _a;
        if (!dropdown) {
            dropdown = document.createElement("div");
            dropdown.classList.add("btn-group");
            dropdown.classList.add("form-control");
        }
        dropdown.style.padding = "0";
        const sizes = printess.getFontSizesInPt().map(f => f + "pt");
        const ddContent = document.createElement("ul");
        if (p.textStyle && sizes.length) {
            const selectedItem = (_a = sizes.filter(itm => { var _a, _b; return (_b = itm === ((_a = p.textStyle) === null || _a === void 0 ? void 0 : _a.size)) !== null && _b !== void 0 ? _b : "??pt"; })[0]) !== null && _a !== void 0 ? _a : null;
            const button = document.createElement("button");
            button.className = "btn btn-light dropdown-toggle";
            if (fullWidth) {
                button.classList.add("full-width");
            }
            button.dataset.bsToggle = "dropdown";
            button.dataset.bsAutoClose = "true";
            button.setAttribute("aria-expanded", "false");
            if (selectedItem) {
                button.innerText = selectedItem;
            }
            else {
                button.innerText = p.textStyle ? Number(p.textStyle.size.slice(0, -2)).toFixed(2) + "pt" : "??pt";
            }
            dropdown.appendChild(button);
            if (asList) {
                ddContent.classList.add("list-group");
                ddContent.classList.add("list-group-grid-style");
            }
            else {
                ddContent.classList.add("dropdown-menu");
                ddContent.setAttribute("aria-labelledby", "defaultDropdown");
                ddContent.style.width = "100%";
                ddContent.style.maxHeight = "400px";
            }
            ddContent.style.overflow = "hidden auto";
            for (const entry of sizes) {
                const li = document.createElement("li");
                if (asList) {
                    li.classList.add("list-group-item");
                    if (entry === selectedItem) {
                        li.classList.add("active");
                    }
                }
                li.classList.add("dropdown-item");
                li.onclick = () => {
                    button.innerHTML = "";
                    printess.setTextStyleProperty(p.id, "size", entry);
                    if (p.textStyle)
                        p.textStyle.size = entry;
                    button.innerText = entry;
                    if (asList) {
                        ddContent.querySelectorAll("li").forEach(li => li.classList.remove("active"));
                        li.classList.add("active");
                        const mobileButtonDiv = document.getElementById(p.id + ":text-style-size");
                        if (mobileButtonDiv) {
                            drawButtonContent(printess, mobileButtonDiv, [p], p.controlGroup);
                        }
                    }
                };
                li.innerText = entry;
                ddContent.appendChild(li);
            }
            dropdown.appendChild(ddContent);
        }
        const caption = printess.gl("ui.fontSizeDropDownCaption");
        if (printess.showTextStyleCaptions() && uih_currentRender === "desktop") {
            const content = asList ? ddContent : dropdown;
            const container = getDropDownCaption(content, caption);
            return container;
        }
        if (asList) {
            return ddContent;
        }
        else {
            return dropdown;
        }
    }
    function getFontDropDown(printess, p, asList, dropdown, fullWidth = true) {
        var _a, _b;
        if (!dropdown) {
            dropdown = document.createElement("div");
            dropdown.classList.add("btn-group");
            dropdown.classList.add("form-control");
            dropdown.classList.add("printess-font-dropdown");
        }
        dropdown.style.padding = "0";
        const fonts = printess.getFonts(p.id);
        const ddContent = document.createElement("ul");
        ddContent.classList.add("printess-font-dropdown");
        let selectedItem = null;
        if (fonts.length) {
            if (p.textStyle) {
                selectedItem = (_a = fonts.filter(itm => { var _a, _b; return (_b = itm.name === ((_a = p.textStyle) === null || _a === void 0 ? void 0 : _a.font)) !== null && _b !== void 0 ? _b : ""; })[0]) !== null && _a !== void 0 ? _a : null;
            }
            else {
                selectedItem = (_b = fonts.filter(itm => itm.name === p.value.toString())[0]) !== null && _b !== void 0 ? _b : null;
            }
            const button = document.createElement("button");
            button.className = "btn btn-light dropdown-toggle";
            if (fullWidth) {
                button.classList.add("full-width");
            }
            button.dataset.bsToggle = "dropdown";
            button.dataset.bsAutoClose = "true";
            button.setAttribute("aria-expanded", "false");
            if (selectedItem) {
                button.appendChild(getDropdownImageContent(selectedItem.thumbUrl));
            }
            else {
                const txt = document.createElement("div");
                txt.style.textAlign = "left";
                txt.textContent = printess.gl("ui.fontSelectText");
                button.appendChild(txt);
            }
            dropdown.appendChild(button);
            if (asList) {
                ddContent.classList.add("list-group");
            }
            else {
                ddContent.classList.add("dropdown-menu");
                ddContent.setAttribute("aria-labelledby", "defaultDropdown");
                ddContent.style.width = "100%";
                ddContent.style.maxHeight = "400px";
            }
            ddContent.style.overflow = "hidden auto";
            for (const entry of fonts) {
                const li = document.createElement("li");
                li.classList.add("dropdown-item");
                if (asList) {
                    li.classList.add("list-group-item");
                    li.classList.add("font");
                    if (entry === selectedItem) {
                        li.classList.add("active");
                    }
                }
                li.onclick = () => __awaiter(this, void 0, void 0, function* () {
                    if (p.textStyle) {
                        printess.setTextStyleProperty(p.id, "font", entry.name);
                        p.textStyle.font = entry.name;
                    }
                    else {
                        printess.setProperty(p.id, entry.name);
                        p.value = entry.name;
                    }
                    if (asList) {
                        ddContent.querySelectorAll("li").forEach(li => li.classList.remove("active"));
                        li.classList.add("active");
                        let mobileButtonDiv = document.getElementById(p.id + ":text-style-font");
                        if (p.id.startsWith("FF_") && (yield printess.isFontFormField(p.id))) {
                            mobileButtonDiv = document.getElementById(p.id + ":");
                        }
                        if (mobileButtonDiv) {
                            drawButtonContent(printess, mobileButtonDiv, [p], p.controlGroup);
                        }
                    }
                    else {
                        button.innerHTML = "";
                        button.appendChild(getDropdownImageContent(entry.thumbUrl));
                    }
                });
                li.appendChild(getDropdownImageContent(entry.thumbUrl));
                ddContent.appendChild(li);
            }
            dropdown.appendChild(ddContent);
        }
        if (p.id.startsWith("FF_")) {
            if (asList) {
                return ddContent;
            }
            else {
                return addLabel(printess, p, dropdown, p.id, false, p.kind, p.label);
            }
        }
        else {
            if (asList) {
                return ddContent;
            }
            else {
                const caption = printess.gl("ui.fontDropDownCaption");
                if (printess.showTextStyleCaptions()) {
                    const container = getDropDownCaption(dropdown, caption);
                    return container;
                }
                else {
                    return dropdown;
                }
            }
        }
    }
    function getDropDownCaption(dropdown, caption) {
        const container = document.createElement("div");
        container.className = "d-flex flex-wrap w-100";
        const label = document.createElement("div");
        label.style.marginBottom = "0.5rem";
        label.style.width = "100%";
        label.textContent = caption;
        container.appendChild(label);
        container.appendChild(dropdown);
        return container;
    }
    function getParagraphStyleDropDown(printess, p, asList, dropdown, fullWidth = true) {
        var _a;
        if (!dropdown) {
            dropdown = document.createElement("div");
            dropdown.classList.add("btn-group");
            dropdown.classList.add("form-control");
        }
        dropdown.style.padding = "0";
        const styles = ["[none]", ...printess.getParagraphStyles(p.id).map(x => x.class)];
        const ddContent = document.createElement("ul");
        const selectedItem = ((_a = p.textStyle) === null || _a === void 0 ? void 0 : _a.pStyle) || "[none]";
        if (styles.length) {
            const button = document.createElement("button");
            button.className = "btn btn-light dropdown-toggle";
            if (fullWidth) {
                button.classList.add("full-width");
            }
            button.dataset.bsToggle = "dropdown";
            button.dataset.bsAutoClose = "true";
            button.setAttribute("aria-expanded", "false");
            if (selectedItem) {
                button.appendChild(getDropdownTextContent(selectedItem));
            }
            dropdown.appendChild(button);
            if (asList) {
                ddContent.classList.add("list-group");
            }
            else {
                ddContent.classList.add("dropdown-menu");
                ddContent.setAttribute("aria-labelledby", "defaultDropdown");
                ddContent.style.width = "100%";
                ddContent.style.maxHeight = "400px";
            }
            ddContent.style.overflow = "hidden auto";
            for (const entry of styles) {
                const li = document.createElement("li");
                li.classList.add("dropdown-item");
                if (asList) {
                    li.classList.add("list-group-item");
                    li.classList.add("font");
                    if (entry === selectedItem) {
                        li.classList.add("active");
                    }
                }
                li.onclick = () => {
                    if (p.textStyle) {
                        printess.setTextStyleProperty(p.id, "pStyle", entry);
                        p.textStyle.pStyle = entry;
                    }
                    else {
                        printess.setProperty(p.id, entry);
                        p.value = entry;
                    }
                    if (asList) {
                        ddContent.querySelectorAll("li").forEach(li => li.classList.remove("active"));
                        li.classList.add("active");
                        const mobileButtonDiv = document.getElementById(p.id + ":text-style-paragraph-style");
                        if (mobileButtonDiv) {
                            drawButtonContent(printess, mobileButtonDiv, [p], p.controlGroup);
                        }
                    }
                    else {
                        button.innerHTML = "";
                        button.appendChild(getDropdownTextContent(entry));
                    }
                };
                li.appendChild(getDropdownTextContent(entry));
                ddContent.appendChild(li);
            }
            dropdown.appendChild(ddContent);
        }
        if (asList) {
            const cont = document.createElement("p");
            if (uih_currentRender === "desktop") {
                const txt = document.createElement("label");
                txt.classList.add("mb-2");
                txt.innerText = printess.gl("ui.paragraphStyle");
                cont.appendChild(txt);
            }
            cont.appendChild(ddContent);
            return cont;
        }
        else {
            return dropdown;
        }
    }
    function getDropdownImageContent(thumbUrl) {
        const img = document.createElement("img");
        img.src = thumbUrl;
        img.style.height = "20px";
        return img;
    }
    function getDropdownTextContent(text) {
        const txt = document.createElement("span");
        txt.innerText = text;
        return txt;
    }
    function getVAlignControl(printess, p, forMobile) {
        const group = document.createElement("div");
        group.className = "btn-group";
        group.classList.add("align-control-item");
        if (!forMobile) {
            group.style.marginLeft = "0px";
        }
        if (forMobile) {
            group.classList.add("form-control");
        }
        for (const v of ["top", "center", "bottom"]) {
            let icon = "text-top";
            switch (v) {
                case "center":
                    icon = "text-center";
                    break;
                case "bottom":
                    icon = "text-bottom";
                    break;
            }
            const id = p.id + "btnVAlignRadio" + v;
            group.appendChild(getRadioButton(printess, p, id, "vAlign", v));
            group.appendChild(getRadioLabel(printess, p, id, "vAlign", icon));
        }
        return group;
    }
    function getHAlignControl(printess, p, forMobile) {
        const group = document.createElement("div");
        group.className = "btn-group";
        group.classList.add("align-control-item");
        if (!forMobile) {
            group.style.marginLeft = "0px";
        }
        if (forMobile) {
            group.classList.add("form-control");
        }
        const ha = ["left", "center", "right", "justifyLeft"];
        if (p.textStyle && p.textStyle.allows.indexOf("bullet") >= 0) {
            ha.push("bullet");
        }
        for (const v of ha) {
            let icon = "text-align-left";
            switch (v) {
                case "bullet":
                    icon = "list-ul";
                    break;
                case "right":
                    icon = "text-align-right";
                    break;
                case "center":
                    icon = "text-align-center";
                    break;
                case "justifyLeft":
                    icon = "text-align-justify-left";
                    break;
                case "justifyCenter":
                    icon = "text-align-justify-center";
                    break;
                case "justifyRight":
                    icon = "text-align-justify-right";
                    break;
                case "justifyJustify":
                    icon = "text-align-justify-justify";
                    break;
            }
            const id = p.id + "btnHAlignRadio" + v;
            group.appendChild(getRadioButton(printess, p, id, "hAlign", v));
            group.appendChild(getRadioLabel(printess, p, id, "hAlign", icon));
        }
        return group;
    }
    function getVAlignAndHAlignControl(printess, p, forMobile) {
        const container = document.createElement("div");
        container.className = "align-control-container";
        container.appendChild(getHAlignControl(printess, p, forMobile));
        container.appendChild(getVAlignControl(printess, p, forMobile));
        return container;
    }
    function getRadioLabel(printess, p, id, name, icon) {
        const label = document.createElement("label");
        label.setAttribute("for", id);
        label.className = "btn btn-outline-dark";
        label.style.width = "46px";
        label.style.flex = "0 0 auto";
        const svg = printess.getIcon(icon);
        svg.style.width = "20px";
        svg.style.height = "20px";
        svg.style.pointerEvents = "none";
        label.appendChild(svg);
        return label;
    }
    function getRadioButton(printess, p, id, name, value) {
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.className = "btn-check";
        radio.dataset.value = value;
        radio.name = name + "_" + p.id;
        radio.id = id;
        if (p.textStyle && p.textStyle[name] === value) {
            radio.checked = true;
        }
        radio.onclick = () => {
            printess.setTextStyleProperty(p.id, name, value);
            if (p.textStyle)
                p.textStyle[name] = value;
            let mobileButtonDiv = document.getElementById(p.id + ":" + "text-style-" + name);
            if (!mobileButtonDiv && name === "hAlign") {
                mobileButtonDiv = document.getElementById(p.id + ":" + "text-style-vAlign-hAlign");
            }
            if (mobileButtonDiv) {
                drawButtonContent(printess, mobileButtonDiv, [p], p.controlGroup);
            }
        };
        return radio;
    }
    function getPaginationItem(printess, content, spread, page, isActive, bigSpaceBetween = false, disabled = false) {
        const li = document.createElement("li");
        li.className = "page-item";
        if (disabled) {
            li.style.opacity = "0.5";
            li.classList.add("disabled");
        }
        const a = document.createElement("div");
        a.className = "page-link";
        if (isActive) {
            li.classList.add("active");
        }
        let pageIndex = 0;
        if (page === "right-page") {
            pageIndex = 1;
        }
        if (typeof content === "number" && spread) {
            a.innerText = spread.names[pageIndex] ? spread.names[pageIndex] : content.toString();
        }
        else if (content === "previous") {
            const svg = printess.getIcon("carret-left-solid");
            svg.style.height = "1.3em";
            a.appendChild(svg);
        }
        else if (content === "next") {
            const svg = printess.getIcon("carret-right-solid");
            svg.style.height = "1.3em";
            a.appendChild(svg);
        }
        else if (content === "ellipsis") {
            a.innerHTML = "&#8230";
            a.className = "page-ellipsis disabled";
            li.style.opacity = "0.4";
        }
        li.appendChild(a);
        if (content === "ellipsis" || content === "previous" ||
            (spread &&
                ((page === "left-page" && spread.pages === 1) || (page === "right-page" && spread.pages === 2)))) {
            if (bigSpaceBetween) {
                li.classList.add("me-3");
            }
            else {
                li.classList.add("me-2");
            }
        }
        li.onclick = () => {
            uih_currentVisiblePage = null;
            if (content === "previous") {
                printess.previousPage();
            }
            else if (content === "next") {
                printess.nextPage();
            }
            else if (spread) {
                printess.selectSpread(spread.index, page);
                document.querySelectorAll(".page-item").forEach(pi => pi.classList.remove("active"));
                li.classList.add("active");
            }
        };
        return li;
    }
    function updatePageThumbnail(spreadId, pageId, url) {
        const thumb = document.getElementById("thumb_" + spreadId + "_" + pageId);
        if (thumb) {
            thumb.style.backgroundImage = 'url("' + url + '")';
        }
    }
    function refreshUndoRedoState(printess) {
        const btnUndo = document.querySelector(".undo-button");
        if (btnUndo) {
            if (printess.undoCount() === 0) {
                btnUndo.disabled = true;
            }
            else {
                btnUndo.disabled = false;
            }
        }
        const btnRedo = document.querySelector(".redo-button");
        if (btnRedo) {
            if (printess.redoCount() === 0) {
                btnRedo.disabled = true;
            }
            else {
                btnRedo.disabled = false;
            }
        }
    }
    function getCloseEditorDialog(printess) {
        if (printess.showAlertOnClose() === false || printess.hasUnsavedChanges() === false) {
            const callback = printess.getBackButtonCallback();
            if (callback) {
                handleBackButtonCallback(printess, callback);
            }
            return;
        }
        const content = document.createElement("div");
        content.className = "d-flex flex-column align-items-center";
        const id = "CLOSEEDITORMODAL";
        const txtOne = document.createElement("p");
        txtOne.style.fontWeight = "bold";
        txtOne.innerHTML = printess.gl('ui.closeEditorTextTwo');
        const txtTwo = document.createElement("p");
        txtTwo.textContent = printess.gl("ui.closeEditorTextOne");
        content.appendChild(txtOne);
        content.appendChild(txtTwo);
        const footer = document.createElement("div");
        footer.className = "modal-footer";
        const close = document.createElement("button");
        close.className = "btn btn-outline-primary";
        close.textContent = printess.gl("ui.buttonNo");
        close.onclick = () => {
            hideModal(id);
        };
        const ok = document.createElement("button");
        ok.className = "btn btn-primary";
        ok.textContent = printess.gl("ui.buttonYes");
        ok.onclick = () => __awaiter(this, void 0, void 0, function* () {
            hideModal(id);
            const callback = printess.getBackButtonCallback();
            if (callback) {
                handleBackButtonCallback(printess, callback);
            }
            else {
                alert(printess.gl("ui.backButtonCallback"));
            }
        });
        footer.appendChild(close);
        footer.appendChild(ok);
        showModal(printess, id, content, printess.gl("ui.closeEditorTitle", printess.getTemplateTitle()), footer);
    }
    function getBackUndoMiniBar(printess) {
        const miniBar = document.createElement("div");
        const btnBack = document.createElement("button");
        const cornerGridColumns = [];
        const cornerTools = printess.pageNavigationDisplay() === "icons";
        const caption = printess.gl("ui.buttonBack");
        btnBack.className = "btn btn-outline-secondary";
        if (cornerTools) {
            btnBack.classList.add("btn-sm");
        }
        else {
            btnBack.classList.add("me-2");
            btnBack.innerText = caption;
            btnBack.style.marginRight = "5px";
        }
        const closeIcon = printess.gl("ui.buttonBackIcon") || "close";
        const icon = cornerTools ? closeIcon : printess.gl("ui.buttonBackIcon");
        if (icon) {
            const svg = printess.getIcon(icon);
            svg.style.fill = "var(--bs-secondary)";
            if (!cornerTools) {
                svg.style.height = "24px";
                svg.style.float = "left";
                svg.style.marginRight = caption ? "10px" : "0px";
            }
            btnBack.appendChild(svg);
        }
        if (!printess.getBackButtonCallback()) {
            btnBack.classList.add("disabled");
        }
        btnBack.onclick = () => {
            if (printess.userInBuyerSide()) {
                if (confirm("Do you want to log out?\n(Please print your current work before leaving)")) {
                    printess.logout();
                }
            }
            else if (printess.isInDesignerMode()) {
                const callback = printess.getBackButtonCallback();
                if (callback) {
                    handleBackButtonCallback(printess, callback);
                }
                else {
                    alert(printess.gl("ui.backButtonCallback"));
                }
            }
            else {
                getCloseEditorDialog(printess);
            }
        };
        if (printess.hasPreviewBackButton() && !cornerTools) {
            const previewBackButton = getPreviewBackButton(printess);
            previewBackButton.classList.add("me-2");
            miniBar.appendChild(previewBackButton);
        }
        else if (!cornerTools) {
            miniBar.appendChild(btnBack);
        }
        if (printess.showUndoRedo() || cornerTools) {
            const btnUndo = document.createElement("button");
            btnUndo.className = "btn btn-sm btn-outline-secondary undo-button";
            if (printess.undoCount() === 0) {
                btnUndo.disabled = true;
            }
            const icoUndo = printess.getIcon("undo-arrow");
            icoUndo.classList.add("icon");
            btnUndo.onclick = () => {
                printess.undo();
            };
            btnUndo.appendChild(icoUndo);
            miniBar.appendChild(btnUndo);
            cornerGridColumns.push("auto");
            const btnRedo = document.createElement("button");
            btnRedo.className = "btn btn-sm btn-outline-secondary me-2 redo-button";
            const iconRedo = printess.getIcon("redo-arrow");
            iconRedo.classList.add("icon");
            if (printess.redoCount() === 0) {
                btnRedo.disabled = true;
            }
            btnRedo.onclick = () => {
                printess.redo();
            };
            btnRedo.appendChild(iconRedo);
            miniBar.appendChild(btnRedo);
            cornerGridColumns.push("auto");
        }
        if (printess.allowZoomOptions()) {
            miniBar.classList.add("allow-zoom-and-pan");
            const btnZoomIn = document.createElement("button");
            btnZoomIn.className = "btn btn-sm btn-outline-secondary me-1";
            const iconZoomIn = printess.getIcon("plus");
            iconZoomIn.classList.add("icon");
            btnZoomIn.appendChild(iconZoomIn);
            btnZoomIn.onclick = () => printess.zoomIn();
            if (!cornerTools)
                miniBar.appendChild(btnZoomIn);
            const dropdownItems = getItemsForZoomDropdown(printess);
            miniBar.appendChild(getZoomOptionsMenu(printess, "", dropdownItems, false, "search-light"));
            cornerGridColumns.push("auto");
            const btnZoomOut = document.createElement("button");
            btnZoomOut.className = "btn btn-sm btn-outline-secondary me-2";
            const iconZoomOut = printess.getIcon("minus-light");
            iconZoomOut.classList.add("icon");
            btnZoomOut.appendChild(iconZoomOut);
            btnZoomOut.onclick = () => printess.zoomOut();
            if (!cornerTools)
                miniBar.appendChild(btnZoomOut);
        }
        if (printess.hasExpertButton()) {
            miniBar.appendChild(getExpertModeButton(printess, false));
            cornerGridColumns.push("auto");
        }
        if (printess.showSaveButton()) {
            miniBar.appendChild(getSaveButton(printess, false));
            cornerGridColumns.push("auto");
        }
        if (printess.showLoadButton()) {
            miniBar.appendChild(getLoadButton(printess, false));
            cornerGridColumns.push("auto");
        }
        if (printess.showProofButton()) {
            miniBar.appendChild(getProofButton(printess, false));
            cornerGridColumns.push("auto");
        }
        miniBar.classList.add("undo-redo-bar");
        if (cornerTools) {
            miniBar.appendChild(document.createElement("div"));
            cornerGridColumns.push("1fr");
            miniBar.appendChild(btnBack);
            cornerGridColumns.push("auto");
            miniBar.style.gridTemplateColumns = cornerGridColumns.join(" ");
            miniBar.style.display = "grid";
            if (cornerGridColumns.length > 6) {
                miniBar.style.width = (300 + ((cornerGridColumns.length - 6) * 30)) + "px";
            }
            else {
                miniBar.style.width = "300px";
            }
        }
        return miniBar;
    }
    function getZoomOptionsMenu(printess, title, dropdownItems, showDropdownTriangle = true, icon) {
        const cornerTools = printess.pageNavigationDisplay() === "icons";
        const dropdown = document.createElement("div");
        dropdown.className = "dropdown d-flex me-1";
        const dropdownBtn = document.createElement("button");
        dropdownBtn.className = "btn btn-outline-secondary dropdown-toggle";
        dropdownBtn.id = "dropdownMenuButton";
        dropdownBtn.textContent = title;
        dropdownBtn.setAttribute("data-bs-toggle", "dropdown");
        if (cornerTools) {
            dropdownBtn.classList.add("btn-sm");
        }
        if (!showDropdownTriangle) {
            dropdownBtn.classList.add("no-after");
        }
        if (icon) {
            const svg = printess.getIcon(icon);
            svg.classList.add("icon");
            dropdownBtn.appendChild(svg);
        }
        dropdown.appendChild(dropdownBtn);
        const ul = document.createElement("ul");
        ul.className = "dropdown-menu";
        ul.setAttribute("aria-labelledby", "dropdownMenuButton");
        dropdownItems.forEach(di => {
            if (di.show) {
                const li = document.createElement("li");
                const btn = document.createElement("a");
                btn.className = "dropdown-item";
                if (di.disabled)
                    btn.classList.add("disabled");
                btn.textContent = printess.gl(di.caption);
                btn.onclick = () => di.task();
                li.appendChild(btn);
                ul.appendChild(li);
            }
        });
        dropdown.appendChild(ul);
        return dropdown;
    }
    function getItemsForZoomDropdown(printess) {
        const spreadId = printess.pageInfoSync().spreadId;
        const currentSpreadIndex = printess.getAllSpreads().findIndex(s => s.spreadId === spreadId);
        const zoomItems = [{
            caption: "ui.zoomIn",
            show: true,
            task: printess.zoomIn
        }, {
            caption: "ui.zoomOut",
            show: true,
            task: printess.zoomOut
        }, {
            caption: "ui.zoomLeftPage",
            show: printess.isDoublePageSpread() && uih_currentVisiblePage !== "left-page",
            task: () => {
                printess.selectSpread(currentSpreadIndex, "left-page");
                uih_currentVisiblePage = "left-page";
            }
        }, {
            caption: "ui.zoomRightPage",
            show: printess.isDoublePageSpread() && uih_currentVisiblePage !== "right-page",
            task: () => {
                printess.selectSpread(currentSpreadIndex, "right-page");
                uih_currentVisiblePage = "right-page";
            }
        }, {
            caption: "ui.zoomFullPage",
            show: printess.isDoublePageSpread() && uih_currentVisiblePage !== "entire" || !printess.isDoublePageSpread(),
            task: () => {
                printess.selectSpread(currentSpreadIndex, "entire");
                uih_currentVisiblePage = "entire";
            }
        }
        ];
        return zoomItems;
    }
    function getPageArrangementButtons(printess, addSpreads, removeSpreads, hasFacingPages, forMobile) {
        const li = document.createElement("li");
        li.className = "big-page-item mr";
        if (forMobile) {
            li.classList.add("mobile");
        }
        else {
            li.appendChild(document.createElement("div"));
        }
        const pageButtons = document.createElement("div");
        pageButtons.className = "modify-page-buttons";
        if (addSpreads > 0) {
            const btnAdd = document.createElement("div");
            btnAdd.className = "btn btn-sm btn-outline-secondary w-100";
            const faktor = hasFacingPages ? 2 : 1;
            btnAdd.innerText = "+" + (addSpreads * faktor) + " " + printess.gl("ui.pages");
            btnAdd.onclick = () => {
                printess.addSpreads();
            };
            pageButtons.appendChild(btnAdd);
        }
        if (addSpreads || removeSpreads) {
            const arrangePagesBtn = document.createElement("button");
            arrangePagesBtn.className = "btn btn-sm btn-outline-secondary w-100";
            arrangePagesBtn.innerText = printess.gl("ui.arrangePages");
            arrangePagesBtn.onclick = () => getArrangePagesOverlay(printess, forMobile);
            pageButtons.appendChild(arrangePagesBtn);
        }
        li.appendChild(pageButtons);
        return li;
    }
    function renderPageNavigation(printess, container, large = false, forMobile = false) {
        var _a, _b, _c, _d;
        const spreads = printess.getAllSpreads();
        const info = printess.pageInfoSync();
        let lastScrollLeftPos = 0;
        const hasFacingPages = spreads.filter(sp => sp.pages > 1).length > 0;
        const pages = container || document.querySelector("#desktop-pagebar");
        if (pages) {
            const scrollContainer = pages.querySelector(".pagination");
            if (scrollContainer && printess.pageNavigationDisplay() === "icons") {
                lastScrollLeftPos = scrollContainer.scrollLeft;
            }
            pages.innerHTML = "";
            if (!forMobile && printess.pageNavigationDisplay() !== "icons") {
                pages.appendChild(getBackUndoMiniBar(printess));
            }
            const ul = document.createElement("ul");
            ul.className = "pagination";
            if (large) {
                ul.classList.add("pagination-lg");
            }
            pages.classList.remove("tabs");
            pages.classList.remove("big");
            const isDocTabs = printess.pageNavigationDisplay() === "doc-tabs";
            const isStepTabsList = printess.stepHeaderDisplay() === "tabs list";
            const isStepBadgeList = printess.stepHeaderDisplay() === "badge list";
            if (printess.pageNavigationDisplay() === "icons") {
                pages.classList.add("big");
                if ((printess.showLoadButton() || printess.showProofButton()) && printess.hasExpertButton() && printess.showSaveButton()) {
                    pages.classList.add("extra");
                }
                ul.style.overflowX = "auto";
                document.documentElement.style.setProperty("--editor-pagebar-height", "122px");
                document.documentElement.style.setProperty("--editor-margin-top", "10px");
            }
            else if (isStepTabsList || isDocTabs) {
                pages.classList.add("tabs");
                ul.style.overflowX = "auto";
                document.documentElement.style.setProperty("--editor-pagebar-height", "50px");
            }
            else {
                ul.classList.add("justify-content-center");
                document.documentElement.style.setProperty("--editor-pagebar-height", "50px");
            }
            if (isStepTabsList || isStepBadgeList || isDocTabs) {
                const tabsContainer = document.createElement("div");
                tabsContainer.className = "step-tabs-list";
                tabsContainer.id = "step-tab-list";
                tabsContainer.style.margin = "0 10px";
                if (!forMobile && !isDocTabs && isStepBadgeList) {
                    const prevTab = document.createElement("div");
                    prevTab.className = "nav-item";
                    const prevTabLink = document.createElement("a");
                    prevTabLink.className = "prev-badge btn btn-primary";
                    const icon = printess.getIcon("carret-left-solid");
                    icon.classList.add("tabs-scroller");
                    icon.style.paddingRight = "2px";
                    prevTabLink.appendChild(icon);
                    prevTab.appendChild(prevTabLink);
                    tabsContainer.appendChild(prevTab);
                    prevTab.onclick = () => {
                        const tabListScrollbar = document.getElementById("tabs-list-scrollbar");
                        if (tabListScrollbar && tabListScrollbar.scrollWidth > tabListScrollbar.clientWidth) {
                            scrollToLeft(tabListScrollbar, tabListScrollbar.scrollLeft - 200, 300, tabListScrollbar.scrollLeft);
                        }
                        else if (tabListScrollbar.scrollWidth === tabListScrollbar.clientWidth && printess.hasPreviousStep()) {
                            printess.previousStep();
                        }
                        else {
                            prevTabLink.classList.add("disabled");
                        }
                    };
                }
                tabsContainer.appendChild(getStepsTabsList(printess, forMobile, isDocTabs ? "doc tabs" : printess.stepHeaderDisplay()));
                if (!forMobile && !isDocTabs && !isStepTabsList) {
                    const nextTab = document.createElement("div");
                    nextTab.className = "nav-item";
                    nextTab.style.zIndex = "10";
                    nextTab.style.marginLeft = "-1px";
                    const nextTabLink = document.createElement("a");
                    nextTabLink.className = "next-badge btn btn-primary";
                    const icon = printess.getIcon("carret-right-solid");
                    icon.classList.add("tabs-scroller");
                    icon.style.paddingLeft = "2px";
                    nextTabLink.appendChild(icon);
                    nextTab.appendChild(nextTabLink);
                    tabsContainer.appendChild(nextTab);
                    nextTab.onclick = () => {
                        const tabListScrollbar = document.getElementById("tabs-list-scrollbar");
                        if (tabListScrollbar && tabListScrollbar.scrollWidth > tabListScrollbar.clientWidth) {
                            scrollToLeft(tabListScrollbar, tabListScrollbar.scrollLeft + 200, 300, tabListScrollbar.scrollLeft);
                        }
                        else if (tabListScrollbar.scrollWidth === tabListScrollbar.clientWidth && printess.hasNextStep()) {
                            printess.nextStep();
                        }
                        else {
                            nextTabLink.classList.add("disabled");
                        }
                    };
                }
                pages.appendChild(tabsContainer);
                const wrapper = document.createElement("div");
                wrapper.className = "d-flex price-basket-wrapper";
                const priceDiv = document.createElement("div");
                priceDiv.className = "total-price-container";
                priceDiv.id = "total-price-display";
                if (uih_currentPriceDisplay) {
                    getPriceDisplay(printess, priceDiv, uih_currentPriceDisplay);
                }
                else if (printess.getProductInfoUrl()) {
                    const infoIcon = printess.getIcon("info-circle");
                    infoIcon.classList.add("product-info-icon");
                    infoIcon.onclick = () => getIframeOverlay(printess, printess.gl("ui.productOverview"), printess.getProductInfoUrl(), forMobile);
                    priceDiv.appendChild(infoIcon);
                }
                wrapper.appendChild(priceDiv);
                const basketBtnBehaviour = printess.getBasketButtonBehaviour();
                if (basketBtnBehaviour === "go-to-preview" && isDocTabs) {
                    const previewBtn = document.createElement("button");
                    previewBtn.className = "btn btn-outline-primary";
                    previewBtn.classList.add("ms-2");
                    previewBtn.innerText = printess.gl("ui.buttonPreview");
                    previewBtn.onclick = () => __awaiter(this, void 0, void 0, function* () {
                        const validation = yield validateAllInputs(printess, "preview");
                        if (validation) {
                            yield printess.gotoNextPreviewDocument(0);
                            if (printess.showTabNavigation()) {
                                printess.resizePrintess();
                            }
                        }
                    });
                    wrapper.appendChild(previewBtn);
                }
                else if (printess.hasPreviewBackButton() && isDocTabs) {
                    tabsContainer.style.visibility = "hidden";
                    const previewBackButton = getPreviewBackButton(printess);
                    wrapper.appendChild(previewBackButton);
                }
                if (printess.showSaveAndCloseButton()) {
                    const saveAndQuitButton = document.createElement("button");
                    saveAndQuitButton.className = "btn btn-primary ms-2";
                    saveAndQuitButton.textContent = printess.gl("ui.buttonSaveAndClose");
                    saveAndQuitButton.onclick = () => saveTemplate(printess, "close");
                    wrapper.appendChild(saveAndQuitButton);
                }
                const button = document.createElement("button");
                button.className = "btn btn-primary ms-2 printess-basket-button";
                const iconName = printess.userInBuyerSide() ? "print-solid" : printess.gl("ui.buttonBasketIcon") || "shopping-cart-add";
                const icon = printess.getIcon(iconName);
                icon.style.width = "25px";
                icon.style.height = "25px";
                icon.style.fill = "var(--bs-light)";
                button.onclick = () => addToBasket(printess);
                button.appendChild(icon);
                if (!printess.showAddToBasketButton()) {
                    wrapper.appendChild(document.createElement("div"));
                }
                else {
                    wrapper.appendChild(button);
                }
                if (isStepTabsList || isDocTabs)
                    pages.appendChild(wrapper);
                return;
            }
            if (printess.pageNavigationDisplay() === "icons") {
                const docs = printess.getAllDocsAndSpreads();
                const pagesContainer = document.createElement("ul");
                pagesContainer.className = "pages-container";
                for (const doc of docs) {
                    const count = doc.spreads.reduce((prev, cur) => prev + cur.pages, 0);
                    let pageNo = 0;
                    for (const spread of doc.spreads) {
                        for (let pageIndex = 0; pageIndex < spread.pages; pageIndex++) {
                            pageNo++;
                            const page = pageIndex === 0 ? "left-page" : "right-page";
                            const isActive = info.spreadId === spread.spreadId && info.current === pageNo;
                            let hasDuplicateButton = false;
                            if (info.spreadId === spread.spreadId && printess.canDuplicateSpread()) {
                                if (hasFacingPages) {
                                    hasDuplicateButton = !info.isFirst && !info.isLast && pageNo % 2 === 1;
                                }
                                else {
                                    hasDuplicateButton = true;
                                }
                            }
                            if (isActive && !uih_currentVisiblePage)
                                uih_currentVisiblePage = page;
                            const disabled = printess.lockCoverInside() && (pageNo === 2 || pageNo === count - 1);
                            const li = document.createElement("li");
                            li.className = "big-page-item" + (forMobile ? " mobile" : "");
                            if (disabled) {
                                li.style.opacity = "0.5";
                                li.classList.add("disabled");
                            }
                            if (pageIndex === 0) {
                                if (doc.spreads[doc.spreadCount - 1] === spread) {
                                    if (forMobile) {
                                        li.classList.add("mobile-mr");
                                    }
                                    else {
                                        li.classList.add("mr");
                                    }
                                }
                                li.classList.add("ml");
                            }
                            if (isActive)
                                li.classList.add("active");
                            const p = spread.thumbnails ? (_a = spread.thumbnails[page === "right-page" ? 1 : 0]) !== null && _a !== void 0 ? _a : null : null;
                            const url = (_b = p === null || p === void 0 ? void 0 : p.url) !== null && _b !== void 0 ? _b : "";
                            const thumb = document.createElement("div");
                            thumb.className = "big-page-thumb";
                            thumb.id = "thumb_" + spread.spreadId + "_" + ((_c = p === null || p === void 0 ? void 0 : p.pageId) !== null && _c !== void 0 ? _c : "");
                            if (url) {
                                thumb.style.backgroundImage = "url(" + url + ")";
                                thumb.style.backgroundColor = (_d = p === null || p === void 0 ? void 0 : p.bgColor) !== null && _d !== void 0 ? _d : "white";
                            }
                            if (hasDuplicateButton) {
                                const duplicate = printess.getIcon("copy-solid");
                                duplicate.classList.add("duplicate-icon");
                                duplicate.addEventListener("click", () => {
                                    printess.duplicateSpread();
                                });
                                thumb.appendChild(duplicate);
                            }
                            if (spread.pages > 1) {
                                const shadow = document.createElement("div");
                                if (pageIndex === 0) {
                                    shadow.classList.add("book-shadow-gradient-left");
                                    thumb.style.borderRight = "none";
                                }
                                else {
                                    shadow.classList.add("book-shadow-gradient-right");
                                    thumb.style.borderLeft = "none";
                                }
                                thumb.appendChild(shadow);
                            }
                            let tHeight = 72;
                            let tWidth = spread.width / spread.pages / spread.height * tHeight;
                            if (tWidth > 200) {
                                tHeight = 200 / tWidth * tHeight;
                                tWidth = 200;
                            }
                            thumb.style.width = tWidth + "px";
                            thumb.style.height = tHeight + "px";
                            thumb.style.backgroundSize = "cover";
                            const caption = document.createElement("div");
                            caption.className = "big-page-caption";
                            caption.innerText = spread.names[pageIndex] ? spread.names[pageIndex] : pageNo.toString();
                            if (forMobile) {
                                li.appendChild(thumb);
                                li.appendChild(caption);
                            }
                            else {
                                li.appendChild(caption);
                                li.appendChild(thumb);
                            }
                            li.onclick = () => __awaiter(this, void 0, void 0, function* () {
                                uih_currentVisiblePage = null;
                                const curStep = printess.getStep();
                                if (curStep && doc.docId !== curStep.docId) {
                                    const errors = getActualErrors(yield printess.validateAsync(printess.hasNextStep() ? "until-current-step" : "all"));
                                    if (errors.length > 0) {
                                        printess.bringErrorIntoView(errors[0]);
                                        getValidationOverlay(printess, errors, "next");
                                        return;
                                    }
                                }
                                printess.selectDocumentAndSpread(doc.docId, spread.index, page);
                                document.querySelectorAll(".big-page-item").forEach(pi => pi.classList.remove("active"));
                                li.classList.add("active");
                            });
                            pagesContainer.appendChild(li);
                        }
                    }
                }
                const addSpreads = printess.canAddSpreads();
                const removeSpreads = printess.canRemoveSpreads();
                if (addSpreads > 0 || removeSpreads > 0) {
                    pagesContainer.appendChild(getPageArrangementButtons(printess, addSpreads, removeSpreads, hasFacingPages, forMobile));
                }
                ul.appendChild(pagesContainer);
            }
            else if (spreads.length > 1 && printess.pageNavigationDisplay() === "numbers") {
                const prev = getPaginationItem(printess, "previous");
                if (info.isFirst) {
                    prev.classList.add("disabled");
                }
                ul.appendChild(prev);
                const count = spreads.reduce((prev, cur) => prev + cur.pages, 0);
                const current = info.current;
                let pageNo = 0;
                let lastPos = "start";
                for (const spread of spreads) {
                    for (let pageIndex = 0; pageIndex < spread.pages; pageIndex++) {
                        pageNo++;
                        const page = pageIndex === 0 ? "left-page" : "right-page";
                        const isActive = current === pageNo;
                        if (isActive && !uih_currentVisiblePage)
                            uih_currentVisiblePage = page;
                        let pos = "skip";
                        if (pageNo === 1)
                            pos = "start";
                        if (pageNo === count)
                            pos = "end";
                        if (current === 1) {
                            if (pageNo === current + 1 || pageNo === current + 2) {
                                pos = "current";
                            }
                        }
                        else if (current === count) {
                            if (pageNo === current - 1 || pageNo === current - 2) {
                                pos = "current";
                            }
                        }
                        else if (current % 2 === 0) {
                            if (pageNo === current || pageNo === current + 1) {
                                pos = "current";
                            }
                        }
                        else {
                            if (pageNo === current - 1 || pageNo === current) {
                                pos = "current";
                            }
                        }
                        if (pos === "skip") {
                            if (lastPos !== "skip") {
                                ul.appendChild(getPaginationItem(printess, "ellipsis"));
                            }
                        }
                        else {
                            let disable = false;
                            if (printess.lockCoverInside()) {
                                if (pageNo === 2 || pageNo === count - 2) {
                                    disable = true;
                                }
                            }
                            ul.appendChild(getPaginationItem(printess, pageNo, spread, page, isActive, true, disable));
                        }
                        lastPos = pos;
                    }
                }
                const next = getPaginationItem(printess, "next");
                if (info.isLast) {
                    next.classList.add("disabled");
                }
                ul.appendChild(next);
            }
            pages.appendChild(ul);
            if (printess.pageNavigationDisplay() === "icons") {
                if (lastScrollLeftPos) {
                    ul.scrollTo(lastScrollLeftPos, 0);
                }
                const active = ul.querySelector(".active");
                if (active) {
                    const d = 170;
                    if (active.offsetLeft - ul.scrollLeft > ul.offsetWidth - d) {
                        ul.scrollTo(active.offsetLeft - ul.offsetWidth + d, 0);
                    }
                    else if (active.offsetLeft - ul.scrollLeft < d) {
                        ul.scrollTo(active.offsetLeft - d, 0);
                    }
                }
            }
            if (printess.pageNavigationDisplay() === "icons" && !forMobile) {
                const cornerTools = document.createElement("div");
                cornerTools.className = "corner-tools";
                const miniBar = getBackUndoMiniBar(printess);
                cornerTools.appendChild(miniBar);
                const miniBarWidth = parseInt((miniBar.style.width || "300px").replace("px", ""));
                cornerTools.style.width = (miniBarWidth) + "px";
                const priceDiv = document.createElement("div");
                priceDiv.className = "total-price-container";
                priceDiv.id = "total-price-display";
                if (uih_currentPriceDisplay) {
                    getPriceDisplay(printess, priceDiv, uih_currentPriceDisplay);
                }
                else {
                    const h2 = document.createElement("h2");
                    h2.innerText = printess.gl(printess.getTemplateTitle());
                    priceDiv.appendChild(h2);
                    if (printess.getProductInfoUrl()) {
                        const infoIcon = printess.getIcon("info-circle");
                        infoIcon.classList.add("product-info-icon");
                        infoIcon.onclick = () => getIframeOverlay(printess, printess.gl("ui.productOverview"), printess.getProductInfoUrl(), false);
                        priceDiv.appendChild(infoIcon);
                    }
                }
                cornerTools.appendChild(priceDiv);
                cornerTools.appendChild(getDesktopTitle(printess));
                pages.appendChild(cornerTools);
                const gradient = document.createElement("div");
                gradient.className = "big-gradient";
                gradient.style.width = (miniBarWidth + 194) + "px";
                pages.appendChild(gradient);
                const gradient2 = document.createElement("div");
                gradient2.className = "big-gradient2";
                gradient2.style.width = (miniBarWidth + 20) + "px";
                pages.appendChild(gradient2);
                pages.style.gridTemplateColumns = "auto " + (miniBarWidth + 20) + "px";
            }
        }
    }
    function getPageItem(printess, pageNo, pageIndex, spread, prevSpreadId, forMobile, facingPages, isLastSpread) {
        var _a, _b, _c, _d;
        const page = pageIndex === 0 ? "left-page" : "right-page";
        const pageItem = document.createElement("div");
        pageItem.className = "big-page-item" + (forMobile ? " mobile" : "");
        if (spread.index > 0 && spread.pages === 1) {
            pageItem.style.marginLeft = "auto";
        }
        const p = spread && spread.thumbnails ? (_a = spread.thumbnails[page === "right-page" ? 1 : 0]) !== null && _a !== void 0 ? _a : null : null;
        const url = (_b = p === null || p === void 0 ? void 0 : p.url) !== null && _b !== void 0 ? _b : "";
        const thumb = document.createElement("div");
        thumb.className = "big-page-thumb";
        thumb.id = spread ? "thumb_" + spread.spreadId + "_" + ((_c = p === null || p === void 0 ? void 0 : p.pageId) !== null && _c !== void 0 ? _c : "") : "";
        if (url) {
            thumb.style.backgroundImage = "url(" + url + ")";
            thumb.style.backgroundColor = (_d = p === null || p === void 0 ? void 0 : p.bgColor) !== null && _d !== void 0 ? _d : "white";
            thumb.style.backgroundPosition = page === "right-page" ? "right" : "left";
        }
        const spreadForWidth = spread || printess.getAllSpreads()[1];
        if (forMobile && !facingPages) {
            thumb.style.height = ((spreadForWidth.height / spreadForWidth.width * (window.innerWidth - 40) * 0.5) * spreadForWidth.pages * 0.84) + "px";
            thumb.style.width = ((window.innerWidth - 40) * 0.5 * 0.84) + "px";
        }
        else if (forMobile) {
            thumb.style.height = ((spreadForWidth.height / spreadForWidth.width * (window.innerWidth - 40) * 0.5) * spreadForWidth.pages * 0.46) + "px";
            thumb.style.width = ((window.innerWidth - 40) * 0.5 * 0.46) + "px";
        }
        else {
            thumb.style.width = (spreadForWidth.width / spreadForWidth.pages / spreadForWidth.height * 150) + "px";
        }
        const caption = document.createElement("div");
        caption.className = "big-page-caption";
        caption.innerText = spread && spread.names[pageIndex] ? spread.names[pageIndex] : pageNo.toString();
        pageItem.appendChild(caption);
        pageItem.appendChild(thumb);
        pageItem.ondragenter = (ev) => {
            ev.stopPropagation();
            ev.preventDefault();
            handlePageDragEvents(ev, spread, prevSpreadId, page, facingPages, isLastSpread);
        };
        pageItem.ondragover = (ev) => {
            ev.stopPropagation();
            ev.preventDefault();
            handlePageDragEvents(ev, spread, prevSpreadId, page, facingPages, isLastSpread);
        };
        pageItem.ondragleave = (ev) => {
            ev.stopPropagation();
            ev.preventDefault();
            const markers = document.querySelectorAll(".spread-drop-marker");
            markers.forEach(m => m.style.background = "transparent");
            if (spread.index === 0 && !facingPages) {
                const firstPageSeparator = document.getElementById("first-page_separator");
                if (firstPageSeparator)
                    firstPageSeparator.style.display = "none";
            }
            uih_lastDragTarget = undefined;
        };
        pageItem.ondrop = (ev) => {
            ev.stopPropagation();
            ev.preventDefault();
        };
        return pageItem;
    }
    function handlePageDragEvents(ev, spread, prevSpreadId, page, facingPages, isLastSpread) {
        let marker;
        let spreadId = spread.spreadId;
        if (!facingPages) {
            const markers = document.querySelectorAll(".spread-drop-marker");
            markers.forEach(m => m.style.background = "transparent");
        }
        const firstPage = spread.index === 0 && !facingPages;
        const lastPage = isLastSpread && !facingPages;
        const rightPage = page === "right-page" || (!facingPages && ev.offsetX > (ev.currentTarget).clientWidth / 2);
        if (rightPage) {
            if (lastPage) {
                marker = document.querySelector(`[data-after="last-page"]`);
                uih_lastDragTarget = "last-page";
                const separator = marker === null || marker === void 0 ? void 0 : marker.closest("li.spread-separator");
                if (separator)
                    separator.style.display = "grid";
            }
            else {
                marker = document.querySelector(`[data-after=${spreadId}]`);
                uih_lastDragTarget = spreadId;
            }
        }
        else {
            if (firstPage) {
                marker = document.querySelector(`[data-after="first-page"]`);
                uih_lastDragTarget = "first-page";
                const separator = marker === null || marker === void 0 ? void 0 : marker.closest("li.spread-separator");
                if (separator)
                    separator.style.display = "grid";
            }
            else {
                marker = document.querySelector(`[data-before=${spreadId}]`);
                uih_lastDragTarget = prevSpreadId;
            }
        }
        if (marker)
            marker.style.background = "var(--bs-primary)";
    }
    function getSpreadSeparator(spreadId, nextSpreadId, forMobile, facingPages) {
        const separator = document.createElement("li");
        separator.className = "spread-separator";
        separator.id = spreadId + "_separator";
        if (forMobile && !facingPages) {
            separator.style.width = "20px";
        }
        const marker = document.createElement("div");
        marker.className = "spread-drop-marker";
        marker.setAttribute("data-before", nextSpreadId);
        marker.setAttribute("data-after", spreadId);
        separator.ondragenter = (ev) => {
            ev.stopPropagation();
            ev.preventDefault();
            uih_lastDragTarget = spreadId;
            marker.style.background = "var(--bs-primary)";
        };
        separator.ondragover = (ev) => {
            ev.stopPropagation();
            ev.preventDefault();
            uih_lastDragTarget = spreadId;
            marker.style.background = "var(--bs-primary)";
        };
        separator.ondragleave = (ev) => {
            ev.stopPropagation();
            ev.preventDefault();
            uih_lastDragTarget = undefined;
            marker.style.background = "transparent";
        };
        separator.ondrop = (ev) => {
            ev.stopPropagation();
            ev.preventDefault();
        };
        separator.appendChild(document.createElement("div"));
        separator.appendChild(marker);
        return separator;
    }
    function getSpreadItem(printess, pageNo, forMobile, spread, spreads, snippets, facingPages) {
        const canAddRemoveSpread = (spread.index !== 0 && spread.index !== spreads.length - 1) || !facingPages;
        const addSpreads = printess.isNoOfPagesValid(spreads.length) ? printess.canAddSpreads(spreads.length) : 1;
        const removeSpreads = printess.canRemoveSpreads(spreads.length);
        const spreadItem = document.createElement("li");
        spreadItem.className = "spread-item";
        spreadItem.id = spread.spreadId;
        if (!facingPages && forMobile) {
            spreadItem.style.width = "42%";
        }
        spreadItem.dataset.snippet = spread.snippetUrl;
        spreadItem.draggable = canAddRemoveSpread;
        spreadItem.ondragstart = (ev) => {
            var _a;
            (_a = ev.dataTransfer) === null || _a === void 0 ? void 0 : _a.setData('text/plain', spread.spreadId);
        };
        spreadItem.ondragend = (ev) => {
            ev.stopPropagation();
            ev.preventDefault();
            const markers = document.querySelectorAll(".spread-drop-marker");
            markers.forEach(m => m.style.background = "transparent");
            const modalBody = document.querySelector("div.modal-body");
            if (modalBody && spreads && spread && uih_lastDragTarget && uih_lastDragTarget !== spread.spreadId) {
                const lastScrollPosition = modalBody.scrollTop;
                const filteredSpreads = spreads.filter(s => s.spreadId !== spread.spreadId);
                let idx = -1;
                if (uih_lastDragTarget === "last-page") {
                    idx = spreads.length - 1;
                }
                else if (uih_lastDragTarget !== "first-page") {
                    idx = filteredSpreads.findIndex(s => s.spreadId === uih_lastDragTarget);
                }
                filteredSpreads.splice(idx + 1, 0, spread);
                filteredSpreads.forEach((s, i) => s.index = i);
                modalBody.innerHTML = "";
                modalBody.appendChild(getArrangePagesContent(printess, forMobile, snippets, undefined, filteredSpreads, [{ id: spread.spreadId, snippetUrl: "" }]));
                modalBody.scrollTo({ top: lastScrollPosition, behavior: 'auto' });
                uih_lastDragTarget = undefined;
            }
        };
        spreadItem.ondrop = (ev) => {
            ev.stopPropagation();
            ev.preventDefault();
        };
        spreadItem.onmousedown = () => {
            if (!canAddRemoveSpread)
                return;
            const hint = document.createElement("div");
            hint.innerText = printess.gl("ui.arrangePagesShortText");
            hint.className = "spread-drag-hint";
            spreadItem.appendChild(hint);
            window.setTimeout(() => {
                spreadItem.removeChild(hint);
            }, 2000);
        };
        spreadItem.ontouchstart = () => {
            if (!canAddRemoveSpread)
                return;
            const hint = document.createElement("div");
            hint.innerText = printess.gl("ui.arrangePagesShortText");
            hint.className = "spread-drag-hint";
            spreadItem.appendChild(hint);
            window.setTimeout(() => {
                spreadItem.removeChild(hint);
            }, 2000);
        };
        for (let pageIndex = 0; pageIndex < spread.pages; pageIndex++) {
            pageNo++;
            const prevSpreadId = spread.index === 0 ? spread.spreadId : spreads[spread.index - 1].spreadId;
            const pageItem = getPageItem(printess, pageNo, pageIndex, spread, prevSpreadId, forMobile, facingPages, spread.index === spreads.length - 1);
            spreadItem.appendChild(pageItem);
        }
        if (addSpreads && canAddRemoveSpread) {
            const plusBtn = document.createElement("div");
            plusBtn.className = "add-pages-icon";
            const plusIcon = printess.getIcon("plus");
            plusIcon.classList.add("add-icon");
            plusBtn.appendChild(plusIcon);
            plusBtn.onmousedown = () => {
                addBookPage(printess, spreads, spread, addSpreads, snippets, forMobile);
            };
            plusBtn.ontouchstart = () => {
                addBookPage(printess, spreads, spread, addSpreads, snippets, forMobile);
            };
            spreadItem.appendChild(plusBtn);
        }
        if (removeSpreads && canAddRemoveSpread) {
            const deleteBtn = document.createElement("div");
            deleteBtn.className = "remove-pages-icon";
            const deleteIcon = printess.getIcon("trash");
            deleteIcon.classList.add("delete-btn");
            deleteBtn.onclick = () => {
                spreadItem.classList.add("delete-spread-box", "spread-box", "faded-in");
                requestAnimationFrame(() => {
                    spreadItem.classList.remove("faded-in");
                    spreadItem.classList.add("faded-out");
                });
                window.setTimeout(() => {
                    const separator = document.getElementById(spread.spreadId + "_separator");
                    if (separator)
                        separator.remove();
                    spreadItem.remove();
                    const filteredSpreads = spreads.filter(s => s.spreadId !== spread.spreadId);
                    filteredSpreads.forEach((s, i) => s.index = i);
                    const modalBody = document.querySelector("div.modal-body");
                    if (modalBody) {
                        const lastScrollPosition = modalBody.scrollTop;
                        modalBody.innerHTML = "";
                        modalBody.appendChild(getArrangePagesContent(printess, forMobile, snippets, undefined, filteredSpreads));
                        modalBody.scrollTo({ top: lastScrollPosition, behavior: 'auto' });
                    }
                }, 500);
            };
            deleteBtn.appendChild(deleteIcon);
            spreadItem.appendChild(deleteBtn);
            spreadItem.classList.add("can-add-remove-spread");
        }
        if (canAddRemoveSpread) {
            const moveBtn = document.createElement("div");
            moveBtn.className = "move-pages-icon";
            const moveIcon = printess.getIcon("arrows");
            moveIcon.classList.add("move-icon");
            moveBtn.appendChild(moveIcon);
        }
        return spreadItem;
    }
    function addBookPage(printess, spreads, spread, addSpreads, snippets, forMobile) {
        var _a;
        const modalBody = document.querySelector("div.modal-body");
        const newSpreadIds = [];
        for (let i = 0; i < addSpreads; i++) {
            const snippet = snippets[Math.floor(Math.random() * snippets.length)];
            const newSpread = {
                docId: spread.docId,
                snippetUrl: (_a = snippet === null || snippet === void 0 ? void 0 : snippet.snippetUrl) !== null && _a !== void 0 ? _a : "",
                spreadId: "newSpread_" + Math.floor(Math.random() * (999999 - 100000) + 100000),
                index: spread.index + 1,
                name: "",
                names: spread.pages === 1 ? [""] : ["", ""],
                width: spread.width,
                height: spread.height,
                pages: spread.pages,
                thumbnails: [{ url: (snippet === null || snippet === void 0 ? void 0 : snippet.thumbUrl) || "", bgColor: (snippet === null || snippet === void 0 ? void 0 : snippet.bgColor) || "white", pageId: "left" }, { url: (snippet === null || snippet === void 0 ? void 0 : snippet.thumbUrl) || "", bgColor: (snippet === null || snippet === void 0 ? void 0 : snippet.bgColor) || "white", pageId: "right" }]
            };
            const idx = spread.index + 1;
            spreads.sort((a, b) => a.index - b.index);
            for (let i = spread.index + 1; i < spreads.length; i++) {
                spreads[i].index = i + 1;
            }
            spreads.splice(idx, 0, newSpread);
            newSpreadIds.push({ id: newSpread.spreadId, snippetUrl: newSpread.snippetUrl });
        }
        if (modalBody) {
            const lastScrollPosition = modalBody.scrollTop;
            modalBody.innerHTML = "";
            modalBody.appendChild(getArrangePagesContent(printess, forMobile, snippets, undefined, spreads, newSpreadIds));
            modalBody.scrollTo({ top: lastScrollPosition, behavior: 'auto' });
        }
    }
    function getArrangePagesContent(printess, forMobile, snippets, doc, spreads, newSpreadIds, modalFooter, warning) {
        const content = document.createElement("div");
        if (!forMobile) {
            const infoText = document.createElement("p");
            infoText.className = "arrange-pages-info-text";
            infoText.textContent = printess.gl("ui.arrangePagesInfoText");
            content.appendChild(infoText);
        }
        const scrollTopDiv = document.createElement("div");
        scrollTopDiv.className = "scroll-up-indicator no-selection";
        scrollTopDiv.ondragover = (ev) => {
            ev.stopPropagation();
            ev.preventDefault();
            const container = document.querySelector(".modal-body");
            if (container) {
                if (forMobile) {
                    container.scrollTop -= 10;
                }
                else {
                    container.scrollTo({ top: container.scrollTop - 10, behavior: 'smooth' });
                }
            }
        };
        content.appendChild(scrollTopDiv);
        const ul = document.createElement("div");
        ul.className = "pagination pagination-lg";
        const pagesContainer = document.createElement("ul");
        pagesContainer.className = "pages-container";
        pagesContainer.id = "page-arrange-dialog-spreads";
        const docs = printess.getAllDocsAndSpreads();
        doc = doc || docs.filter(doc => doc.isBook)[0];
        spreads = spreads || doc.spreads.map(x => { return Object.assign(Object.assign({}, x), { snippetUrl: "" }); });
        modalFooter = modalFooter || document.querySelector(".modal-footer");
        warning = warning || document.getElementById("spread-size-warning");
        if (warning && modalFooter) {
            if (!printess.isNoOfPagesValid(spreads.length)) {
                modalFooter.classList.add("printess-pages-warning");
                warning.style.display = "block";
            }
            else {
                modalFooter.classList.remove("printess-pages-warning");
                warning.style.display = "none";
            }
        }
        let pageNo = 0;
        for (const spread of spreads) {
            if (spread.index === 0 && !doc.facingPages) {
                const spreadSeparator = getSpreadSeparator("first-page", spread.spreadId, forMobile, doc.facingPages);
                spreadSeparator.style.display = "none";
                pagesContainer.appendChild(spreadSeparator);
            }
            const spreadItem = getSpreadItem(printess, pageNo, forMobile, spread, spreads, snippets, doc.facingPages);
            pagesContainer.appendChild(spreadItem);
            if (newSpreadIds && newSpreadIds.map(x => x.id).includes(spread.spreadId)) {
                spreadItem.classList.add("spread-box", "faded-out");
                requestAnimationFrame(() => {
                    spreadItem.classList.remove("faded-out");
                });
            }
            if (spreads[spreads.length - 1] !== spread) {
                const spreadId = spread.spreadId;
                const nextSpreadId = spreads[spread.index + 1].spreadId;
                pagesContainer.appendChild(getSpreadSeparator(spreadId, nextSpreadId, forMobile, doc.facingPages));
            }
            else if (spreads[spreads.length - 1] === spread && !doc.facingPages) {
                const spreadSeparator = getSpreadSeparator("last-page", spread.spreadId, forMobile, doc.facingPages);
                spreadSeparator.style.display = "none";
                pagesContainer.appendChild(spreadSeparator);
            }
            pageNo += spread.pages;
        }
        ul.appendChild(pagesContainer);
        content.appendChild(ul);
        const scrollBottomDiv = document.createElement("div");
        scrollBottomDiv.className = "scroll-down-indicator no-selection";
        scrollBottomDiv.ondragover = (ev) => {
            ev.stopPropagation();
            ev.preventDefault();
            const container = document.querySelector(".modal-body");
            if (container) {
                if (forMobile) {
                    container.scrollTop += 10;
                }
                else {
                    container.scrollTo({ top: container.scrollTop + 10, behavior: 'smooth' });
                }
            }
        };
        content.appendChild(scrollBottomDiv);
        return content;
    }
    function getArrangePagesOverlay(printess, forMobile) {
        return __awaiter(this, void 0, void 0, function* () {
            const docs = printess.getAllDocsAndSpreads();
            const doc = docs.filter(doc => doc.isBook)[0];
            const snippets = yield printess.getInsertSpreadSnippets();
            const title = printess.gl("ui.arrangePages");
            const footer = document.createElement("div");
            footer.className = "modal-footer";
            const warning = document.createElement("div");
            warning.id = "spread-size-warning";
            warning.textContent = doc.facingPages ? printess.gl("ui.twoSpreadWarning") : printess.gl("ui.oneSpreadWarning");
            const close = document.createElement("button");
            close.className = "btn btn-outline-primary";
            close.textContent = printess.gl("ui.buttonCancel");
            close.onclick = () => {
                hideModal("pageArrangementDialog");
            };
            const ok = document.createElement("button");
            ok.className = "btn btn-primary";
            ok.id = "apply-book-changes";
            ok.textContent = printess.gl("ui.applyChanges");
            ok.onclick = () => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c;
                const allSpreadIds = [];
                let showPagesAddedInfo = false;
                for (const div of (_b = (_a = document.querySelector("#page-arrange-dialog-spreads")) === null || _a === void 0 ? void 0 : _a.children) !== null && _b !== void 0 ? _b : []) {
                    if (div.classList.contains("spread-item")) {
                        const id = div.id;
                        const snippetUrl = (_c = div.dataset.snippet) !== null && _c !== void 0 ? _c : "";
                        if (id) {
                            allSpreadIds.push({ id: id, snippetUrl: snippetUrl });
                        }
                    }
                }
                if (!printess.isNoOfPagesValid(allSpreadIds.length)) {
                    showPagesAddedInfo = true;
                    const idx = allSpreadIds.length - 1;
                    const url = snippets.length ? snippets[Math.floor(Math.random() * snippets.length)].snippetUrl : "";
                    allSpreadIds.splice(idx, 0, { id: "newSpread", snippetUrl: url });
                }
                printess.reArrangeSpreads(allSpreadIds);
                hideModal("pageArrangementDialog");
                if (showPagesAddedInfo)
                    getPagesAddedInfoOverlay(printess, doc.facingPages);
                printess.resizePrintess();
            });
            footer.appendChild(warning);
            footer.appendChild(close);
            footer.appendChild(ok);
            const content = getArrangePagesContent(printess, forMobile, snippets, doc, undefined, undefined, footer, warning);
            showModal(printess, "pageArrangementDialog", content, title, footer);
        });
    }
    function getPagesAddedInfoOverlay(printess, facingPages) {
        const title = facingPages ? printess.gl("ui.twoPagesAddedTitle") : printess.gl("ui.onePageAddedTitle");
        const content = document.createElement("div");
        content.textContent = facingPages ? printess.gl("ui.twoPagesAddedInfo") : printess.gl("ui.onePageAddedInfo");
        const footer = document.createElement("div");
        footer.className = "modal-footer";
        const close = document.createElement("button");
        close.className = "btn btn-primary";
        close.textContent = printess.gl("ui.buttonClose");
        close.onclick = () => {
            hideModal("pageAddedInfoDialog");
        };
        footer.appendChild(close);
        showModal(printess, "pageAddedInfoDialog", content, title, footer);
    }
    function renderMyImagesTab(printess, forMobile, p, images, imagesContainer, showSearchIcon = true, showMobileImagesUploadBtn = false) {
        var _a, _b, _c, _d, _f, _g, _h, _j, _k;
        const container = imagesContainer || document.createElement("div");
        container.id = "image-tab-container";
        container.innerHTML = "";
        const imageList = document.createElement("div");
        imageList.classList.add("image-list");
        images = images || printess.getImages(p === null || p === void 0 ? void 0 : p.id);
        const dragDropHint = document.createElement("p");
        dragDropHint.style.fontFamily = "var(--bs-font-sans-serif)";
        dragDropHint.style.marginTop = "10px";
        dragDropHint.textContent = printess.gl("ui.dragDropHint");
        if (!p || ((_a = p === null || p === void 0 ? void 0 : p.imageMeta) === null || _a === void 0 ? void 0 : _a.canUpload) || ((_b = p.imageMeta) === null || _b === void 0 ? void 0 : _b.isHandwriting)) {
            const distributeBtn = document.createElement("button");
            distributeBtn.id = "distribute-button";
            distributeBtn.className = "btn btn-secondary mb-3";
            distributeBtn.innerText = printess.gl("ui.buttonDistribute");
            distributeBtn.onclick = () => {
                getDistributionOverlay(printess, forMobile, p, container);
            };
            const twoButtons = document.createElement("div");
            twoButtons.id = "two-buttons";
            twoButtons.style.display = "grid";
            twoButtons.appendChild(getImageUploadButton(printess, p, (_c = p === null || p === void 0 ? void 0 : p.id) !== null && _c !== void 0 ? _c : "", true, p !== undefined));
            if (printess.showImageDistributionButton()) {
                twoButtons.style.gridTemplateColumns = "1fr 15px 1fr";
                twoButtons.appendChild(document.createElement("div"));
                twoButtons.appendChild(distributeBtn);
            }
            if (!forMobile || showMobileImagesUploadBtn)
                container.appendChild(twoButtons);
        }
        if (!forMobile && printess.showMobileUploadButton() && (!p || ((_d = p.imageMeta) === null || _d === void 0 ? void 0 : _d.canUpload))) {
            const mobileUploadButton = document.createElement("button");
            mobileUploadButton.className = "btn btn-secondary w-100 mb-3 mt-2";
            mobileUploadButton.innerText = printess.gl("ui.mobileImageUpload");
            mobileUploadButton.onclick = () => __awaiter(this, void 0, void 0, function* () {
                yield getMobileImagesUploadOverlay(printess);
            });
            container.appendChild(mobileUploadButton);
        }
        if (!printess.allowOnlyVectorImageUpload()
            && !(forMobile && p)
            && images.length <= 12
            && !(p === null || p === void 0 ? void 0 : p.id.startsWith("FF_"))
            && (!p || ((_f = p.imageMeta) === null || _f === void 0 ? void 0 : _f.canUpload))) {
            const multipleImagesHint = document.createElement("p");
            multipleImagesHint.id = "multiple-images-hint";
            multipleImagesHint.style.fontFamily = "var(--bs-font-sans-serif)";
            multipleImagesHint.textContent = printess.gl("ui.uploadMultipleImagesInfo");
            container.appendChild(multipleImagesHint);
        }
        const s = printess.getSelectedImageRecommendedSize();
        if (s) {
            let info = printess.gl("ui.imageSizeInfo");
            info = info.replace("[image-size]", s.pxWidth + " x " + s.pxHeight + " px");
            const imageSizeHint = document.createElement("p");
            imageSizeHint.id = "image-size-hint";
            imageSizeHint.style.fontFamily = "var(--bs-font-sans-serif)";
            imageSizeHint.textContent = info;
            if (forMobile && p)
                imageSizeHint.style.display = "none";
            if (images.length <= 12 && !(p === null || p === void 0 ? void 0 : p.id.startsWith("FF_")))
                container.appendChild(imageSizeHint);
        }
        if (printess.showSearchBar()) {
            container.appendChild(getSearchBar(printess, p, container, forMobile, showSearchIcon));
        }
        const imageGroups = printess.getImageGroups(p === null || p === void 0 ? void 0 : p.id);
        if ((!p || p.kind !== "selection-text-style")) {
            if (imageGroups.length > 1) {
                if ((images === null || images === void 0 ? void 0 : images.filter(i => i.group === uih_activeImageAccordion).length) === 0) {
                    uih_activeImageAccordion = imageGroups[1];
                }
                const accordion = document.createElement("div");
                accordion.className = "accordion mb-3";
                accordion.id = "accordion_" + (p === null || p === void 0 ? void 0 : p.id);
                imageGroups.forEach(group => {
                    if (images === null || images === void 0 ? void 0 : images.filter(i => i.group === group).length) {
                        const card = document.createElement("div");
                        card.className = "accordion-item";
                        card.style.background = "transparent";
                        const title = document.createElement("h2");
                        title.className = "accordion-header";
                        title.id = "heading-" + group.replace(" ", "");
                        const button = document.createElement("button");
                        button.className = `accordion-button ${group === uih_activeImageAccordion ? "" : "collapsed"}`;
                        button.style.backgroundColor = "transparent";
                        button.setAttribute("data-bs-toggle", "collapse");
                        button.setAttribute("data-bs-target", "#collapse-" + group.replace(" ", ""));
                        button.setAttribute("aria-expanded", "true");
                        button.setAttribute("aria-controls", "collapse-" + group.replace(" ", ""));
                        button.textContent = group === "Buyer Upload" ? printess.gl("ui.imagesTab") : printess.gl(group);
                        button.onclick = () => uih_activeImageAccordion = group;
                        const collapse = document.createElement("div");
                        collapse.className = `accordion-collapse collapse ${group === uih_activeImageAccordion ? "show" : ""}`;
                        collapse.setAttribute("aria-labelledby", "heading-" + group.replace(" ", ""));
                        collapse.setAttribute("data-bs-parent", "#accordion_" + (p === null || p === void 0 ? void 0 : p.id));
                        collapse.id = "collapse-" + group.replace(" ", "");
                        const body = document.createElement("div");
                        body.className = "accordion-body";
                        const groupList = document.createElement("div");
                        groupList.classList.add("image-list");
                        for (const im of images === null || images === void 0 ? void 0 : images.filter(i => i.group === group)) {
                            groupList.appendChild(getImageThumb(printess, p, im, container, groupList, forMobile));
                        }
                        title.appendChild(button);
                        body.appendChild(groupList);
                        collapse.appendChild(body);
                        card.appendChild(title);
                        card.appendChild(collapse);
                        accordion.appendChild(card);
                    }
                });
                container.appendChild(accordion);
                if (p && ((_g = p.imageMeta) === null || _g === void 0 ? void 0 : _g.canSetDefaultImage) && ((_h = p.validation) === null || _h === void 0 ? void 0 : _h.defaultValue) !== "fallback") {
                    const resetButton = getDefaultImageButton(printess, p, "button");
                    container.appendChild(resetButton);
                }
            }
            else {
                if (p && ((_j = p.imageMeta) === null || _j === void 0 ? void 0 : _j.canSetDefaultImage) && ((_k = p.validation) === null || _k === void 0 ? void 0 : _k.defaultValue) !== "fallback") {
                    const defaultThumb = getDefaultImageButton(printess, p, "div");
                    imageList.appendChild(defaultThumb);
                }
                for (const im of images) {
                    imageList.appendChild(getImageThumb(printess, p, im, container, imageList, forMobile));
                }
                container.appendChild(imageList);
            }
        }
        if (!forMobile && images.length > 0 && (p === null || p === void 0 ? void 0 : p.kind) !== "image-id")
            container.appendChild(dragDropHint);
        return container;
    }
    function getDefaultImageButton(printess, p, type) {
        var _a;
        const resetButton = document.createElement(type);
        if (type === "button") {
            resetButton.className = "btn btn-secondary w-100";
            resetButton.textContent = printess.gl("ui.resetToDefaultImage");
        }
        else {
            resetButton.className = "default-img-thumb";
            if (((_a = p.validation) === null || _a === void 0 ? void 0 : _a.defaultValue) === p.value) {
                resetButton.style.border = "2px solid var(--bs-primary)";
                resetButton.style.outline = "3px solid var(--bs-primary)";
            }
            const icon = printess.getIcon("camera-slash");
            icon.style.width = "55px";
            icon.style.height = "55px";
            resetButton.appendChild(icon);
        }
        resetButton.onclick = () => __awaiter(this, void 0, void 0, function* () {
            if (p && p.validation && p.imageMeta) {
                const pValue = p.validation.defaultValue;
                yield printess.setProperty(p.id, pValue);
                p.value = pValue;
                if (p.imageMeta) {
                    p.imageMeta.canScale = false;
                }
                const propsDiv = document.getElementById("tabs-panel-" + p.id);
                if (propsDiv) {
                    propsDiv.replaceWith(getPropertyControl(printess, p));
                }
            }
        });
        return resetButton;
    }
    function getImageThumb(printess, p, im, container, imageList, forMobile) {
        var _a;
        const thumb = document.createElement("div");
        thumb.className = "big";
        thumb.draggable = true;
        thumb.ondragstart = (ev) => {
            var _a;
            if ((p === null || p === void 0 ? void 0 : p.kind) === "image-id") {
                ev.preventDefault();
            }
            (_a = ev.dataTransfer) === null || _a === void 0 ? void 0 : _a.setData('text/plain', `${im.id}`);
        };
        thumb.style.backgroundImage = im.thumbCssUrl;
        thumb.style.position = "relative";
        thumb.style.width = "91px";
        thumb.style.height = "91px";
        if (printess.getImageThumbFitProperty() === "fit") {
            thumb.style.backgroundSize = "contain";
        }
        if (im.inUse) {
            if (im.useCount > 1) {
                const box = document.createElement("div");
                box.className = "image-inuse-checker use-count";
                const span = document.createElement("span");
                span.textContent = im.useCount.toString();
                box.appendChild(span);
                thumb.appendChild(box);
            }
            else {
                const chk = printess.getIcon("check-square");
                chk.classList.add("image-inuse-checker");
                thumb.appendChild(chk);
            }
        }
        else {
            const cls = document.createElement("div");
            cls.classList.add("delete-btn-container");
            const icon = printess.getIcon("trash");
            icon.classList.add("delete-btn");
            icon.onclick = (e) => {
                e.stopImmediatePropagation();
                imageList.removeChild(thumb);
                printess.deleteImages([im]);
            };
            cls.appendChild(icon);
            if (forMobile)
                cls.style.display = "block";
            if (!p || ((_a = p === null || p === void 0 ? void 0 : p.imageMeta) === null || _a === void 0 ? void 0 : _a.canUpload))
                thumb.appendChild(cls);
        }
        if (p) {
            if (im.id === p.value) {
                thumb.style.border = "2px solid var(--bs-primary)";
                thumb.style.outline = "3px solid var(--bs-primary)";
            }
            thumb.onclick = () => __awaiter(this, void 0, void 0, function* () {
                const scaleHints = yield printess.setProperty(p.id, im.id);
                p.value = im.id;
                if (scaleHints && p.imageMeta) {
                    p.imageMeta.scaleHints = scaleHints;
                    p.imageMeta.scale = scaleHints.scale;
                    p.imageMeta.thumbCssUrl = im.thumbCssUrl;
                    p.imageMeta.thumbUrl = im.thumbUrl;
                    p.imageMeta.canScale = printess.canScale(p.id);
                }
                if (forMobile) {
                    const mobileButtonsContainer = document.querySelector(".mobile-buttons-container");
                    if (mobileButtonsContainer) {
                        mobileButtonsContainer.innerHTML = "";
                        getMobileButtons(printess, mobileButtonsContainer, p.id, true, true);
                    }
                    const newImages = printess.getImages(p === null || p === void 0 ? void 0 : p.id);
                    renderMyImagesTab(printess, forMobile, p, newImages, container);
                    closeMobileFullscreenContainer();
                }
                else {
                    const propsDiv = document.getElementById("tabs-panel-" + p.id);
                    if (propsDiv) {
                        propsDiv.replaceWith(getPropertyControl(printess, p));
                    }
                }
            });
        }
        else {
            thumb.onclick = () => __awaiter(this, void 0, void 0, function* () {
                printess.assignImageToNextPossibleFrame(im.id);
                if (forMobile) {
                    closeMobileFullscreenContainer();
                }
            });
        }
        return thumb;
    }
    function getSearchBar(printess, p, container, forMobile, showSearchIcon) {
        const searchWrapper = document.createElement("div");
        searchWrapper.className = "d-flex mb-3 position-relative";
        const searchInput = document.createElement("input");
        searchInput.type = "search";
        searchInput.className = "form-control";
        searchInput.id = "search-input";
        searchInput.placeholder = printess.gl("ui.search");
        const searchBtn = document.createElement("button");
        searchBtn.className = showSearchIcon ? "btn btn-primary" : "btn btn-secondary";
        searchBtn.id = "search-btn";
        let searchIcon = showSearchIcon ? printess.getIcon("search-light") : printess.getIcon("close");
        searchIcon.style.height = "20px";
        searchInput.oninput = () => {
            searchBtn.className = "btn btn-primary";
            searchBtn.innerHTML = "";
            searchIcon = printess.getIcon("search-light");
            searchIcon.style.height = "20px";
            searchBtn.appendChild(searchIcon);
            const searchValue = document.getElementById("search-input");
            const list = document.getElementById("search-list") || document.createElement("ul");
            list.className = "list-group position-absolute";
            list.id = "search-list";
            list.style.top = "38px";
            list.style.left = "0";
            list.style.width = "100%";
            list.style.zIndex = "10";
            list.style.boxShadow = "0 2px 5px 0 rgba(0,0,0,.2),0 2px 10px 0 rgba(0,0,0,.1)";
            list.innerHTML = "";
            printess.getImageGroups(p === null || p === void 0 ? void 0 : p.id).filter(g => g !== "Buyer Upload" && g.toLowerCase().includes(searchValue.value.toLowerCase())).forEach(group => {
                const images = printess.getImages(p === null || p === void 0 ? void 0 : p.id);
                if (images === null || images === void 0 ? void 0 : images.filter(i => i.group === group).length) {
                    const listItem = document.createElement("li");
                    listItem.className = "list-group-item search-list-item";
                    listItem.textContent = group;
                    listItem.onclick = () => {
                        const images = printess.getImages(p === null || p === void 0 ? void 0 : p.id);
                        const newImages = images === null || images === void 0 ? void 0 : images.filter(i => i.group === group);
                        renderMyImagesTab(printess, forMobile, p, newImages, container, false);
                    };
                    list.appendChild(listItem);
                }
            });
            if (searchValue.value.trim() === "") {
                list.innerHTML = "";
            }
            searchWrapper.appendChild(list);
        };
        searchBtn.onclick = () => {
            const images = printess.getImages(p === null || p === void 0 ? void 0 : p.id);
            const searchValue = document.getElementById("search-input");
            const newImages = images === null || images === void 0 ? void 0 : images.filter(i => i.group.toLowerCase().includes(searchValue.value.toLocaleLowerCase()));
            if (searchValue.value.trim() === "") {
                renderMyImagesTab(printess, forMobile, p, newImages, container, true);
            }
            else {
                renderMyImagesTab(printess, forMobile, p, newImages, container, false);
            }
        };
        searchBtn.appendChild(searchIcon);
        searchWrapper.appendChild(searchInput);
        searchWrapper.appendChild(searchBtn);
        return searchWrapper;
    }
    function getMobilePropertiesCaption(printess, tabs = uih_currentTabs) {
        var _a;
        if (uih_currentTabId === "LOADING") {
            uih_currentTabId = printess.getInitialTabId() === "#FORMFIELDS" ? (_a = tabs[0]) === null || _a === void 0 ? void 0 : _a.id : printess.getInitialTabId();
        }
        let caption = "";
        const currentTab = tabs.filter(t => t.id === uih_currentTabId)[0] || "";
        if (currentTab) {
            caption = currentTab.head || currentTab.caption;
        }
        return caption;
    }
    function renderMobileDialogFullscreen(printess, id, caption, content, addTabsNavigation = true) {
        const container = document.createElement("div");
        container.id = id;
        container.className = "fullscreen-mobile-dialog show-image-list";
        getMobileFullscreenContent(printess, id, container, caption, content, addTabsNavigation);
        document.body.appendChild(container);
    }
    function renderMobilePropertiesFullscreen(printess, id, state) {
        let container = document.querySelector(".fullscreen-add-properties");
        if (!container) {
            container = document.createElement("div");
            container.className = "fullscreen-add-properties image-list-preset";
        }
        else {
            container.innerHTML = "";
            container.className = "fullscreen-add-properties image-list-preset";
        }
        if (state === "open")
            container.className = "fullscreen-add-properties show-image-list";
        if (printess.showTabNavigation()) {
            container.classList.add("mobile-tabs");
            const caption = printess.showMobileTabNavigation() ? "" : getMobilePropertiesCaption(printess, uih_currentTabs);
            const propsContainer = document.createElement("div");
            renderTabNavigationProperties(printess, propsContainer, true);
            getMobileFullscreenContent(printess, id, container, caption, propsContainer, true);
            const okBtn = getMobileNavButton({
                name: "clear",
                icon: printess.getIcon("check"),
                task: () => closeLayoutOverlays(printess, true)
            }, false);
            okBtn.classList.add("mobile-tab-nav-ok");
            container.appendChild(okBtn);
        }
        else {
            const groupSnippets = renderGroupSnippets(printess, uih_currentGroupSnippets, true);
            getMobileFullscreenContent(printess, "add-design", container, "ui.addDesign", groupSnippets, false);
        }
        openMobileFullscreenContainer("add-properties");
        document.body.appendChild(container);
    }
    function renderMobileImageListFullscreen(printess, id, title, tabContent, p) {
        let container = document.querySelector(".image-list-fullscreen");
        if (!container) {
            container = document.createElement("div");
            container.className = "image-list-fullscreen image-list-preset";
        }
        else {
            container.innerHTML = "";
            container.className = "image-list-fullscreen image-list-preset";
        }
        getMobileFullscreenContent(printess, id, container, title, tabContent, false, p);
        return container;
    }
    function getMobileFullscreenContent(printess, id, container, title, tabContent, addTabsNavigation, p) {
        var _a;
        const content = document.createElement("div");
        content.className = "mobile-fullscreen-content";
        content.id = id + "_" + ((_a = p === null || p === void 0 ? void 0 : p.id) !== null && _a !== void 0 ? _a : "");
        content.appendChild(tabContent);
        if (title) {
            const header = document.createElement("div");
            header.style.height = "50px";
            header.className = "image-list-header bg-primary text-light";
            header.innerHTML = printess.gl(title).replace(/\\n/g, " ");
            const exitBtn = printess.getIcon("close");
            exitBtn.style.width = "20px";
            exitBtn.style.height = "24px";
            exitBtn.onclick = () => {
                container === null || container === void 0 ? void 0 : container.classList.remove("show-image-list");
                container === null || container === void 0 ? void 0 : container.classList.add("hide-image-list");
                closeMobileExternalLayoutsContainer();
                if (id === "CROPMODAL" || id === "PRICE-INFO" || id.startsWith("FF_")) {
                    window.setTimeout(() => hideModal(id), 1000);
                }
                if (id.startsWith("FF_")) {
                    const tr = document.querySelector("tr.table-active");
                    if (tr && tr.dataset.rowNumber) {
                        tableEditRowIndex = parseInt(tr.dataset.rowNumber);
                    }
                    const badge = document.getElementById("table-record-badge");
                    if (badge) {
                        badge.textContent = (tableEditRowIndex + 1).toString();
                    }
                }
            };
            header.appendChild(exitBtn);
            container.appendChild(header);
        }
        else {
            container.style.gridTemplateRows = "1fr 100px";
            container.style.animation = "expand 0.4s ease";
        }
        const tabsContainer = document.createElement("div");
        tabsContainer.className = "tabs-navigation";
        renderTabsNavigation(printess, tabsContainer, true);
        container.appendChild(content);
        if (addTabsNavigation)
            container.appendChild(tabsContainer);
    }
    function updateMobilePropertiesFullscreen(printess) {
        const imageListHeader = document.querySelector(".fullscreen-add-properties .image-list-header");
        if (imageListHeader) {
            const caption = getMobilePropertiesCaption(printess, uih_currentTabs);
            imageListHeader.innerHTML = caption.replace(/\\n/g, " ");
            const exitBtn = printess.getIcon("close");
            exitBtn.style.width = "20px";
            exitBtn.style.height = "24px";
            exitBtn.onclick = () => {
                closeMobileFullscreenContainer();
            };
            imageListHeader.appendChild(exitBtn);
        }
        const propsContainer = document.querySelector(".fullscreen-add-properties .mobile-fullscreen-content");
        if (propsContainer) {
            propsContainer.innerHTML = "";
            renderTabNavigationProperties(printess, propsContainer, true);
        }
    }
    function openMobileFullscreenContainer(type) {
        let fullscreenContainer;
        if (type === "add-properties") {
            fullscreenContainer = document.querySelector(".fullscreen-add-properties");
        }
        else {
            fullscreenContainer = document.querySelector(".image-list-fullscreen");
        }
        if (fullscreenContainer) {
            fullscreenContainer.classList.remove("image-list-preset");
            fullscreenContainer.classList.remove("hide-image-list");
            fullscreenContainer.classList.add("show-image-list");
        }
        const externalLayoutsContainer = document.getElementById("external-layouts-container");
        if (externalLayoutsContainer) {
            externalLayoutsContainer.classList.remove("hide-external-layouts-container");
            if (uih_currentTabId !== "#LAYOUTS" || type === "image-list") {
                externalLayoutsContainer.style.display = "none";
            }
            else {
                externalLayoutsContainer.classList.add("show-external-layouts-container");
                externalLayoutsContainer.classList.add("open-external-layouts-container");
            }
        }
    }
    function closeMobileExternalLayoutsContainer() {
        const externalLayoutsContainer = document.getElementById("external-layouts-container");
        if (externalLayoutsContainer) {
            externalLayoutsContainer.classList.remove("show-external-layouts-container");
            externalLayoutsContainer.classList.remove("open-external-layouts-container");
            externalLayoutsContainer.classList.add("hide-external-layouts-container");
        }
    }
    function closeMobileFullscreenContainer() {
        closeMobileExternalLayoutsContainer();
        const fullscreenContainer = document.querySelector(".fullscreen-add-properties.show-image-list") || document.querySelector(".image-list-fullscreen.show-image-list");
        if (fullscreenContainer) {
            fullscreenContainer.classList.remove("show-image-list");
            fullscreenContainer.classList.add("hide-image-list");
        }
    }
    function removeMobileFullscreenContainer() {
        closeMobileExternalLayoutsContainer();
        const fullscreenContainer = document.querySelector(".fullscreen-add-properties");
        const fullscreenDialog = document.querySelector(".fullscreen-mobile-dialog");
        const imageListContainer = document.querySelector(".image-list-fullscreen");
        if (fullscreenContainer)
            fullscreenContainer.remove();
        if (fullscreenDialog)
            fullscreenDialog.remove();
        if (imageListContainer)
            imageListContainer.remove();
    }
    function renderImageControlButtons(printess, images, p) {
        var _a;
        const forHandwriting = (p === null || p === void 0 ? void 0 : p.kind) === "selection-text-style";
        const canUpload = !p || ((_a = p.imageMeta) === null || _a === void 0 ? void 0 : _a.canUpload);
        const container = document.createElement("div");
        container.id = "image-control-buttons";
        container.style.display = "grid";
        container.style.gridTemplateColumns = (images.length > 0 && !forHandwriting && canUpload) ? "1fr 1fr" : "1fr";
        container.style.gridGap = "5px";
        const tabContent = renderMyImagesTab(printess, true, p, undefined);
        const fullscreenContainer = renderMobileImageListFullscreen(printess, "images-list", "ui.exchangeImage", tabContent, p);
        document.body.appendChild(fullscreenContainer);
        const change = document.createElement("button");
        change.className = "btn btn-outline-primary exchange-image-btn";
        change.textContent = printess.gl("ui.exchangeImage");
        change.onclick = () => {
            openMobileFullscreenContainer("image-list");
        };
        const changeIcon = printess.getIcon("image");
        changeIcon.style.height = "50px";
        change.appendChild(changeIcon);
        const handwritingCaption = forHandwriting ? printess.gl("ui.uploadHandwriting") : "";
        if (canUpload) {
            container.appendChild(getImageUploadButton(printess, p, (p === null || p === void 0 ? void 0 : p.id) || "images", true, false, handwritingCaption, true));
        }
        if (images.length > 0 && !forHandwriting) {
            container.appendChild(change);
        }
        if (forHandwriting) {
            const infoBox = getHandwritingInfoBox(printess, true);
            container.appendChild(infoBox);
        }
        return container;
    }
    function getMobileImagesUploadContent(printess, step) {
        return __awaiter(this, void 0, void 0, function* () {
            const content = document.createElement("div");
            content.id = "mobileUploadContent";
            content.className = "d-flex flex-column align-items-center";
            const stepIndicator = document.createElement("div");
            stepIndicator.className = "step-indicator";
            const ul = document.createElement("ul");
            ul.className = "progress-steps";
            const steps = ["barcode", "upload", "completed"];
            for (let i = 0; i < steps.length; i++) {
                const li = document.createElement("li");
                if (steps.indexOf(step) === i) {
                    li.className = "active";
                }
                else if (steps.indexOf(step) > i) {
                    li.className = "complete";
                }
                if (steps[i] === "barcode") {
                    li.style.setProperty("--display-li-after", "none");
                }
                ul.appendChild(li);
            }
            stepIndicator.appendChild(ul);
            content.appendChild(stepIndicator);
            if (step === "barcode") {
                const qrCode = document.createElement("div");
                qrCode.id = "externalImageQrCodeContainer";
                qrCode.style.width = "230px";
                qrCode.style.margin = "0 200px";
                if (!uih_externalUploadInfo) {
                    uih_externalUploadInfo = yield printess.createExternalImageUploadChannel();
                }
                qrCode.append(uih_externalUploadInfo.qr);
                const txt = document.createElement("p");
                txt.textContent = "Scan the QR Code to upload images from phone";
                txt.style.margin = "1rem 0 0";
                content.appendChild(qrCode);
                content.appendChild(txt);
                if (!uih_imagePollingStarted) {
                    printess.startExternalImagePolling(uih_externalUploadInfo.channelId);
                    uih_imagePollingStarted = true;
                }
            }
            else if (step === "upload") {
                const icon = printess.getIcon("desktop-mobile-duotone");
                icon.classList.add("mobile-upload-success-icon");
                icon.classList.add("text-secondary");
                const txt = document.createElement("p");
                txt.textContent = printess.gl("ui.mobileImageUploadReady");
                txt.style.margin = "2rem 0px 0px";
                content.appendChild(icon);
                content.appendChild(txt);
            }
            else if (step === "completed") {
                const icon = printess.getIcon("cloud-upload-check");
                icon.classList.add("mobile-upload-success-icon");
                const txt = document.createElement("p");
                txt.textContent = printess.gl("ui.mobileImagesSuccessAlert");
                txt.style.margin = "2rem 0px 0px";
                content.appendChild(icon);
                content.appendChild(txt);
            }
            return content;
        });
    }
    function getMobileImagesUploadOverlay(printess) {
        return __awaiter(this, void 0, void 0, function* () {
            const content = yield getMobileImagesUploadContent(printess, "barcode");
            const id = "MOBILEUPLOADMODAL";
            const modal = document.getElementById(id);
            if (modal)
                return;
            const footer = document.createElement("div");
            footer.className = "modal-footer";
            const close = document.createElement("button");
            close.className = "btn btn-primary";
            close.textContent = printess.gl("ui.buttonClose");
            close.onclick = () => {
                hideModal(id);
                const imageTabContainer = document.getElementById("image-tab-container");
                if (imageTabContainer) {
                    const p = uih_currentProperties.filter(p => p.kind === "image")[0] || undefined;
                    imageTabContainer.replaceWith(renderMyImagesTab(printess, false, p, undefined));
                }
            };
            footer.appendChild(close);
            showModal(printess, id, content, printess.gl("ui.mobileImageUpload"), footer);
        });
    }
    function renderMobileUploadSuccessOverlay(printess) {
        const toast = document.createElement("div");
        toast.className = "toast show align-items-center text-light bg-primary border-0 mobile-upload-success-alert";
        toast.setAttribute("role", "alert");
        const content = document.createElement("div");
        content.className = "d-flex align-items-center";
        const icon = printess.getIcon("cloud-check-duotone");
        icon.style.width = "50px";
        icon.style.height = "50px";
        const text = document.createElement("div");
        text.className = "toast-body";
        text.style.fontSize = "1.25rem";
        text.innerText = printess.gl("ui.mobileImagesSuccessAlert");
        content.appendChild(icon);
        content.appendChild(text);
        toast.appendChild(content);
        document.body.appendChild(toast);
        window.setTimeout(() => {
            toast.remove();
            const imageTabContainer = document.getElementById("image-tab-container");
            if (imageTabContainer) {
                const p = uih_currentProperties.filter(p => p.kind === "image")[0] || undefined;
                imageTabContainer.replaceWith(renderMyImagesTab(printess, false, p, undefined));
            }
        }, 2000);
    }
    function getDistributionOverlay(printess, forMobile, p, container) {
        const content = document.createElement("div");
        content.className = "d-flex flex-column align-items-center";
        const id = "DISTRIBUTEMODAL";
        const txt = document.createElement("p");
        txt.textContent = printess.gl("ui.distributionText");
        const icon = printess.getIcon("distribute-image");
        icon.style.width = "200px";
        content.appendChild(txt);
        content.appendChild(icon);
        const footer = document.createElement("div");
        footer.className = "modal-footer";
        const close = document.createElement("button");
        close.className = "btn btn-secondary";
        close.textContent = printess.gl("ui.buttonNo");
        close.onclick = () => {
            hideModal(id);
        };
        const ok = document.createElement("button");
        ok.className = "btn btn-primary";
        ok.textContent = printess.gl("ui.buttonYes");
        ok.onclick = () => __awaiter(this, void 0, void 0, function* () {
            hideModal(id);
            yield printess.distributeImages();
            renderMyImagesTab(printess, forMobile, p, printess.getImages(p === null || p === void 0 ? void 0 : p.id), container);
        });
        footer.appendChild(close);
        footer.appendChild(ok);
        showModal(printess, id, content, printess.gl("ui.distributionDialogTitle"), footer);
    }
    function renderAccordionItem(printess, title, body, hideCollapseIcon) {
        const forPhotoTab = uih_currentTabId === "#PHOTOS" && printess.showTabNavigation();
        const accordionItem = document.createElement("div");
        accordionItem.className = "accordion-item";
        accordionItem.style.border = "none";
        accordionItem.style.background = "transparent";
        const headerId = title.split(" ").join("") + "_PanelHeader";
        const bodyId = title.split(" ").join("") + "_PanelBody";
        const header = document.createElement("h2");
        header.className = "accordion-header";
        header.id = headerId;
        header.style.borderBottom = "1px solid rgba(0,0,0,.125)";
        if (!forPhotoTab)
            accordionItem.appendChild(header);
        const accordionBtn = document.createElement("button");
        accordionBtn.className = "accordion-button";
        accordionBtn.style.backgroundColor = "white";
        accordionBtn.setAttribute("data-bs-toggle", "collapse");
        accordionBtn.setAttribute("data-bs-target", "#" + bodyId);
        accordionBtn.style.boxShadow = "none";
        accordionBtn.style.background = "transparent";
        accordionBtn.textContent = printess.gl(title);
        accordionBtn.onclick = () => {
            const collapseButtons = document.querySelectorAll("button.accordion-collapse-btn.disabled");
            collapseButtons === null || collapseButtons === void 0 ? void 0 : collapseButtons.forEach(b => b.classList.remove("disabled"));
        };
        header.appendChild(accordionBtn);
        if (hideCollapseIcon)
            accordionBtn.classList.add("no-after");
        const bodyContainer = document.createElement("div");
        bodyContainer.className = "accordion-collapse collapse show";
        bodyContainer.id = bodyId;
        accordionItem.appendChild(bodyContainer);
        const accordionBody = document.createElement("div");
        accordionBody.className = "accordion-body";
        accordionBody.style.padding = "0.75rem 0.5rem";
        accordionBody.appendChild(body);
        bodyContainer.appendChild(accordionBody);
        return accordionItem;
    }
    function renderCollapseButtons(printess) {
        const buttonWrapper = document.createElement("div");
        buttonWrapper.className = "d-flex flex-row";
        const collapseAllButton = document.createElement("button");
        collapseAllButton.className = "btn btn-outline-primary accordion-collapse-btn me-1 mb-3 w-100";
        collapseAllButton.textContent = printess.gl("ui.collapseAll");
        collapseAllButton.onclick = () => {
            const accordionButtons = document.querySelectorAll("button.accordion-button");
            accordionButtons === null || accordionButtons === void 0 ? void 0 : accordionButtons.forEach(b => {
                b.classList.add("collapsed");
            });
            const accordionBodys = document.querySelectorAll("div.accordion-collapse.collapse.show");
            accordionBodys === null || accordionBodys === void 0 ? void 0 : accordionBodys.forEach(b => b.classList.remove("show"));
            collapseAllButton.classList.add("disabled");
            expandAllButton.classList.remove("disabled");
        };
        const expandAllButton = document.createElement("button");
        expandAllButton.className = "btn btn-outline-primary accordion-collapse-btn mb-3 w-100 disabled";
        expandAllButton.textContent = printess.gl("ui.expandAll");
        expandAllButton.onclick = () => {
            const accordionButtons = document.querySelectorAll("button.accordion-button");
            accordionButtons === null || accordionButtons === void 0 ? void 0 : accordionButtons.forEach(b => {
                b.classList.remove("collapsed");
            });
            const accordionBodys = document.querySelectorAll("div.accordion-collapse.collapse");
            accordionBodys === null || accordionBodys === void 0 ? void 0 : accordionBodys.forEach(b => b.classList.add("show"));
            expandAllButton.classList.add("disabled");
            collapseAllButton.classList.remove("disabled");
        };
        buttonWrapper.appendChild(collapseAllButton);
        buttonWrapper.appendChild(expandAllButton);
        return buttonWrapper;
    }
    function addMobileOverlayPaddings() {
        const container1 = document.querySelector(".mobile-fullscreen-content");
        if (container1) {
            container1.style.padding = "10px";
        }
        const container2 = document.querySelector(".mobile-group-snippets-container");
        if (container2) {
            container2.style.padding = "10px";
        }
    }
    function removeMobileOverlayPaddings() {
        const container1 = document.querySelector(".mobile-fullscreen-content");
        if (container1) {
            container1.style.padding = "0px";
        }
        const container2 = document.querySelector(".mobile-group-snippets-container");
        if (container2) {
            container2.style.padding = "0px";
        }
    }
    function renderGroupSnippets(printess, groupSnippets, forMobile) {
        var _a;
        const forPhotoTab = uih_currentTabId === "#PHOTOS" && printess.showTabNavigation();
        const div = document.createElement("div");
        div.className = "accordion";
        div.id = "group-snippets";
        let menuId = "";
        if (groupSnippets.length === 1 && groupSnippets[0].stickerMenuId) {
            menuId = groupSnippets[0].stickerMenuId;
            uih_currentStickerMenuTags = groupSnippets[0].stickerMenuTags;
        }
        else {
            uih_currentStickerMenuTags = [];
        }
        if (groupSnippets.length > 0) {
            for (const cluster of groupSnippets) {
                const clusterDiv = document.createElement("div");
                const col = (_a = cluster.columns) !== null && _a !== void 0 ? _a : 3;
                clusterDiv.style.display = "grid";
                clusterDiv.style.gridTemplateColumns = `repeat(${col}, 1fr)`;
                clusterDiv.style.gap = "6px";
                const desktop_container = document.getElementById("desktop-properties");
                if (menuId) {
                    const filter = document.createElement("div");
                    filter.classList.add("keyword-menu-wrapper");
                    renderSnippetKeywordMenu(printess, menuId, filter, clusterDiv, false, forMobile);
                    div.appendChild(filter);
                    if (desktop_container)
                        desktop_container.classList.add("keyword-menu");
                    clusterDiv.style.padding = "10px";
                    if (forMobile) {
                        window.setTimeout(removeMobileOverlayPaddings, 0);
                    }
                    div.appendChild(clusterDiv);
                    return div;
                }
                else {
                    if (desktop_container)
                        desktop_container.classList.remove("keyword-menu");
                }
                renderGroupSnippetCluster(printess, clusterDiv, cluster.snippets, forMobile);
                if (!menuId) {
                    div.appendChild(renderAccordionItem(printess, cluster.name, clusterDiv, groupSnippets.length < 2));
                }
            }
        }
        if (forMobile && !printess.showMobileTabNavigation()) {
            const mobile = document.createElement("div");
            mobile.className = "mobile-group-snippets-container";
            div.style.marginTop = forPhotoTab ? "0px" : "-20px";
            mobile.appendChild(div);
            return mobile;
        }
        else {
            if (groupSnippets.length > 3) {
                const desktop = document.createElement("div");
                desktop.appendChild(renderCollapseButtons(printess));
                desktop.appendChild(div);
                return desktop;
            }
            else {
                return div;
            }
        }
    }
    function renderGroupSnippetCluster(printess, clusterDiv, resultSet, forMobile) {
        for (const snippet of resultSet) {
            const thumbDiv = getStickerThumb(printess, snippet, forMobile);
            clusterDiv.appendChild(thumbDiv);
        }
    }
    function getStickerThumb(printess, snippet, forMobile) {
        const thumbDiv = document.createElement("div");
        thumbDiv.className = "snippet-thumb";
        const thumb = document.createElement("img");
        thumb.setAttribute("loading", "lazy");
        thumb.src = snippet.thumbUrl;
        thumb.style.backgroundColor = snippet.bgColor;
        thumbDiv.appendChild(thumb);
        thumbDiv.draggable = true;
        thumbDiv.ondragstart = (ev) => {
            var _a;
            (_a = ev.dataTransfer) === null || _a === void 0 ? void 0 : _a.setData('text/plain', `${"SNIP:" + snippet.snippetUrl}`);
        };
        const priceBox = document.createElement("span");
        priceBox.className = "badge bg-primary";
        priceBox.textContent = printess.gl(snippet.priceLabel);
        if (snippet.priceLabel)
            thumbDiv.appendChild(priceBox);
        thumbDiv.onclick = () => {
            if (forMobile) {
                closeMobileFullscreenContainer();
            }
            printess.insertGroupSnippet(snippet.snippetUrl);
        };
        return thumbDiv;
    }
    function getExternalSnippetDiv(printess, layoutSnippets, forMobile, forLayoutDialog = false) {
        const modalHtml = window.uiHelper.customLayoutSnippetRenderCallback(printess, layoutSnippets, forMobile, forLayoutDialog, (templateName, templateVersion, documentName, mode = "layout") => {
            printess.insertTemplateAsLayoutSnippet(templateName, templateVersion, documentName, mode);
            closeLayoutOverlays(printess, forMobile);
        }, () => {
            closeLayoutOverlays(printess, forMobile);
        });
        modalHtml.id = "external-layouts-content";
        return modalHtml;
    }
    function renderLayoutSelectionDialog(printess, layoutSnippets, forMobile) {
        const modalId = "layoutSnippetsSelection";
        const templateTitle = printess.getTemplateTitle();
        const title = templateTitle ? printess.gl("ui.selectLayoutTitle", templateTitle) : printess.gl("ui.selectLayoutWithoutTitle");
        const layoutContainer = document.createElement("div");
        layoutContainer.style.height = "calc(100% - 3.5rem)";
        const infoText = document.createElement("p");
        infoText.innerHTML = printess.gl("ui.selectLayoutInfo", printess.getTemplateTitle());
        layoutContainer.appendChild(infoText);
        layoutContainer.appendChild(renderLayoutSnippets(printess, layoutSnippets, forMobile, true));
        showModal(printess, modalId, layoutContainer, title);
        if (forMobile) {
        }
    }
    function closeLayoutOverlays(printess, _forMobile) {
        const myOffcanvas = document.getElementById("closeLayoutOffCanvas");
        if (myOffcanvas)
            myOffcanvas.click();
        const offCanvas = document.getElementById("layoutOffcanvas");
        if (offCanvas)
            offCanvas.style.visibility = "hidden";
        const layoutsDialog = document.getElementById("layoutSnippetsSelection");
        if (layoutsDialog)
            layoutsDialog.remove();
        if (printess.showTabNavigation()) {
            closeMobileFullscreenContainer();
        }
    }
    function renderLayoutSnippets(printess, layoutSnippets, forMobile, forLayoutDialog = false) {
        if (window.uiHelper.customLayoutSnippetRenderCallback && layoutSnippets) {
            const externalSnippetContainer = getExternalSnippetDiv(printess, layoutSnippets, forMobile !== null && forMobile !== void 0 ? forMobile : uih_currentRender === "mobile", forLayoutDialog);
            if (externalSnippetContainer && externalSnippetContainer.nodeType) {
                return externalSnippetContainer;
            }
        }
        const container = document.createElement("div");
        container.className = "layout-snippet-list";
        if (layoutSnippets) {
            const hasKeywordMenu = printess.hasSnippetMenu("layout");
            for (const cluster of layoutSnippets) {
                if (!forLayoutDialog && !hasKeywordMenu) {
                    const headline = document.createElement("h5");
                    headline.textContent = printess.gl(cluster.name).split("\\n").join("<br>");
                    headline.className = "snippet-cluster-name";
                    if (cluster === layoutSnippets[0]) {
                        headline.style.marginTop = "0";
                    }
                    container.appendChild(headline);
                }
                const clusterDiv = document.createElement("div");
                clusterDiv.className = "layout-snippet-cluster";
                const col = printess.numberOfColumns();
                if (!forLayoutDialog) {
                    clusterDiv.style.display = "grid";
                    clusterDiv.style.gridTemplateColumns = `repeat(${col}, 1fr)`;
                    clusterDiv.style.gap = "6px";
                }
                else {
                    if (col === 1) {
                        clusterDiv.classList.add("big-thumbs");
                    }
                }
                if (hasKeywordMenu) {
                    const filter = document.createElement("div");
                    filter.classList.add("keyword-menu-wrapper");
                    renderSnippetKeywordMenu(printess, "layout", filter, clusterDiv, forLayoutDialog, !!forMobile);
                    container.appendChild(filter);
                    container.appendChild(clusterDiv);
                    return container;
                }
                else {
                    renderLayoutSnippetCluster(printess, clusterDiv, cluster.snippets, forLayoutDialog, !!forMobile);
                }
                if (forLayoutDialog) {
                    container.classList.add("accordion");
                    container.appendChild(renderAccordionItem(printess, cluster.name, clusterDiv, layoutSnippets.length < 2));
                }
                else {
                    container.appendChild(clusterDiv);
                }
                if (hasKeywordMenu) {
                    break;
                }
            }
        }
        return container;
    }
    function getSnippetThumb(printess, snippet, forLayoutDialog, forMobile) {
        const thumbDiv = document.createElement("div");
        thumbDiv.className = forLayoutDialog ? "snippet-thumb layout-dialog" : "snippet-thumb big";
        thumbDiv.setAttribute("aria-label", "Close");
        thumbDiv.setAttribute("data-bs-dismiss", "offcanvas");
        thumbDiv.setAttribute("data-bs-target", "#layoutOffcanvas");
        const thumb = document.createElement("img");
        thumb.setAttribute("loading", "lazy");
        thumb.src = snippet.thumbUrl;
        thumb.style.backgroundColor = snippet.bgColor;
        thumbDiv.appendChild(thumb);
        const priceBox = document.createElement("span");
        priceBox.className = "badge bg-primary";
        priceBox.textContent = printess.gl(snippet.priceLabel);
        if (snippet.priceLabel)
            thumbDiv.appendChild(priceBox);
        thumbDiv.onclick = () => {
            printess.insertLayoutSnippet(snippet.snippetUrl);
            closeLayoutOverlays(printess, forMobile !== null && forMobile !== void 0 ? forMobile : uih_currentRender === "mobile");
        };
        return thumbDiv;
    }
    function renderLayoutSnippetCluster(printess, clusterDiv, resultSet, forLayoutDialog, forMobile) {
        const hasKeywordMenu = printess.hasSnippetMenu("layout");
        const numberOfColumns = printess.numberOfColumns();
        let snippets = resultSet;
        if (hasKeywordMenu) {
            if (printess.hasLayoutSnippetImageCountFilter()) {
                renderImageAmountButtons(printess, clusterDiv, resultSet, forLayoutDialog);
                const atatResults = resultSet.filter(s => s.title.startsWith("@@"));
                const imCount = uih_currentLayoutSnippetImageAmount ? parseInt(uih_currentLayoutSnippetImageAmount) : -1;
                snippets = snippets.filter(s => {
                    if (s.title.startsWith("@@")) {
                        return false;
                    }
                    if (imCount === -1) {
                        return s.sortNumber > 0;
                    }
                    return imCount === s.imageCount;
                });
                if (atatResults.length === 2 && !forLayoutDialog) {
                    let designYourself = atatResults[0];
                    let singlePhoto = atatResults[1];
                    const clusterDiv2 = document.createElement("div");
                    clusterDiv2.className = "layout-snippet-cluster";
                    clusterDiv2.style.display = "grid";
                    clusterDiv2.style.gridTemplateColumns = "1fr 1fr";
                    clusterDiv2.style.gridColumn = "1 / span " + numberOfColumns;
                    clusterDiv2.style.gap = "6px";
                    clusterDiv2.appendChild(getSnippetThumb(printess, singlePhoto, forLayoutDialog, forMobile));
                    clusterDiv2.appendChild(getSnippetThumb(printess, designYourself, forLayoutDialog, forMobile));
                    clusterDiv.appendChild(clusterDiv2);
                }
            }
        }
        for (const snippet of snippets) {
            clusterDiv.appendChild(getSnippetThumb(printess, snippet, forLayoutDialog, forMobile));
        }
    }
    function renderCategoryButtons(printess, which, categoryWrapper, topicWrapper, clusterDiv, forLayoutDialog) {
        const entry = getCurrentMenuEntry(which);
        if (!entry)
            return;
        for (const c of entry.categories) {
            const categoryBtn = document.createElement("li");
            categoryBtn.textContent = translateKeyWord(printess, c.name);
            if (c === entry.category) {
                categoryBtn.classList.add("selected");
            }
            renderTopicButtons(printess, which, topicWrapper, clusterDiv, forLayoutDialog);
            if (entry.categories.length > 1) {
                categoryBtn.onclick = () => {
                    var _a;
                    setCurrentSnippetCategory(which, c.name);
                    setCurrentSnippetTopic(which, c.topics[0]);
                    setCurrentSnippetKeywords(which, c.topics[0].keywords);
                    renderTopicButtons(printess, which, topicWrapper, clusterDiv, forLayoutDialog);
                    const buttons = (_a = categoryBtn.parentElement) === null || _a === void 0 ? void 0 : _a.children;
                    if (buttons) {
                        for (const b of buttons) {
                            if (b !== categoryBtn) {
                                b.classList.remove("selected");
                            }
                            else {
                                b.classList.add("selected");
                            }
                        }
                    }
                    setMenuState(printess, which, c.topics[0], clusterDiv, forLayoutDialog);
                };
                categoryWrapper.appendChild(categoryBtn);
                categoryWrapper.style.display = "flex";
            }
            else {
                categoryWrapper.style.display = "none";
            }
        }
    }
    function renderTopicButtons(printess, which, topicWrapper, clusterDiv, forLayoutDialog) {
        const entry = getCurrentMenuEntry(which);
        if (!entry)
            return;
        if (topicWrapper) {
            topicWrapper.innerHTML = "";
            for (const t of entry.category.topics) {
                const topicBtn = document.createElement("button");
                topicBtn.className = "btn btn-sm btn-outline-secondary topic-menu-btn mb-1 me-1";
                topicBtn.textContent = translateKeyWord(printess, t.name);
                if (entry.topic === t) {
                    topicBtn.classList.add("btn-primary");
                    topicBtn.classList.remove("btn-outline-secondary");
                }
                topicBtn.onclick = () => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    const buttons = (_a = topicBtn.parentElement) === null || _a === void 0 ? void 0 : _a.children;
                    if (buttons) {
                        for (const b of buttons) {
                            if (b !== topicBtn) {
                                b.classList.remove("btn-primary");
                                b.classList.add("btn-outline-secondary");
                            }
                            else {
                                b.classList.add("btn-primary");
                                b.classList.remove("btn-outline-secondary");
                            }
                        }
                    }
                    setMenuState(printess, which, t, clusterDiv, forLayoutDialog);
                });
                topicWrapper.appendChild(topicBtn);
            }
        }
    }
    function translateKeyWord(printess, k) {
        const t = printess.gl("menu." + k);
        if (t === "menu." + k) {
            return k;
        }
        return t;
    }
    function setMenuState(printess, which, topic, clusterDiv, forLayoutDialog) {
        return __awaiter(this, void 0, void 0, function* () {
            setCurrentSnippetTopic(which, topic);
            setCurrentSnippetKeywords(which, topic.keywords);
            let resultSet = [];
            if (which === "layout") {
                resultSet = yield printess.loadLayoutSnippetsByKeywords(getCurrentSnippetKeywords(which), topic.id);
            }
            else {
                resultSet = yield printess.loadStickerSnippetsByKeywords(uih_currentStickerMenuTags, getCurrentSnippetKeywords(which));
            }
            setLastSnippetKeywordsResults(which, resultSet);
            setLastSnippetKeywords(which, getCurrentSnippetKeywords(which));
            clusterDiv.innerHTML = "";
            if (which === "layout") {
                renderLayoutSnippetCluster(printess, clusterDiv, resultSet, forLayoutDialog, uih_currentRender === "mobile");
            }
            else {
                renderGroupSnippetCluster(printess, clusterDiv, resultSet, uih_currentRender === "mobile");
            }
        });
    }
    function renderImageAmountButtons(printess, clusterDiv, snippets, forLayoutDialog) {
        const div = document.querySelector(".menu-image-amount-wrapper");
        if (!div) {
            window.setTimeout(() => {
                renderImageAmountButtons(printess, clusterDiv, snippets, forLayoutDialog);
            }, 300);
            return;
        }
        div.innerHTML = "";
        const btnGroup = document.createElement("div");
        btnGroup.className = "btn-group btn-group-sm me-2";
        const label1 = document.createElement("div");
        label1.className = "label";
        label1.innerText = printess.gl("ui.photoAmount");
        const buttons = new Set();
        for (const s of snippets) {
            if (!s.title.startsWith("@@")) {
                buttons.add(s.imageCount);
            }
        }
        if (uih_currentLayoutSnippetImageAmount !== "") {
            if (!buttons.has(parseInt(uih_currentLayoutSnippetImageAmount))) {
                uih_currentLayoutSnippetImageAmount = "";
            }
        }
        let hasFavs = false;
        for (const s of snippets) {
            if (s.sortNumber > 0) {
                hasFavs = true;
                break;
            }
        }
        const sorted = Array.from(buttons).sort((a, b) => a - b).map(n => n + "");
        if (hasFavs) {
            sorted.unshift("");
        }
        if (!sorted.includes(uih_currentLayoutSnippetImageAmount)) {
            if (sorted.includes("")) {
                uih_currentLayoutSnippetImageAmount = "";
            }
            else {
                uih_currentLayoutSnippetImageAmount = sorted[sorted.length > 1 ? 1 : 0];
            }
        }
        if (sorted.length <= 1) {
            div.style.display = "none";
        }
        else {
            div.style.display = "block";
            div.appendChild(label1);
            for (const b of sorted) {
                const btn = document.createElement("button");
                btn.type = "button";
                btn.className = "btn image-amount";
                if (b === uih_currentLayoutSnippetImageAmount) {
                    btn.classList.add("btn-secondary");
                }
                else {
                    btn.classList.add("btn-outline-secondary");
                }
                btn.innerText = b === "" ? printess.gl("ui.recommended") : b;
                btn.dataset.amount = b;
                btn.onclick = () => {
                    var _a;
                    btnGroup.childNodes.forEach(c => {
                        c.classList.remove("btn-secondary");
                        c.classList.add("btn-outline-secondary");
                    });
                    btn.classList.add("btn-secondary");
                    uih_currentLayoutSnippetImageAmount = (_a = btn.dataset.amount) !== null && _a !== void 0 ? _a : "";
                    clusterDiv.innerHTML = "";
                    renderLayoutSnippetCluster(printess, clusterDiv, snippets, forLayoutDialog, uih_currentRender === "mobile");
                };
                btnGroup.appendChild(btn);
            }
            div.appendChild(btnGroup);
        }
    }
    function renderSnippetKeywordMenu(printess, menuId, parent, clusterDiv, forLayoutDialog, forMobile) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const categoryWrapper = document.createElement("div");
            categoryWrapper.className = "category-tabs";
            parent.appendChild(categoryWrapper);
            const topicWrapper = document.createElement("div");
            topicWrapper.className = "menu-topic-wrapper";
            parent.appendChild(topicWrapper);
            if (menuId === "layout") {
                const imageAmountWrapper = document.createElement("div");
                imageAmountWrapper.className = "menu-image-amount-wrapper";
                parent.appendChild(imageAmountWrapper);
            }
            else {
                topicWrapper.classList.add("topic-border-bottom");
            }
            const which = menuId === "layout" ? "layout" : "sticker";
            let menu = getCurrentMenuCategories(which);
            if (!menu) {
                menu = yield printess.getSnippetFilterMenu(menuId);
                setCurrentMenuCategories(which, menu !== null && menu !== void 0 ? menu : null);
            }
            if (menu) {
                if (getCurrentSnippetKeywords(which).length === 0) {
                    if (menu && menu.length > 0 && menu[0].topics.length > 0) {
                        setCurrentSnippetKeywords(which, menu[0].topics[0].keywords);
                        setCurrentSnippetTopic(which, menu[0].topics[0]);
                    }
                }
                const currentSpreadAspect = printess.getDocumentAspectRatioName();
                if (menuId === "layout") {
                    if (getCurrentSnippetKeywords("layout").join("|") === getLastSnippetKeywords("layout").join("|") && currentSpreadAspect === uih_lastSpreadAspect) {
                        renderCategoryButtons(printess, which, categoryWrapper, topicWrapper, clusterDiv, forLayoutDialog);
                        renderLayoutSnippetCluster(printess, clusterDiv, getLastSnippetKeywordsResults("layout"), forLayoutDialog, !!forMobile);
                    }
                    else {
                        const snippets = yield printess.loadLayoutSnippetsByKeywords(getCurrentSnippetKeywords("layout"), (_a = getCurrentSnippetTopic(which)) === null || _a === void 0 ? void 0 : _a.id);
                        setLastSnippetKeywordsResults("layout", snippets);
                        setLastSnippetKeywords("layout", getCurrentSnippetKeywords("layout"));
                        uih_lastSpreadAspect = currentSpreadAspect;
                        renderCategoryButtons(printess, which, categoryWrapper, topicWrapper, clusterDiv, forLayoutDialog);
                        renderLayoutSnippetCluster(printess, clusterDiv, snippets, forLayoutDialog, !!forMobile);
                    }
                }
                else {
                    const resultSet = yield printess.loadStickerSnippetsByKeywords(uih_currentStickerMenuTags, getCurrentSnippetKeywords(which));
                    setLastSnippetKeywordsResults(which, resultSet);
                    setLastSnippetKeywords("sticker", getCurrentSnippetKeywords(which));
                    renderCategoryButtons(printess, which, categoryWrapper, topicWrapper, clusterDiv, forLayoutDialog);
                    renderGroupSnippetCluster(printess, clusterDiv, resultSet, forMobile);
                }
            }
        });
    }
    let tableEditRow = {};
    let tableEditRowIndex = -1;
    let tableDragRowIndex = -1;
    let lastClickedTableRow = -1;
    let lastTablePropId = "";
    let addButtonForTableDataClicked = false;
    function getTableControl(printess, p, forMobile, data = []) {
        var _a, _b, _c;
        const container = document.createElement("div");
        container.id = "table-control-" + p.id;
        container.setAttribute("data-visibility-id", p.id.replace("#", "_hash_"));
        container.className = "mb-3 printess-" + p.kind;
        container.style.display = printess.isPropertyVisible(p.id) ? "block" : "none";
        let hasRow = false;
        if (p.tableMeta) {
            if (data.length === 0) {
                try {
                    data = JSON.parse(p.value.toString() || "[]");
                }
                catch (error) {
                    data = [];
                }
            }
            if (data.length > 0) {
                const table = document.createElement("table");
                table.className = "table mb-3";
                const thead = document.createElement("thead");
                let tr = document.createElement("tr");
                let colCount = 0;
                const thDrag = document.createElement("th");
                thDrag.scope = "col";
                tr.appendChild(thDrag);
                for (const col of p.tableMeta.columns) {
                    if (!col.hide && col.name !== "type" && (p.tableMeta.tableType !== "calendar-events" || (col.name !== "month" && col.name !== "event"))) {
                        colCount++;
                        const th = document.createElement("th");
                        th.scope = "col";
                        th.style.cursor = printess.isDataSource(p.id) ? "pointer" : "default";
                        th.innerText = col.label && printess.gl(col.label) || printess.gl(col.name);
                        th.onclick = () => {
                            if (!printess.isDataSource(p.id))
                                return;
                            data = data.sort((a, b) => {
                                if (col.data === "number") {
                                    return a[col.name] - b[col.name];
                                }
                                else {
                                    return a[col.name].localeCompare(b[col.name]);
                                }
                            });
                            const dataString = JSON.stringify(data);
                            p.value = dataString;
                            printess.setProperty(p.id, dataString);
                        };
                        tr.appendChild(th);
                    }
                }
                if (colCount > 3) {
                    container.classList.add("small");
                }
                if (colCount === 4) {
                    container.classList.add("col4");
                }
                const th = document.createElement("th");
                th.scope = "col";
                tr.appendChild(th);
                thead.appendChild(tr);
                table.appendChild(thead);
                const tbody = document.createElement("tbody");
                let rowNumber = 0;
                const selectedRowNumber = printess.getTableRowIndex(p.id);
                const bgs = new Map();
                for (const ao of p.tableMeta.tableAddOptions) {
                    if (ao.type && ao.bg) {
                        bgs.set(ao.type, ao.bg);
                    }
                }
                for (const row of data) {
                    if (p.tableMeta.tableType !== "calendar-events" || row.month == p.tableMeta.month) {
                        tr = document.createElement("tr");
                        tr.style.cursor = "pointer";
                        tr.draggable = true;
                        if (selectedRowNumber == rowNumber && lastClickedTableRow === -1) {
                            tr.classList.add("table-active");
                        }
                        tr.dataset.rowNumber = rowNumber.toString();
                        const bg = bgs.get(row.type);
                        if (bg) {
                            tr.style.backgroundColor = bg;
                        }
                        const tdDrag = document.createElement("td");
                        const dragIcon = printess.getIcon("ellipsis-v");
                        tdDrag.classList.add("table-drag-icon");
                        tdDrag.appendChild(dragIcon);
                        tr.appendChild(tdDrag);
                        for (const col of p.tableMeta.columns) {
                            if (col.hide === true || col.name === "type") {
                                continue;
                            }
                            if (p.tableMeta.tableType !== "calendar-events" || (col.name !== "month" && col.name !== "event")) {
                                const td = document.createElement("td");
                                td.id = "cell" + rowNumber + "_" + col.name;
                                td.style.whiteSpace = "no-wrap";
                                let t = printess.gl((_b = (_a = row[col.name]) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "");
                                if (t.length > 20) {
                                    t = t.substring(0, 20) + "...";
                                    td.style.fontSize = "0.7rem";
                                }
                                if (col.inline === true && !((_c = col.list) === null || _c === void 0 ? void 0 : _c.length)) {
                                    const detailsWrapper = document.createElement("div");
                                    detailsWrapper.className = "d-flex flex-wrap";
                                    const tableTextBox = getTableTextBox(printess, p, rowNumber, row, col, true, true);
                                    renderTableDetailsColumn(detailsWrapper, tableTextBox, col, undefined);
                                    td.appendChild(detailsWrapper);
                                }
                                else {
                                    td.innerText = t;
                                }
                                tr.appendChild(td);
                            }
                        }
                        tr.ondragstart = (ele) => {
                            var _a;
                            (_a = ele.dataTransfer) === null || _a === void 0 ? void 0 : _a.setData('text/plain', p.id);
                            const rowIndex = parseInt(ele.currentTarget.dataset.rowNumber);
                            closeTableEditControl();
                            tableDragRowIndex = rowIndex;
                            if (rowIndex >= 0) {
                                for (const row of ele.currentTarget.parentElement.children) {
                                    row.classList.remove("table-active");
                                    ele.currentTarget.classList.add("table-active");
                                }
                            }
                        };
                        tr.ondragenter = (ev) => handleRowDragDropEvents(ev, "dragenter");
                        tr.ondragover = (ev) => handleRowDragDropEvents(ev, "dragover");
                        tr.ondragleave = (ev) => handleRowDragDropEvents(ev, "dragleave");
                        tr.ondrop = (ev) => {
                            var _a;
                            handleRowDragDropEvents(ev, "drop");
                            const target = ev.currentTarget;
                            if (!target)
                                return;
                            const tableDropRowIndex = parseInt((_a = target.dataset.rowNumber) !== null && _a !== void 0 ? _a : "-1");
                            if (!(tableDropRowIndex >= 0)) {
                                return;
                            }
                            if (tableDropRowIndex === tableDragRowIndex) {
                                return;
                            }
                            const ele = data[tableDragRowIndex];
                            if (!ele) {
                                return;
                            }
                            const above = ev.offsetY < target.offsetHeight / 2;
                            const newData = [];
                            for (let i = 0; i < data.length; i++) {
                                if (i !== tableDragRowIndex) {
                                    if (above && i === tableDropRowIndex) {
                                        newData.push(ele);
                                    }
                                    newData.push(data[i]);
                                    if (!above && i === tableDropRowIndex) {
                                        newData.push(ele);
                                    }
                                }
                            }
                            data = newData;
                            tableDragRowIndex = -1;
                            p.value = JSON.stringify(data);
                            printess.setProperty(p.id, p.value);
                        };
                        const td = document.createElement("td");
                        td.style.width = "30px";
                        const deleteIcon = printess.getIcon("trash");
                        deleteIcon.classList.add("table-delete-icon");
                        td.appendChild(deleteIcon);
                        tr.appendChild(td);
                        deleteIcon.onclick = (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const rowIndex = parseInt(e.currentTarget.closest("tr").dataset.rowNumber);
                            tableEditRow = data[rowIndex];
                            tableEditRowIndex = rowIndex;
                            if (tableEditRowIndex === -1)
                                return;
                            lastClickedTableRow = -1;
                            data.splice(tableEditRowIndex, 1);
                            p.value = JSON.stringify(data);
                            printess.setProperty(p.id, p.value);
                            if (data.length === 0)
                                tableEditRowIndex = -1;
                            const table = document.getElementById("table-control-" + p.id);
                            if (table && forMobile) {
                                table.replaceWith(getTableControl(printess, p, forMobile));
                            }
                        };
                        tr.onclick = (ele) => {
                            var _a, _b;
                            closeTableEditControl();
                            if (ele.target.tagName === "INPUT") {
                                const rowIndex = parseInt(ele.currentTarget.closest("tr").dataset.rowNumber);
                                tableEditRow = data[rowIndex];
                                tableEditRowIndex = rowIndex;
                                printess.setTableRowIndex(p.id, rowIndex);
                            }
                            else {
                                const rowIndex = parseInt(ele.currentTarget.dataset.rowNumber);
                                if (rowIndex >= 0) {
                                    for (const row of ele.currentTarget.parentElement.children) {
                                        row.classList.remove("table-active");
                                    }
                                    ele.currentTarget.classList.add("table-active");
                                }
                                if (!((_b = (_a = ele.target) === null || _a === void 0 ? void 0 : _a.classList) === null || _b === void 0 ? void 0 : _b.contains("table-drag-icon"))) {
                                    const tableEditControl = renderTableEditControl(printess, p, data, rowIndex, forMobile);
                                    ele.currentTarget.insertAdjacentElement("afterend", tableEditControl);
                                    ele.currentTarget.style.display = "none";
                                }
                                else {
                                    printess.setTableRowIndex(p.id, rowIndex);
                                }
                                lastClickedTableRow = rowIndex;
                                lastTablePropId = p.id;
                            }
                        };
                        tbody.appendChild(tr);
                        hasRow = true;
                        if (lastClickedTableRow === rowNumber && lastTablePropId === p.id) {
                            const rowIndex = parseInt(tr.dataset.rowNumber);
                            tr.classList.add("table-active");
                            tr.style.display = "none";
                            const tableEditControl = renderTableEditControl(printess, p, data, rowIndex, forMobile);
                            tbody.appendChild(tableEditControl);
                        }
                    }
                    rowNumber++;
                }
                table.appendChild(tbody);
                if (hasRow)
                    container.appendChild(table);
            }
            const canAddMoreEntries = data.length < p.tableMeta.maxTableEntries || p.tableMeta.maxTableEntries === 0;
            if (canAddMoreEntries) {
                if (p.tableMeta.tableAddOptions.length > 0) {
                    for (const ao of p.tableMeta.tableAddOptions) {
                        const addButton = document.createElement("button");
                        addButton.className = "btn btn-primary mb-3 me-2";
                        addButton.style.display = "inline-block";
                        const plusIcon = printess.getIcon("plus");
                        plusIcon.style.width = "16px";
                        plusIcon.style.height = "16px";
                        plusIcon.style.margin = "0 5px 3px -5px";
                        const text = document.createElement("span");
                        text.innerText = ao.label;
                        addButton.appendChild(plusIcon);
                        addButton.appendChild(text);
                        addButton.onclick = () => {
                            var _a;
                            if (ao.libFF && p.tableMeta) {
                                showModal(printess, "ADD-ROWS-MODAL", getAddTableRowsModal(printess, p, ao, forMobile), printess.gl("ui.buttonAdd"));
                            }
                            else {
                                const doneButton = document.getElementById("printess-close-table-details" + p.id);
                                if (doneButton)
                                    doneButton.style.display = "inline-block";
                                lastClickedTableRow = (_a = printess.addTableRow(p.id, ao.type)) !== null && _a !== void 0 ? _a : -1;
                                lastTablePropId = p.id;
                            }
                        };
                        container.appendChild(addButton);
                    }
                }
                else {
                    const addButton = document.createElement("button");
                    addButton.className = "btn btn-primary mb-3 me-2";
                    addButton.style.display = "inline-block";
                    addButton.innerText = p.tableMeta.tableType === "calendar-events" ? printess.gl("ui.newEvent") : printess.gl("ui.newEntry");
                    addButton.onclick = () => {
                        var _a;
                        const doneButton = document.getElementById("printess-close-table-details" + p.id);
                        if (doneButton)
                            doneButton.style.display = "inline-block";
                        lastClickedTableRow = (_a = printess.addTableRow(p.id, "")) !== null && _a !== void 0 ? _a : -1;
                        lastTablePropId = p.id;
                    };
                    container.appendChild(addButton);
                }
            }
            const doneButton = document.createElement("button");
            doneButton.className = "btn btn-primary mb-3 printess-close-table-details";
            doneButton.id = "printess-close-table-details" + p.id;
            doneButton.style.display = tableEditRowIndex > -1 ? "inline-block" : "none";
            doneButton.innerText = printess.gl("ui.buttonDone");
            doneButton.onclick = () => {
                closeTableEditControl();
                doneButton.style.display = "none";
            };
            container.appendChild(doneButton);
            if (!canAddMoreEntries) {
                const alert = document.createElement("div");
                alert.className = "alert alert-primary";
                alert.setAttribute("role", "alert");
                alert.textContent = printess.gl("ui.maxEntriesInfo");
                container.appendChild(alert);
            }
        }
        const details = document.createElement("div");
        details.id = "tableDetails_" + p.id;
        details.className = "container-fluid border";
        if (addButtonForTableDataClicked) {
            if (p.tableMeta) {
                tableEditRowIndex = -1;
                tableEditRow = {};
                for (const col of p.tableMeta.columns) {
                    tableEditRow[col.name] = col.list ? col.list[0] : col.data === "number" ? 0 : "";
                }
                if (p.tableMeta.tableType === "calendar-events") {
                    tableEditRow.month = p.tableMeta.month || 1;
                    tableEditRow.event = "Birthday";
                }
            }
            const editBox = renderTableDetails(printess, p, forMobile);
            details.appendChild(editBox);
            addButtonForTableDataClicked = false;
        }
        container.appendChild(details);
        if (p.info) {
            const inf = document.createElement("p");
            inf.innerText = printess.gl(p.info);
            inf.style.fontSize = "0.875rem";
            inf.style.marginTop = "0.25rem";
            container.appendChild(inf);
        }
        return container;
    }
    function handleRowDragDropEvents(ev, type) {
        ev.stopPropagation();
        ev.preventDefault();
        closeTableEditControl();
        tableEditRow = {};
        if (type === "dragenter" || type === "dragover") {
            const targetDiv = document.elementFromPoint(ev.clientX, ev.clientY);
            const tableRow = targetDiv === null || targetDiv === void 0 ? void 0 : targetDiv.parentElement;
            if (tableRow && tableRow.draggable && !tableRow.classList.contains("table-active") && targetDiv) {
                const target = targetDiv.parentElement;
                const above = ev.offsetY < target.offsetHeight / 2;
                if (above) {
                    target.style.borderTop = "10px solid var(--bs-primary)";
                    target.style.borderBottom = "1px solid #ccc";
                }
                else {
                    target.style.borderBottom = "10px solid var(--bs-primary)";
                    target.style.borderTop = "0px solid #ccc";
                }
            }
        }
        else {
            const targetDivs = document.querySelectorAll("tr");
            targetDivs.forEach((div) => {
                if (div && div.draggable) {
                    div.style.borderBottom = "1px solid #ccc";
                    div.style.borderTop = "0px solid #ccc";
                }
            });
        }
    }
    function getAddTableRowsModal(printess, p, addOption, forMobile) {
        const content = document.createElement("div");
        const container = document.createElement("div");
        container.className = "checkbox-list";
        const topContainer = document.createElement("div");
        const addButton = document.createElement("button");
        addButton.className = "btn btn-primary mb-3 me-2";
        addButton.style.display = "inline-block";
        addButton.innerText = printess.gl("ui.add");
        addButton.onclick = () => {
            const index = [];
            for (const child of container.children) {
                if (child instanceof HTMLInputElement) {
                    if (child.checked && child.dataset.index) {
                        index.push(parseInt(child.dataset.index));
                    }
                }
            }
            if (index.length > 0) {
                printess.addTableRows(p.id, addOption.type, addOption.libFF, index);
            }
            hideModal("ADD-ROWS-MODAL");
        };
        topContainer.appendChild(addButton);
        content.appendChild(topContainer);
        if (p.tableMeta && addOption.libFF) {
            const rows = printess.getTableRowsToAdd(addOption.libFF);
            for (const r of rows) {
                const id = "row-add-" + r.index;
                const check = document.createElement("input");
                check.type = "checkbox";
                const input = document.createElement("input");
                input.dataset.index = r.index.toString();
                input.className = "form-check-input";
                input.id = id;
                input.type = "checkbox";
                input.checked = false;
                const label = document.createElement("label");
                label.className = "form-check-label";
                label.setAttribute("for", id);
                if (forMobile)
                    label.style.color = input.checked ? "var(--bs-light)" : "var(--bs-primary)";
                label.textContent = r.label;
                input.onchange = () => {
                };
                container.appendChild(input);
                container.appendChild(label);
            }
        }
        content.appendChild(container);
        return content;
    }
    function closeTableEditControl() {
        var _a;
        const details = document.getElementById("tableDetailsRow");
        tableEditRowIndex = -1;
        lastClickedTableRow = -1;
        if (details && details.parentElement) {
            const pRow = details.previousElementSibling;
            if (pRow) {
                pRow.style.display = "table-row";
            }
            (_a = details.parentElement) === null || _a === void 0 ? void 0 : _a.removeChild(details);
            document.querySelectorAll(".printess-close-table-details").forEach(doneButton => doneButton.style.display = "none");
        }
    }
    function renderTableEditControl(printess, p, data, rowIndex, forMobile) {
        var _a;
        tableEditRow = data[rowIndex];
        tableEditRowIndex = rowIndex;
        printess.setTableRowIndex(p.id, rowIndex);
        const doneButton = document.getElementById("printess-close-table-details" + p.id);
        if (doneButton)
            doneButton.style.display = "inline-block";
        const tableRow = document.createElement("tr");
        tableRow.id = "tableDetailsRow";
        tableRow.style.border = "1px solid #ccc";
        tableRow.style.background = "var(--bs-table-active-bg)";
        for (const ao of ((_a = p.tableMeta) === null || _a === void 0 ? void 0 : _a.tableAddOptions) || []) {
            if (ao.type && ao.bg && ao.type === tableEditRow.type) {
                tableRow.style.background = ao.bg;
            }
        }
        const tableCell = document.createElement("td");
        tableCell.style.position = "relative";
        tableCell.colSpan = 100;
        const tableDetails = renderTableDetails(printess, p, forMobile);
        const closeButton = document.createElement("div");
        closeButton.className = "table-edit-close-button";
        const closeIcon = printess.getIcon("close");
        closeIcon.style.width = "20px";
        closeIcon.style.height = "20px";
        closeButton.onclick = () => {
            closeTableEditControl();
            const doneButton = document.getElementById("printess-close-table-details" + p.id);
            if (doneButton)
                doneButton.style.display = "none";
            const deleteIcons = document.querySelectorAll("svg.table-delete-icon");
            deleteIcons.forEach(i => {
                const icon = i;
                icon.style.pointerEvents = "none";
                icon.style.color = "var(--bs-gray)";
            });
            window.setTimeout(() => {
                const deleteIcons = document.querySelectorAll("svg.table-delete-icon");
                deleteIcons.forEach(i => {
                    const icon = i;
                    icon.style.pointerEvents = "auto";
                    icon.style.color = "var(--bs-primary)";
                });
            }, 1000);
        };
        closeButton.appendChild(closeIcon);
        tableCell.appendChild(closeButton);
        tableCell.appendChild(tableDetails);
        tableRow.appendChild(tableCell);
        return tableRow;
    }
    function renderInputValidation(printess, id) {
        const validation = document.createElement("div");
        validation.id = "val_" + id;
        validation.classList.add("invalid-feedback");
        return validation;
    }
    function renderTableDetails(printess, p, _forMobile) {
        var _a, _b;
        const details = document.createElement("div");
        if (!p.tableMeta)
            return details;
        details.innerHTML = "";
        details.appendChild(renderInputValidation(printess, p.id));
        if (((_a = p.tableMeta) === null || _a === void 0 ? void 0 : _a.tableType) === "calendar-events") {
            const group = document.createElement("div");
            group.className = "input-group";
            for (const col of p.tableMeta.columns) {
                if (col.name === "day") {
                    const dayDiv = getTableTextBox(printess, p, tableEditRowIndex, tableEditRow, col, false, false);
                    dayDiv.style.flexBasis = "80px";
                    dayDiv.style.marginRight = "10px";
                    group.appendChild(dayDiv);
                }
                else if (col.name === "text") {
                    const text = getTableTextBox(printess, p, tableEditRowIndex, tableEditRow, col, false, false);
                    text.style.flexGrow = "1";
                    text.style.flexBasis = "80px";
                    text.style.marginRight = "10px";
                    group.appendChild(text);
                }
            }
            details.appendChild(group);
        }
        else {
            let prevRow = p.tableMeta.columns[0].row;
            const detailsWrapper = document.createElement("div");
            detailsWrapper.className = "d-flex flex-wrap";
            for (const col of p.tableMeta.columns.filter(c => c.name !== "type")) {
                if (((_b = col.list) === null || _b === void 0 ? void 0 : _b.length) && col.listMode !== "multi-from-form-field") {
                    if (col.listMode === "auto-complete") {
                        const tableDetailsAutocomplete = getTableDetailsAutocomplete(printess, p, tableEditRow, col);
                        renderTableDetailsColumn(detailsWrapper, tableDetailsAutocomplete, col, prevRow);
                    }
                    else {
                        const tableDetailsDropDown = getTableDetailsDropDown(printess, p, tableEditRowIndex, tableEditRow, col, false, true);
                        renderTableDetailsColumn(detailsWrapper, tableDetailsDropDown, col, prevRow);
                    }
                }
                else {
                    const tableTextBox = getTableTextBox(printess, p, tableEditRowIndex, tableEditRow, col, false, false);
                    renderTableDetailsColumn(detailsWrapper, tableTextBox, col, prevRow);
                }
                prevRow = col.row;
            }
            details.appendChild(detailsWrapper);
        }
        window.setTimeout(() => {
            const input = details.querySelector("input");
            if (input)
                input.focus();
        }, 100);
        return details;
    }
    function renderTableDetailsColumn(detailsWrapper, tableDetailsDiv, col, prevRow) {
        if (prevRow !== col.row || col.row === "auto" || col.row === "new") {
            const flexBreak = document.createElement("div");
            flexBreak.style.flexBasis = "100%";
            flexBreak.style.height = "0";
            detailsWrapper.appendChild(flexBreak);
        }
        tableDetailsDiv.style.marginRight = "4px";
        tableDetailsDiv.style.flex = "1 1 0";
        detailsWrapper.appendChild(tableDetailsDiv);
    }
    function getTableDetailsAutocomplete(printess, p, row, col) {
        const formGroup = document.createElement("div");
        formGroup.className = "form-group mb-3";
        const label = document.createElement("label");
        label.className = "mb-2";
        label.setAttribute("for", "input-datalist");
        label.textContent = p.label;
        const input = document.createElement("input");
        input.className = "form-control bg-light";
        input.id = "input-datalist";
        input.setAttribute("list", "list-" + p.label);
        input.value = row[col.name];
        input.oninput = () => {
            setTableValue(printess, p, col, input.value);
        };
        if (col.list) {
            const datalist = document.createElement("datalist");
            datalist.id = "list-" + p.label;
            for (const entry of col.list) {
                const option = document.createElement("option");
                option.value = entry.toString();
                datalist.appendChild(option);
            }
            formGroup.appendChild(label);
            formGroup.appendChild(input);
            formGroup.appendChild(datalist);
        }
        return formGroup;
    }
    function getTableDetailsDropDown(printess, p, rowIndex, row, col, asList, fullWidth = true) {
        var _a;
        const dropdown = document.createElement("div");
        dropdown.classList.add("btn-group");
        dropdown.style.padding = "0";
        const ddContent = document.createElement("ul");
        const value = row[col.name];
        if (col.list) {
            const selectedItem = (_a = col.list.filter(s => s == value)[0]) !== null && _a !== void 0 ? _a : null;
            const button = document.createElement("button");
            button.className = "btn btn-light dropdown-toggle";
            if (fullWidth) {
                button.classList.add("full-width");
            }
            button.dataset.bsToggle = "dropdown";
            button.dataset.bsAutoClose = "true";
            button.setAttribute("aria-expanded", "false");
            if (selectedItem) {
                button.appendChild(getTableDropdownItemContent(printess, value));
            }
            dropdown.appendChild(button);
            if (asList) {
                ddContent.classList.add("list-group");
            }
            else {
                ddContent.classList.add("dropdown-menu");
                ddContent.setAttribute("aria-labelledby", "defaultDropdown");
                ddContent.style.width = "100%";
            }
            for (const entry of col.list) {
                const li = document.createElement("li");
                if (asList) {
                    li.classList.add("list-group-item");
                    if (entry === selectedItem) {
                        li.classList.add("active");
                    }
                }
                const a = document.createElement("a");
                a.classList.add("dropdown-item");
                a.onclick = () => {
                    setTableValue(printess, p, col, entry);
                    if (col.list) {
                        button.innerHTML = "";
                        button.appendChild(getTableDropdownItemContent(printess, entry));
                        if (asList) {
                            ddContent.querySelectorAll("li").forEach(li => li.classList.remove("active"));
                            li.classList.add("active");
                        }
                    }
                };
                a.appendChild(getTableDropdownItemContent(printess, entry));
                li.appendChild(a);
                ddContent.appendChild(li);
            }
            dropdown.appendChild(ddContent);
        }
        if (asList) {
            return ddContent;
        }
        else {
            return addLabel(printess, p, dropdown, p.id, false, p.kind, col.label || col.name);
        }
    }
    function getTableDropdownItemContent(printess, value) {
        const div = document.createElement("div");
        div.classList.add("dropdown-list-entry");
        const label = document.createElement("div");
        label.classList.add("dropdown-list-label");
        label.innerText = printess.gl(value.toString());
        div.appendChild(label);
        return div;
    }
    function getTableTextBox(printess, p, rowIndex, row, col, forMobile, forInlineEditing) {
        const inp = document.createElement("input");
        inp.type = "text";
        inp.value = row[col.name];
        inp.autocomplete = "off";
        inp.autocapitalize = "off";
        inp.spellcheck = false;
        if (forInlineEditing) {
            inp.style.fontSize = "11pt";
            inp.onfocus = () => {
                closeTableEditControl();
                tableEditRow = row;
                tableEditRowIndex = rowIndex;
                printess.setTableRowIndex(p.id, rowIndex);
            };
        }
        if (col.list && col.listMode === "multi-from-form-field") {
            inp.onclick = () => {
                var _a, _b;
                if (col.list) {
                    const list = printess.getTableSelectListByFormFieldName((_a = (col.list[0] + "").split("multi:")[1]) !== null && _a !== void 0 ? _a : "");
                    if (list) {
                        const selDiv = document.createElement("div");
                        let c = 0;
                        let curValues = [];
                        for (const itm of list) {
                            const colValue = (_b = row[col.name].toString()) !== null && _b !== void 0 ? _b : "";
                            const switchControl = document.createElement("div");
                            switchControl.className = "form-check form-switch mb-3 printess-" + p.kind;
                            switchControl.setAttribute("data-visibility-id", p.id.replace("#", "_hash_"));
                            const input = document.createElement("input");
                            input.className = "form-check-input";
                            input.id = p.id + (c++).toString() + "_switch";
                            input.type = "checkbox";
                            input.setAttribute("role", "switch");
                            if (colValue.includes(itm.value)) {
                                input.checked = true;
                                curValues.push(itm.value);
                            }
                            else {
                                input.checked = false;
                            }
                            const label = document.createElement("label");
                            label.className = "form-check-label";
                            label.setAttribute("for", p.id + (c++).toString() + "_switch");
                            label.textContent = itm.label ? "(" + itm.value + ") " + printess.gl(itm.label) : itm.value;
                            switchControl.appendChild(input);
                            switchControl.appendChild(label);
                            switchControl.onchange = () => {
                                curValues = curValues.filter(v => input.checked ? true : v !== itm.value);
                                if (input.checked) {
                                    curValues.push(itm.value);
                                }
                                setTableValue(printess, p, col, curValues.join(","));
                                inp.value = curValues.join(",");
                            };
                            selDiv.appendChild(switchControl);
                        }
                        const ok = document.createElement("button");
                        ok.classList.add("btn");
                        ok.classList.add("btn-primary");
                        ok.onclick = () => {
                            hideModal("FF-LIST-MULTI-SELECT");
                        };
                        ok.innerText = printess.gl("ui.buttonClose");
                        selDiv.appendChild(ok);
                        showModal(printess, "FF-LIST-MULTI-SELECT", selDiv, col.label || col.name);
                    }
                }
            };
        }
        if (col.max && col.max > 0) {
            inp.maxLength = col.max;
        }
        inp.oninput = () => {
            setTableValue(printess, p, col, inp.value);
        };
        if (forMobile) {
            inp.classList.add("form-control");
            return inp;
        }
        else {
            const r = addLabel(printess, p, inp, p.id + "_" + col.name, forMobile, p.kind, col.label || col.name, !!(col.max && col.max > 0));
            return r;
        }
    }
    function setTableValue(printess, p, col, newValue) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = null;
            if (col.data === "number" && typeof newValue === "string") {
                if (parseFloat(newValue).toString() !== newValue) {
                    ret = { boxIds: [], errorCode: "invalidNumber", errorValue1: "" };
                }
                else {
                    newValue = parseFloat(newValue);
                }
            }
            if (col.data === "boolean" && typeof newValue === "string") {
                if (newValue !== "true" && newValue !== "false") {
                    console.error("Input is not a boolean (expect true or false)=" + newValue);
                }
                else {
                    newValue = newValue === "true";
                }
            }
            if (ret !== null) {
                validate(printess, p, ret, { name: "_" + col.name, value: newValue.toString(), maxChar: col.max || 0 });
                return;
            }
            let rIndex = tableEditRowIndex;
            const data = JSON.parse(p.value.toString());
            if (Array.isArray(data)) {
                if (data[tableEditRowIndex].ORGIDX >= 0) {
                    rIndex = data[tableEditRowIndex].ORGIDX;
                }
            }
            ret = yield printess.setTableCell(p.id, rIndex, col, newValue);
            validate(printess, p, ret, { name: "_" + col.name, value: newValue.toString(), maxChar: col.max || 0 });
            if (ret !== null) {
                return;
            }
            tableEditRow[col.name] = newValue;
            const cell = document.getElementById("cell" + tableEditRowIndex + "_" + col.name);
            if (cell) {
                const inp = cell.querySelector("INPUT");
                if (inp) {
                    if (inp.value !== newValue.toString()) {
                        inp.value = newValue.toString();
                    }
                }
                else {
                    cell.innerText = printess.gl(newValue.toString());
                }
            }
            try {
                const a = JSON.parse(p.value);
                if (Array.isArray(a)) {
                    a[tableEditRowIndex][col.name] = newValue;
                    p.value = JSON.stringify(a);
                }
            }
            catch (error) {
                console.error("Can not upate table cell [" + col.name + "] or row " + tableEditRowIndex, error);
            }
        });
    }
    function getMobileUiDiv() {
        let mobileUi = document.querySelector(".mobile-ui");
        if (!mobileUi) {
            mobileUi = document.createElement("div");
            mobileUi.className = "mobile-ui";
            document.body.appendChild(mobileUi);
        }
        return mobileUi;
    }
    function getMobileNavbarDiv() {
        let mobileNav = document.querySelector(".mobile-navbar");
        if (!mobileNav) {
            mobileNav = document.createElement("nav");
            mobileNav.className = "mobile-navbar bg-primary";
            document.body.appendChild(mobileNav);
        }
        return mobileNav;
    }
    function renderMobileUi(printess, properties = uih_currentProperties, state = uih_currentState, groupSnippets = uih_currentGroupSnippets, layoutSnippets = uih_currentLayoutSnippets, tabs = uih_currentTabs, skipAutoSelect = false) {
        var _a, _b, _c;
        if (typeof uih_hasSteps === "undefined") {
            uih_hasSteps = printess.hasSteps();
        }
        let nextStep = null;
        if (uih_hasSteps) {
            nextStep = printess.getStep();
            if (uih_currentStep && nextStep && nextStep.docId != uih_currentStep.docId) {
                closeLayoutOverlays(printess, true);
            }
        }
        uih_currentStep = nextStep;
        uih_currentTabs = tabs;
        uih_currentGroupSnippets = groupSnippets;
        uih_currentLayoutSnippets = layoutSnippets;
        uih_currentState = state;
        uih_currentProperties = properties;
        uih_currentRender = "mobile";
        const mobileUi = getMobileUiDiv();
        mobileUi.innerHTML = "";
        const desktopProperties = document.getElementById("desktop-properties");
        if (desktopProperties) {
            desktopProperties.innerHTML = "";
        }
        const desktopPagebar = document.getElementById("desktop-pagebar");
        if (desktopPagebar) {
            desktopPagebar.innerHTML = "";
        }
        removeDesktopTabsNavigation();
        const closeButton = mobileUi.querySelector(".close-control-host-button");
        if (closeButton) {
            mobileUi.removeChild(closeButton);
        }
        const printessBuyerPropertiesButton = document.getElementById("printessBuyerPropertiesButton");
        if (printessBuyerPropertiesButton) {
            printessBuyerPropertiesButton.style.display = "none";
        }
        if ((printess.spreadCount() > 1 && printess.pageNavigationDisplay() === "numbers") || (printess.pageNavigationDisplay() === "icons")) {
            document.body.classList.add("has-mobile-page-bar");
        }
        else {
            document.body.classList.remove("has-mobile-page-bar");
        }
        if (printess.pageNavigationDisplay() === "icons") {
            document.body.classList.add("has-mobile-icon-pagebar");
        }
        else {
            document.body.classList.remove("has-mobile-icon-pagebar");
        }
        let autoSelectButton = null;
        if (state === "document" && printess.showMobileTabNavigation()) {
            document.body.classList.remove("no-mobile-button-bar");
            const tabsContainer = document.createElement("div");
            tabsContainer.className = "tabs-navigation";
            renderTabsNavigation(printess, tabsContainer, true, true);
            mobileUi.appendChild(tabsContainer);
            getMobilePriceBarDiv(printess);
        }
        else {
            const buttons = getMobileButtons(printess, undefined, undefined, skipAutoSelect);
            mobileUi.innerHTML = "";
            mobileUi.appendChild(buttons.div);
            autoSelectButton = buttons.autoSelectButton;
            setPropertyVisibilities(printess);
        }
        const controlHost = document.createElement("div");
        controlHost.className = "mobile-control-host";
        controlHost.id = "mobile-control-host";
        mobileUi.appendChild(controlHost);
        mobileUi.appendChild(getMobilePropertyNavButtons(printess, state, autoSelectButton !== null));
        if (printess.showTabNavigation()) {
            updateMobilePropertiesFullscreen(printess);
        }
        const layoutSnippetAmount = printess.hasSnippetMenu("layout") ? 1 : layoutSnippets.map(ls => ls.snippets.length).reduce((prev, curr) => prev + curr, 0);
        const layoutsButton = document.querySelector(".show-layouts-button");
        if (layoutsButton && printess.showTabNavigation()) {
            layoutsButton.style.visibility = "hidden";
        }
        else if (layoutsButton && layoutSnippetAmount > 0) {
            layoutsButton.textContent = printess.gl("ui.changeLayout");
            layoutsButton.style.visibility = "visible";
        }
        const closeLayoutsButton = document.getElementById("closeLayoutOffCanvas");
        if (closeLayoutsButton && printess.showTabNavigation()) {
            closeLayoutsButton.click();
        }
        if (!printess.showTabNavigation() && layoutSnippetAmount > 0) {
            handleOffcanvasLayoutsContainer(printess, true);
        }
        if (printess.hasSelection()) {
            setStorageItemSafe("editableFrames", "hint closed");
            const framePulse = document.getElementById("frame-pulse");
            if (framePulse)
                (_a = framePulse.parentElement) === null || _a === void 0 ? void 0 : _a.removeChild(framePulse);
        }
        renderUiButtonHints(printess, mobileUi, state, true);
        renderEditableFramesHint(printess);
        if (!printess.hasSnippetMenu("layout")) {
            if (!uih_layoutSelectionDialogHasBeenRendered && layoutSnippetAmount > 0 && printess.showLayoutsDialog()) {
                uih_layoutSelectionDialogHasBeenRendered = true;
                renderLayoutSelectionDialog(printess, layoutSnippets, true);
            }
        }
        else if (printess.selectLayoutsTabOneTime()) {
            window.setTimeout(() => {
                const layoutTab = document.querySelector('[data-tabid="#LAYOUTS"]');
                if (layoutTab)
                    layoutTab.click();
                window.setTimeout(() => removeMobileOverlayPaddings(), 100);
            }, 1000);
        }
        if (state === "document" && printess.hasLayoutSnippets() && !getStorageItemSafe("changeLayout")) {
            toggleChangeLayoutButtonHint();
        }
        const hasGroupSnippets = groupSnippets.length > 0;
        const hastLayoutSnippets = layoutSnippetAmount > 0 && printess.showTabNavigation();
        const showPhotoTab = !hasGroupSnippets && !hastLayoutSnippets && printess.showPhotoTab() && printess.showTabNavigation();
        if (showPhotoTab) {
            uih_currentTabId = "#PHOTOS";
        }
        if (!printess.showMobileTabNavigation()) {
            if ((hasGroupSnippets || hastLayoutSnippets || showPhotoTab)) {
                mobileUi.appendChild(getMobilePlusButton(printess));
            }
        }
        if (state !== "document") {
            mobileUi.appendChild(getMobilePropertyNavButtons(printess, state, false));
            if (!getStorageItemSafe("splitter-frame-hint") && printess.hasSplitterMenu() && printess.uiHintsDisplay().includes("splitterGuide")) {
                const edges = printess.splitterEdgesCount();
                if (edges > 0) {
                    showSplitterGuide(printess, properties[0], true);
                    setStorageItemSafe("splitter-frame-hint", "hint displayed");
                }
            }
        }
        else {
            if (uih_viewportOffsetTop > 1) {
                return;
            }
            if (autoSelectButton) {
                if (((_b = uih_lastMobileState === null || uih_lastMobileState === void 0 ? void 0 : uih_lastMobileState.externalProperty) === null || _b === void 0 ? void 0 : _b.kind) === "selection-text-style") {
                    if (properties.length && properties[0].kind === "selection-text-style") {
                        if (((_c = autoSelectButton.newState) === null || _c === void 0 ? void 0 : _c.metaProperty) && autoSelectButton.newState.metaProperty === (uih_lastMobileState === null || uih_lastMobileState === void 0 ? void 0 : uih_lastMobileState.metaProperty)) {
                            return;
                        }
                    }
                }
            }
        }
        for (const p of properties) {
            if (p.kind === "table") {
                const table = document.getElementById("table-control-" + p.id);
                if (table) {
                    table.replaceWith(getTableControl(printess, p, true));
                }
            }
        }
        printess.setZoomMode(printess.isTextEditorOpen() || state === "text" ? "frame" : "spread");
        console.log("Calling resizeMobileUi after renderMobileUi!");
        resizeMobileUi(printess);
    }
    function toggleChangeLayoutButtonHint() {
        const layoutsButton = document.querySelector(".show-layouts-button");
        if (layoutsButton) {
            layoutsButton.classList.add("layouts-button-pulse");
            layoutsButton.onclick = (e) => {
                var _a;
                e.preventDefault();
                const uiHintAlert = document.getElementById("ui-hint-changeLayout");
                (_a = uiHintAlert === null || uiHintAlert === void 0 ? void 0 : uiHintAlert.parentElement) === null || _a === void 0 ? void 0 : _a.removeChild(uiHintAlert);
                layoutsButton.classList.remove("layouts-button-pulse");
                setStorageItemSafe("changeLayout", "hint closed");
                layoutsButton.onclick = null;
            };
        }
    }
    let renderEditableFramesHintTimer = 0;
    function renderEditableFramesHint(printess) {
        const showEditableFramesHint = false;
        if (showEditableFramesHint) {
            renderEditableFramesHintTimer = window.setTimeout(() => {
                renderEditableFramesHintTimer = 0;
                printess.getFrameUiHintPosition().then((frame) => {
                    const spread = document.querySelector("div.printess-content");
                    let pulseDiv = document.getElementById("frame-pulse");
                    if (!pulseDiv) {
                        pulseDiv = document.createElement("div");
                        pulseDiv.classList.add("frame-hint-pulse");
                        pulseDiv.id = "frame-pulse";
                        pulseDiv.style.position = "absolute";
                    }
                    pulseDiv.style.left = frame.left;
                    pulseDiv.style.top = frame.top;
                    const pointer = printess.getIcon("hand-pointer-light");
                    pointer.classList.add("frame-hint-pointer");
                    pulseDiv.appendChild(pointer);
                    spread === null || spread === void 0 ? void 0 : spread.appendChild(pulseDiv);
                });
            }, 1000);
        }
    }
    function renderUiButtonHints(printess, container, _state = uih_currentState, forMobile) {
        const showLayoutsHint = (printess.showTabNavigation() && forMobile) || (!forMobile && uih_currentTabId !== "#LAYOUTS");
        const uiHints = [{
            header: "expertMode",
            msg: printess.gl("ui.expertModeHint"),
            position: "fixed",
            top: !forMobile && printess.pageNavigationDisplay() === "icons" ? "50px" : "calc(var(--editor-pagebar-height) + 5px)",
            left: !forMobile && printess.pageNavigationDisplay() === "icons" ? "calc(100% - 450px)" : "30px",
            color: "danger",
            show: printess.uiHintsDisplay().includes("expertMode") && !getStorageItemSafe("expertMode") && printess.hasExpertButton(),
            task: () => {
                const expertBtn = document.getElementById("printess-expert-button");
                if (expertBtn) {
                    if (forMobile) {
                        expertBtn.classList.add("btn-light");
                        expertBtn.classList.remove("btn-outline-light");
                    }
                    else {
                        expertBtn.classList.add("btn-primary");
                        expertBtn.classList.remove("btn-outline-primary");
                    }
                }
                printess.enterExpertMode();
            }
        }, {
            header: "addDesign",
            msg: printess.showTabNavigation() ? printess.gl("ui.addDesignLayoutHint") : printess.gl("ui.addDesignHint"),
            position: "absolute",
            top: printess.showTabNavigation() ? "-170px" : "-150px",
            left: "30px",
            color: "success",
            show: printess.uiHintsDisplay().includes("groupSnippets") && !getStorageItemSafe("addDesign") && uih_currentGroupSnippets.length > 0 && forMobile && !printess.showMobileTabNavigation(),
            task: () => {
                setStorageItemSafe("addDesign", "hint closed");
                renderMobilePropertiesFullscreen(printess, "add-design", "open");
            }
        }, {
            header: "changeLayout",
            msg: printess.gl("ui.changeLayoutHint"),
            position: "fixed",
            top: printess.hasExpertButton() && forMobile ? "calc(50% - 100px)" : printess.showTabNavigation() && !forMobile ? "calc(50% - 300px)" : "calc(50% - 150px)",
            left: printess.showTabNavigation() && !forMobile ? "75px" : "55px",
            color: "primary",
            show: printess.uiHintsDisplay().includes("layoutSnippets") && !getStorageItemSafe("changeLayout") && printess.hasLayoutSnippets() && showLayoutsHint && !forMobile,
            task: () => {
                if (printess.showTabNavigation() && !forMobile) {
                    selectTab(printess, forMobile, "#LAYOUTS");
                    printess.clearSelection();
                }
                else {
                    const layoutBtn = document.querySelector(".show-layouts-button");
                    if (layoutBtn) {
                        layoutBtn.classList.remove("layouts-button-pulse");
                    }
                    const offCanvas = document.querySelector("div#layoutOffcanvas");
                    if (offCanvas) {
                        offCanvas.style.visibility = "visible";
                        offCanvas.classList.add("show");
                    }
                    const offCanvasButton = document.querySelector("button#closeLayoutOffCanvas");
                    if (offCanvasButton && offCanvas) {
                        offCanvasButton.onclick = () => offCanvas.classList.remove("show");
                    }
                }
            }
        }];
        const expertAlert = document.getElementById("ui-hint-expertMode");
        if (!printess.hasExpertButton() && expertAlert) {
            expertAlert.remove();
        }
        const layoutsButton = document.querySelector("button.show-layouts-button");
        const layoutAlert = document.getElementById("ui-hint-changeLayout");
        if ((layoutsButton.style.visibility === "hidden" || !layoutsButton) && layoutAlert) {
            layoutAlert.remove();
        }
        uiHints.filter(h => h.show).forEach(hint => {
            let alert = document.getElementById("ui-hint-" + hint.header);
            if (alert) {
            }
            else {
                alert = document.createElement("div");
                const color = hint.color;
                alert.className = "alert alert-dismissible fade show ui-hint-alert";
                alert.id = "ui-hint-" + hint.header;
                alert.classList.add("alert-" + color);
                alert.style.position = hint.position;
                alert.style.left = hint.left;
                alert.style.top = hint.top;
                const title = document.createElement("strong");
                title.style.paddingRight = "5px";
                title.textContent = printess.gl("ui." + hint.header);
                const text = document.createElement("div");
                text.textContent = hint.msg;
                const close = printess.getIcon("close");
                close.classList.add("close-info-alert-icon");
                close.onclick = () => {
                    var _a;
                    setStorageItemSafe(hint.header, "hint closed");
                    (_a = alert === null || alert === void 0 ? void 0 : alert.parentElement) === null || _a === void 0 ? void 0 : _a.removeChild(alert);
                    if (hint.header === "changeLayout") {
                        const layoutsButton = document.querySelector(".show-layouts-button");
                        if (layoutsButton) {
                            layoutsButton.onclick = (e) => {
                                e.preventDefault();
                                layoutsButton.classList.remove("layouts-button-pulse");
                                layoutsButton.onclick = null;
                            };
                        }
                    }
                };
                const flexWrapper = document.createElement("div");
                flexWrapper.className = "d-flex w-100 justify-content-end mt-1";
                const open = document.createElement("span");
                open.className = "layout-hint-open";
                open.textContent = hint.header === "expertMode" ? printess.gl("ui.turnOn") : printess.gl("ui.showMe");
                open.onclick = () => {
                    var _a;
                    setStorageItemSafe(hint.header, "hint closed");
                    (_a = alert === null || alert === void 0 ? void 0 : alert.parentElement) === null || _a === void 0 ? void 0 : _a.removeChild(alert);
                    hint.task();
                };
                flexWrapper.appendChild(open);
                alert.appendChild(title);
                alert.appendChild(text);
                alert.appendChild(close);
                alert.appendChild(flexWrapper);
                container.appendChild(alert);
            }
        });
    }
    function getMobilePlusButton(printess) {
        const button = document.createElement("div");
        button.className = "mobile-property-plus-button";
        const circle = document.createElement("div");
        circle.className = "mobile-property-circle";
        circle.onclick = () => {
            setStorageItemSafe("addDesign", "hint closed");
            circle.classList.remove("mobile-property-plus-pulse");
            renderMobilePropertiesFullscreen(printess, "add-design", "open");
        };
        if (!getStorageItemSafe("addDesign")) {
            circle.classList.add("mobile-property-plus-pulse");
        }
        else {
            circle.classList.remove("mobile-property-plus-pulse");
        }
        const ico = printess.gl("ui.addDesignIcon") || "plus";
        const icon = printess.getIcon(ico);
        circle.appendChild(icon);
        button.appendChild(circle);
        return button;
    }
    function getMobileNavButton(btn, circleWhiteBg) {
        const button = document.createElement("div");
        button.className = "mobile-property-nav-button";
        if (btn.name === "basket") {
            button.classList.add("printess-basket-button");
        }
        const circle = document.createElement("div");
        circle.className = "mobile-property-circle bg-primary text-white";
        circle.onclick = () => btn.task();
        if (circleWhiteBg) {
            circle.className = "mobile-property-circle bg-white text-primary border border-primary";
        }
        circle.appendChild(btn.icon);
        button.appendChild(circle);
        return button;
    }
    function getMobilePropertyNavButtons(printess, state, fromAutoSelect, _hasControlHost = false) {
        let container = document.getElementById("mobile-nav-buttons-container");
        if (container) {
            container.innerHTML = "";
        }
        else {
            container = document.createElement("div");
            container.id = "mobile-nav-buttons-container";
            container.className = "mobile-property-button-container";
        }
        const iconName = printess.userInBuyerSide() ? "print-solid" : printess.gl("ui.buttonBasketIcon") || "shopping-cart-add";
        const basketIcon = printess.getIcon(iconName);
        const buttons = {
            add: {
                name: "closeNewSnippetList",
                icon: printess.getIcon("carret-down-solid"),
                task: () => { printess.clearSelection(); resizeMobileUi(printess); }
            },
            previous: {
                name: "previous",
                icon: printess.getIcon("arrow-left"),
                task: () => {
                    var _a;
                    printess.previousStep();
                    getCurrentTab(printess, (Number((_a = printess.getStep()) === null || _a === void 0 ? void 0 : _a.index) - 1), true);
                }
            },
            clear: {
                name: "clear",
                icon: printess.getIcon("check"),
                task: () => { printess.clearSelection(); resizeMobileUi(printess); }
            },
            frame: {
                name: "frame",
                icon: printess.getIcon("check"),
                task: () => { printess.setZoomMode("spread"); renderMobileUi(printess, uih_currentProperties, "frames", undefined, undefined, undefined, true); }
            },
            document: {
                name: "document",
                icon: printess.getIcon("check"),
                task: () => renderMobileUi(printess, uih_currentProperties, "document", undefined, undefined, undefined, true)
            },
            next: {
                name: "next",
                icon: printess.getIcon("arrow-right"),
                task: () => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    yield gotoNextStep(printess);
                    getCurrentTab(printess, (Number((_a = printess.getStep()) === null || _a === void 0 ? void 0 : _a.index) + 1), true);
                })
            },
            basket: {
                name: "basket",
                icon: basketIcon,
                task: () => addToBasket(printess)
            }
        };
        if (state === "text") {
            container.appendChild(getMobileNavButton(buttons.clear, false));
        }
        else if (state === "details" || state === "frames") {
            if (printess.isCurrentStepActive()) {
                if (uih_currentProperties.length > 1 && state === "details") {
                    container.appendChild(getMobileNavButton(buttons.frame, true));
                }
                else if (printess.hasPreviousStep()) {
                    container.appendChild(getMobileNavButton(buttons.previous, false));
                }
            }
            else {
                if ((printess.buyerCanHaveEmptySelection() && printess.hasSelection()) || (printess.hasBackground() && printess.hasSelection())) {
                    if (uih_currentProperties.length > 1 && state === "details") {
                        container.appendChild(getMobileNavButton(buttons.frame, printess.hasSteps()));
                    }
                    else {
                        container.appendChild(getMobileNavButton(buttons.clear, printess.hasSteps()));
                    }
                }
                else if (printess.hasPreviousStep()) {
                    container.appendChild(getMobileNavButton(buttons.previous, false));
                }
            }
            if (printess.hasSteps()) {
                if (printess.hasNextStep()) {
                    container.appendChild(getMobileNavButton(buttons.next, false));
                }
                else {
                    container.appendChild(getMobileNavButton(buttons.basket, false));
                }
            }
        }
        else if (state === "document") {
            if (printess.hasSteps()) {
                if (printess.hasPreviousStep()) {
                    container.appendChild(getMobileNavButton(buttons.previous, false));
                }
                if (printess.hasNextStep()) {
                    container.appendChild(getMobileNavButton(buttons.next, false));
                }
                else {
                    container.appendChild(getMobileNavButton(buttons.basket, false));
                }
            }
            return container;
        }
        return container;
    }
    function renderMobileNavBar(printess) {
        const navBar = getMobileNavbarDiv();
        navBar.innerHTML = "";
        const nav = document.createElement("div");
        nav.className = "navbar navbar-dark";
        nav.style.flexWrap = "nowrap";
        const basketBtnBehaviour = printess.getBasketButtonBehaviour();
        const hasSteps = printess.hasSteps();
        const isDocTabs = printess.pageNavigationDisplay() === "doc-tabs";
        const isBookMode = printess.canAddSpreads() || printess.canRemoveSpreads();
        const noStepsMenu = printess.showUndoRedo() && !hasSteps && (printess.hasExpertButton() || printess.showSaveButton() || printess.showLoadButton() || printess.showProofButton()) && (basketBtnBehaviour === "go-to-preview" || isBookMode > 0 || isDocTabs);
        const showUndoRedo = printess.showUndoRedo() && !hasSteps && !printess.hasPreviewBackButton() && !isDocTabs;
        const noCloseBtn = hasSteps || (isDocTabs && printess.showUndoRedo());
        const showExpertBtn = printess.hasExpertButton() && !noStepsMenu && !hasSteps && !(printess.showSaveButton() || printess.showLoadButton() || printess.showProofButton());
        const showExpertBtnWithSteps = printess.hasExpertButton() && hasSteps && printess.stepHeaderDisplay() === "never" && !(printess.showSaveButton() || printess.showLoadButton() || printess.showProofButton());
        const showSaveBtn = printess.showSaveButton() && !noStepsMenu && !hasSteps && !printess.hasExpertButton();
        const showSaveBtnWithSteps = printess.showSaveButton() && hasSteps && printess.stepHeaderDisplay() === "never" && !printess.hasExpertButton();
        {
            const btn = document.createElement("button");
            btn.className = "btn btn-sm ms-2 me-2 main-button";
            btn.style.minWidth = "40px";
            const container = document.createElement("div");
            container.className = "d-flex";
            if (printess.hasPreviewBackButton()) {
                const btn = document.createElement("button");
                btn.className = "btn btn-sm text-white me-2 ms-2";
                const ico = printess.getIcon("arrow-left");
                ico.classList.add("icon");
                btn.appendChild(ico);
                btn.onclick = () => printess.gotoPreviousPreviewDocument();
                nav.appendChild(btn);
            }
            else {
                if (!noStepsMenu && !noCloseBtn) {
                    const callback = printess.getBackButtonCallback();
                    btn.className = "btn btn-sm text-white me-2 ms-2";
                    btn.textContent = printess.gl("ui.buttonBack");
                    const caption = printess.gl("ui.buttonBack");
                    const icon = printess.gl("ui.buttonBackIcon");
                    if (icon) {
                        const svg = printess.getIcon(icon);
                        svg.style.fill = "var(--bs-light)";
                        svg.style.height = "24px";
                        if (caption) {
                            svg.style.float = "left";
                            svg.style.marginRight = "10px";
                        }
                        btn.appendChild(svg);
                    }
                    if (!callback)
                        btn.classList.add("disabled");
                    btn.onclick = () => {
                        if (printess.userInBuyerSide()) {
                            if (confirm("Do you want to log out?\n(Please print your current work before leaving)")) {
                                printess.logout();
                            }
                        }
                        else if (printess.isInDesignerMode()) {
                            if (callback) {
                                handleBackButtonCallback(printess, callback);
                            }
                        }
                        else {
                            getCloseEditorDialog(printess);
                        }
                    };
                }
                else {
                    const ico = printess.getIcon("burger-menu");
                    ico.classList.add("icon");
                    btn.appendChild(ico);
                    let showMenuList = false;
                    btn.onclick = () => {
                        showMenuList = !showMenuList;
                        const menuList = document.getElementById("mobile-menu-list");
                        if (menuList)
                            navBar.removeChild(menuList);
                        if (showMenuList)
                            navBar.appendChild(getMobileMenuList(printess));
                    };
                }
                if (showExpertBtn || showExpertBtnWithSteps) {
                    const expertBtn = getExpertModeButton(printess, true);
                    container.appendChild(btn);
                    container.appendChild(expertBtn);
                    nav.appendChild(container);
                }
                else if (showSaveBtn || showSaveBtnWithSteps) {
                    const saveBtn = getSaveButton(printess, true);
                    container.appendChild(btn);
                    container.appendChild(saveBtn);
                    nav.appendChild(container);
                }
                else {
                    nav.appendChild(btn);
                }
            }
        }
        if (hasSteps) {
            const s = printess.getStep();
            const hd = printess.stepHeaderDisplay();
            if (s && hd !== "never") {
                const step = document.createElement("div");
                step.style.flexGrow = "1";
                step.style.display = "flex";
                step.style.alignItems = "center";
                step.style.justifyContent = "center";
                document.body.classList.add("mobile-has-steps-header");
                if (hd === "only badge" || hd === "title and badge") {
                    const badge = document.createElement("div");
                    badge.className = "step-badge step-badge-sm";
                    badge.innerText = (s.index + 1).toString();
                    step.appendChild(badge);
                }
                if (hd === "only title" || hd === "title and badge") {
                    const h6 = document.createElement("h6");
                    h6.innerText = printess.gl(s.title);
                    h6.style.margin = "0";
                    h6.className = "text-light text-truncate";
                    h6.style.maxWidth = "calc(100vw - 150px)";
                    step.appendChild(h6);
                }
                if (hd === "tabs list" || hd === "badge list") {
                    if (hd === "badge list") {
                        step.classList.add("badge-list-mobile");
                    }
                    step.classList.add("step-tabs-list");
                    step.id = "step-tab-list";
                    step.appendChild(getStepsTabsList(printess, true, hd));
                    const scrollRight = document.createElement("div");
                    scrollRight.className = "scroll-right-indicator";
                    scrollRight.style.backgroundImage = "linear-gradient(to right, rgba(168,168,168,0), var(--bs-primary))";
                    scrollRight.style.display = "inline-block";
                    step.appendChild(scrollRight);
                }
                nav.appendChild(step);
            }
            else {
                document.body.classList.remove("mobile-has-steps-header");
            }
        }
        else if (isDocTabs) {
            const docTabs = document.createElement("div");
            docTabs.style.flexGrow = "1";
            docTabs.style.display = "flex";
            docTabs.style.alignItems = "center";
            docTabs.style.justifyContent = "center";
            docTabs.classList.add("step-tabs-list");
            docTabs.id = "step-tab-list";
            document.body.classList.add("mobile-has-steps-header");
            const scrollRight = document.createElement("div");
            scrollRight.className = "scroll-right-indicator";
            scrollRight.style.backgroundImage = "linear-gradient(to right, rgba(168,168,168,0), var(--bs-primary))";
            scrollRight.style.display = "inline-block";
            docTabs.appendChild(getStepsTabsList(printess, true, "doc tabs"));
            docTabs.appendChild(scrollRight);
            nav.appendChild(docTabs);
            if (printess.hasPreviewBackButton()) {
                docTabs.style.visibility = "hidden";
            }
        }
        else if (showUndoRedo) {
            const undoredo = document.createElement("div");
            undoredo.style.display = "flex";
            {
                const btn = document.createElement("button");
                btn.className = "btn btn-sm";
                const ico = printess.getIcon("undo-arrow");
                ico.classList.add("icon");
                btn.onclick = () => {
                    printess.undo();
                };
                btn.appendChild(ico);
                undoredo.appendChild(btn);
            }
            {
                const btn = document.createElement("button");
                btn.classList.add("btn");
                btn.classList.add("btn-sm");
                const ico = printess.getIcon("redo-arrow");
                ico.classList.add("icon");
                btn.onclick = () => {
                    printess.redo();
                };
                btn.appendChild(ico);
                undoredo.appendChild(btn);
            }
            nav.appendChild(undoredo);
        }
        const wrapper = document.createElement("div");
        wrapper.className = "d-flex";
        const isStepTabsList = printess.stepHeaderDisplay() === "tabs list";
        const isStepBadgeList = printess.stepHeaderDisplay() === "badge list";
        if (basketBtnBehaviour === "go-to-preview" && !isStepTabsList && !isStepBadgeList) {
            const btn = document.createElement("button");
            btn.className = "btn btn-sm ms-2 main-button";
            btn.classList.add("btn-outline-light");
            btn.innerText = printess.gl("ui.buttonPreview");
            btn.onclick = () => __awaiter(this, void 0, void 0, function* () {
                const validation = yield validateAllInputs(printess, "preview");
                if (validation) {
                    printess.gotoNextPreviewDocument();
                }
            });
            wrapper.appendChild(btn);
        }
        {
            const btn = document.createElement("button");
            btn.className = "btn btn-sm ms-2 me-2 main-button printess-basket-button";
            if (printess.hasSteps() && !printess.hasNextStep()) {
                btn.classList.add("main-button-pulse");
            }
            const caption = printess.userInBuyerSide() ? printess.gl("ui.buttonPrint") : printess.gl("ui.buttonBasketMobile");
            if (caption) {
                btn.textContent = caption;
                btn.style.color = "white";
                btn.style.whiteSpace = "nowrap";
                btn.style.border = "1px solid var(--bs-light)";
            }
            else {
                const icon = printess.userInBuyerSide() ? "print-solid" : printess.gl("ui.buttonBasketIcon") || "shopping-cart-add";
                const ico = printess.getIcon(icon);
                ico.classList.add("big-icon");
                ico.style.fill = "var(--bs-light)";
                btn.appendChild(ico);
            }
            btn.onclick = () => addToBasket(printess);
            wrapper.appendChild(btn);
        }
        nav.appendChild(wrapper);
        navBar.appendChild(nav);
        return navBar;
    }
    function getMobileMenuList(printess) {
        const isBookMode = printess.canAddSpreads() || printess.canRemoveSpreads();
        const isDocTabs = printess.pageNavigationDisplay() === "doc-tabs";
        const noStepsMenu = printess.showUndoRedo() && !printess.hasSteps() && (printess.hasExpertButton() || printess.showSaveButton()) && (printess.getBasketButtonBehaviour() === "go-to-preview" || isBookMode > 0 || isDocTabs);
        const listWrapper = document.createElement("div");
        listWrapper.id = "mobile-menu-list";
        const menuList = document.createElement("div");
        menuList.className = "btn-group w-100 d-flex flex-wrap bg-primary";
        menuList.style.position = "absolute";
        menuList.style.top = "48px";
        menuList.style.left = "0px";
        menuList.style.zIndex = "1000";
        const addSpreads = printess.canAddSpreads();
        const menuItems = [
            {
                id: "back",
                title: "ui.mobileMenuBack",
                icon: "back",
                disabled: !printess.getBackButtonCallback(),
                show: true,
                task: () => {
                    if (printess.userInBuyerSide()) {
                        if (confirm("Do you want to log out?\n(Please print your current work before leaving)")) {
                            printess.logout();
                        }
                    }
                    else if (printess.isInDesignerMode()) {
                        const callback = printess.getBackButtonCallback();
                        if (callback) {
                            handleBackButtonCallback(printess, callback);
                        }
                    }
                    else {
                        getCloseEditorDialog(printess);
                    }
                }
            }, {
                id: "load",
                title: "ui.buttonLoad",
                icon: "folder-open-solid",
                show: printess.showLoadButton(),
                disabled: false,
                task: () => {
                    const cb = printess.getLoadTemplateButtonCallback();
                    if (cb) {
                        cb();
                    }
                }
            }, {
                id: "proof",
                title: "ui.buttonProof",
                icon: "print-solid",
                show: printess.showProofButton(),
                disabled: false,
                task: () => {
                    renderProofPdfs(printess);
                }
            }, {
                id: "save",
                title: "ui.mobileMenuSave",
                icon: "cloud-upload-light",
                show: (printess.showSaveButton() && printess.hasSteps() && printess.stepHeaderDisplay() !== "never") || (noStepsMenu && printess.showSaveButton()),
                disabled: false,
                task: () => {
                    saveTemplate(printess, "save");
                }
            }, {
                id: "expert",
                title: "ui.expertMode",
                icon: "pen-swirl",
                show: (printess.hasExpertButton() && printess.hasSteps() && printess.stepHeaderDisplay() !== "never") || (noStepsMenu && printess.hasExpertButton()),
                disabled: false,
                task: () => {
                    if (printess.isInExpertMode()) {
                        printess.leaveExpertMode();
                    }
                    else {
                        printess.enterExpertMode();
                    }
                }
            }, {
                id: "undo",
                title: "ui.undo",
                icon: "undo-arrow",
                disabled: printess.undoCount() === 0,
                show: printess.showUndoRedo(),
                task: printess.undo
            }, {
                id: "redo",
                title: "ui.redo",
                icon: "redo-arrow",
                show: printess.showUndoRedo(),
                disabled: printess.redoCount() === 0,
                task: printess.redo
            }, {
                id: "addPages",
                title: "+" + (addSpreads * 2) + " " + printess.gl("ui.pages"),
                show: addSpreads > 0,
                disabled: addSpreads === 0,
                task: printess.addSpreads
            }, {
                id: "arrangePages",
                title: printess.gl("ui.arrangePages"),
                show: isBookMode > 0,
                disabled: false,
                task: () => getArrangePagesOverlay(printess, true)
            }, {
                id: "previous",
                title: "ui.buttonPrevStep",
                icon: "arrow-left",
                disabled: !printess.hasPreviousStep(),
                show: printess.hasSteps(),
                task: () => {
                    var _a;
                    printess.previousStep();
                    if ((printess.stepHeaderDisplay() === "tabs list" || printess.stepHeaderDisplay() === "badge list")) {
                        const tabsListScrollbar = document.getElementById("tabs-list-scrollbar");
                        const curStepTab = document.getElementById("tab-step-" + (Number((_a = printess.getStep()) === null || _a === void 0 ? void 0 : _a.index) - 1));
                        setTabScrollPosition(tabsListScrollbar, curStepTab, true);
                    }
                }
            }, {
                id: "next",
                title: "ui.buttonNext",
                icon: "arrow-right",
                disabled: !printess.hasNextStep(),
                show: printess.hasSteps(),
                task: () => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    yield gotoNextStep(printess);
                    getCurrentTab(printess, (Number((_a = printess.getStep()) === null || _a === void 0 ? void 0 : _a.index) + 1), true);
                })
            }, {
                id: "firstStep",
                title: "ui.buttonFirstStep",
                icon: printess.previewStepsCount() > 0 ? "primary" : "angle-double-left",
                disabled: !printess.hasSteps() || !printess.hasPreviousStep(),
                show: printess.hasSteps(),
                task: () => {
                    printess.gotoFirstStep();
                    getCurrentTab(printess, 0, true);
                }
            }, {
                id: "lastStep",
                title: printess.previewStepsCount() > 0 ? "ui.buttonPreview" : "ui.buttonLastStep",
                icon: printess.previewStepsCount() > 0 ? "preview-doc" : "angle-double-right",
                disabled: !printess.hasNextStep(),
                show: printess.hasSteps(),
                task: () => __awaiter(this, void 0, void 0, function* () {
                    var _b, _c;
                    const validation = yield validateAllInputs(printess, printess.previewStepsCount() > 0 ? "preview" : "validateAll");
                    if (validation) {
                        if (printess.previewStepsCount() > 0) {
                            printess.gotoPreviewStep();
                        }
                        else {
                            printess.gotoLastStep();
                            getCurrentTab(printess, (_c = (_b = printess.lastStep()) === null || _b === void 0 ? void 0 : _b.index) !== null && _c !== void 0 ? _c : 0, true);
                        }
                    }
                })
            }
        ];
        menuItems.forEach((mi, idx) => {
            if (mi.show) {
                const hasExpertButton = printess.hasExpertButton() && printess.hasSteps() && printess.stepHeaderDisplay() !== "never";
                const item = document.createElement("li");
                item.className = "btn btn-primary d-flex w-25 justify-content-center align-items-center";
                if (mi.disabled)
                    item.classList.add("disabled");
                if (mi.id === "next" || (printess.previewStepsCount() === 0 && mi.id === "lastStep")) {
                    item.classList.add("reverse-menu-btn-content");
                }
                item.style.border = "1px solid rgba(0,0,0,.125)";
                if (hasExpertButton || noStepsMenu || printess.showSaveButton() || printess.showLoadButton() || printess.showProofButton()) {
                    item.style.minWidth = "50%";
                }
                else {
                    if (idx < 4)
                        item.style.minWidth = "33%";
                    if (idx >= 4)
                        item.style.minWidth = "50%";
                }
                if (printess.isInExpertMode() && mi.id === "expert") {
                    item.classList.remove("btn-primary");
                    item.classList.add("btn-light");
                }
                if (mi.id === "back" && !printess.showUndoRedo() && !hasExpertButton && !noStepsMenu && !(printess.showSaveButton() || printess.showLoadButton() || printess.showProofButton())) {
                    item.style.minWidth = "100%";
                }
                const span = document.createElement("span");
                span.textContent = printess.gl(mi.title);
                if (printess.hasExpertButton() && (printess.showSaveButton() || printess.showLoadButton() || printess.showProofButton())) {
                    if (printess.showSaveButton() && (printess.showLoadButton() || printess.showProofButton())) {
                        if (idx < 5)
                            item.style.minWidth = "25%";
                    }
                    else {
                        if (idx < 4)
                            item.style.minWidth = "33%";
                    }
                    if (mi.id === "expert") {
                        span.textContent = "Expert";
                    }
                }
                if (mi.icon) {
                    const icon = printess.getIcon(mi.icon);
                    icon.style.width = "20px";
                    icon.style.height = "20px";
                    icon.style.marginRight = "10px";
                    if (mi.id === "next" || (printess.previewStepsCount() === 0 && mi.id === "lastStep")) {
                        icon.style.marginLeft = "10px";
                        icon.style.marginRight = "0px";
                    }
                    item.appendChild(icon);
                }
                item.appendChild(span);
                item.onclick = () => {
                    var _a;
                    const list = document.getElementById("mobile-menu-list");
                    if (list)
                        (_a = list.parentElement) === null || _a === void 0 ? void 0 : _a.removeChild(list);
                    mi.task();
                };
                menuList.appendChild(item);
            }
        });
        listWrapper.appendChild(menuList);
        return listWrapper;
    }
    function getMobilePageBarDiv() {
        let pagebar = document.querySelector(".mobile-pagebar");
        if (!pagebar) {
            pagebar = document.createElement("div");
            pagebar.className = "mobile-pagebar";
            document.body.appendChild(pagebar);
        }
        else {
            pagebar.innerHTML = "";
        }
        return pagebar;
    }
    function getMobilePriceBarDiv(printess) {
        let pricebar = document.querySelector(".mobile-pricebar");
        if (!pricebar) {
            pricebar = document.createElement("div");
            pricebar.className = "mobile-pricebar";
            document.body.appendChild(pricebar);
        }
        else {
            pricebar.innerHTML = "";
        }
        const priceDiv = document.createElement("div");
        priceDiv.className = "total-price-container";
        priceDiv.id = "total-price-display";
        pricebar.appendChild(priceDiv);
        const mobileNavBarHeight = parseInt(getComputedStyle(document.body).getPropertyValue("--mobile-navbar-height").trim().replace("px", "") || "");
        let mobilePageBarHeight = parseInt(getComputedStyle(document.body).getPropertyValue("--mobile-pagebar-height").trim().replace("px", "") || "");
        if (printess.pageNavigationDisplay() === "icons") {
            mobilePageBarHeight = 100;
        }
        if (pricebar && uih_mobilePriceDisplay !== "closed") {
            pricebar.style.top = mobileNavBarHeight + mobilePageBarHeight + "px";
        }
        getPriceDisplay(printess, priceDiv, uih_currentPriceDisplay, true);
        let opener = document.querySelector(".mobile-price-display-opener");
        if (!opener) {
            opener = document.createElement("div");
            opener.className = "mobile-price-display-opener";
            const openIco = printess.getIcon("grid-lines");
            openIco.classList.add("open-icon");
            opener.appendChild(openIco);
            document.body.appendChild(opener);
        }
        if (uih_mobilePriceDisplay === "open" || uih_mobilePriceDisplay === "none") {
            opener.classList.add("hidden");
        }
        else {
            opener.classList.remove("hidden");
        }
        const closer = document.createElement("div");
        closer.className = "price-display-side-closer";
        const closeIco = printess.getIcon("close");
        closeIco.classList.add("close-icon");
        closer.appendChild(closeIco);
        closer.ontouchstart = () => {
            opener === null || opener === void 0 ? void 0 : opener.classList.remove("hidden");
            if (pricebar)
                pricebar.classList.add("closed");
            uih_mobilePriceDisplay = "closed";
            resizeMobileUi(printess);
        }, {
            passive: true
        };
        closer.onmousedown = () => {
            opener === null || opener === void 0 ? void 0 : opener.classList.remove("hidden");
            if (pricebar)
                pricebar.classList.add("closed");
            uih_mobilePriceDisplay = "closed";
            resizeMobileUi(printess);
        };
        opener.ontouchstart = () => {
            if (pricebar)
                pricebar.classList.remove("closed");
            uih_mobilePriceDisplay = "open";
            resizeMobileUi(printess);
            opener === null || opener === void 0 ? void 0 : opener.classList.add("hidden");
        }, {
            passive: true
        };
        opener.onmousedown = () => {
            if (pricebar)
                pricebar.classList.remove("closed");
            uih_mobilePriceDisplay = "open";
            resizeMobileUi(printess);
            opener === null || opener === void 0 ? void 0 : opener.classList.add("hidden");
        };
        pricebar.appendChild(closer);
    }
    function resizeMobileUi(printess) {
        if (uih_autoSelectPending)
            return;
        const mobileUi = getMobileUiDiv();
        const controlHost = document.getElementById("mobile-control-host");
        if (mobileUi && controlHost) {
            const controlHostHeight = controlHost.offsetHeight;
            const mobileNavBarHeight = parseInt(getComputedStyle(document.body).getPropertyValue("--mobile-navbar-height").trim().replace("px", "") || "");
            let mobilePageBarHeight = parseInt(getComputedStyle(document.body).getPropertyValue("--mobile-pagebar-height").trim().replace("px", "") || "");
            const mobilePriceBarHeight = parseInt(getComputedStyle(document.body).getPropertyValue("--mobile-pricebar-height").trim().replace("px", "") || "");
            let mobileButtonBarHeight = parseInt(getComputedStyle(document.body).getPropertyValue("--mobile-buttonbar-height").trim().replace("px", "") || "");
            if (printess.showMobileTabNavigation() && uih_currentState === "document") {
                mobileButtonBarHeight = 100;
            }
            if (printess.pageNavigationDisplay() === "icons") {
                mobilePageBarHeight = 100;
            }
            if (mobileButtonBarHeight > 15) {
                if (document.body.classList.contains("no-mobile-button-bar")) {
                    debugger;
                }
            }
            const printessDiv = document.getElementById("desktop-printess-container");
            if (printessDiv) {
                const viewPortHeight = uih_viewportHeight ? uih_viewportHeight : window.visualViewport ? window.visualViewport.height : window.innerHeight;
                const viewPortWidth = uih_viewportWidth ? uih_viewportWidth : window.visualViewport ? window.visualViewport.width : window.innerWidth;
                const viewPortTopOffset = uih_viewportOffsetTop;
                const mobileUiHeight = (mobileButtonBarHeight + controlHostHeight + 2);
                let printessHeight = viewPortHeight - mobileUiHeight;
                let printessTop = viewPortTopOffset;
                const isInEddiMode = printess.isSoftwareKeyBoardExpanded() || (uih_currentProperties.length === 1 && uih_currentProperties[0].kind === "selection-text-style");
                let showToolBar = false;
                let showPageBar = false;
                let showPriceBar = false;
                const toolBar = document.querySelector(".mobile-navbar");
                const pageBar = document.querySelector(".mobile-pagebar");
                const priceBar = document.querySelector(".mobile-pricebar");
                const priceBarOpener = document.querySelector(".mobile-price-display-opener");
                if (pageBar && printess.pageNavigationDisplay() === "icons") {
                    pageBar.style.height = mobilePageBarHeight + "px";
                }
                const hidePageAndToolbar = (printessHeight < 450 && controlHostHeight > 80) || isInEddiMode || viewPortTopOffset > 1;
                showToolBar = !hidePageAndToolbar || printess.neverHideMobileToolbar();
                showPageBar = !hidePageAndToolbar;
                showPriceBar = !hidePageAndToolbar;
                if (toolbar && showToolBar) {
                    printessTop += mobileNavBarHeight;
                    printessHeight -= mobileNavBarHeight;
                }
                if (pageBar && showPageBar) {
                    printessTop += mobilePageBarHeight;
                    printessHeight -= mobilePageBarHeight;
                }
                if (priceBar && showPriceBar) {
                    printessTop += mobilePriceBarHeight;
                    printessHeight -= mobilePriceBarHeight;
                }
                if (priceBar && uih_mobilePriceDisplay === "closed") {
                    printessTop -= mobilePriceBarHeight;
                    printessHeight += mobilePriceBarHeight;
                }
                const activeFFId = getActiveFormFieldId();
                const focusSelection = printess.getZoomMode() === "frame";
                if ((focusSelection && activeFFId !== uih_lastFormFieldId) || uih_lastZoomMode !== printess.getZoomMode() || uih_lastMobileUiHeight !== mobileUiHeight || printessTop !== uih_lastPrintessTop || printessHeight !== uih_lastPrintessHeight || viewPortWidth !== uih_lastPrintessWidth) {
                    uih_lastMobileUiHeight = mobileUiHeight;
                    uih_lastPrintessTop = printessTop;
                    uih_lastPrintessHeight = printessHeight;
                    uih_lastPrintessWidth = viewPortWidth;
                    uih_lastFormFieldId = activeFFId;
                    uih_lastZoomMode = printess.getZoomMode();
                    printessDiv.style.position = "fixed";
                    printessDiv.style.left = "0";
                    printessDiv.style.right = "0";
                    printessDiv.style.width = "";
                    printessDiv.style.bottom = "";
                    printessDiv.style.height = printessHeight + "px";
                    printessDiv.style.top = printessTop + "px";
                    mobileUi.style.bottom = "";
                    mobileUi.style.top = (viewPortTopOffset + viewPortHeight - mobileUiHeight) + "px";
                    mobileUi.style.height = mobileUiHeight + "px;";
                    if (toolBar) {
                        if (showToolBar) {
                            toolBar.style.visibility = "visible";
                        }
                        else {
                            toolBar.style.visibility = "hidden";
                        }
                    }
                    if (pageBar) {
                        if (showPageBar) {
                            pageBar.style.visibility = "visible";
                        }
                        else {
                            pageBar.style.visibility = "hidden";
                        }
                    }
                    if (priceBar) {
                        if (showPriceBar) {
                            priceBar.style.visibility = "visible";
                        }
                        else {
                            priceBar.style.visibility = "hidden";
                        }
                    }
                    if (priceBarOpener) {
                        if (showPriceBar && uih_mobilePriceDisplay === "closed") {
                            priceBarOpener.classList.remove("hidden");
                        }
                        else {
                            priceBarOpener.classList.add("hidden");
                        }
                    }
                    printess.resizePrintess(true, focusSelection, undefined, printessHeight, focusSelection ? activeFFId : undefined);
                }
            }
        }
    }
    function getMobileButtons(printess, barContainer, propertyIdFilter, skipAutoSelect = false, fromImageSelection = false) {
        var _a, _b, _c, _d, _f, _g, _h, _j, _k, _l, _m, _o, _q, _r, _s, _t, _u, _v, _w, _x;
        const container = barContainer || document.createElement("div");
        container.className = "mobile-buttons-container";
        const scrollContainer = document.createElement("div");
        scrollContainer.className = "mobile-buttons-scroll-container";
        const buttonContainer = document.createElement("div");
        buttonContainer.className = "mobile-buttons";
        const buttons = printess.getMobileUiButtons(uih_currentProperties, propertyIdFilter || "root", true);
        if (uih_currentState === "document") {
            buttons.unshift(...printess.getMobileUiBackgroundButton());
        }
        if (printess.hasSplitterMenu() && uih_currentState !== "details") {
            const toggleLayoutButtons = printess.getMobileUiSplitterLayoutsButton();
            buttons.unshift(...toggleLayoutButtons);
            if ((toggleLayoutButtons.length && ((_a = uih_currentProperties[0]) === null || _a === void 0 ? void 0 : _a.kind) === "image") || ((_b = uih_currentProperties[0]) === null || _b === void 0 ? void 0 : _b.kind) !== "image") {
                if (uih_currentProperties.filter(p => p.kind === "image").length) {
                    buttons.push(...printess.getMobileUiScissorsButtons());
                }
                buttons.push(...printess.getMobileUiSplitterGapButton());
                const isImageProperty = uih_currentProperties.length === 1 && uih_currentProperties[0].kind === "image";
                const convertButton = isImageProperty ? printess.getMobileUiSplitterToTextButton() : printess.getMobileUiSplitterToImageButton();
                buttons.push(...convertButton);
            }
            else {
                if (printess.hasScissorMenu() !== "never") {
                    if (uih_currentProperties.filter(p => p.kind === "image").length) {
                        buttons.push(...printess.getMobileUiScissorsButtons());
                    }
                }
            }
        }
        const dataTableIdx = buttons.findIndex(b => b.newState.state === "table-edit");
        const pid = (_f = (_d = (_c = buttons[dataTableIdx]) === null || _c === void 0 ? void 0 : _c.newState) === null || _d === void 0 ? void 0 : _d.externalProperty) === null || _f === void 0 ? void 0 : _f.id;
        if (dataTableIdx !== -1 && pid && printess.isDataSource(pid)) {
            const recordNavigationArrows = printess.getMobileUiRecordNavigationArrows();
            buttons.splice(dataTableIdx, 0, recordNavigationArrows[0]);
            buttons.splice(dataTableIdx + 2, 0, recordNavigationArrows[1]);
        }
        const hasButtons = buttons.length > 0;
        if ((printess.spreadCount() > 1 && printess.pageNavigationDisplay() === "numbers") || (printess.pageNavigationDisplay() === "icons")) {
            renderPageNavigation(printess, getMobilePageBarDiv(), false, true);
        }
        else {
            const pagebar = document.querySelector(".mobile-pagebar");
            if (pagebar)
                pagebar.remove();
        }
        getMobilePriceBarDiv(printess);
        if (uih_currentPriceDisplay) {
            document.body.classList.add("has-mobile-price-bar");
        }
        else {
            document.body.classList.remove("has-mobile-price-bar");
        }
        let autoSelect = null;
        let autoSelectHasMeta = false;
        let firstButton = null;
        const ep = (_h = (_g = buttons[0]) === null || _g === void 0 ? void 0 : _g.newState) === null || _h === void 0 ? void 0 : _h.externalProperty;
        if (ep && buttons.length === 1 && skipAutoSelect !== true) {
            if (ep.kind === "image") {
                autoSelect = buttons[0];
            }
            if (ep.kind === "single-line-text") {
                autoSelect = buttons[0];
            }
            autoSelectHasMeta = printess.hasMetaProperties(ep);
        }
        if (!hasButtons || (autoSelect && autoSelectHasMeta === false)) {
            document.body.classList.add("no-mobile-button-bar");
        }
        else {
            document.body.classList.remove("no-mobile-button-bar");
        }
        if (hasButtons && (!autoSelect || autoSelectHasMeta === true)) {
            let controlGroup = 0;
            for (const b of buttons) {
                const selectScaleButton = b.newState.metaProperty === "image-scale" && ((_k = (_j = b.newState.externalProperty) === null || _j === void 0 ? void 0 : _j.imageMeta) === null || _k === void 0 ? void 0 : _k.canScale) && ((_l = b.newState.externalProperty) === null || _l === void 0 ? void 0 : _l.value) !== ((_o = (_m = b.newState.externalProperty) === null || _m === void 0 ? void 0 : _m.validation) === null || _o === void 0 ? void 0 : _o.defaultValue);
                const buttonDiv = document.createElement("div");
                buttonDiv.className = "no-selection";
                if (b.hide) {
                    buttonDiv.style.display = "none";
                }
                if (pid && printess.isDataSource(pid)) {
                    if (((_q = b.newState.externalProperty) === null || _q === void 0 ? void 0 : _q.kind) === "record-left-button" || b.newState.state === "table-edit") {
                        buttonDiv.style.marginRight = "5px";
                        if (!printess.isPropertyVisible(pid)) {
                            buttonDiv.style.display = "none";
                        }
                    }
                }
                const properties = [];
                if (b.newState.externalProperty && b.newState.externalProperty.kind === "label" && !b.newState.externalProperty.info) {
                    continue;
                }
                if (b.newState.externalProperty && b.newState.externalProperty.controlGroup > 0 && b.newState.externalProperty.controlGroup === controlGroup) {
                    continue;
                }
                else {
                    if (b.newState.externalProperty && b.newState.externalProperty.controlGroup) {
                        controlGroup = b.newState.externalProperty.controlGroup;
                        if (controlGroup > 0) {
                            buttons.forEach(p => {
                                if (p.newState.externalProperty && p.newState.externalProperty.controlGroup === controlGroup) {
                                    properties.push(p.newState.externalProperty);
                                }
                            });
                        }
                    }
                    else {
                        controlGroup = 0;
                    }
                }
                if (selectScaleButton && !autoSelect && fromImageSelection) {
                    autoSelect = b;
                    buttonDiv.classList.add("selected");
                }
                if (b.newState.tableRowIndex !== undefined) {
                    buttonDiv.id = ((_s = (_r = b.newState.externalProperty) === null || _r === void 0 ? void 0 : _r.id) !== null && _s !== void 0 ? _s : "") + "$$$" + b.newState.tableRowIndex;
                }
                else {
                    buttonDiv.id = ((_u = (_t = b.newState.externalProperty) === null || _t === void 0 ? void 0 : _t.id) !== null && _u !== void 0 ? _u : "") + ":" + ((_v = b.newState.metaProperty) !== null && _v !== void 0 ? _v : "");
                }
                if (printess.isTextButton(b) || controlGroup > 0) {
                    buttonDiv.classList.add("mobile-property-text");
                }
                else {
                    buttonDiv.classList.add("mobile-property-button");
                    if (((_w = b.newState.externalProperty) === null || _w === void 0 ? void 0 : _w.kind) === "font") {
                        buttonDiv.classList.add("mobile-font-button");
                    }
                    else if (b.newState.state === "table-edit" && pid && printess.isDataSource(pid)) {
                        buttonDiv.classList.add("mobile-table-button");
                    }
                }
                if (!firstButton) {
                    firstButton = buttonDiv;
                }
                buttonDiv.onclick = () => {
                    mobileUiButtonClick(printess, b, buttonDiv, container, false, properties);
                };
                const externalPropertyKinds = ["background-button", "record-left-button", "record-right-button", "horizontal-scissor", "vertical-scissor", "splitter-layouts-button", "grid-gap-button", "convert-to-image", "convert-to-text"];
                if (b.newState.state === "off-canvas") {
                    const buttonCircle = getButtonCircle(printess, b, false);
                    const caption = printess.gl(b.caption).replace(/\\n/g, "");
                    const buttonText = document.createElement("div");
                    buttonText.className = "mobile-property-caption no-selection";
                    buttonText.innerText = caption;
                    buttonDiv.appendChild(buttonCircle);
                    buttonDiv.appendChild(buttonText);
                }
                else if (b.newState.externalProperty && externalPropertyKinds.includes(b.newState.externalProperty.kind)) {
                    drawButtonContent(printess, buttonDiv, [b.newState.externalProperty], controlGroup);
                }
                else if (controlGroup > 0) {
                    drawButtonContent(printess, buttonDiv, properties, controlGroup);
                }
                else {
                    drawButtonContent(printess, buttonDiv, uih_currentProperties, controlGroup);
                }
                buttonContainer.appendChild(buttonDiv);
            }
        }
        if (((_x = uih_lastMobileState === null || uih_lastMobileState === void 0 ? void 0 : uih_lastMobileState.externalProperty) === null || _x === void 0 ? void 0 : _x.kind) === "selection-text-style") {
            const meta = uih_lastMobileState === null || uih_lastMobileState === void 0 ? void 0 : uih_lastMobileState.metaProperty;
            if (meta && !printess.isSoftwareKeyBoardExpanded()) {
                for (const b of buttons) {
                    if (meta === b.newState.metaProperty) {
                        autoSelect = b;
                    }
                }
            }
        }
        if (autoSelect) {
            uih_autoSelectPending = true;
            window.setTimeout(() => {
                var _a, _b, _c, _d, _f, _g;
                uih_autoSelectPending = false;
                const b = autoSelect;
                if (!b)
                    return;
                if (((_a = b.newState.externalProperty) === null || _a === void 0 ? void 0 : _a.kind) === "background-button") {
                    printess.selectBackground();
                }
                else if (autoSelectHasMeta) {
                    let bid;
                    if (b.newState.tableRowIndex !== undefined) {
                        bid = ((_c = (_b = b.newState.externalProperty) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : "") + "$$$" + b.newState.tableRowIndex;
                    }
                    else {
                        bid = ((_f = (_d = b.newState.externalProperty) === null || _d === void 0 ? void 0 : _d.id) !== null && _f !== void 0 ? _f : "") + ":" + ((_g = b.newState.metaProperty) !== null && _g !== void 0 ? _g : "");
                    }
                    const buttonDiv = (document.getElementById(bid));
                    if (buttonDiv) {
                        mobileUiButtonClick(printess, b, buttonDiv, container, true);
                    }
                    else {
                        console.error("Auto-Click Button not found: " + bid);
                    }
                }
                else {
                    printess.setZoomMode("spread");
                    renderMobileControlHost(printess, b.newState);
                }
            }, 50);
        }
        const scrollRight = document.createElement("div");
        scrollRight.className = "scroll-right-indicator";
        scrollContainer.appendChild(buttonContainer);
        container.appendChild(scrollContainer);
        container.appendChild(scrollRight);
        if (firstButton && (autoSelect || printess.isSoftwareKeyBoardExpanded())) {
            firstButton.style.transition = "none";
        }
        window.setTimeout(() => {
            var _a, _b, _c;
            if (firstButton) {
                const containerWidth = container.offsetWidth;
                const buttonsWidth = buttonContainer.offsetWidth + 15 - (containerWidth * 1.45);
                const space = (containerWidth - buttonsWidth) / 2;
                if (buttonsWidth > containerWidth || space < 15) {
                    firstButton.style.marginLeft = "15px";
                    container.classList.add("scroll-right");
                    scrollContainer.onscroll = () => {
                        if (scrollContainer.scrollLeft > buttonContainer.offsetWidth - (container.offsetWidth * 1.45)) {
                            container.classList.remove("scroll-right");
                        }
                        else {
                            container.classList.add("scroll-right");
                        }
                    };
                }
                else {
                    firstButton.style.marginLeft = space + "px";
                }
                const b = buttons.filter(b => { var _a; return ((_a = b.newState.externalProperty) === null || _a === void 0 ? void 0 : _a.kind) === "image"; })[0];
                if (b && ((_b = (_a = b.newState.externalProperty) === null || _a === void 0 ? void 0 : _a.validation) === null || _b === void 0 ? void 0 : _b.defaultValue) === ((_c = b.newState.externalProperty) === null || _c === void 0 ? void 0 : _c.value) && printess.hasSplitterMenu()) {
                    if (firstButton && firstButton.id === "splitterLayoutButton:") {
                        firstButton = firstButton.nextSibling;
                    }
                    if (firstButton) {
                        mobileUiButtonClick(printess, b, firstButton, container, false, uih_currentProperties, true);
                    }
                }
            }
        }, 50);
        return { div: container, autoSelectButton: autoSelect };
    }
    function selectButtonDiv(buttonDiv) {
        document.querySelectorAll(".mobile-property-button.selected").forEach((ele) => ele.classList.remove("selected"));
        document.querySelectorAll(".mobile-property-text").forEach((ele) => ele.classList.remove("selected"));
        buttonDiv.classList.toggle("selected");
    }
    function mobileUiButtonClick(printess, b, buttonDiv, container, fromAutoSelect, properties, fromSplitterImageButton = false) {
        var _a, _b, _c, _d, _f, _g, _h, _j, _k, _l, _m, _o, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3;
        return __awaiter(this, void 0, void 0, function* () {
            printess.setZoomMode("spread");
            let hadSelectedButtons = false;
            const selectImageZoomButton = fromAutoSelect && ((_a = b.newState.externalProperty) === null || _a === void 0 ? void 0 : _a.kind) === "image" && ((_b = b.newState.externalProperty) === null || _b === void 0 ? void 0 : _b.value) !== ((_d = (_c = b.newState.externalProperty) === null || _c === void 0 ? void 0 : _c.validation) === null || _d === void 0 ? void 0 : _d.defaultValue) && ((_g = (_f = b.newState.externalProperty) === null || _f === void 0 ? void 0 : _f.imageMeta) === null || _g === void 0 ? void 0 : _g.canScale);
            if (b.newState.state === "off-canvas") {
                if (uih_currentProperties) {
                    const propsDiv = document.createElement("div");
                    propsDiv.classList.add("desktop-properties");
                    getProperties(printess, "frames", uih_currentProperties.filter(p => printess.isOffCanvasProperty(p)), propsDiv);
                    const button = document.createElement("button");
                    button.innerText = printess.gl("ui.buttonClose");
                    button.classList.add("btn");
                    button.classList.add("btn-primary");
                    button.addEventListener("click", () => {
                        hideModal("desktop-properties-off-canvas");
                    });
                    propsDiv.appendChild(button);
                    showModal(printess, "desktop-properties-off-canvas", propsDiv, printess.gl("ui.edit"));
                }
            }
            else if (((_h = b.newState.externalProperty) === null || _h === void 0 ? void 0 : _h.kind) === "background-button") {
                printess.selectBackground();
            }
            else if (((_j = b.newState.externalProperty) === null || _j === void 0 ? void 0 : _j.kind) === "record-left-button" || ((_k = b.newState.externalProperty) === null || _k === void 0 ? void 0 : _k.kind) === "record-right-button") {
                const prop = b.newState.externalProperty;
                const tableProp = uih_currentProperties.filter(p => p.kind === "table")[0];
                let data = [];
                try {
                    data = JSON.parse(tableProp.value.toString()) || [];
                    if (!Array.isArray(data)) {
                        data = [];
                    }
                }
                catch (error) {
                    data = [];
                }
                if (data.length > 0) {
                    tableEditRowIndex = tableEditRowIndex === -1 ? printess.getTableRowIndex(prop.id) : tableEditRowIndex;
                    if (prop.kind === "record-left-button" && tableEditRowIndex > 0) {
                        tableEditRowIndex--;
                        printess.setTableRowIndex(tableProp.id, tableEditRowIndex);
                    }
                    else if (prop.kind === "record-right-button" && tableEditRowIndex < data.length - 1) {
                        tableEditRowIndex++;
                        printess.setTableRowIndex(tableProp.id, tableEditRowIndex);
                    }
                }
                const recordButton = document.getElementById("printess-table-record");
                if (recordButton) {
                    recordButton.innerHTML = printess.gl("ui.recordCaption", (tableEditRowIndex + 1).toString(), data.length);
                }
                selectButtonDiv(buttonDiv);
                return;
            }
            else if (((_l = b.newState.externalProperty) === null || _l === void 0 ? void 0 : _l.kind) === "table") {
                printess.clearSelection();
                const prop = uih_currentProperties.filter(p => b.newState.externalProperty && p.id === b.newState.externalProperty.id)[0];
                selectButtonDiv(buttonDiv);
                const content = document.createElement("div");
                content.id = "mobileTableDialog";
                content.appendChild(getPropertyControl(printess, prop, undefined, true));
                const caption = ((_m = uih_currentTabs.filter(t => t.id === prop.tabId)[0]) === null || _m === void 0 ? void 0 : _m.caption) || prop.label;
                renderMobileDialogFullscreen(printess, prop.id, caption || "table", content, false);
                return;
            }
            else if (((_o = b.newState.externalProperty) === null || _o === void 0 ? void 0 : _o.kind) === "label" && b.newState.externalProperty.info) {
                collapseControlHost();
                resizeMobileUi(printess);
                selectButtonDiv(buttonDiv);
                const content = document.createElement("div");
                content.appendChild(getPropertyControl(printess, b.newState.externalProperty, undefined, true));
                renderMobileDialogFullscreen(printess, b.newState.externalProperty.id, "ui.infoFrame", content, false);
                return;
            }
            else if (((_q = b.newState.externalProperty) === null || _q === void 0 ? void 0 : _q.kind) === "convert-to-text" || ((_r = b.newState.externalProperty) === null || _r === void 0 ? void 0 : _r.kind) === "convert-to-image") {
                collapseControlHost();
                resizeMobileUi(printess);
                selectButtonDiv(buttonDiv);
                if (b.newState.externalProperty.kind === "convert-to-image") {
                    printess.convertSplitterCellToImage();
                }
                else {
                    printess.convertSplitterCellToText();
                    const prop = uih_currentProperties[0];
                    const content = getSplitterSnippetsControl(printess, prop);
                    renderMobileDialogFullscreen(printess, prop.id, "ui.changeLayout", content, false);
                }
                return;
            }
            else if (((_s = b.newState.externalProperty) === null || _s === void 0 ? void 0 : _s.kind) === "splitter-layouts-button") {
                collapseControlHost();
                resizeMobileUi(printess);
                selectButtonDiv(buttonDiv);
                const prop = uih_currentProperties[0];
                const content = getSplitterSnippetsControl(printess, prop);
                renderMobileDialogFullscreen(printess, prop.id, "ui.changeLayout", content, false);
                return;
            }
            else if (((_t = b.newState.externalProperty) === null || _t === void 0 ? void 0 : _t.kind) === "horizontal-scissor") {
                collapseControlHost();
                resizeMobileUi(printess);
                selectButtonDiv(buttonDiv);
                yield printess.splitFrame("vertical");
                if (printess.hasScissorMenu() === "never" || printess.hasScissorMenu() === "horizontical") {
                    buttonDiv.remove();
                }
                return;
            }
            else if (((_u = b.newState.externalProperty) === null || _u === void 0 ? void 0 : _u.kind) === "vertical-scissor") {
                collapseControlHost();
                resizeMobileUi(printess);
                selectButtonDiv(buttonDiv);
                yield printess.splitFrame("horizontal");
                if (printess.hasScissorMenu() === "never" || printess.hasScissorMenu() === "vertical") {
                    buttonDiv.remove();
                }
                return;
            }
            else if (((_v = b.newState.externalProperty) === null || _v === void 0 ? void 0 : _v.kind) === "image" && b.newState.metaProperty === "handwriting-image") {
                printess.removeHandwritingImage();
                return;
            }
            else if (b.newState.state === "table-edit") {
                const p = b.newState.externalProperty;
                const rowIndex = (_w = b.newState.tableRowIndex) !== null && _w !== void 0 ? _w : -1;
                document.querySelectorAll(".mobile-property-button").forEach((ele) => ele.classList.remove("selected"));
                buttonDiv.classList.toggle("selected");
                centerMobileButton(buttonDiv);
                if ((p === null || p === void 0 ? void 0 : p.tableMeta) && (rowIndex !== null && rowIndex !== void 0 ? rowIndex : -1) >= 0) {
                    try {
                        const data = JSON.parse(p.value.toString());
                        tableEditRow = data[rowIndex];
                        tableEditRowIndex = rowIndex;
                        printess.setTableRowIndex(p.id, rowIndex);
                        renderMobileControlHost(printess, b.newState);
                        getMobileUiDiv().appendChild(getMobilePropertyNavButtons(printess, "document", fromAutoSelect, willHaveControlHost(b.newState)));
                    }
                    catch (error) {
                        console.error("property table has no array data:" + p.id);
                    }
                }
            }
            else if (b.hasCollapsedMetaProperties === true && b.newState.externalProperty) {
                uih_currentState = "details";
                const buttonContainer = document.querySelector(".mobile-buttons-container");
                if (buttonContainer) {
                    buttonContainer.innerHTML = "";
                    getMobileButtons(printess, container, b.newState.externalProperty.id);
                    const backButton = document.querySelector(".mobile-property-back-button");
                    if (backButton) {
                        (_x = backButton.parentElement) === null || _x === void 0 ? void 0 : _x.removeChild(backButton);
                    }
                    const mobilePlusButton = document.querySelector(".mobile-property-plus-button");
                    if (mobilePlusButton) {
                        (_y = mobilePlusButton.parentElement) === null || _y === void 0 ? void 0 : _y.removeChild(mobilePlusButton);
                    }
                    getMobileUiDiv().appendChild(getMobilePropertyNavButtons(printess, "details", fromAutoSelect, willHaveControlHost(b.newState)));
                    if (!fromAutoSelect) {
                        printess.setZoomMode("frame");
                    }
                    if (selectImageZoomButton) {
                        window.setTimeout(() => {
                            var _a, _b, _c, _d;
                            const bid = ((_b = (_a = b.newState.externalProperty) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : "") + ":image-scale";
                            const buttonDiv = (document.getElementById(bid));
                            if (buttonDiv) {
                                buttonDiv.classList.toggle("selected");
                                buttonDiv.innerHTML = "";
                                properties = properties && properties.length > 0 ? properties : uih_currentProperties;
                                drawButtonContent(printess, buttonDiv, properties, ((_c = b.newState.externalProperty) === null || _c === void 0 ? void 0 : _c.controlGroup) || 0);
                                if (((_d = b.newState.externalProperty) === null || _d === void 0 ? void 0 : _d.kind) === "image" && (printess.canMoveSelectedFrames() || printess.canSplitSelectedFrames())) {
                                    printess.setZoomMode("spread");
                                }
                                else {
                                    printess.setZoomMode("frame");
                                }
                            }
                        }, 10);
                        b.newState = Object.assign(Object.assign({}, b.newState), { metaProperty: "image-scale" });
                    }
                }
            }
            else if (b.newState.externalProperty && b.newState.externalProperty.kind === "checkbox") {
                const id = b.newState.externalProperty.id;
                const value = b.newState.externalProperty.value;
                printess.setProperty(id, value === "true" ? "false" : "true").then(() => setPropertyVisibilities(printess));
                b.newState.externalProperty.value = value === "true" ? "false" : "true";
                drawButtonContent(printess, buttonDiv, [b.newState.externalProperty], b.newState.externalProperty.controlGroup);
                printess.setZoomMode("spread");
                collapseControlHost();
                resizeMobileUi(printess);
                const sels = document.querySelectorAll(".mobile-property-button.selected");
                sels.forEach((ele) => ele.classList.remove("selected"));
                document.querySelectorAll(".mobile-property-text").forEach((ele) => ele.classList.remove("selected"));
                buttonDiv.classList.toggle("selected");
                centerMobileButton(buttonDiv);
                return;
            }
            else {
                const sels = document.querySelectorAll(".mobile-property-button.selected");
                hadSelectedButtons = sels.length > 0;
                sels.forEach((ele) => ele.classList.remove("selected"));
                document.querySelectorAll(".mobile-property-text").forEach((ele) => ele.classList.remove("selected"));
                buttonDiv.classList.toggle("selected");
                buttonDiv.innerHTML = "";
                if (b.newState.externalProperty && b.newState.externalProperty.controlGroup > 0) {
                    properties = properties || uih_currentProperties;
                }
                else if (b.newState.externalProperty) {
                    properties = [b.newState.externalProperty];
                }
                else {
                    properties = uih_currentProperties;
                }
                drawButtonContent(printess, buttonDiv, properties, ((_z = b.newState.externalProperty) === null || _z === void 0 ? void 0 : _z.controlGroup) || 0);
                if (!fromSplitterImageButton) {
                    centerMobileButton(buttonDiv);
                }
                if (((_0 = b.newState.externalProperty) === null || _0 === void 0 ? void 0 : _0.kind) === "image" && (printess.canMoveSelectedFrames() || printess.canSplitSelectedFrames()) || ((_1 = b.newState.externalProperty) === null || _1 === void 0 ? void 0 : _1.kind) === "grid-gap-button") {
                    printess.setZoomMode("spread");
                }
                else {
                    printess.setZoomMode("frame");
                }
                const backButton = document.querySelector(".mobile-property-back-button");
                if (backButton) {
                    (_2 = backButton.parentElement) === null || _2 === void 0 ? void 0 : _2.removeChild(backButton);
                }
                getMobileUiDiv().appendChild(getMobilePropertyNavButtons(printess, uih_currentState, fromAutoSelect, willHaveControlHost(b.newState)));
                if (((_3 = b.newState.externalProperty) === null || _3 === void 0 ? void 0 : _3.kind) === "selection-text-style" && !hadSelectedButtons) {
                    window.setTimeout(() => {
                        renderMobileControlHost(printess, b.newState);
                    }, 500);
                    return;
                }
            }
            renderMobileControlHost(printess, b.newState, properties);
        });
    }
    function willHaveControlHost(state) {
        if (state.externalProperty) {
            return true;
        }
        return false;
    }
    function renderMobileControlHost(printess, state, properties) {
        collapseControlHost();
        const controlHost = document.getElementById("mobile-control-host");
        uih_lastMobileState = state;
        if (controlHost) {
            controlHost.style.overflow = "hidden auto";
            if (state.externalProperty) {
                controlHost.classList.add(getMobileControlHeightClass(printess, state.externalProperty, state.metaProperty));
                if (state.state === "table-edit") {
                    return;
                }
                else {
                    if (properties && properties.length > 0 && properties[0].controlGroup > 0) {
                        controlHost.style.overflow = "auto";
                        getProperties(printess, uih_currentState, properties, controlHost);
                    }
                    else {
                        if (state.externalProperty.kind === "image" && state.metaProperty === "handwriting-image")
                            return;
                        const control = getPropertyControl(printess, state.externalProperty, state.metaProperty, true);
                        controlHost.appendChild(control);
                    }
                }
                const close = getMobileNavButton({
                    name: "closeHost",
                    icon: printess.getIcon("carret-down-solid"),
                    task: () => {
                        printess.setZoomMode("spread");
                        collapseControlHost();
                        resizeMobileUi(printess);
                        const mobileBtns = document.querySelector(".mobile-buttons");
                        if (mobileBtns) {
                            mobileBtns.childNodes.forEach(b => b.classList.remove("selected"));
                        }
                    }
                }, true);
                close.classList.add("close-control-host-button");
                const mobileUi = document.querySelector(".mobile-ui");
                if (mobileUi) {
                    if (!document.body.classList.contains("no-mobile-button-bar")) {
                        mobileUi.appendChild(close);
                    }
                }
                resizeMobileUi(printess);
            }
        }
    }
    function collapseControlHost() {
        const controlHost = document.getElementById("mobile-control-host");
        const mobileUi = document.querySelector(".mobile-ui");
        if (mobileUi) {
            const closeButton = mobileUi.querySelector(".close-control-host-button");
            if (closeButton) {
                mobileUi.removeChild(closeButton);
            }
        }
        if (controlHost) {
            controlHost.classList.remove("mobile-control-sm");
            controlHost.classList.remove("mobile-control-md");
            controlHost.classList.remove("mobile-control-lg");
            controlHost.classList.remove("mobile-control-xl");
            controlHost.classList.remove("mobile-control-xxl");
            controlHost.innerHTML = "";
        }
    }
    function getMobileControlHeightClass(printess, property, meta) {
        switch (property.kind) {
            case "image":
            case "image-id":
                return "mobile-control-md";
            case "selection-text-style":
                return "mobile-control-lg";
            case "multi-line-text":
                if (!meta || meta === "text-style-color" || meta === "text-style-font" || meta === "text-style-size" || meta === "text-style-line-height" || meta === "text-style-vAlign-hAlign") {
                    if (window.navigator.appVersion.match(/iP(ad|od|hone).*15_0/)) {
                        return "mobile-control-xl";
                    }
                    else {
                        return "mobile-control-lg";
                    }
                }
                break;
            case "select-list":
            case "tab-list":
            case "select-list+info":
                if (property.controlGroup > 0) {
                    return "mobile-control-md";
                }
                else {
                    return "mobile-control-lg";
                }
            case "color":
            case "image-list":
            case "color-list":
            case "font":
                return "mobile-control-lg";
            case "text-area":
                if (window.navigator.appVersion.match(/iP(ad|od|hone).*15_0/)) {
                    return "mobile-control-xl";
                }
                else {
                    return "mobile-control-lg";
                }
            case "table":
                return "mobile-control-xl";
            case "single-line-text":
                if (property.controlGroup > 0) {
                    return "mobile-control-md";
                }
                else if (window.navigator.appVersion.match(/iP(ad|od|hone).*15_0/)) {
                    return "mobile-control-sm";
                }
                else {
                    return "mobile-control-sm";
                }
            case "label":
                if (property.info) {
                    return "mobile-control-lg";
                }
                else {
                    return "mobile-control-sm";
                }
        }
        return "mobile-control-sm";
    }
    function drawButtonContent(printess, buttonDiv, properties, controlGroup) {
        var _a, _b, _c;
        const id = buttonDiv.id.split(":");
        let propertyId = id[0];
        let rowIndex = undefined;
        if (propertyId.startsWith("FF") && propertyId.indexOf("$$$") > 0) {
            const tId = propertyId.split("$$$");
            propertyId = tId[0];
            rowIndex = isNaN(+tId[1]) ? undefined : +tId[1];
        }
        const metaProperty = (_a = id[1]) !== null && _a !== void 0 ? _a : "";
        const property = properties.filter(p => p.id === propertyId)[0];
        if (!property)
            return;
        const buttons = printess.getMobileUiButtons([property], propertyId, true);
        let b = undefined;
        if (rowIndex !== undefined) {
            for (const button of buttons) {
                if (button.newState.tableRowIndex === rowIndex) {
                    b = button;
                    break;
                }
            }
        }
        else {
            for (const button of buttons) {
                if (((_b = button.newState.metaProperty) !== null && _b !== void 0 ? _b : "") === metaProperty) {
                    b = button;
                    break;
                }
            }
        }
        if (!b)
            return;
        const isSelected = buttonDiv.classList.contains("selected");
        buttonDiv.innerHTML = "";
        if (printess.isTextButton(b) || controlGroup > 0) {
            let caption = "";
            if (property.controlGroup > 0 && properties && properties.length > 0 && properties[0].id.startsWith("FF")) {
                const idx = uih_currentProperties.findIndex(p => p.id === properties[0].id);
                const prevProperty = idx ? uih_currentProperties[idx - 1] : undefined;
                if (prevProperty && prevProperty.kind === "label" && !prevProperty.info) {
                    caption = prevProperty.label;
                }
            }
            if (controlGroup > 0 && !caption) {
                for (const p of properties) {
                    caption += p.label + " ";
                }
            }
            else if (!caption) {
                if (printess.hasSplitterMenu()) {
                    caption = ((_c = b.newState.externalProperty) === null || _c === void 0 ? void 0 : _c.value.toString()) || printess.gl("ui.text");
                }
                else {
                    caption = printess.gl(b.caption);
                }
            }
            const buttonText = document.createElement("div");
            buttonText.className = "text";
            buttonText.innerText = caption;
            const buttonIcon = document.createElement("div");
            buttonIcon.className = "icon";
            buttonIcon.innerText = "T";
            buttonDiv.appendChild(buttonText);
            buttonDiv.appendChild(buttonIcon);
        }
        else {
            const buttonCircle = getButtonCircle(printess, b, isSelected);
            const caption = printess.gl(b.caption).replace(/\\n/g, "");
            const buttonText = document.createElement("div");
            buttonText.className = "mobile-property-caption no-selection";
            buttonText.innerText = caption;
            buttonDiv.appendChild(buttonCircle);
            buttonDiv.appendChild(buttonText);
        }
    }
    function getButtonCircle(printess, m, isSelected) {
        const c = printess.getButtonCircleModel(m, isSelected, true, true, true);
        const p = m.newState.externalProperty;
        const circle = document.createElement("div");
        circle.className = "circle-button-graphic";
        if (c.hasSvgCircle) {
            circle.appendChild(getSvgCircle(c.displayGauge, c.gaugeValue));
        }
        if (c.hasImage) {
            const image = document.createElement("div");
            image.classList.add("circular-image");
            if (m.circleStyle)
                image.setAttribute("style", m.circleStyle);
            if (m.thumbCssUrl)
                image.style.backgroundImage = m.thumbCssUrl;
            circle.appendChild(image);
        }
        if (c.hasCaption) {
            const caption = document.createElement("div");
            caption.className = c.captionClass;
            caption.innerText = printess.gl(c.captionInCircle);
            circle.appendChild(caption);
        }
        if (m.newState.state === "table-edit" && p && printess.isDataSource(p.id)) {
            const tableProp = uih_currentProperties.filter(prop => p && p.id === prop.id)[0];
            let data = [];
            try {
                data = JSON.parse(tableProp.value.toString()) || [];
                if (!Array.isArray(data)) {
                    data = [];
                }
            }
            catch (error) {
                data = [];
            }
            const currentRecord = tableEditRowIndex === -1 && data.length > 0 ? "1" : (tableEditRowIndex + 1).toString();
            const maxRecord = data.length;
            const caption = document.createElement("div");
            caption.id = "printess-table-record";
            caption.className = c.captionClass;
            caption.innerHTML = printess.gl("ui.recordCaption", currentRecord, maxRecord);
            circle.appendChild(caption);
            c.hasIcon = false;
        }
        if (c.hasColor) {
            const color = document.createElement("div");
            color.classList.add("circular-color");
            color.style.backgroundColor = c.color;
            color.innerText = printess.gl(c.captionInCircle);
            if (c.color === "transparent") {
                const redLine = document.createElement("div");
                redLine.className = "red-line-for-transparent-color";
                redLine.style.top = "18px";
                redLine.style.left = "8px";
                redLine.style.width = "22px";
                color.style.border = "1px solid #555555";
                color.appendChild(redLine);
            }
            circle.appendChild(color);
        }
        if (c.hasIcon && c.icon !== "none") {
            const icon = printess.getIcon(c.icon);
            icon.classList.add("circle-button-icon");
            if ((p === null || p === void 0 ? void 0 : p.kind) === "vertical-scissor") {
                const scissorsLine = document.createElement("div");
                scissorsLine.className = "vertical-scissor-button";
                circle.appendChild(scissorsLine);
                icon.style.transform = "rotateZ(-90deg)";
            }
            if ((p === null || p === void 0 ? void 0 : p.kind) === "horizontal-scissor") {
                const scissorsLine = document.createElement("div");
                scissorsLine.className = "horizontal-scissor-button";
                circle.appendChild(scissorsLine);
            }
            if ((p === null || p === void 0 ? void 0 : p.kind) === "record-left-button" || (p === null || p === void 0 ? void 0 : p.kind) === "record-right-button") {
                icon.style.width = "25px";
                icon.style.height = "25px";
            }
            if ((p === null || p === void 0 ? void 0 : p.kind) === "splitter-layouts-button") {
                icon.classList.add("mobile-splitter-button");
            }
            if ((p === null || p === void 0 ? void 0 : p.kind) === "convert-to-image" || (p === null || p === void 0 ? void 0 : p.kind) === "convert-to-text" || m.newState.metaProperty === "handwriting-image") {
                circle.classList.add("circular-toggle-button");
            }
            circle.appendChild(icon);
        }
        return circle;
    }
    function getSvgCircle(displayGauge, gaugeValue) {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttributeNS(null, "viewBox", "0 0 36 36");
        svg.classList.add("circular-svg");
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.classList.add("circle-bg");
        path.setAttributeNS(null, "d", "M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831");
        svg.appendChild(path);
        if (displayGauge && gaugeValue !== 0) {
            const innerPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
            innerPath.classList.add("circle");
            if (gaugeValue < 0) {
                innerPath.setAttributeNS(null, "transform", "scale(-1,1) translate(-36,0)");
            }
            innerPath.setAttributeNS(null, "stroke-dasharray", Math.abs(gaugeValue) + ",100");
            innerPath.setAttributeNS(null, "d", "M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831");
            svg.appendChild(innerPath);
        }
        return svg;
    }
    function centerMobileButton(buttonDiv) {
        const eX = buttonDiv.offsetLeft;
        const scrollContainer = document.querySelector(".mobile-buttons-scroll-container");
        const mobileUi = document.querySelector(".mobile-ui");
        if (scrollContainer && mobileUi) {
            const vw = mobileUi.offsetWidth;
            scrollToLeft(scrollContainer, eX - vw / 2 + buttonDiv.offsetWidth / 2, 300);
        }
    }
    function scrollToLeft(element, to, duration, startPosition) {
        const start = startPosition !== null && startPosition !== void 0 ? startPosition : element.scrollLeft;
        const change = to - start;
        let currentTime = 0;
        const increment = 10;
        const animateScroll = function () {
            currentTime += increment;
            const val = easeInOutQuad(currentTime, start, change, duration);
            element.scrollLeft = val;
            if (currentTime < duration) {
                setTimeout(animateScroll, increment);
            }
        };
        animateScroll();
    }
    function easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1)
            return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    function getOverlay(printess, properties) {
        const isSingleLineText = properties.filter(p => p.kind === "single-line-text").length > 0;
        const isImage = properties.filter(p => p.kind === "image").length > 0;
        const isColor = properties.filter(p => p.kind === "color").length > 0;
        const hdiv = document.createElement("div");
        hdiv.style.opacity = "1";
        if (isSingleLineText) {
            const tdiv = getOverlayIcon(printess, "text", "rgba(255,100,0,1)");
            hdiv.style.border = "5px solid rgba(255,100,0,0.5)";
            hdiv.appendChild(tdiv);
        }
        else if (isImage) {
            const tdiv = getOverlayIcon(printess, "image", "rgba(0,125,255,1)");
            hdiv.style.border = "5px solid rgba(0,125,255,0.5)";
            hdiv.appendChild(tdiv);
        }
        else if (isColor) {
            const tdiv = getOverlayIcon(printess, "palette", "rgba(100,250,0,1)");
            hdiv.style.border = "5px solid rgba(100,250,0,0.5)";
            hdiv.appendChild(tdiv);
        }
        else {
            const tdiv = getOverlayIcon(printess, "cog", "rgba(200,0,100,1)");
            hdiv.style.border = "5px solid rgba(200,0,100,0.5)";
            hdiv.appendChild(tdiv);
        }
        return hdiv;
    }
    function getOverlayIcon(printess, name, color) {
        const tdiv = document.createElement("div");
        tdiv.style.position = "absolute";
        tdiv.style.top = "-16px";
        tdiv.style.left = "-16px";
        tdiv.style.backgroundColor = color;
        tdiv.style.padding = "7px";
        tdiv.style.width = "36px";
        tdiv.style.height = "36px";
        tdiv.style.borderRadius = "50%";
        const icon = printess.getIcon(name);
        icon.style.width = "22px";
        icon.style.height = "22px";
        icon.style.color = "white";
        tdiv.appendChild(icon);
        return tdiv;
    }
})();
