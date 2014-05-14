"use strict";
angular.module('ertServices', ['LocalStorageModule'])

.factory('currentOrder', ['$rootScope', 'localStorageService', function($rootScope, localStorageService) {
    var order, watcher, listener;
    order = localStorageService.get('currentOrder') || [];
    // Method adds new products to the order
    order.add = function(beer, quantity) {
	var cachedProducts, i;
	// round up partial units
	quantity = Math.ceil(quantity);
	// First check if this product is already in the cart
	cachedProducts = this.filter(function(listItem) {
	    return listItem.beer.id === beer.id;
	});
	if (cachedProducts.length === 0) {
	    // New item so push it onto the order list
	    this.push({beer: beer, quantity: quantity});
	}
	for (i=0; i<cachedProducts.length; i+=1) {
	    // Add the new quantity for existing order items
	    cachedProducts[i].quantity += quantity;
	}
    };
    // Method removes a specific product from the order
    order.remove = function(beer) {
	console.log(beer);
	var targetProducts, i, idx;
	targetProducts = this.filter(function(listItem) {
	    return listItem.beer.id === beer.id;
	});
	for (i=0; i<targetProducts.length; i+=1) {
	    idx = this.indexOf(targetProducts[i]);
	    this.splice(idx, 1);
	}
    };
    // Method removes all order items to clear the cart
    order.reset = function() {
	this.splice(0, this.length);
    };
    // Set local storage/cookie upon change
    watcher = function() { return order };
    listener = function(newOrder) {
	// Calculate order totals and save to local storage
	var i, itm;
	order.totals = {
	    quantity: 0,
	    amount: 0
	};
	for (i=0; i<newOrder.length; i+=1) {
	    itm = newOrder[i];
	    order.totals.quantity += itm.quantity;
	    order.totals.amount += itm.beer.price * itm.quantity;
	}
	localStorageService.set('currentOrder', order)
    };
    $rootScope.$watch(watcher, listener, true);
    return order;
}])

.factory('toaster', ['$translate', function($translate) {
    var toaster;
    // toaster is the object that interacts with the actual library
    toaster = {};
    toaster.pop = function(method, message, title, opts) {
	// Call original toastr functions
	toastr[method](message, title, opts);
    };
    return toaster;
}]);
