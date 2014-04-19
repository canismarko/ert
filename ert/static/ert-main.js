"use strict";

var ertMain = angular.module(
    'ertMain', ['pascalprecht.translate', 'ngRoute', 'ngAnimate',
		'angularLocalStorage', 'ertDirectives', 'ngCookies']
)

.config(['$routeProvider', function($routeProvider) {
    $routeProvider
	.when('/', {
	    templateUrl: '/static/home.html'
	})
	.when('/contact/', {
	    templateUrl: '/static/contact.html',
	})
	.when('/beer/', {
	    templateUrl: '/static/beer-store.html',
	    controller: 'beerStore'
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
    $scope.switchLanguage = function() {
	var newLanguage = $translate('NEXT_LANG').then(function(newLanguage) {
	    $translate.use(newLanguage);
	});
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
}]);

ertMain.controller('beerStore', ['$scope', 'storage', function($scope, storage) {
    $scope.beerList = [
	{
	    id: 1,
	    picture: '/media/beer/two-hearted.jpg',
	    brewery: 1,
	    name: 'Two-hearted',
	    description: 'A floral IPA with a hint of citrus',
	    style: 1,
	    abv: 7.0,
	    stock: 50
	},
	{
	    id: 2,
	    picture: '/media/beer/dirty-bastard.jpg',
	    brewery: 2,
	    name: 'Dirty Bastard',
	    description: 'A scotch ale, heavy on malt character',
	    style: 2,
	    abv: 8.5,
	    stock: 100
	}
    ];
    // Persistent local storage for the user's shopping cart
    storage.bind($scope, 'currentOrder', {defaultValue: []});
    // Handlers for adding or removing from the current order
    $scope.addToOrder = function(beer, quantity) {
	$scope.currentOrder.push({
	    beer: beer,
	    quantity: quantity
	});
    };
    $scope.removeFromOrder = function(orderItem) {
	var i;
	i = $scope.currentOrder.indexOf(orderItem);
	$scope.currentOrder.splice(i, 1);
    };
    $scope.resetOrder = function() {
	$scope.currentOrder.splice(0, $scope.currentOrder.length);
    };
}]);
