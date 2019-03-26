$(document).ready(function(){
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
      $('#range-slider').attr("max", Math.abs(maxSlider));
    }
  };

  function sliderDrag(currentState) {
    matrix = $('.owl-stage').css( "transform").replace(/[^0-9\-.,]/g, '').split(',');
    xShift = matrix[12] || matrix[4];
    $('#range-slider').val(Math.abs(xShift));
  }
  // Move Timeline by moving range input
  $('#range-slider').on("change mousemove", function() {
    rangeShift = $(this).val();
    $('.owl-stage').css( {
      "transform": "translate3d(" + -rangeShift + "px, 0px, 0px)",
      "transition": 'all 0s ease 0s'
    } );
  }).on("mouseup", function() {
    currentMatrix = $('.owl-stage').css( "transform").replace(/[^0-9\-.,]/g, '').split(',');
    currentxShift = currentMatrix[12] || currentMatrix[4];
    coordList = currentState.relatedTarget._coordinates;
    var closest = coordList.reduce(function(prev, curr) {
      return (Math.abs(curr - currentxShift) < Math.abs(prev - currentxShift) ? curr : prev);
    });
    var itemIndex = coordList.indexOf(closest) + 1;
    owl.trigger('to.owl.carousel', itemIndex);
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
