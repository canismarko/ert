ertDirectives = angular.module(
    'ertDirectives', ['pascalprecht.translate']
)

ertDirectives.directive('beerRow', [function() {
    var breweries = [
	{
	    id: 1,
	    name: 'Bell\'s Brewery',
	    city: 'Kalamazoo',
	    state: 'Michigan',
	    description: 'Hello, there Kalamazoo'
	},
	{
	    id: 2,
	    name: 'Founder\'s',
	    city: 'Grand Rapids',
	    state: 'Michigan',
	    description: 'It\'s grand!!'
	}
    ];
    var styles = [
	{
	    id: 1,
	    short_name: 'IPA',
	    long_name: 'India pale ale',
	    description: 'A light, refreshing ale but very heavy on bittering hops'
	},
	{
	    id: 2,
	    short_name: 'Scotch ale',
	    long_name: null,
	    description: 'A very flavorful ale with strong malty characters'
	}
    ];
    function link(scope, elem, attrs) {
	scope.translationData = {};
	scope.brewery = breweries.filter(function(brewery) {
	    return brewery.id === scope.beer.brewery;
	})[0];
	scope.style = styles.filter(function(style) {
	    return style.id === scope.beer.style;
	})[0];
	// Save some data to pass to the translation service
	scope.translationData.brewery = scope.brewery.name;
	scope.translationData.style = scope.style.short_name;
    }
    return {
	link: link,
	restrict: 'C'
    };
}]);

ertDirectives.directive('navMenu', ['$location', function($location) {
    function link(scope, elem, attrs) {
	var regexps = {
	    'about': new RegExp('^/about/'),
	    'blog': new RegExp('^/blog/'),
	    'beer': new RegExp('^/beer/'),
	    'contact': new RegExp('^/contact/'),
	}
	function setActiveLink() {
	    var path;
	    path = $location.path();
	    scope.linkClasses = {};
	    // Set the current active link menu item
	    if (regexps.about.exec(path)) {
		scope.linkClasses.about = 'active';
	    } else if (regexps.blog.exec(path)) {
		scope.linkClasses.blog = 'active';
	    } else if (regexps.beer.exec(path)) {
		scope.linkClasses.beer = 'active';
	    } else if (regexps.contact.exec(path)) {
		scope.linkClasses.contact = 'active';
	    }
	}
	setActiveLink();
	scope.$on('$locationChangeStart', function() {
	    setActiveLink();
	});
    }
    return {
	link: link,
	restrict: 'C'
    };
}]);
