<?php
/**
 * Task 2 Frontend
 * На самом фронте, нужно реализовать создание продукта,  должна получится форма где используются поля описанные выше + название и цена продукта (по стандарту они есть и без custom fields)
 * [ Картинка отправленная формой должна установится как в самом поле custom fields в backend так и стать основной при просмотре всех продуктов:
 * Будет очень хорошим плюсом если будет реализован вывод всех товаров на главной странице, а форма была создана отдельным темплейтом на странице CREATE PRODUCT(темплейт подразумевает Create Template: Name )
 *
 * @package AbeloHost
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if( ! class_exists( 'TSK_AbeloHost_Test_Front' ) ) {

    class TSK_AbeloHost_Test_Front {

        public function __construct() {

			//Add scripts & styles to front
	        add_action( 'wp_enqueue_scripts', array( $this, 'add_scripts_styles') );

			//Load template
			add_filter( 'page_template', array( $this, 'add_page_template') );

			//Add template to template section
			add_filter( 'theme_page_templates', array( $this, 'add_page_templates') );

			//Save product
			add_action('init', array( $this, 'save_product'));
        }



		/**
		* Load template
		*
		* @param  array  $page_template  The list of page templates
		*
		* @return string  $templates  The modified list of page templates
		*/
		public function add_page_template( $page_template ) {
		    if ( get_page_template_slug() == 'add_product.php' ) {
				$page_template = TSK_PLUGIN_PUTH . 'inc/front/add_product.php';
			}
    		return $page_template;
		}

		/**
		* Add template to template section
		*
		* @param  array  $post_templates  The list of page templates
		*
		* @return array  $post_templates  The modified list of page templates
		*/
		public function add_page_templates( $post_templates ) {
		    $post_templates['add_product.php'] = __('Add Product', 'tsk');
    		return $post_templates;
		}


		 /**
         * Add scripts & styles
         */
        public function add_scripts_styles(  ) {
			//Script & style for frontend product add page
			if(is_page_template('add_product.php')){
				wp_enqueue_media();
				wp_enqueue_style( 'tsk_padder_style', TSK_PLUGIN_URL . 'assets/css/product_add.css', array(),TSK_VERSION, );
				wp_enqueue_script( 'tsk_padder_script', TSK_PLUGIN_URL . 'assets/js/product_add.js', array(), TSK_VERSION, true);
			}
        }

		/**
         * Save product
         */
		public function save_product(){
			if(empty($_POST['add_prod']) || empty($_POST['add_prod']['tsk_add_title'])) return false;

			$product_data = array(
				'post_title' => sanitize_text_field($_POST['add_prod']['tsk_add_title']),
				'post_content' => '',
				'post_status' => 'publish',
				'post_type' => "product",
			);
			$post_id = wp_insert_post( $product_data );

			if( !is_wp_error($post_id) ){

				$post   = get_post( $post_id ); // Where 123 is the ID

				if(!empty($_POST['add_prod']['tsk_add_summ'])){
					update_post_meta( $post_id, '_price', $_POST['add_prod']['tsk_add_summ'] );
				}

				update_post_meta( $post_id, '_featured', 'yes' );

				update_post_meta( $post_id, 'tsk_data_prod', get_the_date('Y-m-d', $post_id) );

				if(!empty($_POST['add_prod']['tsk_add_img'])){
					update_post_meta( $post_id, 'tsk_img_url', $_POST['add_prod']['tsk_add_img'] );
				}

				if(!empty($_POST['add_prod']['tsk_add_ptype'])){
					update_post_meta( $post_id, 'tsk_sel_field', $_POST['add_prod']['tsk_add_ptype'] );
				}

				if(!empty($_POST['add_prod']['tsk_add_img_id'])){
					set_post_thumbnail( $post_id, (int) $_POST['add_prod']['tsk_add_img_id'] );
				}

			}else{
				echo $post_id->get_error_message();
			}

		}

    }

}









