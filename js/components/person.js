var Person = (function(){
  var person = {};

  Handlebars.registerHelper('ifNot', function(a, options) {
    if (a != USER.ID) {
      return options.fn(this);
    }
    return options.inverse(this);
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
        var tmp = Handlebars.compile($('#personpage-template').html());
        $('#personPage').html(tmp(data));
      }else{
        Materialize.toast(results.error, 4000);
      }
    });
  }

  person.delete = function(id) {
    if (id!=USER.ID && confirm('Biztos törlöd a személyt?')) {
      $.ajax({
        url: 'backend/person-delete.php',
        type: 'POST',
        data: {
          id: id
        }
      }).done(function(results){
        if (results.success) {
          Materialize.toast('Személy törölve', 4000);
          location.href = 'index.php#/tree';
        }else{
          Materialize.toast(results.error, 4000);
        }
      });
    }else{
      location.href = 'index.php#/person/'+id;
    }
  }

  person.open = function(data) {
    getPerson(data);
  }

  person.close = function() {
  }

  return person;
}(Person));
