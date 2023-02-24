<?php

namespace Digitalprint\PrintessDesigner\Block\Adminhtml\Product\Edit\Tab\Options\Type;

class Adjustment extends \Magento\Catalog\Block\Adminhtml\Product\Edit\Tab\Options\Type\AbstractType
{

    /**
     * @var string
     */
    protected $_template = 'Digitalprint_PrintessDesigner::catalog/product/edit/options/type/text.phtml';

    /**
     * @param \Magento\Backend\Block\Template\Context $context
     * @param \Magento\Catalog\Model\Config\Source\Product\Options\Price $optionPrice
     * @param array $data
     */
    public function __construct(
        \Magento\Backend\Block\Template\Context $context,
        \Magento\Catalog\Model\Config\Source\Product\Options\Price $optionPrice,
        array $data = []
    ) {
        $this->_optionPrice = $optionPrice;
        parent::__construct($context, $optionPrice, $data);
    }

}
