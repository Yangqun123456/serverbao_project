/**
 * Created by tuyadi on 2016/6/7.
 */
var zztzApp = angular.module('zztzApp', []);

zztzApp.directive('loading',   ['$http' ,function ($http)
  {
      return {
          restrict: 'A',
      link: function (scope, elm, attrs)
      {
          scope.isLoading = function () { //绘制loading的函数
              return $http.pendingRequests.length > 0;
          };
          scope.$watch(scope.isLoading, function (v)
          {
              if(v){//检测是否已经加载如果没有，则显示
                  elm.show();
              }else{//如果加载完成，则隐藏。
                      elm.hide();
                  }
              });
          }
      };
  }]);

//全局变量
var iXW, iYW, oXW, oYW; //维度拖拽位置
var wnumber = 0; //weiduDiv里的子元素序号

var iXD, iYD, oXD, oYD; //度量拖拽位置
var dnumber = 0; //duliangDiv里的子元素序号
var ngcolor="";
var XsColor=null;//x轴颜色
var XwColor=null;//x文字颜色
var YsColor=null;//y轴颜色
var YwColor=null;//y文字颜色
var headerColor="";//表格header颜色
var bodyColor="";//表格内容颜色
var tableColor="";//表格边框颜色
var zIndex = 99;
var zIndexTop = 100;
var echartsColorTheme = "JAP";	//chalk dark essos purple-passion vintage walden  
var echartsColorArr = new Array();//颜色数组


var ctx = function() {
	  var path = window.location.href;
	  var pathName = window.location.pathname;
	  var hostPath = path.substring(0, path.indexOf(pathName))
	  var projectName = pathName.substring(0, pathName.substring(1).indexOf('/') + 1);
	  return (hostPath + projectName);
	}
