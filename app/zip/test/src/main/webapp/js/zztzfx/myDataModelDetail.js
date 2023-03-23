/**
 * Created by tuyadi on 2016/6/7.
 */
var moduleDetailApp = angular.module('myDataModelDetail', []);
var ctx = function() {
	  var path = window.location.href;
	  var pathName = window.location.pathname;
	  var hostPath = path.substring(0, path.indexOf(pathName))
	  var projectName = pathName.substring(0, pathName.substring(1).indexOf('/') + 1);
	  return (hostPath + projectName);
}
moduleDetailApp.controller("myDataModelDetailController",function($scope,$http,$state,$stateParams){
		   $http({
               method: "POST",
               url: ctx()+"/hive/showModelDetail",
               params:{"cubeId":$stateParams.cubeId}
           }).success(function (data) {
        	   console.log(data);
        	   $scope.modelName=$stateParams.cubeNameCn;
        	   $scope.modelDesc=data.modelDesc;
        	   generateDim(data.dimensions);
        	   generateMea(data.measures)
        	   $scope.relations=data.relations;
        	   $("#syncPolicy").text(data.syncPolicy)
   	      }).error(function (data) {
   	    	  console.log("查看详情失败");
           }); 
    //页面布局初始化
   angular.element("#main_zztz").css("height",angular.element(window).height()-50+"px");
   
   $scope.goPage = function(){
//       $state.go("zztzfx.myDataModel");
       $state.go("zztzfx.myDataSource");
   }
});

function generateDim(dims){
	debugger;
	var dimArr=[];
	for(var i=0;i<dims.length;i++){
		dimPush(dimArr,dims[i]);
	}
	for(var i=0;i<dimArr.length;i++){
		var columns=dimArr[i].columns;
		  var str="<tr><td rowspan='"+dimArr[i].columns.length+"'>"+i+"</td>"+
                  "<td rowspan='"+columns.length+"'>"+dimArr[i].tableName+"</td>"+
                  "<td>"+columns[0]+"</td></tr>";
		  if(columns.length>1){
			  for(var j=1;j<columns.length;j++){
				  str=str+"<tr><td>"+columns[j]+"</td></tr>"
			  }
		  }
               angular.element("#wdTable").append(str);
	}
}
function generateMea(meas){
	var meaArr=[];
	for(var i=0;i<meas.length;i++){
		meaPush(meaArr,meas[i]);
	}
	for(var i=0;i<meaArr.length;i++){
		var columns=meaArr[i].columns;
		  var str="<tr><td rowspan='"+meaArr[i].columns.length+"'>"+i+"</td>"+
                  "<td rowspan='"+columns.length+"'>"+meaArr[i].tableName+"</td>"+
                  "<td>"+columns[0].split(";")[0]+"</td><td>"+columns[0].split(";")[1]+"</td></tr>";
		  if(columns.length>1){
			  for(var j=1;j<columns.length;j++){
				  str=str+"<tr><td>"+columns[j].split(";")[0]+"</td><td>"+columns[j].split(";")[1]+"</td></tr>"
			  }
		  }
               angular.element("#dlTable").append(str);
	}
	
}
function Dim(tableName,columns){
	this.tableName=tableName;
	this.columns=columns;
}

function Mea(tableName,columns){
	this.tableName=tableName;
	this.columns=columns;
}

function dimPush(array,obj){
	for(var i=0;i<array.length;i++){
		if(array[i].tableName==obj.tableName){
			array[i].columns.push(obj.columnName)
			return;
		}
	}
	var columns=[];
	columns.push(obj.columnName);
	array.push(new Dim(obj.tableName,columns));
}

function meaPush(array,obj){
	for(var i=0;i<array.length;i++){
		if(array[i].tableName==obj.tableName){
			array[i].columns.push(obj.columnName)
			return;
		}
	}
	var columns=[];
	columns.push(obj.columnName+";"+obj.computationRules);
	array.push(new Mea(obj.tableName,columns));
}







