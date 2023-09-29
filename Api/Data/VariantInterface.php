<?php

namespace Digitalprint\PrintessDesigner\Api\Data;

interface VariantInterface
{
    public const SKU = 'sku';

    public const NAME = 'name';

    public const PRICE = 'price';

    public const LEGALNOTICE = 'legal_notice';

    /**
     * Get sku
     * @return string|null
     */
    public function getSku();

    /**
     * Set sku
     * @param string $sku
     * @return VariantInterface
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
     * @return VariantInterface
     */
    public function setName(string $name);

    /**
     * Get name
     * @return \Digitalprint\PrintessDesigner\Api\Data\AssociativeArrayItemInterface[]
     */
    public function getPrices();

    /**
     * Set name
     * @param array $price
     * @return VariantInterface
     */
    public function setPrices(array $price);

    /**
     * get legal notice
     * @return string|null
     */
    public function getLegalNotice();

    /**
     * Set legal notice
     * @param string $legalNotice
     * @return VariantInterface
     */
    public function setLegalNotice(string $legalNotice);
}
