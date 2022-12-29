<?php

namespace Digitalprint\PrintessDesigner\Api;

interface OrderInterface
{
    /**
     * @param string $orderId
     * @param string $itemId
     * @param string $sku
     * @param integer $qty
     * @param string $saveToken
     * @param string $thumbnailUrl
     * @param mixed $documents
     * @param mixed $priceInfo
     * @return Data\OrderInterface
     */
    public function updateOrderItem(string $orderId, string $itemId, string $sku, int $qty, string $saveToken, string $thumbnailUrl, mixed $documents, mixed $priceInfo);
}