var echartsDataType = "";
zztzApp.controller('myTableController',function ($scope, $http,$state,tableDetail,pieDetail,storyDetail,locals,ngDialog) {//我的作品
	$scope.workName = "";
	$scope.myKeyup = function(e){
        var keycode = window.event?e.keyCode:e.which;
        if(keycode==13){
            $scope.searchClick();
        }
    };
    $scope.searchClick = function(){
	        //获取数据
	        $http({
	            method: "POST",
	            url: ctx()+"/workTable/queryWorkTable",
	            params:{"workTableName":$scope.workName}
	        }).success(function (data) {
	        	$scope.tableList = data;
	        	console.log("查询数据分析成功");
		     }).error(function (data) {
	            console.log("查询数据分析失败");
	        }); 
	        $http({
	            method: "GET",
	            url: ctx()+"/dashboards",
	            params:{"name":$scope.workName}
	        }).success(function (data) {
	        	$scope.pieList = data;
	        	console.log("查询仪表盘成功");
		     }).error(function (data) {
	            console.log("查询仪表盘失败");
	        });
	        $http({
	        	method: "GET",
	        	url: ctx()+"/stories",
	        	params:{"name":$scope.workName}
	        }).success(function (data) {
	        	$scope.storyList = data;
	        	console.log("查询专题成功");
	        }).error(function (data) {
	        	console.log("查询专题失败");
	        });
    };
    
    $scope.showCss=function(){
    	$(this).addClass("sjcgzs_text tab_under_90");
    	$("div[class*='mt_modelDiv']").on("mouseenter",function(){
    		$(this).find("div[class*='sjcgzs_text']").animate({height:"70px"},10);
    	});
    	$("div[class*='mt_modelDiv']").on("mouseleave",function(){
    		$(this).find("div[class*='sjcgzs_text']").animate({height:"50px"},10);
    	});
    	$("img.imgDel").on("mouseover",function(){
    		$(this).attr("src","img/del_u200_mouseOver.png");
    	});
    	$("img.imgDel").on("mouseleave",function(){
    		$(this).attr("src","img/del_u200.png");
    	});
    	$("img.imgCopy").on("mouseover",function(){
    		$(this).attr("src","img/copy_u198_mouseOver.png");
    	});
    	$("img.imgCopy").on("mouseleave",function(){
    		$(this).attr("src","img/copy_u198.png");
    	});
    }
    $scope.delTable=function(table){//删除table
		ngDialogWithConfirmButtonTips(ngDialog, '确认删除 ?', '删除工作表：'+table.workTableName+'，此操作无法撤销。')
			.then(function (value) {
				$http({
					method: "DELETE",
					url: ctx()+"/workTable/"+table.workTableId,
					params:{}
				}).success(function (data) {
					var pies = data.data;
					if(pies==null||pies.length==0){//未挂在仪表盘下
						console.log("删除成功");
					}else{
						ngDialogTips(ngDialog,"下列仪表盘使用了该数据分析，不可删除<br> \n"+pies);
					}
					$scope.searchClick();
				}).error(function (data) {
					ngDialogTips(ngDialog, '删除失败');
				});
			},function (reason) {

			});
    }
    $scope.copyTable=function(table){
		ngDialogWithConfirmButtonTips(ngDialog, '确认复制 ?', '复制工作表：'+table.workTableName+'。')
			.then(function (value) {
	    	$http({
	            method: "POST",
	            url: ctx()+"/workTable/"+table.workTableId,
	            params:{"workTableName":table.workTableName}
	        }).success(function (data) {
	        	console.log("复制成功");
	        	$scope.searchClick();
		     }).error(function (data) {
				ngDialogTips(ngDialog, '复制失败');
	        });
    	},function () {})
    }
    $scope.delPie=function(pie){//删除pie
		ngDialogWithConfirmButtonTips(ngDialog, '确认删除 ?', '删除仪表盘：'+pie.name+'，此操作无法撤销。')
			.then(function (value) {
            $http({
                method: "DELETE",
                url: ctx()+"/dashboards/"+pie.id,
                params:{}
            }).success(function (data) {
                var mystory = data;
                var nameData=[];
                for(var o in data){
                    nameData.push(data[o].name);
                }
                if(mystory==null||mystory.length==0){//未挂在行业下
                    console.log("删除成功");
                }else{
                    ngDialogTips(ngDialog,"下列专题使用了该仪表盘分析，不可删除。\n\r<br>"+nameData);
                }
                $scope.searchClick();
            }).error(function (data) {
				ngDialogTips(ngDialog,"删除失败");
            });
        },function () {

			})
    }
    $scope.copyPie=function(pie){
		ngDialogWithConfirmButtonTips(ngDialog, '确认复制 ?', '复制仪表盘：'+pie.name+'。')
			.then(function (value) {
	    	$http({
	            method: "POST",
	            url: ctx()+"/dashboards/"+pie.id,
	            params:{}
	        }).success(function (data) {
	        	ngDialogTips(ngDialog,"复制成功");
	        	console.log("复制成功");
	        	$scope.searchClick();
		     }).error(function (data) {
	            console.log("复制失败");
	        });
    	},function () {

			})
    }
    $scope.newPie=function(){
    	var obj={
				"currentName":angular.element("#menu_zztz").find("#menu_muyPie").attr("id")
		}
		locals.setObject("href",obj);
    	angular.element("#menu_zztz").find("#menu_muyPie").addClass("active");
    	angular.element("#menu_zztz").find("#menu_muyPie").siblings("li").removeClass("active");
		$state.go("zztzfx.myPie");
    };
    $scope.delStory=function(story){//删除story
		ngDialogWithConfirmButtonTips(ngDialog, '确认删除 ?','删除专题：'+story.name+'，此操作无法撤销。')
			.then(function (value) {
	    	$http({
	            method: "DELETE",
	            url: ctx()+"/stories/"+story.id,
	            params:{}
	        }).success(function (data) {
	        	ngDialogTips(ngDialog,"删除成功");
	        	console.log("删除成功");
	        	$scope.searchClick();
		     }).error(function (data) {
	            console.log("删除失败");
	        });
    	},function () {

			})
    }
    $scope.copyStory=function(story){
		ngDialogWithConfirmButtonTips(ngDialog, '确认复制 ?', '复制专题：'+story.name+'。')
			.then(function (value) {
	    	$http({
	            method: "POST",
	            url: ctx()+"/stories/"+story.id,
	            params:{}
	        }).success(function (data) {
	        	console.log("复制成功");
	        	$scope.searchClick();
		     }).error(function (data) {
				ngDialogTips(ngDialog,"复制失败");
	        });
    	},function () {

			})
    }
    $scope.newStory=function(){
    	var obj={
				"currentName":angular.element("#menu_zztz").find("#menu_myStory").attr("id")
		}
		locals.setObject("href",obj);
    	angular.element("#menu_zztz").find("#menu_myStory").addClass("active");
    	angular.element("#menu_zztz").find("#menu_myStory").siblings("li").removeClass("active");
		$state.go("zztzfx.myStory");
    };
    $scope.newWorkTable=function(){
    	var obj={
				"currentName":angular.element("#menu_zztz").find("#menu_workPanel").attr("id")
		}
		locals.setObject("href",obj);
    	angular.element("#menu_zztz").find("#menu_workPanel").addClass("active");
    	angular.element("#menu_zztz").find("#menu_workPanel").siblings("li").removeClass("active");
		$state.go("zztzfx.workPanel");
    }
    $scope.showTable=function(table){
    	tableDetail.tableDetail=table;
    	//加菜单缓存标识
    	var obj={
				"currentName":"menu_workPanel"
		}
		locals.setObject("href",obj);
    	var ulObj=document.getElementById("menu_zztz").childNodes;
    	getUrlObj(ulObj,obj);
    	//加菜单缓存标识结束
    	$state.go('zztzfx.workPanel');
    };
    $scope.showPie=function(pie){
    	//塞pieDetail缓存
    	pieDetail.pieDetail=pie;
    	//加菜单缓存标识
    	var obj={
				"currentName":"menu_muyPie"
		}
		locals.setObject("href",obj);
    	var ulObj=document.getElementById("menu_zztz").childNodes;
    	getUrlObj(ulObj,obj);
    	//加菜单缓存标识结束
    	$state.go('zztzfx.myPie');
    };
    $scope.showStory=function(story){
    	//塞storyDetail缓存
    	storyDetail.storyDetail=story;
    	//加菜单缓存标识
    	var obj={
				"currentName":"menu_myStory"
		}
		locals.setObject("href",obj);
    	var ulObj=document.getElementById("menu_zztz").childNodes;
    	getUrlObj(ulObj,obj);
    	//加菜单缓存标识结束
    	$state.go('zztzfx.myStory');
    };
    
  //原生获取兄弟节点的方法
	function sibling( elem ) {
		var r = [];
		var n = elem.parentNode.firstChild;
		for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			r.push( n );
			}
		}
		return r;
	}
    function getUrlObj(ulObj,obj){
    	for(var i=0;i<ulObj.length;i++){
    		var liObjs=ulObj[i].childNodes;
    		console.log("ulObj[i].nodeName="+ulObj[i].nodeName);
    		if(ulObj[i].nodeName=="UL"){
    			for(var j=0;j<liObjs.length;j++){
    				console.log("liObjs[j].nodeName="+liObjs[j].nodeName);
    				if(liObjs[j].nodeName=="LI"){
    					if(liObjs[j].getAttribute("id")==obj.currentName){
            				liObjs[j].setAttribute("class","active");
            				var siblingObjs=sibling(liObjs[j]);
            				for(var k=0;k<siblingObjs.length;k++){
            					if(siblingObjs[k].nodeName=="LI"){
            						siblingObjs[k].removeAttribute("class");
            					}
            				}
            			}
    				}
        		}
    		}
    	}
    }
});
function getChartDiv($http,tableDetail,locals,$compile,scope,dimTable,measures,filters){
	if(typeof(tableDetail.tableDetail)=="undefined"||tableDetail.tableDetail==null) return;
	$http({
        method: "POST",
        url: ctx()+"/workTable/showWorkTable",
        params:{"workTableId":tableDetail.tableDetail.workTableId}
      }).success(function(table){
    	  console.log("showWorkTable:"+JSON.stringify(table));
//    	  //塞数据分析名称
    	  if (table.xsColor && typeof(table.xsColor)!="undefined" && table.xsColor!=0)
    		  XsColor=table.xsColor;
    	  if (table.xwColor && typeof(table.xwColor)!="undefined" && table.xwColor!=0)
    		  XwColor=table.xwColor;
    	  if (table.ysColor && typeof(table.ysColor)!="undefined" && table.ysColor!=0)
    		  YsColor=table.ysColor;
    	  if (table.ywColor && typeof(table.ywColor)!="undefined" && table.ywColor!=0)
    		  YwColor=table.ywColor;
    	  if (table.headerColor && typeof(table.headerColor)!="undefined" && table.headerColor!=0)
    		  headerColor=table.headerColor;
    	  if (table.bodyColor && typeof(table.bodyColor)!="undefined" && table.bodyColor!=0)
    		  bodyColor=table.bodyColor;
    	  if (table.tableColor && typeof(table.tableColor)!="undefined" && table.tableColor!=0)
    		  tableColor=table.tableColor;
    	  debugger;
    	  echartsColorTheme = table.themeId;
    	  echartsColorArr = table.themeColorArr||null;
    	  if(echartsColorArr==null){
	    	  $http({
	  	        method: "POST",
	  	        url: ctx() + "/theme/getThemeList",
	  	        params:{"themeId":echartsColorTheme}
	  	    }).success(function (freetrial) {
	  	    	console.log("getThemeList:"+JSON.stringify(freetrial));
	  	    	if(freetrial!=null){
	  	    		echartsColorArr=freetrial.data[0].themeColorArr;
	  	    	}
	  	    }).error(function (freetrial) {
	  	    	console.log("查询数据异常！");
	  	    });
    	  }
    	  setWorkTableName(table.workTableName,table.workTableCode)
//    	  tableDetail["dimTable"]=table.dimTable;
//    	  tableDetail["measures"]=table.measures;
//    	  tableDetail["filters"]=table.filters;
    	  //塞编号数字
    	  locals.set("wnumber",table.dimTable.length+2);
    	  locals.set("dnumber",table.measures.length+2);
    	  //拼接维度div样式
    	  var widthW = 0; //weiduDiv子元素宽度和
    	  for(var p=0;p<table.dimTable.length;p++){
    		  var newChild="";
    		  if(table.dimTable[p].nextflag==null){
        		  newChild="<div id='weidu_div_"+(p+1)+"W' class='drag03' alt='"+JSON.stringify(table.dimTable[p])+"' name='"+table.dimTable[p].tableName+"' style='left: "+widthW+"px; top: 3px; z-index: "+(zIndexTop+p+1)+"; position: absolute; cursor: default;'><span>"+table.dimTable[p].tableColumnCn+"</span><a delete='' class='fa fa-close font_colorW floatR' style='line-height:20px'></a></div>";                	            			  
    		  }
    		  if(table.dimTable[p].nextFlag=="1"){
        		  newChild="<div id='weidu_div_"+(p+1)+"W' class='drag03' alt='"+JSON.stringify(table.dimTable[p])+"' name='"+table.dimTable[p].tableName+"' style='left: "+widthW+"px; top: 3px; z-index: "+(zIndexTop+p+1)+"; position: absolute; cursor: default;'><a scroll-up='' class='fa fa-minus-square-o font_colorW' style='line-height:20px;margin-right: 5px;'></a><span>"+table.dimTable[p].tableColumnCn+"</span><a delete='' class='fa fa-close font_colorW floatR' style='line-height:20px'></a></div>";        	            			 
    		  }
    		  if(table.dimTable[p].nextFlag=="2"){
        		  newChild="<div id='weidu_div_"+(p+1)+"W' class='drag03' alt='"+JSON.stringify(table.dimTable[p])+"' name='"+table.dimTable[p].tableName+"' style='left: "+widthW+"px; top: 3px; z-index: "+(zIndexTop+p+1)+"; position: absolute; cursor: default;'><span>"+table.dimTable[p].tableColumnCn+"</span><a scroll-down='' class='fa fa-plus-square-o font_colorW' style='line-height:20px;margin-left: 5px;margin-right: 5px;'></a><a delete='' class='fa fa-close font_colorW floatR' style='line-height:20px'></a></div>";        	            			 
    		  }
    		  if(table.dimTable[p].nextFlag=="3"){
        		  newChild="<div id='weidu_div_"+(p+1)+"W' class='drag03' alt='"+JSON.stringify(table.dimTable[p])+"' name='"+table.dimTable[p].tableName+"' style='left: "+widthW+"px; top: 3px; z-index: "+(zIndexTop+p+1)+"; position: absolute; cursor: default;'><a scroll-up='' class='fa fa-minus-square-o font_colorW' style='line-height:20px;margin-right: 5px;'></a><span>"+table.dimTable[p].tableColumnCn+"</span><a scroll-down='' class='fa fa-plus-square-o font_colorW' style='line-height:20px;margin-left: 5px;margin-right: 5px;'></a><a delete='' class='fa fa-close font_colorW floatR' style='line-height:20px'></a></div>";        	            			 
    		  }
    		  var template = angular.element(newChild);
    		  var mobileDialogElement = $compile(template)(scope);
    		  angular.element("#weiduDiv").append(mobileDialogElement);
    		  var childObjW=document.getElementById("weiduDiv").childNodes;
    		  for(var n1=0;n1<childObjW.length;n1++){
    			  if(n1==childObjW.length-1){
    					  console.log("widthW="+widthW+",childObj.width="+childObjW[n1].offsetWidth);
        				  widthW=widthW+parseInt(childObjW[n1].offsetWidth)+3;
    			  }
    		  }
    		  //给echarts对象塞值
    		  var oNewW = {
                      "tableName": table.dimTable[p].tableName,
                      "tableColumn": table.dimTable[p].tableColumn
                  };//新的入参对象
    		  dimTable.push(oNewW);
    		  //给左侧维度列加编号标记
    		  var leftDivObj=document.getElementById("left_weiduTable").childNodes;
    		  for(var w=0;w<leftDivObj.length;w++){
    			  if(leftDivObj[w].nodeName=="DIV"){
    				  var leftPObj=leftDivObj[w].childNodes;
    				  for(var v=0;v<leftPObj.length;v++){
    					  if(leftPObj[v].nodeName=="P"){
    						  var leftAObj=leftPObj[v].childNodes;
    						  for(var x=0;x<leftAObj.length;x++){
    							  if(leftAObj[x].nodeName=="A"){
    								  var altObj=eval('(' + leftAObj[x].getAttribute("alt") + ')');
    								  if(altObj.tableColumn==table.dimTable[p].tableColumn && leftAObj[x].getAttribute("name")==table.dimTable[p].tableName){
    									  leftAObj[x].setAttribute("id","aWeidu_div_"+(p+1));
    								  }
    							  }
    						  }
    					  }
    				  }
    			  }
    		  }
    	  }
    	//拼接度量div样式
    	  var widthD = 0; //duliangDiv子元素宽度和
    	  for(var q=0;q<table.measures.length;q++){
    		  var newChild="<div id='duliang_div_"+(q+1)+"D' class='drag03' alt='"+JSON.stringify(table.measures[q])+"' value='"+table.measures[q].factTableRule+"'  style='left: "+widthD+"px; top: 3px; z-index: "+(zIndexTop+q+1)+"; position: absolute; cursor: default;'><a class='font_colorW fa fa-caret-down' style='margin-right:5px' table-rule=''></a><span>"+table.measures[q].tableColumnCn+"（"+table.measures[q].ruleName+"）"+"</span><a delete='' class='fa fa-close font_colorW floatR' style='line-height:20px'></a></div>";
    		  var template = angular.element(newChild);
    		  var mobileDialogElement = $compile(template)(scope);
    		  angular.element("#duliangDiv").append(mobileDialogElement);
    		  var childObjD=document.getElementById("duliangDiv").childNodes;
    		  for(var n2=0;n2<childObjD.length;n2++){
    			  if(n2==childObjD.length-1){
    					  console.log("widthD="+widthD+",childObjD.width="+childObjD[n2].offsetWidth);
        				  widthD=widthD+parseInt(childObjD[n2].offsetWidth)+3;
    			  }
    		  }
    		  var oNewD = {
                      "tableName": table.measures[q].tableName,
                      "tableColumn": table.measures[q].tableColumn,
                      "factTableRule": table.measures[q].factTableRule
                  };//新的入参对象
                  measures.push(oNewD);
    		  //给左侧度量列加编号标记
    		  var leftPObj_D=document.getElementById("left_duliangTable").childNodes;
    		  for(var w=0;w<leftPObj_D.length;w++){
    			  if(leftPObj_D[w].nodeName=="P"){
    						  var leftAObj=leftPObj_D[w].childNodes;
    						  for(var x=0;x<leftAObj.length;x++){
    							  if(leftAObj[x].nodeName=="A"){
    								  var altObj=eval('(' + leftAObj[x].getAttribute("alt") + ')');
    								  if(altObj.tableColumn==table.measures[q].tableColumn && altObj.tableName==table.measures[q].tableName){
    									  leftAObj[x].setAttribute("id","aDuliang_div_"+(q+1));
    								  }
    							  }
    						  }
    			  }
    		  }
    	  }
    	//拼接筛选div样式
    	  widthS=0;//shaixuanDiv子元素宽度和
    	  var oNewS={};
    	  for(var m=0;m<table.filters.length;m++){
    		  //维度筛选
    		  if(table.filters[m].tableType==1){
    			  var objW=document.getElementById("weiduDiv").childNodes;
    			  var numberSW=0;
    			  var isInWeidu=false;
        		  for(var n3=0;n3<objW.length;n3++){
        			  var altObj=eval('(' + objW[n3].getAttribute("alt") + ')');
        			  if(table.filters[m].tableName==altObj.tableName && table.filters[m].tableColumn==altObj.tableColumn){
        				  numberSW=objW[n3].getAttribute("id").replace(/[^0-9]/ig, "");
        				  isInWeidu=true;
        			  }
        		  }
        		  //编号处理
        		  if(numberSW==0){
        			  numberSW=locals.get("wnumber");
        		  }
        		  var newChild="";
        		  if(table.filters[m].listFilters==null){
        			  var WdTip = table.filters[m].tableColumnCn+"【请选择筛选范围】";
        			  if(WdTip.length>10){
        				  WdTip = WdTip.substring(0,10)+"...";
        			  }
        			  newChild="<div id='weidu_div_"+numberSW+"S' class='drag03' alt='"+JSON.stringify(table.filters[m])+"' name='"+table.filters[m].tableName+"'  " +
        			  "style='left: "+widthS+"px; top: 3px; z-index: "+(zIndexTop+m+1)+"; position: absolute; cursor: default;'>" +
        			  "<a class='font_colorW fa fa-caret-down ng-scope' style='margin-right:5px' open=''></a><span>"+WdTip+"</span>" +
        			  "<a delete='' class='fa fa-close font_colorW floatR' style='line-height:20px'></a></div>";
        		  }
        		  else{
        			  var filtersObj=table.filters[m].listFilters;
        			  var filtersStr="";
        			  for(var a=0;a<filtersObj.length;a++){
        				  filtersStr=filtersStr+filtersObj[a]+",";
        			  }
        			  var WdTip = table.filters[m].tableColumnCn+"【"+filtersStr+"】";
        			  if(WdTip.length>10){
        				  WdTip = WdTip.substring(0,10)+"...";
        			  }
        			  
        			  newChild="<div id='weidu_div_"+numberSW+"S' class='drag03' alt='"+JSON.stringify(table.filters[m])+"' " +
        			  		"name='"+table.filters[m].tableName+"'  style='left: "+widthS+"px; top: 3px; z-index: "+(zIndexTop+m+1)+"; " +
        			  		"position: absolute; cursor: default;' value='"+filtersStr+"'>" +
        			  		"<a class='font_colorW fa fa-caret-down ng-scope' style='margin-right:5px' open=''></a><span>"+WdTip+"</span>" +
        			  		"<a delete='' class='fa fa-close font_colorW floatR' style='line-height:20px'></a></div>";
        		  }
        		  var template = angular.element(newChild);
        		  var mobileDialogElement = $compile(template)(scope);
        		  angular.element("#shaixuanDiv").append(mobileDialogElement);
        		  var childObjS=document.getElementById("shaixuanDiv").childNodes;
        		  for(var n4=0;n4<childObjS.length;n4++){
        			  if(n4==childObjS.length-1){
        					  console.log("widthS="+widthS+",childObjS.width="+childObjS[n4].offsetWidth);
            				  widthS=widthS+parseInt(childObjS[n4].offsetWidth)+3;
        			  }
        		  }
        		  if(isInWeidu==false){
        			  numberSW++;
        			  locals.set("wnumber",numberSW);
        		  }
        		  oNewS = {
                            "tableType":"1",//代表筛选行里的维度还是度量
                            "tableName": table.filters[m].tableName,
                            "tableColumn": table.filters[m].tableColumn,
                            "listFilters": table.filters[m].listFilters
                        };//新的入参对象
                        filters.push(oNewS);
    		  }
    		//维度筛选结束
    		//度量筛选
    		  if(table.filters[m].tableType==2){
    			  var objD=document.getElementById("duliangDiv").childNodes;
    			  var numberSD=0;
    			  var isInDuliang=false;
        		  for(var n5=0;n5<objD.length;n5++){
        			  var altObj=eval('(' + objD[n5].getAttribute("alt") + ')');
        			  if(table.filters[m].tableName==altObj.tableName && table.filters[m].tableColumn==altObj.tableColumn){
        				  numberSD=objD[n5].getAttribute("id").replace(/[^0-9]/ig, "");
        			  }
        		  }
        		  //编号处理
        		  if(numberSD==0){
        			  numberSD=locals.get("dnumber");
        		  }
        		  var newChild="";
        		  if(table.filters[m].listFilters==null){
        			  var DlTip = table.filters[m].tableColumnCn+"（"+table.filters[m].ruleName+"）"+"【请选择筛选范围】";
        			  if(DlTip.length>10){
        				  DlTip = DlTip.substring(0,10)+"...";
        			  }  
	        		  var newChild="<div id='duliang_div_"+numberSD+"S' class='drag03' alt='"+JSON.stringify(table.filters[m])+"' " +
	        		  "name='"+table.filters[m].factTableRule+"'  style='left: "+widthS+"px; top: 3px; z-index: "+(zIndexTop+m+1)+"; " +
	        		  "position: absolute; cursor: default;'><a class='font_colorW fa fa-caret-down' style='margin-right:5px' open=''></a>" +
	        		  "<span>"+DlTip+"</span>" +
	        		  "<a delete='' class='fa fa-close font_colorW floatR' style='line-height:20px'></a></div>";
        		  }
        		  else{
        			  var filtersObj=table.filters[m].listFilters;
        			  var filtersStr="";
        			  for(var a=0;a<filtersObj.length;a++){
        				  filtersStr=filtersStr+filtersObj[a]+",";
        			  }
        			  var DlTip = table.filters[m].tableColumnCn+"（"+table.filters[m].ruleName+"）"+"【"+filtersStr+"】";
        			  if(DlTip.length>10){
        				  DlTip = DlTip.substring(0,10)+"...";
        			  } 
        			  newChild="<div id='duliang_div_"+numberSD+"S' class='drag03' alt='"+JSON.stringify(table.filters[m])+"' " +
        			  "name='"+table.filters[m].factTableRule+"'  style='left: "+widthS+"px; top: 3px; z-index: "+(zIndexTop+m+1)+"; " +
        			  "position: absolute; cursor: default;' value='"+filtersStr+"'>" +
        			  "<a  class='font_colorW fa fa-caret-down' style='margin-right:5px' open=''></a><span>"+DlTip+"</span>" +
        			  "<a delete='' class='fa fa-close font_colorW floatR' style='line-height:20px'></a></div>";
        		  }
        		  var template = angular.element(newChild);
        		  var mobileDialogElement = $compile(template)(scope);
        		  angular.element("#shaixuanDiv").append(mobileDialogElement);
        		  var childObjS=document.getElementById("shaixuanDiv").childNodes;
        		  for(var n6=0;n6<childObjS.length;n6++){
        			  if(n6==childObjS.length-1){
        					  console.log("widthS="+widthS+",childObjS.width="+childObjS[n6].offsetWidth);
            				  widthS=widthS+parseInt(childObjS[n6].offsetWidth)+3;
        			  }
        		  }
        		  if(isInDuliang==false){
        		  numberSD++;
    			  locals.set("dnumber",numberSD);
        		  }
        		  oNewS = {
                            "tableType":"2",//代表筛选行里的度量
                            "tableName": table.filters[m].tableName,
                            "tableColumn": table.filters[m].tableColumn,
                            "factTableRule":table.filters[m].factTableRule,
                            "listFilters": table.filters[m].listFilters
                        };//新的入参对象
                        filters.push(oNewS);
    		  }
    		  //度量筛选结束
    	  }
    	  iconSetting();
    	  //给dataType塞值
    	  document.getElementById('workTableNameInput').setAttribute("name",tableDetail.tableDetail.dataType);
    	  //开始显示echarts图表
		  echartsObj={
                  "workTableId":tableDetail.tableDetail.workTableId,
                  "workTableName":tableDetail.tableDetail.workTableName,
                  "dimTable": dimTable,
                  "measures": measures,
                  "filters": filters,
                  "dataType":tableDetail.tableDetail.dataType,
                  "cubeId": tableDetail.tableDetail.cubeId
              };
		//mixTowDimLine 两维度面积图，是曲线类型
		  if(tableDetail.tableDetail.dataType=="mixTwoMeasure"||tableDetail.tableDetail.dataType=="mixTwoDim"||tableDetail.tableDetail.dataType=="mixTowDimLine"||tableDetail.tableDetail.dataType=="mixTwoMeasureTwoY"){
				for(var t =0;t<echartsObj.measures.length;t++){
					if(t==0){//第一个度量是曲线，第二个是柱状图
						echartsObj.measures[t].chartType="line";
					}else{
						echartsObj.measures[t].chartType="bar";
					}
				}
			}
              console.log("传给后台的dataType="+tableDetail.tableDetail.dataType);
              console.log("传给后台的echartsObj=" + JSON.stringify(echartsObj));
              echartsDataType=tableDetail.tableDetail.dataType;
              //后台返回的json数据
              debugger;
                $http({
                    method: "POST",
                    url: ctx()+"/workTable/getKylinByCondition",
                    data:JSON.stringify(echartsObj)
                  }).success(function (freetrial) {
                    var echartsData = freetrial;
                    debugger;
                    if(echartsDataType=="step"||echartsDataType=="steptext"){
                    	echartsObj.measures={
                        		"nameDuliang":echartsData.data[0].dataY[0].nameDuliang,
                        		"unitDuliang":echartsData.data[0].dataY[0].unitDuliang
                        }
                    }
		            //清除div内的元素
                    angular.element("#echartsDiv").empty();
                    console.log("返回对象："+JSON.stringify(echartsData));
                    if (echartsData.success == true) {
                    	var id= "echartsDiv";
                    	 //******************table开始***********************
                    	if(echartsDataType=="table"){
                    		//添加table
            				getTableChart($compile,scope,echartsData);//获取表格数据拼装
                    	}
                    	//******************table结束*********************
                    	//******************特殊图形开始**********************
                    	else if(echartsDataType=="horizontal"){
            				getHorizontalDivChartFromCommon(id,$compile,echartsData,scope); //横向div
            			}else if(echartsDataType=="pie"||echartsDataType=="pieNull"){
            				getPieChartFromCommon(id,$compile,echartsData,scope);//饼形图
            			}else if(echartsDataType=="mixTwoDim"){
            				getMixDimensionChartFromCommon(id,$compile,echartsData,scope); //混合div两维度
            			}else if(echartsDataType=="mixTowDimLine"){
            				getTowDimLineFromCommon(id,$compile,echartsData,scope); //混合div两维度面积图
            			}else if(echartsDataType=="mixTwoMeasure"){
            				getMixDimensionChartFromCommon(id,$compile,echartsData,scope); //混合div两度量
            			}else if(echartsDataType=="mixTwoMeasureTwoY"){
            				getTowDimTwoYFromCommon(id,$compile,echartsData,scope); //混合div两度量双Y轴
            			}else if(echartsDataType=="gauge"){
            				getGaugeChart($compile,echartsData,scope,"echartsDiv"); //一维样式div
                        }else if(echartsDataType=="step"){
            				getStepChart($compile,echartsData,scope,"echartsDiv",echartsObj.measures,null,null,$http); //一维样式div
                        }else if(echartsDataType=="steptext"){
            				getSteptextChart($compile,echartsData,scope,"echartsDiv",echartsObj.measures); //一维样式div
                        }else if(echartsDataType=="float"){//浮点图
                        	getFloatFromCommon(id,$compile,echartsData,scope);
                   	 	}else if(echartsDataType=="quadrant"){//象限图
                   	 		getQuadrantFromCommon(id,$compile,echartsData,scope);
                   	 	}
            			//******************特殊图形结束*********************
                      //******************图表开始**********************
                        else{
                        	 if (echartsData.data.length == 1) {
                                 //一维样式div
             					getOneDimension($compile,echartsData,scope); //一维样式div
                        	 }
                        	 else {
                        		 if(echartsData.data[0][0].nameWeidu==null){
                        			 ngDialogTips(ngDialog,"无数据");
                        		 }
                        		 else{
                        			 //多维样式table
                        			 //加table
                        			 getMoreDimension($compile,scope,echartsData);
                             	}
                             }
                         }
                    	//******************图表结束***********************

                    }
                    else {
                        ngDialogTips(ngDialog,"无数据！");
                    }
				  
                }).error(function (freetrial) {
                    ngDialogTips(ngDialog,"获取数据失败！");
                });
	 
      }).error(function(table) {
          ngDialogTips(ngDialog,"查询异常！");
      });
}
// 数据模型的绑定事件
zztzApp.controller('dataController', function ($scope, $http,$compile,tableDetail,isSearch,locals,ngDialog) {
	var scope = $scope;
	var bopen = true;//标记是否为第一次打开工作表时执行change事件
	scope.tableDetail=tableDetail.tableDetail;//详情
    // 数据模型model名初始值
	scope.modelName = "请输入数据模型名称";
    //获取数据表
	scope.getTable = function () {
    	//传入给后台的查询cube列表的参数
    	var cube_name="";
    	if (scope.modelName == "请输入数据模型名称"){
    		cube_name=null;
    	}
    	else{
    		cube_name=scope.modelName;
    	}
            //后台传回json数据            
            var data={
            	      "cubeNameCn" : cube_name,
            	      "cubeStatus" : "1"//查询显示状态的cube
            	  }
            $http({
                method: "POST",
                url: ctx()+"/cube/getCubeListByCondition",
                params:data
              })
              .success(function(freetrial, status, headers, config) {
            	  if(tableDetail.tableDetail!=null){//非空则是打开数据分析而不是新建数据分析，循环得出打开的数据分析的cube
            		  for(var n =0;n<freetrial.length;n++){
                		  if(freetrial[n].cubeId==tableDetail.tableDetail.cubeId){
                			//前台传eachrts的维度和度量对象参数
                              var echartsObj = new Object();
                              var dimTable = new Array();//维度列
                              var measures = new Array();//度量列
                              var filters = new Array();//筛选列
                			  var myTable = freetrial[n];
                			  scope.change(myTable,dimTable,measures,filters);
                		  }
                	  }
            	  }
//            	scope.cubeListGifUrl="";
                scope.tables = freetrial;
                console.log("返回的cubeList数据："+JSON.stringify(scope.tables));
              //判断是否点击搜索,点击了伸缩框就不能收起
                isSearch.isSearch=true;
                locals.setObject("isSearch",isSearch);
   		  //隐藏维度和度量框
   		     /*if(scope.weiDu && scope.duLiang){
   		    	angular.element("#left_weiduTable").css({"height":"0px","padding":"0px"});
   		    	angular.element("#left_duliangTable").css({"height":"0px","padding":"0px"});
   		     }
   		     angular.element("#left_weiduTable").prev("div[class='left_tab']").find("span").css("color","#cccccc");
   		    angular.element("#left_duliangTable").prev("div[class='left_tab']").find("span").css("color","#cccccc");*/
              })
              .error(function(freetrial, status, headers, config) {
                 ngDialogTips(ngDialog,"查询异常！");
              });
//        };
    };

    // /*数据表选择，获取维度和度量列表*/
    scope.change = function (table,dimTable,measures,filters) {
        if (table != null) {
            //传入给后台的所选择cube表的对象参数
            var cubeObj = table;
            // alert(JSON.stringify(scope.myTable));
            var cubeId = cubeObj.cubeId;
            var data={
          	      "cubeId" : cubeId
          	  }
          //将CUBE名称显示到input框里
        	angular.element("#left_modelTable").find("input").val(table.cubeNameCn);
            //将cubeId放到Input的name属性里
            angular.element("#left_modelTable").find("input").attr("name",cubeObj.cubeId);
          //alert(JSON.stringify(data));
            $http({
            	async: false,
                method: "POST",
                url: ctx()+"/workTable/getCubeDetailById",
                params:data
              })
              .success(function(freetrial, status, headers, config) {
           	   if (freetrial.success == true) {
           		 console.log("返回的模型详情:"+JSON.stringify(freetrial));
           		      //搜索列表
           		      angular.element("#left_modelTable").animate({height:"15px"},250);  
                      // //扩大div高度
           		      angular.element("#left_weiduTable").removeAttr("style");
           		      angular.element("#left_duliangTable").removeAttr("style");
                      //将颜色为灰色的span改为黑色
                      angular.element(".left_weidu").find("span").removeAttr("style");
                      angular.element(".left_duliang").find("span").removeAttr("style");
                    //判断是否点击搜索,change过了伸缩框就可以收起
                      isSearch.isSearch=true;
                      locals.setObject("isSearch",isSearch);
                      //清空所有条件和图表
                      var childObj01=document.getElementById("weiduDiv").childNodes;
                      console.log("weiduDivChild:"+document.getElementById("weiduDiv").childNodes.length);
                      if(document.getElementById("weiduDiv").childNodes.length>0){
                        var i=0;
                        while(i<childObj01.length){
                          childObj01[0].parentNode.removeChild(childObj01[0]); 
                        }  
                      }
                      var childObj02=document.getElementById("duliangDiv").childNodes;
                      console.log("duliangDivChild:"+document.getElementById("duliangDiv").childNodes.length);
                      if(document.getElementById("duliangDiv").childNodes.length>0){
                    	  var j=0;
                    	  while(j<childObj02.length){
                        	  childObj02[0].parentNode.removeChild(childObj02[0]); 
                            }
                      }
                      var childObj03=document.getElementById("shaixuanDiv").childNodes;
                      console.log("shaixuanDivChild:"+document.getElementById("shaixuanDiv").childNodes.length);
                      if(document.getElementById("shaixuanDiv").childNodes.length>0){
                    	  var k=0;
                    	  while(k<childObj03.length){
                        	  childObj03[0].parentNode.removeChild(childObj03[0]); 
                            }
                      }
                      var childObj04=document.getElementById("echartsDiv").childNodes;
                      console.log("echartsDivChild:"+document.getElementById("echartsDiv").childNodes.length);
                      if(document.getElementById("echartsDiv").childNodes.length>0){
                    	  var n=0;
                    	  while(n<childObj04.length){
                        	  childObj04[0].parentNode.removeChild(childObj04[0]); 
                            }
                      }
//                      }
                      //給维度和度量赋值
                      scope.weiDu = freetrial.data.listDim;
//                      alert(JSON.stringify(freetrial.data.listDim));
                      scope.duLiang = freetrial.data.listFact;
                      if(bopen){//来自于打开工作表
                    	  getChartDiv($http,tableDetail,locals,$compile,scope,dimTable,measures,filters);
                      }
                  }
           	   bopen = false;//第一次打开置为false
              }).error(function (freetrial) {
                ngDialogTips(ngDialog,"获取数据失败！");
            })
        }
    };
});


