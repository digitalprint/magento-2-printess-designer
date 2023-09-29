<?php

namespace Digitalprint\PrintessDesigner\Api\Data;

interface ProductInterface
{
    public const SKU = 'sku';

    public const NAME = 'name';

    public const VARIANTS = 'variants';

    /**
     * Get sku
     * @return string|null
     */
    public function getSku();

    /**
     * Set sku
     * @param string $sku
     * @return ProductInterface
     */
    public function setSku(string $sku);

    /**
     * Get name
     * @return string|null
     */
    public function getName();

    /**
     * Set name
     * @param string $name
     * @return ProductInterface
     */
    public function setName(string $name);

    /**
     * Get variants
     * @return \Digitalprint\PrintessDesigner\Api\Data\AssociativeArrayItemInterface[]
     */
    public function getVariants();

    /**
     * Set variants
     * @param array $variants
     * @return ProductInterface
     */
    public function setVariants(array $variants);
}
