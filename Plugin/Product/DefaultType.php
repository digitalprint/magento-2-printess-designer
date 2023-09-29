<?php

namespace Digitalprint\PrintessDesigner\Plugin\Product;

use Digitalprint\PrintessDesigner\Model\Adjustment;

class DefaultType
{
    /**
     * @param \Magento\Catalog\Model\Product\Option\Type\DefaultType $subject
     * @param $result
     * @param $optionValue
     * @param $basePrice
     * @return float|int|string
     * @throws \Magento\Framework\Exception\LocalizedException
     */
    public function afterGetOptionPrice(\Magento\Catalog\Model\Product\Option\Type\DefaultType $subject, $result, $optionValue, $basePrice)
    {
        $option = $subject->getOption();

        if (is_numeric($optionValue) && ($option->getType() === Adjustment::TYPE_NAME)) {
            $result *= $optionValue;
        }

        return $result;
    }
}
