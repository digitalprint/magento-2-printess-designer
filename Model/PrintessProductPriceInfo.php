<?php

namespace Digitalprint\PrintessDesigner\Model;

use Magento\Framework\Model\AbstractExtensibleModel;
use Digitalprint\PrintessDesigner\Api\Data\PrintessProductPriceInfoInterface;

class PrintessProductPriceInfo extends AbstractExtensibleModel implements PrintessProductPriceInfoInterface
{

    /**
     * {@inheritdoc}
     */
    public function getValue(): array
    {
        return array(json_decode($this->getData(self::VALUE), true, 512, JSON_THROW_ON_ERROR));
    }

    /**
     * {@inheritdoc}
     */
    public function setValue(?string $value)
    {
        return $this->setData(self::VALUE, $value);
    }

}
