//Ajax container in popup
const order_container = document.getElementById('nep-bform-order-products-container');
//Preloader for ajax container in popup
const order_spinner = document.getElementById('nep-bform-order-products-container-prel');

//Change flag
window.nepchange = 0;

/**
 * Ajax rquest function
 */
async function nep_ajax_request(data = {}, metod = 'POST', url = '') {
	//Nonce for Ajax
	if(typeof nepajax !== 'undefined' ){
		data.nonce_code = nepajax.jnn
	}else{
		console.error('Not found plugin ajax nonce');
		return;
	}

	//Url for Ajax
	if(!url){
		url = nepajax.url;
	}

	//Data for Ajax
	let form = new FormData();
		Object.keys(data).forEach( function(element, index){
		form.append(element, data[element]);
	});

	//Call request
	let response = await fetch(url, {
		method: metod, // *GET, POST, PUT, DELETE, etc.
		mode: 'cors', // no-cors, *cors, same-origin
		cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
		credentials: 'same-origin', // include, *same-origin, omit
		redirect: 'follow', // manual, *follow, error
		referrerPolicy: 'no-referrer', // no-referrer, *client
		body: form
	});

	if (await response.ok && await response.status === 200) {
		window.nepchange = 1;
		return await response.text();
	}else{
		return false;
	}
}



/**
 * Remove product item from cart
 */
function nep_remove_cart_item() {

	  const remove_prod_buttons = document.querySelectorAll('.nep-bform-order-product-remover-button');
		if(remove_prod_buttons.length < 1) return;

			for (let btns of remove_prod_buttons) {
				btns.addEventListener("click", function (e) {
					const prod_id = this.getAttribute('data-product-id');
					const prod_key = this.getAttribute('data-item-key');

					if( !prod_id || !prod_key) {
						console.error('Not exist produkt ID or Item key');
						return;
					}

					let data = {
						prod_rem_cart: 1,
						prod_item_key: prod_key,
						prod_item_id: prod_id,
						action: 'nep-order'
					};

					order_spinner.classList.remove('nep-container-prel-hide');
					nep_ajax_request(data).then(function (res){
						if( res ){
							order_spinner.classList.add('nep-container-prel-hide');
							order_container.innerHTML = res;
							console.log('Item ' + prod_id + ' is removed from cart successful');
							nep_init_events();

						}else{
								console.log('Error: Item ' + prod_id + ' can not remove from cart');
						}
					});
				});
			}
}



/**
 * Cart quantity change
 */
function nep_quantity_change() {
	  const quantity_m = document.querySelectorAll('.nep-bform-order-product-quantity-m');
		const quantity_count = document.querySelectorAll('.nep-bform-order-product-count');
		const quantity_p = document.querySelectorAll('.nep-bform-order-product-quantity-p');
		if(quantity_count.length < 1) return;

	  //Debounce
	  const deb_d = new Date();
	  let deb=deb_d.getTime();
		function nep_debounce(interval = 1000) {
			const d = new Date();
			const r = d.getTime() - deb;
			 if (r > interval ) {
				 deb=d.getTime();
				 return true;
			 }else{
				 return false;
			 }
		}

		//Send changed value to backand
		function nep_quantity_change_val(pid, pkey, vl ){
					if( !pid || !pkey) {
						console.error('Not exist produkt ID or Item key');
						return;
					}
						let data = {
							prod_quantity_val: vl,
							prod_item_qp: 1,
							prod_item_key: pkey,
							prod_item_id: pid,
							action: 'nep-order'
						};

						order_spinner.classList.remove('nep-container-prel-hide');
						nep_ajax_request(data).then(function (res){
							if( res ){
								order_spinner.classList.add('nep-container-prel-hide');
								order_container.innerHTML = res;
								nep_init_events();
							}else{
									console.log('Error: Item ' + pid + ' quantity not changed');
							}

						});

		}

		//Input change event
		for (let qi of quantity_count) {
			qi.addEventListener("input", function (e) {

				if(!e.target.value || parseInt(e.target.value) < 1){
					e.target.value = 1;
				}

				if(e.target.value > 1 ){
						nep_quantity_change_val(e.target.parentElement.getAttribute('data-product-id'), e.target.parentElement.getAttribute('data-item-key'), parseInt(e.target.value) );
				}

			});
		}

		//Minus
		if(quantity_m.length > 0){
			for (let qm of quantity_m) {
				qm.addEventListener("click", function (e) {
					let inp = e.target.parentElement.querySelector('.nep-bform-order-product-count');
					if(inp && parseInt(inp.value) > 1 ){
						inp.value = parseInt(inp.value) - 1;
						nep_quantity_change_val(e.target.parentElement.getAttribute('data-product-id'), e.target.parentElement.getAttribute('data-item-key'), parseInt(inp.value) );
					}
				});
			}
		}

		//Plus
		if(quantity_p.length > 0){
			for (let qp of quantity_p) {
				qp.addEventListener("click", function (e) {
					let inpp = e.target.parentElement.querySelector('.nep-bform-order-product-count');
					if(inpp && parseInt(inpp.value) > 0 ){
						inpp.value = parseInt(inpp.value) + 1;
						nep_quantity_change_val(e.target.parentElement.getAttribute('data-product-id'), e.target.parentElement.getAttribute('data-item-key'), parseInt(inpp.value) );
					}

				});
			}
		}

}




