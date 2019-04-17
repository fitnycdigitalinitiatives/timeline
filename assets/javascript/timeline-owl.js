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
      // Set up date markers
      var dateArray = [];
      $(".owl-item .card").each(function(index) {
        dateArray.push($(this).data('datestart'));
      });
      coordListMarker = [0].concat(currentState.relatedTarget._coordinates);
      var dateArrayObject = [];
      var currentDate = '';
      for (var x in dateArray) {
        dateObject = {};
        if (dateArray[x] != currentDate) {
          dateObject.value = dateArray[x];
          if ((Math.abs(coordListMarker[x])) > (Math.abs(maxSlider))) {
            dateObject.coordinate = maxSlider;
          } else {
            dateObject.coordinate = coordListMarker[x];
          }
          dateArrayObject.push(dateObject);
          // set current
          currentDate = dateArray[x];
        }
      }
      // delete old markers
      $('.date-marker').detach();
      // add new
      for (var x in dateArrayObject) {
        var percentLeft = (Math.abs(dateArrayObject[x].coordinate) / Math.abs(maxSlider)) * 100;
        $('#range-slider').append(
          '<div class="date-marker" style="left: ' + percentLeft + '%;">' + dateArrayObject[x].value + '</div>'
        );
      }
      // remove duplicates
      var yearArray = [];
      var duplicates = $('.date-marker').filter(function() {
        return $(this).attr( "style" ) == 'left: 100%;';
      });
      duplicates.each(function(index) {
        yearArray.push(Number($(this).text()));
      });
      var maxYear = Math.max.apply(Math,yearArray);
      duplicates.each(function(index) {
        if ((Number($(this).text())) != maxYear) {
          $(this).detach();
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
  slider.noUiSlider.on('change', function (values, handle) {
    currentMatrix = $('#event-carousel .owl-stage').css( "transform").replace(/[^0-9\-.,]/g, '').split(',');
    currentxShift = currentMatrix[12] || currentMatrix[4];
    coordList = [0].concat(currentState.relatedTarget._coordinates);
    var closest = coordList.reduce(function(prev, curr) {
      return (Math.abs(curr - currentxShift) < Math.abs(prev - currentxShift) ? curr : prev);
    });
    var itemIndex = coordList.indexOf(closest);
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
