"use strict";

var ertMain = angular.module(
    'ertMain', ['pascalprecht.translate', 'ngRoute', 'ngAnimate', 'ngCookies',
		'ertDirectives', 'ertFilters', 'ertServices']
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
	.when('/beer/:beerId/:beerSlug/', {
	    templateUrl: '/static/beer-detail.html',
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
	// .fallbackLanguage('en')
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

ertMain.controller('beerStore', ['$scope', '$routeParams', 'currentOrder', function($scope, $routeParams, currentOrder) {
    $scope.beerList = [
	{
	    id: 1,
	    thumbnail: '/media/beer/two-hearted-thumbnail.jpg',
	    brewery: 1,
	    name: 'Two-hearted',
	    description: 'A floral IPA with a hint of citrus',
	    style: 1,
	    abv: 7.0,
	    stock: 0,
	    price: 120,
	},
	{
	    id: 2,
	    thumbnail: '/media/beer/dirty-bastard.jpg',
	    brewery: 2,
	    name: 'Dirty Bastard',
	    description: 'A scotch ale, heavy on malt character',
	    style: 2,
	    abv: 8.5,
	    stock: 100,
	    price: 135,
	}
    ];
    if ($routeParams.beerId) {
	$scope.beer = {
	    id: 1,
	    picture: '/media/beer/two-hearted-full.png',
	    brewery: 1,
	    name: 'Two-hearted',
	    description: 'A floral IPA with a hint of citrus',
	    detail: 'Bell\'s Two Hearted Ale is defined by its intense hop aroma and malt balance. Hopped exclusively with the Centennial hop varietal from the Pacific Northwest, massive additions in the kettle and again in the fermenter lend their characteristic grapefruit and pine resin aromas. A significant malt body balances this hop presence; together with the signature fruity aromas of Bell\'s house yeast, this leads to a remarkably drinkable American-style India Pale Ale.',
	    style: 1,
	    abv: 7.0,
	    ibu: 55,
	    stock: 0,
	    price: 120,
	};
	$scope.stockClasses = {
	    'text-success': $scope.beer.stock > 20,
	    'text-warning': $scope.beer.stock <= 20
	}
    }
    // Persistent local storage for the user's shopping cart
    $scope.currentOrder = currentOrder;
}]);
