<?php

namespace Digitalprint\PrintessDesigner\Block\Adminhtml\Product\Edit\Tab\Options;

use Magento\Framework\Json\Helper\Data as JsonHelper;
use Magento\Framework\View\Helper\SecureHtmlRenderer;

class Option extends \Magento\Catalog\Block\Adminhtml\Product\Edit\Tab\Options\Option
{
    /**
     * @var string
     */
    protected $_template = 'Magento_Catalog::catalog/product/edit/options/option.phtml';

    public function __construct(
        \Magento\Backend\Block\Template\Context $context,
        \Magento\Config\Model\Config\Source\Yesno $configYesNo,
        \Magento\Catalog\Model\Config\Source\Product\Options\Type $optionType,
        \Magento\Catalog\Model\Product $product,
        \Magento\Framework\Registry $registry,
        \Magento\Catalog\Model\ProductOptions\ConfigInterface $productOptionConfig,
        array $data = [],
        ?JsonHelper $jsonHelper = null,
        ?SecureHtmlRenderer $secureRenderer = null
    ) {
        parent::__construct(
            $context,
            $configYesNo,
            $optionType,
            $product,
            $registry,
            $productOptionConfig,
            $data,
            $jsonHelper,
            $secureRenderer
        );
    }

    /**
     * @return string
     */
    public function getTemplatesHtml()
    {
        $canEditPrice = $this->getCanEditPrice();
        $canReadPrice = $this->getCanReadPrice();

        $this->getChildBlock('adjustment_option_type')->setCanReadPrice($canReadPrice)->setCanEditPrice($canEditPrice);

        return parent::getTemplatesHtml() . "\n" .
            $this->getChildHtml('adjustment_option_type');
    }
}
