<?php

namespace Digitalprint\PrintessDesigner\Api;

interface OrderInterface {


    /**
     * @param string $orderId
     * @param string $itemId
     * @param string $sku
     * @param string $qty
     * @param string $saveToken
     * @param string $thumbnailUrl
     * @return Data\OrderInterface
     */
    public function updateOrderItem($orderId, $itemId, $sku, $qty, $saveToken, $thumbnailUrl);

}
