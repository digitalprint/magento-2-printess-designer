<?php

namespace Digitalprint\PrintessDesigner\Model\Product\Option\Type;

use Magento\Framework\Exception\LocalizedException;

class Adjustment extends \Magento\Catalog\Model\Product\Option\Type\DefaultType
{

    /**
     * @var \Magento\Framework\Stdlib\StringUtils
     */
    protected $string;

    /**
     * @var \Magento\Framework\Escaper|null
     */
    protected $_escaper = null;

    /**
     * @param \Magento\Checkout\Model\Session $checkoutSession
     * @param \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig
     * @param \Magento\Framework\Escaper $escaper
     * @param \Magento\Framework\Stdlib\StringUtils $string
     * @param array $data
     */
    public function __construct(
        \Magento\Checkout\Model\Session $checkoutSession,
        \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig,
        \Magento\Framework\Escaper $escaper,
        \Magento\Framework\Stdlib\StringUtils $string,
        array $data = []
    ) {
        $this->_escaper = $escaper;
        $this->string = $string;
        parent::__construct($checkoutSession, $scopeConfig, $data);
    }

    /**
     * @param $values
     * @return $this|Adjustment
     * @throws LocalizedException
     */
    public function validateUserValue($values)
    {
        parent::validateUserValue($values);

        $option = $this->getOption();
        $value = $this->getUserValue() !== null ? trim($this->getUserValue()) : '';

        // Check requires option to have some value
        if (strlen($value) == 0 && $option->getIsRequire() && !$this->getSkipCheckRequiredOption()) {
            $this->setIsValid(false);
            throw new LocalizedException(
                __("The product's required option(s) weren't entered. Make sure the options are entered and try again.")
            );
        }

        // Check maximal length limit
        $maxCharacters = $option->getMaxCharacters();
        $value = $this->normalizeNewLineSymbols($value);
        if ($maxCharacters > 0 && $this->string->strlen($value) > $maxCharacters) {
            $this->setIsValid(false);
            throw new LocalizedException(__('The text is too long. Shorten the text and try again.'));
        }

        $this->setUserValue($value);
        return $this;
    }

    /**
     * @return string|null
     */
    public function prepareForCart()
    {
        if ($this->getIsValid() && ($this->getUserValue() !== '')) {
            return $this->getUserValue();
        } else {
            return null;
        }
    }

    /**
     * @param $value
     * @return array|string
     */
    public function getFormattedOptionValue($value)
    {
        return $this->_escaper->escapeHtml($value);
    }

    /**
     * @param string $value
     * @return array|string|string[]
     */
    private function normalizeNewLineSymbols(string $value)
    {
        return str_replace(["\r\n", "\n\r", "\r"], "\n", $value);
    }
}
