var Register = (function(){
  var register = {};


  register.show = function() {
    $('#registerPage').show();
    $('#regName, #regEmail, #regPassword').val('');
    $('#regResults').html('');
  }

  register.hide = function() {
    $('#registerPage').hide();
    $('#regName, #regEmail, #regPassword').val('');
    $('#regResults').html('');
  }

  register.send = function() {
    $('#regResults').html('');
    var error  = {msg: '', colour: 'green', icon: 'done'};
    $.ajax({
      url: 'backend/register.php',
      type: 'POST',
      data: {
        name: $('#regName').val(),
        email: $('#regEmail').val(),
        password: $('#regPassword').val(),
        sex: parseInt($('input[name=regSex]:checked').val())
      }
    }).done(function(results){
      if (results.success) {
        error.msg = 'Sikeres regisztráció!';
      }else{
        error.msg = results.error;
        error.colour = 'red';
        error.icon = 'error';
      }
      var template = Handlebars.compile($('#regerror-template').html());
      $('#regResults').html(template(error));
    });
  }

  return register;
}(Register));

$(document).ready(function(){
  $('#toLogin').on('click', function(){
    Register.hide();
    Login.show();
  });
  $('#regForm').on('submit', function() {
    Register.send();
    return false;
  });
});
