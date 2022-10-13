<?php

namespace Digitalprint\PrintessDesigner\Api\Data;

interface PrintessProductDocumentsInterface
{
    const VALUE = 'printess_product_documents';

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
