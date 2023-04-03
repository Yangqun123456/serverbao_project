/**
 * Created by tuyadi on 2016/6/7.
 */
var moduleAddApp = angular.module('myDataModelAdd', []);

moduleAddApp.controller("dataAddLeftController",function($scope,$http){
	var leftTree;
	$scope.queryHiveTable=function(){
		  $http({
              method: "GET",
              url:  ctx()+"/hive/queryHiveTable",
              params: {tableName:$scope.tableName}
          }).success(function (result) {
        	  $scope.leftTree=result;
          });
	}
   //左侧树数据
  //收缩方法
  $scope.ssClick = function(e,tableName,index){
	 var display=angular.element(e.target).next("ul").css('display');
	 if(display=='none'&&$scope.leftTree[index].columns.length==0){
		  $http({
              method: "GET",
              url:  ctx()+"/hive/queryHiveTableColumns",
              params: {tableName:tableName}
          }).success(function (result) {
        	  addToTableMap(tableMap,new Map(tableName,result));
        	  $scope.leftTree[index].columns=result;
          });
	 }
	  
     angular.element(e.target).next("ul").toggle();
  }
});
moduleAddApp.controller("dataAddController",function($scope,$state,$http){

    //事件注册
    angular.element(".splitNr").on("click",".selectDiv",function(){
            var status = angular.element(this).find("div").is(":visible");
            angular.element(".selectDiv").find("div").hide();
            if(!status){
             	$scope.zbList = tables;
                $scope.cbList = tables;
            
               angular.element(this).find("div").show();
            }
            angular.element(".selectDiv").on("click","p",function(e){
                if(angular.element(this).parent().parent().attr("name")=="leftTable"){
                	$scope.zdList = getValueFromMap(tableMap,angular.element(this).html());
//              	  $http({
//                        method: "GET",
//                        url:  ctx()+"/hive/queryHiveTableColumns",
//                        params: {tableName:angular.element(this).html()}
//                    }).success(function (result) {
//                  	  $scope.zdList = result;
//                  	$scope.$apply();
//                    });
              }else if(angular.element(this).parent().parent().attr("name")=="rightTable"){
            	  debugger;
            	  $scope.cdList=getValueFromMap(tableMap,angular.element(this).html());
            	 
              }
                    var val = angular.element(this).html();
                   angular.element(this).parent("div").hide().prev("font").html(val);
                   e.stopPropagation();
            })
            $scope.$apply();
    })


    //页面布局初始化
    angular.element("#main_zztz").css("height",angular.element(window).height()-50+"px");
    angular.element(".leftDataDiv").css("height",angular.element(".tabPanel").outerHeight()+"px");
    //变量初始化
   
    $scope.lxList = ["INNER JOIN","LEFT JOIN"];
    $scope.syncPolicys = [
            	    {code : "300", name : "每5分钟"},
            	    {code : "3600", name : "每1小时"},
            	    {code : "86400", name : "每天"}
            	];
    $scope.syncPolicy="300";
    $scope.tableGlGxList=[];
    $scope.addEvent = function(){
       var val ={zbList:[],lxList:[],cbList:[],zdList:[],cdList:[]};
       $scope.tableGlGxList.push(val);
    };
    $scope.deleteEvent = function(e){
        var index = angular.element(e.target).parents("tr").index();
        $scope.tableGlGxList.splice(index-1,1);
    }
    $scope.goPage = function(){
//       $state.go("zztzfx.myDataModel");
       $state.go("zztzfx.myDataSource");
    }
    
    $scope.save = function(){
    	getRelations();
    	//getSyncPolicy();
    	syncPolicy = $scope.syncPolicy;
    	var modelName=$scope.dataModelName;
    	var modelDesc=$scope.dataModelMs;
    	if(relations.length>1){
    		relations[0].primary="y";
    	}
//    	alert(JSON.stringify(measures));
//     	console.log({modelName,modelDesc,measures,dimensions,relations,syncPolicy});
    	var zz='{modelName:"zzz",modelDesc:"zzzzz",measures:[],dimension":[],relations:[{id:"",leftTableId:"主表名称",relationType:"连接类型",rigthTableId:"从表名称",leftColumn:"字段名称",rightColumn:"字段名称",primary:""}],syncPolicy:"每5分钟"}';
        /*********************360浏览器 错误代码*************************/
        $http({
        	method: "POST",
        	url:  ctx()+"/hive/myDataModelSave",
        	data:{
	        		modelName:modelName,
					 modelDesc:modelDesc,
					 measures:modelDesc,
					 dimension:dimensions,
					 relations:relations,
					 syncPolicy:syncPolicy
				 }
        }).success(function (data) {
        	 $state.go("zztzfx.myDataSource");
 	      }).error(function (data) {
 	    	  alert("操作失败");
         });
     }


})
 //已添加的字段
 var idArray=[];
 //维度已添加的表
 var idParentArrayWd=[];
 //度量已添加的表
 var idParentArrayDl=[];
 
 var syncPolicy="";
 
 var measures=[];
 var dimensions=[];
 var relations=[];
 var initXW;
 var initYW;
 var tables=[];
 //度量对象
 function MeasureVo(id,tableName,columnName,remarks,dataType,computationRules){
	 	this.id=id;
		this.tableName=tableName;
		this.columnName=columnName;
		this.remarks=remarks;
		this.dataType=dataType;
		this.computationRules=computationRules;
 }
 //维度对象
 function DimensionVo(id,tableName,columnName,remarks,dataType){
	 	this.id=id;
		this.tableName=tableName;
		this.columnName=columnName;
		this.remarks=remarks;
		this.dataType=dataType;
 }
 //关系对象
 function RelationVo(id,leftTableId,leftColumn,relationType,rigthTableId,rightColumn,primary){
	 	this.id=id;
	    this.leftTableId=leftTableId;
	    this.relationType=relationType;
	    this.rigthTableId=rigthTableId;
	    this.leftColumn=leftColumn;
	    this.rightColumn=rightColumn;
	    this.primary=primary;
 }
 
 //modelVo
 function ModelVo(modelName,modelDesc,measures,dimensions,relations,syncPolicy){
	    this.modelName=modelName;
	    this.modelDesc=modelDesc;
	    this.measures=measures;
	    this.dimensions=dimensions;
	    this.relations=relations;
	    this.syncPolicy=syncPolicy;
 }
 
