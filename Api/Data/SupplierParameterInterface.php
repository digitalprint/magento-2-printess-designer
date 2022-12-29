<?php

namespace Digitalprint\PrintessDesigner\Api\Data;

interface SupplierParameterInterface
{
    public const VALUE = 'printess_supplier_parameter';

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
