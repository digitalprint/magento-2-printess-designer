<?php

namespace Digitalprint\PrintessDesigner\Model\Processor;

use Magento\Framework\ObjectManagerInterface;

class ProcessorFactory
{
    /**
     * @var ObjectManagerInterface
     */
    protected ObjectManagerInterface $objectManager;

    /**
     * @param ObjectManagerInterface $objectManager
     */
    public function __construct(ObjectManagerInterface $objectManager)
    {
        $this->objectManager = $objectManager;
    }

    /**
     * @param $className
     * @return mixed
     */
    public function create($className)
    {
        return $this->objectManager->create($className);
    }
}
