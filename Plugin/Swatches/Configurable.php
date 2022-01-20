<?php

namespace Digitalprint\PrintessDesigner\Plugin\Swatches;

class Configurable
{
    /**
     * @param \Magento\Swatches\Block\Product\Renderer\Configurable $subject
     * @param $result
     * @return false|string
     * @throws \JsonException
     */
    public function afterGetJsonConfig(\Magento\Swatches\Block\Product\Renderer\Configurable $subject, $result) {

        $jsonResult = json_decode($result, true, 512, JSON_THROW_ON_ERROR);
        $jsonResult['skus'] = [];

        foreach ($subject->getAllowProducts() as $simpleProduct) {
            $jsonResult['skus'][$simpleProduct->getId()] = $simpleProduct->getSku();
        }

        return json_encode($jsonResult, JSON_THROW_ON_ERROR);
    }
}