//写jQuery拖拽指令
zztzApp.directive('draggable', function ($document, $compile,locals,ngDialog) {
    return {
        scope: false,
        restrict: 'A',
        link: function (scope, element, attr) {
           //未被拖拽过两次的维度*****************************************************************************************************************
            if (element.parents("div[class*='left_weiduTable']").length != 0 ) {
                element.on('mousedown', function (event) {
                    //获取维度表是否能拖拽
                    if(element.attr("class").indexOf("weidu_table")>=0){
                        var isDraddedTable=eval('(' + element.parent("p").next("p").children("a").attr("alt") + ')');
                    }
                    if((element.attr("class").indexOf("weidu_table")<0) || (element.attr("class").indexOf("weidu_table")>=0 && isDraddedTable.nextFlag!=null)){
                        zIndex++;
                        //记录元素在页面的初始位置
                        iXW = event.clientX - this.offsetLeft;
                        iYW = event.clientY - this.offsetTop + element.parents("div[class*='left_weiduTable']").scrollTop();
                        //记录元素在页面的终止位置
                        var e = event || window.event;
                        oXW = e.clientX - iXW;
                        oYW = e.clientY - iYW;
                        //给被拖拽a标签做编号标记
                        var aNumW = 0; //被拖拽a标签的编号
                        var text ="";
                        //判断是否为table表
                        if(element.attr("class").indexOf("weidu_table")>=0){
                            //判断是否被拖拽过
                            if(element.parent("p").next("p").children("a").attr("id")){
                                aNumW=parseInt(element.parent("p").next("p").children("a").attr("id").replace(/[^0-9]/ig, "")); //截取数字,获取编号;
                            }
                            else{
                                if(locals.get("wnumber")!="" || locals.get("wnumber")!=null){
                                    wnumber=locals.get("wnumber");
                                }
                                wnumber++;
                                aNumW = wnumber;
                                locals.set("wnumber",aNumW);
                                // ngDialogTips(ngDialog,"wnumber_dragged="+wnumber);
                            }
                            element.parent("p").next("p").children("a").attr("id", "aWeidu_div_" + aNumW);
                            text = element.parent("p").next("p").find("a").text();
                            element.parent("p").next("p").after($compile(
                                "<div " + "id='weidu_div_" + aNumW + "' " + "class='drag02'></div>"
                            )(scope));
                            element.parent("p").next("p").next("div[id*='weidu_div']").append($compile("<span>" + text + "</span>")(scope));
                            element.parent("p").next("p").next("div[id*='weidu_div']").css({
                                "left": oXW + "px",
                                "top": oYW + "px",
                                "z-index": zIndex,
                                "position": "absolute",
                                "cursor": "move"
                            });
                            this.setCapture && this.setCapture();
                            $document.on('mousemove', mousemove);
                            $document.on('mouseup', mouseup);
                            return false;
                        }
                        else{
                            //判断是否被拖拽过
                            if(element.attr("id")){
                                aNumW=parseInt(element.attr("id").replace(/[^0-9]/ig, "")); //截取数字,获取编号;
                            }
                            else{
                                if(locals.get("wnumber")!="" || locals.get("wnumber")!=null){
                                    wnumber=locals.get("wnumber");
                                }
                                wnumber++;
                                aNumW = wnumber;
                                locals.set("wnumber",aNumW);
                            }
                            element.attr("id", "aWeidu_div_" + aNumW);
                            //复制一个被拖拽元素div
                            text = element.text();
                            element.parent("p").after($compile(
                                "<div " + "id='weidu_div_" + aNumW + "' " + "class='drag02'></div>"
                            )(scope));
                            element.parent("p").next("div[id*='weidu_div']").append($compile("<span>" + text + "</span>")(scope));
                            element.parent("p").next("div[id*='weidu_div']").css({
                                "left": oXW + "px",
                                "top": oYW + "px",
                                "z-index": zIndex,
                                "position": "absolute",
                                "cursor": "move"
                            });
                            this.setCapture && this.setCapture();
                            $document.on('mousemove', mousemove);
                            $document.on('mouseup', mouseup);
                            return false;
                        }
                    }
                });
                //元素移动方法
                function mousemove(event) {
                        var e = event || window.event;
                        var widthW = 0; //weiduDiv子元素宽度和
                        var widthS = 0; //shaixuanDiv子元素宽度和
                        zIndex++;
                        oXW = e.clientX - iXW;
                        oYW = e.clientY - iYW;
                        //维度拖拽可以到“维度”和“筛选”框
                        $("#weiduDiv").children("div").each(function (index) {
                        		widthW = widthW + $(this).width() + 15;
                        });
                        $("#shaixuanDiv").children("div").each(function (index) {
                                widthS = widthS + $(this).width() + 15;
                        });
                        if (oYW >= 40 && oYW <= 80) {
                            oYW = 60;
                        }
                        if (oYW >= 120 && oYW <= 150) {
                            oYW = 130;
                        }
                        if (oYW == 60) {
                            if (oXW >= widthW + 310 && oXW <= widthW + 370) {
                                oXW = 340 + widthW;
                            }
                        }
                        if (oYW == 130) {
                            if (oXW >= widthS + 310 && oXW <= widthS + 370) {
                                oXW = 340 + widthS;
                            }
                        }
                    //判断是否为table表
                    if(element.attr("class").indexOf("weidu_table")>=0){
                        element.parent("p").next("p").next("div[id*='weidu_div']").css({
                            "left": oXW + "px",
                            "top": oYW + "px",
                            "z-index": zIndex,
                            "position": "absolute",
                            "cursor": "move"
                        });
                    }
                    else{
                        element.parent("p").next("div[id*='weidu_div']").css({
                            "left": oXW + "px",
                            "top": oYW + "px",
                            "z-index": zIndex,
                            "position": "absolute",
                            "cursor": "move"
                        });
                    }
                }
                //元素拖拽结束方法
                function mouseup(event) {
                    var widthW = 0; //weiduDiv子元素宽度和
                    var widthS = 0; //shaixuanDiv子元素宽度和
                    //维度拖拽目标
                    //求宽度和
                    $("#weiduDiv").children("div").each(function () {
                    		widthW = widthW + $(this).width() + 15;
                    });
                    $("#shaixuanDiv").children("div").not("div[id*='_box']").each(function () {
                            widthS = widthS + $(this).width() + 15;
                    });
                    if (oYW == 60) {
                        var oldDivId = $("#left_weiduTable").find("p").next("div[id*='weidu_div']").attr("id"); //div标签的旧ID值
                        $("#left_weiduTable").find("p").next("div[id*='weidu_div']").attr("id", oldDivId + "W"); //给DIV标记新的ID值
                        $("#weiduDiv").append($compile($("#left_weiduTable").find("p").next("div[id*='weidu_div']"))(scope));
                        $("#weiduDiv").children("div").last().css({
                            "left": widthW + "px",
                            "top": "3px",
                            "cursor": "default"
                        });
                        //使用$compile服务！ 在link方法中对返回后的html代码经过$compile服务处理后再插入
                        //获取维度表是否能上卷下钻
                        var isScroll="";
                        if(element.attr("class").indexOf("weidu_table")>=0){
                            isScroll=eval('(' + element.parent("p").next("p").children("a").attr("alt") + ')');
                        }
                        else{
                            isScroll=eval('(' + element.attr("alt") + ')');
                        }
                        if(isScroll.nextFlag!=null){
                            if(isScroll.nextFlag==1 || isScroll.nextFlag==3){
                                $("#weiduDiv").children("div").last().prepend($compile(
                                    "<a scroll-up='' class='fa fa-minus-square-o font_colorW' style='line-height:20px;margin-right: 5px;'></a>  "
                                )(scope));
                            }
                            if(isScroll.nextFlag==2 || isScroll.nextFlag==3){
                                $("#weiduDiv").children("div").last().append($compile(
                                    "  <a scroll-down='' class='fa fa-plus-square-o font_colorW' style='line-height:20px;margin-left: 5px;margin-right: 5px;'></a>  "
                                )(scope));
                            }
                        }
                        $("#weiduDiv").children("div").last().append($compile(
                            "<a delete='' class='fa fa-close font_colorW floatR' style='line-height:20px'></a>"
                        )(scope));
                        $("#weiduDiv").children("div").last().removeClass("drag02");
                        $("#weiduDiv").children("div").last().addClass("drag03");
                        //判断是不是维度表名
                        if(element.attr("class").indexOf("weidu_table")>=0){
                            //将维度条件里的对象，传给筛选框里的条件
                            $("#weiduDiv").children("div").last().attr("alt", element.parent("p").next("p").find("a").attr("alt"));
                            //将维度条件里的维度表名称，传给筛选框里的条件
                            $("#weiduDiv").children("div").last().attr("name", element.parent("p").next("p").find("a").attr("name"));
                        }
                        else{
                            //将维度条件里的对象，传给筛选框里的条件
                            $("#weiduDiv").children("div").last().attr("alt", element.attr("alt"));
                            //将维度条件里的维度表名称，传给筛选框里的条件
                            $("#weiduDiv").children("div").last().attr("name", element.attr("name"));
                        }
                    }
                    else if (oYW == 130) {
                        var oldDivId = $("#left_weiduTable").find("p").next("div[id*='weidu_div']").attr("id"); //div标签的旧ID值
                        var nowId = oldDivId + "S_"+new Date().getTime();
                        $("#left_weiduTable").find("p").next("div[id*='weidu_div']").attr("id", nowId); //给DIV标记新的ID值
                        $("#shaixuanDiv").append($compile($("#left_weiduTable").find("p").next("div[id*='weidu_div']"))(scope));
                        // .appendTo("#shaixuanDiv");
                        $("#shaixuanDiv").children("div").last().css({
                            "left": widthS + "px",
                            "top": "3px",
                            "cursor": "default"
                        });
                        $("#shaixuanDiv").children("div").last().prepend($compile(
                            "<a class='font_colorW fa fa-caret-down' style='margin-right:5px' open=''></a>"
                        )(scope)); //加上A标签包裹
                        //将span标签放在a标签里
                        var oldText = $("#"+nowId).find("span").text();
                        var shaiXuanWeiDuTip = oldText+"【请选择筛选范围】";
                        if(shaiXuanWeiDuTip.length>10){
                        	shaiXuanWeiDuTip = shaiXuanWeiDuTip.substring(0,10)+"...";
                        }
                        $("#"+nowId).find("span").text(shaiXuanWeiDuTip);
                        //$("#shaixuanDiv").children("div").last().find("a[class^='font_colorW']").append($compile($("#shaixuanDiv").children("div").last().find("span"))(scope));
                        //使用$compile服务！ 在link方法中对返回后的html代码经过$compile服务处理后再插入
                        $("#shaixuanDiv").children("div").last().append($compile(
                            "<a delete='' class='fa fa-close font_colorW floatR' style='line-height:20px'></a>"
                        )(scope));
                        $("#shaixuanDiv").children("div").last().removeClass("drag02");
                        $("#shaixuanDiv").children("div").last().addClass("drag03");
                        //判断是不是维度表名
                        if(element.attr("class").indexOf("weidu_table")>=0){
                            //将维度条件里的对象，传给筛选框里的条件
                            $("#shaixuanDiv").children("div").last().attr("alt", element.parent("p").next("p").find("a").attr("alt"));
                            //将维度条件里的维度表名称，传给筛选框里的条件
                            $("#shaixuanDiv").children("div").last().attr("name", element.parent("p").next("p").find("a").attr("name"));
                        }
                        else{
                            //将维度条件里的对象，传给筛选框里的条件
                            $("#shaixuanDiv").children("div").last().attr("alt", element.attr("alt"));
                            //将维度条件里的维度表名称，传给筛选框里的条件
                            $("#shaixuanDiv").children("div").last().attr("name", element.attr("name"));
                        }
                    }
                    else {
                        //判断是不是维度表名
                        if(element.attr("class").indexOf("weidu_table")>=0){
                            element.parent("p").next("p").next("div[id*='weidu_div']").remove();
                            zIndex--;
                        }
                        else{
                            element.parent("p").next("div[id*='weidu_div']").remove();
                            zIndex--;
                        }
                    }
                    this.releaseCapture && this.releaseCapture();
                    event.cancelBubble = true;
                    //清除事件
                    $document.off('mousemove', mousemove);
                    $document.off('mouseup', mouseup);
                    $("#clickEchartData").click();
                }
            }
            //未被拖拽过两次的维度结束*****************************************************************************************************************
            //未被拖拽过两次的度量*****************************************************************************************************************
            if (element.parents("div[class*='left_duliangTable']").length != 0) {
                element.on('mousedown', function (event) {
                    zIndex++;
                    //记录元素在页面的初始位置
                    iXD = event.clientX - this.offsetLeft;
                    iYD = event.clientY - this.offsetTop + element.parents("div[class*='left_duliangTable']").scrollTop();
                    //记录元素在页面的终止位置
                    var e = event || window.event;
                    oXD = e.clientX - iXD;
                    oYD = e.clientY - iYD;
                    //给被拖拽a标签做编号标记
                    var aNumD = 0; //被拖拽a标签的编号
                    //判断是否被拖拽过
                    if(element.attr("id")){
                        aNumD=parseInt(element.attr("id").replace(/[^0-9]/ig, "")); //截取数字,获取编号;
                    }
                    else{
                        if(locals.get("dnumber")!="" || locals.get("dnumber")!=null){
                            dnumber=locals.get("dnumber");
                        }
                        dnumber++;
                        aNumD = dnumber;
                        locals.set("dnumber",aNumD);
                    }
                        element.attr("id", "aDuliang_div_" + aNumD);
                    //复制一个被拖拽元素div
                    var text = element.text();
                    element.parent("p").after($compile(
                        "<div " + "id='duliang_div_" + aNumD + "' " + "class='drag02'></div>"
                    )(scope));
                    element.parent("p").next("div[id*='duliang_div']").append($compile("<span>" + text + "</span>")(scope));
                    element.parent("p").next("div[id*='duliang_div']").css({
                        "left": oXD + "px",
                        "top": oYD + "px",
                        "z-index": zIndex,
                        "position": "absolute",
                        "cursor": "move"
                    });
                    this.setCapture && this.setCapture();
                    $document.on('mousemove', mousemove);
                    $document.on('mouseup', mouseup);
                    return false;
                });
                //元素移动方法
                function mousemove(event) {
                        var e = event || window.event;
                        var widthD = 0; //weiduDiv子元素宽度和
                        var widthS = 0; //shaixuanDiv子元素宽度和
                        zIndex++;
                        oXD = e.clientX - iXD;
                        oYD = e.clientY - iYD;
                        //维度拖拽可以到“维度”和“筛选”框
                        $("#duliangDiv").children("div").each(function (index) {
                                widthD = widthD + $(this).width() + 15;
                        });
                        $("#shaixuanDiv").children("div").each(function (index) {
                                widthS = widthS + $(this).width() + 15;
                        });
                        if (oYD >= 85 && oYD <= 110) {
                            oYD = 95;
                        }
                        if (oYD >= 120 && oYD <= 150) {
                            oYD = 130;
                        }
                        if (oYD == 95) {
                            if (oXD >= widthD + 310 && oXD <= widthD + 370) {
                                oXD = 340 + widthD;
                            }
                        }
                        if (oYD == 130) {
                            if (oXD >= widthS + 310 && oXD <= widthS + 370) {
                                oXD = 340 + widthS;
                            }
                        }
                        element.parent("p").next("div[id*='duliang_div']").css({
                            "left": oXD + "px",
                            "top": oYD + "px",
                            "z-index": zIndex,
                            "position": "absolute",
                            "cursor": "move"
                        });
                }
                //元素拖拽结束方法
                function mouseup(event) {
                    var widthD = 0; //duliangDiv子元素宽度和
                    var widthS = 0; //shaixuanDiv子元素宽度和
                    //度量拖拽目标
                    $("#duliangDiv").children("div").not("div[id*='_box']").each(function () {
                    		 widthD = widthD + $(this).width() + 15;
                    });
                    $("#shaixuanDiv").children("div").not("div[id*='_box']").each(function () {
                            widthS = widthS + $(this).width() + 15;
                    });
                    if (oYD == 95) {
                        var oldDivId = $("#left_duliangTable").children("p").next("div[id*='duliang_div']").attr("id"); //div标签的旧ID值
                        $("#left_duliangTable").children("p").next("div[id*='duliang_div']").attr("id", oldDivId + "D"); //给DIV标记新的ID值
                        $("#duliangDiv").append($compile($("#left_duliangTable").children("p").next("div[id*='duliang_div']"))(scope));
                        // .appendTo("#duliangDiv");
                        $("#duliangDiv").children("div").last().css({
                            "left": widthD + "px",
                            "top": "3px",
                            "cursor": "default"
                        });
                        $("#duliangDiv").children("div").last().prepend($compile(
                                "<a class='font_colorW fa fa-caret-down' style='margin-right:5px' table-rule=''></a>"
                            )(scope)); //加上A标签包裹
                            //将span标签放在a标签里
                            //$("#duliangDiv").children("div").last().find("a[class^='font_colorW']").append($compile($("#duliangDiv").children("div").last().find("span"))(scope));
                            //将默认度量规则显示
                            var oldText=$("#duliangDiv").children("div").last().find("span").text();
                            var altObj=eval('(' + element.attr("alt") + ')');
                            $("#duliangDiv").children("div").last().find("span").text(oldText+"（"+altObj.rules[0].ruleName+"）");
                            $("#duliangDiv").children("div").last().attr("value",altObj.rules[0].factTableRule);
                            $("#duliangDiv").children("div").last().append($compile(
                                "<a delete='' class='fa fa-close font_colorW floatR' style='line-height:20px'></a>"
                            )(scope));
                            $("#duliangDiv").children("div").last().removeClass("drag02");
                            $("#duliangDiv").children("div").last().addClass("drag03");
                            //将度量条件里的对象，传给筛选框里的条件
                            $("#duliangDiv").children("div").last().attr("alt", element.attr("alt"));
                    }else if (oYD == 130) {
                        var oldDivId = $("#left_duliangTable").children("p").next("div[id*='duliang_div']").attr("id"); //div标签的旧ID值
                        $("#left_duliangTable").children("p").next("div[id*='duliang_div']").attr("id", oldDivId + "S_"+new Date().getTime()); //给DIV标记新的ID值
                        $("#shaixuanDiv").append($compile($("#left_duliangTable").children("p").next("div[id*='duliang_div']"))(scope));
                        $("#shaixuanDiv").children("div").last().css({
                            "left": widthS + "px",
                            "top": "3px",
                            "cursor": "default"
                        });
                        $("#shaixuanDiv").children("div").last().prepend($compile(
                            "<a class='font_colorW fa fa-caret-down'  style='margin-right:5px' open=''></a>"
                        )(scope)); //加上A标签包裹
                        //将span标签放在a标签里
                        //$("#shaixuanDiv").children("div").last().find("a[class^='font_colorW']").append($compile($("#shaixuanDiv").children("div").last().find("span"))(scope));
                        //将默认度量规则显示
                        var oldText=$("#shaixuanDiv").children("div").last().find("span").text();
                        var altObj=eval('(' + element.attr("alt") + ')');
                        var shaiXuanTip = oldText+"（"+altObj.rules[0].ruleName+"）"+"【请选择筛选范围】";
                        if(shaiXuanTip.length>10){
                        	shaiXuanTip = shaiXuanTip.substring(0,10)+"...";
                        }
                        $("#shaixuanDiv").children("div").last().find("span").text(shaiXuanTip);
                        $("#shaixuanDiv").children("div").last().attr("name",altObj.rules[0].factTableRule);
                        
                        $("#shaixuanDiv").children("div").last().append($compile(
                            "<a delete='' class='fa fa-close font_colorW floatR' style='line-height:20px'></a>"
                        )(scope));
                        $("#shaixuanDiv").children("div").last().removeClass("drag02");
                        $("#shaixuanDiv").children("div").last().addClass("drag03");

                        //将维度条件里的对象，传给筛选框里的条件
                        $("#shaixuanDiv").children("div").last().attr("alt", element.attr("alt"));
                        // ngDialogTips(ngDialog,"shaixuanDiv.alt="+$("#shaixuanDiv").children("div").last().attr("alt"));
                    }
                    else {
                       element.parent("p").next("div[id*='duliang_div']").remove();
                        zIndex--;
                    }
                    this.releaseCapture && this.releaseCapture();
                    event.cancelBubble = true;
                    //清除事件
                    $document.off('mousemove', mousemove);
                    $document.off('mouseup', mouseup);
                    $("#clickEchartData").click();
                }
            }
            ////未被拖拽过两次的度量结束*****************************************************************************************************************
        }
    };
});

