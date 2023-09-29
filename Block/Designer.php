<?php

namespace Digitalprint\PrintessDesigner\Block;

use Digitalprint\PrintessDesigner\Model\Printess\Product as PrintessProduct;
use Digitalprint\PrintessDesigner\Model\SupplierParameter;
use JsonException;
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
use Magento\Store\Model\StoreManagerInterface;
use Magento\Tax\Helper\Data as taxHelper;

class Designer extends Template
{
    /**
     * @var \Digitalprint\PrintessDesigner\Helper\Data
     */
    protected \Digitalprint\PrintessDesigner\Helper\Data $helper;

    /**
     * @var taxHelper
     */
    protected taxHelper $taxHelper;

    /**
     * @var StoreManagerInterface
     */
    protected StoreManagerInterface $storeManager;

    /**
     * @var Resolver
     */
    protected Resolver $store;

    /**
     * @var State
     */
    protected State $state;

    /**
     * @var AuthSession
     */
    protected AuthSession $authSession;

    /**
     * @var
     */
    protected $groupRepository;

    /**
     * @var Session
     */
    protected Session $customerSession;

    /**
     * @var SerializerInterface
     */
    protected SerializerInterface $serializer;

    /**
     * @var Product
     */
    protected Product $productModel;

    /**
     * @var ProductRepositoryInterface
     */
    protected ProductRepositoryInterface $productRepository;

    /**
     * @var PrintessProduct
     */
    protected PrintessProduct $printessProduct;

    /**
     * @var Configurable
     */
    protected Configurable $configurable;

    /**
     * @var LinkManagementInterface
     */
    protected LinkManagementInterface $linkManagement;

    /**
     * @var ScopeConfigInterface
     */
    protected ScopeConfigInterface $scopeConfig;

    /**
     * @var TokenFactory
     */
    protected TokenFactory $tokenFactory;

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
     * @var string
     */
    private const XML_PATH_DESIGNER_DESIGNPICKER_ENABLED = 'designer/designpicker/is_designpicker_enabled';

    /**
     * @var string
     */
    private const XML_PATH_DESIGNER_DESIGNPICKER_PATH = 'designer/designpicker/path';

    /**
     * @var string
     */
    private const XML_PATH_DESIGNER_DESIGNPICKER_CLIENT = 'designer/designpicker/client';

    /**
     * @param Context $context
     * @param \Digitalprint\PrintessDesigner\Helper\Data $helper
     * @param StoreManagerInterface $storeManager
     * @param Resolver $store
     * @param State $state
     * @param AuthSession $authSession
     * @param Session $customerSession
     * @param SerializerInterface $serializer
     * @param Product $productModel
     * @param ProductRepositoryInterface $productRepository
     * @param PrintessProduct $printessProduct
     * @param Configurable $configurable
     * @param LinkManagementInterface $linkManagement
     * @param ScopeConfigInterface $scopeConfig
     * @param TokenFactory $tokenFactory
     * @param taxHelper $taxHelper
     * @param array $data
     */
    public function __construct(
        Context $context,
        \Digitalprint\PrintessDesigner\Helper\Data $helper,
        StoreManagerInterface $storeManager,
        Resolver $store,
        State $state,
        AuthSession $authSession,
        Session $customerSession,
        SerializerInterface $serializer,
        Product $productModel,
        ProductRepositoryInterface $productRepository,
        PrintessProduct $printessProduct,
        Configurable $configurable,
        LinkManagementInterface $linkManagement,
        ScopeConfigInterface $scopeConfig,
        TokenFactory $tokenFactory,
        taxHelper $taxHelper,
        array $data = []
    ) {
        $this->helper = $helper;
        $this->storeManager = $storeManager;
        $this->store = $store;
        $this->state = $state;
        $this->authSession = $authSession;
        $this->customerSession = $customerSession;
        $this->serializer = $serializer;
        $this->productModel = $productModel;
        $this->productRepository = $productRepository;
        $this->printessProduct = $printessProduct;
        $this->configurable = $configurable;
        $this->linkManagement = $linkManagement;
        $this->scopeConfig = $scopeConfig;
        $this->tokenFactory = $tokenFactory;
        $this->taxHelper = $taxHelper;

        parent::__construct($context, $data);
    }

