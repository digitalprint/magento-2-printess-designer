<?php

namespace Digitalprint\PrintessDesigner\Model\Api;

use Digitalprint\PrintessDesigner\Api\Data\OrderInterface as DataOrderInterface;
use Digitalprint\PrintessDesigner\Api\OrderInterface;
use Digitalprint\PrintessDesigner\Model\SupplierParameter;
use Magento\Backend\Model\UrlInterface;
use Magento\Catalog\Api\ProductRepositoryInterface;
use Magento\Catalog\Model\ProductFactory;
use Magento\ConfigurableProduct\Model\Product\Type\Configurable;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\Serialize\SerializerInterface;
use Magento\Quote\Api\CartRepositoryInterface;
use Magento\Quote\Model\Quote\Item\ToOrderItem;
use Magento\Sales\Api\OrderRepositoryInterface;
use Twig\Error\LoaderError;
use Twig\Error\SyntaxError;

class Order implements OrderInterface
{

    /**
     * @var DataOrderInterface
     */
    private DataOrderInterface $dataOrder;

    /**
     * @var ProductFactory
     */
    private ProductFactory $productFactory;

    /**
     * @var ProductRepositoryInterface
     */
    private ProductRepositoryInterface $productRepository;

    /**
     * @var Configurable
     */
    private Configurable $configurableType;

    /**
     * @var SupplierParameter
     */
    private SupplierParameter $supplierParameter;

    /**
     * @var OrderRepositoryInterface
     */
    private OrderRepositoryInterface $orderRepository;

    /**
     * @var CartRepositoryInterface
     */
    private CartRepositoryInterface $quoteRepository;

    /**
     * @var ToOrderItem
     */
    private ToOrderItem $quoteToOrder;

    /**
     * @var UrlInterface
     */
    private UrlInterface $urlBuilder;

    /**
     * @var SerializerInterface
     */
    private SerializerInterface $serializer;

    /**
     * @param DataOrderInterface $dataOrder
     * @param ProductFactory $productFactory
     * @param ProductRepositoryInterface $productRepository
     * @param Configurable $configurableType
     * @param SupplierParameter $supplierParameter
     * @param OrderRepositoryInterface $orderRepository
     * @param CartRepositoryInterface $quoteRepository
     * @param ToOrderItem $quoteToOrder
     * @param UrlInterface $urlBuilder
     * @param SerializerInterface $serializer
     */
    public function __construct(
        DataOrderInterface $dataOrder,
        ProductFactory $productFactory,
        ProductRepositoryInterface $productRepository,
        Configurable $configurableType,
        SupplierParameter $supplierParameter,
        OrderRepositoryInterface $orderRepository,
        CartRepositoryInterface $quoteRepository,
        ToOrderItem $quoteToOrder,
        UrlInterface $urlBuilder,
        SerializerInterface $serializer
    ) {
        $this->dataOrder = $dataOrder;
        $this->productFactory = $productFactory;
        $this->productRepository = $productRepository;
        $this->configurableType = $configurableType;
        $this->supplierParameter = $supplierParameter;
        $this->orderRepository = $orderRepository;
        $this->quoteRepository = $quoteRepository;
        $this->quoteToOrder = $quoteToOrder;
        $this->urlBuilder = $urlBuilder;
        $this->serializer = $serializer;
    }

