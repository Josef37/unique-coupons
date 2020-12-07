<?php
namespace WPCoupons\Admin;

use WPCoupons\Utils as Utils;

/**
 * Adds a new menu page rendered with React.
 */
class Menu {
	/**
	 * URL to the React build folder.
	 *
	 * @var string
	 */
	private $assets_url;

	/**
	 * ID of the HTML element React should render to.
	 *
	 * @var string
	 */
	private $root_element_id;

	/**
	 * Adds a menu page and loads assets from React app.
	 *
	 * @param string $assets_url URL for assets.
	 * @param string $root_element_id ID of the HTML element React should render to.
	 */
	public function __construct( $assets_url, $root_element_id ) {
		$this->assets_url      = $assets_url;
		$this->root_element_id = $root_element_id;

		add_action( 'admin_menu', array( $this, 'add_menu_page' ) );
	}

	/**
	 * Add submenu page for coupons.
	 */
	public function add_menu_page() {
		add_menu_page(
			__( 'Coupons', 'wp-coupons' ),
			__( 'Coupons', 'wp-coupons' ),
			'manage_options',
			'wp-coupons',
			array( $this, 'render_admin' )
		);
	}

	/**
	 * Render plugin admin page.
	 */
	public function render_admin() {
		$this->enqueue_assets();
		echo '<div id="' . esc_attr( $this->root_element_id ) . '"></div>';
	}

	/**
	 * Enqueue scripts and styles from React.
	 */
	private function enqueue_assets() {
		$assets = $this->get_assets();

		$scripts = $this->get_assets_ending_with( $assets, '.js' );
		$this->enqueue_scripts_in_order( $scripts );
		$this->localize_scripts( $scripts );

		$styles = $this->get_assets_ending_with( $assets, '.css' );
		$this->enqueue_styles_in_order( $styles );
		$this->enqueue_material_ui_dependencies();
	}

	/**
	 * Adds URL to all entrypoints.
	 *
	 * @returns array('handle' => string, 'url' => string)
	 */
	private function get_assets() {
		$entrypoints = $this->get_entrypoints();
		$assets      = array_map( array( $this, 'get_asset_from_entrypoint' ), $entrypoints );
		return $assets;
	}

	/**
	 * Gets entrypoints from React build folder.
	 */
	private function get_entrypoints() {
		$asset_manifest_url = $this->assets_url . '/asset-manifest.json';
		$asset_manifest     = Utils::get_json( $asset_manifest_url );
		return $asset_manifest['entrypoints'];
	}

	/**
	 * Determines `handle` and `url` for an asset entrypoint.
	 */
	private function get_asset_from_entrypoint( $entrypoint ) {
		return array(
			'handle' => $entrypoint,
			'url'    => $this->assets_url . '/' . $entrypoint,
		);
	}

	/**
	 * Filters all assets whose `url` value ends with `$tail`.
	 */
	private function get_assets_ending_with( $assets, $tail ) {
		return array_filter(
			$assets,
			function( $asset ) use ( $tail ) {
				return Utils::ends_with( $asset['url'], $tail );
			}
		);
	}

	/**
	 * Enqueues scripts in order in footer. Without version, because Webpack adds hash to filename.
	 */
	private function enqueue_scripts_in_order( $scripts ) {
		$this->enqueue_assets_in_order(
			$scripts,
			function( $handle, $url, $dependencies ) {
				wp_enqueue_script( $handle, $url, $dependencies, null, true );
			}
		);
	}

	/**
	 * Enqueues styles in order. Without version, because Webpack adds hash to filename.
	 */
	private function enqueue_styles_in_order( $styles ) {
		$this->enqueue_assets_in_order(
			$styles,
			function( $handle, $url, $dependencies ) {
				wp_enqueue_style( $handle, $url, $dependencies, null );
			}
		);
	}

	/**
	 * Executes callback for each asset dependend on its successor.
	 */
	private function enqueue_assets_in_order( $assets, $enqueue_callback ) {
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
	private function localize_scripts( $scripts ) {
		if ( empty( $scripts ) ) {
			return;
		}

		$handle = $scripts[0]['handle'];

		$object_name = 'WP_COUPONS';

		$object = array(
			'PUBLIC_URL' => $this->assets_url,
			'strings'    => array(
				'saved' => __( 'Settings Saved', 'wp-coupons' ),
				'error' => __( 'Error', 'wp-coupons' ),
			),
			'api'        => array(
				'url'   => esc_url( rest_url( 'wp-coupons/v1/settings' ) ),
				'nonce' => wp_create_nonce( 'wp_rest' ),
			),
		);

		wp_localize_script( $handle, $object_name, $object );
	}

	/**
	 * Load "Roboto" font needed for Material-UI.
	 */
	private function enqueue_material_ui_dependencies() {
		wp_enqueue_style( 'roboto-font', 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap' );
	}
}
