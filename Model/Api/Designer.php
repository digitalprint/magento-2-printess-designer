<?php

namespace Digitalprint\PrintessDesigner\Model\Api;

use Digitalprint\PrintessDesigner\Api\Data\DesignerInterface as DataDesignerInterface;
use Digitalprint\PrintessDesigner\Api\DesignerInterface;
use Magento\Framework\UrlInterface;

class Designer implements DesignerInterface
{
    /**
     * @var DataDesignerInterface
     */
    protected $dataDesigner;

    /**
     * @var UrlInterface
     */
    protected $urlBuilder;

    public function __construct(
        DataDesignerInterface $dataDesigner,
        UrlInterface $urlBuilder
    ) {
        $this->dataDesigner = $dataDesigner;
        $this->urlBuilder = $urlBuilder;
    }

    /**
     * @inheritdoc
     */
    public function getUrlByTag(string $tag)
    {
        $dataDesigner = clone $this->dataDesigner;

        $queryParams = [
            'sku' => $tag
        ];
        $designerUrl = $this->urlBuilder->getUrl('designer/page/view', ['_current' => false, '_use_rewrite' => true, '_query' => $queryParams]);

        $dataDesigner->setUrl($designerUrl);

        return $dataDesigner;
    }
}
