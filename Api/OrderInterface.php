<?php

namespace Digitalprint\PrintessDesigner\Api;

interface OrderInterface {


    /**
     * @param string|null $orderId
     * @param string|null $itemId
     * @param string|null $sku
     * @param integer $qty
     * @param string|null $saveToken
     * @param string|null $thumbnailUrl
     * @param string|null $documents
     * @param string|null $priceInfo
     * @return Data\OrderInterface
     */
    public function updateOrderItem(?string $orderId, ?string $itemId, ?string $sku, int $qty, ?string $saveToken, ?string $thumbnailUrl, ?string $documents, ?string $priceInfo);

}
