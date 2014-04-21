angular.module(
    'ertDirectives', ['ertServices', 'pascalprecht.translate']
)

.directive('beerRow', ['currentOrder', function(currentOrder) {
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
	scope.brewery = breweries.filter(function(brewery) {
	    return brewery.id === scope.beer.brewery;
	})[0];
	scope.style = styles.filter(function(style) {
	    return style.id === scope.beer.style;
	})[0];
	// Handler for checking and adding a new item to the order
	scope.addToOrder = function() {
	    currentOrder.add(scope.beer, scope.quantity);
	    scope.quantity = undefined;
	};
    }
    return {
	link: link,
	restrict: 'C'
    };
}])

.directive('navMenu', ['$location', function($location) {
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
}])

.directive('beerDetail', ['$location', 'currentOrder', function($location, currentOrder) {
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
	scope.brewery = breweries.filter(function(brewery) {
	    return brewery.id === scope.beer.brewery;
	})[0];
	scope.style = styles.filter(function(style) {
	    return style.id === scope.beer.style;
	})[0];
	scope.addToOrder = function() {
	    console.log('hello');
	    console.log(scope.addForm);
	    currentOrder.add(scope.beer, scope.quantity);
	    $location.path('/beer/');
	};
    }
    return {
	link: link,
	restrict: 'C'
    };
}])
