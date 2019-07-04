

(function ($) {

    // Your web app's Firebase configuration


  "use strict";

  // Preloader (if the #preloader div exists)
  $(window).on('load', function () {
    if ($('#preloader').length) {
      $('#preloader').delay(100).fadeOut('slow', function () {
        $(this).remove();
      });
    }
  });

  // Back to top button
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('.back-to-top').fadeIn('slow');
    } else {
      $('.back-to-top').fadeOut('slow');
    }
  });
  $('.back-to-top').click(function(){
    $('html, body').animate({scrollTop : 0},1500, 'easeInOutExpo');
    return false;
  });

  // Initiate the wowjs animation library
  new WOW().init();

  // Header scroll class
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('#header').addClass('header-scrolled');
    } else {
      $('#header').removeClass('header-scrolled');
    }
  });

  if ($(window).scrollTop() > 100) {
    $('#header').addClass('header-scrolled');
  }

  // Smooth scroll for the navigation and links with .scrollto classes
  $('.main-nav a, .mobile-nav a, .scrollto').on('click', function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      if (target.length) {
        var top_space = 0;

        if ($('#header').length) {
          top_space = $('#header').outerHeight();

          if (! $('#header').hasClass('header-scrolled')) {
            top_space = top_space - 20;
          }
        }

        $('html, body').animate({
          scrollTop: target.offset().top - top_space
        }, 1500, 'easeInOutExpo');

        if ($(this).parents('.main-nav, .mobile-nav').length) {
          $('.main-nav .active, .mobile-nav .active').removeClass('active');
          $(this).closest('li').addClass('active');
        }

        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('.mobile-nav-toggle i').toggleClass('fa-times fa-bars');
          $('.mobile-nav-overly').fadeOut();
        }
        return false;
      }
    }
  });

  // Navigation active state on scroll
  var nav_sections = $('section');
  var main_nav = $('.main-nav, .mobile-nav');
  var main_nav_height = $('#header').outerHeight();

  $(window).on('scroll', function () {
    var cur_pos = $(this).scrollTop();
  
    nav_sections.each(function() {
      var top = $(this).offset().top - main_nav_height,
          bottom = top + $(this).outerHeight();
  
      if (cur_pos >= top && cur_pos <= bottom) {
        main_nav.find('li').removeClass('active');
        main_nav.find('a[href="#'+$(this).attr('id')+'"]').parent('li').addClass('active');
      }
    });
  });

  // jQuery counterUp (used in Whu Us section)
  $('[data-toggle="counter-up"]').counterUp({
    delay: 10,
    time: 1000
  });

  // Porfolio isotope and filter
  $(window).on('load', function () {
    var portfolioIsotope = $('.portfolio-container').isotope({
      itemSelector: '.portfolio-item'
    });
    $('#portfolio-flters li').on( 'click', function() {
      $("#portfolio-flters li").removeClass('filter-active');
      $(this).addClass('filter-active');
  
      portfolioIsotope.isotope({ filter: $(this).data('filter') });
    });
  });

  // Testimonials carousel (uses the Owl Carousel library)
  $(".testimonials-carousel").owlCarousel({
    autoplay: true,
    dots: true,
    loop: true,
    items: 1
  });

  /* Redirect */

  /* index */

 $('#index-nav').click(function(){
   $('#login').hide();
   $('#registro').hide();
   $('#index').show();
});
/* registro */
$('#registro-nav').click(function(){
  $('#index').hide();
  $('#login').hide();
  $('#registro').show();
});

/* Login */
$('#login-nav').click(function(){
  $('#index').hide();
  $('#registro').hide();
  $('#login').show();
});



})(jQuery);

  
function Registro(){
  /* obtener datos */
  name = $('#name').val();
  lastname = $('#lastname').val();
  email = $('#email').val();
  password = $('#password').val();
  password2 = $('#password2').val();

  firebase.auth().createUserWithEmailAndPassword(email, password).then(function (resultado) {
    var uid = resultado.user.uid;
    console.log(uid);
    firebase.database().ref('Usuarios').push({
      'nombre': name,
      'apellido': lastname,
      'correo': email,
      'contraseña': password,
      'confirm_contraseña': password2,
      'uid': uid
    });
   }).catch(function(error){
    console.log(error);
  });
};

function Login(){

  email = $('#authEmail').val();
  password = $('#authPassword').val();

  firebase.auth().signInWithEmailAndPassword(email, password).then(function (data) {
    firebase.database().ref('Usuarios').orderByChild('correo').equalTo(email).once('value').then(function(snapshot){
        snapshot.forEach(function(data1){
          var data = data1.val();
          console.log(data.nombre);
          $('#user-show').text(data.nombre);
          $('#registro-nav').hide();
          $('#login-nav').hide();
          $('#login').hide();
          $('#home').show();
          $('.nav-log').hide()
          $('#home-nav').show()
          $('#user-show').show();
          $('#new-article').show();
        });
    });
  // Handle Errors here.
   
  }, function (error) {
    var errorCode = error.code;
    if (errorCode === 'auth/wrong-password') {
      alert('Hay un error en sus datos verifique e intentelo de nuevo...')
    }
  });
}

function Logout(){
  firebase.auth().signOut().then(function() {
    console.log('Signed Out');
    $('#registro-nav').show();
    $('#login-nav').show();
    $('#index').show();
    $('#user-show').hide();
    $('#home').hide();
    $('#home-nav').hide();
    $('.nav-log').show()
    $('#new-article').hide();

  }, function(error) {
    console.error('Sign Out Error', error);
  });
}


function Editar(){
  var data = firebase.database().ref('Usuarios');

  data.once("value").then(function(snapshot) {
    snapshot.forEach(function (childSnapshot) {
      edit = childSnapshot.val();
      console.log(edit);
      firebase.database('Usuarios/' +uid).then(function(){

      });
    });
  });
}

/* Crear articulos */
/* Imagen base:64 */ 
function foto() {
  $(document).ready(function () {
    $('#file_photo').change(function (e) {
      e.preventDefault();
      var foto = document.getElementById('file_photo').files[0];
      console.log(foto);
      let fileReader = new FileReader();
      fileReader.addEventListener('load', function (evt) {
      console.log(fileReader.result);
      var  foto_producto = fileReader.result;
      $('#show-img').attr('src', fileReader.result);

      });
      fileReader.readAsDataURL(foto);
    });
  });
} foto()
function nuevoArticulo(){
  
    var photo = foto_producto;
    var title = $('#title').val();
    var description = $('#description').val();
    var category = $('#category').val();
    var database = firebase.database();

  database.ref('Productos').push({
    'foto': photo,
    'titulo': title,
    'descripcion': description,
    'categoria': category
    },function(error){
      if (error) {
        alert('Hay un error en sus datos verifique e intentelo de nuevo...')
      } else {
        alert('Registro completado con exito!')
      }
    
  });
}