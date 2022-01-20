define([
    'jquery',
    'mage/utils/wrapper'
], function ($, wrapper) {
    'use strict';

    return function(targetModule){

        let updatePrice = targetModule.prototype._UpdatePrice;
        targetModule.prototype.configurableSku = $('div.product-info-main .sku .value').html();
        let updatePriceWrapper = wrapper.wrap(updatePrice, function(original){

            let allSelected = true;
            for(let i = 0; i<this.options.jsonConfig.attributes.length;i++){
                if (!$('div.product-info-main .product-options-wrapper .swatch-attribute.' + this.options.jsonConfig.attributes[i].code).attr('data-option-selected')){
                    allSelected = false;
                }
            }
            let simpleSku = this.configurableSku;
            if (allSelected){
                let products = this._CalcProducts();
                simpleSku = this.options.jsonConfig.skus[products.slice().shift()];
            }

            $('[itemprop="sku"]').html(simpleSku);
            $('input:hidden[name="variant"]').val(simpleSku);

            return original();
        });

        targetModule.prototype._UpdatePrice = updatePriceWrapper;
        return targetModule;
    };
});