    /**
     * @return Designer
     * @throws NoSuchEntityException
     */
    public function _prepareLayout(): Designer
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
                    'zone' => Render::ZONE_ITEM_LIST,
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
     * @throws JsonException
     */
    public function getPrintessConfig($path = null, $sku = null, $superAttribute = null)
    {
        $product = $this->productRepository->get($sku);
        $childProduct = $this->configurable->getProductByAttributes($superAttribute, $product);

        $value = null;
        if (! (is_null($childProduct)) && ! is_null($childProduct->getData($path))) {
            $value = $childProduct->getData($path);
        } elseif (! is_null($product->getData($path))) {
            $value = $product->getData($path);
        }

        if (! $this->helper->isJson($value)) {
            return [];
        }

        return json_decode($value, true, 512, JSON_THROW_ON_ERROR);
    }

    /**
     * @return string
     * @throws NoSuchEntityException
     * @throws JsonException|LocalizedException
     */
    public function getJsonConfig(): string
    {
        $storeScope = ScopeInterface::SCOPE_STORE;

        $params = $this->getRequest()->getParams();

        foreach (['sku', 'super_attribute', 'startDesign', 'save_token', 'merge1'] as $key) {
            if (! array_key_exists($key, $params)) {
                $params[$key] = null;
            }
        }

        if (! array_key_exists('qty', $params)) {
            $params['qty'] = 1;
        }

        $product = $this->productRepository->get($params['sku']);
        $childProduct = $this->configurable->getProductByAttributes($params['super_attribute'], $product);

        $config = [];

        $config['areaCode'] = $this->state->getAreaCode();
        $config['storeCode'] = $this->storeManager->getstore()->getCode();

        $config['translationKey'] = strstr($this->store->getLocale(), '_', true);

        $config['priceFormat'] = $this->taxHelper->getPriceFormat($this->storeManager->getStore()->getId());

        $config['shopToken'] = $this->scopeConfig->getValue(self::XML_PATH_DESIGNER_SHOP_TOKEN, $storeScope);

        $config['basketId'] = $this->customerSession->getSessionId();

        if ($this->state->getAreaCode() === Area::AREA_ADMINHTML) {
            $config['orderId'] = $params['order_id'];
            $config['itemId'] = $params['item_id'];
        }

        if (! is_null($params['save_token'])) {
            $config['templateName'] = $params['save_token'];
        } else {
            $config['templateName'] = ! (is_null($childProduct)) && ! is_null($childProduct->getData('printess_template')) ? $childProduct->getData('printess_template') : $product->getData('printess_template');
        }

        $config['mergeTemplates'] = [];

        if (! is_null($params['merge1'])) {
            $config['mergeTemplates'][] = [
                'templateName' => $params['merge1'],
                'mergeMode' => 'layout-snippet-no-repeat',
            ];
        }

        $snippetFields = ['printess_layout_snippets', 'printess_group_snippets'];

        foreach ($snippetFields as $snippetField) {
            $productConfig = $this->getPrintessConfig($snippetField, $params['sku'], $params['super_attribute']);

            foreach ($productConfig as $section) {
                $data = [];

                if (isset($section['id'])) {
                    foreach ($section as $key => $val) {
                        $data[$key] = $val;
                    }

                    if (! isset($data['templateName']) && isset($data['id'])) {
                        $data['templateName'] = $data['id'];
                        unset($data['id']);
                    }

                    $config['mergeTemplates'][] = $data;
                }
            }
        }

        $config['startDesign'] = null;

        if (is_null($params['save_token'])) {
            $startDesign = ! is_null($params['startDesign']) ? $params['startDesign'] : $this->getPrintessConfig('printess_start_design', $params['sku'], $params['super_attribute']);

            if (! is_null($startDesign) && isset($startDesign['templateName'], $startDesign['documentName'])) {
                $config['startDesign'] = $startDesign;

                if (! isset($config['startDesign']['templateVersion'])) {
                    $config['startDesign']['templateVersion'] = 'published';
                }
                if (! isset($config['startDesign']['mode'])) {
                    $config['startDesign']['mode'] = 'layout';
                }
            }
        }

        $config['sku'] = $product->getSku();
        $config['superAttribute'] = $params['super_attribute'];
        $config['variant'] = ! is_null($childProduct) ? $childProduct->getSku() : $product->getSku();

        $config['qty'] = $params['qty'];

        $config['formFields'] = [];

        if (is_null($params['save_token'])) {
            $formFields = ! is_null($childProduct) ? $childProduct->getData('printess_form_fields') : $product->getData('printess_form_fields');

            if ($this->helper->isJson($formFields)) {
                $formFields = json_decode($formFields, true, 512, JSON_THROW_ON_ERROR);
            }

            if (is_array($formFields)) {
                foreach ($formFields as $formField) {
                    $config['formFields'][] = [
                        'name' => $formField['printess_ff_name'],
                        'value' => $formField['value'],
                    ];
                }
            }
        }

        $config['snippetPriceCategoryLabels'] = ['', '', '', '', ''];

        $options = ! is_null($childProduct) ? $childProduct->getOptions() : $product->getOptions();

        $config['priceCategoryLabels'] = [];

        foreach ($options as $option) {
            if ($option->getType() === SupplierParameter::TYPE_NAME) {
                $priceTagPrefix = $option->getPriceTagPrefix();
                if ($priceTagPrefix !== '') {
                    foreach ($option->getValues() as $value) {
                        $key = "$priceTagPrefix:{$value->getTitle()}";
                        $config['priceCategoryLabels'][$key] = $value->getPrice() > 0 ? $value->getPrice() : '';
                    }
                }
            }
        }

        return $this->serializer->serialize($config);
    }

