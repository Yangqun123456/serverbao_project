var ctx = function() {
	  var path = window.location.href;
	  var pathName = window.location.pathname;
	  var hostPath = path.substring(0, path.indexOf(pathName))
	  var projectName = pathName.substring(0, pathName.substring(1).indexOf('/') + 1);
	  return (hostPath + projectName);
}
zztzApp.controller('apiController', function ($scope, $http,$compile,RenderPieService) {
    
	$scope.getStory=function () {
		debugger;
		var id = getQueryString("id");
		if (id != null) {
            $http({
                method: "GET",
                url: ctx() + "/stories/" + id,
                params: {}
            }).success(function (data) {
            	if(data.themeId!=null){
            		$http({
            			method: "POST",
            			url: ctx() + "/theme/getThemeList",
            			params:{"themeId":data.themeId}
            		}).success(function (freetrial) {
            			console.log("getThemeList:"+JSON.stringify(freetrial));
            			if(freetrial!=null){
            				$scope.theme=freetrial.data;
            				$scope.selectedForeColor = data.backgroundColor;
                        	$scope.titleFontSize = data.titleFontSize;
                        	$scope.titleFontWeight = data.titleFontWeight;
                        	$scope.titleFontColor = data.titleFontColor;
                        	$scope.titleShow = data.titleShow;
                        	$.each(data.dashboardVo, function(j, value) {
                        		if($scope.theme!=null){
                        			value.backgroundColor = $scope.theme[0].dashboardBackground;
                        			value.titleFontColor = $scope.theme[0].dashboardTitle;
                        		}
                                  $scope.selectedLineForeColor = value.borderColor;
                                  $scope.layoutFlag=true;
                                  angular.element("#mp_storyDiv").append($compile("<div class='layoutB "+value.borderShow+"' style='width:98%;height:auto;clear: both;background-color:"+value.backgroundColor+"'  id='mp_mainDiv" + value.id + "' ng-style='{\"border-color\": selectedLineForeColor}' ></div>")($scope));
                                  angular.element("#mp_mainDiv" + value.id).append($compile("<p style='margin: 5px 5px;float:left;font-size:15px;font-weight: bold;' ng-style='{\"color\": titleFontColor,\"font-weight\":titleFontWeight,\"font-size\":titleFontSize,\"display\":titleShow}'>"+value.name+"</p>")($scope));
                                  angular.element("#mp_mainDiv" + value.id).append($compile("<div style='clear: both;'></div>")($scope));
                                    for(var z1=0;z1<value.workTableResults.length;z1++){
                                    	var workDetail = value.workTableResults[z1];
                                 	      //通过workId获取图表
                                         var echartsData = workDetail.result;
                                         var echartsDataType = workDetail.dataType;
                                     	  var layoutStyle = {};
                                         layoutStyle.class = value.layout;
                                        //渲染拖拽的仪表盘
                                         	if (echartsData.success == true) {
                                         	XsColor = workDetail.xsColor//x轴颜色
                                           XwColor = workDetail.xwColor;//x文字颜色
                                           YsColor = workDetail.ysColor;//y轴颜色
                                           YwColor = workDetail.ywColor;//y文字颜色
                                           if($scope.theme!=null){
                                           		workDetail.tableBorderShow = "layout-border";
                                          	  	workDetail.tableBorderColor = $scope.theme[0].dashboardBorder;
                                            }
                                           $("#mp_mainDiv"+ value.id).append($compile("<div  class = '" + layoutStyle.class + "' id='" + value.id+ workDetail.workTableId +z1 + "'></div>")($scope));
                                           $("#mp_mainDiv"+value.id+"  #"+value.id+ workDetail.workTableId +z1).append($compile("<div class='layout-overflow " + workDetail.tableBorderShow + "'></div>")($scope));
                                           $("#mp_mainDiv"+value.id+"  #"+value.id+ workDetail.workTableId +z1).children("div").last().css("border-color",workDetail.tableBorderColor);
                                           $("#mp_mainDiv"+value.id+"  #"+value.id+ workDetail.workTableId +z1).children("div").last().append($compile("<div class='innerDivChartDataMenu'><div class='worktables-title'><span style='color: "+value.titleFontColor+"'>" + workDetail.workTableName + "</span></div></div>")($scope));
                                           $("#mp_mainDiv"+value.id+"  #"+value.id+ workDetail.workTableId +z1).children("div").last().append($compile("<div id='echartsDiv" + value.id+ workDetail.workTableId +z1 + "' class = 'innerDivChartData' style='overflow-x: auto;'></div>")($scope));
                                           var parentId = 'echartsDiv' + value.id+ workDetail.workTableId +z1;
                                              RenderPieService.judgingChartType(parentId, echartsData, $compile, $scope, echartsDataType,value.workTableResults[z1].measures,value.workTableResults[z1].dimTable,value.workTableResults[z1].filters,value.workTableResults[z1].cubeId,$http);
                                            }
                                            else {
                                                
                                            }
                                    }
                        	});
            			}
            		}).error(function (freetrial) {
            			console.log("查询数据异常！");
            		});
            	}
            	
            }).error(function (data) {
                console.log("获取数据失败");
            });
            
		}
	};
});

function getQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}