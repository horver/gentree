var Tree = (function(){
  var tree = {};
  var sexClass = ['male', 'female'];

  Handlebars.registerHelper('ifNot', function(a, options) {
    if (a != USER.ID) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

  tree.buildFamily = function (persons, allPersons) {
    //Végig megyünk a férjeken
    $.each(persons, function(index, elem) {
      elem.class = sexClass[elem.sex];
      elem.extra = elem;
      //Feleségek keresése
      var spouses = $.grep(allPersons, function(el) {
        return el.husband_id == elem.id;
      });
      //Majd kivonása az eredeti halmazból
      allPersons = allPersons.filter(function(elem) {
        return spouses.indexOf(elem) < 0;
      });
      //Hozzáadjuk a férjhez az összes feleségét
      elem.marriages = [];
      //Majd a feleségeiktől származó gyerekeket
      $.each(spouses, function(index, el) {
        el.class = sexClass[el.sex];
        el.extra = el;
        var childs = $.grep(allPersons, function(e) {
          return e.mother_id == el.id && e.father_id == elem.id;
        });
        $.each(childs, function(index, e) {
          e.class = sexClass[e.sex];
          e.extra = e;
        });
        elem.marriages.push({
          spouse: el,
          children: childs
        });
        //Csak a fiú gyermekeket adjuk tovább
        var boys = $.grep(childs, function(elem) {
          return elem.sex == 0;
        });
        //Majd őket is kivonjuk
        allPersons = allPersons.filter(function(elem) {
          return boys.indexOf(elem) < 0;
        });
        //És rekúrzió
        return tree.buildFamily(boys, allPersons);
      });
    });
    return persons;
  }

  tree.renderText = function(name, extra, textClass) {
    var tmp = Handlebars.compile($('#treeText-template').html());
    return tmp({
      name: name,
      extra: extra,
      textClass: textClass
    });
  }

  tree.renderTree = function() {
    var persons = [];

    $.ajax({
      url: 'backend/tree-get.php',
      type: 'POST'
    }).done(function(results){
      if (results.success) {
        var person = {};
        //Akiknek nincs szülőük (gyökérelemek XD)
        persons = $.grep(results.persons, function(elem) {
          return elem.father_id === null && elem.mother_id === null && elem.sex == 0;
        });
        //Kivonjuk az eredeti halmazból őket
        results.persons = results.persons.filter(function(elem) {
          return persons.indexOf(elem) < 0;
        });

        var data = tree.buildFamily(persons, results.persons);

        Handlebars.registerHelper("dateYear", function(date) {
          if (date === null) {
            date = "";
          }
          return date.slice(0, 4);
        });

        Handlebars.registerHelper("textRenderer", function(name, extra, textClass) {
          return new Handlebars.SafeString(tree.renderText(name, extra, textClass));
        });

        var options = {
          target: '#tree',
          width: screen.width,
          height: 450,
          nodeWidth: 180,
          styles: {
            linage: 'linage',
            marriage: 'marriage',
            text: 'nodeText'
          },
          callbacks: {
            nodeClick: function(name, extra, id) {
            },
            nodeRenderer: function(name, x, y, height, width, extra, id, nodeClass, textClass, textRenderer) {
              var tmp = Handlebars.compile($('#treeNode-template').html());
              return tmp({
                name: name,
                x: x,
                y: y,
                height: height,
                width: width,
                extra: extra,
                id: id,
                nodeClass: nodeClass,
                textClass: textClass,
              });
            },
            textRenderer: function(name, extra, textClass) {
              return tree.renderText(name, extra, textClass);
            }
          }
        };
        dTree.init(data, options);
      }else{
        Materialize.toast(results.error, 4000);
      }
    });
  }

  tree.show = function() {
    $('#tree').html('');
    tree.renderTree();
  }

  tree.hide = function() {
    $('#tree').html('');
    $('#treePage').hide();
  }

  return tree;
}(Tree));
