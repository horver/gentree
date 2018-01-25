$(document).ready(function() {
  var allroutes = function() {
    var route = window.location.hash.slice(2);
    var pages = $('.page');

    if (route.indexOf('/') > 0)
      route = route.slice(0, route.indexOf('/'));

    var page = pages.filter('[data-route=' + route + ']');

    if (page.length) {
      pages.hide(250);
      page.show(250);
    }
  };

  var routes = {
    '/welcome': {
      on: function() {
      }
    },
    '/person/:personId': {
      on: function(personId) {
        Person.open({
          id: personId,
          icon: 'account_circle'
        });
      }
    },
    '/persons': {
      on: function() {
        PersonList.open({
          title: 'Családtagok',
          icon: 'list'
        });
      }
    },
    '/tree': {
      on: function() {
        Tree.show();
      }
    },
    '/person-edit': {
      '/:personId': {
        on: function(personId) {
          PersonEdit.open({
            title: 'Családtag szerkesztése',
            button: 'Modósítás',
            icon: 'edit',
            id: personId
          });
        }
        },
      on: function() {
        PersonEdit.open({
          title: 'Családtag hozzáadása',
          button: 'Hozzáadás',
          icon: 'person_add'
        });
      }
    },
    '/person-delete/:personId': {
      on: function(personId) {
        Person.delete(personId);
      }
    },
    '/relationship-delete/:relationId': {
      on: function(relationId) {
        Relationship.delete(relationId);
      }
    }
  };

  var router = Router(routes);

  router.configure({
    on: allroutes
  });

  router.init();
});
