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
    public function setSku($sku);

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
    public function setName($title);

    /**
     * Get variants
     * @return \Digitalprint\PrintessDesigner\Api\Data\AssociativeArrayItemInterface[]
     */
    public function getVariants();

    /**
     * Set variants
     * @param array $title
     * @return ProductInterface
     */
    public function setVariants($title);

}
