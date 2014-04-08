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
}]);
