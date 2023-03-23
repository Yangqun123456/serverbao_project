/**
 * Created by tuyadi on 2016/6/7.
 */

var zztzApp = angular.module('zztzApp', []);

//全局变量
var iXW, iYW, oXW, oYW; //维度拖拽位置
var wnumber = 0; //weiduDiv里的子元素序号

var iXD, iYD, oXD, oYD; //度量拖拽位置
var dnumber = 0; //duliangDiv里的子元素序号

var zIndex = 99999999;
var isOpenBoxW=false;
var isOpenBoxD=false;
var isOpenBoxSW=false;
var isOpenBoxSD=false;

var ctx = function() {
	  var path = window.location.href;
	  var pathName = window.location.pathname;
	  var hostPath = path.substring(0, path.indexOf(pathName))
	  var projectName = pathName.substring(0, pathName.substring(1).indexOf('/') + 1);
	  return (hostPath + projectName);
	}
var echartsDataType = "";
zztzApp.controller('myTableController',function ($scope, $http,$state,tableDetail,pieDetail,storyDetail,locals) {//我的作品
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
    	if(confirm("是否确认删除？")){
	    	$http({
	            method: "DELETE",
	            url: ctx()+"/workTable/"+table.workTableId,
	            params:{}
	        }).success(function (data) {
	        	var pies = data.data;
	        	if(pies==null||pies.length==0){//未挂在仪表盘下
	        		console.log("删除成功");
	        	}else{
	        		alert("下列仪表盘使用了该数据分析，不可删除 \n"+pies);
	        	}
	        	$scope.searchClick();
		     }).error(function (data) {
	            console.log("删除失败");
	        });
    	}
    }
    
    $scope.copyTable=function(table){
    	if(confirm("是否确认复制？")){
	    	$http({
	            method: "POST",
	            url: ctx()+"/workTable/"+table.workTableId,
	            params:{"workTableName":table.workTableName}
	        }).success(function (data) {
	        	console.log("复制成功");
	        	alert("复制成功");
	        	$scope.searchClick();
		     }).error(function (data) {
	            console.log("复制失败");
	        });
    	}
    }
    
    $scope.delPie=function(pie){//删除pie
    	if(confirm("是否确认删除？")){
	    	$http({
	            method: "DELETE",
	            url: ctx()+"/dashboards/"+pie.id,
	            params:{}
	        }).success(function (data) {
	        	alert("删除成功");
	        	console.log("删除成功");
	        	$scope.searchClick();
		     }).error(function (data) {
	            console.log("删除失败");
	        });
    	}
    }
    
    $scope.copyPie=function(pie){
    	if(confirm("是否确认复制？")){
	    	$http({
	            method: "POST",
	            url: ctx()+"/dashboards/"+pie.id,
	            params:{}
	        }).success(function (data) {
	        	alert("复制成功");
	        	console.log("复制成功");
	        	$scope.searchClick();
		     }).error(function (data) {
	            console.log("复制失败");
	        });
    	}
    }
    
    $scope.newPie=function(){
    	var obj={
				"currentName":angular.element("#menu_zztz").find("#menu_muyPie").attr("id")
		}
		locals.setObject("href",obj);
    	angular.element("#menu_zztz").find("#menu_muyPie").addClass("active");
    	angular.element("#menu_zztz").find("#menu_muyPie").siblings("li").removeClass("active");
		debugger;
		
		$state.go("zztzfx.myPie");
    };
    
    $scope.delStory=function(story){//删除story
    	if(confirm("是否确认删除？")){
	    	$http({
	            method: "DELETE",
	            url: ctx()+"/stories/"+story.id,
	            params:{}
	        }).success(function (data) {
	        	alert("删除成功");
	        	console.log("删除成功");
	        	$scope.searchClick();
		     }).error(function (data) {
	            console.log("删除失败");
	        });
    	}
    }
    
    $scope.copyStory=function(story){
    	if(confirm("是否确认复制？")){
	    	$http({
	            method: "POST",
	            url: ctx()+"/stories/"+story.id,
	            params:{}
	        }).success(function (data) {
	        	alert("复制成功");
	        	console.log("复制成功");
	        	$scope.searchClick();
		     }).error(function (data) {
	            console.log("复制失败");
	        });
    	}
    }
    
    $scope.newStory=function(){
    	var obj={
				"currentName":angular.element("#menu_zztz").find("#menu_myStory").attr("id")
		}
		locals.setObject("href",obj);
    	angular.element("#menu_zztz").find("#menu_myStory").addClass("active");
    	angular.element("#menu_zztz").find("#menu_myStory").siblings("li").removeClass("active");
		debugger;
		
		$state.go("zztzfx.myStory");
    };
    
    $scope.newWorkTable=function(){
    	var obj={
				"currentName":angular.element("#menu_zztz").find("#menu_workPanel").attr("id")
		}
		locals.setObject("href",obj);
    	angular.element("#menu_zztz").find("#menu_workPanel").addClass("active");
    	angular.element("#menu_zztz").find("#menu_workPanel").siblings("li").removeClass("active");
		debugger;
		
		$state.go("zztzfx.workPanel");
    }
    
    $scope.showTable=function(table){
    	tableDetail.tableDetail=table;
    	//加菜单缓存标识
    	var obj={
				"currentName":"menu_workPanel"
		}
		locals.setObject("href",obj);
    	debugger;
    	var ulObj=document.getElementById("menu_zztz").childNodes;
    	for(var i=0;i<ulObj.length;i++){
    		var liObjs=ulObj[i].childNodes;
    		console.log("ulObj[i].nodeName="+ulObj[i].nodeName);
    		debugger;
    		if(ulObj[i].nodeName=="UL"){
    			debugger;
    			for(var j=0;j<liObjs.length;j++){
    				console.log("liObjs[j].nodeName="+liObjs[j].nodeName);
    				if(liObjs[j].nodeName=="LI"){
    					debugger;
    					if(liObjs[j].getAttribute("id")==obj.currentName){
            				liObjs[j].setAttribute("class","active");
            				var siblingObjs=sibling(liObjs[j]);
            				for(var k=0;k<siblingObjs.length;k++){
            					if(siblingObjs[k].nodeName=="LI"){
            						siblingObjs[k].removeAttribute("class");
            					}
            				}
            				debugger;
            			}
    				}
        			
        		}
    		}
    		
    	}
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
    	debugger;
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
    	debugger;
    	var ulObj=document.getElementById("menu_zztz").childNodes;
    	for(var i=0;i<ulObj.length;i++){
    		var liObjs=ulObj[i].childNodes;
    		console.log("ulObj[i].nodeName="+ulObj[i].nodeName);
    		debugger;
    		if(ulObj[i].nodeName=="UL"){
    			debugger;
    			for(var j=0;j<liObjs.length;j++){
    				console.log("liObjs[j].nodeName="+liObjs[j].nodeName);
    				if(liObjs[j].nodeName=="LI"){
    					debugger;
    					if(liObjs[j].getAttribute("id")==obj.currentName){
            				liObjs[j].setAttribute("class","active");
            				var siblingObjs=sibling(liObjs[j]);
            				for(var k=0;k<siblingObjs.length;k++){
            					if(siblingObjs[k].nodeName=="LI"){
            						siblingObjs[k].removeAttribute("class");
            					}
            				}
            				debugger;
            			}
    				}
        			
        		}
    		}
    		
    	}
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
    	debugger;
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
    	debugger;
    	var ulObj=document.getElementById("menu_zztz").childNodes;
    	for(var i=0;i<ulObj.length;i++){
    		var liObjs=ulObj[i].childNodes;
    		console.log("ulObj[i].nodeName="+ulObj[i].nodeName);
    		debugger;
    		if(ulObj[i].nodeName=="UL"){
    			debugger;
    			for(var j=0;j<liObjs.length;j++){
    				console.log("liObjs[j].nodeName="+liObjs[j].nodeName);
    				if(liObjs[j].nodeName=="LI"){
    					debugger;
    					if(liObjs[j].getAttribute("id")==obj.currentName){
            				liObjs[j].setAttribute("class","active");
            				var siblingObjs=sibling(liObjs[j]);
            				for(var k=0;k<siblingObjs.length;k++){
            					if(siblingObjs[k].nodeName=="LI"){
            						siblingObjs[k].removeAttribute("class");
            					}
            				}
            				debugger;
            			}
    				}
        			
        		}
    		}
    		
    	}
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
    	debugger;
    	//加菜单缓存标识结束
    	$state.go('zztzfx.myStory');
    };
});
// 数据模型的绑定事件
zztzApp.controller('dataController', function ($scope, $http,$compile,tableDetail,isSearch,locals) {
	
	$scope.tableDetail=tableDetail.tableDetail;//详情
    // 数据模型model名初始值
    $scope.modelName = "请输入数据模型名称";
    //列表获取gif图片地址
//    $scope.cubeListGifUrl = "";
    // /*获取数据表*/
    $scope.getTable = function () {
    	debugger;
    	//传入给后台的查询cube列表的参数
    	var cube_name="";
    	if ($scope.modelName == "请输入数据模型名称"){
    		cube_name=null;
    	}
    	else{
    		cube_name=$scope.modelName;
    	}
//        if ($scope.modelName != "请输入数据模型名称" && $scope.modelName != "" && $scope.modelName != " ") {
            //成功获取数据之前的gif动画效果
//            $scope.cubeListGifUrl = ctx()+"/img/zztzfx/Loading.gif";
//            document.getElementById("waitingIMG").setAttribute("style","border: 0px;");
            
            // alert(cube_name);
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
                              
                			  debugger;
                			  var myTable = freetrial[n];
                			  $scope.change(myTable);
                			  $http({
                	                method: "POST",
                	                url: ctx()+"/workTable/showWorkTable",
                	                params:{"workTableId":tableDetail.tableDetail.workTableId}
                	              }).success(function(table){
                	            	  console.log("showWorkTable:"+JSON.stringify(table));
//                	            	  //塞数据分析名称
                	            	  var workNameDivUl=document.getElementById("tabDIV").childNodes;
                	            	  debugger;
                	            	  for(var j=0;j<workNameDivUl.length;j++){
                	            		  if(workNameDivUl[j].nodeName=="UL"){
                	            			  debugger;
                	            			  var workNameLi=workNameDivUl[j].childNodes;
                	            			  for(var g=0;g<workNameLi.length;g++){
                	            				  if(workNameLi[g].nodeName=="LI"){
                	            					  debugger;
                	            					  var workNameInput=workNameLi[g].childNodes;
                	            					  for(var d=0;d<workNameInput.length;d++){
                	            						  if(workNameInput[d].nodeName=="SPAN"){
                	            							  debugger;
                	            							  workNameInput[d].innerHTML=table.workTableName;
                	            							  debugger;
                	            						  }
                	            					  }
                	            				  }
                	            			  }
                	            		  }
                	            	  }
//                	            	  tableDetail["dimTable"]=table.dimTable;
//                	            	  tableDetail["measures"]=table.measures;
//                	            	  tableDetail["filters"]=table.filters;
                	            	  //塞编号数字
                	            	  locals.set("wnumber",table.dimTable.length+2);
                	            	  locals.set("dnumber",table.measures.length+2);
                	            	  
                	            	  //拼接维度div样式
                	            	  var widthW = 0; //weiduDiv子元素宽度和
                	            	  var topW=3;
                	            	  for(var p=0;p<table.dimTable.length;p++){
                	            		  debugger;
                	            		  var newChild="";
                	            		  if(table.dimTable[p].nextflag==null){
                	            			  debugger;
                    	            		  newChild="<div id='weidu_div_"+(p+1)+"W' class='drag03' alt='"+JSON.stringify(table.dimTable[p])+"' name='"+table.dimTable[p].tableName+"' style='left: "+widthW+"px; top: "+topW+"px; z-index: "+(100000000+p+1)+"; position: absolute; cursor: default;'><span>"+table.dimTable[p].tableColumnCn+"</span><a delete='' class='fa fa-close font_colorW floatR' style='line-height:20px'></a></div>";                	            			  
                	            		  }
                	            		  if(table.dimTable[p].nextFlag=="1"){
                	            			  debugger;
                    	            		  newChild="<div id='weidu_div_"+(p+1)+"W' class='drag03' alt='"+JSON.stringify(table.dimTable[p])+"' name='"+table.dimTable[p].tableName+"' style='left: "+widthW+"px; top: "+topW+"px; z-index: "+(100000000+p+1)+"; position: absolute; cursor: default;'><a scroll-up='' class='fa fa-minus-square-o font_colorW' style='line-height:20px;margin-right: 5px;'></a><span>"+table.dimTable[p].tableColumnCn+"</span><a delete='' class='fa fa-close font_colorW floatR' style='line-height:20px'></a></div>";        	            			 
                	            		  }
                	            		  if(table.dimTable[p].nextFlag=="2"){
                    	            		  newChild="<div id='weidu_div_"+(p+1)+"W' class='drag03' alt='"+JSON.stringify(table.dimTable[p])+"' name='"+table.dimTable[p].tableName+"' style='left: "+widthW+"px; top: "+topW+"px; z-index: "+(100000000+p+1)+"; position: absolute; cursor: default;'><span>"+table.dimTable[p].tableColumnCn+"</span><a scroll-down='' class='fa fa-plus-square-o font_colorW' style='line-height:20px;margin-left: 5px;margin-right: 5px;'></a><a delete='' class='fa fa-close font_colorW floatR' style='line-height:20px'></a></div>";        	            			 
                	            		  }
                	            		  if(table.dimTable[p].nextFlag=="3"){
                    	            		  newChild="<div id='weidu_div_"+(p+1)+"W' class='drag03' alt='"+JSON.stringify(table.dimTable[p])+"' name='"+table.dimTable[p].tableName+"' style='left: "+widthW+"px; top: "+topW+"px; z-index: "+(100000000+p+1)+"; position: absolute; cursor: default;'><a scroll-up='' class='fa fa-minus-square-o font_colorW' style='line-height:20px;margin-right: 5px;'></a><span>"+table.dimTable[p].tableColumnCn+"</span><a scroll-down='' class='fa fa-plus-square-o font_colorW' style='line-height:20px;margin-left: 5px;margin-right: 5px;'></a><a delete='' class='fa fa-close font_colorW floatR' style='line-height:20px'></a></div>";        	            			 
                	            		  }
                	            		  debugger;
                	            		  var template = angular.element(newChild);
                	            		  debugger;
                	            		  var mobileDialogElement = $compile(template)($scope);
                	            		  debugger;
                	            		  angular.element("#weiduDiv").append(mobileDialogElement);
                	            		  debugger;
                	            		  var childObjW=document.getElementById("weiduDiv").childNodes;
                	            		  for(var n1=0;n1<childObjW.length;n1++){
                	            			  if(n1==childObjW.length-1){
                	            				  if(widthW<=500){
                	            					  console.log("widthW="+widthW+",childObj.width="+childObjW[n1].offsetWidth);
                    	            				  widthW=widthW+parseInt(childObjW[n1].offsetWidth)+3;
                	            				  }
                	            				  else{
                	            					  console.log("widthW="+widthW);
                    	            				  widthW=0;
                	            					  topW=topW+27;
                	            				  }
                	            				  
                	            			  }
                	            		  }
                	            		  
                	            		  debugger;
                	            		  //给echarts对象塞值
                	            		  var oNewW = {
                	                              "tableName": table.dimTable[p].tableName,
                	                              "tableColumn": table.dimTable[p].tableColumn
                	                          };//新的入参对象
                	            		  debugger;
                	            		  dimTable.push(oNewW);
                	            		  debugger;
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
                	            	  var topD=3;
                	            	  for(var q=0;q<table.measures.length;q++){
                	            		  debugger;
                	            		  var newChild="<div id='duliang_div_"+(q+1)+"D' class='drag03' alt='"+JSON.stringify(table.measures[q])+"' value='"+table.measures[q].factTableRule+"'  style='left: "+widthD+"px; top: "+topD+"px; z-index: "+(100000000+q+1)+"; position: absolute; cursor: default;'><a class='font_colorW fa fa-caret-down' style='margin-right:5px' table-rule=''></a><span>"+table.measures[q].tableColumnCn+"（"+table.measures[q].ruleName+"）"+"</span><a delete='' class='fa fa-close font_colorW floatR' style='line-height:20px'></a></div>";
                	            		  debugger;
                	            		  var template = angular.element(newChild);
                	            		  debugger;
                	            		  var mobileDialogElement = $compile(template)($scope);
                	            		  debugger;
                	            		  angular.element("#duliangDiv").append(mobileDialogElement);
                	            		  debugger;
                	            		  var childObjD=document.getElementById("duliangDiv").childNodes;
                	            		  for(var n2=0;n2<childObjD.length;n2++){
                	            			  if(n2==childObjD.length-1){
                	            				  if(widthD<=500){
                	            					  console.log("widthD="+widthD+",childObjD.width="+childObjD[n2].offsetWidth);
                    	            				  widthD=widthD+parseInt(childObjD[n2].offsetWidth)+3;
                	            				  }
                	            				  else{
                	            					  console.log("widthD="+widthD);
                    	            				  widthD=0;
                    	            				  topD=topD+27;
                	            				  }
                	            				  
                	            			  }
                	            		  }
                	            		  debugger;
                	            		  var oNewD = {
                	                              "tableName": table.measures[q].tableName,
                	                              "tableColumn": table.measures[q].tableColumn,
                	                              "factTableRule": table.measures[q].factTableRule
                	                          };//新的入参对象
                	                          debugger;
                	                          measures.push(oNewD);
                	                          debugger;
                	            		  //给左侧度量列加编号标记
                	            		  var leftPObj_D=document.getElementById("left_duliangTable").childNodes;
                	            		  for(var w=0;w<leftPObj_D.length;w++){
                	            			  debugger;
                	            			  if(leftPObj_D[w].nodeName=="P"){
                	            				  debugger;
                	            						  var leftAObj=leftPObj_D[w].childNodes;
                	            						  for(var x=0;x<leftAObj.length;x++){
                	            							  if(leftAObj[x].nodeName=="A"){
                	            								  debugger;
                	            								  var altObj=eval('(' + leftAObj[x].getAttribute("alt") + ')');
                	            								  if(altObj.tableColumn==table.measures[q].tableColumn && altObj.tableName==table.measures[q].tableName){
                	            									  debugger;
                	            									  leftAObj[x].setAttribute("id","aDuliang_div_"+(q+1));
                	            									  debugger;
                	            								  }
                	            							  }
                	            							  
                	            						  }
                	            			  }
                	            		  }
                	            	  }
                	            	  
                	            	//拼接筛选div样式
                	            	  widthS=0;//shaixuanDiv子元素宽度和
                	            	  var topS=3;
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
                    	            		  
                    	            		  debugger;
                    	            		  var newChild="";
                    	            		  if(table.filters[m].listFilters==null){
                    	            			  newChild="<div id='weidu_div_"+numberSW+"S' class='drag03' alt='"+JSON.stringify(table.filters[m])+"' name='"+table.filters[m].tableName+"'  style='left: "+widthS+"px; top: "+topS+"px; z-index: "+(100000000+m+1)+"; position: absolute; cursor: default;'><a class='font_colorW fa fa-caret-down ng-scope' style='margin-right:5px' open=''></a><span>"+table.filters[m].tableColumnCn+"</span><a delete='' class='fa fa-close font_colorW floatR' style='line-height:20px'></a></div>";
                    	            		  }
                    	            		  else{
                    	            			  var filtersObj=table.filters[m].listFilters;
                    	            			  var filtersStr="";
                    	            			  for(var a=0;a<filtersObj.length;a++){
                    	            				  filtersStr=filtersStr+filtersObj[a]+",";
                    	            			  }
                    	            			  newChild="<div id='weidu_div_"+numberSW+"S' class='drag03' alt='"+JSON.stringify(table.filters[m])+"' name='"+table.filters[m].tableName+"'  style='left: "+widthS+"px; top: "+topS+"px; z-index: "+(100000000+m+1)+"; position: absolute; cursor: default;' value='"+filtersStr+"'><a class='font_colorW fa fa-caret-down ng-scope' style='margin-right:5px' open=''></a><span>"+table.filters[m].tableColumnCn+"</span><a delete='' class='fa fa-close font_colorW floatR' style='line-height:20px'></a></div>";
                    	            		  }
                    	            		  
                    	            		  debugger;
                    	            		  var template = angular.element(newChild);
                    	            		  debugger;
                    	            		  var mobileDialogElement = $compile(template)($scope);
                    	            		  debugger;
                    	            		  angular.element("#shaixuanDiv").append(mobileDialogElement);
                    	            		  debugger;
                    	            		  var childObjS=document.getElementById("shaixuanDiv").childNodes;
                    	            		  for(var n4=0;n<childObjS.length;n4++){
                    	            			  if(n4==childObjS.length-1){
                    	            				  if(widthS<=500){
                    	            					  console.log("widthS="+widthS+",childObjS.width="+childObjS[n4].offsetWidth);
                        	            				  widthS=widthS+parseInt(childObjS[n4].offsetWidth)+3;
                    	            				  }
                    	            				  else{
                    	            					  console.log("widthS="+widthS);
                        	            				  widthS=0;
                    	            					  topS=topS+27;
                    	            				  }
                    	            				  
                    	            			  }
                    	            		  }
                    	            		  
                    	            		  if(isInWeidu==false){
                    	            			  numberSW++;
                    	            			  locals.set("wnumber",numberSW);
                    	            		  }
                    	            		  
                    	            		  debugger;
                    	            		  oNewS = {
                    	                                "tableType":"1",//代表筛选行里的维度还是度量
                    	                                "tableName": table.filters[m].tableName,
                    	                                "tableColumn": table.filters[m].tableColumn,
                    	                                "listFilters": table.filters[m].listFilters
                    	                            };//新的入参对象
                    	                            debugger;
                    	                            filters.push(oNewS);
                    	                            debugger;
                    	            		  
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
                    	            		  
                    	            		  debugger;
                    	            		  var newChild="";
                    	            		  if(table.filters[m].listFilters==null){
                    	            		  var newChild="<div id='duliang_div_"+numberSD+"S' class='drag03' alt='"+JSON.stringify(table.filters[m])+"' name='"+table.filters[m].factTableRule+"'  style='left: "+widthS+"px; top: "+topS+"px; z-index: "+(100000000+m+1)+"; position: absolute; cursor: default;'><a class='font_colorW fa fa-caret-down' style='margin-right:5px' open=''></a><span>"+table.filters[m].tableColumnCn+"（"+table.filters[m].ruleName+"）"+"</span><a delete='' class='fa fa-close font_colorW floatR' style='line-height:20px'></a></div>";
                    	            		  }
                    	            		  else{
                    	            			  var filtersObj=table.filters[m].listFilters;
                    	            			  var filtersStr="";
                    	            			  for(var a=0;a<filtersObj.length;a++){
                    	            				  filtersStr=filtersStr+filtersObj[a]+",";
                    	            			  }
                    	            			  newChild="<div id='duliang_div_"+numberSD+"S' class='drag03' alt='"+JSON.stringify(table.filters[m])+"' name='"+table.filters[m].factTableRule+"'  style='left: "+widthS+"px; top: "+topS+"px; z-index: "+(100000000+m+1)+"; position: absolute; cursor: default;' value='"+filtersStr+"'><a  class='font_colorW fa fa-caret-down' style='margin-right:5px' open=''></a><span>"+table.filters[m].tableColumnCn+"（"+table.filters[m].ruleName+"）"+"</span><a delete='' class='fa fa-close font_colorW floatR' style='line-height:20px'></a></div>";
                    	            		  
                    	            		  }
                    	            		  debugger;
                    	            		  var template = angular.element(newChild);
                    	            		  debugger;
                    	            		  var mobileDialogElement = $compile(template)($scope);
                    	            		  debugger;
                    	            		  angular.element("#shaixuanDiv").append(mobileDialogElement);
                    	            		  debugger;
                    	            		  var childObjS=document.getElementById("shaixuanDiv").childNodes;
                    	            		  for(var n6=0;n6<childObjS.length;n6++){
                    	            			  if(n6==childObjS.length-1){
                    	            				  if(widthS<=500){
                    	            					  console.log("widthS="+widthS+",childObjS.width="+childObjS[n6].offsetWidth);
                        	            				  widthS=widthS+parseInt(childObjS[n6].offsetWidth)+3;
                    	            				  }
                    	            				  else{
                    	            					  console.log("widthS="+widthS);
                        	            				  widthS=0;
                    	            					  topS=topS+27;
                    	            				  }
                    	            				  
                    	            			  }
                    	            		  }
                    	            		  
                    	            		  if(isInDuliang==false){
                    	            		  numberSD++;
                	            			  locals.set("dnumber",numberSD);
                    	            		  }
                    	            		  
                    	            		  debugger;
                    	            		  oNewS = {
                    	                                "tableType":"2",//代表筛选行里的度量
                    	                                "tableName": table.filters[m].tableName,
                    	                                "tableColumn": table.filters[m].tableColumn,
                    	                                "factTableRule":table.filters[m].factTableRule,
                    	                                "listFilters": table.filters[m].listFilters
                    	                            };//新的入参对象
                    	                            debugger;
                    	                            filters.push(oNewS);
                	            		  }
                	            		  //度量筛选结束
//                	            		 
                	            	  }
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
                                          console.log("传给后台的dataType="+tableDetail.tableDetail.dataType);
                                          console.log("传给后台的echartsObj=" + JSON.stringify(echartsObj));
                                          echartsDataType=tableDetail.tableDetail.dataType;
                                          debugger;
                                          //后台返回的json数据
                                            $http({
                                                method: "POST",
                                                url: ctx()+"/workTable/getKylinByCondition",
                                                data:JSON.stringify(echartsObj)
                                              }).success(function (freetrial) {
                                                var echartsData = freetrial;
                        			            //清除div内的元素
                                                angular.element("#echartsDiv").empty();
                                                console.log("返回对象："+JSON.stringify(echartsData));
                                                if (echartsData.success == true) {
                                                	 //******************table开始***********************
                                                	if(echartsDataType=="table"){
                                                		debugger;
                                                		//添加table
                                                		angular.element("#echartsDiv").append($compile("<table class='tableBoxStyle'></table>")($scope));
                                                		angular.element("#echartsDiv table").append($compile("<thead></thead>")($scope));
                                                		angular.element("#echartsDiv table").append($compile("<tbody></tbody>")($scope));
                                                		var dataObj=eval('(' + echartsData.data + ')');
                                                		for(var t=0;t<dataObj.length;t++){
                                                			if(t==0){
                                                				//添加表头
                                                				angular.element("#echartsDiv table thead").append($compile("<tr></tr>")($scope));
                                                				angular.element("#echartsDiv table tbody").append($compile("<tr></tr>")($scope));
                                                				for(var w=0;w<dataObj[t].length;w++){
                                                					if(dataObj[t][w].unit){
                                                						angular.element("#echartsDiv table thead").children("tr").last().append($compile("<td>"+dataObj[t][w].columnNameCn+"（"+dataObj[t][w].unit+"）"+"</td>")($scope));
                                                					}
                                                					else{
                                                						angular.element("#echartsDiv table thead").children("tr").last().append($compile("<td>"+dataObj[t][w].columnNameCn+"</td>")($scope));
                                                					}
                                                					
                                                					angular.element("#echartsDiv table tbody").children("tr").last().append($compile("<td>"+dataObj[t][w].value+"</td>")($scope));
                                                					
                                                				}
                                                				
                                                			}
                                                			else{
                                                				angular.element("#echartsDiv table tbody").append($compile("<tr></tr>")($scope));
                                                				for(var v=0;v<dataObj[t].length;v++){
                                                					
                                                					angular.element("#echartsDiv table tbody").children("tr").last().append($compile("<td>"+dataObj[t][v].value+"</td>")($scope));
                                                					
                                                				}
                                                				
                                                			}
                                                		}
                                                	}
                                                	//******************table结束*********************
                                                  //******************图表开始**********************
                                                    else{
                                                    	 if (echartsData.data.length == 1) {
                                                             //一维样式div
                                                             debugger;
                                                             for (var i = 0; i < echartsData.data[0].dataY.length; i++) {
                                                                 debugger;
                                                                 if (echartsData.data[0].dataY.length == 1) {
                                                               	  angular.element("#echartsDiv").append($compile("<div id='echartsDiv" + i + "' style='width:97%;height:100%'></div>")($scope));
                                                                     debugger;
                                                                 }
                                                                 else {
                                                               	  angular.element("#echartsDiv").append($compile("<div id='echartsDiv" + i + "'></div>")($scope));
                                                                     debugger;
                                                                 }
                                                                 debugger;
                                                                 var myChart = echarts.init(document.getElementById("echartsDiv" + i));
                                                                 var option = {
                                                                     backgroundColor: '#FFFFFF',
                                                                     grid: {
                                                                    	 containLabel: true
                                                                     },
                                                                     legend: {
                                                                         top: '20px',
//                                                                         left: '200px',
                                                                         data: echartsData.data[0].dataY[i].nameDuliang
                                                                     },
                                                                     tooltip: {
                                                                         axisPointer: {
                                                                             type: 'line'
                                                                         },
                                                                         trigger: 'axis',
                                                                         position: ['50%', '50%']
//                                                                    formatter: function (params) {
//                                                                        return params.name+"："+params.value;
//                                                                    }
                                                                     },
                                                                     xAxis: {

                                                                    type: 'category',
//                                                                    boundaryGap: false,
                                                                    data: echartsData.data[0].dataX,
                                                                    name: echartsData.data[0].nameWeidu,
                                                                    nameLocation: 'middle',
                                                                    nameGap: 20
                                                                },
                                                                yAxis: {
                                                               	 	name:"单位："+echartsData.data[0].dataY[i].unitDuliang,
                                                                    axisLabel: {
                                                                        formatter: '{value}' //+ echartsData.data[0].dataY[i].unitDuliang
                                                                    }
                                                                },
                                                                series: {
                                                                    name: echartsData.data[0].dataY[i].nameDuliang,
                                                                    type: echartsData.data[0].dataY[i].dataType,
                                                                    data: echartsData.data[0].dataY[i].data_y
                                                                }
                                                            };
                                                            myChart.setOption(option);
                                                            debugger;

                                                        }
                                                    }
                                                    else {
                                                    	if(echartsData.data[0][0].nameWeidu==null){
                                                    		alert("无数据");
                                                    	}
                                                    	else{
                                                    		//多维样式table
                                                            //加table
                                                    		angular.element("#echartsDiv").append($compile("<table></table>")($scope));
                                                            debugger;
                                                            //一个维度一行一行的循环
                                                            for (var j = 0; j < echartsData.data.length; j++) {
                                                                var isAxisShowX02 = false;//是否显示x轴刻度和标签
                                                                debugger;
                                                                var bottomX02 = '0';
                                                                debugger;
                                                                var isAxisShowY02 = false;//是否显示y轴刻度和标签
                                                                var leftY02 = '-3px';
                                                                var containLabelY02=false;
                                                                debugger;
                                                                if (j == echartsData.data.length - 1) {//最后一维度
                                                                    debugger;
                                                                    //多个度量
                                                                    for (var p = 0; p < echartsData.data[j][0].dataY.length; p++) {
                                                                        //加行
                                                                        if (p == echartsData.data[j][0].dataY.length - 1) {
                                                                      	  angular.element("#echartsDiv table").append($compile("<tr class='haveAxisTickX'></tr>")($scope));
                                                                            debugger;
                                                                            isAxisShowX02 = true;
                                                                            debugger;
                                                                            bottomX02 = '25%';
                                                                            debugger;
                                                                        }
                                                                        else {
                                                                      	  angular.element("#echartsDiv table").append($compile("<tr></tr>")($scope));
                                                                            debugger;
                                                                            isAxisShowX02 = false;//是否显示x轴刻度和标签
                                                                            debugger;
                                                                            bottomX02 = '0';
                                                                            debugger;
                                                                        }
                                                                        //加度量名称
                                                                        angular.element("#echartsDiv table").find("tr").each(function (index) {
                                                                            if (index == j + p) {
                                                                                $(this).append($compile("<td style='width:40px;'><span>" + echartsData.data[j][0].dataY[p].nameDuliang + "</span></td>")($scope));
                                                                                debugger;
                                                                            }
                                                                        });
                                                                        debugger;
                                                                        debugger;
                                                                        for (var q = 0; q < echartsData.data[j].length; q++) {
                                                                            debugger;
                                                                            angular.element("#echartsDiv table").find("tr").each(function (index) {
                                                                                if (index == j + p) {
                                                                                    //调宽度样式
                                                                                    if (echartsData.data[j].length < 4) {
                                                                                        //判断是否为第一格
                                                                                        if (q == 0) {
                                                                                            $(this).append($compile("<td class='haveAxisTickY'><div id='echartsDiv" + (p + 1) + "_" + (q + 1) + "'  style='width:" + 800 / echartsData.data[j].length + "px;height:160px;'></div></td>")($scope));
                                                                                            debugger;
                                                                                            isAxisShowY02 = true;
                                                                                            debugger;
                                                                                            leftY02 = '18%';
                                                                                            containLabelY02=false;
                                                                                            debugger;
                                                                                        }
                                                                                        else {
                                                                                            $(this).append($compile("<td><div id='echartsDiv" + (p + 1) + "_" + (q + 1) + "'  style='width:" + 800 / echartsData.data[j].length + "px;height:160px;'></div></td>")($scope));
                                                                                            debugger;
                                                                                            isAxisShowY02 = false;
                                                                                            debugger;
                                                                                            leftY02 = '0';
                                                                                            debugger;
                                                                                        }
                                                                                    }
                                                                                    else {
                                                                                        //判断是否为第一格
                                                                                        if (q == 0) {
                                                                                            $(this).append($compile("<td class='haveAxisTickY'><div id='echartsDiv" + (p + 1) + "_" + (q + 1) + "' style='width:250px;height:160px;' ></div></td>")($scope));
                                                                                            debugger;
                                                                                            isAxisShowY02 = true;
                                                                                            debugger;
                                                                                            leftY02 = '18%';
                                                                                            containLabelY02=false;
                                                                                            debugger;
                                                                                        }
                                                                                        else {
                                                                                            $(this).append($compile("<td><div id='echartsDiv" + (p + 1) + "_" + (q + 1) + "' style='width:250px;height:160px;'></div></td>")($scope));
                                                                                            debugger;
                                                                                            isAxisShowY02 = false;
                                                                                            debugger;
                                                                                            leftY02 = '0';
                                                                                            debugger;
                                                                                        }
                                                                                    }
                                                                                }
                                                                            });
                                                                            debugger;
                                                                            var myChart02 = echarts.init(document.getElementById("echartsDiv" + (p + 1) + "_" + (q + 1)));
                                                                            var option02 = {
                                                                                grid: {
                                                                                	containLabel: containLabelY02,
                                                                                    left: leftY02,
                                                                                    top: '10px',
                                                                                    right: '0',
                                                                                    bottom: bottomX02
                                                                                },
                                                                                tooltip: {
                                                                                    axisPointer: {
                                                                                        type: 'line'
                                                                                    },
                                                                                    trigger: 'axis',
                                                                                    formatter: '{b}:{c}' + echartsData.data[j][q].dataY[p].unitDuliang
                                                                                },
                                                                                xAxis: {
                                                                                    splitLine: {
                                                                                        show: false
                                                                                    },
                                                                                    name: echartsData.data[j][q].nameWeidu,
                                                                                    nameGap: 20,
                                                                                    nameLocation: 'middle',
                                                                                    nameTextStyle: {
                                                                                        color: '#333333'
                                                                                    },
                                                                                    type: 'category',
                                                                                    data: echartsData.data[j][q].dataX,
                                                                                    axisLabel: {
                                                                                        show: isAxisShowX02,
                                                                                        margin: 4,
                                                                                        textStyle: {
                                                                                            color: '#333333'
                                                                                        }
                                                                                    },
                                                                                    axisTick: {show: true, inside: true},
                                                                                    axisLine: {
                                                                                        show: isAxisShowX02,
                                                                                        lineStyle: {
                                                                                            color: "#CDCDCD"
                                                                                        }
                                                                                    }
                                                                                },

                                                                                yAxis: {
                                                                                    splitLine: {
                                                                                    	show: true,
                                                                                    	lineStyle: {
                                                                                    	type: 'dashed'
                                                                                    	}
                                                                                    },
                                                                                    axisLabel: {                                                                                        show: isAxisShowY02,
                                                                                        margin: 4,
                                                                                        textStyle: {
                                                                                            color: '#333333'
                                                                                        }
                                                                                    },
                                                                                    axisTick: {show: true, inside: true},
                                                                                    axisLine: {
                                                                                        show: isAxisShowY02,
                                                                                        lineStyle: {
                                                                                            color: "#CDCDCD"
                                                                                        }
                                                                                    },
                                                                                    min:0,
                                                                                    max:echartsData.data[j][q].dataY[p].maxY
                                                                                },
                                                                                series: [{
                                                                                    name: echartsData.data[j][q].dataY[p].nameDuliang,
                                                                                    type: echartsData.data[j][q].dataY[p].dataType,
                                                                                    data: echartsData.data[j][q].dataY[p].data_y
                                                                                }]
                                                                            };
                                                                            myChart02.setOption(option02);
                                                                            debugger;
                                                                        }

                                                                    }


                                                                }
                                                                else {
                                                                    debugger;
                                                                    //加行
                                                                    angular.element("#echartsDiv table").append($compile("<tr class='xHead' style='height: 20px'></tr>")($scope));
                                                                    debugger;
                                                                    //加维度名称
                                                                    $("#echartsDiv table").find("tr").each(function (index) {
                                                                        if (index == j) {
                                                                            $(this).append($compile("<td style='width:40px;'><strong>" + echartsData.data[j][0].nameWeidu + "</strong></td>")($scope));
                                                                            debugger;
                                                                        }
                                                                    });
                                                                    //加维度值
                                                                    for (var m = 0; m < echartsData.data[j].length; m++) {
                                                                  	  angular.element("#echartsDiv table").find("tr").each(function (index) {
                                                                            if (index == j) {
                                                                                if (echartsData.data[j][m].colspan == 1) {
                                                                                    $(this).append($compile("<td><strong>" + echartsData.data[j][m].valueName + "</strong></td>")($scope));
                                                                                    debugger;
                                                                                }
                                                                                else {
                                                                                    $(this).append($compile("<td colspan='" + echartsData.data[j][m].colspan + "'><strong>" + echartsData.data[j][m].valueName + "</strong></td>")($scope));
                                                                                    debugger;
                                                                                }

                                                                                 }
                                                                             });
                                                                         }
                                                                     }
                                                                 }
                                                         	}
                                                             
                                                         }
                                                    
                                                       }
                                                	//******************图表结束***********************

                                                }
                                                else {
                                                    alert("无数据！");
                                                }
                        					  
                                            }).error(function (freetrial) {
                                                alert("获取数据失败！");
                                            });
         	            	 
                	              }).error(function(table) {
                	                  alert("查询异常！");
                	              });
                			  
                			 
                                 
                                  
                                 
                		  }
                	  }
            	  }
