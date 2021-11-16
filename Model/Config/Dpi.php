<?php

namespace Digitalprint\PrintessDesigner\Model\Config;

use Magento\Framework\Option\ArrayInterface;

class Dpi implements ArrayInterface
{

    /**
     * @return array[]
     */
    public function toOptionArray()
    {
       return [
            ['label' => '72 dpi', 'value' => 72],
            ['label' => '150 dpi', 'value' => 150],
            ['label' => '300 dpi', 'value' => 300],
        ];
    }
}
