;(function($){
	   console.log($)
	   $.fn.mySilder = function(opction){
	   	     var self = this;
	   	      
	         //获取基本dom
	         var itmeMain =self.find(".silder_main") 
	         var  itmeUl = self.find(".silder_box")
	         var itmeli  = self.find(".silder_item");
	         var navBtn = self.find(".nav-btn");
	         var prevBtn =self.find(".prev-btn");
	         var nextBtn = self.find(".next-btn");
	         
	         //默认参数
	         var wids = $(window).width();
	         if(itmeli.find("img")){
	         	 var imgWid = itmeli.find("img").eq(0).width();
	         }else{
	         	imgWid = null
	         }
	         var opt = {
	         	  "width":wids, //容器的宽度
	         	  "height":600,  //容器的高度
	         	  "pricWid":imgWid,//图片的真实宽度，当图片宽大于当前窗口的宽度
	         	  "prichei":600,  //图片的高度
	         	  "events":"click",//小导航的事件
	         	  "itmeIndex":2,//当前显示那一张
	         	  "speend":800,//完成播放的时间
				  "dedaly":4500,//每间隔多长时间播放一次
				  "drection":"left",//自动播放的方向
				  "autoplay":true,//是否自动播放
				 "bools":true,//播放开关
				 "timers":null//定时器
	         }
	         $.extend(true, opt, opction||{});
	         //定义方法
	         var setFn = {
	         	     //设置基本样式
	         	     setStyle:function(){
	         	     	  self.css({"width":opt.width,"height":opt.height});
	         	     	  itmeMain.css({"width":opt.width,"height":opt.prichei});
	         	     	  itmeUl.css({"width":opt.width*(itmeli.size()+1),"height":opt.prichei,"left":-opt.itmeIndex*opt.width});
	         	     	  self.find(".silder_item").css({"width":opt.width,"height":opt.prichei});
	         	     	  itmeli.first().clone().appendTo(itmeUl)
	         	     	  if(self.find(".silder_item").find("img")){
	         	     	  self.find(".silder_item").find("img").css({"wdith":opt.pricWid,"height":opt.prichei,"display": "block","position": "absolute","margin-left": -(opt.pricWid/2),"left":50+"%"})
	         	     	  };
	         	     	  navBtn.removeClass("active");
	         	     	  navBtn.eq(opt.itmeIndex).addClass("active")
	         	     	  
            	   },
            	   //上一个
            	    prev:function(){
            	    
            	    	opt.itmeIndex--;
            	    	if(opt.itmeIndex<0){
            	    		opt.itmeIndex = itmeli.size()-1;
            	    		
		                   itmeUl.css({
		                   	 "left":-opt.width*itmeli.size()}).stop().animate({"left":-opt.width*(opt.itmeIndex)},500);
		            	    		
            	    	}else{
            	    		itmeUl.stop().animate({"left":-(opt.width*opt.itmeIndex)},500)
            	    	}
            	    	navBtn.removeClass("active").eq(opt.itmeIndex).addClass("active");
            	    },
            	    //下一个
            	    next:function(){
            	    	opt.itmeIndex++;
            	    	if(opt.itmeIndex>itmeli.size()){
            	    		opt.itmeIndex= 1;
            	    		itmeUl.css({"left":0}).stop().animate({"left":-opt.itmeIndex*opt.width});
            	    	}else{
            	    		itmeUl.animate({"left":-opt.itmeIndex*opt.width})
            	    	}
						if(opt.itmeIndex==itmeli.size()){
							navBtn.removeClass("active").eq(0).addClass("active");
						}else{
							navBtn.removeClass("active").eq(opt.itmeIndex).addClass("active");
						}
            	    	
            	    },
            	    //自动放，与方向
    				atpaly:function(){
    					if(!opt.autoplay) return false
    					if(opt.drection=="left"){
    						opt.timers = setInterval(function(){
    							setFn.prev();
    						},opt.dedaly)
    					}else if(opt.drection=="right"){
    						opt.timers = setInterval(function(){
    							setFn.next();
    						},opt.dedaly)
    					}
    				}
	         }
	         setFn.setStyle()
	         setFn.atpaly();
	         prevBtn.on("click",function(){
	         	setFn.prev();
	         })
	         nextBtn.on("click",function(){
	         	setFn.next();
	         })
	         self.hover(function(){
	         	clearInterval(opt.timers);
	         },function(){
	         	 setFn.atpaly();
	         })
		    	//小导航
		    	navBtn.each(function(index,ele){
		    		$(ele).on(opt.events,function(){
		    			opt.itmeIndex = index;
		    			itmeUl.stop().animate({"left":-index*opt.width})
		    			navBtn.removeClass("active").eq(index).addClass("active");
		    			return false
		    		})
		    	})	  
		    	return this;

	}
	
})(jQuery)
