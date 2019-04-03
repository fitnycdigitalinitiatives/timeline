$(document).ready(function(){
  var slider = document.getElementById('range-slider');
  noUiSlider.create(slider, {
    start: 0,
    step: 1,
    range: {
        'min': 0,
        'max': 100
    }
  });
  var owl = $('#event-carousel');
  var currentState = '';
  owl.on('initialized.owl.carousel', function(event) {
    currentState = event;
    sliderSetup(currentState);
  });
  owl.owlCarousel({
    responsiveClass:true,
    responsive:{
        0:{
            items:1
        },
        576:{
            items:1
        },
        768:{
            items:2
        },
        992:{
            items:2
        },
        1200:{
            items:3
        },
        1600:{
          items:4
        }
    },
    margin: 30,
    stagePadding: 60,
    nav: false,
    dots: false,
  });

  owl.on('translated.owl.carousel', function(event) {
    currentState = event;
    sliderDrag(currentState);
  });
  owl.on('resized.owl.carousel', function(event) {
    currentState = event;
    sliderDrag(currentState);
    sliderSetup(currentState);
  });


  function sliderSetup(currentState){
    pageSize = currentState.page.size;
    itemCount = currentState.item.count;
    coordIndex = itemCount - pageSize - 1;
    var dateArray = [];
    $( ".owl-item .card" ).each(function( index ) {
      dateArray.push($(this).data('datestart'));
    });

    console.log(compressArray(dateArray));
    if (coordIndex < 0) {
      $('#range-slider').hide();
    }
    else {
      maxSlider = currentState.relatedTarget._coordinates[coordIndex];
      slider.noUiSlider.updateOptions({
        range: {
          'min': 0,
          'max': Math.abs(maxSlider)
        }
      });
    }
  };

  function sliderDrag(currentState) {
    matrix = $('#event-carousel .owl-stage').css( "transform").replace(/[^0-9\-.,]/g, '').split(',');
    xShift = matrix[12] || matrix[4];
    slider.noUiSlider.set(Math.abs(xShift));
  }
  // Move Timeline by moving range input
  slider.noUiSlider.on('update', function (values, handle) {
    rangeShift = values[handle];
    $('#event-carousel .owl-stage').css({
      "transform": "translate3d(" + -rangeShift + "px, 0px, 0px)",
      "transition": 'all 0s ease 0s'
    });
  });
  // Move Timeline to the Appropriate Item Based on Nearest Position
  slider.noUiSlider.on('end', function (values, handle) {
    currentMatrix = $('#event-carousel .owl-stage').css( "transform").replace(/[^0-9\-.,]/g, '').split(',');
    currentxShift = currentMatrix[12] || currentMatrix[4];
    console.log(currentxShift)
    coordList = [0].concat(currentState.relatedTarget._coordinates);
    console.log(coordList);
    var closest = coordList.reduce(function(prev, curr) {
      return (Math.abs(curr - currentxShift) < Math.abs(prev - currentxShift) ? curr : prev);
    });
    var itemIndex = coordList.indexOf(closest);
    console.log(coordList);
    console.log(itemIndex);
    owl.trigger('to.owl.carousel', itemIndex);
    $('#event-carousel .owl-stage').css({
      "transition": 'all .25s ease 0s'
    });
  });
  // Go to the next item
  $('#next').click(function() {
      owl.trigger('next.owl.carousel');
  });
  // Go to the previous item
  $('#previous').click(function() {
      // With optional speed parameter
      // Parameters has to be in square bracket '[]'
      owl.trigger('prev.owl.carousel');
  });

  function compressArray(original) {

  	var compressed = [];
  	// make a copy of the input array
  	var copy = original.slice(0);

  	// first loop goes over every element
  	for (var i = 0; i < original.length; i++) {

  		var myCount = 0;
  		// loop over every element in the copy and see if it's the same
  		for (var w = 0; w < copy.length; w++) {
  			if (original[i] == copy[w]) {
  				// increase amount of times duplicate is found
  				myCount++;
  				// sets item to undefined
  				delete copy[w];
  			}
  		}

  		if (myCount > 0) {
  			var a = new Object();
  			a.value = original[i];
  			a.width = myCount / original.length;
  			compressed.push(a);
  		}
  	}

  	return compressed;
  };

});
//Only load the tag carousel after the entire page loads because font rendering messes up the auto width
$(window).bind("load", function() {
  var tagOwl = $('#tag-carousel');
  tagOwl.owlCarousel({
    autoWidth:true,
    loop: true,
    margin: 30,
    items: 27,
    nav: false,
    dots: false
  });
});
