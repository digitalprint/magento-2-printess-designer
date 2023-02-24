
define([], function() {

    function Cart() {
        this.sku = null;
        this.quantity = 1;
        this.thumbnailUrl = null;
        this.saveToken = null;
        this.documents = null;
        this.priceInfo = null;
    }

    Cart.prototype.setSku = function(sku) {
        this.sku = sku;
    }

    Cart.prototype.getSku = function() {
        return this.sku;
    }

    Cart.prototype.setQuantity = function(quantity) {

        if (isNaN(quantity)) {
            quantity = 1;
        }

        this.quantity = quantity;
    }

    Cart.prototype.getQuantity = function() {
        return this.quantity;
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

    Cart.prototype.getThumbnailUrl = function() {
        return this.thumbnailUrl;
    }

    Cart.prototype.setSaveToken = function(saveToken) {
        this.saveToken = saveToken;
    }

    Cart.prototype.getSaveToken = function() {
        return this.saveToken;
    }

    Cart.prototype.setDocuments = function(documents) {
        this.documents = documents;
    }

    Cart.prototype.getDocuments = function() {
        return this.documents;
    }

    Cart.prototype.hasDocumentsChanged = function(documents) {
        return JSON.stringify(this.documents) !== JSON.stringify(documents);
    }

    Cart.prototype.setFormFields = function(formFields) {
        this.formFields = formFields;
    }

    Cart.prototype.getFormFields = function() {
        return this.formFields;
    }

    Cart.prototype.setPriceInfo = function(priceInfo) {
        this.priceInfo = priceInfo;
    }

    Cart.prototype.getPriceInfo = function() {
        return this.priceInfo;
    }

    return new Cart();
});
