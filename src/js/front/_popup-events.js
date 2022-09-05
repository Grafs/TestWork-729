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
							console.log('res: %o', res );
							if( res ){
								order_spinner.classList.add('nep-container-prel-hide');
								order_container.innerHTML = res;
								//console.log('Coupon ' + coupon_code + ' added');
								nep_init_events();
							}else{
								  order_spinner.classList.add('nep-container-prel-hide');
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
					if( !form_fild.value && form_fild.tagName !== 'SELECT' ){
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

					if( !e.currentTarget.value && e.currentTarget.tagName !== 'SELECT' ){
						form_label.classList.remove('filled');
						element.classList.remove('filled');
						e.currentTarget.blur();
					}
			});

		});
	}

})();

let nep_change_country_state = function (){
	//Change State by Change Country
	const country_sel = document.getElementById('nep-billing_country');
	if(country_sel) {
    function nep_ev_change_country(){
				let state_inp = document.getElementById('nep-billing_state_tmp');
				let state_ok = document.getElementById('nep-billing_state');
				let state_opt = document.getElementById('nep-states');
				state_inp.value = '';
				state_ok.value = '';
				state_opt.innerHTML = '';

				let data = {
					nep_country: country_sel.value,
					nonce_code: nepajax.jnn,
					action: 'nep-get-state'
				};

				let form = new FormData();
				Object.keys(data).forEach( function(element, index){
					form.append(element, data[element]);
				});

				fetch(nepajax.url, {
						method: 'POST',
					  body: form,
					  credentials: 'same-origin'
					}

				)
					.then((response) => response.json())
					.then((text) => {

						if(text.success === true) {
							state_inp.removeAttribute('disabled');
							state_inp.value = '';
							state_ok.value = '';
							state_opt.innerHTML = text.data;
						}else{
							state_inp.value = '';
							state_ok.value = '';
							state_opt.innerHTML = '';
							state_inp.setAttribute('disabled', 'disabled');
							state_inp.parentElement.querySelector('label').classList.remove('filled');
						}

					}).catch((error) => {
						console.log('Fetch error: %o', error );
					});
	  }
		window.nep_ev_change_country = nep_ev_change_country;
		country_sel.addEventListener("change", nep_ev_change_country);
	}


	//Change State
	const state_inp = document.getElementById('nep-billing_state_tmp');
	if(state_inp) {
		const sopts_arr = [...document.querySelectorAll('#' + state_inp.getAttribute('list') + ' option')].map( option => option.innerText);

		if(sopts_arr.length > 0) {
			let hiddenInput = document.getElementById('nep-billing_state');

			state_inp.addEventListener("keyup", e => {
				if (!sopts_arr.some(word => new RegExp(e.target.value, "i").test(word)) && e.target.value.length > 0) {
					e.target.value = e.target.value.slice(0, -1);
					e.preventDefault();
					return null;
				}
			});

			state_inp.addEventListener("input", e => {
				let options = document.querySelectorAll('#' + e.target.getAttribute('list') + ' option[value="' + e.target.value + '"]');
				if (options.length > 0) {
					hiddenInput.value = e.target.value;
					state_inp.value = options[0].innerText;
					setTimeout(function () {
						state_inp.setSelectionRange(state_inp.value.length, state_inp.value.length);
					}, 100);
				}
			});

		}
	}
}
nep_change_country_state();
window.nep_change_country_state = nep_change_country_state;

/**
 * Continue form, step 2
 */
