<?php

namespace Digitalprint\PrintessDesigner\Api\Data;

interface OrderInterface
{
    /**
     * Get status
     * @return string|null
     */
    public function getStatus();

    /**
     * Set status
     * @param string $status
     * @return OrderInterface
     */
    public function setStatus($status);

    /**
     * Get redirect url
     * @return string|null
     */
    public function getRedirectUrl();

    /**
     * Set redirect url
     * @param string $redirectUrl
     * @return OrderInterface
     */
    public function setRedirectUrl($redirectUrl);
}
