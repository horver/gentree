var Place = (function(){
  var place = {};

  function addPlace() {
    $.ajax({
      url: 'backend/place.php',
      type: 'POST',
      data: {
        country: $('#placeCountry').val(),
        city: $('#placeCity').val()
      }
    }).done(function(results){
      if (results.success) {
        Materialize.toast('Lakhely hozzáadva', 4000);
      }else{
        Materialize.toast(results.error, 4000);
      }
    });
  }

  place.open = function(data) {
    if (data.place != undefined && data.place.load == true) {
      if (data.container == null)
        var tokenItem = $('#personEditPastPlaceContainer').find('li.chip').last();
      else
        var tokenItem = data.container.parent().find('li.chip').last();

      var placeToken = $(tokenItem).children('span.placeToken');
      tokenItem.data('begin', data.place.begin);
      tokenItem.data('end', data.place.end);
      tokenItem.data('street', data.place.street);
      placeToken.html(data.place.city+' ('+data.place.country+') - '+data.place.street+' ('+data.place.begin+'-'+data.place.end+')');
    }else{
      var tmp = Handlebars.compile($('#placemodal-template').html());
      $('#placeModal').html(tmp(data));

      $('#placeModal').openModal();

      $('.datepicker').pickadate({
        container: 'body',
        selectYears: 20,
        format: 'yyyy-mm-dd'
      });

      $('#placeSubmit').bind('click', function() {
        Place.close(data);
      });
    }
  }

  place.close = function(data) {
      if (!data.living) {
        addPlace();
      }else{
        if (data.container == null)
          var tokenItem = $('#personEditPastPlaceContainer').find('li.chip').last();
        else
          var tokenItem = data.container.parent().find('li.chip').last();

        var placeToken = $(tokenItem).children('span.placeToken');
        tokenItem.data('begin', $('#placeStartLiving').val());
        tokenItem.data('end', $('#placeEndLiving').val());
        tokenItem.data('street', $('#placeStreet').val());
        placeToken.html(data.place.city+' ('+data.place.country+') - '+tokenItem.data('street')+' ('+tokenItem.data('begin')+'-'+tokenItem.data('end')+')');
      }
      $('#placeModal').closeModal();
  }

  return place;
}(Place));
