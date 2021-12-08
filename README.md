# Printess Designer for Magento2

Thank you for using the "Printess Designer module for Magento2" (Digitalprint_PrintessDesigner).

This package contains everything you need to connect Printess with your Magento commerce shop to get the most advanced editor for print automation and mass customization.

Developed and tested on Magento 2.4 only. Feel free to send us an issue if they are any problems with the extension.

[![Latest Stable Version](http://poser.pugx.org/digitalprint/magento-2-printess-designer/v)](https://packagist.org/packages/digitalprint/magento-2-printess-designer) [![Total Downloads](http://poser.pugx.org/digitalprint/magento-2-printess-designer/downloads)](https://packagist.org/packages/digitalprint/magento-2-printess-designer)

## 1. Documentation

- [Contribute on Github](https://github.com/digitalprint/magento-2-printess-designer)
- [Releases](https://github.com/digitalprint/magento-2-printess-designer/releases)
- [Printess Knowledge Base](https://printess.com/kb/)

## 2. How to install Printess Designer Extension

### Install via composer (recommend)

Run the following command in Magento 2 root folder:

```
composer require digitalprint/magento-2-printess-designer
php bin/magento setup:upgrade
```

## 3. User Guide

This module integrates the Printess Editor into Magento2. If the module is activated and a product is configured accordingly, the buy button is automatically replaced with the design button. When clicked, the preconfigured designer opens to edit the product. Finished configured products can be put directly into the shopping cart via the designer. The relevant configuration is saved and transmitted through the normal magento checkout.

After the purchase, the store owner can simply download the generated PDF from printess via the sales overview.

### 3.1 General Configuration

![General](https://user-images.githubusercontent.com/14890174/144609004-3464554a-4ed0-4696-aa00-5cd60a87e081.png)

Log into the Magento administration panel, go to Stores > Configuration  > Printess > Designer

Choose Yes to enable the extension.

### 3.1.2 API-Token

![API Token](https://user-images.githubusercontent.com/14890174/144609082-9bbeeefb-12d7-41da-9f6d-8ebc1dbee6ff.png)

You will find your Shop- and Service-Token in your [printess account](https://editor.printess.com/) in the account menu to the right of the top menu bar.

- Shop Token: The shop token allows loading of templates and snippets, upload images and saving / loading the current layout.
- Service Token: The service token has access to the production api and can render PDFs or PNGs.

### 3.1.3 Colors

![Colors](https://user-images.githubusercontent.com/14890174/144609178-881262d2-bacf-450b-867a-6295d19559d1.png)

Choose color. This will change the color of primary elements like links, buttons, etc ...

### 3.1.4 Output

![Output](https://user-images.githubusercontent.com/14890174/144609340-69c26f59-4c95-40e0-9e45-0478ba77e905.png)

- Origin: Identifier for orders from this magento scope.
- Optimize Images: Global setting. Enable images optimization during the rendering of print files.
- DPI: Global fallback. Each product can have individual print resolution settings.

### 3.2 Product Configuration

![Product Configuration](https://user-images.githubusercontent.com/14890174/144617146-117b947b-d298-4a68-92d3-1dc5e8767699.png)

Each product must be configured individually for the editor. This can be done for the respective product in the catalog under the item "Printess".
The following fields can be configured.

- Template-Name: the name of the template assigned in Printess.
- Document-Name: optional, if not supplied primary or first document is used.
- Form Fields (JSON): read "mapping the form fields" for detailed informations.
- DPI: optional: optional, overwrite global print resolution settings

### 3.3 Mapping the form fields

Since there is no direct link from a Printess template to a Magento product, a mapping is necessary which is created via this JSON field.

Example: 
```
[{"printess_ff_name": "DOCUMENT_SIZE", "pim_attr_name": "poster_din_format", "value": "42x59.4"}]
```

The attribute printess_ff_name contains the configurable property which is configured in printess. In this example it's "DOCUMENT_SIZE". In Magento a configurable product must be created. The attribute values must be the same as in Printess.

![Printess Document Size](https://user-images.githubusercontent.com/14890174/144631170-4581ba7b-c2f0-4267-ac1a-c0c55dbdce46.png)
![Magento Attributes](https://user-images.githubusercontent.com/14890174/144630691-fa390ad6-46a2-474b-bb28-9ac2315c01ae.png)

## 4. Download print files

After a customer has completed an order with Printess products you will find the download link to the pdf file under "Items Ordered" listed at the order details.

Admin > Sales > Orders > #ID > Items Ordered

![Print Files](https://user-images.githubusercontent.com/14890174/145195421-5d6bdb39-03d3-452c-81f3-f77b78eb2b63.png)
