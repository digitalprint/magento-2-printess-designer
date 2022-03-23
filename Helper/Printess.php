<?php

namespace Digitalprint\PrintessDesigner\Helper;

use Magento\Framework\App\Helper\AbstractHelper;
use Magento\Catalog\Api\ProductRepositoryInterface;
use Magento\ConfigurableProduct\Api\LinkManagementInterface;
use Magento\Framework\App\Helper\Context;
use Magento\Framework\Exception\NoSuchEntityException;

class Printess extends AbstractHelper
{

    /**
     * @var ProductRepositoryInterface
     */
    protected $productRepositoryInterface;

    /**
     * @var LinkManagementInterface
     */
    protected $linkManagement;

    /**
     * @param Context $context
     * @param ProductRepositoryInterface $productRepositoryInterface
     * @param LinkManagementInterface $linkManagement
     */
    public function __construct(
        Context $context,
        ProductRepositoryInterface $productRepositoryInterface,
        LinkManagementInterface $linkManagement
    )
    {
        $this->productRepository = $productRepositoryInterface;
        $this->linkManagement = $linkManagement;

        parent::__construct($context);
    }

    /**
     * @param $sku
     * @return bool
     * @throws NoSuchEntityException
     */
    public function hasTemplate($sku = null)
    {

        if (!is_null($sku)) {

            $product = $this->productRepository->get($sku);

            if ($product->getTypeId() === 'configurable') {

                $children = $this->linkManagement->getChildren($product->getSku());

                foreach($children as $child) {
                    $childProduct = $this->productRepository->get($child->getSku());

                    $printessTemplate = $childProduct->getData('printess_template');

                    if ($printessTemplate) {
                        return true;
                    }
                }

            } else {

                $printessTemplate = $product->getData('printess_template');
                if ($printessTemplate) {
                    return true;
                }

            }

        }

        return false;
    }

    /**
     * @return string
     */
    public function getDesignerUrl() {
        return $this->_getUrl('designer/page/view');
    }

}
