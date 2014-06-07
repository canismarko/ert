"use strict";

var ertMain = angular.module(
    'ertMain', ['pascalprecht.translate',
		'ngRoute', 'ngAnimate', 'ngCookies', 'ngResource', 'ngSanitize',
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
	.when('/blog/', {
	    templateUrl: '/static/blog.html',
	    controller: 'blog',
	})
	.when('/beer/', {
	    templateUrl: '/static/beer-store.html',
	    controller: 'beerStore'
	})
	.when('/beer/:beerId/:beerSlug/', {
	    templateUrl: '/static/beer-detail.html',
	    controller: 'beerStore'
	})
	.when('/beer/checkout/', {
	    templateUrl: '/static/checkout.html',
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
.controller('contactForm', ['$scope', '$http', '$timeout', '$translate', 'toaster', function($scope, $http, $timeout, $translate, toaster) {
    $scope.reset = function() {
	// Reset form to its default state
	$scope.status = null;
	$scope.isDirty = false;
	if ($scope.form) {
	    $scope.form.$setPristine();
	}
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
	$scope.isDirty = true;
	$scope.form.$setDirty();
	if ($scope.form.$valid) {
	    toaster.pop('info',
			"We're delivering your message. Hang tight.",
			"Sending",
			{"timeOut": "0"});
	    // Get the translated subject
	    $translate(data.subject).then(function(subject) {
		data.subject = subject;
	    });
	    $http.post('/contact-message/', data)
		.success(function() {
		    // Notify the user of success and reset the form
		    toaster.pop('clear');
		    toaster.pop('success', "Message sent. We'll get back to you soon.");
		    $scope.reset();
		})
		.error(function() {
		    // Notify the user of failure =(
		    toaster.pop('clear');
		    toaster.pop('error',
				"Something went wrong. Check your internet connection",
				"Error");
		});
	}
    };
}]);

ertMain.controller('blog', ['$scope', '$resource', function($scope, $resource) {
    var BlogPost;
    BlogPost = $resource('/api/blog/posts/:blogId/',
			{blogId: '@id'});
    $scope.posts = BlogPost.query();
}]);

ertMain.controller('beerStore', ['$scope', '$routeParams', '$resource', 'currentOrder', function($scope, $routeParams, $resource, currentOrder) {
    // Define API endpoints
    var Beer = $resource(
	'/api/store/beers/:beerId/',
	{beerId: '@id'}
    );
    var Brewery = $resource(
	'/api/store/breweries/:id/',
	{id: '@id'}
    );
    var BeerStyle = $resource(
	'/api/store/beerstyles/:id/',
	{id: '@id'}
    );
    // Get data from API endpoints
    $scope.beerList = Beer.query();
    $scope.breweries = Brewery.query();
    $scope.beerStyles = BeerStyle.query();
    // If detail page, get beer object
    if ($routeParams.beerId) {
	var targetBeerId = parseInt($routeParams.beerId, 10);
	$scope.beerList.$promise.then(function() {
	    $scope.beer = $scope.beerList.filter(function(beer) {
		return beer.id === targetBeerId;
	    })[0];
	    console.log($scope.beer);
	});
    }
    // Persistent local storage for the user's shopping cart
    $scope.currentOrder = currentOrder;
}]);
