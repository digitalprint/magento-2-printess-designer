define([
    'webcomponents-loader',
    'polyfill-fetch',
    'Digitalprint_PrintessDesigner/js/uiHelper'
    ], function () {

    let printess = null;
    let bridge = null;

    return function(config) {

        window.WebComponents = window.WebComponents || {
            waitFor(cb) {
                addEventListener('WebComponentsReady', cb);
            }
        };

        require([
            'Magento_Customer/js/customer-data',
            'Magento_Catalog/js/price-utils',
            'Digitalprint_PrintessDesigner/js/bridge',
            'Digitalprint_PrintessDesigner/js/postMessage'
        ], function(customerData, priceUtils, Bridge, postMessage) {

            for(let key in config.printess.priceCategoryLabels) {
                if (config.printess.priceCategoryLabels[key] !== '') {
                    config.printess.priceCategoryLabels[key] = ' + ' + priceUtils.formatPrice(config.printess.priceCategoryLabels[key], JSON.parse(config.printess.priceFormat), false);
                }
            }

            let session = customerData.get(['printessdesigner'])();

            window.WebComponents.waitFor(async () => {
                const printessLoader = await import('https://editor.printess.com/v/2.3.0/printess-editor/printess-editor.js');
                printess = await printessLoader.attachPrintess({
                    resourcePath: "https://editor.printess.com/v/2.3.0/printess-editor",
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
                    snippetPriceCategoryLabels: config.printess.snippetPriceCategoryLabels,
                    priceCategoryLabels: config.printess.priceCategoryLabels,
                    singleSpreadView: true,
                    loadingDoneCallback: (spreads, title) => { bridge.loadingDone(spreads, title) },
                    selectionChangeCallback: (properties, state) => { bridge.selectionChange(properties, state) },
                    spreadChangeCallback: (groupSnippets, layoutSnippets, tabs) => { bridge.spreadChange(groupSnippets, layoutSnippets, tabs) },
                    getOverlayCallback: (properties) => { bridge.getOverlay(properties) },
                    addToBasketCallback: (saveToken, url) => { bridge.addToBasket(saveToken, url) },
                    formFieldChangedCallback: (name, value, tag) => { bridge.formFieldChanged(name, value, tag) },
                    refreshPaginationCallback: () => { bridge.refreshPagination() },
                    backButtonCallback: (saveToken) => { bridge.backButtonHandler(saveToken) },
                    priceChangeCallback: (priceInfo) => { bridge.priceChange(priceInfo) }
                });

                bridge = new Bridge(printess, session, config.printess);

                // listen to visual viewport changes to detect virtual keyboard on iOs and Android
                if (window.visualViewport) {
                    window.visualViewport.addEventListener("scroll", () => uiHelper.viewPortScroll(printess)); // safari
                    window.visualViewport.addEventListener("resize", () => uiHelper.viewPortResize(printess)); // android
                } else {
                    window.addEventListener("resize", () => uiHelper.resize(printess));
                }

                if (config.designPicker.isEnabled) {

                    postMessage = new postMessage({
                        'path': config.designPicker.path,
                        'locale': config.designPicker.locale,
                        'client': config.designPicker.client,
                        'attributes': config.designPicker.attributes,
                        'designFormat': config.designPicker.designFormat
                    });

                }

            });

        })

    }
});
