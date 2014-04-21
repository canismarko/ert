ertFilters = angular.module('ertFilters', [])

.filter('slugify', [function() {
    return function(string) {
	return string.toLowerCase().replace(/[^a-z_]/g, '-');
    };
}]);
