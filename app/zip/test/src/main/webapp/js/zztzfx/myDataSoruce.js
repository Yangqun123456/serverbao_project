/**
 * Created by wcq on 2016/8/18.
 */
var myDataSource = angular.module('myDataSource', ['ng-pagination']);
var ctx = function() {
	  var path = window.location.href;
	  var pathName = window.location.pathname;
	  var hostPath = path.substring(0, path.indexOf(pathName))
	  var projectName = pathName.substring(0, pathName.substring(1).indexOf('/') + 1);
	  return (hostPath + projectName);
}

//数据模型的绑定事件
myDataSource.controller('myDataSourceController', function ($scope, $http,$state,userDetailC,ngDialog) {
	
	//查看模型详细信息
	$scope.viewCube = function(cubeId,cubeNameCn){
        $state.go("zztzfx.myDataModelDetail",{cubeId:cubeId,cubeNameCn:cubeNameCn});
	}	
	
	
	$scope.cubeglqueryName=function () {
		      $http({
		          method: "POST",
		          url: ctx()+"/cube/getCubeByCondition",
		          params:{//"cubeName":$scope.cubename, 
	        	      	"cubeNameCn":$scope.cubename, 
	        	      	"cubeStatus":$scope.cubeStatus, 
		          		"page":"1", 
		          		"rows":"10"}
		        }).success(function (data) {
		          //分页处理开始**************************************************************
		          if(data.success==true){
		              $scope.cubeList=data.list;
		              $scope.currentPageC = data.pageNum;
		              $scope.itemsCountC =data.pageSize;
		              $scope.pageCountC=data.pages;
		              $scope.onPageChangeC = function() {
		                  console.log("$scope.currentPageC="+$scope.currentPageC);
		                  // 换页******************************************************
		                  //传给后台的参数
		                  var dataOO={"cubeNameCn":$scope.cubename,"page":$scope.currentPageC,"rows":10,"cubeStatus":$scope.cubeStatus}

		                  $http({
		                      method: "POST",
		                      url: ctx()+"/cube/getCubeByCondition",
		                      params:dataOO
		                    }).success(function (data) {
		                      if(data.success==true){
		                          $scope.cubeList=data.list;
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
	    
	    $scope.synCube=function (cubeName) {//单个cube同步
	    	if(confirm("是否确认同步？")){
				$http({
			        method: "POST",
			        url: ctx()+"/cube/synCube",
			        params:{
			        	"cubeName":cubeName,
			        	"page":$scope.currentPageC, 
		        		"rows":"10"}
			      }).success(function (data) {
			    	  $scope.cubeList=data.list;
		//              $scope.cubeListGifUrl = ctx()+"/static/img/zztzfx/LoadingBefore.png";
			    	  console.log("同步成功，返回列表为："+JSON.stringify(data));
			    	  ngDialogTips(ngDialog,"同步数据模型成功!");
			      }).error(function (data) {
			    	  ngDialogTips(ngDialog,"同步数据模型失败!");
			         console.log("获取数据失败");
			      })
				}
	    };
//	    $scope.cubeListGifUrl = ctx()+"/static/img/zztzfx/LoadingBefore.png";

	    $scope.cubeglSyn=function () {
//	        $scope.cubeListGifUrl = ctx()+"/static/img/zztzfx/Loading.gif";
	    	if(confirm("是否确认同步？")){
				$http({
			        method: "POST",
			        url: ctx()+"/cube/synCube",
			        params:{"page":"1", 
		        		"rows":"10"}
			      }).success(function (data) {
			    	  $scope.cubeList=data.list;
		//              $scope.cubeListGifUrl = ctx()+"/static/img/zztzfx/LoadingBefore.png";
			    	  console.log("同步成功，返回列表为："+JSON.stringify(data));
			    	  ngDialogTips(ngDialog,"同步数据模型成功!");
			      }).error(function (data) {
			    	  ngDialogTips(ngDialog,"同步数据模型失败!");
			         console.log("获取数据失败");
			      })
	    	}
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
	        	$state.go('zztzfx.myDataSource');
		      }).error(function (data) {
			    ngDialogTips(ngDialog,"删除数据模型失败!");
	            console.log("删除数据模型失败");
	        }); 
	    	}
	    };
	    //重置
	    $scope.reSet = function(){
	        $scope.cubename = "";
	        $scope.cubeStatus = "";
	    }
	    $scope.cubeglEditName = function (id){//传给后台的参数
	    	userDetailC.cubeId=id;
		    $state.go('zztzfx.myDataSourceDetail');
		    //获取数据
		};
		$scope.updateCHN = function(){
			$state.go('zztzfx.myDataSource_Service');
		}
});
myDataSource.controller('chnCtrl',function ($scope, $http,$state,$stateParams,ngDialog) {
	$scope.SearchChn=function () {
		$http({
	        method: "GET",
	        url: ctx()+"/cube/getChnInfo",
	        params:{"page":"1", 
	    		"rows":"10",
	    		"cubeName":$scope.cubeName,
	    		"tableName":$scope.tableName}
	      }).success(function (data) {
	    	  $scope.chnList=data.list;
	    	  console.log("返回列表为："+JSON.stringify(data));
	          $scope.currentPageC = data.pageNum;
	          $scope.itemsCountC =data.pageSize;
	          $scope.pageCountC=data.pages;
	    	  $scope.onPageChangeC = function() {
	              console.log("$scope.currentPageC="+$scope.currentPageC);
	              // 换页******************************************************
	              //传给后台的参数
	              var dataOO={"page":$scope.currentPageC,
	            		  "rows":10,
	            		  "cubeName":$scope.cubeName,
	      	    		"tableName":$scope.tableName }
	
	              $http({
	                  method: "GET",
	                  url: ctx()+"/cube/getChnInfo",
	                  params:dataOO
	                }).success(function (data) {
	                  if(data.success==true){
	                      $scope.chnList=data.list;
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
	    	  }
	      }).error(function (data) {
	         console.log("获取数据失败");
	      })
	};
	$scope.saveAll=function () {
//		alert($scope.chnList[0].tableNameCn);
		data={
				"columnChineseList":$scope.chnList
		};
		if(confirm("是否保存全部？")){
			$http({
	            method: "POST",
	            url: ctx()+"/cube/updateAllChn",
	            params:{"chnList":JSON.stringify(data)}
	          }).success(function (data) {
	        	  ngDialogTips(ngDialog,"保存成功");
	        	  $scope.onPageChangeC();
	               console.log("更新数据成功");
	          }).error(function (data) {
	            console.log("更新数据失败");
	        });
		}
	};
	$scope.chnglSave=function (CHN) {
		$http({
            method: "POST",
            url: ctx()+"/cube/updateChn",
            params:CHN
          }).success(function (data) {
        	  ngDialogTips(ngDialog,"保存成功");
        	  //$scope.onPageChangeC();
               console.log("更新数据成功");
          }).error(function (data) {
            console.log("更新数据失败");
        });
	};
});
myDataSource.controller('cubeEditCtrl',function ($scope, $http,$state,userDetailC,$stateParams,ngDialog) {
	var cubeId = {"cubeId":userDetailC.cubeId};
	var newTagList = new Array();//新加入的标签
	var addTagList = new Array();//添加常用的标签
	var otherTagList = new Array();//未添加的标签
	var tagList = new Array();//已有的标签
	var delTagList = new Array();//删除已有的标签
	$http({
        method: "POST",
        url: ctx()+"/cube/viewCubeInfo",
        params:cubeId
    }).success(function (data) {
    	console.log("查询cube修改信息为："+JSON.stringify(data));
    	$scope.cube=data;
    }
    ).error(function (data) {
        console.log("获取数据失败");
    });
	
	$scope.addNewTag=function (){
		 var data={
	        		"tagName":$scope.newTag
		 }
		 
		 //增加新的有三种情况，
		 //1增加的是本身有的
		 var i=0;
		 tagList = $scope.cube.tagList;
		for(;i<tagList.length;i++){
			if(tagList[i].tagName == $scope.newTag ){
				$scope.newTag = "";	
				return;
			}
		}
		 //2增加的是历史的
		i=0;
		for(;i<otherTagList.length;i++){
			if($scope.cube.otherTagList[i].tagName == $scope.newTag ){
				$scope.addTagList.push(otherTagList[i]);
				$scope.cube.otherTagList.splice(i,1);
				$scope.newTag = "";	
				return;
			}
		}
		 //3增加的是新的
		newTagList.push(data);
		$scope.newTagList=newTagList;
		$scope.newTag = "";
	};
	$scope.delTag=function(tag){
		tagList = $scope.cube.tagList;
		var i=0;
		for(;i<tagList.length;i++){
			if(tagList[i].tagId == tag.tagId ){
				break;
			}
		}
		delTagList.push(tagList[i]);
		$scope.delTagList =delTagList; 
		tagList.splice(i,1);
		$scope.cube.tagList =tagList;
	}
	$scope.addOwnTag=function(tag){
		$scope.cube.tagList.push(tag);
		var i=0;
		for(;i<delTagList.length;i++){
			if(delTagList[i].tagId == tag.tagId ){
				break;
			}
		}
		$scope.delTagList.splice(i,1);
	}

	$scope.delOtherTag=function(tag){
		var i = 0;
		for(;i<$scope.addTagList.length;i++){
			if(tag.tagId==$scope.addTagList[i].tagId){
				break;
			}
		}
		$scope.addTagList.splice(i,1);
		$scope.cube.otherTagList.push(tag);
	}
	
	$scope.delNewTag=function(tag){
		var i = 0;
		for(;i<$scope.newTagList.length;i++){
			if(tag==newTagList[i]){
				break;
			}
		}
		$scope.newTagList.splice(i,1);
	}
	$scope.addTag=function(tag){
		$scope.addTagList = addTagList;
		otherTagList = $scope.cube.otherTagList;
		var i=0;
		for(;i<otherTagList.length;i++){
			if(otherTagList[i].tagId == tag.tagId ){
				break;
			}
		}
		$scope.addTagList.push(otherTagList[i]);
		otherTagList.splice(i,1);
		$scope.cube.otherTagList =otherTagList;
	};
	//修改的保存
	$scope.updateCubeInfo=function () {
        //传给后台的参数
    	if(confirm("是否确认保存修改？")){
        var data={
        		"cubeId":$scope.cube.cubeId,
        		"cubeName":$scope.cube.cubeName,
        		"cubeNameCn":$scope.cube.cubeNameCn,
        		"cubeDescription":$scope.cube.cubeDescription,
        		"cubeDate":$scope.cube.cubeDate,
        		"cubeStatus":$scope.cube.cubeStatus,
        		"newTagList":$scope.newTagList,//新添加的标签
        		"delTagList":$scope.delTagList,//删除的原有的的标签
        		"addTagList":$scope.addTagList//添加的常用的标签
        		}
        console.log("入参："+JSON.stringify(data));
        //获取数据
        $http({
            method: "POST",
            url: ctx()+"/cube/updateCubeInfo",
            params:{"cubeVo":JSON.stringify(data)}
        }).success(function (data) {
	    	ngDialogTips(ngDialog,"修改数据模型成功!");
	      }).error(function (data) {
		    ngDialogTips(ngDialog,"修改数据模型失败!");
            console.log("修改数据模型失败");
        }); 
    	}
    };
});

myDataSource.factory('userDetailC', function() {
    return {
        "cubeId": -1
    }
});