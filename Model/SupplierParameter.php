<?php

namespace Digitalprint\PrintessDesigner\Model;

use Digitalprint\PrintessDesigner\Model\Processor\ProcessorFactory;
use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\SyntaxError;
use Twig\Loader\ArrayLoader;
use Twig\TwigFunction;

class SupplierParameter
{
    /**
     * @var \Digitalprint\PrintessDesigner\Helper\Data
     */
    protected $helper;

    /**
     * @var ProcessorFactory
     */
    protected $processorFactory;

    /**
     * @var Environment
     */
    protected $twig;

    /**
     * @param \Digitalprint\PrintessDesigner\Helper\Data $helper
     * @param ProcessorFactory $processorFactory
     */
    public function __construct(
        \Digitalprint\PrintessDesigner\Helper\Data $helper,
        ProcessorFactory $processorFactory
    ) {
        $this->helper = $helper;
        $this->processorFactory = $processorFactory;
        $this->twig = $this->createTwig();
    }

    /**
     * @return Environment
     */
    private function createTwig()
    {
        $loader = new ArrayLoader();
        $twig = new Environment($loader);

        $twig->addFunction(new TwigFunction('getSupplierParam', function (string $name, array $productConfiguration = []) {
            return static::getSupplierParameter($name, $productConfiguration);
        }));

        return $twig;
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
     * @param array $productConfiguration
     * @return mixed
     */
    public function getSupplierParameter($name, array $productConfiguration = [])
    {
        $processors = $this->registeredProcessors();

        foreach ($processors as $processor) {
            $processorInstance = $this->processorFactory->create($processor);

            if ($name === $processorInstance->getName()) {
                return $processorInstance->process($productConfiguration);
            }
        }

        throw new \RuntimeException('The parameter with the name [' . $name . '] cannot be processed.');
    }

    /**
     * @param $product
     * @param $productConfiguration
     * @return array|mixed|string
     * @throws LoaderError
     * @throws SyntaxError
     * @throws \JsonException
     */
    public function createSupplierParameter($product, $productConfiguration = [])
    {
        $attribute = $product->getData('printess_supplier_parameter');

        if (null === $attribute) {
            return [];
        }

        $template = $this->twig->createTemplate($attribute);

        $json = $template->render(['productConfiguration' => $productConfiguration]);

        if ($this->helper->isJson($json)) {
            $json = json_decode($json, true);
        }

        return $json;
    }
}
