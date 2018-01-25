var PersonEdit = (function(){
  var personEdit = {};

  Handlebars.registerHelper('ifCond', function(a, b, options) {
    if (a == b) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

  Handlebars.registerHelper('select', function( value, options ){
    var elem = $('<select>').html( options.fn(this) );
    elem.find('[value="'+value+'"]').attr({'selected':'selected'});
    return elem.html();
  });

  function getPerson(data) {
    $.ajax({
      url: 'backend/person-get.php',
      type: 'POST',
      data: {
        id: data.id
      }
    }).done(function(results){
      if (results.success) {
        data.person = results.person;

        var tmp = Handlebars.compile($('#personEditpage-template').html());
        $('#personEditPage').html(tmp(data));

        personEdit.init(data);
        if (data.person.bornplace != null)
          $('#personEditBornPlace').tokenInput('add', {id: 1, city: data.person.bornplace});

        if (data.person.place != null)
          $('#personEditPlace').tokenInput('add', $.extend({load: true}, data.person.place));

        if (data.person.father_id != null)
          $('#personEditFather').tokenInput('add', {id: data.person.father_id, name: data.person.fName});

        if (data.person.mother_id != null)
          $('#personEditMother').tokenInput('add', {id: data.person.mother_id, name: data.person.mName});

        if (data.person.pastPlaces != null)
          $.each(data.person.pastPlaces, function(index, elem) {
              $('#personEditPastPlace').tokenInput('add', $.extend({load: true}, elem));
          });
        $.each($('#personEditForm :input'), function() {
          $(this).change();
        });
      }else{
        Materialize.toast(results.error, 4000);
      }
    });
  }

  personEdit.send = function(data) {
    if(data.id == null) {
      var backend = 'backend/person-create.php';
    }else{
      var backend = 'backend/person-update.php';
    }
    var pastPlaces = [];
    $('#personEditPastPlaceContainer').find('li.chip').each(function() {
      pastPlaces.push({
        id: $(this).data('id'),
        begin: $(this).data('begin'),
        end: $(this).data('end'),
        street: $(this).data('street')
      });
    });
    var place = {
      id: parseInt($('#personEditPlace').parent().find('li.chip').data('id')),
      begin: $('#personEditPlace').parent().find('li.chip').data('begin'),
      street: $('#personEditPlace').parent().find('li.chip').data('street')
    };
    //Validálások
    if ($('#personEditEmail').val() == '' || $('#personEditPassword').val() == '') {
      Materialize.toast('Jelszó és e-mail megadása kötelező!', 4000);
      return false;
    }
    if (place.id == null) {
      Materialize.toast('Egy lakhelyet mindenképp megkell adni!', 4000);
      return false;
    }
    if ($('#personEditName').val() == '') {
      Materialize.toast('Név megadása kötelező!', 4000);
      return false;
    }
    $.ajax({
      url: backend,
      type: 'POST',
      data: {
        personId: data.id,
        prename: $('#personEditPrename').val(),
        name: $('#personEditName').val(),
        email: $('#personEditEmail').val(),
        password: $('#personEditPassword').val(),
        born: $('#personEditBorn').val(),
        death: $('#personEditDeath').val()==""?"-1":$('#personEditDeath').val(),
        sex: parseInt($('input[name=personEditSex]:checked').val()),
        bornplace: $('#personEditBornPlace').parent().find('li.chip').data('city'),
        place: place,
        job: $('#personEditJob').val(),
        comment: $('#personEditComment').val(),
        fatherId: parseInt($('#personEditFather').parent().find('li.chip').data('id')),
        motherId: parseInt($('#personEditMother').parent().find('li.chip').data('id')),
        pastPlaces: pastPlaces
      }
    }).done(function(results){
      if (results.success) {
        Materialize.toast('Személy mentve', 4000);
        if (data.id != null)
          location.href = 'index.php#/person/'+data.id;
        else
          location.href = 'index.php#/tree';
      }else{
        Materialize.toast(results.error, 4000);
      }
    });
  }

  personEdit.init = function(data) {
    var tokenPlaceSettings = {
      method: 'POST',
      queryParam: 'search',
      preventDuplicates: false,
      jsonContainer: 'places',
      propertyToSearch: 'id',
      hintText: 'Meglévő lakhelyek keresése',
      noResultsText: 'Nincs találat',
      searchingText: 'Keresés...',
      deleteText: '<i class="material-icons small">clear</i>',
      classes: classes,
      zindex: 999,
      resultsFormatter: function(item) {
        return '<li> '+item.city+' ('+item.country+')</li>';
      },
      tokenFormatter: function(item) {
        return '<li data-id="'+item.id+'" data-begin="-1" data-end="-1" data-city="'+item.city+'"><span class="placeToken">'+item.city+'</span></li>';
      },
      onAdd: function(item) {
        Place.open({
          living: true,
          place: item
        });
      }
    };
    $('select').material_select();
    $('.datepicker').pickadate({
      container: 'body',
      selectYears: 20,
      format: 'yyyy-mm-dd'
    });

    $('#personEditPastPlace').tokenInput('backend/place-search.php', tokenPlaceSettings);
    tokenPlaceSettings.tokenLimit = 1;
    tokenPlaceSettings.onAdd = function(item) {
      Place.open({
        living: true,
        place: item,
        container: $('#personEditPlace')
      });
    };
    $('#personEditPlace').tokenInput('backend/place-search.php', tokenPlaceSettings);
    tokenPlaceSettings.onAdd = null;
    $('#personEditBornPlace').tokenInput('backend/place-search.php', tokenPlaceSettings);

    $('#personEditFather, #personEditMother').tokenInput('backend/person-search.php', {
      method: 'POST',
      queryParam: 'search',
      tokenLimit: 1,
      preventDuplicates: true,
      jsonContainer: 'persons',
      propertyToSearch: 'id',
      hintText: 'Személy keresése',
      noResultsText: 'Nincs találat',
      searchingText: 'Keresés...',
      deleteText: '<i class="material-icons small">clear</i>',
      classes: classes,
      zindex: 999,
      resultsFormatter: function(item) {
        return '<li> '+item.name+' ('+item.email+')</li>';
      },
      tokenFormatter: function(item) {
        return '<li data-id="'+item.id+'"> '+item.name+'</li>';
      }
    });

    $('#personEditSubmit').bind('click', function() {
      personEdit.send(data);
      return false;
    });
  }

  personEdit.open = function(data) {
    if(data.id == null) {
      var tmp = Handlebars.compile($('#personEditpage-template').html());
      $('#personEditPage').html(tmp(data));
      personEdit.init(data);
    }else{
      getPerson(data);
    }
  }

  personEdit.close = function() {
  }

  return personEdit;
}(PersonEdit));
