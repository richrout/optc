angular.module('app')
	.controller('ContactCtrl', function($scope, $http, $log, promiseTracker, $timeout) {
		var self = this;

		self.subjectOptions = [
			{name: 'Report a bug', value: 'bug'},
			{name: 'Make a suggestion', value: 'suggestion'},
			{name: 'Leave feedback', value: 'feedback'}
		];

		self.progress = promiseTracker();

		// default values for request
		var config = {
			params : {
				'callback' : 'JSON_CALLBACK',
				'name' : self.name,
				'email' : self.email,
				'subject' : self.subjectList,
				'comments' : self.comments
			}
		};

		// JSONP request
		var $promise = $http.jsonp('response.json', config)
			.success(function(data, status, headers, config) {
				if (data.status == 'OK') {
					self.name = null;
					self.email = null;
					self.subject = null;
					self.comments = null;
					self.messages = 'Your form has been sent!';
					self.submitted = false;
				} else {
					self.messages = 'Oops, we received your request, but there was an error processing it.';
					$log.error(data);
				}
			})
			.error(function(data, status, headers, config) {
				self.progress = data;
				self.messages = 'There was a network error. Try again later.';
				$log.error(data);
			})
			.finally(function() {
				// Hide status messages after three seconds.
				$timeout(function() {
					self.messages = null;
				}, 3000);
			});

		// // Track the request and show its progress to the user.
		// self.progress.addPromise($promise);
	});