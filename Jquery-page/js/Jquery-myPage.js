;(function($){
	function pageination(dom="",option={}){
		if(!dom) return 
		var _this = this;
	    this.dom = dom;
		this.config = Object.assign({
			pageNum:1,//当前页码数 （如果后台指定的字段不一样，可在setAjaxFilds 中设置pageSizeField的字段名称）
			pageSize:6,//每页的返回的数据 （如果后台指定的字段不一样，可在setAjaxFilds 中设置pageSizeField的字段名称）
			sPageNum:3,//显示的页码列表个数
			totals:100,//总数
			isNextPrex:true, //是否显上下页按钮
			isBeel:false,//是否显首尾页按钮
			isInput:false,//是否显示输入框跳转
			isPageCount:false,//是否显示总页数
			isTotals:false,//是否显示总个数
			setAjaxFilds:{// 可选：配置请求地址，可直接返回请求数据
				url:"",	//必填，请求地址
				type:"get",//必填，请求类型
				data:{}, //可选，设置请求参数
				header:{},//可选，设置请求头信息						
				pageNumField:"",//可选，自定义页码数，该字段将作为 data 参数转给后台，替换默认页码数pageNum
				pageSizeField:"",//可选，自定义每个页数据的字段，该字段将作为 data 参数转给后台,替换默认页个数 pageSize
				restotalField:[], //必填,后台返回的totats 总数 ，获取 的字段名称， 如返回结果 {code:200,result:{totals:100,content:[]}}, 写法为：["result","totals"]
				resDataField:[],//可选，后台返回的 content 的数据 ，获取 的字段名称,返回类型是数组， 用法与restotalField 参数一样；
				clients:false //后台是否一次性返回所有数据，又前端做数据分页处理，如果为true,resDataField参数为必填;
			},
			changeEven:function(){} //分页点击事件回调，返回结果是分页数据
		},option)
		
		
		this.pageCount =0; //总页数
		this.itmePageClass = "pageItem";
		this.activeClass = "pageItemActive";
		this.itemDisableClass = "pageItemDisable";
		this.init();
	}
	//初始化
	pageination.prototype.init = function(){
		var _this = this;
		if(_this.config.setAjaxFilds&&_this.config.setAjaxFilds.url){
			_this.getAjax({});
		}else{
			_this.setInit();
		}
		
	}
	
	//初始化参数
	pageination.prototype.setInit = function(){
		var _this =this;
		if(_this.config.totals<1) return
		_this.config.pageSize = Math.floor(_this.config.pageSize)>0?Math.floor(_this.config.pageSize):1;
		
		//计算页数  = 总数 /每页数
		_this.pageCount = _this.config.totals%_this.config.pageSize>0?parseInt(_this.config.totals/_this.config.pageSize) +1:parseInt(_this.config.totals/_this.config.pageSize);
		
		//重置当前页：如果当前页大于总页数，默认设置为
		_this.config.pageNum = _this.config.pageNum<_this.pageCount?_this.config.pageNum:_this.pageCount;
		
		//重置显示的页码个数
		_this.config.sPageNum =_this.pageCount<_this.config.sPageNum?_this.pageCount:_this.config.sPageNum;
		
		_this.setView();
	}
	//渲染视图
	pageination.prototype.setView = function(){
		
		var _this = this;
		if(_this.pageCount<=1) return 
		_this.html = "";
		//渲染上一页，下一页 
		var pageListHtml = _this.setPageList();
		var prePageClass = _this.itmePageClass,
			nextPageClass = _this.itmePageClass;

		var prevpge = _this.config.pageNum- 1;
    	var nextpage = parseInt(_this.config.pageNum) + parseInt(1);
    	
		//判断上一页与下一页
        if (prevpge <= 0) {
            prevpge = 0;
            prePageClass = _this.itemDisableClass;
        }
        if (nextpage > _this.pageCount) {
            nextPageClass = _this.itemDisableClass;
        }
        
        if(_this.config.isBeel){
        	_this.html+="<div class='" + prePageClass + "' page-data = '1'>首页</div>";
        }
        
        //如果不显示页码列表，一定要显示上下页;
        var prevHtml = "<div class = '" + prePageClass + "' page-data='" + prevpge + "'>上一页</div>";
        var nextHtml = "<div class='" + nextPageClass + "' page-data='" + nextpage + "'>下一页</div>";
        if(!_this.config.isNextPrex&&_this.config.sPageSun<1){
        	_this.html+=prevHtml+nextHtml;
        }else {
        	
        	if(_this.config.sPageSun>0&& !_this.config.isNextPrex){
        		_this.html+=_this.setPageList();
        	}else{
        		_this.html+=prevHtml+_this.setPageList()+nextHtml;
        	}
        }
        
        _this.html += _this.setInputPage();
        
       if(_this.config.isBeel){
        	_this.html+="<div class='" + nextPageClass + "' page-data = '"+_this.pageCount+"'>尾页</div>";
        }
       if(_this.config.isPageCount){
        	_this.html += "<div class='page-counts' data-counts=" + _this.pageCount +">共" + _this.pageCount + "页</div>";
       }
        if(_this.config.isTotals){
        	_this.html += "<div class='page-totals' data-totals=" + _this.config.totals +">共" + _this.config.totals + "条数据</div>";
        } 
        _this.dom.html(_this.html);
        _this.setEvent();

		
	}
	
	//渲染页码列表
	pageination.prototype.setPageList = function(){
		
		var _this = this;
		if(_this.config.sPageNum<1) return "";
		
   		 //标记页数，用来循环页数id开始-中间-结束
   		 var aNum = _this.config.pageNum - parseInt(_this.config.sPageNum/2);
   		 aNum = aNum<=0?1:aNum;
        if (parseInt(aNum + _this.config.sPageNum) > _this.pageCount) {
            aNum = _this.pageCount - _this.config.sPageNum + 1;
        }
     
        var str = ""
        for (var i = 0;i<parseInt(_this.config.sPageNum);i++) {
        	  var addpage = aNum++;
        	  var itemPageClass = _this.itmePageClass;
        	  if(addpage==_this.config.pageNum){
        	  	 var  itemPageClass = _this.activeClass;
        	  }
        	 str += "<div class='" + itemPageClass + "' page-data = '" + addpage + "'>" + addpage + "</div>";  
        }
        return str;
	}
	
	pageination.prototype.setInputPage = function(){
		var _this = this;
		var str = '';
		if (_this.config.isInput) {
       		 str += "<div><input type='text' value='' id='page-val' class='inpval'/><button type='button' id='page-btns'>Go</button/></div>";
    	}
		
		return str;
		
		
	}
	
	//事件处理
	pageination.prototype.setEvent = function(){
		var _this = this;
		_this.dom.find("div[class = '"+_this.itmePageClass+"']").on("click",function(){
			 _this.config.pageNum = $(this).attr("page-data");
		   if(_this.config.setAjaxFilds.url){
		    	_this.getAjax({pageNum:_this.config.pageNum})
		   }else{
		   	 _this.setInit();
		   	 _this.config.changeEven(_this.config)
		   }
		})
		
		//输入 验证
		_this.dom.find("#page-val").on("blur",function(){		
		 	inputReg();
		})
		
		_this.dom.find("#page-btns").on("click",function(){
			var res = inputReg();
			if(res&&_this.config.setAjaxFilds&&_this.config.setAjaxFilds.url){
				_this.getAjax({pageNum:res})
			}else if(res){
				 _this.config.pageNum = res;
				_this.setInit();
			}
		})
		
		function inputReg(){
			var dom = _this.dom.find("#page-val");
			var reg = /^[1-9][0-9]*$/;
		 	if(!reg.test(dom.val())||_this.config.pageNum==dom.val()||dom.val()>_this.pageCount){
		 		dom.val("")
		 		return false
		 	}
		 	return dom.val();
		}
		
		
		
	}
	
	pageination.prototype.getAjax = function(pages = {pageNum:""}){
		var _this = this;
		var config = _this.config.setAjaxFilds;
	
		//获取自定义字段名称
		var pageNumField = _this.config[config["pageNumField"]]?config["pageNumField"]:"pageNum";
		var pageSizeField = _this.config[config["pageSizeField"]]? config["pageSizeField"]:"pageSize";
		_this.config.pageNum = pages.pageNum?pages.pageNum: _this.config[pageNumField];
		_this.config.pageSize =_this.config[pageSizeField]?_this.config[pageSizeField]:_this.config.pageSize;
		config.data = config.data?config.data:{};
		_this.config[pageNumField] = _this.config.pageNum;
		config.data[pageNumField] = _this.config.pageNum;
		config.data[pageSizeField] = _this.config.pageSize;
		
		$.ajax({
			type:config.type,
			url:config.url,
			data:config.data,
			header:config.header,
			async:true,
			success:function(res){
				_this.resultData(res);
			},
			error:function(error){
				_this.config.changeEven(error)
			}
		});				
	}
	
	pageination.prototype.resultData = function(data){
		var _this = this;
		var config = _this.config.setAjaxFilds;
		//如果没有总数，直接返回null
		if(!config.restotalField) {return   _this.config.changeEven({status:false,errmsg:"miss option is restotalField"}) }
		//获取总数
		var restotal  = data[config.restotalField[0]];
		for (var i =1;i<restotal.length;i++) {
		  	var  restotal = restotal[config.restotalField[i]];
		}
		_this.config.totals = restotal;
		
		//如果不是客户端总数处理
		if(!config.clients||!config.resDataField||!config.resDataField[0]){
			_this.setInit();
			_this.config.changeEven(data)
			return 
		}
		_this.clients(data);
	}
	
	pageination.prototype.clients = function(data){
		var _this = this;
		var config = _this.config.setAjaxFilds;
		//获取返回数据
		if(!config.resDataField) {return   _this.config.changeEven({status:false,errmsg:"miss option is resDataField"}) } 
		var resData  = data[config.resDataField[0]];
		
		if(_this.config.totals<resData.length);
		_this.config.totals = resData.length;
		
		_this.setInit();
		for (var i =1;i<config.resDataField.length;i++) {
		  	var  resData = resData[config.resDataField[i]];
		}
		
		//如果当前大于总数
		if(_this.config.pageNum==_this.pageCount){
		   var result = resData.slice((_this.config.pageNum - 1) * _this.config.pageSize, data.length);
		}else{
			var result = resData.slice((_this.config.pageNum - 1) * _this.config.pageSize, _this.config.pageNum*_this.config.pageSize);
		}
		
		_this.config.changeEven({status:true,data:result})
		
	}
	
	pageination.prototype.getCurrentIndex = function(){
		return this.config.pageNum;
	}

	pageination.prototype.getConfig = function(){
		return this.config;
	}
	
	window.pageination = pageination;
})($);