<?php

namespace Digitalprint\PrintessDesigner\Model\Api;

use Digitalprint\PrintessDesigner\Api\Data\ProductInterface as DataProductInterface;
use Digitalprint\PrintessDesigner\Api\ProductInterface;
use JsonException;
use Magento\Catalog\Api\ProductRepositoryInterface;
use Magento\ConfigurableProduct\Model\Product\Type\Configurable;
use Magento\ConfigurableProduct\Model\ResourceModel\Product\Type\Configurable\Product\CollectionFactory;

class Product implements ProductInterface
{
    /**
     * @var \Digitalprint\PrintessDesigner\Helper\Data
     */
    protected \Digitalprint\PrintessDesigner\Helper\Data $helper;

    /**
     * @var DataProductInterface
     */
    private DataProductInterface $dataProduct;

    /**
     * @var ProductRepositoryInterface
     */
    private ProductRepositoryInterface $productRepository;

    /**
     * @var CollectionFactory
     */
    private CollectionFactory $productCollectionFactory;

    /**
     * @var Configurable
     */
    protected Configurable $configurable;

    public function __construct(
        \Digitalprint\PrintessDesigner\Helper\Data $helper,
        DataProductInterface $dataProduct,
        ProductRepositoryInterface $productRepository,
        CollectionFactory $productCollectionFactory,
        Configurable $configurable
    ) {
        $this->helper = $helper;
        $this->dataProduct = $dataProduct;
        $this->productRepository = $productRepository;
        $this->productCollectionFactory = $productCollectionFactory;
        $this->configurable = $configurable;
    }

    /**
     * @param $product
     * @return array
     * @throws JsonException
     */
    private function getAttributes($product): array
    {
        $attributes = [];

        $attributes[] = [
            'code' => 'printess_template',
            'value' => $product->getData('printess_template'),
        ];

        $attributes[] = [
            'code' => 'printess_document',
            'value' => $product->getData('printess_document'),
        ];

        $formFields = $product->getData('printess_form_fields');

        if (isset($formFields)) {
            $formFields = json_decode($formFields, true, 512, JSON_THROW_ON_ERROR);

            if (is_array($formFields)) {
                foreach ($formFields as $formField) {
                    $attributes[] = [
                        'code' => $formField['pim_attr_name'],
                        'value' => $formField['value'],
                    ];

                    $attributes[] = [
                        'code' => $formField['printess_ff_name'],
                        'value' => $formField['value'],
                    ];
                }

                $attributes[] = [
                    'code' => 'printess_form_fields',
                    'value' => $formFields,
                ];
            }
        }

        return $attributes;
    }

    /**
     * @inheritdoc
     * @throws JsonException
     */
    public function getProduct(string $sku, mixed $super_attribute = []): DataProductInterface
    {
        $dataProduct = clone $this->dataProduct;

        $product = $this->productRepository->get($sku);

        $dataProduct->setSku($product->getSku());
        $dataProduct->setName($product->getName());

        $variants = [];

        if ($product->getTypeId() === Configurable::TYPE_CODE) {
            $children = $this->productCollectionFactory->create();

            $children->setFlag(
                'product_children',
                true
            )->setProductFilter(
                $product
            );

            $childProduct = $this->configurable->getProductByAttributes($super_attribute, $product);
            $childFormFields = $childProduct->getData('printess_form_fields');

            $availableMappings = [];
            if ($this->helper->isJson($childFormFields)) {
                $childFormFields = json_decode($childFormFields, true, 512, JSON_THROW_ON_ERROR);
                $availableMappings = array_column($childFormFields, 'pim_attr_name');
            }

            $productAttributes = $this->configurable->getConfigurableAttributesAsArray($product);

            foreach ($productAttributes as $productAttribute) {
                if (! in_array($productAttribute['attribute_code'], $availableMappings, true)) {
                    $children->addAttributeToFilter($productAttribute['attribute_code'], $super_attribute[$productAttribute['attribute_id']]);
                }
            }

            foreach ($children as $child) {
                $childProduct = $this->productRepository->getById($child->getId());

                $variants[] = [
                    'id' => $child->getId(),
                    'product_id' => $product->getId(),
                    'sku' => $child->getSku(),
                    'name' => $childProduct->getName(),
                    'attributes' => $this->getAttributes($childProduct),
                ];
            }
        } else {
            $variants[] = [
                'id' => $product->getId(),
                'product_id' => $product->getId(),
                'sku' => $product->getSku(),
                'name' => $product->getName(),
                'attributes' => $this->getAttributes($product),
            ];
        }

        $dataProduct->setVariants($variants);

        return $dataProduct;
    }
}
