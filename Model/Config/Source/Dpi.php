<?php

namespace Digitalprint\PrintessDesigner\Model\Config\Source;

use Magento\Eav\Model\ResourceModel\Entity\Attribute\OptionFactory;
use Magento\Framework\DB\Ddl\Table;

class Dpi extends \Magento\Eav\Model\Entity\Attribute\Source\AbstractSource
{

    /**
     * @var string
     */
    protected $optionFactory;

    /**
     * @return array|null
     */
    public function getAllOptions()
    {

        $this->_options = [
            ['label' => 'No individual setting', 'value' => ''],
            ['label' => '72 dpi', 'value' => 72],
            ['label' => '150 dpi', 'value' => 150],
            ['label' => '300 dpi', 'value' => 300],
        ];

        return $this->_options;

    }

}
