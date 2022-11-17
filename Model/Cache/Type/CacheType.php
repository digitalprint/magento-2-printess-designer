<?php

namespace Digitalprint\PrintessDesigner\Model\Cache\Type;

use Magento\Framework\App\Cache\Type\FrontendPool;
use Magento\Framework\Cache\Frontend\Decorator\TagScope;

class CacheType extends TagScope
{

    /**
     * @var string
     */
    public const TYPE_IDENTIFIER = 'printessdesigner';

    /**
     * @var string
     */
    public const CACHE_TAG = 'PRINTESSDESIGNER';

    /**
     * @param FrontendPool $cacheFrontendPool
     */
    public function __construct(FrontendPool $cacheFrontendPool)
    {
        parent::__construct(
            $cacheFrontendPool->get(self::TYPE_IDENTIFIER),
            self::CACHE_TAG
        );
    }
}
