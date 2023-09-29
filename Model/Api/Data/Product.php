<?php

namespace Digitalprint\PrintessDesigner\Model\Api\Data;

use Digitalprint\PrintessDesigner\Api\Data\ProductInterface;
use Magento\Framework\Model\AbstractExtensibleModel;

class Product extends AbstractExtensibleModel implements ProductInterface
{
    /**
     * Get sku
     *
     * @return string|null
     */
    public function getSku()
    {
        return $this->getData(self::SKU);
    }

    /**
     * Set sku
     *
     * @param string $sku
     * @return ProductInterface
     */
    public function setSku(string $sku)
    {
        return $this->setData(self::SKU, $sku);
    }

    /**
     * Get name
     *
     * @return string|null
     */
    public function getName()
    {
        return $this->getData(self::NAME);
    }

    /**
     * Set name
     *
     * @param string $name
     * @return ProductInterface
     */
    public function setName(string $name)
    {
        return $this->setData(self::NAME, $name);
    }

    /**
     * Get variants
     *
     * @return \Digitalprint\PrintessDesigner\Api\Data\AssociativeArrayItemInterface[]
     */
    public function getVariants()
    {
        return $this->getData(self::VARIANTS);
    }

    /**
     * Set variants
     *
     * @param array variants
     * @return ProductInterface
     */
    public function setVariants(array $title)
    {
        return $this->setData(self::VARIANTS, $title);
    }
}
