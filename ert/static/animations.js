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

// Animations for changing pages in the main view
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
