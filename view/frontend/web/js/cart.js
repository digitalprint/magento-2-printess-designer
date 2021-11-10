
define(['bootstrap', 'Digitalprint_PrintessDesigner/js/store/cart'], function(bootstrap, CartStore) {

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

    function Cart(element) {
        this.element = document.getElementById(element);

        this.offCanvas = initOffCanvas(this.element);

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

    return Cart;
});
