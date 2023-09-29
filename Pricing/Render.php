<?php

namespace Digitalprint\PrintessDesigner\Pricing;

use InvalidArgumentException;
use Magento\Framework\Pricing\SaleableInterface;
use RuntimeException;

class Render extends \Magento\Framework\Pricing\Render
{
    /**
     * Render price
     *
     * @param string $priceCode
     * @param SaleableInterface $saleableItem
     * @param array $arguments
     * @return string
     * @throws InvalidArgumentException
     * @throws RuntimeException
     */

    public function render($priceCode, SaleableInterface $saleableItem, array $arguments = []): string
    {
        $useArguments = array_replace($this->_data, $arguments);

        $rendererPool = $this->priceLayout->getBlock('render.product.prices.designer');
        if (! $rendererPool) {
            throw new RuntimeException('Wrong Price Rendering layout configuration. Factory block is missed');
        }

        $priceRender = $rendererPool->createPriceRender($priceCode, $saleableItem, $useArguments);
        return $priceRender->toHtml();
    }
}
