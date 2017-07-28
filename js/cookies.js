"use strict";

var cookies = {

	setCookie: function(c_description, value, exdays) {
		exdays = 365;
		var exdate = new Date();
		exdate.setDate(exdate.getDate() + exdays);
		var c_value = escape(value) + ((exdays === null) ? "" : ";path=/;expires=" + exdate.toUTCString());
		document.cookie = c_description + "=" + c_value;
	},

	getCookie: function(c_description) {
		var name = c_description + "=";
		var decodedCookie = decodeURIComponent(document.cookie);
		var ca = decodedCookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	},

	deleteCookie: function(c_description) {
		document.cookie = c_description + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
	},

	deleteAllCookies: function() {
		var cookies = document.cookie.split(";");

		for (var i = 0; i < cookies.length; i++) {
			var cookie = cookies[i];
			var eqPos = cookie.indexOf("=");
			var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
			document.cookie = name + "=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT";
		}
	},

	listCookies: function() {
		var theCookies = document.cookie.split(';');
		var o = {};
		for (var i = 0; i < theCookies.length; i++) {
			var name_value = theCookies[i].split("=");
			var name = name_value[0].replace(/^ /, '');
			var value = name_value[1];
			if (o[name] !== undefined) {
				if (!o[name].push) {
					o[name] = [o[name]];
				}
				o[name].push(value || '');
			} else {
				o[name] = value || '';
			}
		}
		return o;
	}
};
