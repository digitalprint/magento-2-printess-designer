<?php

namespace DigitalPrint\PrintessDesigner\Observer;

use Magento\Framework\Event\Observer;
use Magento\Framework\Event\ObserverInterface;
use Magento\Framework\Serialize\Serializer\Json;
use Magento\Framework\Unserialize\Unserialize;

class OrderItemAdditionalOptions implements ObserverInterface
{

    /**
     * @var Unserialize
     */
    protected $unserialize;
    /**
     * @var
     */
    protected $serializer;

    /**
     * @param Unserialize $unserialize
     * @param Json $json
     */
    public function __construct(
        Unserialize $unserialize,
        Json $json
    ){
        $this->unserialize = $unserialize;
        $this->json = $json;
    }

    /**
     * @param Observer $observer
     */
    public function execute(Observer $observer)
    {
        try {
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
                $options = $orderItem->getProductOptions();
                if ($this->isSerialized($additionalOptions->getValue())){
                    $options['options'] = $this->unserialize->unserialize($additionalOptions->getValue());
                } else {
                    $options['options'] = $this->json->unserialize($additionalOptions->getValue());
                }

                $orderItem->setProductOptions($options);

            }
        }

        catch (\Exception $e) {
            $e->getMessage();
        }
    }

    /**
     * @param $value
     * @return bool
     */
    private function isSerialized($value): bool
    {
        return (boolean) preg_match('/^((s|i|d|b|a|O|C):|N;)/', $value);
    }
}