//            	$scope.cubeListGifUrl="";
                $scope.tables = freetrial;
                console.log("返回的cubeList数据："+JSON.stringify($scope.tables));
                
              //判断是否点击搜索,点击了伸缩框就不能收起
                isSearch.isSearch=true;
                locals.setObject("isSearch",isSearch);
                
              
   		  //隐藏维度和度量框
   		     if($scope.weiDu && $scope.duLiang){
   		    	angular.element("#left_weiduTable").css({"height":"0px","padding":"0px"});
   		    	angular.element("#left_duliangTable").css({"height":"0px","padding":"0px"});
   		     }
   		     angular.element("#left_weiduTable").prev("div[class='left_tab']").find("span").css("color","#cccccc");
   		     
   		    angular.element("#left_duliangTable").prev("div[class='left_tab']").find("span").css("color","#cccccc");
                debugger;
              })
              .error(function(freetrial, status, headers, config) {
                 alert("查询异常！");
              });
//        };
    };

    // /*数据表选择，获取维度和度量列表*/
    $scope.change = function (table) {
        if (table != null) {

            //传入给后台的所选择cube表的对象参数
            var cubeObj = table;
            // alert(JSON.stringify($scope.myTable));

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
//                      if(tableDetail.tableDetail==null){
                      debugger;
                      var childObj01=document.getElementById("weiduDiv").childNodes;
                      console.log("weiduDivChild:"+document.getElementById("weiduDiv").childNodes.length);
                      if(document.getElementById("weiduDiv").childNodes.length>0){
                        var i=0;
                        while(i<childObj01.length){
                    	  debugger;
                          childObj01[0].parentNode.removeChild(childObj01[0]); 
                          debugger;
                        }  
                      }
                      var childObj02=document.getElementById("duliangDiv").childNodes;
                      console.log("duliangDivChild:"+document.getElementById("duliangDiv").childNodes.length);
                      if(document.getElementById("duliangDiv").childNodes.length>0){
                    	  var j=0;
                    	  while(j<childObj02.length){
                        	  debugger;
                        	  childObj02[0].parentNode.removeChild(childObj02[0]); 
                              debugger;
                            }
                      }
                      var childObj03=document.getElementById("shaixuanDiv").childNodes;
                      console.log("shaixuanDivChild:"+document.getElementById("shaixuanDiv").childNodes.length);
                      if(document.getElementById("shaixuanDiv").childNodes.length>0){
                    	  var k=0;
                    	  while(k<childObj03.length){
                        	  debugger;
                        	  childObj03[0].parentNode.removeChild(childObj03[0]); 
                              debugger;
                            }
                      }
                      var childObj04=document.getElementById("echartsDiv").childNodes;
                      console.log("echartsDivChild:"+document.getElementById("echartsDiv").childNodes.length);
                      if(document.getElementById("echartsDiv").childNodes.length>0){
                    	  var n=0;
                    	  while(n<childObj04.length){
                        	  debugger;
                        	  childObj04[0].parentNode.removeChild(childObj04[0]); 
                              debugger;
                            }
                      }
                      
//                      }
                      //給维度和度量赋值
                      $scope.weiDu = freetrial.data.listDim;
                      
//                      alert(JSON.stringify(freetrial.data.listDim));
                      $scope.duLiang = freetrial.data.listFact;
                      
                      
                      
                      
                  }
           	   
           	   
              }).error(function (freetrial) {
                alert("获取数据失败！");
            })
        }
    };


});


