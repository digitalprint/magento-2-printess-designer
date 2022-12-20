<?php

namespace Digitalprint\PrintessDesigner\Plugin\CheckoutCart;

use Magento\Checkout\Block\Cart\Item\Renderer;

class OptionList
{
    public function __construct()
    {
    }

    /**
     * @param Renderer $subject
     * @param $result
     * @return array
     */
    public function afterGetOptionList(Renderer $subject, $result): array
    {
        unset(
            $result['printess_save_token'],
            $result['printess_thumbnail_url'],
            $result['printess_product_documents'],
            $result['printess_product_price_info']
        );
        return $result;
    }
}
