//Functions for NEP button

window.addEventListener( 'DOMContentLoaded', function () {

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
			return await response.text();
		}else{
			return false;
		}
	}

	/**
	 * Insert button to mini cart widget
	 */
	function nep_mini_cart_insert() {
		const mincart_container = document.querySelector('.woocommerce-mini-cart__buttons .checkout');

		if (!mincart_container) {
			self.requestAnimationFrame(nep_mini_cart_insert);
			return;
		}
		if (!mincart_container) return;

		let data = {
			action: 'nep-button'
		};

		nep_ajax_request(data).then(function (res){
			if( res ){
				mincart_container.insertAdjacentHTML('afterend', '<div class="nep-minicart-button">' + res + '</div>');
			}
		});
	}
	nep_mini_cart_insert();


});


