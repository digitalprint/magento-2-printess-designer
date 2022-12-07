
define([
        'mage/template',
        'Magento_Catalog/js/price-utils',
        'Digitalprint_PrintessDesigner/js/cart',
        'Digitalprint_PrintessDesigner/js/store/cart',
        'Digitalprint_PrintessDesigner/js/store/ui'
    ], function(mageTemplate, priceUtils, Cart, CartStore, UiStore) {

    function addToCart(storeCode, sku, quantity, thumbnailUrl, saveToken, documents, priceInfo, customerToken) {

        let payload = {
            'sku': sku,
            'quantity': quantity,
            'thumbnailUrl': thumbnailUrl,
            'saveToken': saveToken,
            'documents': JSON.stringify(documents),
            'priceInfo': JSON.stringify(priceInfo)
        };

        let headers = {
            'Content-Type': 'application/json'
        }

        if (customerToken !== 'anonymous') {
            headers['Authorization'] = `Bearer ${customerToken}`
        }

        return fetch(`/rest/${storeCode}/V1/digitalprint-designer/addtocart`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(payload),
        });
    }

    function updateOrderItem(orderId, itemId, sku, quantity, thumbnailUrl, saveToken, documents, priceInfo, adminToken) {

        let payload = {
            'orderId': parseInt(orderId),
            'itemId': parseInt(itemId),
            'sku': sku,
            'qty': quantity,
            'thumbnailUrl': thumbnailUrl,
            'saveToken': saveToken,
            'documents': JSON.stringify(documents),
            'priceInfo': JSON.stringify(priceInfo)
        };

        let headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
        }

        return fetch('/rest/V1/digitalprint-designer/updateorderitem', {
            method: "POST",
            headers: headers,
            body: JSON.stringify(payload),
        });
    }

    function getProductWithVariants(storeCode, sku, session) {

        let headers = {
            'Content-Type': 'application/json'
        }

        if (session.admin_token !== null) {
            headers['Authorization'] = `Bearer ${session.admin_token}`
        }

        return fetch(`/rest/${storeCode}/V1/digitalprint-designer/product?sku=${sku}`, {
            method: 'GET',
            headers: headers
        });
    }

    function createOffcanvas() {

        let session = this.session;
        let printess = this.printess;
        let config = this.config;

        document.getElementById('cartOffcanvas').addEventListener('cart.add.bs.offcanvas', function() {

            showLoader('cartOffcanvas');

            const fileName = `${CartStore.saveToken}.png`.replace(/st:/i, '');

            printess
                .renderFirstPageImage(fileName, 'preview', 1000, 1000)
                .then((thumbnailUrl) => {
                    CartStore.setThumbnailUrl(thumbnailUrl);

                    if (config.areaCode === 'adminhtml') {
                        return updateOrderItem(config.orderId, config.itemId, CartStore.sku, CartStore.quantity, CartStore.thumbnailUrl, CartStore.saveToken, CartStore.documents, CartStore.priceInfo, session.admin_token)
                    }

                    return addToCart(config.storeCode, CartStore.sku, CartStore.quantity, CartStore.thumbnailUrl, CartStore.saveToken, CartStore.documents, CartStore.priceInfo, session.customer_token);
                })
                .then(response => response.json())
                .then((data) => {

                    if (data.redirect_url) {
                        location.href = data.redirect_url;
                    }

                })
                .catch((msg) => {
                    console.error(msg);
                });

        });

        return new Cart('cartOffcanvas', this.config.qty);
    }

     function showLoader(elm) {
         var list = document.getElementById(elm).getElementsByClassName('printess-designer-preloader-wrapper');
         if (list && list.length > 0) {
             list[0].classList.remove('hidden');
         }

    }

    function hideLoader(elm) {
         var list = document.getElementById(elm).getElementsByClassName('printess-designer-preloader-wrapper');
         if (list && list.length > 0) {
             list[0].classList.add('hidden');
         }
    }

    function setCurrentVariantByCode(code) {

        const variants = _structuredClone(this.variants);

        this.currentVariant = variants.find((variant) => {
            return variant.sku === code;
        });

        return this.currentVariant;
    }

    function setAttributeMappingByVariant(variant) {
        this.attributeMapping = [];

        variant.attributes.forEach((attribute) => {
            if (attribute.code === 'printess_form_fields' && attribute.value !== null) {
                this.attributeMapping = attribute.value;

                this.attributeMapping.map((mapping) => {
                    delete mapping.value;
                    return mapping;
                });
            }
        });

        return this.attributeMapping;
    }

    function updateCurrentAttributeMap(name, value) {

        if (null === this.currentAttributeMap) {
            return;
        }

        if (Object.keys(this.currentAttributeMap).length === 0) {
            return;
        }

        if (! Object.hasOwn(this.currentAttributeMap, name)) {
            return;
        }

        this.currentAttributeMap[name].value = value;

        return this.currentAttributeMap;

    }

    function setCurrentAttributeMapByVariant(variant) {

        this.currentAttributeMap = {};

        this.attributeMapping.forEach((map) => {
            this.currentAttributeMap[map.printess_ff_name] = getAttributeFromVariantByName(variant, map.pim_attr_name);
        });

        return this.currentAttributeMap;
    }

    function getAttributeFromVariantByName(variant, name) {

        return variant.attributes.find((attribute) => {
            return attribute.code === name;
        });

    }

    function getVariantByAttributeMap(attributeMap) {

        let filteredVariants = _structuredClone(this.variants);
        const variants = _structuredClone(this.variants);

        if (0 === Object.keys(attributeMap).length) {
            return variants[0];
        }

        for (const [name, map] of Object.entries(attributeMap)) {

            if (map) {
                filteredVariants = filteredVariants.filter((variant) => {
                    return variantHasAttribute(variant, map.code, map.value);
                });
            }
            else {
                filteredVariants = variants;
            }
        }

        return filteredVariants[0];
    }

    function variantHasAttribute(variant, attrName, attrValue) {
        let attribute = variant.attributes.find((attribute) => {
            return attribute.code === attrName && attribute.value === attrValue;
        });

        return attribute !== undefined;
    }

    function setStartDesign(startDesign) {
        this.startDesign = startDesign;
        return this.startDesign;
    }

    function loadStartDesign() {

        if (null === this.startDesign) {
            return;
        }

        this.printess.insertTemplateAsLayoutSnippet(this.startDesign.templateName, this.startDesign.templateVersion, this.startDesign.documentName, this.startDesign.mode);
    }

    function hasSpecialPrice(priceInfo) {
        return priceInfo.regular_price > priceInfo.special_price;
    }

    function updatePriceInfo(priceFormat, priceInfo) {

        let progressTmpl = mageTemplate('#designer-price-template');
        document.getElementById("designerProductPrice").innerHTML = progressTmpl({
            data: {
                has_special_price: hasSpecialPrice(priceInfo),
                regular_price: priceUtils.formatPrice(priceInfo.regular_price, JSON.parse(priceFormat), false),
                special_price: priceUtils.formatPrice(priceInfo.special_price, JSON.parse(priceFormat), false),
            }
        });

    }

    function _structuredClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    function Bridge(printess, session, config) {

        showLoader('printessDesigner');

        this.printess = printess;

        this.session = session;
        this.config = config;

        this.variants = null;
        this.currentVariant = null;

        this.attributeMapping = null;
        this.currentAttributeMap = null;

        this.currentGroupSnippets = [];
        this.currentLayoutSnippets = [];
        this.currentTabs = [];

        this.cartOffcanvas = createOffcanvas.call(this);

        setStartDesign.call(this, config.startDesign);

    }

    Bridge.prototype.loadingDone = function (spreads, title) {

        this.printess.resizePrintess();

        loadStartDesign.call(this);

        getProductWithVariants(this.config.storeCode, this.config.sku, this.session)
        .then(response => response.json())
        .then((product) => {

            this.variants = product.variants;
            setCurrentVariantByCode.call(this, this.config.variant);

            setAttributeMappingByVariant.call(this, this.currentVariant);
            setCurrentAttributeMapByVariant.call(this, this.currentVariant);

            hideLoader('printessDesigner');

            let event = new CustomEvent('processStop');
            document.getElementById('printessDesigner').dispatchEvent(event);

            updatePriceInfo.call(this, this.config.priceFormat, this.currentVariant.price_info);

            UiStore.setAppWasLoaded();

        });

    }

    Bridge.prototype.selectionChange = function(properties, state)  {

        if (!this.printess) {
            return;
        }

        if (this.printess.isMobile()) {
            // **** add mobile-ui *****
            uiHelper.renderMobileUi(this.printess, properties, state, this.currentGroupSnippets, this.currentLayoutSnippets, this.currentTabs);
            uiHelper.renderMobileNavBar(this.printess);
        } else {
            // ***** add desktop-ui *****
            const t = uiHelper.renderDesktopUi(this.printess, properties, state, this.currentGroupSnippets, this.currentLayoutSnippets, this.currentTabs);
            uiHelper.refreshUndoRedoState(this.printess);
        }

    }

    Bridge.prototype.spreadChange = function(groupSnippets, layoutSnippets, tabs) {
        this.currentGroupSnippets = groupSnippets;
        this.currentLayoutSnippets = layoutSnippets;
        this.currentTabs = tabs;
    }

    Bridge.prototype.getOverlay = function(properties) {
        return uiHelper.getOverlay(this.printess, properties);
    }

    Bridge.prototype.addToBasket = function(saveToken, thumbnailUrl) {

        CartStore.setSku(this.currentVariant.sku);
        CartStore.setSaveToken(saveToken);
        CartStore.setThumbnailUrl(thumbnailUrl);
        CartStore.setDocuments(this.printess.getBuyerFrameCountAndMarkers());

        this.cartOffcanvas.show();
    }

    Bridge.prototype.formFieldChanged = function(name, value, tag) {

        if (UiStore.isAppLoaded() && tag) {

            this.printess.persistExchangeState().then(() => {

                fetch('/rest/V1/printess/designer/geturlbytag?' + new URLSearchParams({'tag': tag }),
                {
                    method: "GET"
                })
                .then(response => response.json())
                .then((data) => {

                    if (data.url) {
                        location.href = data.url;
                    }

                })

            });

            return;

        }

        if (null === this.currentAttributeMap) {
            return;
        }

        this.currentAttributeMap = updateCurrentAttributeMap.call(this, name, value);
        this.currentVariant = getVariantByAttributeMap.call(this, this.currentAttributeMap);

        updatePriceInfo(this.config.priceFormat, this.currentVariant.price_info);

    }

    Bridge.prototype.refreshPagination = function () {
        window.uiHelper.refreshPagination(this.printess) ;
    }

    Bridge.prototype.backButtonHandler = function(saveToken) {
        window.history.back();
    }

    Bridge.prototype.priceChange = function(priceInfo) {

        CartStore.setPriceInfo(priceInfo);
    }

    return Bridge;
});