//写jQuery拖拽指令
zztzApp.directive('draggable', function ($document, $compile,locals) {
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
                                // alert("wnumber_dragged="+wnumber);
                            }

                            element.parent("p").next("p").children("a").attr("id", "aWeidu_div_" + aNumW);

                            debugger;
                            text = element.parent("p").next("p").find("a").text();
                            element.parent("p").next("p").after($compile(
                                "<div " + "id='weidu_div_" + aNumW + "' " + "class='drag02'></div>"
                            )(scope));
                            debugger;
                            element.parent("p").next("p").next("div[id*='weidu_div']").append($compile("<span>" + text + "</span>")(scope));
                            debugger;
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
                                //alert("wnumber_dragged="+wnumber);
                            }

                            element.attr("id", "aWeidu_div_" + aNumW);

                            //复制一个被拖拽元素div
                            text = element.text();
                            element.parent("p").after($compile(
                                "<div " + "id='weidu_div_" + aNumW + "' " + "class='drag02'></div>"
                            )(scope));

                            element.parent("p").next("div[id*='weidu_div']").append($compile("<span>" + text + "</span>")(scope));
                            debugger;
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
                        	if(widthW<=500){
                        		widthW = widthW + $(this).width() + 15;
                        	}
                        	else{
                        		widthW=0;
                        	}
                            
                        });
                        $("#shaixuanDiv").children("div").each(function (index) {
                        	if(widthS<=500){
                                widthS = widthS + $(this).width() + 15;
                        	}
                        	else{
                        		widthS=0;
                        	}
                        });

                        if (oYW >= 40 && oYW <= 80) {
                            oYW = 60;
                            isOpenBoxW=true;
                        }

                        if (oYW >= 120 && oYW <= 150) {
                            oYW = 130;
                            isOpenBoxSW=true;
                        }

                        
                        if (oYW == 60  && isOpenBoxW==true) {
                        	//展开框
                        	var topNumWW=0;
                    		angular.element("#weiduDiv").children("div").not("div[id*='_box']").each(function () {
                    			if($(this).css("left")=="0px"){
                    				topNumWW++;
                    			}
                    		});
                    		if(topNumWW>1){
                    			oYW=oYW+27*(topNumWW-1);
                    			var zIndexWW=100000010;
                    			angular.element("#weiduDiv").siblings("div").each(function(){
                        			$(this).children("div").not("div[id*='_box']").each(function () {
                        			if($(this).css("z-index")>zIndexWW){
                        				zIndexWW=parseInt($(this).css("z-index"));
                        			}
                        		});
                        		});
                    			angular.element("#weiduDiv").css({
                        			"border": "1px solid #ff2626",
                        	        "width": "87%",
                        	        "height": 28*topNumWW+"px",
                        	        "float": "none",
                        	        "position": "absolute",
                        	        "left": "84px",
                        	        "top": "22px",
                        	        "background": "#ffffff",
                        	        "z-index": zIndexWW+1
                        		})
                        		angular.element("#weiduDiv").prev("span").css({
                        		    "display": "block",
                        		    "height":"20px",
                        	        "float": "none",
                        	        "border": "0px",
                        	        "color":"#ff2626",
                        	        "font-weight":"bold"
                        		});
                    			angular.element("#weiduDiv").stop();
                    		}
                    		
                            if (oXW >= widthW + 310 && oXW <= widthW + 370) {
                                oXW = 340 + widthW;
                            }
                        }else if (oYW == 130 && isOpenBoxSW==true) {
                        	//展开框
                        	var topNumWS=0;
                        	angular.element("#shaixuanDiv").children("div").not("div[id*='_box']").each(function () {
                    			if($(this).css("left")=="0px"){
                    				topNumWS++;
                    			}
                    		});
                    		if(topNumWS>1){
                    			oYW=oYW+27*(topNumWS-1);
                    			var zIndexWS=100000010;
                    			angular.element("#weiduDiv").siblings("div").each(function(){
                        			$(this).children("div").not("div[id*='_box']").each(function () {
                        			if($(this).css("z-index")>zIndexWS){
                        				zIndexWS=parseInt($(this).css("z-index"));
                        			}
                        		});
                        		});
                    			angular.element("#shaixuanDiv").css({
                        			"border": "1px solid #ff2626",
                        	        "width": "87%",
                        	        "height": 28*topNumWS+"px",
                        	        "float": "none",
                        	        "position": "absolute",
                        	        "left": "84px",
                        	        "top": "85px",
                        	        "background": "#ffffff",
                        	        "z-index": zIndexWS+1
                        		})
                        		angular.element("#shaixuanDiv").prev("span").css({
                        		    "display": "block",
                        		    "height":"20px",
                        	        "float": "none",
                        	        "border": "0px",
                        	        "color":"#ff2626",
                        	        "font-weight":"bold"
                        		});
                    			angular.element("#shaixuanDiv").stop();
                    		}
                            if (oXW >= widthS + 310 && oXW <= widthS + 370) {
                                oXW = 340 + widthS;
                            }
                        }else{
                        	angular.element("#weiduDiv").removeAttr("style");
                        	angular.element("#weiduDiv").prev("span").removeAttr("style");
                        	angular.element("#shaixuanDiv").removeAttr("style");
                        	angular.element("#shaixuanDiv").prev("span").removeAttr("style");
                        	isOpenBoxW=false;
                        	isOpenBoxSW=false;
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
                    var topW=3;//weiduDiv子元素离上面的距离
                    var topS=3;//shaixuanDiv子元素离上面的距离
                    //维度拖拽目标
                    //求宽度和
                    $("#weiduDiv").children("div").each(function () {
                    	if(widthW<=500){
                    		widthW = widthW + $(this).width() + 15;
                    	}
                    	else{
                    		widthW=0;
                    		topW=topW+27;
                    	}
                        
                    });
                    $("#shaixuanDiv").children("div").not("div[id*='_box']").each(function () {
                    	if(widthS<=500){
                            widthS = widthS + $(this).width() + 15;
                    	}
                    	else{
                    		widthS=0;
                    		topS=topS+27;
                    	}
                    });

                    if (oYW == 60 || isOpenBoxW==true) {
                        var oldDivId = $("#left_weiduTable").find("p").next("div[id*='weidu_div']").attr("id"); //div标签的旧ID值
                        $("#left_weiduTable").find("p").next("div[id*='weidu_div']").attr("id", oldDivId + "W"); //给DIV标记新的ID值
                        $("#weiduDiv").append($compile($("#left_weiduTable").find("p").next("div[id*='weidu_div']"))(scope));
                        $("#weiduDiv").children("div").last().css({
                            "left": widthW + "px",
                            "top": topW+"px",
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
                    else if (oYW == 130  || isOpenBoxSW==true) {
                        var oldDivId = $("#left_weiduTable").find("p").next("div[id*='weidu_div']").attr("id"); //div标签的旧ID值
                        $("#left_weiduTable").find("p").next("div[id*='weidu_div']").attr("id", oldDivId + "S"); //给DIV标记新的ID值
                        $("#shaixuanDiv").append($compile($("#left_weiduTable").find("p").next("div[id*='weidu_div']"))(scope));
                        // .appendTo("#shaixuanDiv");
                        $("#shaixuanDiv").children("div").last().css({
                            "left": widthS + "px",
                            "top": topS+"px",
                            "cursor": "default"
                        });
                        $("#shaixuanDiv").children("div").last().prepend($compile(
                            "<a class='font_colorW fa fa-caret-down' style='margin-right:5px' open=''></a>"
                        )(scope)); //加上A标签包裹
                        //将span标签放在a标签里
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
                            $("#shaixuanDiv").children("div").last().attr("alt", element.next("p").find("a").attr("alt"));
                            //将维度条件里的维度表名称，传给筛选框里的条件
                            $("#shaixuanDiv").children("div").last().attr("name", element.next("p").find("a").attr("name"));
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
                    angular.element("#weiduDiv").prev("span").removeAttr("style");
                    angular.element("#weiduDiv").removeAttr("style");
                    angular.element("#shaixuanDiv").prev("span").removeAttr("style");
                	angular.element("#shaixuanDiv").removeAttr("style");
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
                        // alert("dnumber_dragged="+dnumber);
                    }
                        element.attr("id", "aDuliang_div_" + aNumD);
                        // alert("aNumD="+aNumD);


                    //复制一个被拖拽元素div
                    var text = element.text();
                    element.parent("p").after($compile(
                        "<div " + "id='duliang_div_" + aNumD + "' " + "class='drag02'></div>"
                    )(scope));

                    element.parent("p").next("div[id*='duliang_div']").append($compile("<span>" + text + "</span>")(scope));
                    debugger;
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
                        	if(widthD<=500){
                                widthD = widthD + $(this).width() + 15;
                        	}
                        	else{
                        		widthD=0;
                        	}
                        });
                        $("#shaixuanDiv").children("div").each(function (index) {
                        	if(widthS<=500){
                                widthS = widthS + $(this).width() + 15;
                        	}
                        	else{
                        		widthS=0;
                        	}
                        });

                        if (oYD >= 85 && oYD <= 110) {
                        	isOpenBoxD=true;
                            oYD = 95;
                            debugger;
                        }

                        if (oYD >= 120 && oYD <= 150) {
                        	isOpenBoxSD=true;
                            oYD = 130;
                            debugger;
                        }

                        if (oYD == 95 || isOpenBoxD==true) {
                        	debugger;
                        	//展开框
                        	var topNumDD=0;
                    		angular.element("#duliangDiv").children("div").not("div[id*='_box']").each(function () {
                    			if($(this).css("left")=="0px"){
                    				topNumDD++;
                    			}
                    		});
                    		if(topNumDD>1){
                    			oYD=oYD+27*(topNumDD-1);
                    			var zIndexDD=100000010;
                    			angular.element("#duliangDiv").siblings("div").each(function(){
                        			$(this).children("div").not("div[id*='_box']").each(function () {
                        			if($(this).css("z-index")>zIndexDD){
                        				zIndexDD=parseInt($(this).css("z-index"));
                        			}
                        		});
                        		});
                    			angular.element("#duliangDiv").css({
                        			"border": "1px solid #ff2626",
                        	        "width": "87%",
                        	        "height": 28*topNumDD+"px",
                        	        "float": "none",
                        	        "position": "absolute",
                        	        "left": "84px",
                        	        "top": "51px",
                        	        "background": "#ffffff",
                        	        "z-index": zIndexDD+1
                        		})
                        		angular.element("#duliangDiv").prev("span").css({
                        		    "display": "block",
                        		    "height":"20px",
                        	        "float": "none",
                        	        "border": "0px",
                        	        "color":"#ff2626",
                        	        "font-weight":"bold"
                        		});
                    			angular.element("#duliangDiv").stop();
                    		}
                            if (oXD >= widthD + 310 && oXD <= widthD + 370) {
                                oXD = 340 + widthD;
                            }
                        }else if (oYD == 130 || isOpenBoxSD==true) {
                        	debugger;
                        	//展开框
                        	var topNumDS=0;
                        	angular.element("#shaixuanDiv").children("div").not("div[id*='_box']").each(function () {
                    			if($(this).css("left")=="0px"){
                    				topNumDS++;
                    			}
                    		});
                    		if(topNumDS>1){
                    			oYD=oYD+27*(topNumDS-1);
                    			var zIndexDS=100000010;
                    			angular.element("#shaixuanDiv").siblings("div").each(function(){
                        			$(this).children("div").not("div[id*='_box']").each(function () {
                        			if($(this).css("z-index")>zIndexDS){
                        				zIndexDS=parseInt($(this).css("z-index"));
                        			}
                        		});
                        		});
                    			angular.element("#shaixuanDiv").css({
                        			"border": "1px solid #ff2626",
                        	        "width": "87%",
                        	        "height": 28*topNumDS+"px",
                        	        "float": "none",
                        	        "position": "absolute",
                        	        "left": "84px",
                        	        "top": "85px",
                        	        "background": "#ffffff",
                        	        "z-index": zIndexDS+1
                        		})
                        		angular.element("#shaixuanDiv").prev("span").css({
                        		    "display": "block",
                        		    "height":"20px",
                        	        "float": "none",
                        	        "border": "0px",
                        	        "color":"#ff2626",
                        	        "font-weight":"bold"
                        		});
                    			angular.element("#shaixuanDiv").stop();
                    		}
                            if (oXD >= widthS + 310 && oXD <= widthS + 370) {
                                oXD = 340 + widthS;
                            }
                        }else{
                        	angular.element("#duliangDiv").removeAttr("style");
                        	angular.element("#duliangDiv").prev("span").removeAttr("style");
                        	angular.element("#shaixuanDiv").removeAttr("style");
                        	angular.element("#shaixuanDiv").prev("span").removeAttr("style");
                        	isOpenBoxD=false;
                        	isOpenBoxSD=false;
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
                    var topD=3;//duliangDiv子元素离上面的距离
                    var topS=3;//shaixuanDiv子元素离上面的距离

                    //度量拖拽目标
                    $("#duliangDiv").children("div").not("div[id*='_box']").each(function () {
                    	if(widthD<=500){
                    		 widthD = widthD + $(this).width() + 15;
                    	}
                    	else{
                    		widthD=0;
                    		topD=topD+27;
                    	}
                       
                    });
                    $("#shaixuanDiv").children("div").not("div[id*='_box']").each(function () {
                    	if(widthS<=500){
                            widthS = widthS + $(this).width() + 15;
                    	}
                    	else{
                    		widthS = 0;
                    		topS=topS+27;
                    	}
                    });

                    if (oYD == 95|| isOpenBoxD==true) {
                    	debugger;
                        var oldDivId = $("#left_duliangTable").children("p").next("div[id*='duliang_div']").attr("id"); //div标签的旧ID值
                        $("#left_duliangTable").children("p").next("div[id*='duliang_div']").attr("id", oldDivId + "D"); //给DIV标记新的ID值
                        $("#duliangDiv").append($compile($("#left_duliangTable").children("p").next("div[id*='duliang_div']"))(scope));
                        // .appendTo("#duliangDiv");
                        $("#duliangDiv").children("div").last().css({
                            "left": widthD + "px",
                            "top": topD+"px",
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
                    }
                    else if (oYD == 130|| isOpenBoxSD==true) {
                    	debugger;
                        var oldDivId = $("#left_duliangTable").children("p").next("div[id*='duliang_div']").attr("id"); //div标签的旧ID值
                        $("#left_duliangTable").children("p").next("div[id*='duliang_div']").attr("id", oldDivId + "S"); //给DIV标记新的ID值
                        $("#shaixuanDiv").append($compile($("#left_duliangTable").children("p").next("div[id*='duliang_div']"))(scope));
                        $("#shaixuanDiv").children("div").last().css({
                            "left": widthS + "px",
                            "top": topS+"px",
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
                        $("#shaixuanDiv").children("div").last().find("span").text(oldText+"（"+altObj.rules[0].ruleName+"）");
                        $("#shaixuanDiv").children("div").last().attr("name",altObj.rules[0].factTableRule);
                        
                        $("#shaixuanDiv").children("div").last().append($compile(
                            "<a delete='' class='fa fa-close font_colorW floatR' style='line-height:20px'></a>"
                        )(scope));
                        $("#shaixuanDiv").children("div").last().removeClass("drag02");
                        $("#shaixuanDiv").children("div").last().addClass("drag03");

                        //将维度条件里的对象，传给筛选框里的条件
                        $("#shaixuanDiv").children("div").last().attr("alt", element.attr("alt"));
                        // alert("shaixuanDiv.alt="+$("#shaixuanDiv").children("div").last().attr("alt"));

                    }
                    else {
                       element.parent("p").next("div[id*='duliang_div']").remove();
                        zIndex--;

                    }
                    angular.element("#duliangDiv").prev("span").removeAttr("style");
                    angular.element("#duliangDiv").removeAttr("style");
                    angular.element("#shaixuanDiv").prev("span").removeAttr("style");
                	angular.element("#shaixuanDiv").removeAttr("style");
                    
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
zztzApp.directive('open', function ($http, $compile) {
    return {
        scope: false,
        restrict: 'A',
        link: function (scope, element, attr) {
            element.on("click", function () {
                debugger;
                if (element.parent("div").attr("id").indexOf("weidu_div") >= 0) {
                    debugger;
                    scope.isWeiduShaixuan = "维度";
                }
                if (element.parent("div").attr("id").indexOf("duliang_div") >= 0) {
                    debugger;
                    scope.isWeiduShaixuan = "度量";
                }

                //处理维度不一样的东西***********************************
                if (scope.isWeiduShaixuan == "维度") {
                    //将box页头换成对应页头
                    debugger;
                    element.parents("#main_zztz").next("#tipBoxW").find("#tipTitleW").text(scope.isWeiduShaixuan);

                    //标注弹出框来源
                    element.parents("#main_zztz").next("#tipBoxW").attr("value", element.parent("div").attr("id"));

                    //入参需要的对象信息
                    debugger;
                    var obj = eval('(' + element.parent("div").attr("alt") + ')');
                    //入参******
                    debugger;
                    var weidu = {
                        "tableName": obj.tableName,
                        "tableColumn": obj.tableColumn
                    }
                    console.log("筛选值范围入参：" + JSON.stringify(weidu));
                    //获取维度列表
                    debugger;
                    $http({
                        method: "POST",
                        url: ctx()+"/workTable/queryByCondition",
                        params:weidu
                      }).success(function (data) {
                    	  
                            debugger;
                            console.log(JSON.stringify(data));
                            scope.weiduList=data;
                            if(scope.weiduList.success==true){
                            	if(scope.weiduList.data!=null && scope.weiduList.data.resultSet.length>0){
                                    //去除旧的筛选值项
                                    debugger;
                                    if(element.parents("#main_zztz").next("#tipBoxW").find("ul").children("li")){
                                        debugger;
                                        element.parents("#main_zztz").next("#tipBoxW").find("ul").html("");
                                    }
                                    //展示新的筛选值项
                                    debugger;
                                    element.parents("#main_zztz").next("#tipBoxW").find("div[class='selected']").children("span").text(scope.weiduList.data.resultSet[0]);
                                    for(var i=0;i<scope.weiduList.data.resultSet.length;i++){
                                        debugger;
                                        element.parents("#main_zztz").next("#tipBoxW").find("ul").append($compile("<li><input type='checkbox' value='"+scope.weiduList.data.resultSet[i]+"'/><span>"+scope.weiduList.data.resultSet[i]+"</span></li>")(scope));
                                        element.parents("#main_zztz").next("#tipBoxW").find("ul").find("li:last").children("span").attr("title",scope.weiduList.data.resultSet[i]);
                                    }

                                    //判断是否之前已经选择过
                                    debugger;
                                    if(element.parent("div").attr("value")){
                                        debugger;
                                        var checkObj=element.parent("div").attr("value").split(",");
                                        debugger;
                                    element.parents("#main_zztz").next("#tipBoxW").find("ul").children("li").each(function(){
                                        debugger;
                                        var thisValue=$(this).children("input[type='checkbox']").attr("value");
                                        debugger;
                                        for(var i=0;i<checkObj.length;i++){
                                            if(thisValue==checkObj[i]){
                                                debugger;
                                                $(this).children("input[type='checkbox']").prop("checked", true);
                                            }
                                        }
                                    })
                                    }
                                    
                                 
                                }
                                else{
                                    debugger;
                                    alert("该维度列没有值!");
                                }
                            }
                            else{
                            	alert("获取数据异常");
                            }
                            



                        }).error(function(){
                            debugger;
                            alert("获取数据失败");
                        });
                    //维度一级弹出框
                    //判断是否第一次打开
               	if(element.parent("div").next("div[class*='drag04Box']").attr('class')){
               		debugger;
               		if(element.parent("div").next("div[class*='drag04Box']").css("display")=="none"){
               			element.parent("div").removeClass("drag03");
                       	element.parent("div").addClass("drag04");
                       	element.attr("class","font_colorW fa fa-caret-up");
                       	debugger;
               			element.parent("div").next("div[class*='drag04Box']").slideDown(100);
                       	debugger;
               			
               		}
               		else{
               			element.parent("div").next("div[class*='drag04Box']").slideUp(100);
                       	debugger;
                       	element.attr("class","font_colorW fa fa-caret-down");
                       	element.parent("div").removeClass("drag04");
                       	element.parent("div").addClass("drag03");
                       	debugger;
               		}
               		
               	}
               	else{
                   var number=element.parent("div").attr("id").replace(/[^0-9]/ig, "");
               	var widthDiv=element.parent("div").width();
               	var leftDiv=element.parent("div").css("left");
               	element.parent("div").after($compile("<div id='duliang_div_"+number+"S_box' class='drag04Box' style='width:"+widthDiv+"px;left:"+leftDiv+";display:none;'></div>")(scope));
               	debugger;
                  
                   element.parent("div").next("div[id*='_box']").append($compile("<p><a weidu-tip-c=''>维度值范围</a></p>")(scope));
                   debugger;
               	element.parent("div").removeClass("drag03");
               	element.parent("div").addClass("drag04");
               	element.attr("class","font_colorW fa fa-caret-up");
               	debugger;
               	element.parent("div").next("div[class*='drag04Box']").slideDown(100);
               	debugger;
               	}

                    

                }

                //处理度量不一样的东西***********************************
                if (scope.isWeiduShaixuan == "度量") {
                	//度量二级弹出框准备
                	//清空旧数据
                	element.parents("#main_zztz").nextAll("#tipBoxD").find("#tipTitleD").find("input").val("");
                        //将box页头换成对应页头
                        debugger;
                        element.parents("#main_zztz").nextAll("#tipBoxD").find("#tipTitleD").text(scope.isWeiduShaixuan);

                        //标注弹出框来源
                        element.parents("#main_zztz").nextAll("#tipBoxD").attr("value", element.parent("div").attr("id"));
                        debugger;
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
                        
                        //度量一级弹出框
                         //判断是否第一次打开
                    	if(element.parent("div").next("div[class*='drag04Box']").attr('class')){
                    		debugger;
                    		if(element.parent("div").next("div[class*='drag04Box']").css("display")=="none"){
                    			element.parent("div").removeClass("drag03");
                            	element.parent("div").addClass("drag04");
                            	element.attr("class","font_colorW fa fa-caret-up");
                            	debugger;
                    			element.parent("div").next("div[class*='drag04Box']").slideDown(100);
                            	debugger;
                    			
                    		}
                    		else{
                    			element.parent("div").next("div[id$='_box']").next("div[id$='_box_2']").remove();
                    			debugger;
                    			element.parent("div").next("div[class*='drag04Box']").slideUp(100);
                            	debugger;
                            	element.attr("class","font_colorW fa fa-caret-down");
                            	element.parent("div").removeClass("drag04");
                            	element.parent("div").addClass("drag03");
                            	debugger;
                    		}
                    		
                    	}
                    	else{
                        var number=element.parent("div").attr("id").replace(/[^0-9]/ig, "");
                    	var widthDiv=element.parent("div").width();
                    	var leftDiv=element.parent("div").css("left");
                    	element.parent("div").after($compile("<div id='duliang_div_"+number+"S_box' class='drag04Box' style='width:"+widthDiv+"px;left:"+leftDiv+";display:none;'></div>")(scope));
                    	debugger;
                        element.parent("div").next("div[id*='_box']").append($compile("<p><a duliang-tip-h=''>度量规则   <i class='fa fa-caret-right'></i></a></p>")(scope));
                        element.parent("div").next("div[id*='_box']").append($compile("<p><a duliang-tip-c=''>度量范围</a></p>")(scope));
                        debugger;
                    	element.parent("div").removeClass("drag03");
                    	element.parent("div").addClass("drag04");
                    	element.attr("class","font_colorW fa fa-caret-up");
                    	debugger;
                    	element.parent("div").next("div[class*='drag04Box']").slideDown(100);
                    	debugger;
                    	}

                        


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
                 debugger;
                element.parents("#main_zztz").nextAll("#tipBoxW").removeClass("displayN");
                 debugger;
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
                 debugger;
                element.parents("#main_zztz").nextAll("#tipBoxD").removeClass("displayN");
                 debugger;
        	});
        }
    }
});

//度量二级筛选框计数方法弹出
zztzApp.directive('duliangTipH', function ($compile, $http) {
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
        			debugger;
        			$(this).stop();
        		},
        		function(){
        			debugger;
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
            	debugger;
            	element.parents("div[id*='_box_2']").prev("div[id$='_box']").prev("div[id^='duliang_div']").find("a[class*='fa-caret-up']").attr("class","font_colorW fa fa-caret-down");
            	element.parents("div[id$='_box_2']").prev("div[id$='_box']").prev("div[id^='duliang_div']").addClass("drag03");
            	debugger;
            	element.parents("div[id$='_box_2']").prev("div[id$='_box']").prev("div[id^='duliang_div']").removeClass("drag04");
            	debugger;
            	element.parents("div[id$='_box_2']").prev("div[id$='_box']").css("display","none");
            	debugger;
            	
        		element.parents("div[id$='_box_2']").remove();
        		debugger;
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
                debugger;
                //弹出框来源
                debugger;
                var tipID = element.parents("div[id*='tipBox']").attr("value");
                console.log("tipID="+tipID);
                //按钮
                //维度确定
                //清空旧的筛选值
                debugger;
                element.parents("div[id*='tipBox']").prevAll("#main_zztz").children("#tab").find("#shaixuanDiv").children("div[id='" + tipID + "']").removeAttr("value");
                debugger;
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
                

                }
                //度量确定
                if(element.parent("div[id*='tipMain']").attr("class")=="duliangTip"){
                    //起始值范围
                    var startValue=element.prevAll("div[id*='tipValue']").children("input[id='tipStartInput']").val();
                    //结束值范围
                    var endValue=element.prevAll("div[id*='tipValue']").children("input[id='tipEndInput']").val();
                    debugger;
                   //塞度量范围值
                     //验证度量范围接口*****************************************
                    
                    if(startValue){
                        debugger;
                        element.parents("div[id*='tipBox']").prevAll("div[id='main_zztz']").children("div[id='tab']").find("#shaixuanDiv").children("div[id='"+tipID+"']").attr("value",startValue);
                    }
                    if(endValue){
                        if(startValue){
                            debugger;
                            var oldValue=element.parents("div[id*='tipBox']").prevAll("div[id='main_zztz']").children("div[id='tab']").find("#shaixuanDiv").children("div[id='"+tipID+"']").attr("value");
                            debugger;
                            element.parents("div[id*='tipBox']").prevAll("div[id='main_zztz']").children("div[id='tab']").find("#shaixuanDiv").children("div[id='"+tipID+"']").attr("value",oldValue+","+endValue);
                        }
                        else{
                            debugger;
                            element.parents("div[id*='tipBox']").prevAll("div[id='main_zztz']").children("div[id='tab']").find("#shaixuanDiv").children("div[id='"+tipID+"']").attr("value","startNull,"+endValue);

                        }
                    }
                    else{
                        if(startValue){
                            debugger;
                            var oldValue=element.parents("div[id*='tipBox']").prevAll("div[id='main_zztz']").children("div[id='tab']").find("#shaixuanDiv").children("div[id='"+tipID+"']").attr("value");
                            debugger;
                            element.parents("div[id*='tipBox']").prevAll("div[id='main_zztz']").children("div[id='tab']").find("#shaixuanDiv").children("div[id='"+tipID+"']").attr("value",oldValue+",endNull");
                        }
                        else{
                            debugger;
                            element.parents("div[id*='tipBox']").prevAll("div[id='main_zztz']").children("div[id='tab']").find("#shaixuanDiv").children("div[id='"+tipID+"']").removeAttr("value");
                        }
                    }
                    
                    
                    

                }
                
              //度量弹出框消失
                var boxId=element.parents("div[id*='tipBox']").attr("value");
    			debugger;
    			element.parents("div[id*='tipBox']").prevAll("div[id='main_zztz']").find("#shaixuanDiv").children("#"+boxId).next("div[class*='drag04Box']").slideUp(100);
            	debugger;
            	element.parents("div[id*='tipBox']").prevAll("div[id='main_zztz']").find("#shaixuanDiv").children("#"+boxId).removeClass("drag04");
            	element.parents("div[id*='tipBox']").prevAll("div[id='main_zztz']").find("#shaixuanDiv").children("#"+boxId).addClass("drag03");
            	element.parents("div[id*='tipBox']").prevAll("div[id='main_zztz']").find("#shaixuanDiv").children("#"+boxId).find("a[class*='fa-caret-up']").attr("class","font_colorW fa fa-caret-down");
            	debugger;
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
                debugger;
                //删除原左侧列表的A标签的id标记和被拖拽标记
                var idO = $(this).parent("div").attr("id").split("_");
                var numberO = parseInt(idO[2].replace(/[^0-9]/ig, "")); //截取数字,获取编号;
                // var indexTAB = getIndexTAB(); //被选中数据分析数字编号
                //		alert("indexTAB="+indexTAB);
                var str = idO[2].replace(/\d+/g, ""); //查看维度进入了哪个条件框，去除数字之后就是标记结果
                if (idO[0] == "weidu") {
                    //要判断是否有多个同编号维度条件
                    var thisWNumber=0;
                    element.parents("#weiduDiv").children("div").each(function(){
                        var thisIdO=$(this).attr("id").split("_");
                        if(parseInt(thisIdO[2].replace(/[^0-9]/ig, ""))==numberO){
                            thisWNumber++;
                            debugger;
                        }
                    });
                    if(thisWNumber<2){
                        debugger;
                        $("#left_weiduTable").find("a[id='aWeidu_div_" + numberO + "']").removeAttr("id");
                        debugger;
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
                debugger;
                if (nextAllD > 0) {
                	var nextLeftId_00=[];
                	var nextLeftNum_00=-1;
                	var isnextLeftMove_00=false;
                	debugger;
                    $(this).parent("div").nextAll("div").not("div[id*='_box']").each(function(index0){
                    	if($(this).css("left")=="0px"){
                    		nextLeftId_00.push(index0);
                    		debugger;
                    	}
                    });
                    debugger;
                    var oldLeftD, newLeftD;
                    $(this).parent("div").nextAll("div").not("div[id*='_box']").each(function (index) {
                    	if(nextLeftId_00.length!=0){
                    		debugger;
                    		for(var i=0;i<nextLeftId_00.length;i++){
                    			debugger;
                    			if(index==nextLeftId_00[i]){
                    				debugger;
                    				nextLeftNum_00=index;
                    				var thisPrevWidth=0;
                    				$(this).prevAll("div").not("div[id*='_box']").each(function(){
                    					thisPrevWidth=thisPrevWidth+$(this).width();
                    				});
                    				debugger;
                    				if(parseInt(thisPrevWidth)>680){
                    					isnextLeftMove_00=false;
                    					debugger;
                    				}
                    				else{
                    					$(this).css({"left":(thisPrevWidth)+"px","top":(parseInt($(this).css("top").replace(/[^0-9]/ig, ""))-27)+"px"});
                    					isnextLeftMove_00=true;
                    					debugger;
                    				}
                    				
                    			}
                    			else{
                    				if(nextLeftNum_00==-1){
                    					debugger;
                    					oldLeftD = parseInt($(this).css("left")); //把带有“px”的字符串转换成数值
                                        newLeftD = oldLeftD - remD - 15;
                                        $(this).css("left", newLeftD + "px");
                                        debugger;
                    				}
                    				else{
                    					if(isnextLeftMove_00==true){
                    						debugger;
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
                        					debugger;
                        					oldLeftD = parseInt($(this).css("left")); //把带有“px”的字符串转换成数值
                                            newLeftD = oldLeftD - thisWidth_00 - 15;
                                            $(this).css("left", newLeftD + "px");
                                            debugger;
                    					}
                    					
                    					
                    				}
                    			}
                    		}
                    	}
                    	else{
                    		debugger;
                    		oldLeftD = parseInt($(this).css("left")); //把带有“px”的字符串转换成数值
                            newLeftD = oldLeftD - remD - 15;
                            $(this).css("left", newLeftD + "px");
                            debugger;
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

//获取echarts数据指令
zztzApp.directive('getecharts', function ($compile, $http) {
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
                // alert("dimTable.length="+dimTable.length+",measures.length="+measures.length);
                //两维度一度量
                if ($("#weiduDiv").children("div").length == 2 && $("#duliangDiv").children("div").length == 1) {
                	$(".tool_panel>img[value*='mixTwoDim']").attr("src","img/zztzfx/pie-table.png");
                }else{
                	$(".tool_panel>img[value*='mixTwoDim']").attr("src","img/zztzfx/pie-table_grey.png");
                }
                //两度量一维度
                if ($("#weiduDiv").children("div").length == 1 && $("#duliangDiv").children("div").length == 2) {
                	$(".tool_panel>img[value*='mixTwoMeasure']").attr("src","img/zztzfx/crossradio_table.png");
                }else{
                	$(".tool_panel>img[value*='mixTwoMeasure']").attr("src","img/zztzfx/crossradio_table_grey.png");
                }
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
                    //给dataType塞值
	            	document.getElementById('workTableNameInput').setAttribute("name",echartsDataType);
                    obj = {
                        "workTableId":"1",
                        "workTableName":$('#workTableNameInput').text(),
                        "dimTable": dimTable,
                        "measures": measures,
                        "filters": filters,
                        "dataType":echartsDataType,
                        "cubeId": $("#left_modelTable").find("input").attr("name")//在页面将cubeID放到name属性里--2016-08-30
                    };
                    if(echartsDataType=="mixTwoMeasure"){//两维一度量 mixTwoMeasure(混合图2维1度量类型两个曲线)，mixTwoMeasure(混合图1维2度量类型一个折线图一个柱状图)
                    	for(var t =0;t<measures.length;t++){
                			measures[t].chartType="line";//都是曲线图
                    	}
                        console.log("传给后台的obj=" + JSON.stringify(obj));
                    	getMixTypeChart($http,obj,$compile,scope,echartsDataType);
                    }
                    if(echartsDataType=="mixTwoMeasure"){//1维2度量
                    	for(var t =0;t<measures.length;t++){
                    		if(t==0){//第一个度量是曲线，第二个是柱状图
                    			measures[t].chartType="line";
                    		}else{
                    			measures[t].chartType="bar";
                    		}
                    	}
                        console.log("传给后台的obj=" + JSON.stringify(obj));
                    	getMixTypeChart($http,obj,$compile,scope,echartsDataType);
                    }else{
                        console.log("传给后台的obj=" + JSON.stringify(obj));
                        //后台返回的json数据
                        getChartData($http,obj,$compile,scope);
                    }
                }else{
//                  alert("请拖拽度量或维度条件！");
                    console.log("请拖拽度量或维度条件！");
                    return false;
                }
            })
        }
    }
});
function getMixTypeChart($http,obj,$compile,scope,echartsDataType){
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
                getMixDimensionChartFromCommon($compile,echartsData,scope,echartsDataType); //混合div
         }else{
             alert("无数据！");
         }
     }).error(function (freetrial) {
         alert("获取数据失败！");
     });
}
function getMixDimensionChartFromCommon($compile,echartsData,scope,echartsDataType){
	debugger;
	var myChart = echarts.init(document.getElementById("echartsDiv"));
	var series = new Array();
    if(echartsDataType === "mixTwoDim"){//mixTwoMeasure(混合图2维1度量类型两个曲线)，mixTwoMeasure(混合图1维2度量类型一个折线图一个柱状图)
    	for (var i = 0; i < echartsData.data[0].dataY.length; i++) {
    		var serie={
    				name: echartsData.data[0].dataY[i].nameDuliang,
                    type: echartsData.data[0].dataY[i].dataType,
                    data: echartsData.data[0].dataY[i].data_y
    		};
    		series.push(serie);
    	}
	}else{//mixTwoMeasure
		series: [{
            name: echartsData.data[0].dataY[0].nameDuliang,
            type: echartsData.data[0].dataY[0].dataType,
            data: echartsData.data[0].dataY[0].data_y
        },
        {
            name: echartsData.data[0].dataY[1].nameDuliang,
            type: echartsData.data[0].dataY[1].dataType,
            data: echartsData.data[0].dataY[1].data_y
        }]
	}
    var option = {
        backgroundColor: '#FFFFFF',
        grid: {
       	 containLabel: true
        },
        legend: {
            top: '20px',
            data: echartsData.data[0].dataY[i].nameDuliang
        },
        tooltip: {
            axisPointer: {
                type: 'line'
            },
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            data: echartsData.data[0].dataX,
            name: echartsData.data[0].nameWeidu,
            nameLocation: 'middle',
            nameGap: 20
        },
        yAxis: {
       	 	name:"单位："+echartsData.data[0].dataY[i].unitDuliang,
            axisLabel: {
                formatter: '{value}'// + echartsData.data[0].dataY[i].unitDuliang
            }
        },
        series:series
    };
    myChart.setOption(option);
}




function getChartData($http,obj,$compile,scope){
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
						alert("无数据");
					}
					else{//多维样式table//加table
						getMoreDimension($compile,scope,echartsData);
					}
				}
			}
			//******************图表结束***********************
		}
		else {
			alert("无数据！");
		}
	}).error(function (freetrial) {
		alert("获取数据失败！");
	});
}


function getMoreDimension($compile,scope,echartsData){
	$("#echartsDiv").append($compile("<table></table>")(scope));
    //一个维度一行一行的循环
    for (var j = 0; j < echartsData.data.length; j++) {
        var isAxisShowX02 = false;//是否显示x轴刻度和标签
        var bottomX02 = '0';
        var isAxisShowY02 = false;//是否显示y轴刻度和标签
        var leftY02 = '-3px';
        var containLabelY02=false;
        if (j == echartsData.data.length - 1) {//最后一维度
            //多个度量
            for (var p = 0; p < echartsData.data[j][0].dataY.length; p++) {
                //加行
                if (p == echartsData.data[j][0].dataY.length - 1) {
                    $("#echartsDiv table").append($compile("<tr class='haveAxisTickX'></tr>")(scope));
                    isAxisShowX02 = true;
                    bottomX02 = '25%';
                }
                else {
                    $("#echartsDiv table").append($compile("<tr></tr>")(scope));
                    isAxisShowX02 = false;//是否显示x轴刻度和标签
                    bottomX02 = '0';
                }
                //加度量名称
                $("#echartsDiv table").find("tr").each(function (index) {
                    if (index == j + p) {
                        $(this).append($compile("<td style='width:40px;'><span>" + echartsData.data[j][0].dataY[p].nameDuliang + "</span></td>")(scope));
                    }
                });
                for (var q = 0; q < echartsData.data[j].length; q++) {
                    $("#echartsDiv table").find("tr").each(function (index) {
                        if (index == j + p) {
                            //调宽度样式
                            if (echartsData.data[j].length < 4) {
                                //判断是否为第一格
                                if (q == 0) {
                                    $(this).append($compile("<td class='haveAxisTickY'><div id='echartsDiv" + (p + 1) + "_" + (q + 1) + "'  style='width:" + 800 / echartsData.data[j].length + "px;height:160px;'></div></td>")(scope));
                                    isAxisShowY02 = true;
                                    leftY02 = '18%';
                                    containLabelY02=false;
                                }
                                else {
                                    $(this).append($compile("<td><div id='echartsDiv" + (p + 1) + "_" + (q + 1) + "'  style='width:" + 800 / echartsData.data[j].length + "px;height:160px;'></div></td>")(scope));
                                    isAxisShowY02 = false;
                                    leftY02 = '0px';
                                }
                            }
                            else {
                                //判断是否为第一格
                                if (q == 0) {
                                    $(this).append($compile("<td class='haveAxisTickY'><div id='echartsDiv" + (p + 1) + "_" + (q + 1) + "' style='width:250px;height:160px;' ></div></td>")(scope));
                                    isAxisShowY02 = true;
                                    leftY02 = '18%';
                                    containLabelY02=false;
                                }
                                else {
                                    $(this).append($compile("<td><div id='echartsDiv" + (p + 1) + "_" + (q + 1) + "' style='width:250px;height:160px;'></div></td>")(scope));
                                    isAxisShowY02 = false;
                                    leftY02 = '0px';
                                }
                            }
                        }
                    });
                    var myChart02 = echarts.init(document.getElementById("echartsDiv" + (p + 1) + "_" + (q + 1)));
                    var option02 = {
                        grid: {
                        	containLabel: containLabelY02,
                            left: leftY02,
                            top: '10px',
                            right: '0',
                            bottom: bottomX02
                        },
                        tooltip: {
                            axisPointer: {
                                type: 'line'
                            },
                            trigger: 'axis',
                            formatter: '{b}:{c}' + echartsData.data[j][q].dataY[p].unitDuliang
                        },
                        xAxis: {
                            splitLine: {
                                show: false
                            },
                            name: echartsData.data[j][q].nameWeidu,
                            nameGap: 20,
                            nameLocation: 'middle',
                            nameTextStyle: {
                                color: '#333333'
                            },
                            type: 'category',
                            data: echartsData.data[j][q].dataX,
                            axisLabel: {
                                show: isAxisShowX02,
                                margin: 4,
                                textStyle: {
                                    color: '#333333'
                                }
                            },
                            axisTick: {show: true, inside: true},
                            axisLine: {
                                show: isAxisShowX02,
                                lineStyle: {
                                    color: "#CDCDCD"
                                }
                            }
                        },
                        yAxis: {
                        	splitLine: {
                            	show: true,
                            	lineStyle: {
                            	type: 'dashed'
                            	}
                            },
                            axisLabel: {                                                                    
                            	show: isAxisShowY02,
                                margin: 4,
                                textStyle: {
                                    color: '#333333'
                                }
                            },
                            axisTick: {show: true, inside: true},
                            axisLine: {
                                show: isAxisShowY02,
                                lineStyle: {
                                    color: "#CDCDCD"
                                }
                            },
                            min:0,
                            max:echartsData.data[j][q].dataY[p].maxY
                        },
                        series: [{
                            name: echartsData.data[j][q].dataY[p].nameDuliang,
                            type: echartsData.data[j][q].dataY[p].dataType,
                            data: echartsData.data[j][q].dataY[p].data_y
                        }]
                    };
                    myChart02.setOption(option02);
                }
            }
        }
        else {
            //加行
            $("#echartsDiv table").append($compile("<tr class='xHead' style='height: 20px'></tr>")(scope));
            //加维度名称
            $("#echartsDiv table").find("tr").each(function (index) {
                if (index == j) {
                    $(this).append($compile("<td style='width:40px;'><strong>" + echartsData.data[j][0].nameWeidu + "</strong></td>")(scope));
                }
            });
            //加维度值
            for (var m = 0; m < echartsData.data[j].length; m++) {
                $("#echartsDiv table").find("tr").each(function (index) {
                    if (index == j) {
                        if (echartsData.data[j][m].colspan == 1) {
                            $(this).append($compile("<td><strong>" + echartsData.data[j][m].valueName + "</strong></td>")(scope));
                        }
                        else {
                            $(this).append($compile("<td colspan='" + echartsData.data[j][m].colspan + "'><strong>" + echartsData.data[j][m].valueName + "</strong></td>")(scope));
                        }
                    }
                });
            }
        }
    }
}

function getOneDimension($compile,echartsData,scope){
	for (var i = 0; i < echartsData.data[0].dataY.length; i++) {
        if (echartsData.data[0].dataY.length == 1) {
            $("#echartsDiv").append($compile("<div id='echartsDiv" + i + "' style='width:97%;height:100%'></div>")(scope));
        }
        else {
            $("#echartsDiv").append($compile("<div id='echartsDiv" + i + "'></div>")(scope));
        }
        var myChart = echarts.init(document.getElementById("echartsDiv" + i));
        var option = {
            backgroundColor: '#FFFFFF',
            grid: {
           	 containLabel: true
            },
            legend: {
                top: '20px',
//                left: '200px',
                data: echartsData.data[0].dataY[i].nameDuliang
            },
            tooltip: {
                axisPointer: {
                    type: 'line'
                },
                trigger: 'axis'
//           formatter: function (params) {
//               return params.name+"："+params.value;
//           }
            },
            xAxis: {
                type: 'category',
//                boundaryGap: false,
                data: echartsData.data[0].dataX,
                name: echartsData.data[0].nameWeidu,
                nameLocation: 'middle',
                nameGap: 20
            },
            yAxis: {
           	 	name:"单位："+echartsData.data[0].dataY[i].unitDuliang,
                axisLabel: {
                    formatter: '{value}'// + echartsData.data[0].dataY[i].unitDuliang
                }
            },
            series: {
                name: echartsData.data[0].dataY[i].nameDuliang,
                type: echartsData.data[0].dataY[i].dataType,
                data: echartsData.data[0].dataY[i].data_y
            }
        };
        myChart.setOption(option);
    }
}
function getTableChart($compile,scope,echartsData){
	//添加table
	$("#echartsDiv").append($compile("<table class='tableBoxStyle'></table>")(scope));
	$("#echartsDiv table").append($compile("<thead></thead>")(scope));
	$("#echartsDiv table").append($compile("<tbody></tbody>")(scope));
	var dataObj=eval('(' + echartsData.data + ')');
	for(var t=0;t<dataObj.length;t++){
		if(t==0){
			//添加表头
			$("#echartsDiv table thead").append($compile("<tr></tr>")(scope));
			$("#echartsDiv table tbody").append($compile("<tr></tr>")(scope));
			for(var w=0;w<dataObj[t].length;w++){
				if(dataObj[t][w].unit){
					$("#echartsDiv table thead").children("tr").last().append($compile("<td>"+(dataObj[t][w].columnNameCn==null||dataObj[t][w].columnNameCn==""?dataObj[t][w].columnName:dataObj[t][w].columnNameCn)+"（"+dataObj[t][w].unit+"）"+"</td>")(scope));
				}
				else{
					$("#echartsDiv table thead").children("tr").last().append($compile("<td>"+(dataObj[t][w].columnNameCn==null||dataObj[t][w].columnNameCn==""?dataObj[t][w].columnName:dataObj[t][w].columnNameCn)+"</td>")(scope));
				}
				$("#echartsDiv table tbody").children("tr").last().append($compile("<td>"+dataObj[t][w].value+"</td>")(scope));
			}
		}
		else{
			$("#echartsDiv table tbody").append($compile("<tr></tr>")(scope));
			for(var v=0;v<dataObj[t].length;v++){
				$("#echartsDiv table tbody").children("tr").last().append($compile("<td>"+dataObj[t][v].value+"</td>")(scope));
			}
		}
	}
	//添加table
	$("#echartsDiv").append($compile("<table class='tableBoxStyle'></table>")(scope));
	$("#echartsDiv table").append($compile("<thead></thead>")(scope));
	$("#echartsDiv table").append($compile("<tbody></tbody>")(scope));
	var dataObj=eval('(' + echartsData.data + ')');
	for(var t=0;t<dataObj.length;t++){
		if(t==0){
			//添加表头
			$("#echartsDiv table thead").append($compile("<tr></tr>")(scope));
			$("#echartsDiv table tbody").append($compile("<tr></tr>")(scope));
			for(var w=0;w<dataObj[t].length;w++){
				if(dataObj[t][w].unit){
					$("#echartsDiv table thead").children("tr").last().append($compile("<td>"+(dataObj[t][w].columnNameCn==null||dataObj[t][w].columnNameCn==""?dataObj[t][w].columnName:dataObj[t][w].columnNameCn)+"（"+dataObj[t][w].unit+"）"+"</td>")(scope));
				}
				else{
					$("#echartsDiv table thead").children("tr").last().append($compile("<td>"+(dataObj[t][w].columnNameCn==null||dataObj[t][w].columnNameCn==""?dataObj[t][w].columnName:dataObj[t][w].columnNameCn)+"</td>")(scope));
				}
				$("#echartsDiv table tbody").children("tr").last().append($compile("<td>"+dataObj[t][w].value+"</td>")(scope));
			}
		}
		else{
			$("#echartsDiv table tbody").append($compile("<tr></tr>")(scope));
			for(var v=0;v<dataObj[t].length;v++){
				$("#echartsDiv table tbody").children("tr").last().append($compile("<td>"+dataObj[t][v].value+"</td>")(scope));
			}
		}
	}
}

function getDimension(dimTable){
	 if ($("#weiduDiv").children("div").length != 0) {
         $("#weiduDiv").children("div").each(function () {
             var oW = eval("(" + $(this).attr("alt") + ")");//字符串转化成对象,维度条件对象
             var dimTableNameW = $(this).attr("name");
             var dimColumnW = oW.tableColumn;
             var oNewW = {
                 "tableName": dimTableNameW,
                 "tableColumn": dimColumnW
             };//新的入参对象
             dimTable.push(oNewW);
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
                "chartType": ""
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
                    // alert("只在筛选框，ListDimOS[0]="+ListDimOS[0]);
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
                debugger;
                var altO = eval('(' + element.parent("div").attr("alt") + ')');
                debugger;
                var nameO = element.parent("div").attr("name");
                debugger;
                var aNumW = 0;//id编号
                var nextAltO,nextTextO,nextFlagO,nextLeftO,nexZIndexO;
                //获取下钻的所有需要的属性值
                $("#left_weiduTable").children("div").each(function () {
                    debugger;
                    var isWeiduTable = false;
                    $(this).children("p").each(function () {
                        if ($(this).children("a").attr("name") == nameO) {
                            isWeiduTable = true;
                            debugger;
                        }
                    });
                    if (isWeiduTable == true) {
                    	 debugger;
                        $(this).children("p").each(function () {
                        	 debugger;
                        	 var altObj=eval('(' + $(this).children("a").attr("alt") + ')');
                        	 debugger;
                            if (altObj.tableColumn && altObj.tableColumn == altO.tableColumn ) {
                                debugger;
                                //设置id编号
                                //判断是否被拖拽过
                                if ($(this).next("p").children("a").attr("id")) {
                                    aNumW = parseInt($(this).next("p").children("a").attr("id").replace(/[^0-9]/ig, "")); //截取数字,获取编号;
                                    debugger;
                                }
                                else {
                                    wnumber = locals.get("wnumber");
                                    wnumber++;
                                    aNumW = wnumber;
                                    locals.set("wnumber", wnumber);
                                    debugger;
                                    //给左侧a标签加id
                                    $(this).next("p").children("a").attr("id","aWeidu_div_"+aNumW);

                                }
                                //alert("aNumW=" + aNumW);

                                //获取下一个兄弟节点的alt属性
                                nextAltO=$(this).next("p").children("a").attr("alt");
                                debugger;
                                //获取下一个兄弟节点的文本
                                nextTextO=$(this).next("p").children("a").text();
                                debugger;
                                //获取下一个兄弟节点的上卷下钻标识符
                                nextFlagO=eval('(' + $(this).next("p").children("a").attr("alt") + ')').nextFlag;
                                debugger;


                            }
                        });
                    }
                });
                //获取下一个元素的left位置置和层级值
                if(element.parent("div").next("div").attr("id")){
                    console.log(element.parent("div").next("div").attr("id"));
                    debugger;
                    nextLeftO=element.parent("div").next("div").css("left").replace(/[^0-9]/ig, "");
                    debugger;
                    nexZIndexO=element.parent("div").next("div").css("z-index");
                    debugger;
                }
                else{
                    console.log(element.parent("div").width());
                    debugger;
                    nextLeftO=parseInt(element.parent("div").css("left").replace(/[^0-9]/ig, ""))+element.parent("div").width()+15;
                    debugger;
                    nexZIndexO=element.parent("div").css("z-index");
                    debugger;
                }

                //生成元素div
                element.parent("div").after($compile("<div id='weidu_div_"+aNumW+"W' class='drag03' style='left: "+nextLeftO+"px; top: 3px; z-index: "+(nexZIndexO+10)+"; position: absolute; cursor: default;' alt='"+nextAltO+"' name='"+nameO+"'></div>")(scope))
                debugger;
                //生成上卷按钮
                if(nextFlagO==1 || nextFlagO==3){
                    element.parent("div").next("div").append($compile(
                        "<a scroll-up='' class='fa fa-minus-square-o font_colorW' style='line-height:20px;margin-right: 5px;'></a>  "
                    )(scope));
                    debugger;
                }
                //生成text标签
                element.parent("div").next("div").append($compile("<span>"+nextTextO+"</span>")(scope));
                debugger;
                //生成下钻标签
                if(nextFlagO==2 || nextFlagO==3){
                    element.parent("div").next("div").append($compile(
                        "  <a scroll-down='' class='fa fa-plus-square-o font_colorW' style='line-height:20px;margin-left: 5px;margin-right: 5px;'></a>  "
                    )(scope));
                    debugger;
                }

                //生成删除按钮
                element.parent("div").next("div").append($compile( "<a delete='' class='fa fa-close font_colorW floatR' style='line-height:20px'></a>")(scope));
                debugger;

                //将此div后面的兄弟div向后移动一格
                //判断是否后面有兄弟节点
                if(element.parent("div").next("div").nextAll("div")){
                    var nextWidth=element.parent("div").next("div").width();
                    element.parent("div").next("div").nextAll("div").each(function(){
                        var oldLeft=parseInt($(this).css("left").replace(/[^0-9]/ig, ""));
                        $(this).css("left",oldLeft+nextWidth+15+"px");
                        debugger;
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
            	debugger;
            	var altO = eval('(' + element.parent("div").attr("alt") + ')');
                debugger;
                var nameO = element.parent("div").attr("name");
                debugger;
                var aNumW = 0;//id编号
                var prevAltO,prevTextO,prevFlagO,prevLeftO,prevZIndexO;
                //获取上卷的所有需要的属性值
                $("#left_weiduTable").children("div").each(function () {
                    debugger;
                    var isWeiduTable = false;
                    $(this).children("p").each(function () {
                    	 debugger;
                        if ($(this).children("a").attr("name") == nameO) {
                            isWeiduTable = true;
                            debugger;
                        }
                    });
                    if (isWeiduTable == true) {
                    	 debugger;
                        $(this).children("p").each(function () {
                        	debugger;
                        	var altObj=eval('(' + $(this).children("a").attr("alt") + ')');
                        	debugger;
                            if (altObj.tableColumn &&  altObj.tableColumn == altO.tableColumn) {
                            	console.log("altObj.tableColumn="+altObj.tableColumn+",altO.tableColumn="+altO.tableColumn);
                                debugger;
                                //设置id编号
                                //判断是否被拖拽过
                                if ($(this).prev("p").children("a").attr("id")) {
                                    aNumW = parseInt($(this).prev("p").children("a").attr("id").replace(/[^0-9]/ig, "")); //截取数字,获取编号;
                                    debugger;
                                }
                                else {
                                    wnumber = locals.get("wnumber");
                                    wnumber++;
                                    aNumW = wnumber;
                                    locals.set("wnumber", wnumber);
                                    debugger;
                                    //给左侧a标签加id
                                    $(this).prev("p").children("a").attr("id","aWeidu_div_"+aNumW);

                                }
                                //alert("aNumW=" + aNumW);

                                //获取上一个兄弟节点的alt属性
                                prevAltO=$(this).prev("p").children("a").attr("alt");
                                debugger;
                                //获取上一个兄弟节点的文本
                                prevTextO=$(this).prev("p").children("a").text();
                                debugger;
                                //获取上一个兄弟节点的上卷下钻标识符
                                prevFlagO=eval('(' + $(this).prev("p").children("a").attr("alt") + ')').nextFlag;
                                debugger;


                            }
                        });
                    }
                });
                //获取本元素的left位置置和层级值
                    prevLeftO=parseInt(element.parent("div").css("left").replace(/[^0-9]/ig, ""));
                    debugger;
                    prevZIndexO=element.parent("div").css("z-index");
                    debugger;

                //生成元素div
                element.parent("div").after($compile("<div id='weidu_div_"+aNumW+"W' class='drag03' style='left: "+prevLeftO+"px; top: 3px; z-index: "+(prevZIndexO+10)+"; position: absolute; cursor: default;' alt='"+prevAltO+"' name='"+nameO+"'></div>")(scope));
                debugger;
                //生成上卷按钮
                if(prevFlagO==1 || prevFlagO==3){
                    element.parent("div").next("div").append($compile(
                        "<a scroll-up='' class='fa fa-minus-square-o font_colorW' style='line-height:20px;margin-right: 5px;'></a>  "
                    )(scope));
                    debugger;
                }
                //生成text标签
                element.parent("div").next("div").append($compile("<span>"+prevTextO+"</span>")(scope));
                debugger;
                //生成下钻标签
                if(prevFlagO==2 || prevFlagO==3){
                    element.parent("div").next("div").append($compile(
                        "  <a scroll-down='' class='fa fa-plus-square-o font_colorW' style='line-height:20px;margin-left: 5px;margin-right: 5px;'></a>  "
                    )(scope));
                    debugger;
                }

                //生成删除按钮
                element.parent("div").next("div").append($compile( "<a delete='' class='fa fa-close font_colorW floatR' style='line-height:20px'></a>")(scope));
                debugger;

                //将此div后面的兄弟div移动到正确位置
                var thisPrevLeft=parseInt(element.parent("div").next("div").css("left").replace(/[^0-9]/ig, ""));
                debugger;
                //判断是否后面有兄弟节点
                if(element.parent("div").next("div").nextAll("div")){
                    element.parent("div").next("div").nextAll("div").each(function(){
                        var prevWidthO=parseInt($(this).prev("div").width())+15;
                        thisPrevLeft=thisPrevLeft+prevWidthO;
                        console.log("prevWidthO="+prevWidthO);
                        console.log("thisPrevLeft="+thisPrevLeft);
                        debugger;
                        $(this).css("left",thisPrevLeft+"px");
                        debugger;
                    });
                }

                //判断是否删除本元素编号所在的左侧id值
                var thisANumW=parseInt(element.parent("div").attr("id").replace(/[^0-9]/ig, ""));
                var thisWNumber=0;//相同筛选条件的个数
                element.parents("#weiduDiv").children("div").each(function(){
                    var thisIdO=$(this).attr("id").split("_");
                    if(parseInt(thisIdO[2].replace(/[^0-9]/ig, ""))==thisANumW){
                        thisWNumber++;
                        debugger;
                    }
                });
                if(thisWNumber<2){
                    debugger;
                    $("#left_weiduTable").find("a[id='aWeidu_div_" + thisANumW + "']").removeAttr("id");
                    debugger;
                }

                //删除本div元素
                element.parent("div").remove();
                debugger;
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

//保存echarts数据指令
zztzApp.directive('savecharts', function ($compile, $http,tableDetail) {
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

                if ($("#weiduDiv").children("div").length != 0) {
                	var dimOrder = 0;
                    $("#weiduDiv").children("div").each(function () {
                        var oW = eval("(" + $(this).attr("alt") + ")");//字符串转化成对象,维度条件对象
                        var dimTableNameW = $(this).attr("name");
                        var dimColumnW = oW.tableColumn;
                        var oNewW = {
                            "tableName": dimTableNameW,
                            "tableColumn": dimColumnW,
                            "dimMeasureOrder":dimOrder
                        };//新的入参对象
                        dimTable.push(oNewW);
                        dimOrder = dimOrder+1;
                    });
                }
                //度量
                if ($("#duliangDiv").children("div").length != 0) {
                	var measureOrder = 0 ;
                    $("#duliangDiv").children("div").not("div[id*='_box']").each(function () {
                        var ooD = eval("(" + $(this).attr("alt") + ")");//字符串转化成对象,维度条件对象
                        var measuresTableNameD = ooD.tableName;
                        var measuresColumnD = ooD.tableColumn;
                        var oNewD = {
                            "tableName": measuresTableNameD,
                            "tableColumn": measuresColumnD,
                            "factTableRule": $(this).attr("value"),
                            "dimMeasureOrder":measureOrder
                            
                        };//新的入参对象
                        measures.push(oNewD);
                        measureOrder = measureOrder+1;
                    });
                }

                //筛选框入参对象
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
                                // alert("只在筛选框，ListDimOS[0]="+ListDimOS[0]);
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
                // alert("dimTable.length="+dimTable.length+",measures.length="+measures.length);
                //前台传给后台的入参对象
                if ($("#weiduDiv").children("div").length != 0 && $("#duliangDiv").children("div").length != 0) {
                    //data_type的值有：line,bar,pie,gauge（仪表盘图）,radar(雷达图),funnel(漏斗图),scatter(散点图),map
                    
                    debugger;
                    var workTableName = angular.element("#workTableNameInput").text();
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
                        "dimTable": dimTable,
                        "measures": measures,
                        "filters": filters,
                        "dataType":echartsDataType,
                        "cubeId": $("#left_modelTable").find("input").attr("name")//在页面将cubeID放到name属性里--2016-08-30
                    };
                    console.log("传给后台的dataType="+echartsDataType);
                    console.log("传给后台的obj=" + JSON.stringify(obj));
                        //弹出填写工作表框
                        element.parents("#main_zztz").nextAll("#saveEchartsDiv").find("input").val(workTableName);
                        element.parents("#main_zztz").nextAll("#saveEchartsDiv").attr("name",JSON.stringify(obj));
                        element.parents("#main_zztz").nextAll("#saveEchartsDiv").fadeIn(300);
                    	
                    	debugger;

                   

                }
                else{
                	element.parents("#main_zztz").nextAll("#messageDiv").find("span").text("请拖拽度量或维度条件！");
                	element.parents("#main_zztz").nextAll("#messageDiv").fadeIn(200);
                	var t=setTimeout(function(){element.parents("#main_zztz").nextAll("#messageDiv").fadeOut(200);},1500);
                  
                    return false;
                    
                }

            })
        }
    }
});


//保存echarts数据指令
zztzApp.directive('savechartsClick', function ($http) {
    return {
        scope: false,
        restrict: 'AE',
        link: function (scope, element, attr) {
        	
            element.on("click", function () {
            	debugger;
            	var name=scope.saveName;
            	//console.log("name="+name);
            	//console.log("element.parents('#saveEchartsDiv').prevAll('#main_zztz').find('#workTableNameInput').text()="+element.parents("#saveEchartsDiv").prevAll("#main_zztz").find("#workTableNameInput").text());
            	
            	if(element.attr("value")=="yes" && name!="" && name!=null){
            		debugger;
            		
            		element.parents("#saveEchartsDiv").prevAll("#main_zztz").find("#workTableNameInput").text(name);
            		debugger;
            		
                    var obj=eval('(' + element.parents("#saveEchartsDiv").attr("name") + ')');
                    obj.workTableName=name;
                    console.log("saveObj:"+JSON.stringify(obj));
                    element.parents("#saveEchartsDiv").fadeOut(300);
                    debugger;
                	//后台返回的json数据
                    $http({
                        method: "POST",
                        url: ctx()+"/workTable/saveWorkTable",
                        params:{"workConditionString":JSON.stringify(obj)}
                      }).success(function (freetrial) {
                    	element.parents("#saveEchartsDiv").nextAll("#messageDiv").find("span").text("保存数据分析成功!");
                      	element.parents("#saveEchartsDiv").nextAll("#messageDiv").fadeIn(200);
                      	var t=setTimeout(function(){element.parents("#saveEchartsDiv").nextAll("#messageDiv").fadeOut(200);},1500);
                    	  console.log("保存数据分析成功！");
                    	  debugger;
                      }).error(function (freetrial) {
                    	  element.parents("#saveEchartsDiv").nextAll("#messageDiv").find("span").text("保存数据分析失败!");
                          element.parents("#saveEchartsDiv").nextAll("#messageDiv").fadeIn(200);
                          var t=setTimeout(function(){element.parents("#saveEchartsDiv").nextAll("#messageDiv").fadeOut(200);},1500);
                    	  console.log("保存数据分析失败！");
                    });

            		
            	}
            	else{
            		element.parents("#saveEchartsDiv").fadeOut(300);
            	}
            	
            	debugger;
            })
        }
    }
});

//弹出计算规则框
zztzApp.directive('tableRule', function ($compile, $http) {
    return {
        scope: false,
        restrict: 'A',
        link: function (scope, element, attr) {
            element.on("click", function () {
            	//判断是否第一次打开
            	if(element.parent("div").next("div[class*='drag04Box']").attr('class')){
            		debugger;
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
                	
                	debugger;
                	
                    	  var pObj=altObj.rules;
                    		  for(var i=0;i<pObj.length;i++){
                    			  element.parent("div").next("div[id*='_box']").append($compile("<p><a check-rule='' value='"+pObj[i].factTableRule+"'>"+pObj[i].ruleName+"</a></p>")(scope));
                    		  }
                    	  
                    	  debugger;
                    	  
                      
                    element.attr("class","font_colorW fa fa-caret-up");
                	element.parent("div").removeClass("drag03");
                	element.parent("div").addClass("drag04");
                	debugger;
                	element.parent("div").parent("div").attr("style","");;
                	element.parent("div").next("div[class*='drag04Box']").slideDown(100);
                	debugger;
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
            	debugger;
            	var checkedValue=element.attr("value");
            	debugger;
            	var checkedValueCn=element.text();
            	debugger;
            	element.parents("div[id*='_box']").prev("div[id*='duliang_div']").attr("value",checkedValue);
            	debugger;
            	
                //弹出框消失
            	var altObj=eval('(' + element.parents("div[id*='_box']").prev("div[id*='duliang_div']").attr("alt") + ')');
            	var oldtext=altObj.tableColumnCn;
            	debugger;
            	element.parents("div[id*='_box']").prev("div").find("span").text(oldtext+"（"+checkedValueCn+"）");
            	debugger;
            	element.parents("div[id*='_box']").slideUp(100);
            	debugger;
            	element.parents("div[id*='_box']").prev("div").find("a[class*='fa-caret-up']").attr("class","font_colorW fa fa-caret-down");
            	element.parents("div[id*='_box']").prev("div[id*='duliang_div']").removeClass("drag04");
            	element.parents("div[id*='_box']").prev("div[id*='duliang_div']").addClass("drag03");
            	debugger;
                $("#clickEchartData").click();
            })
        }
    }
});


//鼠标放在上面显示全部div里的条件
zztzApp.directive('boxCover', function ($compile, $http) {
    return {
        scope: false,
        restrict: 'A',
        link: function (scope, element, attr) {
        	element.hover(function(){
        		var topNum=0;
        		element.children("div").not("div[id*='_box']").each(function () {
        			if($(this).css("left")=="0px"){
        				topNum++;
        			}
        		});
        		
        		
        		if(topNum>1){

            		var zIndexB=100000010;
            		element.siblings("div").each(function(){
            			$(this).children("div").not("div[id*='_box']").each(function () {
            			if($(this).css("z-index")>zIndexB){
            				zIndexB=parseInt($(this).css("z-index"));
            			}
            		});
            		});
            		
            		var topPosition=0;
            		if(element.attr("id")=="weiduDiv"){
            			topPosition=22;
            		}
            		if(element.attr("id")=="duliangDiv"){
            			topPosition=51;
            		}
            		if(element.attr("id")=="shaixuanDiv"){
            			topPosition=85;
            		}
        			element.css({
            			"border": "1px solid #ff2626",
            	        "width": "87%",
            	        "height": 28*topNum+"px",
            	        "float": "none",
            	        "position": "absolute",
            	        "left": "84px",
            	        "top": topPosition+"px",
            	        "background": "#ffffff",
            	        "z-index": zIndexB+1
            		})
            		element.prev("span").css({
            		    "display": "block",
            		    "height":"20px",
            	        "float": "none",
            	        "border": "0px",
            	        "color":"#ff2626",
            	        "font-weight":"bold"
            		});
        			element.stop();
        		}
        		
        	},function(){
        		element.prev("span").removeAttr("style");
        		element.removeAttr("style");
        		
        	})
        	}
        }
});

//数据模型的绑定事件
zztzApp.controller('tabPanel', function ($scope, $http,$state) {
	$scope.newWorkTable=function () {
		window.location.reload();
	};
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
