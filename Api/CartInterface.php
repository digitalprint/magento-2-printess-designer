<?php

namespace Digitalprint\PrintessDesigner\Api;

interface CartInterface
{

    /**
     * Add to cart
     *
     * @param string|null $sku
     * @param integer|null $quantity
     * @param string|null $saveToken
     * @param string|null $thumbnailUrl
     * @param string|null $documents
     * @param string|null $priceInfo
     * @return Data\CartInterface
     *
     */
    public function addToCart(?string $sku, ?int $quantity, ?string $saveToken, ?string $thumbnailUrl, ?string $documents, ?string $priceInfo);
}
