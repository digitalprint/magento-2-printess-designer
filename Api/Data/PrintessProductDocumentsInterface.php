<?php

namespace Digitalprint\PrintessDesigner\Api\Data;

interface PrintessProductDocumentsInterface
{
    public const VALUE = 'printess_product_documents';

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
