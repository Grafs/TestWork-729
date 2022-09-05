<?php
/**
 * Dependency plugin class
 *
 * @package AbeloHost
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


class tsk_Dependency {

	/**
	 * Constructor function for this class.
	 */
	public function __construct() {

		add_action( 'activate_plugin', [ $this, 'plugin_activate' ], 10, 1 );

		add_action( 'admin_init', function () {
			if ( ! is_plugin_active( 'woocommerce/woocommerce.php' ) ) {
				add_action( 'admin_notices', [ $this, 'notice_init' ], 10 );
			}
		} );

	}


	/**
	 * Notice error on plugin activate if Woocommerce not instaled or activated
	 */
	 public function plugin_activate($plugin) {

		if($plugin === 'woocommerce-novalnet-expresspay/novalnet-payment-expresspay.php'){


		    if ( ! is_plugin_active( 'woocommerce/woocommerce.php') ) {
				wp_die(
					sprintf(
						__( 'This plugin will function only if the WooCommerce plugin is active. Please %1$sreturn to plugin page%2$s and install or activate WooCommerce plugin', 'tsk' ),
						'<a href="javascript:history.back()">',
						'</a>'
					)
				);
			}

			//Check minimal WordPress version
			global $wp_version;
			if ( version_compare( $wp_version, TSK_MIN_WP_VER, '<' ) ) {
		        wp_die(
					sprintf(
						__( 'This plugin will function only if the <b>WordPress version larger %3$s</b>. %1$sReturn to plugin page%2$s', 'tsk' ),
						'<a href="javascript:history.back()">',
						'</a>',
						TSK_MIN_WP_VER
					)
				);
		    }

			//Check minimal WooCommerce version
			if ( version_compare( WOOCOMMERCE_VERSION, TSK_MIN_WC_VER, '<' ) ) {
				wp_die(
					sprintf(
						__( 'This plugin will function only if the <b>WooCommerce version larger %3$s</b>. %1$sReturn to plugin page%2$s', 'tsk' ),
						'<a href="javascript:history.back()">',
						'</a>',
						TSK_MIN_WC_VER
					)
				);
			}
		}
	}

	/**
	 * Notice if WooCommerce is disabled or absent
	 */
	public function notice_init() {
	    echo '<div id="notice" class="error" style="color:red;"><p>' . sprintf(
			__( 'This plugin will function only if the WooCommerce plugin is active. Please %1$s install and activate WooCommerce plugin %2$s ', 'tsk' ),
			'<a href="https://wordpress.org/plugins/woocommerce/" target="_new">',
			'</a>'
		) . '</p></div>';
	}


}

new tsk_Dependency();
