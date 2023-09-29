<?php

namespace Digitalprint\PrintessDesigner\Api;

interface ProductInterface
{
    /**
     * Get a specific product
     *
     * @param string $sku
     * @param mixed $super_attribute
     * @return Data\ProductInterface
     */
    public function getProduct(string $sku, mixed $super_attribute = []);
}
