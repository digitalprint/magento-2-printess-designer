<?php

namespace Digitalprint\PrintessDesigner\Controller\Adminhtml\Download;

use DigitalPrint\PrintessDesigner\Model\Cache\Type\CacheType;
use Magento\Backend\App\Action;
use Magento\Backend\App\Action\Context;
use Magento\Catalog\Api\ProductRepositoryInterface;
use Magento\Framework\App\CacheInterface;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\Controller\Result\Redirect;
use Magento\Framework\Serialize\SerializerInterface;
use Magento\Sales\Api\OrderRepositoryInterface;
use Magento\Store\Model\ScopeInterface;
use Printess\Api\PrintessApiClient;

/**
 *
 */
class Index extends Action
{

    /**
     * @var string
     */
    private const CACHE_KEY = CacheType::TYPE_IDENTIFIER;
    /**
     * @var string
     */
    private const CACHE_TAG = CacheType::CACHE_TAG;

    /**
     * @var string
     */
    private const XML_PATH_DESIGNER_SERVICE_TOKEN = 'designer/api_token/service_token';
    /**
     * @var string
     */
    private const XML_PATH_DESIGNER_ORIGIN = 'designer/output/origin';
    /**
     * @var string
     */
    private const XML_PATH_DESIGNER_DPI = 'designer/output/dpi';
    /**
     * @var string
     */
    private const XML_PATH_DESIGNER_OPTIMIZE_IMAGES = 'designer/output/optimize_images';

    /**
     * @var ScopeConfigInterface
     */
    protected $scopeConfig;
    /**
     * @var CacheInterface
     */
    protected $cache;
    /**
     * @var SerializerInterface
     */
    protected $serializer;
    /**
     * @var OrderRepositoryInterface
     */
    protected $orderRepository;
    /**
     * @var ProductRepositoryInterface
     */
    protected $productRepository;
    /**
     * @var Redirect
     */
    protected $resultRedirectFactory;


    /**
     * @param ScopeConfigInterface $scopeConfig
     * @param CacheInterface $cache
     * @param SerializerInterface $serializer
     * @param OrderRepositoryInterface $orderRepository
     * @param ProductRepositoryInterface $productRepository
     * @param Redirect $resultRedirectFactory
     * @param Context $context
     */
    public function __construct(
        ScopeConfigInterface $scopeConfig,
        CacheInterface $cache,
        SerializerInterface $serializer,
        OrderRepositoryInterface $orderRepository,
        ProductRepositoryInterface $productRepository,
        Redirect $resultRedirectFactory,
        Context $context
    )
    {
        $this->scopeConfig = $scopeConfig;
        $this->cache = $cache;
        $this->serializer = $serializer;
        $this->orderRepository = $orderRepository;
        $this->productRepository = $productRepository;
        $this->resultRedirectFactory = $resultRedirectFactory;
        parent::__construct($context);
    }


    /**
     * @param $orderId
     * @param $itemId
     * @return mixed|null
     */
    public function getItemByQuoteItemId($orderId, $itemId)
    {
        $order = $this->orderRepository->get($orderId);
        foreach ($order->getAllItems() as $item) {
            if ($item->getQuoteItemId() === $itemId) {
                return $item;
            }
        }

        return null;
    }

    /**
     * @return \Magento\Framework\App\ResponseInterface|\Magento\Framework\Controller\ResultInterface|void
     * @throws \Printess\Api\Exceptions\ApiException
     */
    public function execute()
    {

        $orderId = $this->getRequest()->getParam('order_id');
        $quoteItemId = $this->getRequest()->getParam('quote_item_id');

        $item = $this->getItemByQuoteItemId($orderId, $quoteItemId);
        $product = $this->productRepository->get($item->getSku());

        if (($options = $item->getProductOptions()) && isset($options['options']['printess_save_token'])) {

            $storeScope = ScopeInterface::SCOPE_STORE;
            $serviceToken = $this->scopeConfig->getValue(self::XML_PATH_DESIGNER_SERVICE_TOKEN, $storeScope);

            $data = [];

            $printess = new PrintessApiClient();
            $printess->setAccessToken($serviceToken);

            $cacheKey = implode("_", [self::CACHE_KEY, $orderId, $quoteItemId]);
            $cacheData = $this->cache->load($cacheKey);

            if (!$cacheData) {

                $job = $printess->production->produce([
                    'templateName' => $options['options']['printess_save_token']['value'],
                    'outputSettings' => [
                        'dpi' => (int)($product->getData('printess_output_dpi') ?? $this->scopeConfig->getValue(self::XML_PATH_DESIGNER_DPI, $storeScope)),
                        'optimizeImages' => (bool)$this->scopeConfig->getValue(self::XML_PATH_DESIGNER_OPTIMIZE_IMAGES, $storeScope),
                    ],
                    'outputFiles' => [
                        ['documentName' => 'myDocument'],
                    ],
                    'origin' => $this->scopeConfig->getValue(self::XML_PATH_DESIGNER_ORIGIN, $storeScope)
                ]);

                $data['jobId'] = $job->jobId;

                $this->cache->save(
                    $this->serializer->serialize($data),
                    $cacheKey,
                    [self::CACHE_TAG],
                    86400 * 30
                );

            } else {
                $data = $this->serializer->unserialize($cacheData);
            }

            $status = null;
            $times = 0;
            $finalStatus = false;
            while (false === $finalStatus) {
                sleep(3);
                ++$times;

                $status = $printess->production->getStatus([
                    'jobId' => $data['jobId'],
                ]);

                if (true === $status->isFinalStatus) {
                    $finalStatus = true;
                }

                if (true === $finalStatus || 60 === $times) {
                    break;
                }
            }

            if (false === $status->isSuccess) {
                throw new \Exception('Something went wrong during printfile creating. Error: ' . $status->errorDetails);
            }

            if (isset($status->result->r->myDocument)) {

                header('Content-Type: application/pdf');
                header('Content-disposition: attachment;filename=' . $status->result->d->myDocument);
                readfile($status->result->r->myDocument);

                die();

            }

            die('file not found');

        }
    }
}
