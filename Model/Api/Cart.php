<?php

namespace Digitalprint\PrintessDesigner\Model\Api;

use Digitalprint\PrintessDesigner\Api\CartInterface;
use Digitalprint\PrintessDesigner\Api\Data\CartInterface as DataCartInterface;
use JsonException;
use Magento\Catalog\Api\ProductRepositoryInterface;
use Magento\Catalog\Model\ProductFactory;
use Magento\Framework\Exception\InputException;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\Session\SessionManagerInterface;
use Magento\Framework\Stdlib\Cookie\CookieMetadataFactory;
use Magento\Framework\Stdlib\Cookie\CookieSizeLimitReachedException;
use Magento\Framework\Stdlib\Cookie\FailureToSendException;
use Magento\Framework\Stdlib\CookieManagerInterface;
use Magento\Store\Model\StoreManagerInterface;
use Twig\Error\LoaderError;
use Twig\Error\SyntaxError;

class Cart implements CartInterface
{

    /**
     * @var DataCartInterface
     */
    private DataCartInterface $dataCart;

    /**
     * @var StoreManagerInterface
     */
    private StoreManagerInterface $storeManager;

    /**
     * @var SessionManagerInterface
     */
    private SessionManagerInterface $sessionManager;

    /**
     * @var CookieManagerInterface
     */
    private CookieManagerInterface $cookieManager;

    /**
     * @var CookieMetadataFactory
     */
    private StoreManagerInterface|CookieMetadataFactory $cookieMetadataFactory;

    /**
     * @var \Magento\Checkout\Model\Cart
     */
    private \Magento\Checkout\Model\Cart $cart;

    /**
     * @var ProductRepositoryInterface
     */
    private ProductRepositoryInterface $productRepository;

    /**
     * @var \Digitalprint\PrintessDesigner\Model\Printess\Product
     */
    private \Digitalprint\PrintessDesigner\Model\Printess\Product $printessProduct;

    /**
     * @param DataCartInterface $dataCart
     * @param StoreManagerInterface $storeManager
     * @param SessionManagerInterface $sessionManager
     * @param CookieManagerInterface $cookieManager
     * @param CookieMetadataFactory $cookieMetadataFactory
     * @param \Magento\Checkout\Model\Cart $cart
     * @param ProductFactory $productFactory
     * @param ProductRepositoryInterface $productRepository
     * @param \Digitalprint\PrintessDesigner\Model\Printess\Product $printessProduct
     */
    public function __construct(
        DataCartInterface $dataCart,
        StoreManagerInterface $storeManager,
        SessionManagerInterface $sessionManager,
        CookieManagerInterface $cookieManager,
        CookieMetadataFactory $cookieMetadataFactory,
        \Magento\Checkout\Model\Cart $cart,
        ProductRepositoryInterface $productRepository,
        \Digitalprint\PrintessDesigner\Model\Printess\Product $printessProduct,
    ) {
        $this->dataCart = $dataCart;
        $this->storeManager = $storeManager;
        $this->sessionManager = $sessionManager;
        $this->cookieManager = $cookieManager;
        $this->cookieMetadataFactory = $cookieMetadataFactory;
        $this->cart = $cart;
        $this->productRepository = $productRepository;
        $this->printessProduct = $printessProduct;
    }

    /**
     * @param string $sku
     * @param int $quantity
     * @param string $saveToken
     * @param string $thumbnailUrl
     * @param mixed $documents
     * @param mixed $formFields
     * @param mixed $priceInfo
     * @return DataCartInterface
     * @throws CookieSizeLimitReachedException
     * @throws FailureToSendException
     * @throws InputException
     * @throws JsonException
     * @throws LocalizedException
     * @throws NoSuchEntityException
     * @throws LoaderError
     * @throws SyntaxError
     */
    public function addToCart(string $sku, int $quantity, string $saveToken, string $thumbnailUrl, mixed $documents, mixed $formFields, mixed $priceInfo)
    {
        $this->dataCart->setStatus('error');

        $productConfiguration = [
            'documents' => $documents,
            'formFields' => $formFields
        ];

        $buyRequest = $this->printessProduct->createBuyRequest($sku, $quantity, $productConfiguration);

        $product = $this->productRepository->get($sku);
        $parentProduct = $this->printessProduct->getParent($product);

        $this->cart->addProduct(!is_null($parentProduct) ? $parentProduct : $product, $buyRequest);
        $this->cart->save();

        $this->invalidateCartCookie();

        $this->dataCart->setStatus('success');

        $this->dataCart->setRedirectUrl(
            $this->storeManager->getStore()->getUrl('checkout/cart', [
                    '_secure' => true
                ])
        );

        return $this->dataCart;
    }

    /**
     * @throws CookieSizeLimitReachedException
     * @throws FailureToSendException
     * @throws InputException
     * @throws JsonException
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
