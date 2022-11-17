<?php

namespace Digitalprint\PrintessDesigner\Model\Api\Data;

use Magento\Framework\Model\AbstractExtensibleModel;
use Digitalprint\PrintessDesigner\Api\Data\DesignerInterface;

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
