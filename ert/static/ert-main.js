"use stricts";

var ertMain = angular.module(
    'ertMain', ['pascalprecht.translate', 'ngRoute',
		'ertDirectives', 'ngCookies']
)

.config(['$routeProvider', function($routeProvider) {
    $routeProvider
	.when('/', {
	    templateUrl: '/static/home.html'
	})
	.when('/contact/', {
	    templateUrl: '/static/contact.html'
	})
	.when('/about/', {
	    templateUrl: '/static/about.html'
	})
}])

.config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode(true);
}])

// Language independent setup for internationalization
.config(['$translateProvider', function ($translateProvider) {
    $translateProvider
	.useLocalStorage()
	.useStaticFilesLoader({
	    prefix: '/static/l10n.',
	    suffix: '.json'
	})
	.preferredLanguage('en')
	.fallbackLanguage('en')
}])

.controller('langSelect', ['$scope', '$translate', function($scope, $translate) {
    $scope.setLanguage = function(newLanguage) {
	$translate.use(newLanguage);
    };
}])

// CSRF Verification cookies and tokens
.run(['$http', '$cookies', function($http, $cookies) {
    $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;
}])

// Controller for the contact us form that appears around the site
.controller('contactForm', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {
    $scope.reset = function() {
	$scope.message = {
	    name: '',
	    email: '',
	    subject: 'CONTACT_FORM.SUBJECTS.GENERAL',
	    body: ''
	};
    };
    $scope.reset();
    $scope.submit = function(data) {
	// Validate form and submit
	$scope.form.email.$dirty = true;
	$scope.form.$setDirty();
	if ($scope.form.$valid) {
	    $scope.status = 'pending';
	    $http.post('/contact-message/', data)
		.success(function() {
		    // Notify the user of success =)
		    $scope.status = 'success';
		    $timeout(function() {
			// Hide status after a few seconds
			$scope.reset();
		    }, 5000);
		})
		.error(function() {
		    // Notify the user of failure =(
		    $scope.status = 'fail';
		})
	}
    };
}])
