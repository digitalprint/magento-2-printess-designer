<?php

namespace Digitalprint\PrintessDesigner\Block\Sales\Items\Column;

use Magento\Backend\Block\Template\Context;
use Magento\Catalog\Model\Product\OptionFactory;
use Magento\CatalogInventory\Api\StockConfigurationInterface;
use Magento\CatalogInventory\Api\StockRegistryInterface;
use Magento\ConfigurableProduct\Model\Product\Type\Configurable;
use Magento\Framework\AuthorizationInterface;
use Magento\Framework\Registry;
use Magento\Sales\Block\Adminhtml\Items\Column\DefaultColumn;

class Printess extends DefaultColumn
{

    /**
     * @var AuthorizationInterface
     */
    private AuthorizationInterface $authorization;

    public function __construct(
        Context $context,
        AuthorizationInterface $authorization,
        StockRegistryInterface $stockRegistry,
        StockConfigurationInterface $stockConfiguration,
        Registry $registry,
        OptionFactory $optionFactory,
        array $data = []
    ) {
        $this->authorization = $authorization;

        parent::__construct($context, $stockRegistry, $stockConfiguration, $registry, $optionFactory, $data);
    }

    /**
     * @return string
     */
    public function getDesignerUrl()
    {
        if ($this->authorization->isAllowed('Digitalprint_PrintessDesigner::edit_items') && ($options = $this->getItem()->getProductOptions()) && isset($options['additional_options']['printess_save_token'])) {
            $queryParams = [];
            $queryParams['order_id'] = $this->getItem()->getOrderId();
            $queryParams['item_id'] = $this->getItem()->getItemId();
            $queryParams['qty'] = (int)$this->getItem()->getQtyOrdered();

            if ($this->getItem()->getProductType() === Configurable::TYPE_CODE) {
                $queryParams['sku'] = $this->getItem()->getProduct()->getSku();

                if (isset($options['info_buyRequest']['super_attribute'])) {
                    $queryParams["super_attribute"] = $options['info_buyRequest']['super_attribute'];
                }
            } else {
                $queryParams['sku'] = $this->getItem()->getSku();
            }

            $queryParams['save_token'] = $options['additional_options']['printess_save_token']['value'];

            return $this->getUrl('designer/page/view', ['_current' => false, '_use_rewrite' => true, '_query' => $queryParams]);
        }

        return false;
    }

    /**
     * @return false|string
     */
    public function getDownloadUrl()
    {
        if (($options = $this->getItem()->getProductOptions()) && isset($options['additional_options']['printess_save_token'])) {
            $queryParams = [];
            $queryParams['order_id'] = $this->getItem()->getOrderId();
            $queryParams['item_id'] = $this->getItem()->getItemId();

            return  $this->getUrl('designer/download/index', ['_current' => false,'_use_rewrite' => true, '_query' => $queryParams]);
        }

        return false;
    }
}