//打开筛选弹出框
zztzApp.directive('open', function ($http, $compile,ngDialog) {
    return {
        scope: false,
        restrict: 'A',
        link: function (scope, element, attr) {
            element.on("click", function () {
                if (element.parent("div").attr("id").indexOf("weidu_div") >= 0) {
                    scope.isWeiduShaixuan = "维度";
                }
                if (element.parent("div").attr("id").indexOf("duliang_div") >= 0) {
                    scope.isWeiduShaixuan = "度量";
                }
                //处理维度不一样的东西***********************************
                if (scope.isWeiduShaixuan == "维度") {
                    //将box页头换成对应页头
                    element.parents("#main_zztz").next("#tipBoxW").find("#tipTitleW").text(scope.isWeiduShaixuan);
                    //标注弹出框来源
                    element.parents("#main_zztz").next("#tipBoxW").attr("value", element.parent("div").attr("id"));
                    //入参需要的对象信息
                    var obj = eval('(' + element.parent("div").attr("alt") + ')');
                    //入参******
                    var weidu = {
                        "tableName": obj.tableName,
                        "tableColumn": obj.tableColumn
                    }
                    console.log("筛选值范围入参：" + JSON.stringify(weidu));
                    //获取维度列表
                    $http({
                        method: "POST",
                        url: ctx()+"/workTable/queryByCondition",
                        params:weidu
                      }).success(function (data) {
                            console.log(JSON.stringify(data));
                            scope.weiduList=data;
                            if(scope.weiduList.success==true){
                            	if(scope.weiduList.data!=null && scope.weiduList.data.resultSet.length>0){
                                    //去除旧的筛选值项
                                    if(element.parents("#main_zztz").next("#tipBoxW").find("ul").children("li")){
                                        element.parents("#main_zztz").next("#tipBoxW").find("ul").html("");
                                    }
                                    //展示新的筛选值项
                                    element.parents("#main_zztz").next("#tipBoxW").find("div[class='selected']").children("span").text(scope.weiduList.data.resultSet[0]);
                                    for(var i=0;i<scope.weiduList.data.resultSet.length;i++){
                                        element.parents("#main_zztz").next("#tipBoxW").find("ul").append($compile("<li><input type='checkbox' value='"+scope.weiduList.data.resultSet[i]+"'/><span>"+scope.weiduList.data.resultSet[i]+"</span></li>")(scope));
                                        element.parents("#main_zztz").next("#tipBoxW").find("ul").find("li:last").children("span").attr("title",scope.weiduList.data.resultSet[i]);
                                    }
                                    //判断是否之前已经选择过
                                    if(element.parent("div").attr("value")){
                                        var checkObj=element.parent("div").attr("value").split(",");
                                    element.parents("#main_zztz").next("#tipBoxW").find("ul").children("li").each(function(){
                                        var thisValue=$(this).children("input[type='checkbox']").attr("value");
                                        for(var i=0;i<checkObj.length;i++){
                                            if(thisValue==checkObj[i]){
                                                $(this).children("input[type='checkbox']").prop("checked", true);
                                            }
                                        }
                                    })
                                    }
                                }
                                else{
                                    ngDialogTips(ngDialog,"该维度列没有值!");
                                }
                            }
                            else{
                            	ngDialogTips(ngDialog,"获取数据异常");
                            }
                        }).error(function(){
                            ngDialogTips(ngDialog,"获取数据失败");
                        });
                    element.parents("#main_zztz").nextAll("#tipBoxD").addClass("displayN");
                    element.parents("#main_zztz").nextAll("#tipBoxW").removeClass("displayN");
//                    //维度一级弹出框
//                    //判断是否第一次打开
//               	if(element.parent("div").next("div[class*='drag04Box']").attr('class')){
//               		if(element.parent("div").next("div[class*='drag04Box']").css("display")=="none"){
//               			element.parent("div").removeClass("drag03");
//                       	element.parent("div").addClass("drag04");
//                       	element.attr("class","font_colorW fa fa-caret-up");
//               			element.parent("div").next("div[class*='drag04Box']").slideDown(100);
//               		}
//               		else{
//               			element.parent("div").next("div[class*='drag04Box']").slideUp(100);
//                       	element.attr("class","font_colorW fa fa-caret-down");
//                       	element.parent("div").removeClass("drag04");
//                       	element.parent("div").addClass("drag03");
//               		}
//               	}
//               	else{
//                   var number=element.parent("div").attr("id").replace(/[^0-9]/ig, "");
//               	var widthDiv=element.parent("div").width();
//               	var leftDiv=element.parent("div").css("left");
//               	element.parent("div").after($compile("<div id='duliang_div_"+number+"S_box' class='drag04Box' style='width:"+widthDiv+"px;left:"+leftDiv+";display:none;'></div>")(scope));
//                   element.parent("div").next("div[id*='_box']").append($compile("<p><a weidu-tip-c=''>维度值范围</a></p>")(scope));
//               	element.parent("div").removeClass("drag03");
//               	element.parent("div").addClass("drag04");
//               	element.attr("class","font_colorW fa fa-caret-up");
//               	element.parent("div").next("div[class*='drag04Box']").slideDown(100);
//               	}
                }
                //处理度量不一样的东西***********************************
                if (scope.isWeiduShaixuan == "度量") {
                	//度量二级弹出框准备
                	//清空旧数据
                	element.parents("#main_zztz").nextAll("#tipBoxD").find("#tipValueD2").find("select").val("");
                	element.parents("#main_zztz").nextAll("#tipBoxD").find("#tipValueD2").children("input").each(function(){
                		$(this).val("");
                	});
                        //将box页头换成对应页头
                        element.parents("#main_zztz").nextAll("#tipBoxD").find("#tipTitleD").text(scope.isWeiduShaixuan);
                        //标注弹出框来源
                        element.parents("#main_zztz").nextAll("#tipBoxD").attr("value", element.parent("div").attr("id"));
                        //处理样式不一样的样式
                        //看之前是否输入过度量值
                        if (element.parent("div").attr("value")) {
                            var duliangObj = element.parent("div").attr("value").split(",");
                            //起始值
                            if (duliangObj[0] == "startNull") {
                                element.parents("#main_zztz").nextAll("#tipBoxD").find("input[id='tipStartInput']").val("");
                            }
                            else {
                                element.parents("#main_zztz").nextAll("#tipBoxD").find("input[id='tipStartInput']").val(duliangObj[0]);
                            }
                            //终止值
                            if (duliangObj[1] == "endNull") {
                                element.parents("#main_zztz").nextAll("#tipBoxD").find("input[id='tipEndInput']").val("");
                            }
                            else {
                                element.parents("#main_zztz").nextAll("#tipBoxD").find("input[id='tipEndInput']").val(duliangObj[1]);
                            }
                        }
                        //查找计数规则
                        var rulesObj=eval("(" + element.parent("div").attr("alt") + ")");
                    	var duliang_rules=rulesObj.rules;
                    	var obj=document.getElementById('tipSelect'); 
                		obj.options.length=0;
                    	for(var i=0;i<rulesObj.rules.length;i++){//每次拼接度量规则前先删除
                    		$("#tipSelect").append($compile("<option value='"+rulesObj.rules[i].factTableRule+"'>"+rulesObj.rules[i].ruleName+"</option>")(scope));
                    	}
                        if (element.parent("div").attr("name")) {
                        	element.parents("#main_zztz").nextAll("#tipBoxD").find("#tipSelect").val(element.parent("div").attr("name"));
                        }
                        else{
                        	element.parents("#main_zztz").nextAll("#tipBoxD").find("#tipSelect").val("-1");
                        }
                        element.parents("#main_zztz").nextAll("#tipBoxD").removeClass("displayN");
                        element.parents("#main_zztz").nextAll("#tipBoxW").addClass("displayN");
//                        //度量一级弹出框
//                         //判断是否第一次打开
//                    	if(element.parent("div").next("div[class*='drag04Box']").attr('class')){
//                    		if(element.parent("div").next("div[class*='drag04Box']").css("display")=="none"){
//                    			element.parent("div").removeClass("drag03");
//                            	element.parent("div").addClass("drag04");
//                            	element.attr("class","font_colorW fa fa-caret-up");
//                    			element.parent("div").next("div[class*='drag04Box']").slideDown(100);
//                    		}
//                    		else{
//                    			element.parent("div").next("div[id$='_box']").next("div[id$='_box_2']").remove();
//                    			element.parent("div").next("div[class*='drag04Box']").slideUp(100);
//                            	element.attr("class","font_colorW fa fa-caret-down");
//                            	element.parent("div").removeClass("drag04");
//                            	element.parent("div").addClass("drag03");
//                    		}
//                    	}
//                    	else{
//                        var number=element.parent("div").attr("id").replace(/[^0-9]/ig, "");
//                    	var widthDiv=element.parent("div").width();
//                    	var leftDiv=element.parent("div").css("left");
//                    	element.parent("div").after($compile("<div id='duliang_div_"+number+"S_box' class='drag04Box' style='width:"+widthDiv+"px;left:"+leftDiv+";display:none;'></div>")(scope));
//                        element.parent("div").next("div[id*='_box']").append($compile("<p><a duliang-tip-h=''>度量规则   <i class='fa fa-caret-right'></i></a></p>")(scope));
//                        element.parent("div").next("div[id*='_box']").append($compile("<p><a duliang-tip-c=''>度量范围</a></p>")(scope));
//                    	element.parent("div").removeClass("drag03");
//                    	element.parent("div").addClass("drag04");
//                    	element.attr("class","font_colorW fa fa-caret-up");
//                    	element.parent("div").next("div[class*='drag04Box']").slideDown(100);
//                    	}
                }
            });
        }
    }
});

//维度筛选框范围弹出
zztzApp.directive('weiduTipC', function ($compile, $http) {
    return {
        scope: false,
        restrict: 'A',
        link: function (scope, element, attr) {
        	element.on("click", function () {
        		//显示维度筛选弹出框
                element.parents("#main_zztz").next("#tipBoxD").addClass("displayN");
                element.parents("#main_zztz").nextAll("#tipBoxW").removeClass("displayN");
        	});
        }
    }
});

//度量二级筛选框范围弹出
zztzApp.directive('duliangTipC', function ($compile, $http) {
    return {
        scope: false,
        restrict: 'A',
        link: function (scope, element, attr) {
        	element.on("click", function () {
        		//显示度量筛选弹出框
                element.parents("#main_zztz").next("#tipBoxW").addClass("displayN");
                element.parents("#main_zztz").nextAll("#tipBoxD").removeClass("displayN");
        	});
        }
    }
});

