<?php

namespace Digitalprint\PrintessDesigner\Model\Api;

use Digitalprint\PrintessDesigner\Api\Data\PriceInfoInterface;
use Magento\Framework\Model\AbstractExtensibleModel;

class PriceInfo extends AbstractExtensibleModel implements PriceInfoInterface
{

    /**
     * {@inheritdoc}
     */
    public function getValue(): array
    {

        return [json_decode($this->getData(self::VALUE), true, 512, JSON_THROW_ON_ERROR)];
    }

    /**
     * {@inheritdoc}
     */
    public function setValue(?string $value)
    {
        return $this->setData(self::VALUE, $value);
    }
}
