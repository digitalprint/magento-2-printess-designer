<?php

namespace Digitalprint\PrintessDesigner\Plugin\Product;

use Digitalprint\PrintessDesigner\Helper\Printess;
use Magento\Catalog\Block\Product\View;
use Magento\Framework\Exception\NoSuchEntityException;

class SubmitUrl {

    /**
     * @var Printess
     */
    protected $helperPrintess;

    /**
     * @param Printess $helperPrintess
     */
    public function __construct(
        Printess $helperPrintess
    ) {
        $this->helperPrintess = $helperPrintess;
    }

    /**
     * @param View $subject
     * @param $result
     * @return mixed|string
     * @throws NoSuchEntityException
     */
    public function afterGetSubmitUrl(View $subject, $result)
    {
        if ($this->helperPrintess->hasTemplate($subject->getProduct()->getSku())) {
            return $this->helperPrintess->getDesignerUrl();
        }

        return $result;
    }

}
