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

describe("the beerRow directive", function() {
    var $compile, $rootScope, element, currentOrder;
    beforeEach(module('ertDirectives'));
    beforeEach(inject(function($injector) {
	$compile = $injector.get('$compile');
	$rootScope = $injector.get('$rootScope');
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
    it("fetches the beer's style", function() {
	expect($rootScope.style.id).toEqual($rootScope.beer.style);
    });
    it("fetches the beer's brewery", function() {
	expect($rootScope.brewery.id).toEqual($rootScope.beer.brewery);
    });
});

describe("the beerDetails directive", function() {
    var $compile, $rootScope, $location, element, currentOrder;
    beforeEach(module('ertDirectives'));
    beforeEach(inject(function($injector) {
	$location = $injector.get('$location');
	$compile = $injector.get('$compile');
	$rootScope = $injector.get('$rootScope');
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
    it("fetches the beer's style");
    it("fetches the beer's brewery");
});
