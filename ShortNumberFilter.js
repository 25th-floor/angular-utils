"use strict";

!function (angular) {

	var Module = angular.module('25th.utils');
	Module.filter('shortNumber', function () {
		return function (bytes, precision) {
			if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
			if (typeof precision === 'undefined') precision = 3;
			var units = ['', 'K', 'M', 'G', 'T', 'P'],
				number = Math.floor(Math.log(bytes) / Math.log(1000));
			if (bytes < 1000) {
				return bytes;
			}

			return (bytes / Math.pow(1000, Math.floor(number))).toFixed(precision) + ' ' + units[number];
		}
	});

}(angular);
