<?php

namespace Digitalprint\PrintessDesigner\Api\Data;

interface DesignerInterface
{
    public const URL = 'url';

    /**
     * Get url
     * @return string|null
     */
    public function getUrl();

    /**
     * Set url
     * @param string $url
     * @return DesignerInterface
     */
    public function setUrl(string $url);
}
