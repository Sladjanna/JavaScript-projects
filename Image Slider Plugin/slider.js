$(document).ready(function () {

var ActivityPlugin = function(){
  var $imgs = $("#slider").children('li'),
      $dots = $('#dots').children('li'),
      imgNumber = $imgs.length,  //4
      current,
      speed = 400,
      deleteBtn = $("<button class='btn_delete'> x </button>");

  // Event handlers
  domEventHandler = function(){
    $("#dots li").on('click', function () {  
      var i = $dots.index(this);
      moveImgs(i);
    });

    $(".prev").on('click', function () {
      moveImgs('prev');
    });

    $(".next").on('click', function () {
      moveImgs('next');
    });
    
    $("#slider").on('click', 'button', function(){  
        var index = $(this).closest('li').index();
        console.log('index je  ', index)
        removeImg(index);
    });
  } 

  moveImgs = function (newIndex) {  //newIndex= 'next' || 'prev'
      var i = newIndex;
      if (newIndex == 'prev') { i = (current > 0) ? (current - 1) : (imgNumber - 1); }  
          //ako trenutna slika nije prva i--, ako je prva i = poslednja
      if (newIndex == 'next') { i = (current < imgNumber - 1) ? (current + 1) : 0;  }      //ako trenutna slika nije poslednja i++, ako je poslednja i = prva
    
      current = i;  
      console.log("current u move", current) 
      currentImg(i);
  };

  currentImg = function (i) {
      current = i;    
      console.log("current u currentImg", current) 
      $imgs.eq(i).append(deleteBtn);  
      $dots.removeClass('active').eq(i).addClass('active');     //select element 'dots' at index position (i)
      $imgs.fadeOut(speed).eq(i).fadeIn(speed);  //efekti         
    }

  removeImg = function(index){
  //  $imgs.slice(index , 1);
      $imgs[index].remove();
      removeDot(index);   
      currentImg(index+1); 
    //imgNumber -=1;
  }

  removeDot = function (index) {
   $dots[index+1].remove();
  }

  activeDot = function (i) {
    $dots.removeClass('active').eq(i).addClass('active');     //select element 'dots' at index position (i)
  }

   //inicijalizacija slidera
  moveImgs('next');
  domEventHandler();

} //end ActivityPlugin

  var plugin = new ActivityPlugin();

});