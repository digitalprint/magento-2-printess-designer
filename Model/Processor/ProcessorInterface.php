<?php

namespace Digitalprint\PrintessDesigner\Model\Processor;

interface ProcessorInterface
{
    /**
     * @return string
     */
    public function getName(): string;

    /**
     * @return string
     */
    public function getType(): string;

    /**
     * @param $params
     * @return string|null
     */
    public function process($params): mixed;
}
