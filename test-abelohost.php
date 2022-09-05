<?php
/**
 * Plugin Name:     The test task for AbeloHost
 * Plugin URI:      https://www.wpbloging.com
 * Description:     The test task for AbeloHost
 * Author:          Oleg Medinskiy
 * Author URI:      https://www.wpbloging.com
 * Text Domain:     tsk
 * Domain Path:     /languages
 * Version:         0.1.0
 *
 * @package         AbeloHost
 */


if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

// Define constants.
if ( ! defined( 'TSK_VERSION' ) ) {
	define( 'TSK_VERSION', '1.0.0' );
}

if ( ! defined( 'TSK_PLUGIN_PUTH' ) ) {
	define( 'TSK_PLUGIN_PUTH', plugin_dir_path( __FILE__ ) );
}

if ( ! defined( 'TSK_PLUGIN_DIRNAME' ) ) {
	define( 'TSK_PLUGIN_DIRNAME', dirname( plugin_basename( __FILE__ ) ) );
}

if ( ! defined( 'TSK_PLUGIN_URL' ) ) {
	define( 'TSK_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
}

if ( ! defined( 'TSK_MIN_WP_VER' ) ) {
	//Minimal WordPress version for plugin
	define( 'TSK_MIN_WP_VER', 5 );
}

if ( ! defined( 'TSK_MIN_WC_VER' ) ) {
	//Minimal WooCommerce version for plugin
	define( 'TSK_MIN_WC_VER', 4 );
}


/*Plugin utils*/
require_once (TSK_PLUGIN_PUTH . 'inc/utils.php');

if(is_admin()){
	/**
	 * Dependeces plugin
	 */
	require_once (TSK_PLUGIN_PUTH . 'inc/admin/class-dependences.php');

}

if(!function_exists('tsk_plugin_start')){
	/**
	 * Start and admin plugin
	 */
	function tsk_plugin_start() {
	    load_plugin_textdomain( 'tsk', false, TSK_PLUGIN_DIRNAME . '/languages/' );

		 if ( is_admin() && class_exists( 'TSK_AbeloHost_Test' )) {
	        new TSK_AbeloHost_Test();
	    }

		 if ( class_exists( 'TSK_AbeloHost_Test_Front' )) {
	        new TSK_AbeloHost_Test_Front();
	    }
	}
	add_action('plugins_loaded', 'tsk_plugin_start');
}

/*Task 1 */
require_once (TSK_PLUGIN_PUTH . 'inc/tasks/task1.php');

/*Task 2 Frontend */
require_once (TSK_PLUGIN_PUTH . 'inc/tasks/task2.php');

