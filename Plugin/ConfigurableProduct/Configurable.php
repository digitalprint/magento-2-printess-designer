<?php

namespace Digitalprint\PrintessDesigner\Plugin\ConfigurableProduct;

class Configurable
{

    /**
     * @param \Magento\ConfigurableProduct\Block\Product\View\Type\Configurable $subject
     * @param $result
     * @return false|string
     * @throws \JsonException
     */
    public function afterGetJsonConfig(\Magento\ConfigurableProduct\Block\Product\View\Type\Configurable $subject, $result) {

        $jsonResult = json_decode($result, true, 512, JSON_THROW_ON_ERROR);
        $jsonResult['skus'] = [];

        foreach ($subject->getAllowProducts() as $simpleProduct) {
            $jsonResult['skus'][$simpleProduct->getId()] = $simpleProduct->getSku();
        }

        return json_encode($jsonResult, JSON_THROW_ON_ERROR);
    }

}
