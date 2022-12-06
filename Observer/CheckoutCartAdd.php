<?php

namespace Digitalprint\PrintessDesigner\Observer;

use Digitalprint\PrintessDesigner\Helper\Data;
use JsonException;
use Magento\Framework\App\RequestInterface;
use Magento\Framework\Event\Observer as EventObserver;
use Magento\Framework\Event\ObserverInterface;
use Magento\Framework\Serialize\SerializerInterface;

class CheckoutCartAdd implements ObserverInterface
{

    /**
     * @var \Digitalprint\PrintessDesigner\Helper\Data
     */
    protected \Digitalprint\PrintessDesigner\Helper\Data $helper;

    /**
     * @var RequestInterface
     */
    protected RequestInterface $request;
    /**
     * @var SerializerInterface
     */
    protected SerializerInterface $serializer;

    /**
     * @param Data $helper
     * @param RequestInterface $request
     * @param SerializerInterface $serializer
     */
    public function __construct(
        \Digitalprint\PrintessDesigner\Helper\Data $helper,
        RequestInterface $request,
        SerializerInterface $serializer
    )
    {
        $this->helper = $helper;
        $this->request = $request;
        $this->serializer = $serializer;
    }

    /**
     * @param EventObserver $observer
     * @return void
     * @throws JsonException
     */
    public function execute(EventObserver $observer)
    {

        $item = $observer->getQuoteItem();

        if ($this->helper->isJson($this->request->getContent())) {

            $params = json_decode($this->request->getContent(), true, 512, JSON_THROW_ON_ERROR);

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

            if (isset($params['documents'])) {
                $additionalOptions['printess_product_documents'] = [
                    'label' => 'documents',
                    'value' => $params['documents']
                ];
            }

            if (isset($params['priceInfo'])) {
                $additionalOptions['printess_product_price_info'] = [
                    'label' => 'priceInfo',
                    'value' => $params['priceInfo']
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

}
