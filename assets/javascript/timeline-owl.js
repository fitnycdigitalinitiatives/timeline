$(document).ready(function(){
  var slider = $('#range-slider');
  slider.slider();
  var owl = $('.owl-carousel');
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
            items:2
        },
        768:{
            items:3
        },
        992:{
            items:3
        },
        1200:{
            items:3
        }
    },
    margin: 30,
    stagePadding: 100,
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
    if (coordIndex < 0) {
      $('#range-slider').hide();
    }
    else {
      maxSlider = currentState.relatedTarget._coordinates[coordIndex];
      slider.slider("option", "max", Math.abs(maxSlider));
    }
  };

  function sliderDrag(currentState) {
    $('.ui-slider-handle').css({
      "transition": 'all .25s ease 0s'
    });
    matrix = $('.owl-stage').css( "transform").replace(/[^0-9\-.,]/g, '').split(',');
    xShift = matrix[12] || matrix[4];
    slider.slider("value", Math.abs(xShift));
  }
  // Move Timeline by moving range input
  slider.slider({
    slide: function(event, ui) {
      $('.ui-slider-handle').css({
        "transition": ''
      });
      rangeShift = ui.value;
      $('.owl-stage').css({
        "transform": "translate3d(" + -rangeShift + "px, 0px, 0px)",
        "transition": 'all 0s ease 0s'
      });
    },
    stop: function(event, ui) {
      currentMatrix = $('.owl-stage').css( "transform").replace(/[^0-9\-.,]/g, '').split(',');
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
      $('.owl-stage').css({
        "transition": 'all .25s ease 0s'
      });
    }
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

});
