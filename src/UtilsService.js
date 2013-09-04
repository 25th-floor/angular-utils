"use strict";

!function (angular) {

	var Module = angular.module('25th.utils');
	Module.factory('Utils', [function () {

		/** A collection of useful utilities. */
		var Utils = {};

		/**
		 * Ensures an object to have a key value. When the key is not present
		 * in the target object, a factory function is executed to generate
		 * the value.
		 * <p/>
		 * Source: angular.js
		 *
		 * @param {Object}   obj     The target object.
		 * @param {String}   name    The key within the target object.
		 * @param {Function} factory The factory to be executed, when the
		 *                           key is missing.
		 *
		 * @returns {*} The generated object.
		 */
		Utils.ensure = function ensure(obj, name, factory) {
			return obj[name] || (obj[name] = factory());
		};

		/**
		 * Binds parameters to the given callback function. These parameters
		 * will be injected to the callback before all parameters of the
		 * actual function call.
		 *
		 * @param {Function} callback A function which will receive the bound
		 *                            parameters.
		 *
		 * @returns {Function} The bound function.
		 */
		Utils.bind = function bind(callback) {
			var bound = Array.prototype.slice.call(arguments, 1);
			return function () {
				var args = Array.prototype.slice.call(arguments);
				callback.apply(this, bound.concat(args));
			};
		};

		/**
		 * Redirects the current browser window to the given url.
		 *
		 * @param {String} url The target url.
		 */
		Utils.redirect = function redirect(url) {
			location.href = url;
		};

		return Utils;

	}]);

}(angular);
