<?php

namespace Digitalprint\PrintessDesigner\Plugin\Minicart;

use Magento\Catalog\Api\ProductRepositoryInterface;
use Magento\Checkout\CustomerData\AbstractItem;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\App\ObjectManager;
use Magento\Framework\Serialize\Serializer\Json;
use Magento\Framework\UrlInterface;
use Magento\Store\Model\ScopeInterface;

class ItemData {

    /**
     * @var string
     */
    private const XML_PATH_DESIGNER_ENABLE = 'designer/general/enable';

    /**
     * @var ScopeConfigInterface
     */
    protected $scopeConfig;
    /**
     * @var Json|mixed
     */
    protected $serializer;
    /**
     * @var UrlInterface
     */
    protected $urlBuilder;
    /**
     * @var ProductRepositoryInterface
     */
    protected $productRepository;

    /**
     * @param ScopeConfigInterface $scopeConfig
     * @param Json|null $serializer
     * @param UrlInterface $urlBuilder
     * @param ProductRepositoryInterface $productRepository
     */
    public function __construct(
        ScopeConfigInterface $scopeConfig,
        Json $serializer = null,
        UrlInterface $urlBuilder,
        ProductRepositoryInterface $productRepository
    )
    {
        $this->scopeConfig = $scopeConfig;
        $this->serializer = $serializer ?: ObjectManager::getInstance()->get(Json::class);
        $this->urlBuilder = $urlBuilder;
        $this->productRepository = $productRepository;
    }

    /**
     * @param AbstractItem $subject
     * @param $proceed
     * @param $item
     * @return array
     */
    public function aroundGetItemData(AbstractItem $subject, $proceed, $item): array
    {

        $result = $proceed($item);

        if ($this->scopeConfig->getValue(self::XML_PATH_DESIGNER_ENABLE, ScopeInterface::SCOPE_STORE)) {

            $additionalOptions = [];
            if ($additionalOptions = $item->getOptionByCode('additional_options')) {
                $additionalOptions = (array) $this->serializer->unserialize($additionalOptions->getValue());
            }

            $product = $this->productRepository->getById($item->getProduct()->getId());

            if (isset($additionalOptions['printess_thumbnail_url']['value'])) {
                $result['product_image']['src'] = $additionalOptions['printess_thumbnail_url']['value'];
            }

            if (isset($additionalOptions['printess_save_token']['value'])) {

                $urlParams = [
                    'sku' => $product->getSku(),
                    'save_token' => $additionalOptions['printess_save_token']['value']
                ];

                $buyRequest = [];
                if ($buyRequest = $item->getOptionByCode('info_buyRequest')) {
                    $buyRequest = (array) $this->serializer->unserialize($buyRequest->getValue());
                }

                if (isset($buyRequest['super_attribute'])) {

                    foreach($buyRequest['super_attribute'] as $key => $val) {
                        $urlParams["super_attribute[{$key}]"] = $val;
                    }

                }

                $result['configure_url'] = $this->urlBuilder->getUrl('designer/page/view', ['_query' => $urlParams]);
            }

        }

        return $result;
    }

}
