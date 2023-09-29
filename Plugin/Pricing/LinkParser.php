<?php

namespace Digitalprint\PrintessDesigner\Plugin\Pricing;

use Magento\Framework\Pricing\Render;
use Magento\Framework\Pricing\SaleableInterface;

class LinkParser
{
    public function __construct()
    {
    }

    /**
     * @param Render $subject
     * @param $result
     * @param $priceCode
     * @param SaleableInterface $saleableItem
     * @return string
     */
    public function afterRender(Render $subject, $result, $priceCode, SaleableInterface $saleableItem): string
    {
        if ($subject->getPriceRenderHandle() === 'designer_product_prices') {
            preg_match_all('/<a ((?!target)[^>])+?>/', $result, $matches);

            foreach ($matches[0] as $key => $val) {
                if (! preg_match('/target="_blank"/', $val)) {
                    $newLink = preg_replace("/<a(.*?)>/", "<a$1 target=\"_blank\">", $val);
                    $result = str_replace($val, $newLink, $result);
                }
            }
        }

        return $result;
    }
}