//度量二级筛选框计数方法弹出
zztzApp.directive('duliangTipH', function ($compile, $http,ngDialog) {
    return {
        scope: false,
        restrict: 'A',
        link: function (scope, element, attr) {
        	element.parents("p").hover(function () {
        		//先清空
        		$(this).parent("div[id*='_box']").next("div[id*='_box_2']").remove();
        		//然后重来
        		var id=$(this).parent("div[id*='_box']").attr("id");
        		var altObj=eval("(" + $(this).parent("div[id*='_box']").prev("div[id*='duliang_div']").attr("alt") + ")");
        		var widthS=0;
        		var indexO=0;
        		$("#shaixuanDiv").children("div").not("div[id*='_box']").each(function (index) {
                    if($(this).attr("id")==id.replace("_box","")){
                    	indexO=index;
                    }
                });
        		 $("#shaixuanDiv").children("div").not("div[id*='_box']").each(function (index) {
        			 if(index<=indexO){
        				 if(index==0){
        					 widthS = widthS + $(this).width()-1;
        				 }
        				 else{
            				 widthS = widthS + $(this).width()+15;
        				 }
        			 }
                 });
        		 $(this).parent("div[id*='_box']").after($compile("<div id='"+id+"_2' class='drag04Box' style='width: 60px;min-height:50px; top:38px;left: "+(widthS+12)+"px;border:1px solid #e2e2e3;'></div>")(scope));
        		for(var i=0;i<altObj.rules.length;i++){
        			$(this).parent("div[id*='_box']").next("div[id*='_box_2']").append($compile("<p><a duliang-tip-h-c='' value='"+altObj.rules[i].factTableRule+"'>"+altObj.rules[i].ruleName+"</a></p>")(scope));
        		}
        		$(this).stop();
        	},function () {
        		//跑到了下一级框里
        		$(this).parent("div[id*='_box']").next("div[id*='_box_2']").hover(function(){
        			$(this).stop();
        		},
        		function(){
        			$(this).remove();
        		});
        		//跑到了兄弟p里
        		$(this).next("p").hover(function(){
        			$(this).parent("div[id*='_box']").next("div[id*='_box_2']").remove();
        		},
        		function(){
        		});
        		//跑到了上一个div里
        		$(this).parent("div[id*='_box']").prev("div[id*='duliang_div']").hover(function(){
        			$(this).next("div[id*='_box']").next("div[id*='_box_2']").remove();
        		},
        		function(){
        		});
        	});
        }
    }
});

//度量二级筛选框计数方法点击
zztzApp.directive('duliangTipHC', function ($compile, $http) {
    return {
        scope: false,
        restrict: 'A',
        link: function (scope, element, attr) {
        	var isInBox2=false;
        	element.on("click",function(){
        		var value=element.attr("value");
        		var tableText=element.text();
        		var altObj=eval('(' + element.parents("div[id$='_box_2']").prev("div[id$='_box']").prev("div[id^='duliang_div']").attr("alt") + ')');
        		element.parents("div[id$='_box_2']").prev("div[id$='_box']").prev("div[id^='duliang_div']").attr("name",value);
            	element.parents("div[id$='_box_2']").prev("div[id$='_box']").prev("div[id^='duliang_div']").find("span").text(altObj.tableColumnCn+"（"+tableText+"）");
//            	element.parents("div[id$='_box_2']").remove();
            	element.parents("div[id*='_box_2']").prev("div[id$='_box']").prev("div[id^='duliang_div']").find("a[class*='fa-caret-up']").attr("class","font_colorW fa fa-caret-down");
            	element.parents("div[id$='_box_2']").prev("div[id$='_box']").prev("div[id^='duliang_div']").addClass("drag03");
            	element.parents("div[id$='_box_2']").prev("div[id$='_box']").prev("div[id^='duliang_div']").removeClass("drag04");
            	element.parents("div[id$='_box_2']").prev("div[id$='_box']").css("display","none");
        		element.parents("div[id$='_box_2']").remove();
                $("#clickEchartData").click();
        	})
        }
    }
});

//关闭筛选弹出框
zztzApp.directive('close', function ($http,$compile) {
    return {
        scope: false,
        restrict: 'A',
        link: function (scope, element, attr) {
            element.on("click", function () {
                //弹出框来源
                var tipID = element.parents("div[id*='tipBox']").attr("value");
                console.log("tipID="+tipID);
                //按钮
                //维度确定
                //清空旧的筛选值
                element.parents("div[id*='tipBox']").prevAll("#main_zztz").children("#tab").find("#shaixuanDiv").children("div[id='" + tipID + "']").removeAttr("value");
                //载入新筛选值
                if (element.parent("div[id*='tipMain']").attr("class") == "weiduTip") {
                    element.prevAll("div[id*='tipValue']").children("ul").find("input[type='checkbox']").each(function () {
                        if ($(this).prop("checked")) {
                            if (element.parents("div[id*='tipBox']").prevAll("div[id='main_zztz']").children("div[id='tab']").find("#shaixuanDiv").children("div[id='" + tipID + "']").attr("value")) {
                                var oldValue = element.parents("div[id*='tipBox']").prevAll("div[id='main_zztz']").children("div[id='tab']").find("#shaixuanDiv").children("div[id='" + tipID + "']").attr("value");
                                element.parents("div[id*='tipBox']").prevAll("div[id='main_zztz']").children("div[id='tab']").find("#shaixuanDiv").children("div[id='" + tipID + "']").attr("value", oldValue + "," + $(this).attr("value"));
                            }
                            else {
                                element.parents("div[id*='tipBox']").prevAll("div[id='main_zztz']").children("div[id='tab']").find("#shaixuanDiv").children("div[id='" + tipID + "']").attr("value", $(this).attr("value"));
                            }
                        }
                    });
                    var oldText= $("#"+tipID).find("span").text();
                    var oldTextNew = oldText.substring(0, oldText.indexOf('【'));
                    if(oldTextNew==""||oldTextNew==undefined){
                    	oldTextNew = oldText;
                    }
                    var newWeiDuSize = $("#"+tipID).attr("value");
                    if(newWeiDuSize==""||newWeiDuSize==undefined){
                    	newWeiDuSize = "请选择筛选范围";
                    }
                    var dimensionSize = oldTextNew+"【"+newWeiDuSize+"】";
                    if(dimensionSize.length>10){
                    	dimensionSize = dimensionSize.substring(0,10)+"...";
                    }
                    if(newWeiDuSize!=undefined){
                        $("#"+tipID).find("span").text(dimensionSize);//替换原来的度量规则
                    }
                }
                //度量确定
                if(element.parent("div[id*='tipMain']").attr("class")=="duliangTip"){
                    //起始值范围
                    var startValue=element.prevAll("div[id*='tipValue']").children("input[id='tipStartInput']").val();
                    //结束值范围
                    var endValue=element.prevAll("div[id*='tipValue']").children("input[id='tipEndInput']").val();
                    var newDuLiangRuleName = $("#tipSelect").find("option:selected").text();//新的度量规则名称
                    var newDuLiangRule = $("#tipSelect").find("option:selected").val();//新的度量规则
                    
                    var oldText=$("#shaixuanDiv").children("div[id='"+tipID+"']").find("span").text();
                    var oldTextNew = oldText.substring(0, oldText.indexOf('（'));
                    $("#shaixuanDiv").children("div[id='"+tipID+"']").attr("name",newDuLiangRule);
                    $("#shaixuanDiv").children("div[id='"+tipID+"']").find("span").text(oldTextNew+"（"+newDuLiangRuleName+"）");//替换原来的度量规则
                   //塞度量范围值
                     //验证度量范围接口*****************************************
                    if(startValue){
                        element.parents("div[id*='tipBox']").prevAll("div[id='main_zztz']").children("div[id='tab']").find("#shaixuanDiv").children("div[id='"+tipID+"']").attr("value",startValue);
                    }
                    if(endValue){
                        if(startValue){
                            var oldValue=element.parents("div[id*='tipBox']").prevAll("div[id='main_zztz']").children("div[id='tab']").find("#shaixuanDiv").children("div[id='"+tipID+"']").attr("value");
                            element.parents("div[id*='tipBox']").prevAll("div[id='main_zztz']").children("div[id='tab']").find("#shaixuanDiv").children("div[id='"+tipID+"']").attr("value",oldValue+","+endValue);
                        }
                        else{
                            element.parents("div[id*='tipBox']").prevAll("div[id='main_zztz']").children("div[id='tab']").find("#shaixuanDiv").children("div[id='"+tipID+"']").attr("value","startNull,"+endValue);
                        }
                    }
                    else{
                        if(startValue){
                            var oldValue=element.parents("div[id*='tipBox']").prevAll("div[id='main_zztz']").children("div[id='tab']").find("#shaixuanDiv").children("div[id='"+tipID+"']").attr("value");
                            element.parents("div[id*='tipBox']").prevAll("div[id='main_zztz']").children("div[id='tab']").find("#shaixuanDiv").children("div[id='"+tipID+"']").attr("value",oldValue+",endNull");
                        }
                        else{
                            element.parents("div[id*='tipBox']").prevAll("div[id='main_zztz']").children("div[id='tab']").find("#shaixuanDiv").children("div[id='"+tipID+"']").removeAttr("value");
                        }
                    }
                    debugger;
                    //获取度量的度量范围加到显示后面
                    var oldText=$("#shaixuanDiv").children("div[id='"+tipID+"']").find("span").text();
                    var oldTextNew = oldText.substring(0, oldText.indexOf('【'));
                    if(oldTextNew==""||oldTextNew==undefined){
                    	oldTextNew = oldText;
                    }
                    var newDuLiangSize = $("#"+tipID).attr("value");
                    if(newDuLiangSize==""||newDuLiangSize==undefined){
                    	newDuLiangSize = "请选择筛选范围";
                    }
                    var measureSize = oldTextNew+"【"+newDuLiangSize+"】";
                    if(measureSize.length>10){
                    	measureSize = measureSize.substring(0,10)+"...";
                    }
                    if(newDuLiangSize!=undefined){
                        $("#shaixuanDiv").children("div[id='"+tipID+"']").find("span").text(measureSize);//替换原来的度量规则
                    }
                }
              //度量弹出框消失
//                var boxId=element.parents("div[id*='tipBox']").attr("value");
//    			element.parents("div[id*='tipBox']").prevAll("div[id='main_zztz']").find("#shaixuanDiv").children("#"+boxId).next("div[class*='drag04Box']").slideUp(100);
//            	element.parents("div[id*='tipBox']").prevAll("div[id='main_zztz']").find("#shaixuanDiv").children("#"+boxId).removeClass("drag04");
//            	element.parents("div[id*='tipBox']").prevAll("div[id='main_zztz']").find("#shaixuanDiv").children("#"+boxId).addClass("drag03");
//            	element.parents("div[id*='tipBox']").prevAll("div[id='main_zztz']").find("#shaixuanDiv").children("#"+boxId).find("a[class*='fa-caret-up']").attr("class","font_colorW fa fa-caret-down");
                element.parents("div[id*='tipBox']").addClass("displayN");
                $("#clickEchartData").click();
            });
        }
    }
});

//写jQuery删除筛选框条件指令
zztzApp.directive('delete', function () {
    return {
        scope: false,
        restrict: 'A',
        link: function (scope, element, attr) {
            element.on("click", function () {
                //删除原左侧列表的A标签的id标记和被拖拽标记
                var idO = $(this).parent("div").attr("id").split("_");
                var numberO = parseInt(idO[2].replace(/[^0-9]/ig, "")); //截取数字,获取编号;
                // var indexTAB = getIndexTAB(); //被选中数据分析数字编号
                //		ngDialogTips(ngDialog,"indexTAB="+indexTAB);
                var str = idO[2].replace(/\d+/g, ""); //查看维度进入了哪个条件框，去除数字之后就是标记结果
                if (idO[0] == "weidu") {
                    //要判断是否有多个同编号维度条件
                    var thisWNumber=0;
                    element.parents("#weiduDiv").children("div").each(function(){
                        var thisIdO=$(this).attr("id").split("_");
                        if(parseInt(thisIdO[2].replace(/[^0-9]/ig, ""))==numberO){
                            thisWNumber++;
                        }
                    });
                    if(thisWNumber<2){
                        $("#left_weiduTable").find("a[id='aWeidu_div_" + numberO + "']").removeAttr("id");
                    }
                }
                if (idO[0] == "duliang") {
                    $("#left_duliangTable").find("a[id='aDuliang_div_" + numberO + "']").removeAttr("id");
                }
                //删除度量的规则框
                if($(this).parent("div").next("div[class*='drag04Box']").attr("class")){
                	$(this).parent("div").next("div[class*='drag04Box']").remove();
                }
                //移位置
                var remD = $(this).parent("div").width();
                var nextAllD = $(this).parent("div").nextAll("div").length;
                if (nextAllD > 0) {
                	var nextLeftId_00=[];
                	var nextLeftNum_00=-1;
                	var isnextLeftMove_00=false;
                    $(this).parent("div").nextAll("div").not("div[id*='_box']").each(function(index0){
                    	if($(this).css("left")=="0px"){
                    		nextLeftId_00.push(index0);
                    	}
                    });
                    var oldLeftD, newLeftD;
                    $(this).parent("div").nextAll("div").not("div[id*='_box']").each(function (index) {
                    	if(nextLeftId_00.length!=0){
                    		for(var i=0;i<nextLeftId_00.length;i++){
                    			if(index==nextLeftId_00[i]){
                    				nextLeftNum_00=index;
                    				var thisPrevWidth=0;
                    				$(this).prevAll("div").not("div[id*='_box']").each(function(){
                    					thisPrevWidth=thisPrevWidth+$(this).width();
                    				});
                    				if(parseInt(thisPrevWidth)>680){
                    					isnextLeftMove_00=false;
                    				}
                    				else{
                    					$(this).css({"left":(thisPrevWidth)+"px","top":(parseInt($(this).css("top").replace(/[^0-9]/ig, ""))-27)+"px"});
                    					isnextLeftMove_00=true;
                    				}
                    			}
                    			else{
                    				if(nextLeftNum_00==-1){
                    					oldLeftD = parseInt($(this).css("left")); //把带有“px”的字符串转换成数值
                                        newLeftD = oldLeftD - remD - 15;
                                        $(this).css("left", newLeftD + "px");
                    				}
                    				else{
                    					if(isnextLeftMove_00==true){
                        					var thisWidth_00=0;
                        					var isfindThisWidth_00=false;
                        					element.parent("div").nextAll("div").not("div[id*='_box']").each(function(index0){
                        						if(isfindThisWidth_00==false){
                        							if(index0==nextLeftNum_00){
                        								thisWidth_00=$(this).width();
                                						isfindThisWidth_00=true;
                        							}
                        						}
                                            });
                        					oldLeftD = parseInt($(this).css("left")); //把带有“px”的字符串转换成数值
                                            newLeftD = oldLeftD - thisWidth_00 - 15;
                                            $(this).css("left", newLeftD + "px");
                    					}
                    				}
                    			}
                    		}
                    	}
                    	else{
                    		oldLeftD = parseInt($(this).css("left")); //把带有“px”的字符串转换成数值
                            newLeftD = oldLeftD - remD - 15;
                            $(this).css("left", newLeftD + "px");
                    	}
                    });
                }
                $(this).parent("div").remove();
                //		alert($(this).parent("div[class='drag03']").next("span:hidden").attr("id"));
                $("#clickEchartData").click();
            })
        }
    }
});

