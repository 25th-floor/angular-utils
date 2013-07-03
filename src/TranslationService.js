"use strict";

!function (angular) {

	var Module = angular.module('25th.utils');
	var _translations = {};

	Module.value('translations', function (translations) {
		angular.extend(_translations, translations);
	});

	Module.factory('translate', ['$locale', function ($locale) {
		return function translate(input) {
			var whens = _translations[input];
			var str = input;
			var value = arguments[1];

			if (typeof whens === 'string') {
				str = whens;
			} else if (typeof whens === 'object') {
				if (!whens[value]) value = $locale.pluralCat(value);
				str = whens[value] || input;
			}

			arguments[0] = str;
			return sprintf.apply(null, arguments);
		};
	}]);

	Module.filter('translate', ['translate', function (translate) {
		return translate;
	}]);

}(angular);
