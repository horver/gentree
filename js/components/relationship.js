var Relationship = (function(){
  var relationship = {};

  function addrelation() {
    $.ajax({
      url: 'backend/relationship.php',
      type: 'POST',
      data: {
        husbandId: $('#RelationHusband').parent().find('li.chip').data('id'),
        wifeId: $('#RelationWife').parent().find('li.chip').data('id'),
        begin: $('#relationStart').val(),
        end: $('#relationEnd').val()==""?"-1":$('#relationEnd').val()
      }
    }).done(function(results){
      if (results.success) {
        Materialize.toast('Házasság hozzáadva', 4000);
      }else{
        Materialize.toast(results.error, 4000);
      }
    });
  }

  relationship.delete = function(id) {
    if (confirm('Biztos törlöd ezt a házaságot?')) {
      $.ajax({
        url: 'backend/relationship-delete.php',
        type: 'POST',
        data: {
          id: id
        }
      }).done(function(results){
        if (results.success) {
          Materialize.toast('Házasság törölve', 4000);
        }else{
          Materialize.toast(results.error, 4000);
        }
      });
    }
  }

  relationship.open = function(data) {
    var tmp = Handlebars.compile($('#relationmodal-template').html());
    $('#relationModal').html(tmp(data));

    var tokenPersonSettings = {
      method: 'POST',
      queryParam: 'search',
      preventDuplicates: true,
      tokenLimit: 1,
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
        return '<li data-id="'+item.id+'"> '+item.name+' ('+item.email+')</li>';
      }
    };
    $('#RelationWife, #RelationHusband').tokenInput('backend/person-search.php', tokenPersonSettings);

    $('#relationModal').openModal();

    $('.datepicker').pickadate({
      container: 'body',
      selectYears: 20,
      format: 'yyyy-mm-dd'
    });

    $('#relationSubmit').bind('click', function() {
      Relationship.close(data);
      return false;
    });
  }

  relationship.close = function(data) {
      addrelation();
      $('#relationModal').closeModal();
  }

  return relationship;
}(Relationship));
