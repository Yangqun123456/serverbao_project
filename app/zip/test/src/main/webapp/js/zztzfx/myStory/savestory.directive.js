//保存echarts数据指令
zztzApp.directive('savestory', function ($compile, $http, ngDialog) {
    return {
        $scope: false,
        restrict: 'A',
        link: function ($scope, element, attr) {
            element.on("click", function () {
            	var data={};
                data.name="layoutB";
                data.class="layoutB";
                data.width="98%";
                data.height="440px";
                var layoutStyle= data;
                //前台传的维度和度量对象参数
                var obj = new Object();
                var dashboards = new Array();//度量列
                debugger;
                //度量
                if ($("#mp_storyDiv").children("div").length != 0) {
                	var order = 0;
                    $("#mp_storyDiv").children("div").each(function () {
//                        var ooD = eval("(" + $(this).attr("id") + ")");//字符串转化成对象,维度条件对象
//                        var wrokTableId = ooD.wrokTableId;
                    	var id = $(this).attr("id").substring(10);
                    	/*var tableBorderShow = $(this).hasClass("layout-border");
                        var tableBorderColor="";
                        if(tableBorderShow) {
                            var tableBorderColor = "layout-border";
                        }*/
                        var tableBorderShowFlag = $(this).hasClass("layout-border");
                        var tableBorderColor=$(this).css("border-color");
                        var tableBorderShow = "";
                        if(tableBorderShowFlag) {
                            tableBorderShow = "layout-border";
                        }
                        var oNewD = {
                            "id": id,
                            "dashboardOrder":order,
                            "borderShow": tableBorderShow,
                            "borderColor": tableBorderColor
                        };//新的入参对象
                        order++;
                        dashboards.push(oNewD);
                    });
                }

                //前台传给后台的入参对象
                    debugger;
                    var storyName = document.getElementById('storyNameInput').value;
                    var storyId = document.getElementById('storyNameInput').alt;
                    obj = {
                        "dashboardVo":dashboards,
                        "name":storyName,
                        "layout":layoutStyle.class,
                        "backgroundColor":$("#mp_storyDiv").css("background-color"),
                        "titleFontColor":$scope.titleFontColor,
                        "themeId":echartsColorTheme
                    };
//                    ngDialogTips(ngDialog,"保存的layout"+layoutStyle.class);
                    console.log("传给后台的obj=" + JSON.stringify(obj));
                    if (dashboards.length == 0) {
                        //不需要保存
                        ngDialogTips(ngDialog,"无数据，不需要保存!");
                    } else {
	                    ngDialog.openConfirm({
	                        template: 'modalDialogId',
	                        className: 'ngdialog-theme-default custom-theme'
	                    }).then(function (value) {
	                        console.log('Modal promise resolved. Value: ', value);
	                    	if (value != null && value != "") {
	                    		obj.name = value;
	                    	}
	                        if(storyId==null||storyId==""){
	                            $http({
	                                method: "POST",
	                                url: ctx()+"/stories",
	                                params:{"story":JSON.stringify(obj)}
	                              }).success(function (freetrial) {
	                            	  document.getElementById('storyNameInput').alt = freetrial;
	                            	  if(value != null && value != ""){
	                            		  $("#storyNameInput").val(value);
	                            	  }
	                            	  ngDialogTips(ngDialog,"保存专题成功！");
	                              }).error(function (freetrial) {
	                            	  ngDialogTips(ngDialog,"保存专题失败！");
	                            });
	                		}else{
	                			$http({
	                                method: "PUT",
	                                url: ctx()+"/stories/"+storyId,
	                                params:{"story":JSON.stringify(obj)}
	                              }).success(function (freetrial) {
	                            	  if(value != null && value != ""){
	                            		  $("#storyNameInput").val(value);
	                            	  }
	                            	  ngDialogTips(ngDialog,"保存专题成功！");
	                              }).error(function (freetrial) {
	                            	  ngDialogTips(ngDialog,"保存专题失败！");
	                            });
	                		}
	                    }, function (reason) {
	                        console.log('Modal promise rejected. Reason: ', reason);
	                    });
                    }
                    
            })
        }
    }
});