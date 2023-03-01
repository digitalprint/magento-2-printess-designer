<?php

namespace Digitalprint\PrintessDesigner\Model\Api\Data;

use Magento\Framework\Model\AbstractExtensibleModel;
use Digitalprint\PrintessDesigner\Api\Data\VariantInterface;

class Variant extends AbstractExtensibleModel implements VariantInterface
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
     * @return VariantInterface
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
     * @return VariantInterface
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
    public function getPrices()
    {
        return $this->getData(self::PRICE);
    }

    /**
     * @param array $price
     * @return VariantInterface
     */
    public function setPrices(array $price)
    {
        return $this->setData(self::PRICE, $price);
    }

    /**
     * Get legal notice
     *
     * @return string|null
     */
    public function getLegalNotice()
    {
        return $this->getData(self::LEGALNOTICE);
    }

    /**
     * Set legal notice
     *
     * @param string $legalNotice
     * @return VariantInterface
     */
    public function setLegalNotice(string $legalNotice)
    {
        return $this->setData(self::LEGALNOTICE, $legalNotice);
    }

}
