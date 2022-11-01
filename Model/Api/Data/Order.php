<?php

namespace Digitalprint\PrintessDesigner\Model\Api\Data;

use Digitalprint\PrintessDesigner\Api\Data\OrderInterface;

class Order implements OrderInterface
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
     * @return \Digitalprint\PrintessDesigner\Api\Data\OrderInterface
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
     * @return \Digitalprint\PrintessDesigner\Api\Data\OrderInterface
     */
    public function setRedirectUrl($redirectUrl)
    {
        $this->redirectUrl = $redirectUrl;
    }
}
