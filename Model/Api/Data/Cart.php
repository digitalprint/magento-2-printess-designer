<?php

namespace Digitalprint\PrintessDesigner\Model\Api\Data;

use Digitalprint\PrintessDesigner\Api\Data\CartInterface;

class Cart implements CartInterface
{

    /**
     * @var
     */
    private $status;
    /**
     * @var
     */
    private $redirectUrl;

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
     * @return CartInterface
     */
    public function setStatus($status)
    {
        $this->status = $status;
    }

    /**
     * Get redirect url
     * @return string|null
     */
    public function getRedirectUrl()
    {
        return $this->redirectUrl;
    }

    /**
     * Set redirect url
     * @param string $checkoutUrl
     * @return CartInterface
     */
    public function setRedirectUrl($redirectUrl)
    {
        $this->redirectUrl = $redirectUrl;
    }
}
