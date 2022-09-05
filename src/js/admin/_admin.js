"use strict";
(function() {
document.addEventListener('DOMContentLoaded', function () {



/* Select tabs in menu */
(function() {
	const tabNames = {
		general: 'General',
		payment: 'Payments',
		button: 'Button preferences',
		field: 'Field editor',
		related_products: 'Product recommendations',
		currency: 'Currency',
		advanced_settings: 'Advanced'
	};

	function highlightCurrentSubmenu() {
		const parameters = new URLSearchParams(window.location.search);
		const currentTab = parameters.get('tab') || 'general';
		console.log('currentTab: %o', currentTab );
		const menuItems = document.querySelectorAll('#toplevel_page_nep li');
		console.log('menuItems: %o', menuItems );


		for (const item of menuItems) {
			console.log('item: %o', item );
			item.classList.remove('current');
			if (item.textContent.includes(tabNames[currentTab])) {
				item.classList.add('current');
			}
		}
	}

	highlightCurrentSubmenu();

})();

});
})(window, document);