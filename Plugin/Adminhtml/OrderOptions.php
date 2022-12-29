<?php

namespace Digitalprint\PrintessDesigner\Plugin\Adminhtml;

use Magento\Sales\Block\Adminhtml\Items\Column\DefaultColumn;

class OrderOptions {

    /**
     * @param DefaultColumn $subject
     * @param $result
     * @return array
     */
    public function afterGetOrderOptions(DefaultColumn $subject, $result): array
    {

        unset(
            $result['printess_save_token'],
            $result['printess_thumbnail_url'],
            $result['printess_documents'],
            $result['printess_price_info'],
            $result['printess_supplier_parameter']
        );

        return $result;

    }
}
