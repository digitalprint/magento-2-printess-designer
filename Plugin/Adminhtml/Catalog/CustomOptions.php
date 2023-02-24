<?php

namespace Digitalprint\PrintessDesigner\Plugin\Adminhtml\Catalog;

class CustomOptions
{

    /**
     * @param \Magento\Catalog\Ui\DataProvider\Product\Form\Modifier\CustomOptions $subject
     * @param array $meta
     * @return array
     */
    public function afterModifyMeta(\Magento\Catalog\Ui\DataProvider\Product\Form\Modifier\CustomOptions $subject, array $meta): array
    {

       return array_merge_recursive($meta, [
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
                                                                    'groupsConfig' =>  [
                                                                        'supplierparameter' => [
                                                                            'values' => [
                                                                                'supplierparameter'
                                                                            ],
                                                                            'indexes' => [
                                                                                'values'
                                                                            ]
                                                                        ],
                                                                        'adjustment' => [
                                                                            'values' => [
                                                                                'adjustment'
                                                                            ],
                                                                            'indexes' => [
                                                                                'container_type_static',
                                                                                'price',
                                                                                'price_type',
                                                                                'sku'
                                                                            ]
                                                                        ]
                                                                    ]
                                                                ]
                                                            ]
                                                        ]
                                                    ]
                                                ]
                                            ]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        ]);

    }

}
