<?php

namespace Digitalprint\PrintessDesigner\Api\Data;

interface PrintessProductPriceInfoInterface
{
    const VALUE = 'printess_product_price_info';

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
    public function setValue($value);

}
