<?php

namespace Digitalprint\PrintessDesigner\Api\Data;

interface CartInterface
{
    /**
     * Get status
     * @return string|null
     */
    public function getStatus();

    /**
     * Set status
     * @param string $status
     * @return \Digitalprint\PrintessDesigner\Api\Data\CartInterface
     */
    public function setStatus($status);

    /**
     * Get checkout url
     * @return string|null
     */
    public function getCheckoutUrl();

    /**
     * Set checkout url
     * @param string $checkoutUrl
     * @return \Digitalprint\PrintessDesigner\Api\Data\CartInterface
     */
    public function setCheckoutUrl($checkoutUrl);
}
