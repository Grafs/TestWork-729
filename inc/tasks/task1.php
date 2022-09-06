<?php
/**
 * Task 1
 * 1. При помощи плагина woocommerce реализовать custom fields для продукта.
 * ВНИМАНИЕ! не использовать плагины для самого “custom field” создавать все при помощи кода.
 * 2. В продукте (backend) должны появится дополнительные поля с :
 * картинкой + кнопкой remove для её удаления.
 * время когда был создан продукт, а именно type=”date”.
 * select c выбором типа продукта (rare, frequent, unusual)

 * @package AbeloHost
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if( ! class_exists( 'TSK_AbeloHost_Test' ) ) {

    class TSK_AbeloHost_Test {

        public function __construct() {
            // Create the custom tab
            add_filter( 'woocommerce_product_data_tabs', array( $this, 'create_new_tab' ) );

            // Add the custom fields
            add_action( 'woocommerce_product_data_panels', array( $this, 'add_fields' ) );

            // Save the custom fields
            add_action( 'woocommerce_process_product_meta', array( $this, 'save_fields' ) );

			//Add scripts & styles to admin panel
	        add_action( 'admin_enqueue_scripts', array( $this, 'add_editor_scripts_styles') );
        }


        /**
         * Add the new tab to the $tabs array
         * @param   array $tabs
         */
        public function create_new_tab( $tabs ) {

			$tabs['tsk'] = array(
				'label'    => __( 'Test AbeloHost tab', 'tsk' ),
				'target'   => 'tsk_data_panel',
				'class'    => array( 'tsk_tab', 'show_if_simple', 'show_if_variable' ), // Class for your panel tab - helps hide/show depending on product type
				'priority' => 100,
			);

            return $tabs;

        }


        /**
         * Add fields for the new panel
         */
         public function add_fields() {
			global $post;

			$image_field_url = null;
			$rem_class = null;
			if(!empty($post->ID)){
				$image_field_url = get_post_meta($post->ID, 'tsk_img_url', true);
				if(!empty($image_field_url )){
					$rem_class = 'rem';
				}
			}

			$date_prod = null;
			if(!empty($post->ID)){
				$date_prod = get_post_meta($post->ID, 'tsk_data_prod', true);
				if(empty($date_prod)){
					$date_prod = get_the_date( 'M/D/j' );
				}
			}
			?>

            <div id='tsk_data_panel' class='panel woocommerce_options_panel'>
                <div class="options_group">

				    <p class="form-field tsk-image-fild">
						<label for="tsk_image_url"><?php _e('Add image', 'tsk') ?></label>
						<span class="tsk-image-wrp">
							<button type="button" id="tsk_image_button" title="<?php _e('Click for add image', 'tsk') ?>" class="<?php echo esc_attr($rem_class) ?>" data-pimg="<?php echo esc_url(wc_placeholder_img_src()); ?>" data-pid="<?php echo $post->ID ? esc_attr($post->ID) : '';  ?>">
								<img alt="" src="<?php echo !empty($image_field_url) ? esc_url( $image_field_url ) : esc_url( wc_placeholder_img_src() ); ?>">
							</button>
							<input type="hidden" name="tsk_img_url" id="tsk_image_url" value="<?php echo !empty($image_field_url) ? esc_attr( $image_field_url) : ''; ?>">
							<button type="button" title="<?php _e('Click for remove image', 'tsk') ?>"  class="<?php echo esc_attr($rem_class) ?>" id="tsk_rem_button">×</button>
						</span>
				    </p>

					<p class="form-field tsk-data-fild">
						<label for="tsk_data_prod"><?php _e('Product created', 'tsk') ?></label>
						<input type="date" name="tsk_data_prod" id="tsk_data_prod" value="<?php echo !empty($date_prod) ? esc_attr( $date_prod) : ''; ?>">
				    </p>

					<?php
						woocommerce_wp_select(
							array(
								'id'        => 'tsk_sel_field',
								'label'     => __( 'Type product', 'tsk' ),
								'value' => get_post_meta( get_the_ID(), 'tsk_sel_field', true ),
								'options' => array(
									'' => __('Select...', 'tsk'),
									'rr' => 'rare',
									'fr' => 'frequent',
									'un' => 'unusual'
								)
								)
						);
					?>

					<p class="form-field tsk-reset-fild">
						<button class="button" type="button" id="tsk_reset" ><?php _e('Reset', 'tsk') ?></button>&nbsp;
					    <button class="button button-primary button-large" type="button" id="tsk_submit" ><?php _e('Submit', 'tsk') ?></button>
				    </p>

            </div>
        </div>

        <?php }

        /**
         * Save the custom fields
         * @param object $post_id
         */
        public function save_fields( $post_id ) {

            $product = wc_get_product( $post_id );

			$tsk_img = !empty( $_POST['tsk_img_url'] ) ? $_POST['tsk_img_url'] : '';
			$product->update_meta_data( 'tsk_img_url', sanitize_text_field( $tsk_img ) );

			$tsk_date = !empty( $_POST['tsk_data_prod'] ) ? $_POST['tsk_data_prod'] : '';
			$product->update_meta_data( 'tsk_data_prod', sanitize_text_field( $tsk_date ) );

			$tsk_sel = !empty( $_POST['tsk_sel_field'] ) ? $_POST['tsk_sel_field'] : '';
			$product->update_meta_data( 'tsk_sel_field', sanitize_text_field( $tsk_sel ) );

            $product->save();

        }

		 /**
         * Add scripts & styles
         */
        public function add_editor_scripts_styles(  ) {

			$ptype = get_current_screen()->post_type;

			//Script & style for product editor
			if(!empty($ptype) && $ptype === 'product' && tsk_is_editor()){
				wp_enqueue_style( 'tsk_pedit_style', TSK_PLUGIN_URL . 'assets/css/admin_pedit.css', array(), TSK_VERSION );
				wp_enqueue_script( 'tsk_pedit_script', TSK_PLUGIN_URL . 'assets/js/admin_pedit.js', array(), TSK_VERSION, true);
			}
        }

    }

}









