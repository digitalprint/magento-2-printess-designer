<?php

namespace Digitalprint\PrintessDesigner\Model\AdditionalOptions;

use Exception;
use Magento\Framework\Serialize\SerializerInterface;
use Psr\Log\LoggerInterface;

Class OptionsManager {

    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * @var SerializerInterface
     */
    protected $serializer;

    public function __construct(
        SerializerInterface $serializer,
        LoggerInterface $logger
    )
    {
        $this->serializer = $serializer;
        $this->logger = $logger;
    }

    public function transferAdditionalOptions($source, $destination) {

        try {

            $sourceItems = [];

            foreach ($source->getItems() as $sourceItem) {
                if (!$sourceItem->getParentItemId()) {
                    $sourceItems[$sourceItem->getId()] = $sourceItem;
                }
            }

            foreach ($destination->getItems() as $destinationItem) {

                if (!$destinationItem->getParentItemId()) {

                    if ($sourceItem = $sourceItems[$destinationItem->getQuoteItemId()]) {

                        if ($additionalOptions = $sourceItem->getOptionByCode('additional_options')) {
                            $options = $destinationItem->getProductOptions();
                            $options['additional_options'] = $this->serializer->unserialize($additionalOptions->getValue());
                            $destinationItem->setProductOptions($options);
                        }
                    }
                }

            }

        } catch (Exception $e) {
            $this->logger->debug($e);
        }

    }

}
