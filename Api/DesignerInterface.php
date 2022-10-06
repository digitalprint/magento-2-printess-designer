<?php

namespace Digitalprint\PrintessDesigner\Api;

interface DesignerInterface
{
    /**
     * Get a designer url by tag
     *
     * @param string $tag
     * @return Data\DesignerInterface
     */

    public function getUrlByTag($tag);



}
