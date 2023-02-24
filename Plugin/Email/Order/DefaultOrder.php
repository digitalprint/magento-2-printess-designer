<?php

namespace Digitalprint\PrintessDesigner\Plugin\Email\Order;

use Digitalprint\PrintessDesigner\Model\Adjustment;
use Digitalprint\PrintessDesigner\Model\SupplierParameter;

class DefaultOrder
{

    /**
     * @param \Magento\Sales\Block\Order\Email\Items\Order\DefaultOrder $subject
     * @param $result
     * @return array
     */
    public function afterGetItemOptions(\Magento\Sales\Block\Order\Email\Items\Order\DefaultOrder $subject, $result)
    {
        return array_filter($result, static function ($v, $k) {

            if (array_key_exists('option_type', $v)) {
                return !in_array($v['option_type'], [SupplierParameter::TYPE_NAME, Adjustment::TYPE_NAME], true);
            }

            return !(str_starts_with($k, 'printess'));

        }, ARRAY_FILTER_USE_BOTH);

    }

}
