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
     * @return CartInterface
     */
    public function setStatus(string $status);

    /**
     * Get redirect url
     * @return string|null
     */
    public function getRedirectUrl();

    /**
     * Set redirect url
     * @param string $redirectUrl
     * @return CartInterface
     */
    public function setRedirectUrl(string $redirectUrl);
}
