<?php

namespace Digitalprint\PrintessDesigner\Model\Api;

use Digitalprint\PrintessDesigner\Api\DesignerInterface;
use Digitalprint\PrintessDesigner\Api\Data\DesignerInterface as DataDesignerInterface;
use Magento\Catalog\Api\ProductRepositoryInterface;
use Magento\Framework\UrlInterface;

class Designer implements DesignerInterface
{
    /**
     * @var DataDesignerInterface
     */
    private $dataDesigner;

    /**
     * @var UrlInterface
     */
    private $urlBuilder;

    public function __construct(
        DataDesignerInterface $dataDesigner,
        UrlInterface $urlBuilder
    ){
        $this->dataDesigner = $dataDesigner;
        $this->urlBuilder = $urlBuilder;
    }

    /**
     * @inheritdoc
     */
    public function getUrlByTag($tag) {

        $dataDesigner = clone $this->dataDesigner;

        $queryParams = [
            'sku' => $tag
        ];
        $designerUrl = $this->urlBuilder->getUrl('designer/page/view', ['_current' => false, '_use_rewrite' => true, '_query' => $queryParams]);

        $dataDesigner->setUrl($designerUrl);

        return $dataDesigner;

    }

}