function nep_show_step() {

	//Button continue
	const bt_continue = document.getElementById('nep-bform-user-submit-button');
	//Block user info
	const user_info = document.getElementById('nep-bform-user-form-info');
	//Block user check
	const user_check = document.getElementById('nep-bform-user-form-check');
	//Button return back
	const bt_back = document.getElementById('nep-bform-user-back-button');
	//Form
	const form = document.getElementById('nep-bform-user-form');
	//Send to container
	const sendto = document.getElementById('nep-order-ch-sendto-wrp');

	//Step counter
	const step_first = document.getElementById('nep-bform-steps-first');
	const step_second = document.getElementById('nep-bform-steps-second');

	if(form && bt_continue) {

		let get_full_name = () => {
				const f_name = form.querySelector('#nep-billing_first_name');
				const l_name = form.querySelector('#nep-billing_last_name');

				let full_name = '';
				if(f_name && f_name.value && sendto){
					full_name = `<span>${f_name.value}</span>`;
				}

				if(l_name && l_name.value && sendto ){
					full_name += ` <span>${l_name.value}</span>`;
				}

				if(full_name){
					sendto.insertAdjacentHTML('beforeend', `<div id="nep-order-ch-fullname" class="nep-order-ch-content">${full_name}</div>`);
				}

		}

		let get_full_address = () => {
			  const zip = form.querySelector('#nep-billing_postcode');
				const country = form.querySelector('#nep-billing_country');
				const state = form.querySelector('#nep-billing_state_tmp');
				const city = form.querySelector('#nep-billing_city');
				const address = form.querySelector('#nep-billing_address_1');
				const apartment = form.querySelector('#nep-billing_address_2');

				if(sendto){
					let full_adr = (address.value ? address.value + ', ': '') +
															(apartment.value ? apartment.value + ', ': '') +
															(city.value ? city.value + ', ': '') +
															(state.value ? state.value + ' ': '') +
															(zip.value ? zip.value + ', ': '') +
															(country.value ? country.value: '');

					if(full_adr){
						sendto.insertAdjacentHTML('beforeend', `<div id="nep-order-ch-fulladress" class="nep-order-ch-content nep-order-ch-content-adress">${full_adr}</div>`);
					}
				}

		}

		let get_email = () => {
			  const emai = form.querySelector('#nep-billing_email');
				if(emai && emai.value && sendto){
						sendto.insertAdjacentHTML('beforeend', `<div id="nep-order-ch-email" class="nep-order-ch-content">${nepajax.email}: ${emai.value}</div>`);
				}
		}

		let get_phone = () => {
			  const phone = form.querySelector('#nep-billing_phone');
				if(phone && phone.value && sendto){
						sendto.insertAdjacentHTML('beforeend', `<div id="nep-order-ch-phone" class="nep-order-ch-content">${nepajax.phone}: ${phone.value}</div>`);
				}
		}

		let get_comment = () => {
			  const notice = form.querySelector('#nep-billing_notes');
				if(notice && notice.value && sendto){
						sendto.insertAdjacentHTML('beforeend', `<div id="nep-order-ch-notice" class="nep-order-ch-content nep-order-ch-content-notice">${nepajax.notice}:<div class="nep-order-ch-content-notice-txt">${notice.value.replace(/\r\n|\r|\n/g,"<br />")}</div></div>`);
				}
		}

		//Click on Continue
		bt_continue?.addEventListener("click", function (e) {

			//Validate form
			for (const el of form.querySelectorAll("[required]")) {

				if (!el.reportValidity()) {
						el.parentElement.classList.add('not-valid');
						return;
					}else{
						el.parentElement.classList.remove('not-valid');
					}
				}

			//Fill data
			if(sendto) sendto.innerHTML = '';
			get_full_name();
			get_full_address();
			get_email();
			get_phone();
			get_comment()

			//Show hide step blocks
			user_info.classList.remove('show-step');
			user_check.classList.add('show-step');
			step_first.classList.remove('current');
			step_second.classList.add('current');

			const card_fild = document.getElementById('nep-order-ch-card');
			for (const el of card_fild.querySelectorAll("input")) {
				el.removeAttribute('disabled');
			}



		});

		//Click on Back
		bt_back?.addEventListener("click", function (e) {
			//Show 1 step
			const card_fild = document.getElementById('nep-order-ch-card');
			for (const el of card_fild.querySelectorAll("input")) {
				el.setAttribute('disabled', 'disabled');
			}
			user_info.classList.add('show-step');
			user_check.classList.remove('show-step');
			step_first.classList.add('current');
			step_second.classList.remove('current');
			document.getElementById('nep-bform-user-section2-error').innerHTML = '';


		});

		//Click on Back on counter
		step_first?.addEventListener("click", function (e) {
			//Show 1 step
			user_info.classList.add('show-step');
			user_check.classList.remove('show-step');
			step_first.classList.add('current');
			step_second.classList.remove('current');
			document.getElementById('nep-bform-user-section2-error').innerHTML = '';
		});

		//Click on Pay
		document.getElementById('nep-bform-user-pay-button')?.addEventListener("click", function (e) {

			let formData = new FormData(document.forms.nep_bform_user_form);
			//formData.append('order_id', 23);
			formData.append('action', 'nep-pay-oder');

			let json_data = Object.fromEntries(formData);

			// let data = {
			// 	order_id: 23,
			// 	action: 'nep-pay-oder'
			// };

			const order_pay_spinner = document.getElementById('nep-bform-user-spinner');
			order_pay_spinner.classList.remove('nep-container-prel-hide');

			nep_ajax_request(json_data).then(function (res){
				if( res ){
					order_pay_spinner.classList.add('nep-container-prel-hide');
					res = JSON.parse(res);
					if(res.result === 'success' && res.redirect){
						window.location.href = res.redirect;

					}else{
						document.getElementById('nep-bform-user-section2-error').innerHTML = '<div class="nep-error-mes">' + res.messages + '</div>';
						console.log('Error, payment has not passed: %o', res);
					}

				}else{
						console.log('Error, payment has not passed');
						order_pay_spinner.classList.add('nep-container-prel-hide');
				}

			});


		});

	}

}
nep_show_step();



