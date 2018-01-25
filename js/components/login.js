var Login = (function(){
  var login = {};

  login.show = function() {
    $('#loginPage').show();
    $('#loginEmail, #loginPassword').val('');
    $('#loginResults').html('');
  }

  login.hide = function() {
    $('#loginPage').hide();
    $('#loginEmail, #loginPassword').val('');
    $('#loginResults').html('');
  }

  login.send = function() {
    $('#loginResults').html('');
    var error  = {msg: '', colour: 'green', icon: 'done'};
    var source   = $('#loginerror-template').html();
    $.ajax({
      url: 'backend/login.php',
      type: 'POST',
      data: {
        email: $('#loginEmail').val(),
        password: $('#loginPassword').val()
      }
    }).done(function(results){
      if (results.success) {
        error.msg = 'Sikeres bejelentkezés';
        location.href = 'index.php';
      }else{
        error.msg = results.error;
        error.colour = 'red';
        error.icon = 'error';
      }
      var template = Handlebars.compile(source);
      $('#loginResults').html(template(error));
    });
  }

  return login;
}(Login));

$(document).ready(function(){
  $('#toReg').on('click', function(){
    Register.show();
    Login.hide();
  });
  $('#loginForm').on('submit', function() {
    Login.send();
    return false;
  });
});
