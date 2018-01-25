classes = {};
$.each({
  tokenList: "token-input-list",
  token: "token-input-token",
  tokenDelete: "token-input-delete-token",
  selectedToken: "token-input-selected-token",
  highlightedToken: "token-input-highlighted-token",
  dropdown: "token-input-dropdown",
  dropdownItem: "token-input-dropdown-item",
  dropdownItem2: "token-input-dropdown-item2",
  selectedDropdownItem: "token-input-selected-dropdown-item",
  inputToken: "token-input-input-token"
  }, function(key, value) {
  classes[key] = value + "-" + 'material';
});
classes['token'] = 'chip';

$(document).ready(function(){
  if (USER != -1) {
    $('#username').html(USER.name);
    $('#editUser').attr('href', '#/person-edit/'+USER.ID);

    $('#addPlace').on('click', function(){
      Place.open({
        living: false
      });
    });

    $('#addRelation').on('click', function(){
      Relationship.open();
    });

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
      onAdd: function(item) {
        $('#searchPerson').tokenInput('clear');
        location.href = 'index.php#/person/'+item.id;
      }
    };
    $('#searchPerson').tokenInput('backend/person-search.php', tokenPersonSettings);


    Tree.show();
  }
});
