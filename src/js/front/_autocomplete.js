/**
 * Google Place API autocomlete
 */

class nepAutocomplete{

	country = '';
	short_country = '';

	constructor(){

		this.filds = {
			search: document.getElementById('nep-billing_address_serch'),
			country: document.getElementById('nep-billing_country'),
			//country_short: document.getElementById('nep-billing_country_short'),
			city: document.getElementById('nep-billing_city'),
			state: document.getElementById('nep-billing_state_tmp'),
			street: document.getElementById('nep-billing_address_1'),
			house: document.getElementById('nep-billing_address_2'),
			code: document.getElementById('nep-billing_postcode')
		}
		//
		// this.country = '';
		// this.short_country = '';

		this.fdata = {
			search: 'formatted_address',
			country: 'country',
			country_short: 'country_short',
			city: 'locality',
			state: 'administrative_area_level_1',
			street: 'route',
			house: 'street_number',
			code: 'postal_code'
		}

		this.initialize();
	}

	/**
	 * Initialize autocomlete
	 */
	initialize() {

			let self = this;

			if(self.filds['country']){
				self.country = self.filds['country'].options[self.filds['country'].selectedIndex].innerText;
				self.short_country = self.filds['country'].value;
			}

			//Input full address
			let autocomplete = new google.maps.places.Autocomplete(self.filds.search, {
				 types: ["address"]
			});

			google.maps.event.addListener(autocomplete, 'place_changed', function () {
					let place = autocomplete.getPlace();


					for (let dts of Object.keys(self.filds)){
						if(dts === 'country'){
							let ctext = self._findComponent(place, 'country');
							let state = self._findComponent(place, 'state');

							self.filds['country'].selectedIndex = [...self.filds['country'].options].findIndex(option => option.text === ctext);
							self.filds['country'].options[self.filds['country'].selectedIndex].setAttribute('selected', 'selected');

							self.country = ctext;
							self.short_country = self.filds['country'].value;

						}else if(dts === 'state'){
							continue;

						}else{
							self.filds[dts].value = self._findComponent(place, self.fdata[dts]);
							self._filled_label(self.filds[dts]);
						}
					}

					nep_ev_change_country();

					if( self.short_country){
						self._custom_city(self.fdata.city,  self.filds.city, self.short_country);
						self._custom_street(self.fdata.street, self.filds.street, self.short_country );
					}

			});


	}


	/**
	 * Return data
	 */
	_findComponent(result, type) {
    if( !result || !type ) return;

		if( type === 'formatted_address'){
			return result.formatted_address;
		}

		let res = result.address_components.find(item => item.types.includes(type));

		if( type === 'country_short'){
			let typet = 'country';
			res = result.address_components.find(item => item.types.includes(typet));

		}else if( type === 'administrative_area_level_1'){
			let typec = 'administrative_area_level_2';
			res = result.address_components.find(item => item.types.includes(typec));
			if(!res){
				typec = 'administrative_area_level_1';
				res = result.address_components.find(item => item.types.includes(typec));
				if(!res){
					typec = 'locality';
					res = result.address_components.find(item => item.types.includes(typec));
				}
			}
		}

		let componentForm = {
			street_number: 'short_name',
			route: 'long_name',
			locality: 'long_name',
			administrative_area_level_1: 'long_name',
			administrative_area_level_2: 'short_name',
			country: 'long_name',
			country_short: 'short_name',
			postal_code: 'short_name'
		};

		if( res && componentForm[type] && res[componentForm[type]] ){
			return res[componentForm[type]];

		}else{
			return '';
		}

	}

	/**
	 * Custom street
	 */
		_custom_street(val, elem, cs = ''){
			 if( !val || !elem ) return;
			 let self = this;

			 let street_auto = new google.maps.places.Autocomplete(elem, {
					types: ['address'],
					componentRestrictions: {
						 country: cs
					}
			 });
				google.maps.event.addListener(street_auto, 'place_changed', function () {
						let street_res = street_auto.getPlace();
						elem.value = self._findComponent(street_res, val);
				});
		}

	/**
	 * Custom city
	 */
	_custom_city(val, elem, cs = ''){
		 if( !val || !elem ) return;
		 let self = this;

		 let city_auto = new google.maps.places.Autocomplete(elem, {
				types: ['(cities)'],
				componentRestrictions: {
					 country: cs
				}
		 });
			google.maps.event.addListener(city_auto, 'place_changed', function () {
					let city_res = city_auto.getPlace();
					elem.value = self._findComponent(city_res, val);
			});
	}


	/**
	 * Move label
	 */
	_filled_label(elem){
		 if( !elem ) return;
		 const lab = elem.parentElement.querySelector('label');
		 if(lab){
			 lab.classList.add('filled');
		 }
	}

}
new nepAutocomplete();