/**
 * Coupons events
 */
function nep_coupons() {
	  const rem_button = document.querySelectorAll('.nep-bform-order-summary-coup-remove');

		//Remove coupons
		if(rem_button.length > 0){
			for (let rbutton of rem_button) {
				rbutton.addEventListener("click", function (e) {
					const coupon_code = this.getAttribute('data-coupon-code');
					const prod_key = this.getAttribute('data-item-key');
					//const coupon_id = this.getAttribute('data-coupon-id');

					if( !coupon_code || !prod_key) {
						console.error('Not exist produkt ID in coupon');
						return;
					}

					let data = {
							prod_item_key: prod_key,
							prod_coupon_code: coupon_code,
							action: 'nep-order'
						};

						order_spinner.classList.remove('nep-container-prel-hide');
						nep_ajax_request(data).then(function (res){
							if( res ){
								order_spinner.classList.add('nep-container-prel-hide');
								order_container.innerHTML = res;
								nep_init_events();
							}else{
									console.log('Error: Coupon (' + coupon_code + ') not removed');
							}
						});
				});
			}
		}


		const add_coupon_block = document.getElementById('nep-bform-order-coupon-openblock');
		//Show coupon form for adding
		if(add_coupon_block){
				add_coupon_block.addEventListener("click", function (e) {
					let coupon_form = e.target.parentElement.querySelector('#nep-bform-order-coupon-form');
					if( !coupon_form ) return;

					if(coupon_form.classList.contains('nep-bform-order-coupon-form-hide')){
						coupon_form.classList.remove('nep-bform-order-coupon-form-hide');
					}else{
						coupon_form.classList.add('nep-bform-order-coupon-form-hide');
					}
				});
		}

		const close_coupon_block = document.getElementById('nep-bform-order-coupon-form-close');
		//Close coupon form
		if(close_coupon_block){
				close_coupon_block.addEventListener("click", function (e) {
					let coupon_form = e.target.parentElement;
					if( !coupon_form ) return;
					coupon_form.classList.add('nep-bform-order-coupon-form-hide');
				});
		}

		const add_coupon = document.getElementById('nep-bform-order-coupon-form-add');
		//Add coupon
		if(add_coupon){
				add_coupon.addEventListener("click", function (e) {
					let coupon_block = e.target.parentElement;
					let coupon_code = e.target.parentElement.querySelector('#nep-bform-order-coupon-form-code').value;
					if( !coupon_block || !coupon_code) return;

					let data = {
						  add_coupon: 1,
							prod_coupon_code: coupon_code,
							action: 'nep-order'
						};

						order_spinner.classList.remove('nep-container-prel-hide');
						nep_ajax_request(data).then(function (res){
							if( res ){
								order_spinner.classList.add('nep-container-prel-hide');
								order_container.innerHTML = res;
								console.log('Coupon ' + coupon_code + ' added');
								nep_init_events();
							}else{
									console.log('Error: Coupon (' + coupon_code + ') not added');
							}

						});

				});
		}
}

/**
 * Init functions
 */
function nep_init_events() {
	nep_remove_cart_item();
	nep_quantity_change();
	nep_coupons();
}
nep_init_events();



(function () {
/**
 * Show order on mobile
 */
	const mob_button = document.getElementById('nep-bform-order-mobile');
	if(mob_button){
			mob_button.addEventListener("click", function (e) {
				const mob_order = document.getElementById('nep-bform-order-products-container-wrap');
				if( !mob_order ) return;

				if(mob_order.classList.contains('wrap-show')){
					mob_order.classList.remove('wrap-show');
				}else{
					mob_order.classList.add('wrap-show');
				}
			});
	}
})();

