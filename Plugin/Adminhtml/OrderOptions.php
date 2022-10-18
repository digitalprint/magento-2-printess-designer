<?php

namespace Digitalprint\PrintessDesigner\Plugin\Adminhtml;

use Magento\Sales\Block\Adminhtml\Items\Column\DefaultColumn;

class OrderOptions {

    public function afterGetOrderOptions(DefaultColumn $subject, $result) {

        unset(
            $result['printess_save_token'],
            $result['printess_thumbnail_url'],
            $result['printess_product_documents'],
            $result['printess_product_price_info']
        );

        return $result;

    }
}
