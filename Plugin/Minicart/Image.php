<?php

namespace Digitalprint\PrintessDesigner\Plugin\Minicart;

use Magento\Checkout\CustomerData\AbstractItem;
use Magento\Framework\App\ObjectManager;
use Magento\Framework\Serialize\Serializer\Json;


class Image {

    /**
     * @var string
     */
    private const XML_PATH_DESIGNER_ENABLE = 'designer/general/enable';

    /**
     * @var
     */
    protected $scopeConfig;
    /**
     * @var Json|mixed
     */
    protected $serializer;

    /**
     * @param Json|null $serializer
     */
    public function __construct(Json $serializer = null)
    {
        $this->serializer = $serializer ?: ObjectManager::getInstance() ->get(Json::class);
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

        $additionalOptions = $item->getOptionByCode('additional_options')->getValue();
        $additionalOptions = $this->serializer->unserialize($additionalOptions);

        if (isset($additionalOptions['printess_thumbnail_url']['value'])) {
            $result['product_image']['src'] = $additionalOptions['printess_thumbnail_url']['value'];
        }

        return $result;
    }

}
