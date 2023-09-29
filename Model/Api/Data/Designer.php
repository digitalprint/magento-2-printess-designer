<?php

namespace Digitalprint\PrintessDesigner\Model\Api\Data;

use Digitalprint\PrintessDesigner\Api\Data\DesignerInterface;
use Magento\Framework\Model\AbstractExtensibleModel;

class Designer extends AbstractExtensibleModel implements DesignerInterface
{
    /**
     * Get designer url
     *
     * @return string|null
     */
    public function getUrl()
    {
        return $this->getData(self::URL);
    }

    /**
     * Set designer url
     *
     * @param string $url
     * @return DesignerInterface
     */
    public function setUrl(string $url)
    {
        return $this->setData(self::URL, $url);
    }
}