    /**
     * @param string $orderId
     * @param string $itemId
     * @param string $sku
     * @param int $qty
     * @param string $saveToken
     * @param string $thumbnailUrl
     * @param mixed $documents
     * @param mixed $formFields
     * @param mixed $priceInfo
     * @return DataOrderInterface
     * @throws NoSuchEntityException
     * @throws \JsonException
     * @throws LoaderError
     * @throws SyntaxError
     */
    public function updateOrderItem(string $orderId, string $itemId, string $sku, int $qty, string $saveToken, string $thumbnailUrl, mixed $documents, mixed $formFields, mixed $priceInfo)
    {
        $this->dataOrder->setStatus('error');

        $order = $this->orderRepository->get($orderId);
        $quote = $this->quoteRepository->get($order->getQuoteId());

        $quoteItems = $quote->getAllVisibleItems();

        foreach ($quoteItems as $quoteItem) {
            $origOrderItem = $order->getItemByQuoteItemId($quoteItem->getId());

            if ($origOrderItem) {
                $orderItemId = $origOrderItem->getItemId();

                if ($orderItemId === $itemId) {
                    $updateOptions = [];

                    $product = $this->productRepository->get($sku);

                    $parentId = $this->configurableType->getParentIdsByChild($product->getId());

                    $productConfiguration = [
                        'documents' => $documents,
                        'formFields' => $formFields
                    ];

                    if (($parentId = reset($parentId)) !== false) {
                        $parentProduct = $this->productFactory->create()->load($parentId);
                        $productAttributeOptions = $this->configurableType->getConfigurableAttributesAsArray($parentProduct);

                        $options = [];
                        foreach ($productAttributeOptions as $option) {
                            $options[$option['attribute_id']] = $product->getData($option['attribute_code']);
                        }

                        $buyRequest = $this->serializer->unserialize($quoteItem->getOptionByCode('info_buyRequest')->getValue());

                        $buyRequest['product_id'] = $product->getId();
                        $buyRequest['qty'] = $qty;
                        $buyRequest['super_attribute'] = $options;

                        $updateOptions[] = [
                                'product_id' => $product->getId(),
                                'code' => 'info_buyRequest',
                                'value' => $this->serializer->serialize($buyRequest)
                            ];

                        $updateOptions[] = [
                                'product_id' => $product->getId(),
                                'code' => 'simple_product',
                                'value' => $parentProduct->getId()
                            ];

                        $updateOptions[] = [
                                'product_id' => $product->getId(),
                                'code' => 'product_qty_' . $product->getId(),
                                'value' => $qty
                            ];

                        $supplierParameter = $this->supplierParameter->createSupplierParameter(!is_null($product->getData('printess_supplier_parameter')) ? $product : $parentProduct, $productConfiguration);
                    } else {
                        $buyRequest = $this->serializer->unserialize($quoteItem->getOptionByCode('info_buyRequest')->getValue());

                        $buyRequest['product_id'] = $product->getId();
                        $buyRequest['qty'] = $qty;

                        $updateOptions[] = [
                                'product_id' => $product->getId(),
                                'code' => 'info_buyRequest',
                                'value' => $this->serializer->serialize($buyRequest)
                            ];

                        $supplierParameter = $this->supplierParameter->createSupplierParameter($product, $productConfiguration);
                    }

                    // Additional Options

                    $additionalOptions = [];

                    if ($additionalOption = $quoteItem->getOptionByCode('additional_options')) {
                        $additionalOptions = $this->serializer->unserialize($additionalOption->getValue());
                    }

                    $additionalOptions['printess_save_token'] = [
                            'label' => 'save_token',
                            'value' => $saveToken
                        ];

                    $additionalOptions['printess_thumbnail_url'] = [
                            'label' => 'thumbnail_url',
                            'value' => $thumbnailUrl
                        ];

                    $additionalOptions['printess_documents'] = [
                            'label' => 'documents',
                            'value' => json_encode($documents)
                        ];

                    $additionalOptions['printess_price_info'] = [
                            'label' => 'price_info',
                            'value' => json_encode($priceInfo)
                        ];

                    $additionalOptions['printess_supplier_parameter'] = [
                        'label' => 'supplier_parameter',
                        'value' => json_encode($supplierParameter)
                    ];

                    $updateOptions[] = [
                            'product_id' => $product->getId(),
                            'code' => 'additional_options',
                            'value' => $this->serializer->serialize($additionalOptions)
                        ];

                    $quoteItem->setOptions($updateOptions);

                    $quoteItem->setSku($product->getSku());
                    $quoteItem->setQty($qty);

                    $quoteItem->saveItemOptions();
                    $quoteItem->save();

                    if ($quoteItem->getChildren()) {
                        foreach ($quoteItem->getChildren() as $childQuoteItem) {
                            $childQuoteItem->setProduct($product);

                            $childQuoteItem->setQty($qty);

                            $childQuoteItem->saveItemOptions();
                            $childQuoteItem->save();
                        }
                    }
                }
            }
        }

        $quote->collectTotals();
        $this->quoteRepository->save($quote);

        $quoteItems = $quote->getAllVisibleItems();
        foreach ($quoteItems as $quoteItem) {
            $orderItem = $this->quoteToOrder->convert($quoteItem);

            $options = $orderItem->getProductOptions();

            if ($additionalOptions = $quoteItem->getOptionByCode('additional_options')) {
                $options['additional_options'] = $this->serializer->unserialize($additionalOptions->getValue());
            }

            $product = $this->productFactory->create()->load($orderItem->getProductId());
            $productAttributeOptions = $this->configurableType->getConfigurableAttributesAsArray($product);

            $attributes = [];

            if ($buyRequest = $quoteItem->getOptionByCode('info_buyRequest')) {
                $buyRequest = $this->serializer->unserialize($buyRequest->getValue());

                if (isset($buyRequest['super_attribute']) && is_array($buyRequest['super_attribute'])) {
                    foreach ($buyRequest['super_attribute'] as $key => $val) {
                        if (isset($productAttributeOptions[$key])) {
                            $res = array_merge(...array_filter($productAttributeOptions[$key]['values'], static function ($v, $k) use ($val) {
                                return $v['value_index'] === $val;
                            }, ARRAY_FILTER_USE_BOTH));

                            if (isset($res['label'])) {
                                $attributes[] = [
                                        'label' => $productAttributeOptions[$key]['label'],
                                        'value' => $res['label'],
                                        'option_id' => $key,
                                        'option_value' => $val
                                    ];
                            }
                        }
                    }
                }
            }

            $options['attributes_info'] = $attributes;

            $orderItem->setProductOptions($options);

            $origOrderItem = $order->getItemByQuoteItemId($quoteItem->getId());
            $origOrderItem->addData($orderItem->getData());

            if ($quoteItem->getChildren()) {
                foreach ($quoteItem->getChildren() as $childQuoteItem) {
                    $childOrderItem = $this->quoteToOrder->convert($childQuoteItem);

                    $origChildOrderItem = $order->getItemByQuoteItemId($childQuoteItem->getId());
                    $origChildOrderItem->addData($childOrderItem->getData());
                }
            }
        }

        $order->setSubtotal($quote->getSubtotal());
        $order->setBaseSubtotal($quote->getBaseSubtotal());
        $order->setGrandTotal($quote->getGrandTotal());
        $order->setBaseGrandTotal($quote->getBaseGrandTotal());

        $this->orderRepository->save($order);

        $this->dataOrder->setRedirectUrl(
            $this->urlBuilder->getUrl('sales/order/view', [
                    'order_id' => $orderId
                ])
        );

        $this->dataOrder->setStatus('success');

        return $this->dataOrder;
    }
}