//查询框onblur方法指令
zztzApp.directive('blur', function (isSearch,locals) {
    return {
        redirect: 'A',
        scope: false,
        link: function (scope, element, attr) {
            element.on('blur', function () {
                if ($(this).val() == "") {
                    $(this).val("请输入数据模型名称");
                    $(this).removeClass("inputFull");
                    $(this).addClass("inputNull");
                }
                if(scope.weiDu!=null && scope.duLiang!=null){
                	if(!locals.getObject("isSearch").isSearch || locals.getObject("isSearch").isSearch==false){
                		//搜索列表
             		      angular.element("#left_modelTable").animate({height:"20px"},250);
             		   //扩展维度和度量框
              		     angular.element("#left_weiduTable").prev("div[class='left_tab']").find("span").removeAttr("style");
              		     angular.element("#left_weiduTable").removeAttr("style");
              		    angular.element("#left_duliangTable").prev("div[class='left_tab']").find("span").removeAttr("style");
              		    angular.element("#left_duliangTable").removeAttr("style");
                	}
                }
            });
            element.on('focus', function () {
                if ($(this).val() == "请输入数据模型名称") {
                    $(this).val("");
                    $(this).removeClass("inputNull");
                    $(this).addClass("inputFull");
                }
              //搜索列表
     		      angular.element("#left_modelTable").animate({height:"200px"},250);
     		  //隐藏维度和度量框
     		     if(scope.weiDu!=null && scope.duLiang!=null){
     		    	angular.element("#left_weiduTable").css({"height":"0px","padding":"0px"});
     		    	angular.element("#left_duliangTable").css({"height":"0px","padding":"0px"});
     		     }
     		     angular.element("#left_weiduTable").prev("div[class='left_tab']").find("span").css("color","#cccccc");
     		    angular.element("#left_duliangTable").prev("div[class='left_tab']").find("span").css("color","#cccccc");
            });
        }
    }
})
function iconSetting(){
	var wLength = $("#weiduDiv").children("div").length;
	var dLength = $("#duliangDiv").children("div").length;
	//两维度一度量
    if (wLength == 2 && dLength == 1) {
    	$(".tool_panel>img[value*='mixTwoDim']").attr("src","img/chartTypeIcon/mixTwoDim.png").attr("getecharts","");
    	$(".tool_panel>img[value*='mixTowDimLine']").attr("src","img/chartTypeIcon/triangle_table.png").attr("getecharts","");
    	$(".tool_panel>img[value*='mixTwoDim']").attr("src","img/chartTypeIcon/mixTwoDim.png").css("cursor","pointer");
    	$(".tool_panel>img[value*='mixTowDimLine']").attr("src","img/chartTypeIcon/triangle_table.png").css("cursor","pointer");
    }else{
    	$(".tool_panel>img[value*='mixTwoDim']").attr("src","img/chartTypeIcon/mixTwoDim_grey.png").removeAttr("getecharts");
    	$(".tool_panel>img[value*='mixTowDimLine']").attr("src","img/chartTypeIcon/triangle_table_grey.png").removeAttr("getecharts");
    }
    //一维度一度量
    if (wLength == 1 && dLength == 1) {
    	$(".tool_panel>img[value*='step']").attr("src","img/chartTypeIcon/from_step.png").attr("getecharts","");
		$(".tool_panel>img[value*='step']").attr("src","img/chartTypeIcon/from_step.png").css("cursor","pointer");
		$(".tool_panel>img[value*='steptext']").attr("src","img/chartTypeIcon/from_step.png").attr("getecharts","");
		$(".tool_panel>img[value*='steptext']").attr("src","img/chartTypeIcon/from_step.png").css("cursor","pointer");
    	$(".tool_panel>img[value*='gauge']").attr("src","img/chartTypeIcon/tip_table.png").attr("getecharts","");
    	$(".tool_panel>img[value*='pie']").attr("src","img/chartTypeIcon/pie-table.png").attr("getecharts","");
    	$(".tool_panel>img[value*='pieNull']").attr("src","img/chartTypeIcon/pieNull.png").attr("getecharts","");
    	$(".tool_panel>img[value*='horizontal']").attr("src","img/chartTypeIcon/horizontal.png").attr("getecharts","");
    	$(".tool_panel>img[value*='gauge']").attr("src","img/chartTypeIcon/tip_table.png").css("cursor","pointer");
    	$(".tool_panel>img[value*='pie']").attr("src","img/chartTypeIcon/pie-table.png").css("cursor","pointer");
    	$(".tool_panel>img[value*='pieNull']").attr("src","img/chartTypeIcon/pieNull.png").css("cursor","pointer");
    	$(".tool_panel>img[value*='horizontal']").attr("src","img/chartTypeIcon/horizontal.png").css("cursor","pointer");
    }else{
		$(".tool_panel>img[value*='step']").attr("src","img/chartTypeIcon/from_step_grey.png").removeAttr("getecharts");
		$(".tool_panel>img[value*='steptext']").attr("src","img/chartTypeIcon/from_step_grey.png").removeAttr("getecharts");
    	$(".tool_panel>img[value*='gauge']").attr("src","img/chartTypeIcon/tip_table_grey.png").removeAttr("getecharts");
    	$(".tool_panel>img[value*='pie']").attr("src","img/chartTypeIcon/pie-table_grey.png").removeAttr("getecharts");
    	$(".tool_panel>img[value*='pieNull']").attr("src","img/chartTypeIcon/pieNull_grey.png").removeAttr("getecharts");
    	$(".tool_panel>img[value*='horizontal']").attr("src","img/chartTypeIcon/horizontal_grey.png").removeAttr("getecharts");
    }
    //两度量一维度
    if (wLength == 1 && dLength == 2) {
    	$(".tool_panel>img[value*='mixTwoMeasure']").attr("src","img/chartTypeIcon/mixTwoMeasure.png").attr("getecharts","");
    	$(".tool_panel>img[value*='mixTwoMeasureTwoY']").attr("src","img/chartTypeIcon/crossradio_table.png").attr("getecharts","");
    	$(".tool_panel>img[value*='mixTwoMeasure']").attr("src","img/chartTypeIcon/mixTwoMeasure.png").css("cursor","pointer");
    	$(".tool_panel>img[value*='mixTwoMeasureTwoY']").attr("src","img/chartTypeIcon/crossradio_table.png").css("cursor","pointer");
    	$(".tool_panel>img[value*='float']").attr("src","img/chartTypeIcon/mixTwoDim.png").attr("getecharts","");
    	$(".tool_panel>img[value*='quadrant']").attr("src","img/chartTypeIcon/mixTwoDim.png").attr("getecharts","");
    	$(".tool_panel>img[value*='float']").attr("src","img/chartTypeIcon/mixTwoDim.png").css("cursor","pointer");
    	$(".tool_panel>img[value*='quadrant']").attr("src","img/chartTypeIcon/mixTwoDim.png").css("cursor","pointer");
    }else{
    	$(".tool_panel>img[value*='mixTwoMeasure']").attr("src","img/chartTypeIcon/mixTwoMeasure_grey.png").removeAttr("getecharts");
    	$(".tool_panel>img[value*='mixTwoMeasureTwoY']").attr("src","img/chartTypeIcon/crossradio_table_grey.png").removeAttr("getecharts");
    	$(".tool_panel>img[value*='float']").attr("src","img/chartTypeIcon/mixTwoDim_grey.png").removeAttr("getecharts");
    	$(".tool_panel>img[value*='quadrant']").attr("src","img/chartTypeIcon/mixTwoDim_grey.png").removeAttr("getecharts");
    }
}
//获取echarts数据指令
zztzApp.directive('getecharts', function ($compile, $http,ngDialog) {
    return {
        scope: false,
        restrict: 'A',
        link: function (scope, element, attr) {
            element.on("click", function () {
                //data_type的值有：line,bar,pie,gauge（仪表盘图）,radar(雷达图),funnel(漏斗图),scatter(散点图),map
                //前台传的维度和度量对象参数
                var obj = new Object();
                var dimTable = new Array();//维度列
                var measures = new Array();//度量列
                var filters = new Array();//筛选列
                getDimension(dimTable);//获取度量
                getMeasures(measures);//获取维度
                getFilters(filters);//筛选框入参对象
                // ngDialogTips(ngDialog,"dimTable.length="+dimTable.length+",measures.length="+measures.length);
                iconSetting();//图标控制
                //前台传给后台的入参对象
                if ($("#weiduDiv").children("div").length != 0 && $("#duliangDiv").children("div").length != 0) {
                    //data_type的值有：line,bar,pie,gauge（仪表盘图）,radar(雷达图),funnel(漏斗图),scatter(散点图),map
                    if(element.attr("value")){
                    	echartsDataType=element.attr("value");
                    }else{ 
                    	if(!echartsDataType){
                    		echartsDataType="table";
                    	}
                    }
                    debugger;
                	if( echartsDataType=="line"
                		||echartsDataType=="bar"||echartsDataType=="scatter"
                		||echartsDataType=="horizontal"||echartsDataType=="mixTwoDim"
                		||echartsDataType=="mixTwoMeasure"||echartsDataType=="mixTowDimLine"
                			||echartsDataType=="mixTwoMeasureTwoY"||echartsDataType=="table"){
                		$("#colorSet").removeClass("display-control");
                	}else{
                		$("#colorSet").addClass("display-control");
                	}
                	$("#colorSelected").addClass("display-control");
                	$("#themeColorSelected").addClass("display-control");
                    //给dataType塞值
	            	document.getElementById('workTableNameInput').setAttribute("name",echartsDataType);
	            	var workTableCode =$('#workTableCodeInput').text();
                    obj = {
                        "workTableId":"",
                        "workTableName":$('#workTableNameInput').text(),
                        "workTableCode":workTableCode.substr(1,workTableCode.length-2),
                        "dimTable": dimTable,
                        "measures": measures,
                        "filters": filters,
                        "dataType":echartsDataType,
                        "cubeId": $("#left_modelTable").find("input").attr("name")//在页面将cubeID放到name属性里--2016-08-30
                    };
                    if((echartsDataType=="step"||echartsDataType=="steptext")&&measures.length==1){
                    	getStepChartData($http,obj,$compile,scope,ngDialog,measures,null);//同比环形图
                    }else if(echartsDataType=="gauge"&&dimTable.length==1&&measures.length==1){
                    	getGaugeChartData($http,obj,$compile,scope,ngDialog);//仪表盘
                    }else if(echartsDataType=="mixTwoDim"&&dimTable.length==2&&measures.length==1){//两维一度量 mixTwoMeasure(混合图2维1度量类型两个曲线)，mixTwoMeasure(混合图1维2度量类型一个折线图一个柱状图)
                    	for(var t =0;t<measures.length;t++){
                			measures[t].chartType="line";//都是曲线图
                    	}
                    	obj.measures=measures;
                        console.log("传给后台的obj=" + JSON.stringify(obj));
                    	getMixTypeChart($http,obj,$compile,scope,echartsDataType,ngDialog);
                    }else if(echartsDataType=="mixTowDimLine"&&dimTable.length==2&&measures.length==1){//两维一度量 mixTowDimLine 曲线面积图
                    	for(var t =0;t<measures.length;t++){
                			measures[t].chartType="line";//都是曲线图
                    	}
                    	obj.measures=measures;
                        console.log("传给后台的obj=" + JSON.stringify(obj));
                    	getMixTypeChart($http,obj,$compile,scope,echartsDataType,ngDialog);
                    }else if(echartsDataType=="horizontal"&&dimTable.length==1&&measures.length==1){//先试试两维一度量的横向的
                    	for(var t =0;t<measures.length;t++){
                			measures[t].chartType="bar";//都是曲线图
                    	}
                    	obj.measures=measures;
                        console.log("传给后台的obj=" + JSON.stringify(obj));
                    	getHorizontalChart($http,obj,$compile,scope,ngDialog);
                    }else if(echartsDataType=="mixTwoMeasure"&&dimTable.length==1&&measures.length==2){//1维2度量
                    	obj.measures=measures;
                        console.log("传给后台的obj=" + JSON.stringify(obj));
                    	getMixTypeChart($http,obj,$compile,scope,echartsDataType,ngDialog);
                    }else if(echartsDataType=="mixTwoMeasureTwoY"&&dimTable.length==1&&measures.length==2){//1维2度量 两个Y轴
                    	obj.measures=measures;
                        console.log("传给后台的obj=" + JSON.stringify(obj));
                    	getMixTypeChart($http,obj,$compile,scope,echartsDataType,ngDialog);
                    }else if((echartsDataType=="pie"||echartsDataType=="pieNull")&&dimTable.length==1&&measures.length==1){//1维1度量 饼形图
                    	for(var t =0;t<measures.length;t++){
                    		measures[t].chartType="pie";
                    	}
                    	obj.measures=measures;
                    	getMixTypeChart($http,obj,$compile,scope,echartsDataType,ngDialog);
                    }else if(echartsDataType=="float"&&dimTable.length==1&&measures.length==2){//两维一度量 mixTowDimLine 曲线面积图
                    	obj.measures=measures; 
                        console.log("传给后台的obj=" + JSON.stringify(obj));
                    	getMixTypeChart($http,obj,$compile,scope,echartsDataType,ngDialog);
                    }else if(echartsDataType=="quadrant"&&dimTable.length==1&&measures.length==2){//两维一度量 mixTowDimLine 曲线面积图
                    	obj.measures=measures;
                        console.log("传给后台的obj=" + JSON.stringify(obj));
                    	getMixTypeChart($http,obj,$compile,scope,echartsDataType,ngDialog);
                    }
                    else{
                        console.log("传给后台的obj=" + JSON.stringify(obj));
                        //后台返回的json数据
                        if(echartsDataType=="mixTwoDim"||echartsDataType=="mixTwoMeasure"||echartsDataType=="pie"||echartsDataType=="pieNull"||echartsDataType=="mixTowDimLine"||echartsDataType=="mixTwoMeasureTwoY"||echartsDataType=="horizontal"||echartsDataType=="gauge"||echartsDataType=="step"||echartsDataType=="steptext"){//如果是混合图当前不符合的情况恢复默认样式
//                        	obj.dataType="table";
//                        	echartsDataType = "table";
                        	return false;
                        }
                        getChartData($http,obj,$compile,scope,ngDialog);
                    }
                }else{
//                  ngDialogTips(ngDialog,"请拖拽度量或维度条件！");
                    console.log("请拖拽度量或维度条件！");
                    return false;
                }
            })
        }
    }
});

function getMixTypeChart($http,obj,$compile,scope,echartsDataType,ngDialog){
	  if(echartsDataType=="mixTwoMeasure"||echartsDataType=="mixTwoMeasureTwoY"){
			for(var t =0;t<obj.measures.length;t++){//默认是第一个传过来的图形类型
				if(t==0){//第一个度量是曲线，第二个是柱状图
					obj.measures[t].chartType="line";
				}else{
					obj.measures[t].chartType="bar";
				}
			}
		}
	 $http({
         method: "POST",
         url: ctx()+"/workTable/getKylinByCondition",
         data:JSON.stringify(obj)
       }).success(function (freetrial) {
         var echartsData = freetrial;
         //清除div内的元素
         $("#echartsDiv").empty();
         console.log("返回对象："+JSON.stringify(echartsData));
         if (echartsData.success == true) {
           	var id= "echartsDiv";
           	if(echartsDataType=="pie"||echartsDataType=="pieNull"){
 				getPieChartFromCommon(id,$compile,echartsData,scope);//饼形图
        	 }else if(echartsDataType=="mixTowDimLine"){//两维度面积图
        		getTowDimLineFromCommon(id,$compile,echartsData,scope);
        	 }else if(echartsDataType=="float"){//浮点图
        		 getFloatFromCommon(id,$compile,echartsData,scope);
        	 }else if(echartsDataType=="quadrant"){//象限图
        		 getQuadrantFromCommon(id,$compile,echartsData,scope);
        	 }else if(echartsDataType=="mixTwoMeasureTwoY"){//两度量双Y轴
        		getTowDimTwoYFromCommon(id,$compile,echartsData,scope);
        	 }else{
                 getMixDimensionChartFromCommon(id,$compile,echartsData,scope); //混合div        	 
             }
         }else{
             ngDialogTips(ngDialog,"无数据！");
         }
     }).error(function (freetrial) {
         ngDialogTips(ngDialog,"获取数据失败！");
     });
}
function getHorizontalChart($http,obj,$compile,scope,ngDialog){
	 $http({
        method: "POST",
        url: ctx()+"/workTable/getKylinByCondition",
        data:JSON.stringify(obj)
      }).success(function (freetrial) {
        var echartsData = freetrial;
        //清除div内的元素
        $("#echartsDiv").empty();
        console.log("返回对象："+JSON.stringify(echartsData));
        if (echartsData.success == true) {
        	var id= "echartsDiv";
    	getHorizontalDivChartFromCommon(id,$compile,echartsData,scope); //横向div
        }else{
            ngDialogTips(ngDialog,"无数据！");
        }
    }).error(function (freetrial) {
        ngDialogTips(ngDialog,"获取数据失败！");
    });
}

function getGaugeChartData($http,obj,$compile,scope,ngDialog){
	$http({
		method: "POST",
		url: ctx()+"/workTable/getKylinByCondition",
		data:JSON.stringify(obj)
	}).success(function (freetrial) {
		var echartsData = freetrial;
		//清除div内的元素
		$("#echartsDiv").empty();
		console.log("返回对象："+JSON.stringify(echartsData));
		if (echartsData.success == true) {
			getGaugeChart($compile,echartsData,scope,"echartsDiv"); //一维样式div
		}
		else {
			ngDialogTips(ngDialog,"无数据！");
		}
	}).error(function (freetrial) {
		ngDialogTips(ngDialog,"获取数据失败！");
	});

}

function getStepChartData($http,obj,$compile,scope,ngDialog,measures,filters){
	$http({
		method: "POST",
		url: ctx()+"/workTable/getKylinByCondition",
		data:JSON.stringify(obj)
	}).success(function (freetrial) {
		var echartsData = freetrial;
		var measuresforstep={
         		"nameDuliang":echartsData.data[0].dataY[0].nameDuliang,
         		"unitDuliang":echartsData.data[0].dataY[0].unitDuliang
         }
		//清除div内的元素
		$("#echartsDiv").empty();
		console.log("返回对象："+JSON.stringify(echartsData));
		measures.push(echartsData.data[0].dataY[0]);
		debugger;
		if (echartsData.success == true) {
			if(echartsDataType=="steptext"){//纯文本
				getSteptextChart($compile,echartsData,scope,"echartsDiv",measuresforstep); //一维样式div
			}else if(echartsDataType=="step"){//同比环
				getStepChart($compile,echartsData,scope,"echartsDiv",measuresforstep,null,filters,$http); //一维样式div
			}
		}
		else {
			ngDialogTips(ngDialog,"无数据！");
		}
	}).error(function (freetrial) {
		ngDialogTips(ngDialog,"获取数据失败！");
	});

}
function exportExcel($http,obj,ngDialog){
	$http({
		method: "POST",
		url: ctx()+"/workTable/exportExcel",
		data:JSON.stringify(obj)
	}).success(function (freetrial) {
		ngDialogTips(ngDialog,"导出数据成功:"+freetrial.data);
	}).error(function (freetrial) {
		ngDialogTips(ngDialog,"导出数据失败！");
	});
}
function getChartData($http,obj,$compile,scope,ngDialog){
	$http({
		method: "POST",
		url: ctx()+"/workTable/getKylinByCondition",
		data:JSON.stringify(obj)
	}).success(function (freetrial) {
		var echartsData = freetrial;
		//清除div内的元素
		$("#echartsDiv").empty();
		console.log("返回对象："+JSON.stringify(echartsData));
		if (echartsData.success == true) {
			//******************table开始***********************
			if(echartsDataType=="table"){
				getTableChart($compile,scope,echartsData);//获取表格数据拼装
			}
			//******************table结束*********************
			//******************图表开始**********************
			else{
				if (echartsData.data.length == 1) {
					getOneDimension($compile,echartsData,scope); //一维样式div
				}
				else {
					if(echartsData.data[0][0].nameWeidu==null){
						ngDialogTips(ngDialog,"无数据");
					}
					else{//多维样式table//加table
						getMoreDimension($compile,scope,echartsData);
					}
				}
			}
			//******************图表结束***********************
		}
		else {
			ngDialogTips(ngDialog,"无数据！");
		}
	}).error(function (freetrial) {
		ngDialogTips(ngDialog,"获取数据失败！");
	});
}


