<?php
namespace WPCoupons\Admin\Menu;

/**
 * Loads assets for the React admin frontend.
 */
abstract class AssetLoader {
	/**
	 * URL to the React build folder.
	 *
	 * @var string
	 */
	protected $assets_url;

	/**
	 * Array of scripts to enqueue.
	 *
	 * @var ['handle' => string, 'url' => string]
	 */
	protected $scripts;

	/**
	 * Array of styles to enqueue.
	 *
	 * @var ['handle' => string, 'url' => string]
	 */
	protected $styles;

	/**
	 * Loads assets from React app.
	 *
	 * @param string $assets_url URL to React assets.
	 */
	public function __construct( $assets_url ) {
		$this->assets_url = $assets_url;
	}

	/**
	 * Enqueue scripts and styles needed for admin frontend.
	 */
	public function enqueue_assets() {
		$this->enqueue_scripts_in_order();
		$this->enqueue_styles_in_order();
		$this->localize_scripts();
		$this->enqueue_material_ui_dependencies();
	}

	/**
	 * Enqueues scripts in order in footer. Without version, because Webpack adds hash to filename.
	 */
	protected function enqueue_scripts_in_order() {
		$this->enqueue_assets_in_order(
			$this->scripts,
			function( $handle, $url, $dependencies ) {
				// phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion
				wp_enqueue_script( $handle, $url, $dependencies, null, true );
			}
		);
	}

	/**
	 * Enqueues styles in order. Without version, because Webpack adds hash to filename.
	 */
	protected function enqueue_styles_in_order() {
		$this->enqueue_assets_in_order(
			$this->styles,
			function( $handle, $url, $dependencies ) {
				// phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion
				wp_enqueue_style( $handle, $url, $dependencies, null );
			}
		);
	}

	/**
	 * Executes callback for each asset dependend on its successor.
	 */
	protected function enqueue_assets_in_order( $assets, $enqueue_callback ) {
		$dependencies = array();

		foreach ( $assets as $asset ) {
			$enqueue_callback(
				$asset['handle'],
				$asset['url'],
				$dependencies
			);

			$dependencies = array( $asset['handle'] );
		}
	}

	/**
	 * Pass data to the first script.
	 */
	protected function localize_scripts() {
		if ( empty( $this->scripts ) ) {
			return;
		}

		$handle = $this->scripts[0]['handle'];

		$object_name = 'WP_COUPONS';

		$object = array(
			'PUBLIC_URL' => $this->assets_url,
			'strings'    => array(
				'saved' => __( 'Settings Saved', 'wp-coupons' ),
				'error' => __( 'Error', 'wp-coupons' ),
			),
			'api'        => array(
				'nonce'      => wp_create_nonce( 'wp_rest' ),
				'coupon'     => esc_url( rest_url( 'wp/v2/wp_coupon' ) ),
				'group'      => esc_url( rest_url( 'wp/v2/wp_coupon_group' ) ),
				'addCoupons' => esc_url( rest_url( 'wp-coupons/v1/add-coupons' ) ),
			),
		);

		wp_localize_script( $handle, $object_name, $object );
	}

	/**
	 * Load "Roboto" font needed for Material-UI.
	 *
	 * Even when using Shadow DOM, the font has to be included in the Light DOM.
	 * See https://stackoverflow.com/a/55360574/5312432
	 */
	protected function enqueue_material_ui_dependencies() {
		// phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion
		wp_enqueue_style( 'roboto-font', 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap', array(), null );
	}
}
