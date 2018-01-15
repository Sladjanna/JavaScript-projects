var slider = (function(){

	Handlebars.registerHelper('ifCond', function(v1, v2, options) {
	  if(v1 === v2) {
	    return options.fn(this);
	  }
	  return options.inverse(this);
	});

	Handlebars.registerHelper('ifNotCond', function(v1, v2, options) {
	  if(v1 !== v2) {
	    return options.fn(this);
	  }
	  return options.inverse(this);
	});

	var MImageSliderPlugin = function(controler){
		this.controler = controler;
		this.imagesArray = [];
		this.currentImageIndex = -1;

		this.setImages = function(photos){
			var self = this;
			self.imagesArray = photos;
			self.currentImageIndex = 0;
		}

		this.deleteImage = function (index){
			var self = this;
			self.imagesArray.splice(index, 1);
			self.currentImageIndex = 0;
			self.controler.view.renderDom();
		}

		this.loadImages = function(){
			var self = this;
			 $.ajax({
				 url:"https://api.flickr.com/services/rest/",
				 data: {
					 method: "flickr.people.getPublicPhotos",
					 api_key: "325b6733bb2c01b6ee5a9d73e9eb8cf9",
					 user_id: "58936861@N04", 
					 extras:"url_o",
					 format: "json",
				 },
		 		dataType: 'jsonp',
				jsonpCallback: 'jsonFlickrApi',
		 		success: function (data){
					 var photos = [];
						if(data && data.photos && data.photos.photo.length){
							 for (var i = 0; i < Math.min( data.photos.photo.length,10); i++){
								 photos[i] = data.photos.photo[i]['url_o'];
							 }
							 self.setImages(photos);
							 self.controler.view.renderDom();
					 }
				 },
				 error: function (){
					// $('.wrapper').html('NECE');
				 }
	 	 	});
	 	}
	}

	var VImageSliderPlugin = function(controler){
		var self = this;
		this.controler = controler;
		this.$wrapper = $('#gallery-wrapper'),
		this.$theTemplateScript = $("#gallery-template").html();

		this.domEventHandler = function(){
			var self =this;
			$('#load').on('click', function (){
			});

			this.$wrapper.on('click', '#previous', function(){
				self.previousImage();
			});

			this.$wrapper.on('click', '#next',function (){
				self.nextImage();
			});

			this.$wrapper.on('click', '#delete',function(){
				self.controler.model.deleteImage(self.controler.model.currentImageIndex);
			});

			this.$wrapper.on('click', '.notSelected', function(){
				self.controler.model.currentImageIndex = $(this).index();
				self.renderDom();
			});
		}

		this.nextImage = function (){
			(self.controler.model.currentImageIndex == self.controler.model.imagesArray.length - 1)? (self.controler.model.currentImageIndex = 0) : self.controler.model.currentImageIndex++;
			this.renderDom();
		}

		this.previousImage = function (){
			(self.controler.model.currentImageIndex == 0) ? (self.controler.model.currentImageIndex = self.controler.model.imagesArray.length - 1) : self.controler.model.currentImageIndex--;
			this.renderDom();
		}

		this.renderDom = function(){
			var self = this,
					model = self.controler.model;
			var context = {
					currentImage: model.imagesArray[model.currentImageIndex],
			    imagesArray: model.imagesArray,
			    currentImageIndex: model.currentImageIndex
		  	};
	      	self.$wrapper.empty();
	      	var theTemplate = Handlebars.compile(self.$theTemplateScript);
	      	var theCompiledHtml = theTemplate(context);
	      	self.$wrapper.append(theCompiledHtml);
	   }

	}
	var CImageSliderPlugin = function(){

		this.init = function(){

			this.view.domEventHandler();
			this.model.loadImages();
		}
	 	this.model = new MImageSliderPlugin(this);
		this.view = new VImageSliderPlugin(this);
	}

	var plugin = new CImageSliderPlugin();
	plugin.init();
	return plugin;

})();
