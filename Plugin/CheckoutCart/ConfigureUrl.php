<?php

namespace Digitalprint\PrintessDesigner\Plugin\CheckoutCart;

use Magento\Catalog\Api\ProductRepositoryInterface;
use Magento\Checkout\Block\Cart\Item\Renderer\Actions\Edit;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\App\ObjectManager;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\Serialize\Serializer\Json;
use Magento\Framework\UrlInterface;
use Magento\Store\Model\ScopeInterface;

class ConfigureUrl
{

    /**
     * @var string
     */
    private const XML_PATH_DESIGNER_ENABLE = 'designer/general/enable';

    /**
     * @var ScopeConfigInterface
     */
    protected ScopeConfigInterface $scopeConfig;

    /**
     * @var Json|mixed
     */
    protected $serializer;

    /**
     * @var UrlInterface
     */
    protected UrlInterface $urlBuilder;

    /**
     * @var ProductRepositoryInterface
     */
    protected ProductRepositoryInterface $productRepository;

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
    ) {
        $this->scopeConfig = $scopeConfig;
        $this->serializer = $serializer ?: ObjectManager::getInstance()->get(Json::class);
        $this->urlBuilder = $urlBuilder;
        $this->productRepository = $productRepository;
    }

    /**
     * @param Edit $subject
     * @param $result
     * @return string
     * @throws NoSuchEntityException
     */
    public function afterGetConfigureUrl(Edit $subject, $result): string
    {
        if ($this->scopeConfig->getValue(self::XML_PATH_DESIGNER_ENABLE, ScopeInterface::SCOPE_STORE)) {
            $item = $subject->getItem();

            if ($additionalOptions = $item->getOptionByCode('additional_options')) {
                $additionalOptions = (array) $this->serializer->unserialize($additionalOptions->getValue());
            }

            if (isset($additionalOptions['printess_save_token']['value'])) {
                $urlParams = [];

                $product = $this->productRepository->getById($item->getProduct()->getId());

                $urlParams['sku'] = $product->getSku();
                $urlParams['save_token'] = $additionalOptions['printess_save_token']['value'];

                if ($buyRequest = $item->getOptionByCode('info_buyRequest')) {
                    $buyRequest = (array) $this->serializer->unserialize($buyRequest->getValue());
                }

                if (isset($buyRequest['super_attribute'])) {
                    foreach ($buyRequest['super_attribute'] as $key => $val) {
                        $urlParams["super_attribute[$key]"] = $val;
                    }
                }

                return $this->urlBuilder->getUrl('designer/page/view', ['_query' => $urlParams]);
            }
        }

        return $result;
    }
}
