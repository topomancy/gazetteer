/* Load this script using conditional IE comments if you need to support IE 7 and IE 6. */

window.onload = function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'icomoon\'">' + entity + '</span>' + html;
	}
	var icons = {
			'icon-upload' : '&#x23;',
			'icon-search' : '&#x2f;',
			'icon-export' : '&#x31;',
			'icon-unlocked' : '&#x32;',
			'icon-locked' : '&#x5f;',
			'icon-pencil' : '&#x55;',
			'icon-search-2' : '&#x4a;',
			'icon-arrow-down' : '&#x21;',
			'icon-arrow-up' : '&#x24;',
			'icon-angle-left' : '&#x50;',
			'icon-angle-right' : '&#x4e;',
			'icon-caret-left' : '&#x6e;',
			'icon-caret-right' : '&#x70;',
			'icon-fullscreen' : '&#x25;',
			'icon-download' : '&#x22;',
			'icon-upload-2' : '&#x26;',
			'icon-marker' : '&#x27;',
			'icon-question' : '&#x28;'
		},
		els = document.getElementsByTagName('*'),
		i, attr, html, c, el;
	for (i = 0; i < els.length; i += 1) {
		el = els[i];
		attr = el.getAttribute('data-icon');
		if (attr) {
			addIcon(el, attr);
		}
		c = el.className;
		c = c.match(/icon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
};