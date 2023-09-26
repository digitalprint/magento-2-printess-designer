<?php

namespace Digitalprint\PrintessDesigner\Setup;

use Magento\Catalog\Model\Product;
use Magento\Eav\Model\Entity\Attribute\ScopedAttributeInterface;
use Magento\Eav\Setup\EavSetupFactory;
use Magento\Framework\DB\Ddl\Table;
use Magento\Framework\Setup\InstallDataInterface;
use Magento\Framework\Setup\ModuleContextInterface;
use Magento\Framework\Setup\ModuleDataSetupInterface;

/**
 * @codeCoverageIgnore
 */
class InstallData implements InstallDataInterface
{
    /**
     * Eav setup factory
     * @var EavSetupFactory
     */
    private $eavSetupFactory;

    /**
     * Init
     * @param EavSetupFactory $eavSetupFactory
     */
    public function __construct(EavSetupFactory $eavSetupFactory)
    {
        $this->eavSetupFactory = $eavSetupFactory;
    }

    /**
     * @param ModuleDataSetupInterface $setup
     * @param ModuleContextInterface $context
     * @throws \Magento\Framework\Exception\LocalizedException
     * @throws \Zend_Validate_Exception
     */
    public function install(ModuleDataSetupInterface $setup, ModuleContextInterface $context)
    {
        $setup->startSetup();

        $eavSetup = $this->eavSetupFactory->create();

        //  Printess Template-Name
        $eavSetup->addAttribute(
            Product::ENTITY,
            'printess_template',
            [
                'group' => 'Printess',
                'type' => 'varchar',
                'backend' => '',
                'frontend' => '',
                'label' => 'Template-Name',
                'input' => 'text',
                'class' => '',
                'source' => '',
                'global' => ScopedAttributeInterface::SCOPE_STORE,
                'visible' => true,
                'required' => false,
                'user_defined' => false,
                'default' => '',
                'searchable' => false,
                'filterable' => false,
                'comparable' => false,
                'visible_on_front' => false,
                'used_in_product_listing' => false,
                'unique' => false,
                'apply_to' => ''
            ]
        );

        // Printess Document-Name
        $eavSetup->addAttribute(
            Product::ENTITY,
            'printess_document',
            [
                'group' => 'Printess',
                'type' => 'varchar',
                'backend' => '',
                'frontend' => '',
                'label' => 'Document-Name',
                'input' => 'text',
                'class' => '',
                'source' => '',
                'global' => ScopedAttributeInterface::SCOPE_STORE,
                'visible' => true,
                'required' => false,
                'user_defined' => false,
                'default' => '',
                'searchable' => false,
                'filterable' => false,
                'comparable' => false,
                'visible_on_front' => false,
                'used_in_product_listing' => false,
                'unique' => false,
                'apply_to' => ''
            ]
        );

        // Printess Form Fields
        $eavSetup->addAttribute(
            Product::ENTITY,
            'printess_form_fields',
            [
                'group' => 'Printess',
                'type' => 'varchar',
                'backend' => '',
                'frontend' => '',
                'label' => 'Form Fields (JSON)',
                'input' => 'text',
                'class' => '',
                'source' => '',
                'global' => ScopedAttributeInterface::SCOPE_STORE,
                'visible' => true,
                'required' => false,
                'user_defined' => false,
                'default' => '',
                'searchable' => false,
                'filterable' => false,
                'comparable' => false,
                'visible_on_front' => false,
                'used_in_product_listing' => false,
                'unique' => false,
                'apply_to' => ''
            ]
        );

        // Printess Layout Snippets
        $eavSetup->addAttribute(
            Product::ENTITY,
            'printess_layout_snippets',
            [
                'group' => 'Printess',
                'type' => 'varchar',
                'backend' => '',
                'frontend' => '',
                'label' => 'Layout-Snippets',
                'input' => 'text',
                'class' => '',
                'source' => '',
                'global' => ScopedAttributeInterface::SCOPE_STORE,
                'visible' => true,
                'required' => false,
                'user_defined' => false,
                'default' => '',
                'searchable' => false,
                'filterable' => false,
                'comparable' => false,
                'visible_on_front' => false,
                'used_in_product_listing' => false,
                'unique' => false,
                'apply_to' => ''
            ]
        );

        // Printess Group Snippets
        $eavSetup->addAttribute(
            Product::ENTITY,
            'printess_group_snippets',
            [
                'group' => 'Printess',
                'type' => 'varchar',
                'backend' => '',
                'frontend' => '',
                'label' => 'Group-Snippets',
                'input' => 'text',
                'class' => '',
                'source' => '',
                'global' => ScopedAttributeInterface::SCOPE_STORE,
                'visible' => true,
                'required' => false,
                'user_defined' => false,
                'default' => '',
                'searchable' => false,
                'filterable' => false,
                'comparable' => false,
                'visible_on_front' => false,
                'used_in_product_listing' => false,
                'unique' => false,
                'apply_to' => ''
            ]
        );

        // Printess Output DPI
        $eavSetup->addAttribute(
            Product::ENTITY,
            'printess_output_dpi',
            [
                'group' => 'Printess',
                'type' => 'int',
                'backend' => '',
                'frontend' => '',
                'label' => 'Output DPI',
                'input' => 'select',
                'class' => '',
                'source' => 'Digitalprint\PrintessDesigner\Model\Config\Source\Dpi',
                'global' => ScopedAttributeInterface::SCOPE_STORE,
                'visible' => true,
                'required' => false,
                'user_defined' => false,
                'default' => '',
                'searchable' => false,
                'filterable' => false,
                'comparable' => false,
                'visible_on_front' => false,
                'used_in_product_listing' => false,
                'unique' => false,
                'apply_to' => ''
            ]
        );

        $setup->getConnection()->addColumn(
            $setup->getTable('catalog_product_option'),
            'price_tag_prefix',
            [
                'type' => Table::TYPE_TEXT,
                'length' => 128,
                'nullable' => false,
                'default' => '',
                'comment' => 'Printess Price Tag Prefix',
            ]
        );

        $setup->endSetup();

    }
}
