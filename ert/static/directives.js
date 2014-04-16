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
