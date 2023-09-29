<?php

namespace Digitalprint\PrintessDesigner\Model;

use Digitalprint\PrintessDesigner\Model\Processor\ProcessorFactory;
use RuntimeException;
use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\SyntaxError;
use Twig\Loader\ArrayLoader;
use Twig\TwigFunction;

class SupplierParameter
{
    public const TYPE_NAME = 'supplierparameter';

    /**
     * @var \Digitalprint\PrintessDesigner\Helper\Data
     */
    protected \Digitalprint\PrintessDesigner\Helper\Data $helper;

    /**
     * @var ProcessorFactory
     */
    protected ProcessorFactory $processorFactory;

    /**
     * @var Environment
     */
    protected Environment $twig;

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
     * @param array $params
     * @return mixed
     */
    public function getSupplierParameter($name, array $params = [])
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

    /**
     * @param $product
     * @param array $productConfiguration
     * @return array|mixed|string
     * @throws LoaderError
     * @throws SyntaxError
     * @throws \JsonException
     */
    public function createSupplierParameter($product, array $productConfiguration = [])
    {
        if (! is_null($product) && ! is_null($product->getData('printess_supplier_parameter'))) {
            $attribute = $product->getData('printess_supplier_parameter');
            $template = $this->twig->createTemplate($attribute);

            $json = $template->render([
                'productConfiguration' => $productConfiguration,
            ]);

            if ($this->helper->isJson($json)) {
                $json = json_decode($json, true);
            }

            return $json;
        }

        return [];
    }
}