function getMoreDimension($compile,scope,echartsData){
	$("#echartsDiv").css("overflow-y","auto");
	$("#echartsDiv").append($compile("<table></table>")(scope));
    //一个维度一行一行的循环
	var moreDimId = "echartsDiv";
    getMoreDimensionFromCommon(echartsData,moreDimId,$compile,scope);
    
}

function getOneDimension($compile,echartsData,scope){
	for (var i = 0; i < echartsData.data[0].dataY.length; i++) {
        if (echartsData.data[0].dataY.length == 1) {
            $("#echartsDiv").append($compile("<div id='echartsDiv" + i + "' class='singleChart'></div>")(scope));
        }
        else {
            $("#echartsDiv").append($compile("<div id='echartsDiv" + i + "' class='singleChart'></div>")(scope));
        }
        var oneDimChartId = "echartsDiv" + i;
        getOneDimChartFromCommon(echartsData,oneDimChartId,i);
//        var myChart = echarts.init(document.getElementById("echartsDiv" + i));
//        var option = {
//            backgroundColor: '#FFFFFF',
//            grid: {
//           	 containLabel: true
//            },
//            legend: {
//                top: '20px',
////                left: '200px',
//                data: echartsData.data[0].dataY[i].nameDuliang
//            },
//            tooltip: {
//                axisPointer: {
//                    type: 'line'
//                },
//                trigger: 'axis'
////           formatter: function (params) {
////               return params.name+"："+params.value;
////           }
//            },
//            xAxis: {
//                type: 'category',
////                boundaryGap: false,
//                data: echartsData.data[0].dataX,
//                name: echartsData.data[0].nameWeidu,
//                nameLocation: 'middle',
//                nameGap: 20
//            },
//            yAxis: {
//           	 	name:"单位："+echartsData.data[0].dataY[i].unitDuliang,
//                axisLabel: {
//                    formatter: '{value}'// + echartsData.data[0].dataY[i].unitDuliang
//                }
//            },
//            series: {
//                name: echartsData.data[0].dataY[i].nameDuliang,
//                type: echartsData.data[0].dataY[i].dataType,
//                data: echartsData.data[0].dataY[i].data_y
//            }
//        };
    }
}
function getTableChart($compile,scope,echartsData){
	//添加table
	var dataObj=eval('(' + echartsData.data + ')');
	var chartId = "echartsDiv";
	getTableChartFromCommon(dataObj,chartId,$compile,scope);
}

function getDimension(dimTable){
	 if ($("#weiduDiv").children("div").length != 0) {
		 var order =0;
         $("#weiduDiv").children("div").each(function () {
             var oW = eval("(" + $(this).attr("alt") + ")");//字符串转化成对象,维度条件对象
             var dimTableNameW = $(this).attr("name");
             var dimColumnW = oW.tableColumn;
             var oNewW = {
                 "tableName": dimTableNameW,
                 "tableColumn": dimColumnW,
                 "dimMeasureOrder":order
             };//新的入参对象
             dimTable.push(oNewW);
             order++;
         });
     }
}
function getMeasures(measures){
	//度量
    if ($("#duliangDiv").children("div").length != 0) {
        $("#duliangDiv").children("div").not("div[id*='_box']").each(function () {
            var ooD = eval("(" + $(this).attr("alt") + ")");//字符串转化成对象,维度条件对象
            var measuresTableNameD = ooD.tableName;
            var measuresColumnD = ooD.tableColumn;
            var oNewD = {
                "tableName": measuresTableNameD,
                "tableColumn": measuresColumnD,
                "factTableRule": $(this).attr("value"),
                "chartType": "bar"
            };//新的入参对象
            measures.push(oNewD);
        });
    }
}
function getFilters(filters){
	if ($("#shaixuanDiv").children("div").length != 0) {
        $("#shaixuanDiv").children("div").not("div[id*='_box']").each(function () {
            var oS = eval("(" + $(this).attr("alt") + ")");//字符串转化成对象,维度条件对象
            var oNewS = new Object();
            if ($(this).attr("id").indexOf("weidu") >= 0) {
                var dimTableNameS = $(this).attr("name");
                var dimColumnS = oS.tableColumn;
                var ListDimS = new Array();
                if ($(this).attr("value")) {
                    var ListDimOS = $(this).attr("value").split(",");
                    // ngDialogTips(ngDialog,"只在筛选框，ListDimOS[0]="+ListDimOS[0]);
                    for (var j = 0; j < ListDimOS.length; j++) {
                        if (ListDimOS[j] != "" && ListDimOS[j] != null) {
                            var listDimOOS = ListDimOS[j];
                            ListDimS[j] = listDimOOS;
                        }
                    }
                }
                else {
                    ListDimS = new Array();
                }
                oNewS = {
                    "tableType":"1",//代表筛选行里的维度
                    "tableName": dimTableNameS,
                    "tableColumn": dimColumnS,
                    "listFilters": ListDimS
                };//新的入参对象
                filters.push(oNewS);
            }
            if ($(this).attr("id").indexOf("duliang") >= 0) {
                var measuresTableNameS = oS.tableName;
                var measuresColumnS = oS.tableColumn;
                var ListMeasuresS = new Array();
                if ($(this).attr("value")) {
                    var ListMeasuresOS = $(this).attr("value").split(",");
                    for (var j = 0; j < ListMeasuresOS.length; j++) {
                        if (ListMeasuresOS[j] != "" && ListMeasuresOS[j] != null) {
                            var listMeasuresOOS = null;
                            if (ListMeasuresOS[j] == "startNull" || ListMeasuresOS[j] == "endNull") {
                                listMeasuresOOS = null;
                            }
                            else {
                                listMeasuresOOS = parseInt(ListMeasuresOS[j]);//字符串变为数值
                            }
                            ListMeasuresS[j] = listMeasuresOOS;
                        }
                    }
                }
                else {
                    ListMeasuresS = new Array();
                }
                var table_rule="";
                if($(this).attr("name")){
                	table_rule=$(this).attr("name");
                }
                oNewS = {
                    "tableType":"2",//代表筛选行里的度量
                    "tableName": measuresTableNameS,
                    "tableColumn": measuresColumnS,
                    "factTableRule":table_rule,
                    "listFilters": ListMeasuresS
                };//新的入参对象
                filters.push(oNewS);
            }
        });
    }
}
//下钻指令
zztzApp.directive('scrollDown', function ($compile,locals) {
    return {
        scope: false,
        restrict: 'A',
        link: function (scope, element, attr) {
            element.on("click", function () {
                var altO = eval('(' + element.parent("div").attr("alt") + ')');
                var nameO = element.parent("div").attr("name");
                var aNumW = 0;//id编号
                var nextAltO,nextTextO,nextFlagO,nextLeftO,nexZIndexO;
                //获取下钻的所有需要的属性值
                $("#left_weiduTable").children("div").each(function () {
                    var isWeiduTable = false;
                    $(this).children("p").each(function () {
                        if ($(this).children("a").attr("name") == nameO) {
                            isWeiduTable = true;
                        }
                    });
                    if (isWeiduTable == true) {
                        $(this).children("p").each(function () {
                        	 var altObj=eval('(' + $(this).children("a").attr("alt") + ')');
                            if (altObj.tableColumn && altObj.tableColumn == altO.tableColumn ) {
                                //设置id编号
                                //判断是否被拖拽过
                                if ($(this).next("p").children("a").attr("id")) {
                                    aNumW = parseInt($(this).next("p").children("a").attr("id").replace(/[^0-9]/ig, "")); //截取数字,获取编号;
                                }
                                else {
                                    wnumber = locals.get("wnumber");
                                    wnumber++;
                                    aNumW = wnumber;
                                    locals.set("wnumber", wnumber);
                                    //给左侧a标签加id
                                    $(this).next("p").children("a").attr("id","aWeidu_div_"+aNumW);
                                }
                                //获取下一个兄弟节点的alt属性
                                nextAltO=$(this).next("p").children("a").attr("alt");
                                //获取下一个兄弟节点的文本
                                nextTextO=$(this).next("p").children("a").text();
                                //获取下一个兄弟节点的上卷下钻标识符
                                nextFlagO=eval('(' + $(this).next("p").children("a").attr("alt") + ')').nextFlag;
                            }
                        });
                    }
                });
                //获取下一个元素的left位置置和层级值
                if(element.parent("div").next("div").attr("id")){
                    console.log(element.parent("div").next("div").attr("id"));
                    nextLeftO=element.parent("div").next("div").css("left").replace(/[^0-9]/ig, "");
                    nexZIndexO=element.parent("div").next("div").css("z-index");
                }
                else{
                    console.log(element.parent("div").width());
                    nextLeftO=parseInt(element.parent("div").css("left").replace(/[^0-9]/ig, ""))+element.parent("div").width()+15;
                    nexZIndexO=element.parent("div").css("z-index");
                }
                //生成元素div
                element.parent("div").after($compile("<div id='weidu_div_"+aNumW+"W' class='drag03' style='left: "+nextLeftO+"px; top: 3px; z-index: "+(nexZIndexO+10)+"; position: absolute; cursor: default;' alt='"+nextAltO+"' name='"+nameO+"'></div>")(scope))
                //生成上卷按钮
                if(nextFlagO==1 || nextFlagO==3){
                    element.parent("div").next("div").append($compile(
                        "<a scroll-up='' class='fa fa-minus-square-o font_colorW' style='line-height:20px;margin-right: 5px;'></a>  "
                    )(scope));
                }
                //生成text标签
                element.parent("div").next("div").append($compile("<span>"+nextTextO+"</span>")(scope));
                //生成下钻标签
                if(nextFlagO==2 || nextFlagO==3){
                    element.parent("div").next("div").append($compile(
                        "  <a scroll-down='' class='fa fa-plus-square-o font_colorW' style='line-height:20px;margin-left: 5px;margin-right: 5px;'></a>  "
                    )(scope));
                }
                //生成删除按钮
                element.parent("div").next("div").append($compile( "<a delete='' class='fa fa-close font_colorW floatR' style='line-height:20px'></a>")(scope));
                //将此div后面的兄弟div向后移动一格
                //判断是否后面有兄弟节点
                if(element.parent("div").next("div").nextAll("div")){
                    var nextWidth=element.parent("div").next("div").width();
                    element.parent("div").next("div").nextAll("div").each(function(){
                        var oldLeft=parseInt($(this).css("left").replace(/[^0-9]/ig, ""));
                        $(this).css("left",oldLeft+nextWidth+15+"px");
                    });
                }
                $("#clickEchartData").click();
            });
        }
    }
});



//上卷指令
zztzApp.directive('scrollUp', function ($compile,locals) {
    return {
        scope: false,
        restrict: 'A',
        link: function (scope, element, attr) {
            element.on("click", function () {
            	var altO = eval('(' + element.parent("div").attr("alt") + ')');
                var nameO = element.parent("div").attr("name");
                var aNumW = 0;//id编号
                var prevAltO,prevTextO,prevFlagO,prevLeftO,prevZIndexO;
                //获取上卷的所有需要的属性值
                $("#left_weiduTable").children("div").each(function () {
                    var isWeiduTable = false;
                    $(this).children("p").each(function () {
                        if ($(this).children("a").attr("name") == nameO) {
                            isWeiduTable = true;
                        }
                    });
                    if (isWeiduTable == true) {
                        $(this).children("p").each(function () {
                        	var altObj=eval('(' + $(this).children("a").attr("alt") + ')');
                            if (altObj.tableColumn &&  altObj.tableColumn == altO.tableColumn) {
                            	console.log("altObj.tableColumn="+altObj.tableColumn+",altO.tableColumn="+altO.tableColumn);
                                //设置id编号
                                //判断是否被拖拽过
                                if ($(this).prev("p").children("a").attr("id")) {
                                    aNumW = parseInt($(this).prev("p").children("a").attr("id").replace(/[^0-9]/ig, "")); //截取数字,获取编号;
                                }
                                else {
                                    wnumber = locals.get("wnumber");
                                    wnumber++;
                                    aNumW = wnumber;
                                    locals.set("wnumber", wnumber);
                                    //给左侧a标签加id
                                    $(this).prev("p").children("a").attr("id","aWeidu_div_"+aNumW);

                                }
                                //获取上一个兄弟节点的alt属性
                                prevAltO=$(this).prev("p").children("a").attr("alt");
                                //获取上一个兄弟节点的文本
                                prevTextO=$(this).prev("p").children("a").text();
                                //获取上一个兄弟节点的上卷下钻标识符
                                prevFlagO=eval('(' + $(this).prev("p").children("a").attr("alt") + ')').nextFlag;
                            }
                        });
                    }
                });
                //获取本元素的left位置置和层级值
                    prevLeftO=parseInt(element.parent("div").css("left").replace(/[^0-9]/ig, ""));
                    prevZIndexO=element.parent("div").css("z-index");
                //生成元素div
                element.parent("div").after($compile("<div id='weidu_div_"+aNumW+"W' class='drag03' style='left: "+prevLeftO+"px; top: 3px; z-index: "+(prevZIndexO+10)+"; position: absolute; cursor: default;' alt='"+prevAltO+"' name='"+nameO+"'></div>")(scope));
                //生成上卷按钮
                if(prevFlagO==1 || prevFlagO==3){
                    element.parent("div").next("div").append($compile(
                        "<a scroll-up='' class='fa fa-minus-square-o font_colorW' style='line-height:20px;margin-right: 5px;'></a>  "
                    )(scope));
                }
                //生成text标签
                element.parent("div").next("div").append($compile("<span>"+prevTextO+"</span>")(scope));
                //生成下钻标签
                if(prevFlagO==2 || prevFlagO==3){
                    element.parent("div").next("div").append($compile(
                        "  <a scroll-down='' class='fa fa-plus-square-o font_colorW' style='line-height:20px;margin-left: 5px;margin-right: 5px;'></a>  "
                    )(scope));
                }
                //生成删除按钮
                element.parent("div").next("div").append($compile( "<a delete='' class='fa fa-close font_colorW floatR' style='line-height:20px'></a>")(scope));
                //将此div后面的兄弟div移动到正确位置
                var thisPrevLeft=parseInt(element.parent("div").next("div").css("left").replace(/[^0-9]/ig, ""));
                //判断是否后面有兄弟节点
                if(element.parent("div").next("div").nextAll("div")){
                    element.parent("div").next("div").nextAll("div").each(function(){
                        var prevWidthO=parseInt($(this).prev("div").width())+15;
                        thisPrevLeft=thisPrevLeft+prevWidthO;
                        console.log("prevWidthO="+prevWidthO);
                        console.log("thisPrevLeft="+thisPrevLeft);
                        $(this).css("left",thisPrevLeft+"px");
                    });
                }
                //判断是否删除本元素编号所在的左侧id值
                var thisANumW=parseInt(element.parent("div").attr("id").replace(/[^0-9]/ig, ""));
                var thisWNumber=0;//相同筛选条件的个数
                element.parents("#weiduDiv").children("div").each(function(){
                    var thisIdO=$(this).attr("id").split("_");
                    if(parseInt(thisIdO[2].replace(/[^0-9]/ig, ""))==thisANumW){
                        thisWNumber++;
                    }
                });
                if(thisWNumber<2){
                    $("#left_weiduTable").find("a[id='aWeidu_div_" + thisANumW + "']").removeAttr("id");
                }
                //删除本div元素
                element.parent("div").remove();
                $("#clickEchartData").click();
            });
        }
    }
});

//拖拽获取图表
zztzApp.directive('dragEcharts', function ($compile, $http) {
    return {
        scope: false,
        restrict: 'A',
        link: function (scope, element, attr) {
        }
    }
});

