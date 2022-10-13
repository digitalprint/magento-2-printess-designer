<?php

namespace Digitalprint\PrintessDesigner\Block;

use Magento\Backend\Model\Auth\Session as AuthSession;
use Magento\Catalog\Api\ProductRepositoryInterface;
use Magento\Catalog\Model\Product;
use Magento\Catalog\Pricing\Price\FinalPrice;
use Magento\ConfigurableProduct\Api\LinkManagementInterface;
use Magento\ConfigurableProduct\Model\Product\Type\Configurable;
use Magento\Customer\Model\Session;
use Magento\Framework\App\Area;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\App\State;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\Locale\Resolver;
use Magento\Framework\Pricing\Render;
use Magento\Framework\Serialize\SerializerInterface;
use Magento\Framework\View\Element\Template;
use Magento\Framework\View\Element\Template\Context;
use Magento\Integration\Model\Oauth\TokenFactory;
use Magento\Store\Model\ScopeInterface;

class Designer extends Template
{

    /**
     * @var Store
     */
    protected $store;

    /**
     * @var State
     */
    protected $state;

    /**
     * @var AuthSession
     */
    protected $authSession;

    /**
     * @var Session
     */
    protected $customerSession;

    /**
     * @var SerializerInterface
     */
    protected $serializer;

    /**
     * @var Product
     */
    protected $productModel;

    /**
     * @var ProductRepositoryInterface
     */
    protected $productRepository;

    /**
     * @var Configurable
     */
    protected $configurable;

    /**
     * @var LinkManagementInterface
     */
    protected $linkManagement;

    /**
     * @var ScopeConfigInterface
     */
    protected $scopeConfig;

    /**
     * @var TokenFactory
     */
    protected $tokenFactory;

    /**
     * @var string
     */
    private const XML_PATH_DESIGNER_SHOP_TOKEN = 'designer/api_token/shop_token';
    /**
     * @var string
     */
    private const XML_PATH_DESIGNER_PRIMARY_COLOR = 'designer/colors/primary_color';
    /**
     * @var string
     */
    private const XML_PATH_DESIGNER_PRIMARY_COLOR_HOVER = 'designer/colors/primary_color_hover';

    /**
     * @param Context $context
     * @param Resolver $store
     * @param State $state
     * @param AuthSession $authSession
     * @param Session $customerSession
     * @param SerializerInterface $serializer
     * @param Product $productModel
     * @param ProductRepositoryInterface $productRepository
     * @param Configurable $configurable
     * @param LinkManagementInterface $linkManagement
     * @param ScopeConfigInterface $scopeConfig
     * @param TokenFactory $tokenFactory
     * @param array $data
     */
    public function __construct(
        Context $context,
        Resolver $store,
        State $state,
        AuthSession $authSession,
        Session $customerSession,
        SerializerInterface  $serializer,
        Product $productModel,
        ProductRepositoryInterface $productRepository,
        Configurable $configurable,
        LinkManagementInterface $linkManagement,
        ScopeConfigInterface $scopeConfig,
        TokenFactory $tokenFactory,
        array $data = []
    ) {
        $this->store = $store;
        $this->state = $state;
        $this->authSession = $authSession;
        $this->customerSession = $customerSession;
        $this->serializer = $serializer;
        $this->productModel = $productModel;
        $this->productRepository = $productRepository;
        $this->configurable = $configurable;
        $this->linkManagement = $linkManagement;
        $this->scopeConfig = $scopeConfig;
        $this->tokenFactory = $tokenFactory;

        parent::__construct($context, $data);
    }

    public function _prepareLayout()
    {
        $this->pageConfig->getTitle()->set(sprintf("%s - %s", $this->getName(), __('Designer')));
        return parent::_prepareLayout();
    }

    /**
     * @return string
     * @throws NoSuchEntityException
     */
    protected function getName(): string
    {
        $sku = $this->getRequest()->getParam('sku');
        return $this->productRepository->get($sku)->getName();
    }


    /**
     * @param $product
     * @return string
     * @throws LocalizedException
     */
    protected function renderPriceHtml($product): string
    {
        $priceRender = $this->getLayout()->getBlock('product.price.render.designer');

        $price = '';
        if ($priceRender) {
            $price = $priceRender->render(
                FinalPrice::PRICE_CODE,
                $product,
                [
                    'zone' => Render::ZONE_ITEM_LIST
                ]
            );
        }

        return $price;
    }

