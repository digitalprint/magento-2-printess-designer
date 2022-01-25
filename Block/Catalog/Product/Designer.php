<?php

namespace Digitalprint\PrintessDesigner\Block\Catalog\Product;

use Magento\Catalog\Api\ProductRepositoryInterface;
use Magento\Catalog\Block\Product\Context;
use Magento\Catalog\Block\Product\View;
use Magento\Catalog\Helper\Product;
use Magento\Catalog\Model\ProductTypes\ConfigInterface;
use Magento\Customer\Model\Session;
use Magento\Framework\Json\EncoderInterface as JsonEncoderInterface;
use Magento\Framework\Locale\FormatInterface;
use Magento\Framework\Pricing\PriceCurrencyInterface;
use Magento\Framework\Stdlib\StringUtils;
use Magento\Framework\Url\EncoderInterface as UrlEncoderInterface;

class Designer extends View
{

    /**
     * @param Context $context
     * @param UrlEncoderInterface $urlEncoder
     * @param JsonEncoderInterface $jsonEncoder
     * @param StringUtils $string
     * @param Product $productHelper
     * @param ConfigInterface $productTypeConfig
     * @param FormatInterface $localeFormat
     * @param Session $customerSession
     * @param ProductRepositoryInterface $productRepository
     * @param PriceCurrencyInterface $priceCurrency
     * @param array $data
     */
    public function __construct(
        Context $context,
        UrlEncoderInterface $urlEncoder,
        JsonEncoderInterface $jsonEncoder,
        StringUtils $string,
        Product $productHelper,
        ConfigInterface $productTypeConfig,
        FormatInterface $localeFormat,
        Session $customerSession,
        ProductRepositoryInterface $productRepository,
        PriceCurrencyInterface $priceCurrency,
        array $data = []
    )
    {
        parent::__construct($context, $urlEncoder, $jsonEncoder, $string, $productHelper, $productTypeConfig, $localeFormat, $customerSession, $productRepository, $priceCurrency, $data);
    }

    /**
     * @return bool
     */
    public function hasPrintessTemplate(): bool
    {

        $product = $this->getProduct();
        $printessTemplate = $product->getData('printess_template');

        if ($printessTemplate) {
            return true;
        }

        return false;
    }

    /**
     * @return string
     */
    public function getDesignerUrl(): string
    {
        return $this->getUrl('designer/page/view');
    }

    /**
     * @param $product
     * @param array $additional
     * @return string
     */
    public function getSubmitUrl($product, $additional = Array()): string
    {
        if ($this->hasPrintessTemplate()) {
            return $this->getDesignerUrl();
        }
        return parent::getSubmitUrl($product, $additional);
    }

    /**
     * @return bool
     */
    public function shouldRenderQuantity(): bool
    {
        if ($this->hasPrintessTemplate()) {
            return false;
        }
        return parent::shouldRenderQuantity();
    }

}
