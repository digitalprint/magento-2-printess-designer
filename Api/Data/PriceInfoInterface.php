<?php

namespace Digitalprint\PrintessDesigner\Api\Data;

interface PriceInfoInterface
{
    public const VALUE = 'printess_price_info';

    /**
     * Return value.
     *
     * @return \Digitalprint\PrintessDesigner\Api\Data\AssociativeArrayItemInterface[]
     */
    public function getValue();

    /**
     * Set value.
     *
     * @param string|null $value
     * @return $this
     */
    public function setValue(?string $value);
}
