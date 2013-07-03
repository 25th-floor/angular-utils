"use strict";

!function (angular) {

	// Angular factories

	var Module = angular.module('25th.utils');

	Module.run(['$locale', setLocale]);

	Module.value('translations', addTranslations);
	Module.value('translate', translate);
	Module.value('_', translate);
	Module.filter('i18n', function () {
		return translate;
	});

	// Methods

	var _locale;
	var _translations = {};

	function setLocale($locale) {
		_locale = $locale;
	}

	function addTranslations (translations) {
		angular.extend(_translations, translations);
	}

	function translate(input) {
		var whens = _translations[input];
		var str = input;
		var value = arguments[1];

		if (typeof whens === 'string') {
			str = whens;
		} else if (typeof whens === 'object') {
			if (!whens[value]) value = _locale.pluralCat(value);
			str = whens[value] || input;
		}

		arguments[0] = str;
		return sprintf.apply(null, arguments);
	}

}(angular);