    /**
     * @return array
     */
    public function getCustomColors(): array
    {
        $storeScope = ScopeInterface::SCOPE_STORE;

        return [
            'primary_color' => $this->scopeConfig->getValue(self::XML_PATH_DESIGNER_PRIMARY_COLOR, $storeScope),
            'primary_color_hover' => $this->scopeConfig->getValue(self::XML_PATH_DESIGNER_PRIMARY_COLOR_HOVER, $storeScope),
        ];
    }

    /**
     * @throws NoSuchEntityException
     * @throws \JsonException
     */
    public function getPrintessConfig($path = null, $sku = null, $superAttribute = null) {

        $product = $this->productRepository->get($sku);
        $childProduct = $this->configurable->getProductByAttributes($superAttribute, $product);

        $value = null;
        if (!(is_null($childProduct)) && !is_null($childProduct->getData($path))) {
            $value = $childProduct->getData($path);
        } elseif (!is_null($product->getData($path))) {
            $value = $product->getData($path);
        }

        if (is_null($value)) {
            return [];
        }

        return json_decode($value, true, 512, JSON_THROW_ON_ERROR);

    }

    /**
     * @return string
     * @throws LocalizedException
     * @throws NoSuchEntityException
     */
    public function getJsonVariants(): string
    {
        $variants = array();

        $sku = $this->getRequest()->getParam('sku');
        $product = $this->productRepository->get($sku);

        if ($product->getTypeId() === Configurable::TYPE_CODE) {

            if ($this->state->getAreaCode() === Area::AREA_ADMINHTML) {
                $configProduct = $this->productModel->load($product->getId());
                $children = $configProduct->getTypeInstance()->getUsedProducts($configProduct);
            } else {
                $children = $this->linkManagement->getChildren($product->getSku());
            }

            foreach($children as $child) {

                $childProduct = $this->productRepository->getById($child->getId());

                $attributes = array();

                $attributes[] = array(
                    'code' => 'printess_template',
                    'value' => $childProduct->getData('printess_template')
                );

                $attributes[] = array(
                    'code' => 'printess_document',
                    'value' => $childProduct->getData('printess_document')
                );

                $formFields = json_decode($childProduct->getData('printess_form_fields'), true);

                if (is_array($formFields)) {

                    foreach ($formFields as $formField) {

                        $attributes[] = array(
                            'code' => $formField['pim_attr_name'],
                            'value' => $formField['value']
                        );

                        $attributes[] = array(
                            'code' => $formField['printess_ff_name'],
                            'value' => $formField['value']
                        );

                    }

                    $attributes[] = array(
                        'code' => 'printess_form_fields',
                        'value' => $formFields
                    );

                }

                $variants[] = array(
                    'id' => $child->getId(),
                    'product_id' => $product->getId(),
                    'sku' => $child->getSku(),
                    'name' => $child->getName(),
                    'attributes' => $attributes,
                    'price' => $this->renderPriceHtml($childProduct)
                );

            }

        } else {

            $attributes = array();

            $attributes[] = array(
                'code' => 'printess_template',
                'value' => $product->getData('printess_template')
            );

            $attributes[] = array(
                'code' => 'printess_document',
                'value' => $product->getData('printess_document')
            );

            $formFields = $product->getData('printess_form_fields');

            if(isset($formFields)) {
                $formFields = json_decode($formFields, true);
            }

            if (is_array($formFields)) {

                foreach ($formFields as $formField) {

                    $attributes[] = array(
                        'code' => $formField['pim_attr_name'],
                        'value' => $formField['value']
                    );

                    $attributes[] = array(
                        'code' => $formField['printess_ff_name'],
                        'value' => $formField['value']
                    );

                }

                $attributes[] = array(
                    'code' => 'printess_form_fields',
                    'value' => $formFields
                );

            }

            $variants[] = array(
                'id' => $product->getId(),
                'product_id' => $product->getId(),
                'sku' => $product->getSku(),
                'name' => $product->getName(),
                'attributes' => $attributes,
                'price' => $this->renderPriceHtml($product)
            );

        }

        return $this->serializer->serialize($variants);

    }

