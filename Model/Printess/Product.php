<?php

namespace Digitalprint\PrintessDesigner\Model\Printess;

use Digitalprint\PrintessDesigner\Model\Adjustment;
use Digitalprint\PrintessDesigner\Model\SupplierParameter;
use JsonException;
use Magento\Catalog\Api\ProductRepositoryInterface;
use Magento\Catalog\Model\Product\Type\Price;
use Magento\Catalog\Model\ProductFactory;
use Magento\ConfigurableProduct\Model\Product\Type\Configurable;
use Magento\Customer\Model\ResourceModel\GroupRepository;
use Magento\Customer\Model\Session;
use Magento\Framework\DataObject;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Store\Model\StoreManagerInterface;
use Magento\Tax\Model\Calculation;
use Twig\Error\LoaderError;
use Twig\Error\SyntaxError;

class Product {

    /**
     * @var ProductRepositoryInterface
     */
    private ProductRepositoryInterface $productRepository;

    /**
     * @var ProductFactory
     */
    private ProductFactory $productFactory;

    /**
     * @var StoreManagerInterface
     */
    private StoreManagerInterface $storeManager;

    /**
     * @var Session
     */
    private Session $customerSession;

    /**
     * @var GroupRepository
     */
    private GroupRepository $groupRepository;

    /**
     * @var Configurable
     */
    private Configurable $configurableType;

    /**
     * @var SupplierParameter
     */
    private SupplierParameter $supplierParameter;

    /**
     * @var Adjustment
     */
    private Adjustment $adjustment;

    /**
     * @var Calculation
     */
    private Calculation $taxCalculation;


    /**
     * @param StoreManagerInterface $storeManager
     * @param Session $customerSession
     * @param GroupRepository $groupRepository
     * @param ProductRepositoryInterface $productRepository
     * @param ProductFactory $productFactory
     * @param Configurable $configurableType
     * @param SupplierParameter $supplierParameter
     * @param Adjustment $adjustment
     * @param Calculation $taxCalculation
     */
    public function __construct(
        StoreManagerInterface $storeManager,
        Session $customerSession,
        GroupRepository $groupRepository,
        ProductRepositoryInterface $productRepository,
        ProductFactory $productFactory,
        Configurable $configurableType,
        SupplierParameter $supplierParameter,
        Adjustment $adjustment,
        Calculation $taxCalculation
    ) {
        $this->storeManager = $storeManager;
        $this->customerSession = $customerSession;
        $this->groupRepository = $groupRepository;
        $this->productRepository = $productRepository;
        $this->productFactory = $productFactory;
        $this->configurableType = $configurableType;
        $this->supplierParameter = $supplierParameter;
        $this->adjustment = $adjustment;
        $this->taxCalculation = $taxCalculation;
    }


    /**
     * @param $product
     * @return \Magento\Catalog\Model\Product|null
     */
    public function getParent($product)
    {
        $parentId = $this->configurableType->getParentIdsByChild($product->getId());

        if (($parentId = reset($parentId)) !== false) {
            return $this->productFactory->create()->load($parentId);
        }

        return null;

    }

    /**
     * @param $product
     * @param $productConfiguration
     * @return array|mixed|string
     * @throws JsonException
     * @throws LoaderError
     * @throws SyntaxError
     */
    public function getSupplierParameter($product, $productConfiguration) {

        $parentProduct = $this->getParent($product);

        return $this->supplierParameter->createSupplierParameter(!is_null($product->getData('printess_supplier_parameter')) ? $product : $parentProduct, $productConfiguration);
    }

