<?php

namespace Digitalprint\PrintessDesigner\Plugin\Adminhtml\Catalog;

use Magento\Ui\Component\Form\Element\Input;
use Magento\Ui\Component\Form\Element\DataType\Text;
use Magento\Ui\Component\Form\Field;

class CustomOptions
{
    /**
     * @param \Magento\Catalog\Ui\DataProvider\Product\Form\Modifier\CustomOptions $subject
     * @param array $result
     * @return array
     */
    public function afterModifyMeta(\Magento\Catalog\Ui\DataProvider\Product\Form\Modifier\CustomOptions $subject, array $result): array
    {
        if (! empty($result[\Magento\Catalog\Ui\DataProvider\Product\Form\Modifier\CustomOptions::GROUP_CUSTOM_OPTIONS_NAME])) {
            return array_replace_recursive($result, [
                \Magento\Catalog\Ui\DataProvider\Product\Form\Modifier\CustomOptions::GROUP_CUSTOM_OPTIONS_NAME => [
                    'children' => [
                        'options' => [
                            'children' => [
                                'record' => [
                                    'children' => [
                                        \Magento\Catalog\Ui\DataProvider\Product\Form\Modifier\CustomOptions::CONTAINER_OPTION => [
                                            'children' => [
                                                \Magento\Catalog\Ui\DataProvider\Product\Form\Modifier\CustomOptions::CONTAINER_COMMON_NAME => [
                                                    'children' => [
                                                        'type' => [
                                                            'arguments' => [
                                                                'data' => [
                                                                    'config' => [
                                                                        'groupsConfig' => [
                                                                            'supplierparameter' => [
                                                                                'values' => [
                                                                                    'supplierparameter',
                                                                                ],
                                                                                'indexes' => [
                                                                                    'values',
                                                                                ],
                                                                            ],
                                                                            'adjustment' => [
                                                                                'values' => [
                                                                                    'adjustment',
                                                                                ],
                                                                                'indexes' => [
                                                                                    'container_type_static',
                                                                                    'price',
                                                                                    'price_type',
                                                                                    'sku',
                                                                                ],
                                                                            ],
                                                                        ],
                                                                    ],
                                                                ],
                                                            ],
                                                        ],
                                                        'price_tag_prefix' => [
                                                            'arguments' => [
                                                                'data' => [
                                                                    'config' => [
                                                                        'label' => __('Price-Tag-Prefix'),
                                                                        'componentType' => Field::NAME,
                                                                        'formElement' => Input::NAME,
                                                                        'dataScope' => 'price_tag_prefix',
                                                                        'dataType' => Text::NAME,
                                                                        'sortOrder' => 35,
                                                                    ],
                                                                ],
                                                            ],
                                                        ],
                                                    ],
                                                ],
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ]);
        }

        return $result;
    }
}