(function () {
/**
 * Animation label on form filds
 */
	const form_blocks = document.querySelectorAll('.nep-bform-user-fild');
	if(form_blocks){
		form_blocks.forEach( function(element, index){

			element.addEventListener("click", function (e) {
				const form_label = e.currentTarget.querySelector('label');
				const form_fild = e.currentTarget.querySelector('.nep-bform-user-fild-fild');

				if( !form_label ||  !form_fild) return;

				if(!form_label.classList.contains('filled')){
					form_label.classList.add('filled');
					form_fild.classList.add('filled');
					form_fild.focus();
				}

				form_fild.addEventListener("change", function (e) {
					if( !form_fild.value ){
						form_label.classList.remove('filled');
						form_fild.classList.remove('filled');
					}
				});
			});

		});
	}

	const form_filds = document.querySelectorAll('.nep-bform-user-fild-fild');
	if(form_filds){
		form_filds.forEach( function(element, index){
			const form_container = element.parentElement;
			const form_label = element.parentElement.querySelector('label');
			const req = element.getAttribute('required');

			if( req ){
				form_label.insertAdjacentHTML('beforeend', ' <span class="requierd">*</span>')
			}

			element.addEventListener("focus", function (e) {
				form_container.classList.add('focused');

					if( !e.currentTarget.value ){
						form_label.classList.add('filled');
						element.classList.add('filled');
					}
			});

			element.addEventListener("focusout", function (e) {
				form_container.classList.remove('focused');
				form_container.classList.remove('not-valid');

					if( !e.currentTarget.value ){
						form_label.classList.remove('filled');
						element.classList.remove('filled');
						e.currentTarget.blur();
					}
			});

		});
	}

})();

/**
 * Continue form, step 2
 */
