<?php

namespace DigitalPrint\PrintessDesigner\Observer;

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
    public function execute(EventObserver $observer) {

        $quote = $observer->getQuote();
        $order = $observer->getOrder();

        $quoteItems = [];

        foreach ($quote->getAllVisibleItems() as $quoteItem) {
            $quoteItems[$quoteItem->getId()] = $quoteItem;
        }

        foreach ($order->getAllVisibleItems() as $orderItem) {

            $quoteItemId = $orderItem->getQuoteItemId();
            $quoteItem = $quoteItems[$quoteItemId];

            $additionalOptions = $quoteItem->getOptionByCode('additional_options');

            if (!is_null($additionalOptions)) {
                $options = $orderItem->getProductOptions();
                $options['additional_options'] = $this->serializer->unserialize($additionalOptions->getValue());
                $orderItem->setProductOptions($options);
            }

        }

    }

}
