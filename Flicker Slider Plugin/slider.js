$(document).ready(function () {

var ActivityPlugin = function(){
    var images,     //objects of photos
        $slider = $('#slider'),
        $sliderLi = $('#slider li'),
        $dots = $('#dots'),
        $dotsLi = $('#dots li'),
        imgNumber,  //3
        current,
        speed = 400,
        dot = $("<li class='dot'> </li>");
        deleteBtn = $("<button class='btn_delete'> x </button>");


    getPhotos = function (){
    $.ajax({
        type: 'GET',
        url: 'https://api.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&api_key=325b6733bb2c01b6ee5a9d73e9eb8cf9&user_id=58936861@N04&extras=url_o&format=json&jsoncallback=?',
        dataType: "jsonp",
        success: function (data, status) { 
            images = data.photos.photo; //Preuzimamo fotografije      
            loadImages();
        },  //end success
        error: function () {
          console.log('error');
        }
        });
    };
  
      // Event handlers
      domEventHandler = function(){

        $(".next").on('click', function () {
            currentImg(direction('next'));
        });


        $(".prev").on('click', function () {
            currentImg(direction('prev'));
        });


        $("#dots").on('click', '.dot', function () {  
          var i = $(this).index();
          currentImg(i);
        });

        
        $("#slider").on('click', 'button', function(){  
            var index = $(this).closest('li').index();
            removeImg(index);
        });
      } 

    direction = function (direction){
        var newIndex, i = newIndex;
        imgNumber = images.length;

        if (direction == 'next') { i = (current < imgNumber - 1) ? (current + 1) : 0;  }      //ako trenutna slika nije poslednja i++, ako je poslednja i = prva
        if (direction == 'prev') { i = (current > 0) ? (current - 1) : (imgNumber - 1); }     //ako trenutna slika nije prva i--, ako je prva i = poslednja
        return i   
    }

    currentImg = function (i) {
        current = i;    
        $('#slider li').eq(i).append(deleteBtn);  //dodaj btn delete
        activeDot(i);
        $('#slider li').fadeOut(speed).eq(i).fadeIn(speed);  //efekti   
    }

    removeImg = function(index){
        $('#slider li').eq(index-1).remove();
        images.pop(index);
        removeDot(index);   
        current = index;
        imgNumber = images.length;
        currentImg(direction('next'));
      }

    addDots = function () {
        dot = $("<li class='dot'> </li>");
        $dots.append(dot);
        $('#dots li').first().addClass('active')
    }

    removeDot = function (index) {
        $('#dots li').eq(index-1).remove();
    }

    activeDot = function (i) {
        $('#dots li').removeClass('active');
        $('#dots li').eq(i).addClass('active'); //select element 'dots' at index position (i)      
    }

    loadImages = function() {    
        current = 0;
        renderDom();
        currentImg(current); // 1. slika
        $.each(images, function(){ 
            addDots();
        });      
    } //end loadImages

    renderDom = function(){            
        $sliderLi.empty();
        var template = Handlebars.compile($('#template').html());
        var temp = template(images);
        $('ul#slider').append(temp);
        domEventHandler(); 
    } //end renderDom

    getPhotos();     //dobija slike preko AJAXa

} //end ActivityPlugin

  var plugin = new ActivityPlugin();

});