;(function($){
	$.fn.myRotate = function(options){
		var self = this;
		//获取基本dom节点
		var postList = this.find(".poster-list");
		var postItem = this.find(".poster-item");
		var posterPrewBtn = this.find(".poster-prewbtn");
		var posterNextBtn = this.find(".poster-nextbtn");
		var posterFirst = postItem.first();
		var posterLast = postItem.last();
		var posterBool = true;
		var postTimer = null;
		
		//设置默认参数
		var setting = {
			"width":1000,
			"height":300,
			"itemWid":640,
			"autoPlay":false,
			"detaly":3000,
			"speed":300,
			"vertival":"middel",//middel,top,bottom
			"scale":0.8,
			"callback":function(){},
			"getIndex":function(){}
		};
		
		$.extend(setting,options);
		
		//方法实现
		var sliderRotate = {
			//添加索引
			addIndex:function(){
				postItem.each(function(index,ele){
					$(ele).attr('data-index',index+1)
					
				})
			},
			
			//初始化位置
			init:function(){
				this.addIndex();
			 //左右两边的离中间的帧的距离
			 var tw = (setting.width -setting.itemWid)/2;
			 //左右两边的帧数和每帧的间距,最高的层级z-index
			 var lrItemSize = Math.floor(postItem.length/2);
			 var gap = tw/lrItemSize;
			 var itemZindex = postItem.length-lrItemSize;
			 //左右两边的帧数
			  var  leftItem= postItem.slice(itemZindex);
			 var  rigItem= postItem.slice(1,itemZindex);
			
			 
			 
			 //设置第一帧和按钮的位置
			 self.css({"width":setting.width,"height":setting.height});
			 postList.css({"width":setting.width,"height":setting.height});
			 postItem.css({"width":setting.itemWid,"height":setting.height});
			 posterFirst.css({"width":setting.itemWid,"height":setting.height,"left":tw,"z-index":lrItemSize});
			 posterFirst.addClass("poster-item-active")
			 posterPrewBtn.css({"width":tw,"height":setting.height,"z-index":itemZindex});
			 posterNextBtn.css({"width":tw,"height":setting.height,"z-index":itemZindex})
			 
			 setting.getIndex({index:posterFirst.attr("data-index"),lr:"left"})
			 
			 //右边的位置，先保存第一帧的宽高,层次 
			 var rw = setting.itemWid,
			     rh = setting.height,
			     ropac = lrItemSize;
				rigItem.each(function(index,ele){
					rw = rw*setting.scale;
					rh = rh*setting.scale;
					ropac--;
					var lefts = Math.floor((setting.itemWid-rw)+(++index)*gap+tw);
					$(this).css({
						"width":rw,
						"height":rh,
//						"opacity":1/(++index),
						"z-index":ropac,
						"left":lefts,
						"top":sliderRotate.setVertival(rh)
					})
				})
				 //左边的位置
				 var lw = rigItem.last().width(),
				     lh = rigItem.last().height(),
				     lftopa = lrItemSize;
				 leftItem.each(function(index,ele){
//				 	alert(sliderRotate.setVertival(123))
				 	$(this).css({
						"width":lw,
						"height":lh,
//						"opacity":1/(++index),
						"z-index":index,
						"left":gap*index,
						"top":sliderRotate.setVertival(lh)
					});
					lw = lw/setting.scale;
					lh = lh/setting.scale;
					lftopa--;
				 })
				
			},
			//设置top的排列方法
			setVertival:function(height){
				var top = 0;
				if(setting.vertival =="middle"){
					top = (setting.height-height)/2
				}else if(setting.vertival =="top"){
					top = 0
				}else if(setting.vertival =="bottom"){
					top = setting.height-height
				}else{
					top = (setting.height-height)/2
				}
				return top;
			},
			setCurrenItme:function(lft){
				var currenItme = self.find(".poster-item-active");
				postItem.removeClass("poster-item-active");
				if(lft =="right"){
					var prev = currenItme.prev().get(0)?currenItme.prev():posterLast;
				}else if(lft =="left"){
					var prev = currenItme.next().get(0)?currenItme.next():posterFirst;
				}else{
					var prev = currenItme.next().get(0)?currenItme.next():posterFirst;
					
				}
				lft = lft?lft:'right'
				prev.addClass("poster-item-active");
				setting.getIndex({index:prev.attr("data-index"),lr:lft})
				
			},
			//动画旋转
			animateRotate:function(ltf){
				//获取当前显示的item
				
				sliderRotate.setCurrenItme(ltf);
				
				postItem.each(function(index,ele){
					if(ltf =="left"){
						var prev = $(this).prev().get(0)?$(this).prev():posterLast;
					}else if(ltf =="right"){
						var prev = $(this).next().get(0)?$(this).next():posterFirst;
					}else{
						var prev = $(this).prev().get(0)?$(this).prev():posterLast;
						
					}
					 var width = prev.css("width"),
					     height = prev.css("height"),
					     zindex = prev.css("z-index"),
					     opacity = prev.css("opacity"),
					     top = prev.css("top"),
					     left = prev.css("left");
					
					$(this).animate({
						 "height":height,
						 "width":width,
						 "z-index":zindex,
//						 "opacity":opacity,
						 "top":top,
						 "left":left	  
					},setting.speed,function(){
						posterBool = true
					})
					 
				})
				
			},
			//自动旋转
			aotuRotatePlay:function(){
				if(setting.autoPlay){
					postTimer =setInterval(function(){
						sliderRotate.animateRotate("left");
					},setting.detaly)
				}
			}
			
			
		}
		
		sliderRotate.init();
		sliderRotate.aotuRotatePlay();
		setting.callback(sliderRotate);
		posterNextBtn.click(function(){
			if(posterBool){
				posterBool = false;
				sliderRotate.animateRotate("left");
			}
			
		})
		posterPrewBtn.click(function(){
			if(posterBool){
				posterBool = false;
				sliderRotate.animateRotate("right");
			}
		})
		self.hover(
			function(){
				clearInterval(postTimer);
			},
			function(){
				sliderRotate.aotuRotatePlay();
			})
		}
	    
})(jQuery)