moduleAddApp.directive("dragable",function($document,ngDialog,$compile){
   return {
      scope:false,
      restrict:'A',
      link:function(scope,element,attr){

        element.on("mousedown",function(e){
                var text = element.text();
                element.parents(".singleTable").append("<label class='moveYs'>"+text+"</label>");
                initXW = event.clientX - this.offsetLeft;
                initYW = event.clientY - (this.offsetTop-angular.element(".tableDataList").scrollTop()+$(".tableDataList")[0].offsetTop-$("#main_zztz").scrollTop());
                var moveYs = element.parents(".singleTable").find(".moveYs");
                moveYs.css({
                   left:this.offsetLeft+"px",
                   top:this.offsetTop-angular.element(".tableDataList").scrollTop()+$(".tableDataList")[0].offsetTop-$("#main_zztz").scrollTop()+"px"
                });
                $document.on("mousemove",mousemove);
                $document.on("mouseup",mouseup);
         })

         function mousemove(e){
            var moveYs = element.parents(".singleTable").find(".moveYs");
            var XM = e.clientX-initXW;
            var YM = e.clientY-initYW;
            moveYs.css({
                left:XM+"px",
                top:YM+"px"
            });
         }

         function mouseup(e){
             //当前移动字段Id
             var id = element.context.id;
             var parentId = element.parents("ul").prev("span")[0].id;
             var tableName = element.parents("ul").prev("span").html();
             var columnName=element.attr("name").split(";")[0];
             var dataType=element.attr("name").split(";")[1];
             var zdName = element.html();
             //判断当前移动元素移动的位置从而添加到不同的表中
             var returnV = currentWz(e);
             //删除拖拽的元素
             element.parents(".singleTable").find(".moveYs").remove();
             if(returnV!=0){
                if(idArray.indexOf(id) == -1){
                               idArray.push(id);
                               if(returnV==1){
                            	   var dv=new DimensionVo(id,tableName,columnName,"",dataType);
                            	   dimensions.push(dv);
                                        if(idParentArrayWd.indexOf(parentId)==-1){//新添表
                                        	addToTables(tables,tableName);
                                           var xh = idParentArrayWd.length+1;
                                           angular.element("#wdTable").append("<tr sameRaceWd='"+parentId+"' nameWd='"+parentId+"'zdId='"+id+"'>"+
                                                              "<td rowspan='1'>"+xh+"</td>"+
                                                              "<td rowspan='1'>"+tableName+"</td>"+
                                                              "<td>"+zdName+"</td>"+
                                                              "<td><button onclick='deleteT(event)'>删除</button></td>"+
                                                           "</tr>");
                                           idParentArrayWd.push(parentId);
                                       }else{//新添字段 rowspan
                                          angular.element("tr[nameWd='"+parentId+"']").find("td").eq(0).attr("rowspan",angular.element("tr[nameWd='"+parentId+"']").find("td")[0].rowSpan+1);
                                          angular.element("tr[nameWd='"+parentId+"']").find("td").eq(1).attr("rowspan",angular.element("tr[nameWd='"+parentId+"']").find("td")[1].rowSpan+1);
                                          angular.element("tr[sameRaceWd='"+parentId+"']").last().after("<tr sameRaceWd='"+parentId+"' zdId='"+id+"'>"+
                                                                                                              "<td>"+zdName+"</td>"+
                                                                                                              "<td><button onclick='deleteT(event)'>删除</button></td>"+
                                                                                                            "</tr>");
                                       }
                               }
                               if(returnV==2){
                            	   //todo
                            	   var mv=new MeasureVo(id,tableName,columnName,"",dataType,'sum');
                            	   measures.push(mv);
                                    if(idParentArrayDl.indexOf(parentId)==-1){//新添表
                                    	addToTables(tables,tableName)
                                       var xh = idParentArrayDl.length+1;
                                       angular.element("#dlTable").append("<tr sameRaceDl='"+parentId+"' nameDl='"+parentId+"'zdId='"+id+"'>"+
                                                          "<td rowspan='1'>"+xh+"</td>"+
                                                          "<td rowspan='1'>"+tableName+"</td>"+
                                                          "<td>"+zdName+"</td>"+
                                                          "<td><span class='selectDiv'>"+
                                                               "<font>计算规则</font>"+
                                                               "<div>"+
                                                                  "<p>SUM</p>"+
                                                                  "<p>MIN</p>"+
                                                                  "<p>MAX</p>"+
                                                                  "<p>COUNT</p>"+
                                                                  "<p>COUNT_DISTINCT</p>"+
                                                               "</div>"+
                                                           "</span></td>"+
                                                          "<td><button onclick='deleteT(event)'>删除</button></td>"+
                                                       "</tr>");
                                       idParentArrayDl.push(parentId);
                                   }else{//新添字段 rowspan
                                      angular.element("tr[nameDl='"+parentId+"']").find("td").eq(0).attr("rowspan",angular.element("tr[nameDl='"+parentId+"']").find("td")[0].rowSpan+1);
                                      angular.element("tr[nameDl='"+parentId+"']").find("td").eq(1).attr("rowspan",angular.element("tr[nameDl='"+parentId+"']").find("td")[1].rowSpan+1);
                                      angular.element("tr[sameRaceDl='"+parentId+"']").after("<tr>"+
                                                                                                  "<td>"+zdName+"</td>"+
                                                                                                   "<td><span class='selectDiv'>"+
                                                                                                         "<font>计算规则</font>"+
                                                                                                         "<div>"+
                                                                                                            "<p>SUM</p>"+
                                                                                                            "<p>MIN</p>"+
                                                                                                            "<p>MAX</p>"+
                                                                                                            "<p>COUNT</p>"+
                                                                                                            "<p>COUNT_DISTINCT</p>"+
                                                                                                         "</div>"+
                                                                                                     "</span></td>"+
                                                                                                     "<td><button onclick='deleteT(event)'>删除</button></td>"+
                                                                                              "</tr>");
                                   }
                               }

                }
             }

             $document.off("mousemove");
             $document.off("mouseup");

         }

         function currentWz(e){
              //维度表拖拽框的位置
              var wdWzX = angular.element(".drag_left")[0].offsetLeft;
              var wdWzY = angular.element(".drag_left")[0].offsetTop-angular.element("#main_zztz").scrollTop();
              //度量表拖拽框的位置
              var dlWzX = angular.element(".drag_left")[1].offsetLeft;
              var dlWzY = angular.element(".drag_left")[1].offsetTop- angular.element("#main_zztz").scrollTop();
              //拖拽框的大小
              var kWzWidth = 300;
              var kWzHeight = 120;
              //移动元素的位置
             // var moveX = element.parents(".singleTable").find(".moveYs")[0].offsetLeft;
            //  var moveY = element.parents(".singleTable").find(".moveYs")[0].offsetTop-(angular.element(".tableDataList").scrollTop()+angular.element("#main_zztz").scrollTop());
                var moveX = e.clientX-initXW;
                var moveY =  e.clientY-initYW;
              //移动元素的大小
              var moveWidth = element.parents(".singleTable").find(".moveYs").outerWidth();
              var moveHeight = element.parents(".singleTable").find(".moveYs").outerHeight();
              //元素拖拽到维度框中
              if(moveY >= wdWzY && (moveY+moveHeight) <= (wdWzY+kWzHeight) && moveX>=wdWzX && (moveX+moveWidth)<=(wdWzX+kWzWidth)){
                return 1;
              }
              //元素拖拽到度量框中
              if(moveY >= dlWzY && (moveY+moveHeight) <= (dlWzY+kWzHeight) && moveX>=dlWzX && (moveX+moveWidth)<=(dlWzX+kWzWidth)){
                 return 2;
              }
              return 0;
         }

      }
   }
});

