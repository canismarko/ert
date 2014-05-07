"use strict";

describe('the currentOrder factory object', function() {
    var currentOrder, beer, beer2;
    beforeEach(function() {
	beer = {
	    id: 1,
	    name: 'Two-hearted'
	};
	beer2 = {
	    id: 2,
	    name: 'Dirty bastard'
	};
    })
    beforeEach(module('ertServices'));
    beforeEach(inject(function($injector) {
	// Clear old shopping cart contents
	$injector.get('localStorageService').clearAll();
	currentOrder = $injector.get('currentOrder');
    }));
    it('adds a new order item using the add() method', function() {
	expect(currentOrder.length).toEqual(0);
	currentOrder.add(beer, 1);
	expect(currentOrder.length).toEqual(1);
	expect(currentOrder[0].beer).toBe(beer);
	expect(currentOrder[0].quantity).toEqual(1);
	currentOrder.add(beer2, 2);
	expect(currentOrder.length).toEqual(2);
	expect(currentOrder[1].beer).toBe(beer2);
	expect(currentOrder[1].quantity).toEqual(2);
    });
    it('rounds partial quantites to the nearest whole unit', function() {
	currentOrder.add(beer, 1.5);
	expect(currentOrder[0].quantity).toEqual(2)
    });
    it('combines orders for the same product', function() {
	currentOrder.add(beer, 1);
	currentOrder.add(beer, 2);
	expect(currentOrder.length).toEqual(1);
	expect(currentOrder[0].beer).toBe(beer);
	expect(currentOrder[0].quantity).toEqual(3);
    });
    it('removes a specific item', function() {
	currentOrder.add(beer, 1);
	currentOrder.add(beer2, 3);
	expect(currentOrder.length).toEqual(2);
	currentOrder.remove(beer);
	expect(currentOrder[0].beer).toBe(beer2);
    });
    it('resets the order', function() {
	currentOrder.add(beer, 1);
	currentOrder.add(beer2, 3);
	currentOrder.reset();
	expect(currentOrder.length).toEqual(0);
    });

})

describe("the beerStore controller", function() {
    var $location, $controller, $rootScope, $httpBackend;
    beforeEach(module('ertMain'));
    beforeEach(inject(function($injector) {
	$location = $injector.get('$location');
	$controller = $injector.get('$controller');
	$rootScope = $injector.get('$rootScope');
	$httpBackend = $injector.get('$httpBackend');
	$httpBackend.whenGET('/static/l10n.en.json').respond(200, '');
	$httpBackend.expectGET('/api/store/beers').respond(200, [
	    {id: 1},
	    {id: 2},
	]);
	$httpBackend.whenGET('/api/store/breweries').respond(200, []);
	$httpBackend.whenGET('/api/store/beerstyles').respond(200, []);
    }));
    it("sets the beer object", function() {
	$location.path('/beer/1/caldera-ipa');
	$controller('beerStore', {$scope: $rootScope,
				  $routeParams: {beerId: "1"}
				 });
	$httpBackend.flush();
	expect($rootScope.beer.id).toEqual(1);
    });
});

describe("the beerRow directive", function() {
    var $compile, $rootScope, $resource, $httpBackend, element, currentOrder;
    beforeEach(module('ertDirectives', 'ngResource'));
    beforeEach(inject(function($injector) {
	$compile = $injector.get('$compile');
	$rootScope = $injector.get('$rootScope');
	$resource = $injector.get('$resource');
	$httpBackend = $injector.get('$httpBackend');
	$rootScope.beer = {
	    id: 1,
	    style: 1,
	    brewery: 1
	};
	$httpBackend.expectGET('/api/store/breweries')
	    .respond(200, [
	    {id: 1},
	    {id: 2}
	]);
	$rootScope.breweries = $resource('/api/store/breweries/').query();
	$httpBackend.expectGET('/api/store/beerstyles')
	    .respond(200, [
	    {id: 1},
	    {id: 2}
	]);
	$rootScope.beerStyles = $resource('/api/store/beerstyles/').query();
	$rootScope.beer = {
	    id: 1,
	    style: 1,
	    brewery: 1
	};
	element = $compile('<div class="beer-row"></div>')($rootScope);
	currentOrder = $injector.get('currentOrder');
    }));
    describe("the addToOrder() method", function() {
	it("adds some beer to the order", function() {
	    $rootScope.quantity = 3;
	    $rootScope.$digest();
	    expect(currentOrder.length).toEqual(0);
	    $rootScope.addToOrder();
	    expect(currentOrder.length).toEqual(1);
	    expect(currentOrder[0].beer).toBe($rootScope.beer);
	    expect(currentOrder[0].quantity).toEqual(3);
	});
	it("sets the quantity model back to zero", function() {
	    $rootScope.quantity = 3;
	    $rootScope.addToOrder();
	    expect($rootScope.quantity).toBe(undefined);
	});
    });
    it("sets the beer's style", function() {
	$httpBackend.flush();
	expect($rootScope.style.id).toEqual($rootScope.beer.style);
    });
    it("sets the beer's brewery", function() {
	$httpBackend.flush();
	expect($rootScope.brewery.id).toEqual($rootScope.beer.brewery);
    });
});

describe("the beerDetails directive", function() {
    var $compile, $rootScope, $location, $resource, $httpBackend, element, currentOrder;
    beforeEach(module('ertDirectives', 'ngResource'));
    beforeEach(inject(function($injector) {
	$location = $injector.get('$location');
	$compile = $injector.get('$compile');
	$rootScope = $injector.get('$rootScope');
	$resource = $injector.get('$resource');
	$httpBackend = $injector.get('$httpBackend');
	$httpBackend.expectGET('/api/store/breweries')
	    .respond(200, [
	    {id: 1},
	    {id: 2}
	]);
	$rootScope.breweries = $resource('/api/store/breweries/').query();
	$httpBackend.expectGET('/api/store/beerstyles')
	    .respond(200, [
	    {id: 1},
	    {id: 2}
	]);
	$rootScope.beerStyles = $resource('/api/store/beerstyles/').query();
	$rootScope.beer = {
	    id: 1,
	    style: 1,
	    brewery: 1
	};
	element = $compile('<div class="beer-detail"></div>')($rootScope);
	currentOrder = $injector.get('currentOrder');
    }));
    describe("the addToOrder() method", function() {
	it("adds some beer to the order", function() {
	    $rootScope.quantity = 3;
	    $rootScope.$digest();
	    expect(currentOrder.length).toEqual(0);
	    $rootScope.addToOrder();
	    expect(currentOrder.length).toEqual(1);
	    expect(currentOrder[0].beer).toBe($rootScope.beer);
	    expect(currentOrder[0].quantity).toEqual(3);
	});
	it("redirects back to the beer list", function() {
	    $rootScope.quantity = 3;
	    $rootScope.$digest();
	    expect(currentOrder.length).toEqual(0);
	    $rootScope.addToOrder();
	    expect($location.path()).toEqual('/beer/');
	});
    });
    it("sets the beer's style", function() {
	$rootScope.$digest();
	$httpBackend.flush();
	expect($rootScope.style.id).toEqual($rootScope.beer.style);
    });
    it("sets the beer's brewery", function() {
	$httpBackend.flush();
	expect($rootScope.brewery.id).toEqual($rootScope.beer.brewery);
    });
    it("$watches the beer property", function() {
	$httpBackend.flush();
	$rootScope.beer = {
	    id: 2,
	    style: 2,
	    brewery: 2
	};
	$rootScope.$digest();
	expect($rootScope.brewery.id).toEqual(2);
    });
});
