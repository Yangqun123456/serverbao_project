/**
 * Created by wcq on 2016/8/18.
 */
var myDataModel = angular.module('myDataModel', ['ng-pagination']);
var ctx = function() {
	  var path = window.location.href;
	  var pathName = window.location.pathname;
	  var hostPath = path.substring(0, path.indexOf(pathName))
	  var projectName = pathName.substring(0, pathName.substring(1).indexOf('/') + 1);
	  return (hostPath + projectName);
}

//数据模型的绑定事件
myDataModel.controller('myDataModelController', function ($scope, $http,$state,userDetailC,ngDialog) {
		$scope.modelQueryByName=function () {
		      $http({
		          method: "POST",
		          url: ctx()+"/cube/getCubeByCondition",
		          params:{//"cubeName":$scope.cubename, 
	        	      	"cubeNameCn":$scope.modelName, 
	        	      	"cubeStatus":$scope.modelStatus, 
		          		"page":"1", 
		          		"rows":"10"}
		        }).success(function (data) {
		          //分页处理开始**************************************************************
		          if(data.success==true){
		              $scope.modelList=data.list;
		              $scope.currentPageC = data.pageNum;
		              $scope.itemsCountC =data.pageSize;
		              $scope.pageCountC=data.pages;
		              $scope.onPageChangeC = function() {
		                  console.log("$scope.currentPageC="+$scope.currentPageC);
		                  // 换页******************************************************
		                  //传给后台的参数
		                  var dataOO={"cubeNameCn":$scope.modelName,"page":$scope.currentPageC,"rows":10,"cubeStatus":$scope.modelStatus}

		                  $http({
		                      method: "POST",
		                      url: ctx()+"/cube/getCubeByCondition",
		                      params:dataOO
		                    }).success(function (data) {
		                      if(data.success==true){
		                          $scope.modelList=data.list;
		                          console.log("获取数据成功");
		                      }
		                      else{
		                          console.log("后台没有数据");
		                      }

		                  }).error(function (data) {
		                	  ngDialogTips(ngDialog,"获取数据失败!");
		                      console.log("获取数据失败");
		                  });
		                  //换页结束***************************************************


		              };
		              console.log("获取数据成功");
		          }
		          else{
		              console.log("后台没有数据");
		          }
		          // Math.ceil($scope.totalItems / $scope.itemsPerpage)


		          //分页处理结束**************************************************************
		      }).error(function (data) {
	        	  ngDialogTips(ngDialog,"获取数据失败!");
		          console.log("获取数据失败");
		      });
	    };
		
	    $scope.cubegldel=function (id) {
	        //传给后台的参数
	    	if(confirm("是否确认删除？")){
	        var cubeId={"cubeId":id}
	        //获取数据
	        $http({
	            method: "POST",
	            url: ctx()+"/cube/del-by-id",
	            params:cubeId
	        }).success(function (data) {
		    	ngDialogTips(ngDialog,"删除数据模型成功!");
	        	$scope.onPageChangeC();
	        	$state.go('zztzfx.myDataModel');
		      }).error(function (data) {
			    ngDialogTips(ngDialog,"删除数据模型失败!");
	            console.log("删除数据模型失败");
	        }); 
	    	}
	    };
	    //重置
	    $scope.reSet = function(){
	        $scope.modelName = "";
	        $scope.modelStatus = "";
	    }
	    $scope.cubeglEditName = function (id){//传给后台的参数
	    	userDetailC.cubeId=id;
		    $state.go('zztzfx.myDataModelDetail');
		    //获取数据
		};
		$scope.updateCHN = function(){
			$state.go('zztzfx.myDataModel_Service');
		}
		//操作列
		$scope.seletedList = ["请选择","查看","删除/恢复"];
});

myDataModel.factory('userDetailC', function() {
    return {
        "cubeId": -1
    }
});

myDataModel.directive('gotoPages',function($state,$http){
	   return{
	       scope:false,
	       restrict:'A',
	       link:function(scope,element,attr){
	         element.on("change",function(){
	            if(element.val()=="查看"){
	            	
	               $state.go("zztzfx.myDataModelDetail",{cubeId:scope.model.cubeId,cubeNameCn:scope.model.cubeNameCn});
	            }
	            var str="";
	            if(element.val()=="恢复"){
	            	str="删除";
	            }else{
	            	str="恢复"
	            }
	            if(element.val()=="恢复"||element.val()=="删除"){
	            	if(confirm("是否确认"+str)){

	                    var data={
	                    		"cubeId":scope.model.cubeId,
	                    		"cubeStatus":scope.model.cubeStatus=="1"?"0":"1",
	                    		"cubeDate":scope.model.cubeDate,
	                    		}
	                    console.log("入参："+JSON.stringify(data));
	                    //获取数据
	                    $http({
	                        method: "POST",
	                        url: ctx()+"/cube/updateCubeInfo",
	                        params:{"cubeVo":JSON.stringify(data)}
	                    }).success(function (data) {
	            	    	scope.modelQueryByName();
	            	      }).error(function (data) {
//	            		    ngDialogTips(ngDialog,"修改数据模型失败!");
	                        console.log("修改数据模型失败");
	                    }); 
	                	
	            	}
		            }

	         });
	       }
	   }
	})