//保存echarts数据指令
zztzApp.directive('savecharts', function ($compile, $http,tableDetail,ngDialog) {
    return {
        scope: false,
        restrict: 'A',
        link: function (scope, element, attr) {
            element.on("click", function () {
                //data_type的值有：line,bar,pie,gauge（仪表盘图）,radar(雷达图),funnel(漏斗图),scatter(散点图),map
                //前台传的维度和度量对象参数
                var obj = new Object();
                var dimTable = new Array();//维度列
                var measures = new Array();//度量列
                var filters = new Array();//筛选列
                getDimension(dimTable);//获取度量
                getMeasures(measures);//获取维度
                getFilters(filters);//筛选框入参对象
                //前台传给后台的入参对象
                if ($("#weiduDiv").children("div").length != 0 && $("#duliangDiv").children("div").length != 0) {
                    //data_type的值有：line,bar,pie,gauge（仪表盘图）,radar(雷达图),funnel(漏斗图),scatter(散点图),map
                    var workTableName = angular.element("#workTableNameInput").text();
                    
                    var workTableCode = angular.element("#workTableCodeInput").text();
                    //dataType=document.getElementById('workTableNameInput').getAttribute("name");
                    if(echartsDataType==""){//默认的类型为table
                    	echartsDataType = "table";
                    }
                    var workTableId = "";
                    if(tableDetail.tableDetail != null){
                    	workTableId = tableDetail.tableDetail.workTableId;
                    }
                    obj = {
                        "workTableId":workTableId,
                        "workTableName":workTableName,
                        "workTableCode":workTableCode,
                        "dimTable": dimTable,
                        "measures": measures,
                        "filters": filters,
                        "dataType":echartsDataType,
                        "XsColor":XsColor,
                        "XwColor":XwColor,
                        "YsColor":YsColor,
                        "YwColor":YwColor,
                        "headerColor":headerColor,
                        "bodyColor":bodyColor,
                        "tableColor":tableColor,
                        "themeId":echartsColorTheme,
                        "themeColor":echartsColorArr,
                        "cubeId": $("#left_modelTable").find("input").attr("name")//在页面将cubeID放到name属性里--2016-08-30
                    };
                    console.log("传给后台的dataType="+echartsDataType);
                    console.log("传给后台的obj=" + JSON.stringify(obj));
                    ngDialog.openConfirm({//输入名称
                        template: 'modalDialogId',
                        className: 'ngdialog-theme-default custom-theme'
                    }).then(function (value) {
                        console.log('Modal promise resolved. Value: ', value);
                        if (value != null && value != "") {
                            obj.workTableName = value;
                        }
                        if(!obj.workTableCode){//输入编码
                        	ngDialog.openConfirm({
                                template: 'modalDialogId1',
                                className: 'ngdialog-theme-default custom-theme'
                            }).then(function (value) {
                                console.log('Modal promise resolved. Value: ', value);
                                if (value != null && value != "") {
                                    obj.workTableCode = value;
                                }
                                saveWorkTable($http,obj,tableDetail,ngDialog);
                            }, function (reason) {
                                console.log('Modal promise rejected. Reason: ', reason);
                            });
                        }else{
                        	obj.workTableCode = obj.workTableCode.replace("(","");
                        	obj.workTableCode = obj.workTableCode.replace(")","");
                            saveWorkTable($http,obj,tableDetail,ngDialog);
                        }
                    }, function (reason) {
                        console.log('Modal promise rejected. Reason: ', reason);
                    });
                        //弹出填写工作表框
//                        element.parents("#main_zztz").nextAll("#saveEchartsDiv").find("input").val(workTableName);
//                        element.parents("#main_zztz").nextAll("#saveEchartsDiv").attr("name",JSON.stringify(obj));
//                        element.parents("#main_zztz").nextAll("#saveEchartsDiv").fadeIn(300);
                }else{
//                	element.parents("#main_zztz").nextAll("#messageDiv").find("span").text("请拖拽度量或维度条件！");
//                	element.parents("#main_zztz").nextAll("#messageDiv").fadeIn(200);
//                	var t=setTimeout(function(){element.parents("#main_zztz").nextAll("#messageDiv").fadeOut(200);},1500);
//                  return false;
                	ngDialogTips(ngDialog,"请拖拽维度和度量！");
                	console.log("请拖拽维度和度量！");
                }
            })
        }
    }
});
function setWorkTableName(workTableName,workTableCode){//设置工作表名
	var workNameDivUl=document.getElementById("tabDIV").childNodes;
	  	for(var j=0;j<workNameDivUl.length;j++){
		  if(workNameDivUl[j].nodeName=="UL"){
			  var workNameLi=workNameDivUl[j].childNodes;
			  var d1 =0;
			  for(var g=0;g<workNameLi.length;g++){
				  if(workNameLi[g].nodeName=="LI"){
					  var workNameInput=workNameLi[g].childNodes;
					  for(var d=0;d<workNameInput.length;d++){
						  if(workNameInput[d].nodeName=="SPAN"&&d1==0){
							  workNameInput[d].innerHTML=workTableName;
						  }else if(workNameInput[d].nodeName=="SPAN"&&d1==1){
							  workNameInput[d].innerHTML="("+workTableCode+")";
						  }
					  }
					  d1++
				  }
			  }
		  }
	  }
}
function colorSet(echartsDataType){
	debugger;
	var thisType = true;
	if(echartsDataType=="table"){//表格颜色设置
		if ($("#colorSelected").hasClass("display-control")) {
			$("#colorSelected").removeClass("display-control");
	    } else{
	        $("#colorSelected").addClass("display-control");
	    }
		if (!$("#themeColorSelected").hasClass("display-control")) {
			$("#themeColorSelected").addClass("display-control");
	    }
		if (!$("#themeColorId").hasClass("display-control")) {
			$("#themeColorId").addClass("display-control");
	    }
		if (!$("#tableColorSet").hasClass("display-control")) {
			$("#tableColorSet").addClass("display-control");
	    }
		
		//if ($("#tableColorSelected").hasClass("display-control")) {
	        $("#tableColorSelected").removeClass("display-control");
	    /*} else {
	        $("#tableColorSelected").addClass("display-control");
	    }
		if ($("#bodyColorSelected").hasClass("display-control")) {
	       */ $("#bodyColorSelected").removeClass("display-control");
	    /*} else {
	        $("#bodyColorSelected").addClass("display-control");
	    }
		if ($("#headerColorSelected").hasClass("display-control")) {
	       */ $("#headerColorSelected").removeClass("display-control");
	    /*} else {
	        $("#headerColorSelected").addClass("display-control");
	    }
	*/
		if (!$("#xsColorSelected").hasClass("display-control")) {
	        $("#xsColorSelected").addClass("display-control");
	    }
		
		if (!$("#xwColorSelected").hasClass("display-control")) {
	        $("#xwColorSelected").addClass("display-control");
	    }
		if (!$("#ysColorSelected").hasClass("display-control")) {
	        $("#ysColorSelected").addClass("display-control");
	    }
		if (!$("#ywColorSelected").hasClass("display-control")) {
	        $("#ywColorSelected").addClass("display-control");
	    }
	
	}else if(thisType = echartsDataType=="line"
		||echartsDataType=="bar"||echartsDataType=="scatter"
		||echartsDataType=="horizontal"||echartsDataType=="mixTwoDim"
		||echartsDataType=="mixTwoMeasure"||echartsDataType=="mixTowDimLine"
		||echartsDataType=="mixTwoMeasureTwoY"){
		if (!$("#themeColorSelected").hasClass("display-control")) {
			$("#themeColorSelected").addClass("display-control");
	    } 
		if ($("#colorSelected").hasClass("display-control")) {
	        $("#colorSelected").removeClass("display-control");
		    } else{
		        $("#colorSelected").addClass("display-control");
		    }
		if (!$("#themeColorId").hasClass("display-control")) {
			$("#themeColorId").addClass("display-control");
	    }
		$("#xsColorSelected").removeClass("display-control");
	    $("#xwColorSelected").removeClass("display-control");
	    $("#ysColorSelected").removeClass("display-control");
	    $("#ywColorSelected").removeClass("display-control");
		$("#tableColorSet").removeClass("display-control");
		if (!$("#tableColorSelected").hasClass("display-control")) {
	        $("#tableColorSelected").addClass("display-control");
	    }
		if (!$("#bodyColorSelected").hasClass("display-control")) {
	        $("#bodyColorSelected").addClass("display-control");
	    }
		if (!$("#headerColorSelected").hasClass("display-control")) {
	        $("#headerColorSelected").addClass("display-control");
	    }
	}
}
function saveWorkTable($http,obj,tableDetail,ngDialog) {
    //数据分析信息
    $http({
        method: "POST",
        url: ctx() + "/workTable/saveWorkTable",
        params:{"workConditionString":JSON.stringify(obj)}
    }).success(function (freetrial) {
    	if(freetrial.code==1001){
    		ngDialogTips(ngDialog,"编码重复，请重新输入<br> \n"+obj.workTableCode);
    	}
    	freetrial = freetrial.data;
    	console.log("saveObj:"+JSON.stringify(freetrial));
    	if(tableDetail.tableDetail==null){
    		tableDetail.tableDetail={
    				"workTableId":freetrial.workTableId
        	}
    	}
    	setWorkTableName(freetrial.workTableName,freetrial.workTableCode);
        ngDialogTips(ngDialog,"保存数据分析成功！");
    }).error(function (freetrial) {
        ngDialogTips(ngDialog,"保存数据分析失败！");
    });
}

//弹出计算规则框
zztzApp.directive('tableRule', function ($compile, $http) {
    return {
        scope: false,
        restrict: 'A',
        link: function (scope, element, attr) {
            element.on("click", function () {
            	//判断是否第一次打开
            	if(element.parent("div").next("div[class*='drag04Box']").attr('class')){
            		if(element.parent("div").next("div[class*='drag04Box']").css("display")=="none"){
            			element.attr("class","font_colorW fa fa-caret-up");
            			element.parent("div").parent("div").attr("style","");
            			element.parent("div").removeClass("drag03");
                    	element.parent("div").addClass("drag04");
            			element.parent("div").next("div[class*='drag04Box']").slideDown(100);
            		}
            		else{
            			element.parent("div").next("div[class*='drag04Box']").slideUp(100);
                    	element.attr("class","font_colorW fa fa-caret-down");
                    	element.parent("div").removeClass("drag04");
                    	element.parent("div").addClass("drag03");
                    	element.parent("div").parent("div").attr("style","overflow:hidden");
            		}
            	}
            	else{//第一次打开
            		var number=element.parent("div").attr("id").replace(/[^0-9]/ig, "");
                	var widthDiv=element.parent("div").width();
                	var leftDiv=element.parent("div").css("left");
                	element.parent("div").after($compile("<div id='duliang_div_"+number+"D_box' class='drag04Box' style='width:"+widthDiv+"px;left:"+leftDiv+";display:none;'></div>")(scope));
                	var altObj=eval('(' + element.parent("div").attr("alt") + ')');
	            	var pObj=altObj.rules;
	        		for(var i=0;i<pObj.length;i++){
	        			element.parent("div").next("div[id*='_box']").append($compile("<p><a check-rule='' value='"+pObj[i].factTableRule+"'>"+pObj[i].ruleName+"</a></p>")(scope));
	        		}
                    element.attr("class","font_colorW fa fa-caret-up");
                	element.parent("div").removeClass("drag03");
                	element.parent("div").addClass("drag04");
                	element.parent("div").parent("div").attr("style","");;
                	element.parent("div").next("div[class*='drag04Box']").slideDown(100);
            	}
            	});
        }
    }
});

//选择计算规则
zztzApp.directive('checkRule', function ($compile, $http) {
    return {
        scope: false,
        restrict: 'A',
        link: function (scope, element, attr) {
            element.on("click", function () {
            	var checkedValue=element.attr("value");
            	var checkedValueCn=element.text();
            	element.parents("div[id*='_box']").prev("div[id*='duliang_div']").attr("value",checkedValue);
                //弹出框消失
            	var altObj=eval('(' + element.parents("div[id*='_box']").prev("div[id*='duliang_div']").attr("alt") + ')');
            	var oldtext=altObj.tableColumnCn;
            	element.parents("div[id*='_box']").prev("div").find("span").text(oldtext+"（"+checkedValueCn+"）");
            	element.parents("div[id*='_box']").slideUp(100);
            	element.parents("div[id*='_box']").prev("div").find("a[class*='fa-caret-up']").attr("class","font_colorW fa fa-caret-down");
            	element.parents("div[id*='_box']").prev("div[id*='duliang_div']").removeClass("drag04");
            	element.parents("div[id*='_box']").prev("div[id*='duliang_div']").addClass("drag03");
                $("#clickEchartData").click();
            })
        }
    }
});



//数据模型的绑定事件
zztzApp.controller('tabPanel', function ($scope, $http,$state,ngDialog) {
	$scope.initColor=function () {
		var defaultColor = "";//#333
		XsColor=defaultColor;//x轴颜色
		XwColor=defaultColor;//x文字颜色
		YsColor=defaultColor;//y轴颜色
		YwColor=defaultColor;//y文字颜色
    	headerColor="";//表格header颜色
    	bodyColor="";//表格内容颜色
    	tableColor="";//表格边框颜色

	}
	
	$scope.getThemeList = function(){
		$http({
	        method: "POST",
	        url: ctx() + "/theme/getThemeList",
	        params:{}
	    }).success(function (freetrial) {
	    	console.log("getThemeList:"+JSON.stringify(freetrial));
	    	if(freetrial!=null){
	    		$scope.themeList=freetrial.data;
	    	}
	    }).error(function (freetrial) {
	    	console.log("查询数据异常！");
	    });
		
	}
	$scope.newWorkTable=function () {
		window.location.reload();
	};
	$scope.exportExcel = function () {
        var obj = new Object();
        var dimTable = new Array();//维度列
        var measures = new Array();//度量列
        var filters = new Array();//筛选列
        getDimension(dimTable);//获取度量
        getMeasures(measures);//获取维度
        getFilters(filters);//筛选框入参对象
        iconSetting();//图标控制
        if ($("#weiduDiv").children("div").length != 0 && $("#duliangDiv").children("div").length != 0) {
        	var workTableCode =$('#workTableCodeInput').text();
            obj = {
                "workTableId":"",
                "workTableName":$('#workTableNameInput').text(),
                "workTableCode":"",
                "dimTable": dimTable,
                "measures": measures,
                "filters": filters,
                "cubeId": $("#left_modelTable").find("input").attr("name")//在页面将cubeID放到name属性里--2016-08-30
            };
            exportExcel($http,obj,ngDialog);
        }else{
//          ngDialogTips(ngDialog,"请拖拽度量或维度条件！");
            console.log("请拖拽度量或维度条件！");
            return false;
        }
    }
	$scope.tableColorSetor = function () {
		if ($("#themeColorSelected").hasClass("display-control")) {
			$("#themeColorSelected").removeClass("display-control");
	    } else{
	        $("#themeColorSelected").addClass("display-control");
	    }
	}
	//设置
    $scope.colorSettings = function () {
    	debugger;
    	$scope.XsColor = XsColor;//x轴颜色
		$scope.XwColor = XwColor;//x文字颜色
		$scope.YsColor = YsColor;//y轴颜色
		$scope.YwColor = YwColor;//y文字颜色
    	$scope.headerColor = headerColor;//x文字颜色
  		$scope.bodyColor = bodyColor;//y轴颜色
  		$scope.tableColor = tableColor;//y文字颜色
  		$scope.themeColor = echartsColorArr;
  		colorSet(echartsDataType);
    };
    $scope.themeColorSettings = function () {
    	if ($("#themeColorId").hasClass("display-control")) {
			$("#themeColorId").removeClass("display-control");
	    } else{
	        $("#themeColorId").addClass("display-control");
	    }
    	
    	if (!$("#colorSelected").hasClass("display-control")) {
			$("#colorSelected").addClass("display-control");
	    } 
		if (!$("#themeColorSelected").hasClass("display-control")) {
			$("#themeColorSelected").addClass("display-control");
	    }
    };
    
    $scope.changeColor = function (n) {
    	debugger;
    	$scope.colorn = n;
    }
    $scope.$on('colorPicked', function (event, color) {
    	for(var i = 0;i<$scope.themeColor.length;i++){
    		if($scope.themeColor[i]==color){
    			ngDialogTips(ngDialog,"该主题色系中已有该颜色，不可再次设置！");
    			return;
        	}
    	}
		$scope.themeColor[$scope.colorn]=color;
		echartsColorArr = $scope.themeColor;
	});
    $scope.themeColorPicked = function (theme) {
    	debugger;
    	echartsColorTheme = theme.id;
    	$scope.themeColor = theme.themeColorArr; 
    	echartsColorArr = $scope.themeColor;
        $("#themeColorId").addClass("display-control");
        $("#clickEchartData").click();
    }
    $scope.XsColorPicked = function () {
    	ngcolor = "XsColor";
    }
    $scope.XwColorPicked = function () {
    	ngcolor = "XwColor";
    }
    $scope.YsColorPicked = function () {
    	ngcolor = "YsColor";
    }
    $scope.YwColorPicked = function () {
    	ngcolor = "YwColor";
    }
    $scope.tableColorPicked = function () {
    	ngcolor = "tableColor";
    }
    $scope.bodyColorPicked = function () {
    	ngcolor = "bodyColor";
    }
    $scope.headerColorPicked = function () {
    	ngcolor = "headerColor";
    }
    $scope.$on('colorPicked', function (event, color) {
    	if(ngcolor == "XsColor") {
    		XsColor = color;
    		$scope.XsColor = color;
    	}
    	else if(ngcolor == "XwColor") {
    		XwColor = color;
    		$scope.XwColor = color;
    		}
    	else if(ngcolor == "YsColor") {
    		YsColor = color;
    		$scope.YsColor = color;
    		}
    	else if(ngcolor == "YwColor") {
    		YwColor = color;
    		$scope.YwColor = color;
    		}
    	else if(ngcolor == "headerColor") {
    		headerColor = color;
    		$scope.headerColor = color;
    		}
    	else if(ngcolor == "bodyColor") {
    		bodyColor = color;
    		$scope.bodyColor = color;
    		}
    	else if(ngcolor == "tableColor") {
    		tableColor = color;
    		$scope.tableColor = color;
    		}
        $("#clickEchartData").click();
    });
}); 

angular.module('zztzApp').filter('cut', function () {
	  return function (value, wordwise, max, tail) {
	    if (!value) return '';
	    max = parseInt(max, 10);
	    if (!max) return value;
	    if (value.length <= max) return value;
	    value = value.substr(0, max);
	    if (wordwise) {
	      var lastspace = value.lastIndexOf(' ');
	      if (lastspace != -1) {
	        value = value.substr(0, lastspace);
	      }
	    }
	    return value + (tail || ' …');
	  };
});

headerDirective.factory('isSearch',function(){
    return{
        "isSearch":false
    }
});
zztzApp.factory('tableDetail',function () {
	return{
		tableDetail:null
	}
});


zztzApp.factory('pieDetail',function () {
	return{
		pieDetail:null
	}
});

zztzApp.factory('storyDetail',function () {
	return{
		storyDetail:null
	}
});
//本地存储数据===================================
zztzApp.factory('locals',['$window',function($window){
    return{
        //存储单个属性
        set :function(key,value){
            $window.localStorage[key]=value;
        },
        //读取单个属性
        get:function(key){
            return  $window.localStorage[key] || '';
        },
        //存储对象，以JSON格式存储
        setObject:function(key,value){
            $window.localStorage[key]=JSON.stringify(value);
        },
        //读取对象
        getObject: function (key) {
            return JSON.parse($window.localStorage[key] || '{}');
        }
    }
}]);