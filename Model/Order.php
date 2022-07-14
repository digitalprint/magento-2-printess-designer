<?php

namespace Digitalprint\PrintessDesigner\Model;

use Digitalprint\PrintessDesigner\Api\OrderInterface;
use Digitalprint\PrintessDesigner\Api\Data\OrderInterface as DataOrderInterface;
use Magento\Backend\Model\UrlInterface;
use Magento\Catalog\Api\ProductRepositoryInterface;
use Magento\Catalog\Model\ProductFactory;
use Magento\ConfigurableProduct\Model\Product\Type\Configurable;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\Serialize\SerializerInterface;
use Magento\Quote\Api\CartRepositoryInterface;
use Magento\Quote\Model\Quote\Item\ToOrderItem;
use Magento\Sales\Api\OrderRepositoryInterface;

class Order implements OrderInterface
{

    /**
     * @var DataOrderInterface
     */
    private $dataOrder;
    /**
     * @var ProductFactory
     */
    private $productFactory;
    /**
     * @var ProductRepositoryInterface
     */
    private $productRepository;
    /**
     * @var Configurable
     */
    private $configurableType;
    /**
     * @var OrderRepositoryInterface
     */
    private $orderRepository;
    /**
     * @var CartRepositoryInterface
     */
    private $quoteRepository;
    /**
     * @var ToOrderItem
     */
    private $quoteToOrder;
    /**
     * @var UrlInterface
     */
    private $urlBuilder;
    /**
     * @var SerializerInterface
     */
    private $serializer;

    public function __construct(
        DataOrderInterface $dataOrder,
        ProductFactory $productFactory,
        ProductRepositoryInterface $productRepository,
        Configurable $configurableType,
        OrderRepositoryInterface $orderRepository,
        CartRepositoryInterface $quoteRepository,
        ToOrderItem $quoteToOrder,
        UrlInterface $urlBuilder,
        SerializerInterface $serializer
    )
    {
        $this->dataOrder = $dataOrder;
        $this->productFactory = $productFactory;
        $this->productRepository = $productRepository;
        $this->configurableType = $configurableType;
        $this->orderRepository = $orderRepository;
        $this->quoteRepository = $quoteRepository;
        $this->quoteToOrder = $quoteToOrder;
        $this->urlBuilder = $urlBuilder;
        $this->serializer = $serializer;
    }

    /**
     * @param $orderId
     * @param $itemId
     * @param $sku
     * @param $qty
     * @param $saveToken
     * @param $thumbnailUrl
     * @return DataOrderInterface
     * @throws NoSuchEntityException
     */
    public function updateOrderItem($orderId, $itemId, $sku, $qty, $saveToken, $thumbnailUrl)
    {

        $this->dataOrder->setStatus('error');

        if (!is_null($orderId) && !is_null($itemId) && !is_null($sku) && !is_null($qty) && !is_null($saveToken) && !is_null($thumbnailUrl)) {

            $order = $this->orderRepository->get($orderId);
            $quote = $this->quoteRepository->get($order->getQuoteId());

            $quoteItems = $quote->getAllVisibleItems();

            foreach ($quoteItems as $quoteItem) {

                $origOrderItem = $order->getItemByQuoteItemId($quoteItem->getId());

                if ($origOrderItem) {

                    $orderItemId = $origOrderItem->getItemId();

                    if ($orderItemId === (string)$itemId) {

                        $updateOptions = [];

                        $product = $this->productRepository->get($sku);

                        $parentId = $this->configurableType->getParentIdsByChild($product->getId());

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

                        } else {

                            $buyRequest = $this->serializer->unserialize($quoteItem->getOptionByCode('info_buyRequest')->getValue());

                            $buyRequest['product_id'] = $product->getId();
                            $buyRequest['qty'] = $qty;

                            $updateOptions[] = [
                                'product_id' => $product->getId(),
                                'code' => 'info_buyRequest',
                                'value' => $this->serializer->serialize($buyRequest)
                            ];

                        }

                        // Additional Options

                        $additionalOptions = array();

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

                if ($buyRequest = $quoteItem->getOptionByCode('info_buyRequest')) {
                    $buyRequest = $this->serializer->unserialize($buyRequest->getValue());

                    $attributes = [];

                    foreach ($buyRequest['super_attribute'] as $key => $val) {

                        if (isset($productAttributeOptions[$key])) {

                            $res = array_merge(...array_filter($productAttributeOptions[$key]['values'], function ($v, $k) use ($val) {
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

        }

        return $this->dataOrder;

    }

}
