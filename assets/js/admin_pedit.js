"use strict";

(function($) {
document.addEventListener('DOMContentLoaded', function () {

			let settings = {
				bimage: document.getElementById('tsk_image_button'), //Image button
				brem: document.getElementById('tsk_rem_button'), //Remove image button
				burl: document.getElementById('tsk_image_url'),  //Image url field
				bdate: document.getElementById('tsk_data_prod'),  //Date field
				bsel: document.getElementById('tsk_sel_field'), //Select field
				breset: document.getElementById('tsk_reset'), //Reset button
				bsave: document.getElementById('tsk_submit') //Submit button
			}

			/**
			 * Add image
			 */
			function tsk_img_popup(e) {
				e.preventDefault();

				if ( !settings.bimage.classList.contains('rem') ) {

					let custom_uploader = wp.media({
									library: { type : 'image' },
									multiple: false

							}).on('select', function() {
									let attachment = custom_uploader.state().get('selection').first().toJSON();
									settings.bimage.innerHTML = `<img src="${attachment.url}">`;
									settings.burl.value = attachment.url;
									settings.bimage.classList.add('rem');
									settings.brem.classList.add('rem');

					}).open();
				}

			}

			settings.bimage?.addEventListener('click', tsk_img_popup);


			/**
			 * Remove image
			 */
			function tsk_img_popup_remove(e) {
				e.preventDefault();

				let purl = settings.bimage.getAttribute('data-pimg'); //Placeholder image url
				settings.bimage.innerHTML = `<img src="${purl}">`;
				settings.bimage.classList.remove('rem');
				settings.brem.classList.remove('rem');
				settings.burl.value = ''

			}

			settings.brem?.addEventListener('click', tsk_img_popup_remove);
			
			/**
			 * Reset fields 
			 */
			function tsk_reset_fields(e) {
				e.preventDefault();

					tsk_img_popup_remove(e);
					settings.bdate.value = '';
					settings.bsel.value = '';
			}

			settings.breset?.addEventListener('click', tsk_reset_fields);


			/**
			 * Save post
			 */
			function tsk_save_post(e) {
				e.preventDefault();
					document.getElementById("publish").click();
			}

			settings.bsave?.addEventListener('click', tsk_save_post);
			

});
})(jQuery, document);