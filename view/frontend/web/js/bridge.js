
define(['Digitalprint_PrintessDesigner/js/cart', 'Digitalprint_PrintessDesigner/js/store/cart'], function(Cart, CartStore) {

    function addToCart(sku, quantity, thumbnailUrl, saveToken) {

        let payload = {
            "sku": sku,
            "quantity": quantity,
            "thumbnailUrl": thumbnailUrl,
            "saveToken": saveToken
        };

        return fetch('/rest/V1/digitalprint-designer/addtocart', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
    }

    function createOffcanvas() {

        let printess = this.printess;

        document.getElementById('cartOffcanvas').addEventListener('cart.add.bs.offcanvas', function() {

            showLoader('cartOffcanvas');

            const fileName = `${CartStore.saveToken}.png`.replace(/st:/i, '');

            printess
                .renderFirstPageImage(fileName)
                .then((thumbnailUrl) => {
                    CartStore.setThumbnailUrl(thumbnailUrl);
                    return addToCart(CartStore.sku, CartStore.quantity, CartStore.thumbnailUrl, CartStore.saveToken);
                })
                .then(response => response.json())
                .then((data) => {

                    if (data.checkout_url) {
                        location.href = data.checkout_url;
                    }

                })
                .catch((msg) => {
                    console.error(msg);
                });

        });

        return new Cart('cartOffcanvas');
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

        let filteredVariants = [];
        const variants = _structuredClone(this.variants);

        for (const [name, map] of Object.entries(attributeMap)) {
            filteredVariants = variants.filter((variant) => {
                return variantHasAttribute(variant, map.code, map.value);
            });
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

    function _structuredClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    function Bridge(printess, config, variants) {

        showLoader('printessDesigner');

        this.printess = printess;
        this.config = config;

        this.variants = variants;
        this.currentVariant = null;

        this.attributeMapping = null;
        this.currentAttributeMap = null;

        this.currentGroupSnippets = [];
        this.currentLayoutSnippets = [];
        this.currentTabs = [];

        this.cartOffcanvas = createOffcanvas.call(this);

        setCurrentVariantByCode.call(this, config.variant);
        setAttributeMappingByVariant.call(this, this.currentVariant);
        setCurrentAttributeMapByVariant.call(this, this.currentVariant);

        setStartDesign.call(this, config.startDesign);

    }

    Bridge.prototype.loadingDone = function (spreads, title) {

        this.printess.resizePrintess();

        loadStartDesign.call(this);

        hideLoader('printessDesigner');

        let event = new CustomEvent('processStop');
        document.getElementById('printessDesigner').dispatchEvent(event);

        const priceDiv = document.getElementById("designerProductPrice");
        priceDiv.innerHTML = this.currentVariant.price;
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

        // remember groupSnippets for showing as add-able items
        this.currentGroupSnippets = groupSnippets;
        this.currentLayoutSnippets = layoutSnippets;
        this.currentTabs = tabs;

        const layoutSnippetsDiv = document.getElementById("layoutSnippets");
        layoutSnippetsDiv.innerHTML = "";
        layoutSnippetsDiv.appendChild(uiHelper.renderLayoutSnippets(this.printess, this.currentLayoutSnippets));
        document.querySelector(".show-layouts-button").style.visibility = this.currentLayoutSnippets.length ? "visible" : "hidden";

    }

    Bridge.prototype.getOverlay = function(properties) {
        return uiHelper.getOverlay(this.printess, properties);
    }

    Bridge.prototype.addToBasket = function(saveToken, thumbnailUrl) {

        CartStore.setSku(this.currentVariant.sku);
        CartStore.setSaveToken(saveToken);
        CartStore.setThumbnailUrl(thumbnailUrl);

        this.cartOffcanvas.show();
    }

    Bridge.prototype.formFieldChanged = function(name, value) {

        this.currentAttributeMap = updateCurrentAttributeMap.call(this, name, value);
        this.currentVariant = getVariantByAttributeMap.call(this, this.currentAttributeMap);

        const priceDiv = document.getElementById("designerProductPrice");
        priceDiv.innerHTML = this.currentVariant.price;

    }

    Bridge.prototype.refreshPagination = function () {
        window.uiHelper.refreshPagination(this.printess) ;
    }

    Bridge.prototype.backButtonHandler = function(saveToken) {
        window.history.back();
    }

    return Bridge;
});
