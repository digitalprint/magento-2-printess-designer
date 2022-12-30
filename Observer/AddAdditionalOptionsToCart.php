<?php

namespace Digitalprint\PrintessDesigner\Observer;

use Digitalprint\PrintessDesigner\Helper\Data;
use Digitalprint\PrintessDesigner\Model\SupplierParameter;
use JsonException;
use Magento\Catalog\Api\ProductRepositoryInterface;
use Magento\Catalog\Model\ProductFactory;
use Magento\ConfigurableProduct\Model\Product\Type\Configurable;
use Magento\Framework\App\RequestInterface;
use Magento\Framework\Event\Observer as EventObserver;
use Magento\Framework\Event\ObserverInterface;
use Magento\Framework\Serialize\SerializerInterface;

class AddAdditionalOptionsToCart implements ObserverInterface
{

    /**
     * @var \Digitalprint\PrintessDesigner\Helper\Data
     */
    protected \Digitalprint\PrintessDesigner\Helper\Data $helper;

    /**
     * @var RequestInterface
     */
    protected RequestInterface $request;
    /**
     * @var SerializerInterface
     */
    protected SerializerInterface $serializer;

    protected $productFactory;

    protected $productRepository;

    protected Configurable $configurable;

    protected SupplierParameter $supplierParameter;

    /**
     * @param Data $helper
     * @param RequestInterface $request
     * @param SerializerInterface $serializer
     * @param ProductFactory $productFactory
     * @param ProductRepositoryInterface $productRepository
     * @param Configurable $configurable
     * @param SupplierParameter $supplierParameter
     */
    public function __construct(
        \Digitalprint\PrintessDesigner\Helper\Data $helper,
        RequestInterface $request,
        SerializerInterface $serializer,
        ProductFactory $productFactory,
        ProductRepositoryInterface $productRepository,
        Configurable $configurable,
        SupplierParameter $supplierParameter,
    ) {
        $this->helper = $helper;
        $this->request = $request;
        $this->serializer = $serializer;
        $this->productFactory = $productFactory;
        $this->productRepository = $productRepository;
        $this->configurable = $configurable;
        $this->supplierParameter = $supplierParameter;
    }

    /**
     * @param EventObserver $observer
     * @return void
     * @throws JsonException
     */
    public function execute(EventObserver $observer)
    {
        if ($this->helper->isJson($this->request->getContent())) {
            $params = json_decode($this->request->getContent(), true, 512, JSON_THROW_ON_ERROR);

            $item = $observer->getQuoteItem();

            $product = $this->productRepository->get($params['sku']);
            $parentId = $this->configurable->getParentIdsByChild($product->getId());

            $additionalOptions = [];

            if ($additionalOption = $item->getOptionByCode('additional_options')) {
                $additionalOptions = $this->serializer->unserialize($additionalOption->getValue());
            }

            if (isset($params['saveToken'], $params['thumbnailUrl'])) {
                $additionalOptions['printess_save_token'] = [
                    'label' => 'save_token',
                    'value' => $params['saveToken']
                ];

                $additionalOptions['printess_thumbnail_url'] = [
                    'label' => 'thumbnail_url',
                    'value' => $params['thumbnailUrl']
                ];
            }

            if (isset($params['documents'])) {
                $additionalOptions['printess_documents'] = [
                    'label' => 'documents',
                    'value' => json_encode($params['documents'], JSON_THROW_ON_ERROR)
                ];

                $productConfiguration = [
                    'documents' => $params['documents'],
                    'formFields' => $params['formFields']
                ];

                if (($parentId = reset($parentId)) !== false) {
                    $parentProduct = $this->productFactory->create()->load($parentId);
                    $supplierParameter  = $this->supplierParameter->createSupplierParameter(!is_null($product->getData('printess_supplier_parameter')) ? $product : $parentProduct, $productConfiguration);
                } else {
                    $supplierParameter = $this->supplierParameter->createSupplierParameter($product, $productConfiguration);
                }

                $additionalOptions['printess_supplier_parameter'] = [
                    'label' => 'supplier_parameter',
                    'value' => json_encode($supplierParameter, JSON_THROW_ON_ERROR)
                ];
            }

            if (isset($params['priceInfo'])) {
                $additionalOptions['printess_price_info'] = [
                    'label' => 'price_info',
                    'value' => json_encode($params['priceInfo'], JSON_THROW_ON_ERROR)
                ];
            }

            if (count($additionalOptions) > 0) {
                $item->addOption([
                    'product_id' => $item->getProductId(),
                    'code' => 'additional_options',
                    'value' => $this->serializer->serialize($additionalOptions)
                ]);
            }
        }
    }
}
