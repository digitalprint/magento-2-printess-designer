<?php

namespace Digitalprint\PrintessDesigner\Api\Data;

interface PrintessProductPriceInfoInterface
{
    public const VALUE = 'printess_product_price_info';

    /**
     * Return value.
     *
     * @return AssociativeArrayItemInterface[]
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