function show_step2() {

	const bt_continue = document.getElementById('nep-bform-user-submit-button');
	const user_info = document.getElementById('nep-bform-user-form-info');
	const user_check = document.getElementById('nep-bform-user-form-check');
	const form = document.getElementById('nep-bform-user-form');

	if(form && bt_continue) {

		bt_continue.addEventListener("click", function (e) {

			for (const el of form.querySelectorAll("[required]")) {
				if (!el.reportValidity()) {
					el.parentElement.classList.add('not-valid');
					return;
				}else{
					el.parentElement.classList.remove('not-valid');
				}
			}

			let html_check = {};
			let form_check = '';

			for (const el of form.elements) {

				if(el.name === 'billing_first_name' && el.value){
					html_check.first_name = el.value;
					form_check += `<input type="hidden" name="${el.name}" value="${el.value}" ${el.required ? 'required="required"' : ''}>`;
				}

				if(el.name === 'billing_phone' && el.value){
					html_check.phone = el.value;
					form_check += `<input type="hidden" name="${el.name}" value="${el.value}" ${el.required ? 'required="required"' : ''}>`;
				}

				if(el.name === 'billing_email' && el.value){
					html_check.email = el.value;
					form_check += `<input type="hidden" name="${el.name}" value="${el.value}" ${el.required ? 'required="required"' : ''}>`;
				}

				if(el.name === 'billing_last_name' && el.value){
					html_check.last_name = el.value;
					form_check += `<input type="hidden" name="${el.name}" value="${el.value}" ${el.required ? 'required="required"' : ''}>`;
				}

				if(el.name === 'billing_address_1' && el.value){
					html_check.address = el.value;
					form_check += `<input type="hidden" name="${el.name}" value="${el.value}" ${el.required ? 'required="required"' : ''}>`;
				}

				if(el.name === 'billing_address_2' && el.value){
					html_check.apt = el.value;
					form_check += `<input type="hidden" name="${el.name}" value="${el.value}" ${el.required ? 'required="required"' : ''}>`;
				}

				if(el.name === 'billing_postcode' && el.value){
					html_check.postcode = el.value;
					form_check += `<input type="hidden" name="${el.name}" value="${el.value}" ${el.required ? 'required="required"' : ''}>`;
				}

				if(el.name === 'billing_city' && el.value){
					html_check.city = el.value;
					form_check += `<input type="hidden" name="${el.name}" value="${el.value}" ${el.required ? 'required="required"' : ''}>`;
				}

				if(el.name === 'billing_state' && el.value){
					html_check.state = el.value;
					form_check += `<input type="hidden" name="${el.name}" value="${el.value}" ${el.required ? 'required="required"' : ''}>`;
				}

				if(el.name === 'billing_country' && el.value){
					html_check.country = el.value;
					form_check += `<input type="hidden" name="${el.name}" value="${el.value}" ${el.required ? 'required="required"' : ''}>`;
				}

				if(el.name === 'order_comments' && el.value){
					html_check.comments = el.value;
					form_check += `<textarea type="hidden" name="${el.name}" ${el.required ? 'required="required"' : ''}>${el.value}</textarea>`;
				}


				// if (!el.reportValidity()) {
				// 	console.log('It is regure: %o', el );
				// 	return;
				// }
			}
			//console.log('form_check: %o', form_check );
			//console.log('html_check: %o', html_check );

			//const old_content = document.getElementById('nep-bform-user-check').innerHTML;
			//console.log('old_content: %o', old_content );

			const bt_styles = document.getElementById('nep-bform-user-submit-button').getAttribute('style');
			const summ = document.getElementById('nep-bform-order-summary-val').innerHTML;

			let html_res = '<div id="nep-order-check" class="nep-order-check">';

			html_res += `<div class="nep-order-ch-block">
										<h2 class="nep-bform-user-title nep-order-ch-title">${nepajax.sendto}</h2>
										<div class="nep-order-ch-content">${(html_check.first_name ? html_check.first_name + ' ' : '') + (html_check.last_name ? html_check.last_name : '')}</div>
										<div class="nep-order-ch-content nep-order-ch-content-adress">${
														(html_check.address ? html_check.address + ', ': '') +
														(html_check.apt ? html_check.apt + ', ': '') +
														(html_check.city ? html_check.city + ', ': '') +
														(html_check.state ? html_check.city + ' ': '') +
														(html_check.postcode ? html_check.postcode + ', ': '') +
														(html_check.country ? html_check.country: '')
													}</div>
										</div>`;

			if(html_check.comments){
				html_res += `<div class="nep-order-ch-block">
										<h2 class="nep-bform-user-title nep-order-ch-title">${nepajax.notice}</h2>
										<div class="nep-order-ch-content nep-order-ch-text">${(html_check.comments ? html_check.comments.replace(/\r\n|\r|\n/g,"<br />") + ' ' : '')}</div>
										</div>`;
			}


			html_res += `<div class="nep-order-ch-block">
										<h2 class="nep-bform-user-title nep-order-ch-title">${nepajax.payment}</h2>
										<div class="nep-order-ch-content nep-order-ch-card">
											<input class="nep-order-ch-card-number" type="text" name="card" placeholder="${nepajax.card_number}">
											<span class="nep-order-ch-card-expair">
												<input class="nep-order-ch-card-month" type="text" name="month" placeholder="${nepajax.card_m}">
												<span class="nep-order-ch-card-sep">/</span>
												<input class="nep-order-ch-card-year" type="text" name="year" placeholder="${nepajax.card_y}">
											</span>
											<input class="nep-order-ch-card-cvc" type="text" name="cvc" placeholder="${nepajax.card_cvc}">
										</div>
								</div>`;

			html_res += `<div class="nep-bform-user-submit">

				<div class="nep-bform-user-section-error"></div>

				<button type="button" id="nep-bform-user-pay-button" class="nep-bform-user-submit-button" style="${bt_styles}">
					<svg xmlns="http://www.w3.org/2000/svg" id="nep-bform-user-spinner" class="nep-bform-user-spinner hide" width="20" height="20" viewBox="0 0 128 128">
						<g>
							<g fill="#fff">
								<circle cx="16" cy="64" r="16"/>
								<circle cx="16" cy="64" r="16" fill-opacity=".67" transform="rotate(45 64 64)"/>
								<circle cx="16" cy="64" r="16" fill-opacity=".42" transform="rotate(90 64 64)"/>
								<circle cx="16" cy="64" r="16" fill-opacity=".2" transform="rotate(135 64 64)"/>
								<circle cx="16" cy="64" r="16" fill-opacity=".12" transform="rotate(180 64 64)"/>
								<circle cx="16" cy="64" r="16" fill-opacity=".12" transform="rotate(225 64 64)"/>
								<circle cx="16" cy="64" r="16" fill-opacity=".12" transform="rotate(270 64 64)"/>
								<circle cx="16" cy="64" r="16" fill-opacity=".12" transform="rotate(315 64 64)"/>
							</g>
							<animateTransform attributeName="transform" type="rotate" values="0 64 64;315 64 64;270 64 64;225 64 64;180 64 64;135 64 64;90 64 64;45 64 64" calcMode="discrete" dur="800ms" repeatCount="indefinite"/>
						</g>
					</svg>
					<span class="nep-bform-user-submit-text">${nepajax.pay} ${summ}</span>
				</button>

				<button type="button" id="nep-bform-user-back-button" class="nep-bform-user-back-button">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512">
						<path d="M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z"/>
					</svg>
					<span class="nep-bform-user-submit-text">${nepajax.edit_data}</span>
				</button>
			</div>`;

			html_res += '</div>';

			user_check.innerHTML = html_res;
			//document.getElementById('nep-order-check').style.opacity = 1;

			//console.log('html_res: %o', html_res );

			//console.log('old_content: %o', old_content );

// user_info
// user_check

			document.getElementById('nep-bform-user-back-button')?.addEventListener("click", function (e) {
				//document.getElementById('nep-bform-user-check').innerHTML = old_content;
				//new nepAutocomplete();
				//show_step2();
			});

			//html_check.name = '<div class="names">' + ;

				// form_blocks.forEach(function (element, index) {
				//
				// 	element.addEventListener("click", function (e) {
				//
				// 	});
				// });
		});



	}

}
show_step2();



