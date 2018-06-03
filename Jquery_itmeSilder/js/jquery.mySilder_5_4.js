;(function(){
	$.fn.mySilder = function(opctions){
		var self = this;
		//获取dom元素
		var silderMain = self.find(".mysilder_main");
		var silderUl = self.find(".mysilder_ul");
		var itemDom = self.find(".mysilder_item");
		var prevBtn = self.find(".mysilder_prev");
		var nextBtn = self.find(".mysilder_next");
		var radiusMain = self.find(".mysilder_radius");
		var radiusItem = self.find(".radius_itme")
		//设置默认参数
		var setting = {
			"width":800,//容器的总宽
			"height":300,//容器的高度
			"drectype":"row",//row 水平方向 column:垂直方向
			"clumn":0,//每一帧的间距
			"viewUnber":3,//当前可视显示张数
			"itmeUnber":1,//每次滑动的帧数
			"speend":500,//完成播放的时间
			"dedaly":1500,//每间隔多长时间播放一次
			"drection":"left",//自动播放的方向
			"autoplay":false,//是否自动播放
			"btnwid":50,
			"radiusEvent":""
		}
		//全局变量
		var bools = true,//播放开关
			timers = null,//定时器，
			activeIndex = 0;
		
		$.extend(true, setting,opctions||{});
		if(setting.width=="100%"){
			setting.width = $(window).width()
		}
		if(setting.height=="100%"){
			setting.height = $(window).height()
		}
		//计算出每一帧的宽度
		if(setting.drectype=="row"){
			var itmeHei = setting.height;
			var itmeWid = (setting.width-(setting.viewUnber-1)*setting.clumn-setting.btnwid*2)/setting.viewUnber
			var itmeOutwid = itmeWid+setting.clumn;
		}else if(setting.drectype=="column"){
			var itmeWid = setting.width;
			var itmeHei = (setting.height-(setting.viewUnber-1)*setting.clumn-setting.btnwid*2)/setting.viewUnber
			var itmeOutHei= itmeHei+setting.clumn;
		}
		
		var setfn = {
			//初始化
			init:function(){
				this.setStyle();
				this.autoplay();
			},
			//设置样式
			setStyle:function(){
				
				//容器的宽度,张数,决定图片宽度	
			
				if(setting.drectype=="row"){
					prevBtn.addClass("row");
					nextBtn.addClass("row");
					var mainWid = setting.width-2*setting.btnwid;
					var mainHei = setting.height;
					var ulWid = itmeOutwid*itemDom.size();
					var ulHei = setting.height;
					
					silderUl.css({"margin-left":-setting.clumn,"left": 0})
					itemDom.css({"margin-left":setting.clumn,"float": "left"})
					silderMain.css({"margin":"0 auto"});
				}else if(setting.drectype=="column"){
					prevBtn.addClass("column");
					nextBtn.addClass("column");
					var mainWid = setting.width;
					var mainHei = setting.height -2*setting.btnwid;
					var ulWid = setting.width;
					var ulHei = itmeOutHei*itemDom.size();
					
					silderUl.css({"top": 0})
					itemDom.css({"margin-bottom":setting.clumn})
					self.css({"padding-top":setting.btnwid,"padding-bottom": setting.btnwid})
				}
				self.css({"position": "relative","width":setting.width})
				silderMain.css({"width":mainWid,"height":mainHei,position: "relative","overflow":"hidden"});
				silderUl.css({"width":ulWid,"height":ulHei,"position": "absolute"})
				itemDom.css({"width":itmeWid,"height":itmeHei})
				this.setRadius();
			},
			//设置小圆点
			setRadius:function(){
				if(setting.drectype=="row"&&setting.viewUnber=="1"){
					radiusMain.addClass("row");
					setting.itmeUnber = 1
				}else if(setting.drectype=="column"&&setting.viewUnber=="1"){
					setting.itmeUnber = 1
					radiusMain.addClass("column");
				}else{
					radiusMain.remove();
				}
			},
			
			//
			silderOpt:function(itmeUnber){
				
				if(setting.drectype=="row"){
					var sildObj = {"left":-itmeOutwid*itmeUnber}
					var sildOpt = {"left":0}
				}else if(setting.drectype=="column"){
					var sildObj = {"top":-itmeOutHei*itmeUnber}
					var sildOpt = {"top":0}
				}
				return {
					sildObj,
					sildOpt
				}
			},
			isSilder:function(){//是否满足滑动条件
				//1.总数数至少3
				//2.滑动张数不能超过<总数除以显示张数
				if(itemDom.size()<3) return false;
				if(setting.viewUnber>itemDom.size()||setting.itmeUnber>itemDom.size()){
					return false
				}
				
				if((itemDom.size()-setting.viewUnber=="0")&&setting.itmeUnber==1){
					return true
				}else if(itemDom.size()-setting.viewUnber<setting.itmeUnber){
					return false
				}
				return true;
				
			},
			//向左滑
			silderprev:function(itmeUnber){
				if(!this.isSilder()) return		
				var silderOpt = this.silderOpt(itmeUnber);
				
				if(bools){
					bools = false;
					activeIndex--;
        	    	if(activeIndex<0)activeIndex = itemDom.size()-1;        	    		
    		radiusItem.removeClass("active").eq(activeIndex).addClass("active");
//      	    	itmeUnber =activeIndex;
					silderUl.animate(silderOpt.sildObj,setting.speend,function(){
						for(var i=0;i<itmeUnber;i++){
							self.find(".mysilder_item").first().appendTo(silderUl);
						}
						silderUl.css(silderOpt.sildOpt);
						bools = true
					})
				}
			},
			//向右滑
			sildernext:function(itmeUnber){
				if(!this.isSilder()) return	
				var silderOpt = this.silderOpt(itmeUnber);
				if(bools){
					bools = false
					activeIndex++;
					
        	    	if(activeIndex>itemDom.size()-1)activeIndex =0;
        	    	
      	    	radiusItem.removeClass("active").eq(activeIndex).addClass("active");
					silderUl.css(silderOpt.sildObj);
					for(var i=0;i<itmeUnber;i++){
							self.find(".mysilder_item").last().prependTo(silderUl);
					};
					silderUl.animate(silderOpt.sildOpt,setting.speend,function(){
							bools = true
						})
				}
				
			},
			//自动播放
			autoplay:function(){
				if(!setting.autoplay) return
				if(setting.drection =="left"){
					timers = setInterval(function(){
						this.silderprev(setting.itmeUnber);
					},setting.dedaly)
				}else if(setting.drection =="right"){
					timers = setInterval(function(){
						this.sildernext(setting.itmeUnber);
					},setting.dedaly)
				}else{
					timers = setInterval(function(){
						this.silderprev(setting.itmeUnber);
					},setting.dedaly)
				}
			}
			
			
		}
		
		setfn.init();
		prevBtn.click(function(){
			setfn.silderprev(setting.itmeUnber);
		})
		nextBtn.click(function(){
			setfn.sildernext(setting.itmeUnber);
		})
		self.hover(function(){
			clearInterval(timers)
		},function(){
			setfn.autoplay();
		})
		
		//小导航
		radiusItem.eq(activeIndex).addClass("active");
		if(setting.radiusEvent){
			radiusItem.on(setting.radiusEvent,function(){
				activeIndex = $(this).index();
				if(setting.drectype=="row"){
					silderUl.stop().animate({"left":-activeIndex*itmeOutwid})
				}else if(setting.drectype=="column"){
					silderUl.stop().animate({"top":-activeIndex*itmeOutHei})
				}
				radiusItem.removeClass("active").eq(activeIndex).addClass("active");
				return false
			})
		}else{
			radiusItem.css("cursor","auto")
		}
		
	}
})(jQuery)
