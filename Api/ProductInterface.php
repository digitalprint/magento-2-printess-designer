<?php

namespace Digitalprint\PrintessDesigner\Api;

interface ProductInterface
{
    /**
     * Get a specific product
     *
     * @param string $sku
     * @return Data\ProductInterface
     */

    public function getProduct(string $sku);

}
