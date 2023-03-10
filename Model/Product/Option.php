<?php

namespace Digitalprint\PrintessDesigner\Model\Product;

use Digitalprint\PrintessDesigner\Model\Adjustment;
use Digitalprint\PrintessDesigner\Model\SupplierParameter;

class Option extends \Magento\Catalog\Model\Product\Option
{

    /**
     * @param $type
     * @return mixed|string
     */
    public function getGroupByType($type = null)
    {
        if ($type === null) {
            $type = $this->getType();
        }

        $optionTypesToGroups = [
            self::OPTION_TYPE_FIELD => self::OPTION_GROUP_TEXT,
            self::OPTION_TYPE_AREA => self::OPTION_GROUP_TEXT,
            self::OPTION_TYPE_FILE => self::OPTION_GROUP_FILE,
            self::OPTION_TYPE_DROP_DOWN => self::OPTION_GROUP_SELECT,
            self::OPTION_TYPE_RADIO => self::OPTION_GROUP_SELECT,
            self::OPTION_TYPE_CHECKBOX => self::OPTION_GROUP_SELECT,
            self::OPTION_TYPE_MULTIPLE => self::OPTION_GROUP_SELECT,
            self::OPTION_TYPE_DATE => self::OPTION_GROUP_DATE,
            self::OPTION_TYPE_DATE_TIME => self::OPTION_GROUP_DATE,
            self::OPTION_TYPE_TIME => self::OPTION_GROUP_DATE,
            Adjustment::TYPE_NAME => self::OPTION_GROUP_TEXT,
            SupplierParameter::TYPE_NAME => self::OPTION_GROUP_SELECT,
        ];

        return $optionTypesToGroups[$type] ?? '';
    }
}
