<?php

namespace Digitalprint\PrintessDesigner\Model\Processor;

interface ProcessorInterface
{

    /**
     * @return string
     */
    public function getName(): string;

    /**
     * @param $productConfiguration
     * @return string|null
     */
    public function process($productConfiguration): ?string;

}
