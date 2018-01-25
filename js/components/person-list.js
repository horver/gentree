var PersonList = (function(){
  var personList = {};
  var listData = {};

  Handlebars.registerHelper('ifNot', function(a, options) {
    if (a != USER.ID) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

  personList.filterPersons = function() {
    var tmp = Handlebars.compile($('#personListpage-template').html());
    $('#personListPage').html(tmp(listData));
    $('.tooltipped').tooltip();
  }

  function getPersons() {
    $.ajax({
      url: 'backend/person-list.php',
      type: 'POST'
    }).done(function(results){
      if (results.success) {
        listData.persons = results.persons;
        personList.filterPersons();
      }else{
        Materialize.toast(results.error, 4000);
      }
    });
  }

  personList.open = function(data) {
    listData = data;
    getPersons();
  }

  personList.close = function() {
  }

  return personList;
}(PersonList));
