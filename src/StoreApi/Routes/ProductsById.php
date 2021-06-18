<?php
namespace Automattic\WooCommerce\Blocks\StoreApi\Routes;

/**
 * ProductsById class.
 *
 * @internal This API is used internally by Blocks--it is still in flux and may be subject to revisions.
 */
class ProductsById extends AbstractRoute {
	/**
	 * Get the path of this REST route.
	 *
	 * @return string
	 */
	public function get_path() {
		return '/products/(?P<slug>[\w-]+)';
	}

	/**
	 * Get method arguments for this REST route.
	 *
	 * @return array An array of endpoints.
	 */
	public function get_args() {
		return [
			'args'   => array(
				'string' => array(
					'description' => __( 'Unique identifier for the resource.', 'woo-gutenberg-products-block' ),
					'type'        => 'string',
				),
			),
			[
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => [ $this, 'get_response' ],
				'permission_callback' => '__return_true',
				'args'                => array(
					'context' => $this->get_context_param(
						array(
							'default' => 'view',
						)
					),
				),
			],
			'schema' => [ $this->schema, 'get_public_item_schema' ],
		];
	}

	/**
	 * Get a single item.
	 *
	 * @throws RouteException On error.
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response
	 */
	protected function get_route_response( \WP_REST_Request $request ) {
		$object = get_page_by_path( $request['slug'], OBJECT, 'product' );

		if ( ! $object || 0 === $object->ID ) {
			throw new RouteException( 'woocommerce_rest_product_invalid_id', __( 'Invalid product ID.', 'woo-gutenberg-products-block' ), 404 );
		}
		if ( ! $object instanceof WC_Product ) {
			$object = wc_get_product( $object->ID );
		}
		return rest_ensure_response( $this->schema->get_item_response( $object ) );
	}
}
