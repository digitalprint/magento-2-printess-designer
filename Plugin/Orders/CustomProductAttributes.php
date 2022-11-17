<?php

namespace Digitalprint\PrintessDesigner\Plugin\Orders;

use Digitalprint\PrintessDesigner\Model\PrintessProductDocumentsFactory;
use Digitalprint\PrintessDesigner\Model\PrintessProductPriceInfoFactory;
use Magento\Catalog\Model\ProductFactory;
use Magento\Sales\Api\Data\OrderItemInterface;
use Magento\Sales\Api\OrderItemRepositoryInterface;
use Magento\Sales\Api\Data\OrderItemExtensionFactory;
use Magento\Sales\Api\Data\OrderItemSearchResultInterface;

class CustomProductAttributes
{

    /**
     * @var OrderItemExtensionFactory
     */
    protected OrderItemExtensionFactory $orderItemExtensionFactory;

    /**
     * @var ProductFactory
     */
    protected ProductFactory $productFactory;

    /**
     * @var PrintessProductDocumentsFactory
     */
    protected PrintessProductDocumentsFactory $printessProductDocumentsFactory;

    /**
     * @var PrintessProductPriceInfoFactory
     */
    protected PrintessProductPriceInfoFactory $printessProductPriceInfoFactory;

    /**
     * @param OrderItemExtensionFactory $orderItemExtensionFactory
     * @param ProductFactory $productFactory
     * @param PrintessProductDocumentsFactory $printessProductDocumentsFactory
     * @param PrintessProductPriceInfoFactory $printessProductPriceInfoFactory*
     */
    public function __construct(
        OrderItemExtensionFactory $orderItemExtensionFactory,
        ProductFactory $productFactory,
        PrintessProductDocumentsFactory $printessProductDocumentsFactory,
        PrintessProductPriceInfoFactory $printessProductPriceInfoFactory

    ) {
        $this->orderItemExtensionFactory = $orderItemExtensionFactory;
        $this->productFactory = $productFactory;
        $this->printessProductDocumentsFactory = $printessProductDocumentsFactory;
        $this->printessProductPriceInfoFactory = $printessProductPriceInfoFactory;
    }

    /**
     * @param OrderItemRepositoryInterface $subject
     * @param OrderItemInterface $orderItem
     * @return OrderItemInterface
     */
    public function afterGet(OrderItemRepositoryInterface $subject, OrderItemInterface $orderItem): OrderItemInterface
    {
        $extensionAttributes = $orderItem->getExtensionAttributes();
        $extensionAttributes = $extensionAttributes ?: $this->orderItemExtensionFactory->create();

        $printessProductDocuments = $this->printessProductDocumentsFactory->create();
        $printessProductPriceInfo = $this->printessProductPriceInfoFactory->create();

        $options = $orderItem->getProductOptions();

        if (isset($options['additional_options']['printess_save_token'])) {
            $extensionAttributes->setPrintessSaveToken($options['additional_options']['printess_save_token']['value']);
        }

        if (isset($options['additional_options']['printess_thumbnail_url'])) {
            $extensionAttributes->setPrintessThumbnailUrl($options['additional_options']['printess_thumbnail_url']['value']);
        }

        if (isset($options['additional_options']['printess_product_documents'])) {
            $printessProductDocuments->setValue($options['additional_options']['printess_product_documents']['value']);
            $extensionAttributes->setPrintessProductDocuments($printessProductDocuments);
        }

        if (isset($options['additional_options']['printess_product_price_info'])) {
            $printessProductPriceInfo->setValue($options['additional_options']['printess_product_price_info']['value']);
            $extensionAttributes->setPrintessProductPriceInfo($printessProductPriceInfo);
        }

        $orderItem->setExtensionAttributes($extensionAttributes);

        return $orderItem;
    }

    /**
     * @param OrderItemRepositoryInterface $subject
     * @param OrderItemSearchResultInterface $result
     * @return OrderItemSearchResultInterface
     */
    public function afterGetList(OrderItemRepositoryInterface $subject, OrderItemSearchResultInterface $result): OrderItemSearchResultInterface
    {

        $orderItems = $result->getItems();

        foreach($orderItems as $orderItem) {

            $extensionAttributes = $orderItem->getExtensionAttributes();
            $extensionAttributes = $extensionAttributes ?: $this->orderItemExtensionFactory->create();

            $printessProductDocuments = $this->printessProductDocumentsFactory->create();
            $printessProductPriceInfo = $this->printessProductPriceInfoFactory->create();

            $options = $orderItem->getProductOptions();

            if (isset($options['additional_options']['printess_save_token'])) {
                $extensionAttributes->setPrintessSaveToken($options['additional_options']['printess_save_token']['value']);
            }

            if (isset($options['additional_options']['printess_thumbnail_url'])) {
                $extensionAttributes->setPrintessThumbnailUrl($options['additional_options']['printess_thumbnail_url']['value']);
            }

            if (isset($options['additional_options']['printess_product_documents'])) {
                $printessProductDocuments->setValue($options['additional_options']['printess_product_documents']['value']);
                $extensionAttributes->setPrintessProductDocuments($printessProductDocuments);
            }

            if (isset($options['additional_options']['printess_product_price_info'])) {
                $printessProductPriceInfo->setValue($options['additional_options']['printess_product_price_info']['value']);
                $extensionAttributes->setPrintessProductPriceInfo($printessProductPriceInfo);
            }

            $orderItem->setExtensionAttributes($extensionAttributes);

        }

        return $result;
    }
}
