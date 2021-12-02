<?php

namespace Digitalprint\PrintessDesigner\Model\Data;

use Digitalprint\PrintessDesigner\Api\Data\CartInterface;

class Cart implements CartInterface
{

    private $status;
    private $checkoutUrl;

    /**
    * Get status
    * @return string|null
    */
    public function getStatus()
    {
        return $this->status;
    }

    /**
    * Set status
    * @param string $status
    * @return \Digitalprint\PrintessDesigner\Api\Data\CartInterface
    */
    public function setStatus($status)
    {
        $this->status = $status;
    }

    /**
    * Get checkout url
    * @return string|null
    */
    public function getCheckoutUrl()
    {
        return $this->checkoutUrl;
    }

    /**
    * Set checkout url
    * @param string $checkoutUrl
    * @return \Digitalprint\PrintessDesigner\Api\Data\CartInterface
    */
    public function setCheckoutUrl($checkoutUrl)
    {
        $this->checkoutUrl = $checkoutUrl;
    }
}
