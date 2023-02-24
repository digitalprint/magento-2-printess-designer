<?php

namespace Digitalprint\PrintessDesigner\Model;

use Digitalprint\PrintessDesigner\Model\Processor\ProcessorFactory;
use RuntimeException;

class Adjustment
{

    public const TYPE_NAME = 'adjustment';

    /**
     * @var ProcessorFactory
     */
    protected ProcessorFactory $processorFactory;

    /**
     * @param ProcessorFactory $processorFactory
     */
    public function __construct(
        ProcessorFactory $processorFactory
    ) {
        $this->processorFactory = $processorFactory;
    }

    /**
     * @return array
     */
    protected function registeredProcessors(): array
    {
        return [];
    }

    /**
     * @param $name
     * @param array $params
     * @return mixed
     */
    public function getAdjustment($name, array $params = [])
    {
        $processors = $this->registeredProcessors();

        foreach ($processors as $processor) {

            $processorInstance = $this->processorFactory->create($processor);

            if (self::TYPE_NAME === $processorInstance->getType() && $name === $processorInstance->getName()) {
                return $processorInstance->process($params);
            }
        }

        throw new RuntimeException('The parameter with the name [' . $name . '] cannot be processed.');
    }

}