    /**
     * @param $product
     * @param $productConfiguration
     * @return array
     * @throws JsonException
     * @throws LoaderError
     * @throws SyntaxError
     */
    public function getCustomOptions($product, $productConfiguration)
    {

        $customOptions = [];

        $parentProduct = $this->getParent($product);
        $supplierParameter = $this->getSupplierParameter($product, $productConfiguration);

        if (!is_null($parentProduct)) {
            $options = $parentProduct->getOptions();
        } else {
            $options = $product->getOptions();
        }

        foreach ($options as $option) {

            if ($option->getType() === SupplierParameter::TYPE_NAME && isset($supplierParameter[$option->getTitle()])) {

                foreach ($option->getValues() as $value) {

                    if ($supplierParameter[$option->getTitle()] === $value->getTitle()) {
                        $customOptions[$option->getOptionId()] = $value->getOptionTypeId();
                    }
                }
            }

            if ($option->getType() === Adjustment::TYPE_NAME) {
                $customOptions[$option->getOptionId()] = $this->adjustment->getAdjustment($option->getTitle(), $supplierParameter);
            }

        }

        return $customOptions;

    }

    /**
     * @param $sku
     * @param $qty
     * @param $productConfiguration
     * @return DataObject
     * @throws JsonException
     * @throws NoSuchEntityException
     * @throws LoaderError
     * @throws SyntaxError
     */
    public function createBuyRequest($sku, $qty, $productConfiguration) {

        $attributes = [];

        $product = $this->productRepository->get($sku);

        $parentId = $this->configurableType->getParentIdsByChild($product->getId());

        if (($parentId = reset($parentId)) !== false) {

            $parentProduct = $this->getParent($product);

            $supplierParameter = $this->supplierParameter->createSupplierParameter(!is_null($product->getData('printess_supplier_parameter')) ? $product : $parentProduct, $productConfiguration);

            $options = $this->getCustomOptions($product, $supplierParameter, $productConfiguration);

            $productAttributes = $this->configurableType->getConfigurableAttributesAsArray($parentProduct);
            foreach ($productAttributes as $attribute) {
                $attributes[$attribute['attribute_id']] = $product->getData($attribute['attribute_code']);
            }

        } else {
            $supplierParameter = $this->supplierParameter->createSupplierParameter($product, $productConfiguration);
            $options = $this->getCustomOptions($product, $supplierParameter, $productConfiguration);
        }

        return new DataObject([
            'product_id' => !is_null($parentProduct) ? $parentProduct->getId() : $product->getId(),
            'qty' => $qty,
            'super_attribute' => $attributes,
            'options' => $options
        ]);

    }

    /**
     * @param $product
     * @param $qty
     * @param $productConfiguration
     * @return float
     * @throws JsonException
     * @throws NoSuchEntityException
     * @throws LoaderError
     * @throws SyntaxError
     */
    public function getPrice($product, $qty, $productConfiguration) {

        $buyRequest = $this->createBuyRequest($product->getSku(), $qty, $productConfiguration);

        $parentProduct = $this->getParent($product);

        if (!is_null($parentProduct)) {
            $parentProduct->getTypeInstance()->prepareForCart($buyRequest, $parentProduct);
            return $parentProduct->getFinalPrice($qty);
        }

        $product->getTypeInstance()->prepareForCart($buyRequest, $product);
        return $product->getFinalPrice($qty);

    }

    /**
     * @param $sku
     * @return float|int
     * @throws LocalizedException
     * @throws NoSuchEntityException
     */
    public function getTaxRatePercent($sku) {

        $product = $this->productRepository->get($sku);

        $productTaxClassId = $product->getAttributeText('tax_class_id');

        if ($productTaxClassId) {

            $store = $this->storeManager->getStore();
            $groupId = $this->customerSession->getCustomerGroupId();
            $group = $this->groupRepository->getById($groupId);
            $customerTaxClassId = $group->getTaxClassId();

            $request = $this->taxCalculation->getRateRequest(null, null, $customerTaxClassId, $store);
            $request->setData('product_class_id', $productTaxClassId);

            $taxPercent = $this->taxCalculation->getRate($request);

            if ($taxPercent) {
                return $taxPercent;
            }
        }

        return 0;

    }

}
