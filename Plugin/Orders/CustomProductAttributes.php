<?php

namespace Digitalprint\PrintessDesigner\Plugin\Orders;

use Digitalprint\PrintessDesigner\Model\Api\DocumentsFactory;
use Digitalprint\PrintessDesigner\Model\Api\PriceInfoFactory;
use Digitalprint\PrintessDesigner\Model\Api\SupplierParameterFactory;
use Magento\Catalog\Model\ProductFactory;
use Magento\Sales\Api\Data\OrderItemExtensionFactory;
use Magento\Sales\Api\Data\OrderItemInterface;
use Magento\Sales\Api\Data\OrderItemSearchResultInterface;
use Magento\Sales\Api\OrderItemRepositoryInterface;

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
     * @var DocumentsFactory
     */
    protected DocumentsFactory $documentsFactory;

    /**
     * @var PriceInfoFactory
     */
    protected PriceInfoFactory $priceInfoFactory;

    /**
     * @var SupplierParameterFactory
     */
    protected SupplierParameterFactory $supplierParameterFactory;

    /**
     * @param OrderItemExtensionFactory $orderItemExtensionFactory
     * @param ProductFactory $productFactory
     * @param DocumentsFactory $documentsFactory
     * @param PriceInfoFactory $priceInfoFactory
     * @param SupplierParameterFactory $suplierParameterFactory
     */
    public function __construct(
        OrderItemExtensionFactory $orderItemExtensionFactory,
        ProductFactory $productFactory,
        DocumentsFactory $documentsFactory,
        PriceInfoFactory $priceInfoFactory,
        SupplierParameterFactory $supplierParameterFactory
    ) {
        $this->orderItemExtensionFactory = $orderItemExtensionFactory;
        $this->productFactory = $productFactory;
        $this->documentsFactory = $documentsFactory;
        $this->priceInfoFactory = $priceInfoFactory;
        $this->supplierParameterFactory = $supplierParameterFactory;
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

        $options = $orderItem->getProductOptions();

        if (isset($options['additional_options']['printess_save_token'])) {
            $extensionAttributes->setPrintessSaveToken($options['additional_options']['printess_save_token']['value']);
        }

        if (isset($options['additional_options']['printess_thumbnail_url'])) {
            $extensionAttributes->setPrintessThumbnailUrl($options['additional_options']['printess_thumbnail_url']['value']);
        }

        if (isset($options['additional_options']['printess_documents'])) {
            $documents = $this->documentsFactory->create();
            $documents->setValue($options['additional_options']['printess_documents']['value']);

            $extensionAttributes->setPrintessProductDocuments($documents);
        }

        if (isset($options['additional_options']['printess_price_info'])) {
            $priceInfo = $this->priceInfoFactory->create();
            $priceInfo->setValue($options['additional_options']['printess_price_info']['value']);

            $extensionAttributes->setPrintessProductPriceInfo($priceInfo);
        }

        if (isset($options['additional_options']['printess_supplier_parameter'])) {
            $supplierParameter = $this->supplierParameterFactory->create();
            $supplierParameter->setValue($options['additional_options']['printess_supplier_parameter']['value']);

            $extensionAttributes->setPrintessSupplierParameter($supplierParameter);
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

        foreach ($orderItems as $orderItem) {
            $extensionAttributes = $orderItem->getExtensionAttributes();
            $extensionAttributes = $extensionAttributes ?: $this->orderItemExtensionFactory->create();

            $options = $orderItem->getProductOptions();

            if (isset($options['additional_options']['printess_save_token'])) {
                $extensionAttributes->setPrintessSaveToken($options['additional_options']['printess_save_token']['value']);
            }

            if (isset($options['additional_options']['printess_thumbnail_url'])) {
                $extensionAttributes->setPrintessThumbnailUrl($options['additional_options']['printess_thumbnail_url']['value']);
            }

            if (isset($options['additional_options']['printess_documents'])) {
                $documents = $this->documentsFactory->create();
                $documents->setValue($options['additional_options']['printess_documents']['value']);

                $extensionAttributes->setPrintessProductDocuments($documents);
            }

            if (isset($options['additional_options']['printess_price_info'])) {
                $priceInfo = $this->priceInfoFactory->create();
                $priceInfo->setValue($options['additional_options']['printess_price_info']['value']);

                $extensionAttributes->setPrintessProductPriceInfo($priceInfo);
            }

            if (isset($options['additional_options']['printess_supplier_parameter'])) {
                $supplierParameter = $this->supplierParameterFactory->create();
                $supplierParameter->setValue($options['additional_options']['printess_supplier_parameter']['value']);

                $extensionAttributes->setPrintessSupplierParameter($supplierParameter);
            }

            $orderItem->setExtensionAttributes($extensionAttributes);
        }

        return $result;
    }
}
