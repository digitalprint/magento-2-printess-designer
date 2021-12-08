define(['webcomponents-loader', 'polyfill', 'Digitalprint_PrintessDesigner/js/uiHelper'], function () {

    let printess = null;
    let bridge = null;

    return function(config) {

        window.WebComponents = window.WebComponents || {
            waitFor(cb) {
                addEventListener('WebComponentsReady', cb);
            }
        };

        require(['Digitalprint_PrintessDesigner/js/bridge'], function(Bridge) {

            window.WebComponents.waitFor(async () => {
                const printessLoader = await import('https://editor.printess.com/printess-editor/printess-editor.js');
                printess = await printessLoader.attachPrintess({
                    resourcePath: "https://editor.printess.com/printess-editor",
                    domain: "api.printess.com",
                    div: document.getElementById("desktop-printess-container"),
                    token: config.printess.shopToken,
                    basketId: config.printess.basketId,
                    shopUserId: config.printess.shopUserId,
                    showBuyerSide: true,
                    noBasketThumbnail: true,
                    templateName: config.printess.templateName,
                    singleSpreadView: true,
                    loadingDoneCallback: (spreads, title) => { bridge.loadingDone(spreads, title) },
                    selectionChangeCallback: (properties, state) => { bridge.selectionChange(properties, state) },
                    spreadChangeCallback: (groupSnippets, layoutSnippets) => { bridge.spreadChange(groupSnippets, layoutSnippets) },
                    getOverlayCallback: (properties) => { bridge.getOverlay(properties) },
                    addToBasketCallback: (saveToken, url) => { bridge.addToBasket(saveToken, url) },
                    formFieldChangedCallback: (name, value) => { bridge.formFieldChanged(name, value) },
                    refreshPaginationCallback: () => { bridge.refreshPagination() },
                    backButtonCallback: (saveToken) => { bridge.backButtonHandler(saveToken) }
                });

                bridge = new Bridge(printess, config.printess, config.variants);

                // listen to visual viewport changes to detect virtual keyboard on iOs and Android
                if (window.visualViewport) {
                    window.visualViewport.addEventListener("scroll", () => uiHelper.viewPortScroll(printess)); // safari
                    window.visualViewport.addEventListener("resize", () => uiHelper.viewPortResize(printess)); // android
                } else {
                    window.addEventListener("resize", () => uiHelper.resize(printess));
                }

            });

        })

    }
});