//删除字段
function deleteT(e){
    //需要删除的字段Id
    var zdId = $(e.target).parents("tr").attr("zdId");
    //需要删除的字段对应的表Id
    var tableId = $(e.target).parents("tr").attr("sameRaceWd");
    //判断操作的是维度表还是度量表
    var table = $(e.target).parents("table").attr("id");
    //从数组中删除字段Id
    removeElementFromArray(idArray,zdId);
    if(table=="wdTable"){
    	 removeObjectFromArray(dimensions,zdId);
     }else{
    	 removeObjectFromArray(measures,zdId);
     }

    if($(e.target).parents("tr").attr("nameWd")){//是最后一个元素
    	//将表删除掉
    	removeFromTables(tables,$(e.target).parents("tr").find("td").eq(1).text());
         if(table=="wdTable"){
           // removeElementFromArray(idParentArrayWd,tableId);
            removeObjectFromArray(dimensions,zdId);
         }else{
        	 removeObjectFromArray(measures,zdId);
           // removeElementFromArray(idParentArrayDl,tableId);
         }

    }else{//不是最后一个元素
        // $("#"+table+" tr[nameWd='"+tableId+"'").find("td").eq(0).attr("rowspan",parseInt($("#"+table+" tr[nameWd='"+tableId+"'").find("td").eq(0).attr("rowspan"))-1);
         //$("#"+table+" tr[nameWd='"+tableId+"'").find("td").eq(1).attr("rowspan",parseInt($("#"+table+" tr[nameWd='"+tableId+"'").find("td").eq(1).attr("rowspan"))-1);
    }

/*add 11.3 start 拖拽存在bug 做了修改*/
   if(table=="wdTable"){//如果操作的维度表
        var sameracewd = $(e.target).parents("tr").attr("sameRaceWd");
        var trLength = $(e.target).parents("#wdTable").find("tr[sameRaceWd='"+sameracewd+"']").length;
        var sjLength = trLength-1;
        if(trLength > 1){//不是最后一个字段
           if($(e.target).parents("tr").attr("nameWd")){//如果删除的是第一行
                var xh = $(e.target).parents("tr").find("td").eq(0).text();
                var tableName = $(e.target).parents("tr").find("td").eq(1).text();
                var reverseTr = $(e.target).parents("#wdTable").find("tr[sameRaceWd='"+sameracewd+"']").eq(1);

                reverseTr.attr("nameWd",tableId);
                reverseTr.prepend("<td rowspan='"+sjLength+"'>"+xh+"</td><td rowspan='"+sjLength+"'>"+tableName+"</td>");
           }else{
                var reverseTr = $(e.target).parents("#wdTable").find("tr[sameRaceWd='"+sameracewd+"']").eq(0);
                reverseTr.find("td").eq(0).attr("rowspan",trLength-1);
                reverseTr.find("td").eq(1).attr("rowspan",trLength-1);
           }
        }else{
            removeElementFromArray(idParentArrayWd,tableId);
        }
   }else{//如果操作的是度量表
      var sameracedl = $(e.target).parents("tr").attr("sameRaceDl");
      var trLength = $(e.target).parents("#dlTable").find("tr[sameRaceDl='"+sameracedl+"']").length;
      var sjLength = trLength-1;
      if(trLength > 1){//不是最后一个字段
         if($(e.target).parents("tr").attr("nameDl")){//如果删除的是第一行
              var xh = $(e.target).parents("tr").find("td").eq(0).text();
              var tableName = $(e.target).parents("tr").find("td").eq(1).text();
              var reverseTr = $(e.target).parents("#dlTable").find("tr[sameRaceDl='"+sameracedl+"']").eq(1);
              reverseTr.attr("nameDl",tableId);
              reverseTr.prepend("<td rowspan='"+sjLength+"'>"+xh+"</td><td rowspan='"+sjLength+"'>"+tableName+"</td>");
         }else{
              var reverseTr = $(e.target).parents("#dlTable").find("tr[sameRaceDl='"+sameracedl+"']").eq(0);
              reverseTr.find("td").eq(0).attr("rowspan",trLength-1);
              reverseTr.find("td").eq(1).attr("rowspan",trLength-1);
         }
      }else{
          removeElementFromArray(idParentArrayDl,tableId);
      }
   }
   //删除字段
    $(e.target).parents("tr").remove();
/*add 11.3 end*/


}

