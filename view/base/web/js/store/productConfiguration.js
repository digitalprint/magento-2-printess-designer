
define([], function() {

    function ProductConfiguration() {
        this.width = null;
        this.height = null;
    }

    ProductConfiguration.prototype.setWidth = function(width) {
        this.width = width;
    }

    ProductConfiguration.prototype.getWidth = function() {
        return this.width;
    }

    ProductConfiguration.prototype.setHeight = function(height) {
        this.height = height;
    }

    ProductConfiguration.prototype.getHeight = function() {
        return this.height;
    }

    ProductConfiguration.prototype.setSize = function(width, height) {
        this.width = width;
        this.height = height;
    }

    ProductConfiguration.prototype.getPrintessDocumentSize = function() {
        return this.width + 'x' + this.height;
    }

    ProductConfiguration.prototype.setSizeByPrintessDocumentSize = function(documentSize) {
        let chunks = documentSize.split('x');
        chunks = chunks.map((ele) => {
            const index = ele.indexOf(',');
            if (-1 === index) {
                return ele;
            }
            return ele.substring(0, index);
        });

        this.width = chunks[0];
        this.height = chunks[1];
    }

    return new ProductConfiguration();
});
