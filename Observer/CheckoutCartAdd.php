<?php

namespace DigitalPrint\PrintessDesigner\Observer;

use Magento\Framework\App\RequestInterface;
use Magento\Framework\Event\Observer as EventObserver;
use Magento\Framework\Event\ObserverInterface;
use Magento\Framework\Serialize\SerializerInterface;

class CheckoutCartAdd implements ObserverInterface
{

    /**
     * @var RequestInterface
     */
    protected $request;
    /**
     * @var SerializerInterface
     */
    protected $serializer;

    /**
     * @param RequestInterface $request
     * @param SerializerInterface $serializer
     */
    public function __construct(
        RequestInterface $request,
        SerializerInterface $serializer
    )
    {
        $this->request = $request;
        $this->serializer = $serializer;
    }

    /**
     * @param EventObserver $observer
     * @return void
     * @throws \JsonException
     */
    public function execute(EventObserver $observer) {

        $item = $observer->getQuoteItem();
        $params = json_decode($this->request->getContent(), true);

        $additionalOptions = array();

        if ($additionalOption = $item->getOptionByCode('additional_options')) {
            $additionalOptions = $this->serializer->unserialize($additionalOption->getValue());
        }

        if (isset($params['saveToken'], $params['thumbnailUrl'])) {
            $additionalOptions['printess_save_token'] = [
                'label' => 'save_token',
                'value' => $params['saveToken']
            ];

            $additionalOptions['printess_thumbnail_url'] = [
                'label' => 'thumbnail_url',
                'value' => $params['thumbnailUrl']
            ];
        }

        if (count($additionalOptions) > 0) {
            $item->addOption(array(
                'product_id' => $item->getProductId(),
                'code' => 'additional_options',
                'value' => $this->serializer->serialize($additionalOptions)
            ));
        }

    }

}
