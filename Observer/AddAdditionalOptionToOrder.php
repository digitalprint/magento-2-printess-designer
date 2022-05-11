<?php

namespace DigitalPrint\PrintessDesigner\Observer;

use Exception;
use Magento\Framework\Event\Observer as EventObserver;
use Magento\Framework\Event\ObserverInterface;
use Magento\Framework\Serialize\SerializerInterface;

class AddAdditionalOptionToOrder implements ObserverInterface
{

    /**
     * @var SerializerInterface
     */
    protected $serializer;

    public function __construct(
        SerializerInterface $serializer
    )
    {
        $this->serializer = $serializer;
    }

    /**
     * @param EventObserver $observer
     * @return void
     */
    public function execute(EventObserver $observer)
    {

        try {

            $quoteItems = [];

            $quote = $observer->getQuote();
            $order = $observer->getOrder();
            
            foreach ($quote->getItems() as $quoteItem) {

                if (!$quoteItem->getParentItemId()) {
                    $quoteItems[$quoteItem->getId()] = $quoteItem;
                }

            }

            foreach ($order->getItems() as $orderItem) {

                if (!$orderItem->getParentItemId()) {

                    if ($quoteItem = $quoteItems[$orderItem->getQuoteItemId()]) {

                        if ($additionalOptions = $quoteItem->getOptionByCode('additional_options')) {
                            $options = $orderItem->getProductOptions();
                            $options['additional_options'] = $this->serializer->unserialize($additionalOptions->getValue());
                            $orderItem->setProductOptions($options);
                        }
                    }
                }

            }

        } catch (Exception $e) {
            // catch error if any
        }

    }

}
