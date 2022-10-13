<?php

namespace Digitalprint\PrintessDesigner\Api\Data;

/**
 * Interface which represents associative array item.
 */
interface AssociativeArrayItemInterface
{
    /**
     * Get key
     *
     * @return string
     */
    public function getKey();

    /**
     * Get value
     *
     * @return string
     */
    public function getValue();
}
