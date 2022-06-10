<?php

namespace Digitalprint\PrintessDesigner\Block;

use Magento\Catalog\Api\ProductRepositoryInterface;
use Magento\Catalog\Pricing\Price\FinalPrice;
use Magento\ConfigurableProduct\Api\LinkManagementInterface;
use Magento\ConfigurableProduct\Model\Product\Type\Configurable;
use Magento\Customer\Model\Session;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\Pricing\Render;
use Magento\Framework\Serialize\SerializerInterface;
use Magento\Framework\View\Element\Template;
use Magento\Framework\View\Element\Template\Context;
use Magento\Store\Model\ScopeInterface;

class Designer extends Template
{

    /**
     * @var SerializerInterface
     */
    protected $serializer;
    /**
     * @var ProductRepositoryInterface
     */
    protected $productRepository;
    /**
     * @var Configurable
     */
    private $configurable;
    /**
     * @var LinkManagementInterface
     */
    protected $linkManagement;
    /**
     * @var ScopeConfigInterface
     */
    protected $scopeConfig;

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
     * @param SerializerInterface $serializer
     * @param ProductRepositoryInterface $productRepository
     * @param Configurable $configurable
     * @param LinkManagementInterface $linkManagement
     * @param ScopeConfigInterface $scopeConfig
     * @param array $data
     */
    public function __construct(
        Context $context,
        SerializerInterface $serializer,
        ProductRepositoryInterface $productRepository,
        Configurable $configurable,
        LinkManagementInterface $linkManagement,
        ScopeConfigInterface $scopeConfig,
        array $data = []
    ) {
        $this->serializer = $serializer;
        $this->productRepository = $productRepository;
        $this->configurable = $configurable;
        $this->linkManagement = $linkManagement;
        $this->scopeConfig = $scopeConfig;

        parent::__construct($context, $data);
    }

    public function _prepareLayout()
    {
        $this->pageConfig->getTitle()->set(sprintf("%s - %s", $this->getName(), __('Designer')));
        return parent::_prepareLayout();
    }

    /**
     * @return string
     * @throws \Magento\Framework\Exception\NoSuchEntityException
     */
    protected function getName(): string
    {
        $sku = $this->getRequest()->getParam('sku');
        $product = $this->productRepository->get($sku);

        return $product->getName();
    }


    /**
     * @param $product
     * @return string
     * @throws \Magento\Framework\Exception\LocalizedException
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
     * @throws \Magento\Framework\Exception\NoSuchEntityException
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
     * @throws \Magento\Framework\Exception\LocalizedException
     * @throws \Magento\Framework\Exception\NoSuchEntityException
     */
    public function getJsonVariants(): string
    {
        $variants = array();

        $sku = $this->getRequest()->getParam('sku');
        $product = $this->productRepository->get($sku);

        if ($product->getTypeId() === 'configurable') {

            $children = $this->linkManagement->getChildren($product->getSku());

            foreach($children as $child) {

                $childProduct = $this->productRepository->get($child->getSku());

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

            $formFields = json_decode($product->getData('printess_form_fields'), true);

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
     * @throws \Magento\Framework\Exception\NoSuchEntityException
     * @throws \JsonException
     */
    public function getJsonConfig(): string
    {
        $storeScope = ScopeInterface::SCOPE_STORE;

        $sku = $this->getRequest()->getParam('sku');
        $superAttribute = $this->getRequest()->getParam('super_attribute');

        $product = $this->productRepository->get($sku);
        $childProduct = $this->configurable->getProductByAttributes($superAttribute, $product);

        $startDesign = $this->getRequest()->getParam('startDesign');

        $saveToken = $this->getRequest()->getParam('save_token');

        $config = array();

        $config['shopToken'] = $this->scopeConfig->getValue(self::XML_PATH_DESIGNER_SHOP_TOKEN, $storeScope);

        if (!is_null($saveToken)) {
            $config['templateName'] = $saveToken;
        } else {
            $config['templateName'] = !(is_null($childProduct)) && !is_null($childProduct->getData('printess_template')) ? $childProduct->getData('printess_template') : $product->getData('printess_template');
        }

        $config['mergeTemplates'] = [];
        $snippetFields = ['printess_layout_snippets', 'printess_group_snippets'];

        foreach($snippetFields as $snippetField) {

            $data = [];

            $productConfig = $this->getPrintessConfig($snippetField, $sku, $superAttribute);

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

        if (is_null($startDesign)) {
            $startDesign = $this->getPrintessConfig('printess_start_design', $sku, $superAttribute);
        }

        if (!is_null($startDesign) && isset($startDesign['templateName'], $startDesign['documentName'])) {
            $config['startDesign'] = $startDesign;

            if (!isset($config['startDesign']['templateVersion'])) {
                $config['startDesign']['templateVersion'] = 'published';
            }
            if (!isset($config['startDesign']['mode'])) {
                $config['startDesign']['mode'] = 'layout';
            }

        }

        $config['sku'] = !is_null($childProduct) ? $childProduct->getSku() : $product->getSku();
        $config['variant'] = !is_null($childProduct) ? $childProduct->getSku() : $product->getSku();

        $config['formFields'] = [];

        if (is_null($saveToken) && !is_null($childProduct)) {

            $formFields = json_decode($childProduct->getData('printess_form_fields'), true);

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

}
