
define([
    'Magento_Customer/js/customer-data'
], function(customerData) {

    function Invalidate() {}

    Invalidate.prototype.section = function(section) {
        customerData.invalidate([section]);
    }

    return new Invalidate();
});