    /**
     * @return string
     * @throws NoSuchEntityException
     * @throws \JsonException
     */
    public function getJsonConfig(): string
    {
        $storeScope = ScopeInterface::SCOPE_STORE;

        $params = $this->getRequest()->getParams();

        foreach(['sku', 'super_attribute', 'startDesign', 'save_token'] as $key) {
            if (!array_key_exists($key, $params)) {
                $params[$key] = null;
            }
        }

        if (!array_key_exists('qty', $params)) {
            $params['qty'] = 1;
        }

        $product = $this->productRepository->get($params['sku']);
        $childProduct = $this->configurable->getProductByAttributes($params['super_attribute'], $product);

        $config = array();

        $config['areaCode'] = $this->state->getAreaCode();

        $config['translationKey'] = strstr($this->store->getLocale(), '_', true);

        $config['shopToken'] = $this->scopeConfig->getValue(self::XML_PATH_DESIGNER_SHOP_TOKEN, $storeScope);

        $config['basketId'] = $this->customerSession->getSessionId();

        if ($this->state->getAreaCode() === Area::AREA_ADMINHTML) {
            $config['orderId'] = $params['order_id'];
            $config['itemId'] = $params['item_id'];
        }

        if (!is_null($params['save_token'])) {
            $config['templateName'] = $params['save_token'];
        } else {
            $config['templateName'] = !(is_null($childProduct)) && !is_null($childProduct->getData('printess_template')) ? $childProduct->getData('printess_template') : $product->getData('printess_template');
        }

        $config['mergeTemplates'] = [];
        $snippetFields = ['printess_layout_snippets', 'printess_group_snippets'];

        foreach($snippetFields as $snippetField) {

            $data = [];

            $productConfig = $this->getPrintessConfig($snippetField, $params['sku'], $params['super_attribute']);

            foreach ($productConfig as $section) {

                if (isset($section['id'])) {

                    foreach ($section as $key => $val) {
                        $data[$key] = $val;
                    }

                    if (!isset($data['templateName']) && isset($data['id'])) {
                        $data['templateName'] = $data['id'];
                        unset($data['id']);
                    }

                    $config['mergeTemplates'][] = $data;

                }
            }

        }

        $config['startDesign'] = null;

        if (is_null($params['save_token'])) {

            $startDesign = !is_null($params['startDesign']) ? $params['startDesign'] : $this->getPrintessConfig('printess_start_design', $params['sku'], $params['super_attribute']);

            if (!is_null($startDesign) && isset($startDesign['templateName'], $startDesign['documentName'])) {
                $config['startDesign'] = $startDesign;

                if (!isset($config['startDesign']['templateVersion'])) {
                    $config['startDesign']['templateVersion'] = 'published';
                }
                if (!isset($config['startDesign']['mode'])) {
                    $config['startDesign']['mode'] = 'layout';
                }

            }

        }

        $config['sku'] = !is_null($childProduct) ? $childProduct->getSku() : $product->getSku();
        $config['variant'] = !is_null($childProduct) ? $childProduct->getSku() : $product->getSku();

        $config['qty'] = $params['qty'];

        $config['formFields'] = [];

        if (is_null($params['save_token'])) {

            $formFields = !is_null($childProduct) ? json_decode($childProduct->getData('printess_form_fields'), true) : json_decode($product->getData('printess_form_fields'), true);

            if (is_array($formFields)) {
                foreach ($formFields as $formField) {
                    $config['formFields'][] = array(
                        'name' => $formField['printess_ff_name'],
                        'value' => $formField['value']
                    );
                }
            }

        }

        return $this->serializer->serialize($config);

    }

    /**
     * @return bool|string
     * @throws LocalizedException
     */
    public function getSession() {

        if ($this->state->getAreaCode() === Area::AREA_ADMINHTML) {

            $userId = $this->authSession->getUser()->getId();

            $config = [
                'session_id' => $this->authSession->getSessionId(),
                'user_id' => $userId
            ];

            $tokenFactory = $this->tokenFactory->create();
            $adminToken = $tokenFactory->createAdminToken($userId)->getToken();

            $config['admin_token'] = $adminToken;

        } else {
            $config = [
                'session_id' => $this->customerSession->getSessionId(),
                'customer_id' => null,
                'customer_token' => null
            ];
        }

        return $this->serializer->serialize($config);

    }

}
