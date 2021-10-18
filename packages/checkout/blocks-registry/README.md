# Checkout - Blocks Registry <!-- omit in toc -->

This directory contains the Checkout Blocks Registry. This provides functions to **register new Inner Blocks** that can be inserted automatically, or optionally, within the cart and checkout blocks in certain areas.

Registered Inner Blocks can either be forced within the layout of the Cart/Checkout Block, or they can just be made available to merchants so they can be inserted manually. Inner Blocks registered in this way can also define a component to render on the frontend in place of the Block.

## Table of Contents <!-- omit in toc -->

- [How Inner Blocks Work](#how-inner-blocks-work)
- [Inner Block Areas](#inner-block-areas)
- [Registering a Block](#registering-a-block)
  - [Registering a Forced Block](#registering-a-forced-block)
  - [Registering a Block Component](#registering-a-block-component)
- [`registerCheckoutBlock( options )`](#registercheckoutblock-options-)
  - [Usage](#usage)
  - [Options](#options)
    - [`metadata` (object, required)](#metadata-object-required)
    - [`component` (function, required)](#component-function-required)
- [`getRegisteredBlocks( blockName )`](#getregisteredblocks-blockname-)
  - [Usage](#usage-1)
- [`hasInnerBlocks( blockName )`](#hasinnerblocks-blockname-)
  - [Usage](#usage-2)

## How Inner Blocks Work

The Checkout Block has several areas in which inner blocks can be registered and added. Once registered, blocks can be inserted by merchants:

![Inner Block Inserter](inserter.png)

If a block is **forced**, merchants won't see the option to insert the block, they will just see the block inserted by default, and they won't be able to remove it from the layout.

## Inner Block Areas

Blocks can be registered within several different areas or parent blocks. Valid values at time of writing include:

| Parent Block/Area                                | Description                                                   |
| :----------------------------------------------- | :------------------------------------------------------------ |
| `woocommerce/checkout-totals-block`              | The right side of the checkout containing order totals.       |
| `woocommerce/checkout-fields-block`              | The left side of the checkout containing checkout form steps. |
| `woocommerce/checkout-contact-information-block` | Within the contact information form step.                     |
| `woocommerce/checkout-shipping-address-block`    | Within the shipping address form step.                        |
| `woocommerce/checkout-billing-address-block`     | Within the billing address form step.                         |
| `woocommerce/checkout-shipping-methods-block`    | Within the shipping methods form step.                        |
| `woocommerce/checkout-payment-methods-block`     | Within the payment methods form step.                         |

See the `innerBlockAreas` typedef for the most up to date list of available areas.

## Registering a Block

To register a checkout block, first, register your Block Type with WordPress using https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/. We recommend using the `blocks.json` method to avoid
repetition.

When registering your block, you should also define the `parent` property to include a list of areas where your block will be available. For example:

```json
{
	"name": "woocommerce/checkout-actions-block",
	"title": "Actions",
	"description": "Allow customers to place their order.",
	"category": "woocommerce",
	"parent": [ "woocommerce/checkout-fields-block" ]
	// ...snip
}
```

### Registering a Forced Block

If you want your block to appear within the layout of the Checkout without merchant intervention, you can implement locking as follows:

```json
{
	"name": "woocommerce/checkout-actions-block",
	"title": "Actions",
	"description": "Allow customers to place their order.",
	"category": "woocommerce",
	"parent": [ "woocommerce/checkout-fields-block" ],
	"attributes": {
		"lock": {
			"type": "object",
			"default": {
				"remove": true,
				"move": true
			}
		}
	}
	// ...snip
}
```

In the above example, the inner block would be inserted automatically, and would not be movable or removable by the merchant.

### Registering a Block Component

After registering your block, you need to define which component will replace your block on the frontend of the store. To do this, use the `registerCheckoutBlock` function from the checkout blocks registry.

## `registerCheckoutBlock( options )`

This function registers a block and it's corresponding component with WooCommerce. The register function expects a JavaScript object with options specific to the block you are registering.

### Usage

```js
// Aliased import
import { registerCheckoutBlock } from '@woocommerce/blocks-checkout';

// Global import
// const { registerCheckoutBlock } = wc.blocksCheckout;

const options = {
	metadata: {
		name: 'namespace/block-name',
		parent: [ 'woocommerce/checkout-totals-block' ],
	},
	component: () => <div>A Function Component</div>,
};

registerCheckoutBlock( options );
```

### Options

The following options are available:

#### `metadata` (object, required)

This is a your blocks metadata (from `blocks.json`). It needs to define at least a `name` (block name), and `parent` (the areas on checkout) to be valid.

#### `component` (function, required)

This is a React component that should replace the Block on the frontend. It will be fed any attributes from the Block and have access to any public context providers under the Checkout context.

You should provide either a _React Component_ or a `React.lazy()` component if you wish to lazy load for performance reasons.

## `getRegisteredBlocks( blockName )`

Returns an array of registered block objects available within a specific parent block/area.

### Usage

```js
// Aliased import
import { getRegisteredBlocks } from '@woocommerce/blocks-checkout';

// Global import
// const { getRegisteredBlocks } = wc.blocksCheckout;

const registeredBlocks = getRegisteredBlocks(
	'woocommerce/checkout-totals-block'
);
```

## `hasInnerBlocks( blockName )`

Check if a block/area supports inner block registration.

### Usage

```js
// Aliased import
import { hasInnerBlocks } from '@woocommerce/blocks-checkout';

// Global import
// const { hasInnerBlocks } = wc.blocksCheckout;

const isValid = hasInnerBlocks( 'woocommerce/checkout-totals-block' ); // true
```

<br/><br/><p align="center">
<a href="https://woocommerce.com/">
<img src="https://woocommerce.com/wp-content/themes/woo/images/logo-woocommerce@2x.png" alt="WooCommerce" height="28px" style="filter: grayscale(100%);
	opacity: 0.2;" />
</a><br/><a href="https://woocommerce.com/careers/">We're hiring</a>! Come work with us!</p>