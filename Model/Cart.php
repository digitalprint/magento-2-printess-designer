<?php

namespace Digitalprint\PrintessDesigner\Model;

use Digitalprint\PrintessDesigner\Api\CartInterface;
use Digitalprint\PrintessDesigner\Api\Data\CartInterface as DataCartInterface;
use Magento\Catalog\Api\ProductRepositoryInterface;
use Magento\Catalog\Model\ProductFactory;
use Magento\Checkout\Model\Session;
use Magento\Checkout\Model\SessionFactory;
use Magento\ConfigurableProduct\Model\Product\Type\Configurable;
use Magento\Framework\DataObject;
use Magento\Framework\Serialize\Serializer\Json;
use Magento\Framework\Session\SessionManagerInterface;
use Magento\Framework\Stdlib\Cookie\CookieMetadataFactory;
use Magento\Framework\Stdlib\CookieManagerInterface;
use Magento\Framework\UrlInterface;

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
     * @var ProductFactory
     */
    private $productFactory;

    /**
     * @var Session
     */
    private $checkoutSession;

    /**
     * @var SessionManagerInterface
     */
    private $sessionManager;

    /**
     * @var CookieManagerInterface
     */
    private $cookieManager;

    /**
     * @var CookieMetadataFactory
     */
    private $cookieMetadataFactory;

    /**
     * @var \Magento\Checkout\Model\Cart
     */
    private $cart;

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

    public function __construct(
        DataCartInterface $dataCart,
        Json $json,
        ProductFactory $productFactory,
        Session $checkoutSession,
        SessionManagerInterface $sessionManager,
        CookieManagerInterface $cookieManager,
        CookieMetadataFactory $cookieMetadataFactory,
        \Magento\Checkout\Model\Cart $cart,
        ProductRepositoryInterface $productRepository,
        Configurable $configurableType,
        UrlInterface $urlBuilder
    ) {
        $this->dataCart = $dataCart;
        $this->json = $json;
        $this->productFactory = $productFactory;
        $this->checkoutSession = $checkoutSession;
        $this->sessionManager = $sessionManager;
        $this->cookieManager = $cookieManager;
        $this->cookieMetadataFactory = $cookieMetadataFactory;
        $this->cart = $cart;
        $this->productRepository = $productRepository;
        $this->configurableType = $configurableType;
        $this->urlBuilder = $urlBuilder;
    }


    /**
     * @param $sku
     * @param $quantity
     * @param $saveToken
     * @param $thumbnailUrl
     * @param $documents
     * @param $priceInfo
     * @return DataCartInterface
     * @throws \Magento\Framework\Exception\InputException
     * @throws \Magento\Framework\Exception\LocalizedException
     * @throws \Magento\Framework\Exception\NoSuchEntityException
     * @throws \Magento\Framework\Stdlib\Cookie\CookieSizeLimitReachedException
     * @throws \Magento\Framework\Stdlib\Cookie\FailureToSendException
     */
    public function addToCart($sku, $quantity, $saveToken, $thumbnailUrl, $documents, $priceInfo)
    {

        $this->dataCart->setStatus('error');

        if (!is_null($sku) && !is_null($quantity) && !is_null($saveToken)) {

            $product = $this->productRepository->get($sku);
            $parentId = $this->configurableType->getParentIdsByChild($product->getId());

            if (($parentId = reset($parentId)) !== false) {

                $parentProduct = $this->productFactory->create()->load($parentId);
                $productAttributeOptions = $this->configurableType->getConfigurableAttributesAsArray($parentProduct);

                $options = [];
                foreach ($productAttributeOptions as $option) {
                    $options[$option['attribute_id']] =  $product->getData($option['attribute_code']);
                }
                $buyRequest = new DataObject(['product_id' => $product->getId(), 'qty' => $quantity, 'super_attribute' => $options]);

                $this->cart->addProduct($parentProduct, $buyRequest);
                $this->cart->save();

                $this->invalidateCartCookie();

                $this->dataCart->setStatus('success');

            } else {

                $buyRequest = new DataObject(['product_id' => $product->getId(), 'qty' => $quantity]);

                $this->cart->addProduct($product, $buyRequest);
                $this->cart->save();

                $this->invalidateCartCookie();

                $this->dataCart->setStatus('success');
            }

            $this->dataCart->setRedirectUrl($this->urlBuilder->getUrl('checkout/cart', ['_secure' => true]));

        }

        return $this->dataCart;

    }

    /**
     * @throws \Magento\Framework\Stdlib\Cookie\FailureToSendException
     * @throws \Magento\Framework\Stdlib\Cookie\CookieSizeLimitReachedException
     * @throws \Magento\Framework\Exception\InputException
     */
    public function invalidateCartCookie(): void
    {

        $cookie = $this->cookieManager->getCookie('section_data_ids');

        if ($cookie) {
            $data = json_decode($cookie, true, 512, JSON_THROW_ON_ERROR);

            if (!isset($data['cart'])) {
                $data['cart'] = date('U');
            }

            $data['cart'] += 1000;

            $meta = $this
                ->cookieMetadataFactory
                ->createPublicCookieMetadata()
                ->setPath('/')
                ->setDomain($this->sessionManager->getCookieDomain());

            $this->cookieManager->setPublicCookie('section_data_ids', json_encode($data, JSON_THROW_ON_ERROR), $meta);
        }

    }
}
