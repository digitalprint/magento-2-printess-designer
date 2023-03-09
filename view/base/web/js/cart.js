
define([
    'bootstrap',
    'Magento_Catalog/js/price-utils',
    'Digitalprint_PrintessDesigner/js/store/cart'
], function(bootstrap, priceUtils, CartStore) {

    let initOffCanvas = function(element) {

        const buttonCart = document.getElementById('designerAddToCart');

        buttonCart.addEventListener("click", function() {
            let event = new CustomEvent('cart.add.bs.offcanvas');
            element.dispatchEvent(event);
        });

        return new bootstrap.Offcanvas(element);
    }

    let initQuantityChanges = function() {

        const inputQuantity = document.getElementById('designerQuantity');
        const buttonDec = document.getElementById('designerQuantityDec');
        const buttonInc = document.getElementById('designerQuantityInc');

        buttonDec.addEventListener("click", function() {
            CartStore.decrement();
            inputQuantity.value = CartStore.quantity;
        });

        buttonInc.addEventListener("click", function() {
            CartStore.increment();
            inputQuantity.value = CartStore.quantity;
        });

        inputQuantity.addEventListener("input", function() {
           CartStore.setQuantity(this.value);
        });

    }

    function Cart(element, config) {

        this.element = document.getElementById(element);
        this.config = config;

        this.offCanvas = initOffCanvas(this.element);

        CartStore.setQuantity(this.config.qty);
        document.getElementById('designerQuantity').value = CartStore.getQuantity();

        initQuantityChanges();
    }

    Cart.prototype.toggle = function () {
        return this.offCanvas.toggle();
    }

    Cart.prototype.show = function () {

        const smallDevice = window.matchMedia("(max-width: 896px)");
        const classes = [
            'offcanvas-bottom', // bottom
            'offcanvas-end'     // right
        ];

        this.element.classList.remove(classes[0], classes[1]);
        if (smallDevice.matches) {
            this.element.classList.add(classes[0]);
        } else {
            this.element.classList.add(classes[1]);
        }

        return this.offCanvas.show();
    }

    Cart.prototype.toggle = function () {
        return this.offCanvas.toggle();
    }

    Cart.prototype.updateUi = function(variant) {

        document.getElementsByClassName('js-cart-title')[0].innerHTML = variant.name;
        document.getElementsByClassName('js-cart-price')[0].innerHTML = priceUtils.formatPrice(variant.prices[0].price.price, JSON.parse(this.config.priceFormat), false);
        document.getElementsByClassName('js-cart-legal-notice')[0].innerHTML = variant.legal_notice;

    }

    return Cart;
});
