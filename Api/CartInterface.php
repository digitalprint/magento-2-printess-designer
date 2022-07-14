<?php

namespace Digitalprint\PrintessDesigner\Api;

interface CartInterface {

    /**
     * Add to cart
     *
     * @param string $sku
     * @param string $quantity
     * @param string $saveToken
     * @param string $thumbnailUrl
     * @return Data\CartInterface
     *
     */
    public function addToCart($sku, $quantity, $saveToken, $thumbnailUrl);

}
