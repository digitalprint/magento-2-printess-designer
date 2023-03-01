<?php

namespace Digitalprint\PrintessDesigner\Model\Api;

use Digitalprint\PrintessDesigner\Api\Data\VariantInterface as DataVariantInterface;
use Digitalprint\PrintessDesigner\Api\VariantInterface;
use Digitalprint\PrintessDesigner\Model\Printess\Product as PrintessProduct;
use Magento\Catalog\Api\ProductRepositoryInterface;
use Magento\Catalog\Model\ProductFactory;

class Variant implements VariantInterface
{

    /**
     * @var DataVariantInterface
     */
    private DataVariantInterface $dataVariant;

    /**
     * @var ProductRepositoryInterface
     */
    private ProductRepositoryInterface $productRepository;

    /**
     * @var PrintessProduct
     */
    private PrintessProduct $printessProduct;

    /**
     * @param DataVariantInterface $dataVariant
     * @param ProductRepositoryInterface $productRepository
     * @param PrintessProduct $printessProduct
     */
    public function __construct(
        DataVariantInterface $dataVariant,
        ProductRepositoryInterface $productRepository,
        PrintessProduct $printessProduct
    ) {
        $this->dataVariant = $dataVariant;
        $this->productRepository = $productRepository;
        $this->printessProduct = $printessProduct;
    }

    /**
     * @inheritdoc
     */
    public function getVariant(string $sku, mixed $documents, mixed $formFields)
    {
        $dataVariant = clone $this->dataVariant;

        $product = $this->productRepository->get($sku);

        $dataVariant->setName($product->getName());
        $dataVariant->setSku($product->getSku());

        $price = $this->printessProduct->getPrice($product, 1, [
            'documents' => $documents,
            'formFields' => $formFields
        ]);

        $dataVariant->setPrices([
            [
                'price' => [
                    'type' => 'price',
                    'price' => $price
                ]
            ]
        ]);

        $dataVariant->setLegalNotice($this->printessProduct->getLegalNotice($sku));

        return $dataVariant;
    }

}
