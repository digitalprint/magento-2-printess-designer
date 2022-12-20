<?php

namespace Digitalprint\PrintessDesigner\Model\Api;

use Digitalprint\PrintessDesigner\Api\Data\ProductInterface as DataProductInterface;
use Digitalprint\PrintessDesigner\Api\ProductInterface;
use JsonException;
use Magento\Catalog\Api\ProductRepositoryInterface;
use Magento\ConfigurableProduct\Api\LinkManagementInterface;
use Magento\ConfigurableProduct\Model\Product\Type\Configurable;

class Product implements ProductInterface
{

    /**
     * @var DataProductInterface
     */
    private DataProductInterface $dataProduct;

    /**
     * @var ProductRepositoryInterface
     */
    private ProductRepositoryInterface $productRepository;

    /**
     * @var LinkManagementInterface
     */
    private LinkManagementInterface $linkManagement;

    public function __construct(
        DataProductInterface $dataProduct,
        ProductRepositoryInterface $productRepository,
        LinkManagementInterface $linkManagement
    ) {
        $this->dataProduct = $dataProduct;
        $this->productRepository = $productRepository;
        $this->linkManagement = $linkManagement;
    }

    /**
     * @param $product
     * @return array
     */
    private function getPrice($product): array
    {
        if ($product->getTypeId() === Configurable::TYPE_CODE) {
            $basePrice = $product->getPriceInfo()->getPrice('regular_price');
            $regularPrice = $basePrice->getMinRegularAmount()->getValue();
        } else {
            $regularPrice = $product->getPriceInfo()->getPrice('regular_price')->getValue();
        }

        $specialPrice = $product->getFinalPrice();

        return [
            'regular_price' => $regularPrice,
            'special_price' => $specialPrice
        ];
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
            'value' => $product->getData('printess_template')
        ];

        $attributes[] = [
            'code' => 'printess_document',
            'value' => $product->getData('printess_document')
        ];

        $formFields = $product->getData('printess_form_fields');

        if (isset($formFields)) {
            $formFields = json_decode($formFields, true, 512, JSON_THROW_ON_ERROR);

            if (is_array($formFields)) {
                foreach ($formFields as $formField) {
                    $attributes[] = [
                        'code' => $formField['pim_attr_name'],
                        'value' => $formField['value']
                    ];

                    $attributes[] = [
                        'code' => $formField['printess_ff_name'],
                        'value' => $formField['value']
                    ];
                }

                $attributes[] = [
                    'code' => 'printess_form_fields',
                    'value' => $formFields
                ];
            }
        }

        return $attributes;
    }

    /**
     * @inheritdoc
     */
    public function getProduct(string $sku): DataProductInterface
    {
        $dataProduct = clone $this->dataProduct;

        $product = $this->productRepository->get($sku);

        $dataProduct->setSku($product->getSku());
        $dataProduct->setName($product->getName());

        $variants = [];

        if ($product->getTypeId() === Configurable::TYPE_CODE) {
            $children = $this->linkManagement->getChildren($product->getSku());

            foreach ($children as $child) {
                $childProduct = $this->productRepository->getById($child->getId());

                $variants[] = [
                    'id' => $child->getId(),
                    'product_id' => $product->getId(),
                    'sku' => $child->getSku(),
                    'name' => $child->getName(),
                    'attributes' =>  $this->getAttributes($childProduct),
                    'price_info' => $this->getPrice($childProduct)
                ];
            }
        } else {
            $variants[] = [
                'id' => $product->getId(),
                'product_id' => $product->getId(),
                'sku' => $product->getSku(),
                'name' => $product->getName(),
                'attributes' => $this->getAttributes($product),
                'price_info' => $this->getPrice($product)
            ];
        }

        $dataProduct->setVariants($variants);

        return $dataProduct;
    }
}
