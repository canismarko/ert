"use strict";

var ertMain = angular.module(
    'ertMain', ['pascalprecht.translate', 'ngRoute', 'ngAnimate',
		'ertDirectives', 'ngCookies']
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

ertMain.controller('beerStore', ['$scope', function($scope) {
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
}]);

// Animations for the entering the main view
ertMain.animation('.main-view', function() {
    var duration = 350;
    return {
	enter: function(element, done) {
	    element.css('opacity', 0);
	    element.hide();
	    setTimeout(function() {
		element.show();
		jQuery(element).animate({
		    opacity: 1
		}, duration/2, done);
	    }, duration/2);
	},
	leave: function(element, done) {
		element.css('opacity', 1);
		jQuery(element).animate({
		    opacity: 0
		}, duration/2, done);
	}
    };
});

// Animations for loading the page for the first time
ertMain.animation('.header', function() {
    var GROW_DURATION, MOVE_DURATION, FADE_DURATION;
    GROW_DURATION = 1500;
    MOVE_DURATION = 600;
    FADE_DURATION = 300;
    return {
	enter: function(element, done) {
	    var $container, $logo, $realLogo;
	    $container = jQuery('.main-container')
	    $logo = jQuery('.animation-logo');
	    $realLogo = jQuery('.header .logo');
	    $container.css('opacity', 0);
	    $logo.find('h1').animate({'font-size': '36px'}, GROW_DURATION);
	    $logo.find('img').animate({
		height: '67px',
		width: '67px'
	    }, GROW_DURATION, function() {
		$logo.animate({
		    top: $realLogo.offset().top,
		    left: $realLogo.offset().left + 15
		}, MOVE_DURATION, function() {
		    $container.css('opacity', 0);
		    $container.show();
		    $logo.animate({
		    	opacity: 0
		    }, FADE_DURATION, done);
		    $container.animate({
			opacity: 1
		    }, FADE_DURATION, done);
		});
	    });
	}
    };
});
