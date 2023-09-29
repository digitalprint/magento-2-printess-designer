<?php

namespace Digitalprint\PrintessDesigner\Model\Api\Data;

use Digitalprint\PrintessDesigner\Api\Data\CartInterface;

class Cart implements CartInterface
{
    /**
     * @var string|null
     */
    private ?string $status;

    /**
     * @var string|null
     */
    private ?string $redirectUrl;

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
    public function setStatus(string $status)
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
     * @param string $redirectUrl
     * @return CartInterface
     */
    public function setRedirectUrl(string $redirectUrl)
    {
        $this->redirectUrl = $redirectUrl;
    }
}
