; (function () {
    $.fn.myPage = function (options) {
        var self = this;
        var setting = {
            url: undefined,//数据,ajax请求数据路径
            type:"get",
            currPage: 1,//当前页码,
            sPageSun: 6,//最多显示页面码数
            pageSize: 2, //每页返回显示的数据条数
            pagetype: "server",//分页方式：clients， 服务端：server 
            queryParms: {},//服务器的参数，如果是server 会默认发送 默认limit:当前页面, offset:查询的条数
            jumpbool: true,//是否显示用户输入跳转
            bendbool: true, //是否显示首尾页显示
            setFilds:{//自定义当前页码字段，返回数据个数字段
            	pageNum:"",
            	pageSize:""
            },
            callback: function(){},
            noData: false, //开启无数据测试，
            onClick:function(){}
        }
       
        $.extend(true, setting, options || {})
        var counts = 0;//总数
        var resData = [];//数据返回
        var pageCount = 1;//初始化为1，页数;
        var pageNumField = setting[setting.setFilds["pageNum"]]?setting.setFilds["pageNum"]:"currPage";
        var pageSizeField =setting[setting.setFilds["pageSize"]]? setting.setFilds["pageSize"]:"resultdata";
       
        var currPage = setting[pageNumField]; //当前页；
        var pageSize = setting[pageSizeField];//每一页返回个数;
       	
       	
        if (setting.pagetype == 'server') {
            setting.queryParms[pageNumField] = currPage;
            setting.queryParms[pageSizeField] = pageSize
        }
        
        console.log(setting.queryParms)
        var fn = {

             //start  初始化判断 
            restart:function(){
            	//服务端请求发送的参数get
            	if (setting.pagetype == 'server') {
		            setting.queryParms[pageNumField] = currPage;
		            setting.queryParms[pageSizeField] = pageSize
		        }
            	console.log(setting.queryParms)
               //入口初始化判断是否是url是请求地址 字符串
                 if (typeof setting.url == "string") {
                 		 $.ajax({
                            type: setting.type,
                            url: setting.url,
                            data: setting.queryParms,
                            success: function (result) {
                              var	resRegex = fn.resRegex(result)
                              if(!resRegex) return false
                              counts = result.counts;
                              resData = result.data;
                              if(!setting.noData&&(counts==0||resData.length==0)){
									 setting.callback({ stact: false, mssage: "暂无数据" });
									return
								}
                              fn.init()
                              fn.callback();
                             
                            },
                            error: function (err) {
            				 setting.callback({ stact: false, mssage: "服务器请求失败" });
                            	
                            }
                        })
 					//入口初始化判断是否是url是模拟数据 对象{}
                 }else if(Object.prototype.toString.call(setting.url == '[object Object]')){
                 	  var	resRegex = fn.resRegex(setting.url)
                      if(!resRegex) return false
                 	  counts = setting.url.counts;
                      resData = setting.url.data;
                      if(!setting.noData&&(counts==0||resData.length==0)){
						 setting.callback({ stact: false, mssage: "暂无数据" });
						 return
						}
					  fn.init()
                      fn.callback();
                 }else{
                 	 setting.callback({ stact: false, mssage: "服务器地址请求错误" });
                 }                

            },
            //初始化数据处理
            init: function () {
				//判断当前页码数
                if (currPage <= 0) {
                    currPage = 1;
                }
                //判断、重置页码数
                if (setting.sPageSun == 0) {
                    currPage = 1;
                }
                //计算页数
                if (counts > 0) {
                    //页数=总数/显示的条数
                    pageCount = counts % pageSize > 0 ? parseInt(counts / pageSize) + 1 : parseInt(counts / pageSize)

                };
                //如果设置设置的当前页小于总页数,默认当前页为最后一页
                if (currPage >= pageCount) {
                    currPage = pageCount
                }
                //如果计算出的页数小于显示页码数(差数sPageSun)，那么sPageSun=计算出的页数
                if (pageCount < setting.sPageSun) {
                    setting.sPageSun = pageCount;
                }
                fn.setpageview();

            },

            //初始化界面  
            setpageview: function () {//参数为数据
                //计算页数
                //上一页prevpage,下一页:nextpage
                var prevpge = currPage - 1;
                var nextpage = parseInt(currPage) + parseInt(1);
                var prePageClass = "pageItem";
                var nextPageClass = "pageItem";
                var itemClass = "pageItem";
                var activeClass = "pageItemActive";

                //判断上一页与下一页
                if (prevpge <= 0) {
                    prevpge = 0;
                    prePageClass = "pageItemDisable";
                }
                if (nextpage > pageCount) {
                    nextPageClass = "pageItemDisable"
                }

                //标记页数，用来循环页数id开始-中间-结束
                var pageunm = currPage - parseInt(setting.sPageSun / 2);
                if (pageunm <= 0) {
                    pageunm = 1
                }
                if (parseInt(pageunm + setting.sPageSun) > pageCount) {
                    pageunm = pageCount - setting.sPageSun + 1;
                }

                var addEle = "";
                if (setting.bendbool) {
                    addEle += "<li class='" + prePageClass + "' page-data = '1'>首页</li>";
                }

                addEle += "<li class = '" + prePageClass + "' page-data='" + prevpge + "'>上一页</li>";
                //输出设置最大的显示页码
                for (var i = 0; i < setting.sPageSun; i++) {
                    var addpage = pageunm++;
                    var itemPageClass = "pageItem";
                    if (addpage == currPage) {
                        itemPageClass = "pageItemActive";
                    }
                    addEle += "<li class='" + itemPageClass + "' page-data = '" + addpage + "'>" + addpage + "</li>";
                }
                addEle += "<li class='" + nextPageClass + "' page-data='" + nextpage + "'>下一页</li>";
                if (setting.jumpbool) {
                    addEle += "<li><input type='text' value='' id='btnval' class='inpval'/><button type='button' id='btns'>Go</button/></li>";
                }
                if (setting.bendbool) {
                    addEle += "<li class ='" + nextPageClass + "' page-data='" + pageCount + "'>尾页</li>"
                }
                if (setting.jumpbool) {
                    addEle += "<li class='counts' data-counts=" + pageCount +">共" + pageCount + "页</li>";
                }
                self.html(addEle);
                fn.eventPage();
            },

            //点击事件
            eventPage: function () {
                self.find("li[class = 'pageItem']").on("click", function () {
                    currPage = $(this).attr("page-data");
                    var resobj = Object.assign({}, setting);
                    fn.restart();
                    setting.onClick(resobj);
                })

                if (!setting.jumpbool) return false;
                //输入验证
                function yanzheg(obj) {
                    var reg = /^[1-9][0-9]*$/;
                    //跳转页验证:要填写正整数，不能大于总页数，不能等于当前页
                    if (reg.test(obj.val()) && obj.val() <= pageCount && obj.val() != currPage) {
                        return true
                    } else {
                        obj.val("");
                        return false;

                    }
                }

                self.find("#btnval").blur(function () {
                    yanzheg($(this));
                  
                })
                //点击go
                self.find("#btns").on("click", function () {
                   self.find("#btnval").blur();
                    var bool = yanzheg(self.find("#btnval"));
                    if (bool) {
                        currPage = self.find("#btnval").val();
                       fn.restart();
                    }
                })

            },
            //数据返回
            callback: function () {
                if (setting.pagetype == 'server') {					            	
                	 setting.callback({ stact: true, data: resData });	
               } else if (setting.pagetype == "clients") {                             	
                    data = resData;
                    var resulet = null;           
                    //判断是否是最后一页
                    if (currPage == pageCount) {
                        resulet = data.slice((currPage - 1) * pageSize, data.length);
                    } else {
                        resulet = data.slice((currPage - 1) * pageSize, currPage * pageSize);

                    }
                    if(!resulet||resulet.length==0){
                    	setting.callback({ stact: false, mssage: [] });
                    	return
                    }
                    setting.callback({ stact: true, mssage: resulet });

                } else {
                    setting.callback({ stact: false, mssage: "server is error... " });
                }
            },
            //请求数据格式判断
            resRegex:function(data){
            	if(Object.prototype.toString.call(data)=="[object Object]"&& typeof data['counts']== "number"&&data['data']&&Object.prototype.toString.call(data['data'])=="[object Array]"){
            		return true
            	}else{
            		 setting.callback({ stact: false, mssage: "服务器返回数据格式不正确" });
            		return false
            	}
            }

        }
        
        fn.restart();
        var resobj = Object.assign({}, setting);
        return resobj;
       

    }

})($)
