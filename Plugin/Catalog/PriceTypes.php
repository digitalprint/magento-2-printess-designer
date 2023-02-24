<?php

namespace Digitalprint\PrintessDesigner\Plugin\Catalog;

use Digitalprint\PrintessDesigner\Model\Adjustment;

class PriceTypes
{

    /**
     * @param $subject
     * @param $result
     * @return mixed
     */
    public function afterGetPriceTypes($subject, $result) {

        $result[] = Adjustment::TYPE_NAME;

        return $result;

    }

}
