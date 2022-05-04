<?php

namespace Digitalprint\PrintessDesigner\Block\Sales\Items\Column;

use Magento\Sales\Block\Adminhtml\Items\Column\DefaultColumn;

class Download extends DefaultColumn
{

    /**
     * @return false|string
     */
    public function getDownloadUrl()
    {

        if (($options = $this->getItem()->getProductOptions()) && isset($options['additional_options']['printess_save_token'])) {
            return $this->getUrl('designer/download/index', ['order_id'=> $this->getItem()->getOrderId(), 'quote_item_id' => $this->getItem()->getQuoteItemId()]);
        }

        return false;

    }

}
