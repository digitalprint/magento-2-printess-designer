define(['webcomponents-loader', 'polyfill-fetch', 'Digitalprint_PrintessDesigner/js/uiHelper'], function () {

    let printess = null;
    let bridge = null;

    return function(config) {

        window.WebComponents = window.WebComponents || {
            waitFor(cb) {
                addEventListener('WebComponentsReady', cb);
            }
        };

        require(['Magento_Customer/js/customer-data', 'Digitalprint_PrintessDesigner/js/bridge'], function(customerData, Bridge) {

            let session = customerData.get('printessdesigner')();

            window.WebComponents.waitFor(async () => {
                const printessLoader = await import('https://editor.printess.com/v/1.3.0/printess-editor/printess-editor.js');
                printess = await printessLoader.attachPrintess({
                    resourcePath: "https://editor.printess.com/v/1.3.0/printess-editor",
                    domain: "api.printess.com",
                    div: document.getElementById("desktop-printess-container"),
                    token: config.printess.shopToken,
                    translationKey: config.printess.translationKey,
                    basketId: session.session_id || config.session.session_id,
                    shopUserId: session.customer_id,
                    showBuyerSide: true,
                    noBasketThumbnail: true,
                    templateName: config.printess.templateName,
                    mergeTemplates: config.printess.mergeTemplates,
                    formFields: config.printess.formFields,
                    singleSpreadView: true,
                    loadingDoneCallback: (spreads, title) => { bridge.loadingDone(spreads, title) },
                    selectionChangeCallback: (properties, state) => { bridge.selectionChange(properties, state) },
                    spreadChangeCallback: (groupSnippets, layoutSnippets, tabs) => { bridge.spreadChange(groupSnippets, layoutSnippets, tabs) },
                    getOverlayCallback: (properties) => { bridge.getOverlay(properties) },
                    addToBasketCallback: (saveToken, url) => { bridge.addToBasket(saveToken, url) },
                    formFieldChangedCallback: (name, value, tag) => { bridge.formFieldChanged(name, value, tag) },
                    refreshPaginationCallback: () => { bridge.refreshPagination() },
                    backButtonCallback: (saveToken) => { bridge.backButtonHandler(saveToken) }
                });

                bridge = new Bridge(printess, session, config.printess, config.variants);

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
