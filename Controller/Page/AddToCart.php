<?php

namespace Digitalprint\PrintessDesigner\Controller\Page;

use Magento\Catalog\Api\ProductRepositoryInterface;
use Magento\Checkout\Model\SessionFactory;
use Magento\ConfigurableProduct\Model\Product\Type\Configurable;
use Magento\Framework\App\Action\Action;
use Magento\Framework\App\Action\Context;
use Magento\Framework\Controller\Result\JsonFactory;
use Magento\Framework\Controller\ResultInterface;
use Magento\Framework\DataObject;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\Serialize\Serializer\Json;
use Magento\Quote\Api\CartRepositoryInterface;

class AddToCart extends Action
{

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
     * @var JsonFactory
     */
    private $jsonResultFactory;

    /**
     * @param Context $context
     * @param Json $json
     * @param SessionFactory $checkoutSession
     * @param CartRepositoryInterface $cartRepository
     * @param ProductRepositoryInterface $productRepository
     * @param Configurable $configurableType
     * @param JsonFactory $jsonResultFactory
     */
    public function __construct(
        Context $context,
        Json $json,
        SessionFactory $checkoutSession,
        CartRepositoryInterface $cartRepository,
        ProductRepositoryInterface $productRepository,
        Configurable $configurableType,
        JsonFactory $jsonResultFactory
    ) {
        $this->json = $json;
        $this->checkoutSession = $checkoutSession;
        $this->cartRepository = $cartRepository;
        $this->productRepository = $productRepository;

        $this->configurableType = $configurableType;
        $this->jsonResultFactory = $jsonResultFactory;
        parent::__construct($context);
    }

    /**
     * @return \Magento\Framework\App\ResponseInterface|\Magento\Framework\Controller\Result\Json|ResultInterface
     * @throws LocalizedException
     * @throws \Magento\Framework\Exception\NoSuchEntityException
     */
    public function execute()
    {

        $result = $this->jsonResultFactory->create();
        $response = array();

        $sku = $this->getRequest()->getParam('sku');
        $quantity = $this->getRequest()->getParam('quantity');
        $saveToken = $this->getRequest()->getParam('saveToken');
        $thumbnailUrl = $this->getRequest()->getParam('thumbnailUrl');

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

                $response['status'] = 'success';

            } else {

                $session = $this->checkoutSession->create();
                $quote = $session->getQuote();
                $quote->addProduct($product, $quantity);

                $this->cartRepository->save($quote);
                $session->replaceQuote($quote)->unsLastRealOrderId();

                $response['status'] = 'success';
            }

            $response['checkout_url'] =  $this->_url->getUrl('checkout/cart', ['_secure' => true]);

        } else {
            $response['status'] = 'error';
        }

        return  $result->setData($response);

    }

}
