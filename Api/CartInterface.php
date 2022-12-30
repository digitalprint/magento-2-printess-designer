<?php

namespace Digitalprint\PrintessDesigner\Api;

interface CartInterface
{

    /**
     * Add to cart
     *
     * @param string $sku
     * @param int $quantity
     * @param string $saveToken
     * @param string $thumbnailUrl
     * @param mixed $documents
     * @param mixed $formFields
     * @param mixed $priceInfo
     * @return Data\CartInterface
     */
    public function addToCart(string $sku, int $quantity, string $saveToken, string $thumbnailUrl, mixed $documents, mixed $formFields, mixed $priceInfo);
}
