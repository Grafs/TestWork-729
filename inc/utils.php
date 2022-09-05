<?php
/**
 * Utility Files.
 *
 * @package AbeloHost
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if( !function_exists('tsk_get_settings_option') ){
	/**
	 * Easily get option group property values.
	 *
	 * @param  string     $setting_group The name of the option settings.
	 * @param  string     $name          The name of the option in the group.
	 * @param  mixed|bool $default       The default value to return if the option is not set.
	 * @return array|mixed|false Returns false if the option does not exist or is empty; otherwise returns the option.
	 */
	function tsk_get_settings_option( $setting_group, $name = false, $default = false ) {

		if( empty($setting_group) ) return false;

		$options = get_option( $setting_group, $default );

		if(!empty($name) && !empty($options[ $name ]) && is_array($options) ){
			return $options[ $name ];

		}elseif ( !empty($options) && empty($default) && empty($name) ){
			return $options;
		}

		return $default;
	}
}

if( !function_exists('tsk_set_settings_option') ){
	/**
	 * Easily set option group property values.
	 *
	 * @param string $setting_group The option group to set.
	 * @param string $name          The name of the option in the group.
	 * @param mixed  $value         The value to set the targeted option.
	 */
	function tsk_set_settings_option( $setting_group, $name, $value ) {

		if( empty($setting_group) || empty($name) || empty($value)) return false;

		$options = get_option( $setting_group );

		if ( ! is_array( $options ) ) {
			$options = array();
		}

		$options[ $name ] = $value;

		update_option( $setting_group, $options );
	}
}


if( !function_exists('tsk_is_editor') ){
	/**
	 * Is post editor
	 * function to check if the current page is a post edit page
	 *
	 * @return boolean
	 */
	function tsk_is_editor(){
	    global $pagenow;

	    if (!is_admin() || empty($pagenow)) return false;

		if($pagenow !== 'post.php' && $pagenow !== 'post-new.php')  return false;

		if($pagenow === 'post.php' && !empty($_GET['action']) && $_GET['action'] === 'edit'){
			return true;
		}elseif ($pagenow === 'post-new.php'){
			return true;
		}

	    return false;
	}
}


