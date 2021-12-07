<?php

namespace Digitalprint\PrintessDesigner\Model;

use Digitalprint\PrintessDesigner\Api\CartInterface;
use Digitalprint\PrintessDesigner\Api\Data\CartInterface as DataCartInterface;
use Magento\Catalog\Api\ProductRepositoryInterface;
use Magento\Checkout\Model\SessionFactory;
use Magento\ConfigurableProduct\Model\Product\Type\Configurable;
use Magento\Framework\DataObject;
use Magento\Framework\Serialize\Serializer\Json;
use Magento\Framework\UrlInterface;
use Magento\Quote\Api\CartRepositoryInterface;

class Cart implements CartInterface
{

    /**
     * @var DataCartInterface
     */
    private $dataCart;
    /**
     * @var Json
     */
    private $json;
    /**
     * @var SessionFactory
     */
    private $checkoutSession;
    /**
     * @var CartRepositoryInterface
     */
    private $cartRepository;
    /**
     * @var ProductRepositoryInterface
     */
    private $productRepository;
    /**
     * @var Configurable
     */
    private $configurableType;
    /**
     * @var UrlInterface
     */
    private $urlBuilder;

    /**
     * @param DataCartInterface $dataCart
     * @param Json $json
     * @param SessionFactory $checkoutSession
     * @param CartRepositoryInterface $cartRepository
     * @param ProductRepositoryInterface $productRepository
     * @param Configurable $configurableType
     * @param UrlInterface $urlBuilder
     */
    public function __construct(
        DataCartInterface $dataCart,
        Json $json,
        SessionFactory $checkoutSession,
        CartRepositoryInterface $cartRepository,
        ProductRepositoryInterface $productRepository,
        Configurable $configurableType,
        UrlInterface $urlBuilder
    ) {
        $this->dataCart = $dataCart;
        $this->json = $json;
        $this->checkoutSession = $checkoutSession;
        $this->cartRepository = $cartRepository;
        $this->productRepository = $productRepository;
        $this->configurableType = $configurableType;
        $this->urlBuilder = $urlBuilder;
    }

    /**
     * Add to cart
     *
     * @param string $sku
     * @param string $quantity
     * @param string $saveToken
     * @param string $thumbnailUrl
     * @return \Digitalprint\PrintessDesigner\Api\Data\CartInterface
     *
     * @throws \Magento\Framework\Exception\LocalizedException
     */
    public function addToCart($sku, $quantity, $saveToken, $thumbnailUrl)
    {

        $this->dataCart->setStatus('error');

        if (!is_null($sku) && !is_null($quantity) && !is_null($saveToken)) {

            $product = $this->productRepository->get($sku);
            $parentId = $this->configurableType->getParentIdsByChild($product->getId());

            if (($parentId = reset($parentId)) !== false) {

                $parentProduct = $this->productRepository->getById($parentId);
                $parentProduct->addCustomOption('additional_options', $this->json->serialize([
                    'printess_save_token' => [
                        'label' => __("Save Token"),
                        'value' => $saveToken
                    ],
                    'printess_thumbnail_url' => [
                        'label' => __("Thumbnail"),
                        'value' => $thumbnailUrl
                    ]
                ]));

                $productAttributeOptions = $this->configurableType->getConfigurableAttributesAsArray($parentProduct);

                $options = [];
                foreach ($productAttributeOptions as $option) {
                    $options[$option['attribute_id']] =  $product->getData($option['attribute_code']);
                }
                $buyRequest = new DataObject(['product_id' => $product->getId(), 'qty' => $quantity, 'super_attribute' => $options]);

                $session = $this->checkoutSession->create();
                $quote = $session->getQuote();
                $quote->addProduct($parentProduct, $buyRequest);

                $this->cartRepository->save($quote);
                $session->replaceQuote($quote)->unsLastRealOrderId();

                $this->dataCart->setStatus('success');

            } else {

                $session = $this->checkoutSession->create();
                $quote = $session->getQuote();
                $quote->addProduct($product, $quantity);

                $this->cartRepository->save($quote);
                $session->replaceQuote($quote)->unsLastRealOrderId();

                $this->dataCart->setStatus('success');
            }

            $this->dataCart->setCheckoutUrl($this->urlBuilder->getUrl('checkout/cart', ['_secure' => true]));

        }

        return $this->dataCart;

    }
}