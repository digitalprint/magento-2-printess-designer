<?php

namespace Digitalprint\PrintessDesigner\Plugin\Product;

use Magento\Catalog\Model\Product;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Store\Model\ScopeInterface;

class AddToCart {

    /**
     * @var string
     */
    private const XML_PATH_DESIGNER_ENABLE = 'designer/general/enable';

    /**
     * @var ScopeConfigInterface
     */
    protected $scopeConfig;

    /**
     * @param ScopeConfigInterface $scopeConfig
     */
    public function __construct(
        ScopeConfigInterface $scopeConfig
    )
    {
        $this->scopeConfig = $scopeConfig;
    }

    /**
     * @param Product $product
     * @param $return
     * @return bool
     */
    public function afterIsSaleable(Product $product, $return): bool {

        if ($this->scopeConfig->getValue(self::XML_PATH_DESIGNER_ENABLE, ScopeInterface::SCOPE_STORE)) {

            $printessTemplate = $product->getData('printess_template');

            if ($printessTemplate) {
                return false;
            }
        }

        return $return;
    }

}
