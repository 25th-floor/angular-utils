"use strict";

!function (angular) {

	var Module = angular.module('25th.utils');
	Module.filter('newline', function() {
		function(text){
			return text.replace(/\n/g, '<br/>');
		}
	});

}(angular);
