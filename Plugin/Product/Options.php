<?php

namespace Digitalprint\PrintessDesigner\Plugin\Product;

use Digitalprint\PrintessDesigner\Model\Adjustment;
use Digitalprint\PrintessDesigner\Model\SupplierParameter;

class Options
{

    /**
     * @param \Magento\Catalog\Block\Product\View\Options $subject
     * @param $options
     * @return mixed
     */
    public function afterGetOptions(\Magento\Catalog\Block\Product\View\Options $subject, $options)
    {
        foreach ($options as $key => $option) {
            if (in_array($option->getType(), [SupplierParameter::TYPE_NAME, Adjustment::TYPE_NAME], false)) {
                unset($options[$key]);
            }
        }
        return $options;
    }

}
