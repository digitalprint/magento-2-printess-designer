
define([], function() {

    function Cart() {
        this.sku = null;
        this.quantity = 1;
        this.thumbnailUrl = null;
        this.saveToken = null;
    }

    Cart.prototype.setSku = function(sku) {
        this.sku = sku;
    }

    Cart.prototype.setQuantity = function(quantity) {

        if (isNaN(quantity)) {
            quantity = 1;
        }

        this.quantity = quantity;
    }

    Cart.prototype.decrement = function() {

        if (this.quantity > 1) {
            this.quantity--;
        }
    }

    Cart.prototype.increment = function() {
        this.quantity++;
    }

    Cart.prototype.setThumbnailUrl = function(thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }

    Cart.prototype.setSaveToken = function(saveToken) {
        this.saveToken = saveToken;
    }

    return new Cart();
});
