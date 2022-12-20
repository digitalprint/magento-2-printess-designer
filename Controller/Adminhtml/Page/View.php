<?php

namespace Digitalprint\PrintessDesigner\Controller\Adminhtml\Page;

use Magento\Backend\App\Action;
use Magento\Backend\App\Action\Context;
use Magento\Framework\Controller\ResultInterface;
use Magento\Framework\View\Result\Page;
use Magento\Framework\View\Result\PageFactory;

class View extends Action
{
    public const ADMIN_RESOURCE = 'Digitalprint_PrintessDesigner::edit_items';

    /**
     * @var PageFactory
     */
    protected PageFactory $pageFactory;

    /**
     * @param Context $context
     * @param PageFactory $pageFactory
     */
    public function __construct(
        Context $context,
        PageFactory $pageFactory
    ) {
        $this->pageFactory = $pageFactory;
        parent::__construct($context);
    }

    /**
     * @return Page|ResultInterface
     */
    public function execute()
    {
        return $this->pageFactory->create();
    }
}