//从数组中删除元素
function removeElementFromArray(array,element){
    var index = array.indexOf(element);
    array.splice(index,1);
}

function removeObjectFromArray(array,id){
	for (var i=0;i<array.length;i++)
	{
		if(array[i].id==id){
			array.splice(i,1);
			return;
		}
	}
}

function removeFromTables(array,id){
	for (var i=0;i<array.length;i++)
	{
		if(array[i]==id){
			array.splice(i,1);
			return;
		}
	}
}

function addToTables(array,id){
	for (var i=0;i<array.length;i++)
	{
		if(array[i]==id){
			return;
		}
	}
	array.push(id);
}

function getRelations(){
	var relationTable=$("#relationTable").find("tr");
	//初始化
	relations=[];
	for(var i=0;i<relationTable.length;i++){
		var tdChildren=relationTable.eq(i).children("td")
	    var leftTableId=tdChildren.eq(0).find("font").eq(0).text();
	    var relationType=tdChildren.eq(1).find("font").eq(0).text();
	    var rigthTableId=tdChildren.eq(2).find("font").eq(0).text();
	    var leftColumn=tdChildren.eq(3).find("font").eq(0).text();
	    var rightColumn=tdChildren.eq(4).find("font").eq(0).text();
	    var rv=new RelationVo("",leftTableId,leftColumn,relationType,rigthTableId,rightColumn,"");
	    relations.push(rv);
	}
}

function getSyncPolicy(){
	syncPolicy=$scope.syncPolicy.code;
}

function Map(key,value){
	this.key=key;
	this.value=value;
}

var tableMap=[];

function addToTableMap(array,map){
	debugger;
	for (var i=0;i<array.length;i++)
	{
		if(array[i].key==map.key){
			return;
		}
	}
	array.push(map);
}

function getValueFromMap(tableMap,tableName){
	for(var i=0;i<tableMap.length;i++){
		if(tableMap[i].key==tableName){
			return tableMap[i].value;
		}
		
	}
}





