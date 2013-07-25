"use strict";

!function (window, angular) {

	/** @const */ var POLL_TIMEOUT  = 40000;
	/** @const */ var POLL_INTERVAL = 1000;

	var Module = angular.module('25th.utils');
	Module.factory('Ajax', ['$http', 'Utils', function ($http, Utils) {

		var _scope;

		/** A service for making XHR calls. */
		var Ajax = {};

		/**
		 * Executes the next call to send in the given $scope.
		 *
		 * @param {Object} scope The $scope.
		 *
		 * @returns {Ajax} The original Ajax object.
		 */
		Ajax.inScope = function (scope) {
			_scope = scope;
			return Ajax;
		};

		/**
		 * Sends an AJAX request to the given url. When the request has finished,
		 * the callback is called, if specified. The third parameter, params, can
		 * be omitted completely and a callback specified instead.
		 *
		 * @param {String}          method    One of 'get', 'post', 'put' or 'delete'.
		 * @param {String}          url       The URL to send the request to.
		 * @param {Object|Function} [params]  Optional parameters to send with the request.
		 * @param {Function}        [success] An optional function to call, when the
		 *                                    request has finished successfully.
		 * @param {Function}        [error]   An optional function to call, when the
		 *                                    request has finished with an error.
		 */
		Ajax.send = function (method, url, params, success, error) {
			if (method == null || method == '') return;
			if (url == null || url == '') return;

			method = method.toUpperCase();
			if (typeof params === 'function') {
				error   = success || new Function();
				success = params;
				params  = {};
			} else {
				error   = error   || new Function();
				success = success || new Function();
				params  = params  || {};
			}

			send (method, url, params, success, error, _scope || {});
			_scope = null;
		};

		/**
		 * Polls a resource using the given interval, until a specified result
		 * has been achieved.
		 *
		 * @param {String}   method     One of 'get', 'post', 'put' or 'delete'.
		 * @param {String}   url        The URL to send the request to.
		 * @param {Object}   params     Optional parameters to send with the request.
		 * @param {Function} [callback] An optional function to call, when the
		 *                              server returns a result (success or error).
		 *                              It has to return true to continue polling.
		 * @param {Number}   [interval] The time in milliseconds between each
		 *                              polling request.
		 */
		Ajax.poll = function (method, url, params, callback, interval) {
			if (typeof callback !== 'function') return;

			var args = arguments;
			params.poll      = true;
			params.timeout   = params.timeout   || POLL_TIMEOUT / 1000;
			params.timestamp = params.timestamp || getTimestamp();

			var repoll = function (data) {
				if (!callback(data)) return;

				params.timestamp = data.timestamp || getTimestamp();

				window.setTimeout(function () {
					Ajax.poll.apply(Ajax, args);
				}, interval || POLL_INTERVAL);
			};

			Ajax.send(method, url, params, repoll, repoll);
		};

		// Shortcut Functions   -----------------------------------------------

		/**
		 * Sends a GET request to the given URL. This is a shorthand method for
		 * {@link Ajax.send}. The second parameter can be omitted completely.
		 *
		 * @param {String}            url       The URL to send the request to.
		 * @param {(Object|Function)} [params]  Optional parameters to send with the request.
		 * @param {Function}          [success] An optional function to call, when the
		 *                                      request has finished successfully.
		 * @param {Function}          [error]   An optional function to call, when the
		 *                                      request has finished with an error.
		 */
		Ajax.get = function (url, params, success, error) {
			Ajax.send('get', url, params, success, error);
		};

		/**
		 * Sends a POST request to the given URL. This is a shorthand method for
		 * {@link Ajax.send}. The second parameter can be omitted completely.
		 *
		 * @param {String}            url       The URL to send the request to.
		 * @param {(Object|Function)} [params]  Optional parameters to send with the request.
		 * @param {Function}          [success] An optional function to call, when the
		 *                                      request has finished successfully.
		 * @param {Function}          [error]   An optional function to call, when the
		 *                                      request has finished with an error.
		 */
		Ajax.post = function (url, params, success, error) {
			Ajax.send('post', url, params, success, error);
		};

		/**
		 * Sends a PUT request to the given URL. This is a shorthand method for
		 * {@link Ajax.send}. The second parameter can be omitted completely.
		 *
		 * @param {String}            url       The URL to send the request to.
		 * @param {(Object|Function)} [params]  Optional parameters to send with the request.
		 * @param {Function}          [success] An optional function to call, when the
		 *                                      request has finished successfully.
		 * @param {Function}          [error]   An optional function to call, when the
		 *                                      request has finished with an error.
		 */
		Ajax.put = function (url, params, success, error) {
			Ajax.send('put', url, params, success, error);
		};

		/**
		 * Sends a DELETE request to the given URL. This is a shorthand method for
		 * {@link Ajax.send}. The second parameter can be omitted completely.
		 *
		 * @param {String}            url       The URL to send the request to.
		 * @param {(Object|Function)} [params]  Optional parameters to send with the request.
		 * @param {Function}          [success] An optional function to call, when the
		 *                                      request has finished successfully.
		 * @param {Function}          [error]   An optional function to call, when the
		 *                                      request has finished with an error.
		 */
		Ajax.doDelete = function (url, params, success, error) {
			Ajax.send('delete', url, params, success, error);
		};

		// Internal Helper Functions   ----------------------------------------

		/**
		 * Actually sends the AJAX request.
		 *
		 * @param {String}   method  One of 'get', 'post', 'put' or 'delete'.
		 * @param {String}   url     The URL to send the request to.
		 * @param {Object}   params  Optional parameters to send with the request.
		 * @param {Function} success An optional function to call, when the
		 *                           request has finished successfully.
		 * @param {Function} error   An optional function to call, when the
		 *                           request has finished with an error.
		 * @param {Object}   scope   The target scope which calls this function.
		 */
		function send(method, url, params, success, error, scope) {
			scope.loading = true;
			scope.error = null;

			var config = {
				method  : method,
				url     : url,
				timeout : params.timeout * 1000
			};

			if (method === 'PUT' || method === 'POST') {
				config.data = params;
			} else {
				config.params = params;
			}

			$http(config)
				.success(Utils.bind(handleResponse, scope, success, error))
				.error(Utils.bind(handleResponse, scope, success, error));
		}

		/**
		 * Determines whether the given response data is a success or an error.
		 *
		 * @param {Number} status The response status code.
		 * @param {Object} data   The response body.
		 *
		 * @returns {boolean} True if the response is successful; otherwise false.
		 */
		function isSuccess(status, data) {
			if (status >= 300) return false;
			if (data.success === false) return false;
			if (data.error) return false;

			return true;
		}

		/**
		 * Checks whether the response is successful and invokes the right
		 * response handler.
		 *
		 * @param {Function} success A function to call, when the request has
		 *                           finished successfully.
		 * @param {Function} error   A function to call, when the request has
		 *                           finished with an error.
		 * @param {Object}   data    The response body.
		 * @param {Number}   status  The response status code.
		 */
		function handleResponse (scope, success, error, data, status) {
			scope.loading = false;

			if (isSuccess(status, data)) {
				success(data);
			} else {
				scope.error = data.error;
				error(data);
			}
		}

		/**
		 * Returns the current unix timestamp. If no date is specified, the
		 * current moment is returned.
		 *
		 * @param {Date} [date] A date to compute the timestamp from.
		 *
		 * @return {Number} The timestamp value in seconds.
		 */
		function getTimestamp(date) {
			return Math.floor((date || new Date()).getTime() / 1000)
		}

		return Ajax;

	}]);

}(this, angular);
