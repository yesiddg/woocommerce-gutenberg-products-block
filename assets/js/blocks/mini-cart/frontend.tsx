/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { renderFrontend } from '@woocommerce/base-utils';
import { useStoreCart } from '@woocommerce/base-context/hooks';
import {
	withStoreCartApiHydration,
	withRestApiHydration,
} from '@woocommerce/block-hocs';

/**
 * Internal dependencies
 */
import CartLineItemsTable from '../cart-checkout/cart/full-cart/cart-line-items-table';

// eslint-disable-next-line @wordpress/no-global-event-listener
window.onload = () => {
	const miniCartBlocks = document.querySelectorAll( '.wc-blocks-mini-cart' );

	if ( miniCartBlocks.length === 0 ) {
		return;
	}

	miniCartBlocks.forEach( ( miniCartBlock ) => {
		const miniCartButton = miniCartBlock.querySelector(
			'.wc-blocks-mini-cart-button'
		);
		const miniCartContents = miniCartBlock.querySelector(
			'.wc-blocks-mini-cart-contents'
		);

		if ( ! miniCartButton || ! miniCartContents ) {
			// Markup is not correct, abort.
			return;
		}

		const showContents = async () => {
			miniCartContents.removeAttribute( 'hidden' );
			const MiniCartContents = () => {
				const { cartItems, cartIsLoading } = useStoreCart();

				if ( cartItems.length === 0 ) {
					return (
						<>
							{ __(
								'Cart is empty',
								'woo-gutenberg-products-block'
							) }
						</>
					);
				}

				return (
					<CartLineItemsTable
						lineItems={ cartItems }
						isLoading={ cartIsLoading }
					/>
				);
			};

			renderFrontend( {
				selector: '.wc-blocks-mini-cart-contents',
				Block: withStoreCartApiHydration(
					withRestApiHydration( MiniCartContents )
				),
			} );
		};
		const hideContents = () =>
			miniCartContents.setAttribute( 'hidden', 'true' );

		miniCartButton.addEventListener( 'mouseover', showContents );
		miniCartButton.addEventListener( 'mouseleave', hideContents );

		miniCartContents.addEventListener( 'mouseover', showContents );
		miniCartContents.addEventListener( 'mouseleave', hideContents );

		miniCartButton.addEventListener( 'focus', showContents );
		miniCartButton.addEventListener( 'blur', hideContents );
	} );
};
