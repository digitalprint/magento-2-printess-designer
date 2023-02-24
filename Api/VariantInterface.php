<?php

namespace Digitalprint\PrintessDesigner\Api;

interface VariantInterface
{

    /**
     * @param string $sku
     * @param mixed $documents
     * @param mixed $formFields
     * @return Data\VariantInterface
     */
    public function getVariant(string $sku, mixed $documents, mixed $formFields);

}