    /**
     * @return bool|string
     * @throws JsonException
     * @throws NoSuchEntityException
     */
    public function getDesignPickerConfig()
    {
        $config = [
            'isEnabled' => false,
            'path' => null,
            'locale' => null,
            'client' => null,
            'attributes' => [],
            'designFormat' => 'square',
        ];

        $storeScope = ScopeInterface::SCOPE_STORE;

        if ($this->scopeConfig->getValue(self::XML_PATH_DESIGNER_DESIGNPICKER_ENABLED, $storeScope)) {
            $sku = $this->getRequest()->getParam('sku');
            $superAttribute = $this->getRequest()->getParam('super_attribute');

            $product = $this->productRepository->get($sku);
            $childProduct = $this->configurable->getProductByAttributes($superAttribute, $product);

            $attributes = ! is_null($childProduct) && ! is_null($childProduct->getData('printess_design_picker_attributes')) ? $childProduct->getData('printess_design_picker_attributes') : $product->getData('printess_design_picker_attributes');

            if (! is_null($attributes)) {
                $designFormat = ! is_null($childProduct) && ! is_null($childProduct->getData('printess_design_picker_design_format')) ? $childProduct->getData('printess_design_picker_design_format') : $product->getData('printess_design_picker_design_format');
                if (is_null($designFormat)) {
                    $designFormat = 'square';
                }

                $config['isEnabled'] = true;
                $config['path'] = $this->scopeConfig->getValue(self::XML_PATH_DESIGNER_DESIGNPICKER_PATH, $storeScope);
                $config['locale'] = strstr($this->store->getLocale(), '_', true);
                $config['client'] = $this->scopeConfig->getValue(self::XML_PATH_DESIGNER_DESIGNPICKER_CLIENT, $storeScope);

                $config['attributes'] = [];
                if ($this->helper->isJson($attributes)) {
                    $config['attributes'] = json_decode($attributes, false, 512, JSON_THROW_ON_ERROR);
                }

                $config['designFormat'] = $designFormat;
            }
        }

        return $this->serializer->serialize($config);
    }

    /**
     * @return bool|string
     * @throws LocalizedException
     */
    public function getSession()
    {
        if ($this->state->getAreaCode() === Area::AREA_ADMINHTML) {
            $userId = $this->authSession->getUser()->getId();

            $config = [
                'session_id' => $this->authSession->getSessionId(),
                'user_id' => $userId,
            ];

            $tokenFactory = $this->tokenFactory->create();
            $adminToken = $tokenFactory->createAdminToken($userId)->getToken();

            $config['admin_token'] = $adminToken;
        } else {
            $config = [
                'session_id' => $this->customerSession->getSessionId(),
                'customer_id' => null,
                'customer_token' => null,
            ];
        }

        return $this->serializer->serialize($config);
    }
}
