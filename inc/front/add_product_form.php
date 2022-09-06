<?php
/**
 * Add Product form
 *
 * @package AbeloHost
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

?>

<?php if(!empty($_POST['tsk_res'])) : ?>
	<p class="tsk-result">
		<?php _e('Product successfully added', 'tsk') ?>
	</p>
<?php endif; ?>

<form class="tsk-product-adder" method="post">

	<p class="tsk-form-field">
		<label for="tsk_add_title">*<?php _e('Add title', 'tsk') ?></label>
		<span class="tsk-field-wrp">
			<input type="text" id="tsk_add_title" name="add_prod[tsk_add_title]"  maxlength="50" class="tsk-add-fild" required>
		</span>
	</p>

	<p class="tsk-form-field">
		<label for="tsk_add_summ">*<?php _e('Add price', 'tsk') ?></label>
		<span class="tsk-field-wrp">
			<input type="number" step="0.01" id="tsk_add_summ" name="add_prod[tsk_add_summ]" maxlength="12" class="tsk-add-fild" required>
		</span>
	</p>

	<p class="tsk-form-field">
		<label for="tsk_add_img">*<?php _e('Add image', 'tsk') ?></label>
		<span class="tsk-field-wrp tsk-image-wrp">
			<button type="button" id="tsk_image_button" title="<?php _e('Click for add image', 'tsk') ?>" class="rem-styles" data-pimg="<?php echo esc_url(wc_placeholder_img_src()); ?>" data-pid="<?php echo $post->ID ? esc_attr($post->ID) : '';  ?>">
				<img alt="" src="<?php echo esc_url( wc_placeholder_img_src() ); ?>">
			</button>
			<input type="url" name="add_prod[tsk_add_img]" id="tsk_image_url" value="" required>
			<input type="hidden" name="add_prod[tsk_add_img_id]" id="tsk_image_id" value="">
			<button type="button" title="<?php _e('Click for remove image', 'tsk') ?>"  class="rem-styles" id="tsk_rem_button">×</button>
		</span>
	</p>

	<p class="tsk-form-field">
		<label for="tsk_add_ptype">*<?php _e('Add product type', 'tsk') ?></label>
		<span class="tsk-field-wrp">
			<select id="tsk_add_ptype" name="add_prod[tsk_add_ptype]" class="tsk-add-fild select short" required>
				<option value="">Select...</option>
				<option value="rr">rare</option>
				<option value="fr">frequent</option>
				<option value="un">unusual</option>
			</select>

		</span>
	</p>

	<p class="tsk-form-field tsk-form-buttons">
		<label> </label>
		<span class="tsk-field-wrp">
			<button class="button" type="button" id="tsk_reset" ><?php _e('Reset', 'tsk') ?></button>&nbsp;
			<button class="button" type="submit" id="tsk_submit" ><?php _e('Submit', 'tsk') ?></button>
		</span>
	</p>

</form>













