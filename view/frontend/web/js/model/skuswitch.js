define([
    'jquery',
    'mage/utils/wrapper'
], function ($, wrapper) {
    'use strict';

    return function(targetModule){

        let reloadPrice = targetModule.prototype._reloadPrice;
        let reloadPriceWrapper = wrapper.wrap(reloadPrice, function(original){
            let result = original();
            let simpleSku = this.options.spConfig.skus[this.simpleProduct];

            if (simpleSku !== '') {
                $('div.product-info-main .sku .value').html(simpleSku);
                $('input:hidden[name="variant"]').val(simpleSku);
            }
            return result;
        });
        targetModule.prototype._reloadPrice = reloadPriceWrapper;
        return targetModule;
    };
});
