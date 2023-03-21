/**
 * 存放公共调用的接口服务
 */
//获取纯表格图形
function getTableChartFromCommon(dataObj,chartId,$compile,scope){
	chartId = "#"+chartId;
	$(chartId).append($compile("<table border='0'  class='tableBoxStyle'></table>")(scope));
	$(chartId+" table").append($compile("<thead></thead>")(scope));
	$(chartId+" table").append($compile("<tbody></tbody>")(scope));
	for(var t=0;t<dataObj.length;t++){
		if(t==0){
			//添加表头
			$(chartId+" table thead").append($compile("<tr></tr>")(scope));
			$(chartId+" table tbody").append($compile("<tr></tr>")(scope));
			for(var w=0;w<dataObj[t].length;w++){
				if(dataObj[t][w].unit){
					$(chartId+" table thead").children("tr").last().append($compile("<td ><font size='4' color="+headerColor+">"+(dataObj[t][w].columnNameCn==null||dataObj[t][w].columnNameCn==""?dataObj[t][w].columnName:dataObj[t][w].columnNameCn)+"（"+dataObj[t][w].unit+"）"+"<font/></td>")(scope));
				}
				else{
					$(chartId+" table thead").children("tr").last().append($compile("<td ><font size='4' color="+headerColor+">"+(dataObj[t][w].columnNameCn==null||dataObj[t][w].columnNameCn==""?dataObj[t][w].columnName:dataObj[t][w].columnNameCn)+"<font/></td>")(scope));
				}
				$(chartId+" table tbody").children("tr").last().append($compile("<td ><font color="+bodyColor+">"+dataObj[t][w].value+"<font/></td>")(scope));
			}
		}
		else{
			$(chartId+" table tbody").append($compile("<tr></tr>")(scope));
			for(var v=0;v<dataObj[t].length;v++){
				$(chartId+" table tbody").children("tr").last().append($compile("<td ><font color="+bodyColor+">"+dataObj[t][v].value+"<font/></td>")(scope));
			}
		}
	}
	$('.tableBoxStyle td').css("border", "1px solid "+tableColor);
}
//获取一维数据格式
function getOneDimChartFromCommon(echartsData,id,i){
	//chalk dark essos purple-passion vintage walden  
	var myChart = echarts.init(document.getElementById(id),echartsColorTheme);
    var option = {
    		toolbox: {
    	        feature: {
    	            dataView: {readOnly:true},
    	            saveAsImage: {}
    	        }
    	    },
        title: {
//        	text: '我是标题'
        		},
        grid: {
            left: '3%',
            right: '5%',
            bottom: '8%',
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
            trigger: 'axis',
            position: ['50%', '50%']
        },
        xAxis: {
            type: 'category',
            data: echartsData.data[0].dataX,
            //name: echartsData.data[0].nameWeidu,
            axisLabel: {
                textStyle: {
//                    color: XwColor
                }
            },
            axisLine: {
                lineStyle: {
//                    color: XsColor
                }
            },
            nameLocation: 'middle',
            nameGap: 20
        },
        yAxis: {
            name: "单位：" + echartsData.data[0].dataY[i].unitDuliang,
            axisLabel: {
                textStyle: {
//                    color: YwColor
                },
                formatter: '{value}' //+ echartsData.data[0].dataY[i].unitDuliang
            },
            axisLine: {
                lineStyle: {
//                    color: YsColor
                }
            }
        },
        series: {
        	barWidth : 30,//柱图宽度
            name: echartsData.data[0].dataY[i].nameDuliang,
            type: echartsData.data[0].dataY[i].dataType,
            data: echartsData.data[0].dataY[i].data_y
        }
    };
    if(echartsColorArr!=""&&echartsColorArr!=null){
		option.color=echartsColorArr;
	}
    setOptionColor(option);
    console.log("1V主题option===="+JSON.stringify(option));
    myChart.setOption(option);
}
function setOptionColor(option){
	if(XwColor!=""&&XwColor!=null){
    	option.xAxis.axisLabel.textStyle.color = XwColor;
    }
	if(XsColor!=""&&XsColor!=null){
		option.xAxis.axisLine.lineStyle.color = XsColor;
	}
	if(YwColor!=""&&YwColor!=null){
		option.yAxis.axisLabel.textStyle.color = YwColor;
	}
	if(YsColor!=""&&YsColor!=null){
		option.yAxis.axisLine.lineStyle.color = YsColor;
	}
}
//获取多维的数据echart图形拼接
function getMoreDimensionFromCommon(echartsData,moreDimId,$compile,scope){
	moreDimId = "#"+moreDimId;
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
                    $(moreDimId+" table").append($compile("<tr class='haveAxisTickX'></tr>")(scope));
                    isAxisShowX02 = true;
                    bottomX02 = '25%';
                }
                else {
                    $(moreDimId+" table").append($compile("<tr></tr>")(scope));
                    isAxisShowX02 = false;//是否显示x轴刻度和标签
                    bottomX02 = '0';
                }
                //加度量名称
                $(moreDimId+" table").find("tr").each(function (index) {
                    if (index == j + p) {
                        $(this).append($compile("<td style='width:40px;'><span>" + echartsData.data[j][0].dataY[p].nameDuliang + "</span></td>")(scope));
                    }
                });
                for (var q = 0; q < echartsData.data[j].length; q++) {
                    $(moreDimId+" table").find("tr").each(function (index) {
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
                    var myChart02 = echarts.init(document.getElementById("echartsDiv" + (p + 1) + "_" + (q + 1)),echartsColorTheme);
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
                            //name: echartsData.data[j][q].nameWeidu,
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
//                                    color: XwColor
                                }
                            },
                            axisTick: {show: true, inside: true},
                            axisLine: {
                                show: isAxisShowX02,
                                lineStyle: {
//                                    color: XsColor
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
//                                    color: YwColor
                                }
                            },
                            axisTick: {show: true, inside: true},
                            axisLine: {
                                show: isAxisShowY02,
                                lineStyle: {
//                                    color: YsColor
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
                    if(echartsColorArr!=""&&echartsColorArr!=null){
            			option02.color=echartsColorArr;
            		}
                    setOptionColor(option02);
                    myChart02.setOption(option02);
                }
            }
        }
        else {
            //加行
            $(moreDimId+" table").append($compile("<tr class='xHead' style='height: 20px'></tr>")(scope));
            //加维度名称
            $(moreDimId+" table").find("tr").each(function (index) {
                if (index == j) {
                    $(this).append($compile("<td style='width:40px;'><strong>" + echartsData.data[j][0].nameWeidu + "</strong></td>")(scope));
                }
            });
            //加维度值
            for (var m = 0; m < echartsData.data[j].length; m++) {
                $(moreDimId+" table").find("tr").each(function (index) {
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
//横向图数据拼装 horizontal
function getHorizontalDivChartFromCommon(id,$compile,echartsData,scope){
	$('#'+id).append($compile("<div id='"+id + 0 + "' class='singleChart'></div>")(scope));
	var myChart = echarts.init(document.getElementById(id+0),echartsColorTheme);
	var option = {
			toolbox: {
		        feature: {
		            dataView: {readOnly:true},
		            saveAsImage: {}
		        }
		    },
	    tooltip: {
	        trigger: 'axis',
	        axisPointer: {
	            type: 'line'
	        }
	    },
	    grid: {
	        left: '3%',
	        right: '4%',
	        bottom: '3%',
	        containLabel: true
	    },
	    legend: {
	        data: [echartsData.data[0].dataY[0].nameDuliang]
	    },
	    xAxis: {
	        type: 'value',
	        boundaryGap: [0, 0.01],
            axisLine: {
            	lineStyle: {
//            		color: XsColor
            	}
            },
	        axisLabel: {
                textStyle: {
//                    color: XwColor
                }
            }
	    },
	    yAxis: {
	        type: 'category',
	        data: echartsData.data[0].dataX,
	        name:"单位："+echartsData.data[0].dataY[0].unitDuliang,
	        axisLabel: {
                textStyle: {
//                    color: YwColor
                }
            },
            axisLine: {
            	lineStyle: {
//            		color: YsColor
            	}
            }
	    },
	    series:  [
	              {
	            	  name: echartsData.data[0].dataY[0].nameDuliang,
	                  type: 'bar',
	                  data: echartsData.data[0].dataY[0].data_y
	              }
	          ]
	};
	if(echartsColorArr!=""&&echartsColorArr!=null){
		option.color=echartsColorArr;
	}
    setOptionColor(option);
    myChart.setOption(option);
    console.log(JSON.stringify(option));
}
//饼形图 pie
function getPieChartFromCommon(id,$compile,echartsData,scope){
	$('#'+id).append($compile("<div id='"+id + 0 + "' class='singleChart'></div>")(scope));
	var myChart = echarts.init(document.getElementById(id+0),echartsColorTheme);
	var dataSeriesData = new Array();
	for (var i = 0; i < echartsData.data[0].dataY[0].data_y.length; i++) {
		var dataSeries = {
				value:echartsData.data[0].dataY[0].data_y[i],
				name:echartsData.data[0].dataX[i]
		}
		dataSeriesData.push(dataSeries);
	}
	var chartType = echartsData.data[0].dataY[0].dataType;
	if(echartsData.data[0].dataY[0].dataType=="pieNull"){
		chartType="pie";
	}
    var option = {
    		toolbox: {
    	        feature: {
    	            dataView: {readOnly:true},
    	            saveAsImage: {}
    	        }
    	    },
    	    title : {
    	        x:'center'
    	    },
    	    tooltip : {
    	        trigger: 'item',
    	        formatter: "{a} <br/>{b} : {c} ({d}%)"
    	    },
    	    legend: {
    	        orient: 'vertical',
    	        left: 'left',
    	        data: echartsData.data[0].dataX
    	    },
    	    series : [
    	        {
    	            name: echartsData.data[0].dataY[0].nameDuliang,
    	            type: chartType,
//    	            radius : '55%',
    	            center: ['50%', '60%'],
    	            data:dataSeriesData,
    	            itemStyle: {
    	                emphasis: {
    	                    shadowBlur: 10,
    	                    shadowOffsetX: 0,
    	                    shadowColor: 'rgba(0, 0, 0, 0.5)'
    	                }
    	            }
    	        }
    	    ]
};
    if(echartsData.data[0].dataY[0].dataType=="pieNull"){
    	option.series[0].radius = ['50%', '70%'];
    }else{
    	option.series[0].radius = '55%';
    }
    if(echartsColorArr!=""&&echartsColorArr!=null){
		option.color=echartsColorArr;
	}
    myChart.setOption(option);
}
//混合图数据拼装
function getMixDimensionChartFromCommon(id,$compile,echartsData,scope){
	$('#'+id).append($compile("<div id='"+id + 0 + "' class='singleChart'></div>")(scope));
	var myChart = echarts.init(document.getElementById(id+0),echartsColorTheme);
	var seriesData = new Array();
	var legend = {};
	var legendData = new Array();
    	for (var i = 0; i < echartsData.data.dataY.length; i++) {
    		var serie={
    				barWidth : 30,//柱图宽度
    				name: echartsData.data.dataY[i].nameDuliang,
                    type: echartsData.data.dataY[i].chartType,
                    data: echartsData.data.dataY[i].data_y
    		};
    		legendData.push(echartsData.data.dataY[i].nameDuliang);
    		seriesData.push(serie);
    	}
    var option = {
    		toolbox: {
    	        feature: {
    	            dataView: {readOnly:true},
    	            saveAsImage: {}
    	        }
    	    },
		tooltip: {
	    },
	    legend: {
	        left: 'left',
	        data: legendData
	    },
	    xAxis: {
	        type: 'category',
	        name: 'x',
	        axisLine: {
            	lineStyle: {
//            		color: XsColor
            	}
            },
	        axisLabel: {
                textStyle: {
//                    color: XwColor
                }
            },
	        data: echartsData.data.dataX
	    },
	    grid: {
	        left: '3%',
	        right: '4%',
	        bottom: '3%',
	        containLabel: true
	    },
	    yAxis: {
	        type: 'log',
	        axisLine: {
            	lineStyle: {
//            		color: YsColor
            	}
            },
	        axisLabel: {
                textStyle: {
//                    color: YwColor
                }
            },
            name: "单位：" + echartsData.data.dataY[0].unitDuliang,
//	        name: 'y'
	    },
        series:seriesData
    };
    if(echartsColorArr!=""&&echartsColorArr!=null){
		option.color=echartsColorArr;
	}
    setOptionColor(option);
    myChart.setOption(option);
    console.log(JSON.stringify(option));
}
//一度量两个维度的面积图 mixTowDimLine
function getTowDimLineFromCommon(id,$compile,echartsData,scope){
	$('#'+id).append($compile("<div id='"+id + 0 + "' class='singleChart'></div>")(scope));
	var myChart = echarts.init(document.getElementById(id+0),echartsColorTheme);
	var seriesData = new Array();
	var legend = {};
	var legendData = new Array();
	for (var i = 0; i < echartsData.data.dataY.length; i++) {
		var serie={
				name: echartsData.data.dataY[i].nameDuliang,
				type: echartsData.data.dataY[i].chartType,
				data: echartsData.data.dataY[i].data_y,
	            areaStyle: {normal: {}}
		};
		legendData.push(echartsData.data.dataY[i].nameDuliang);
		seriesData.push(serie);
	}
	var option ={
			toolbox: {
		        feature: {
		            dataView: {readOnly:true},
		            saveAsImage: {}
		        }
		    },
		    tooltip : {
		        trigger: 'axis'
		    },
		    legend: {
		        data:legendData
		    },
//		    toolbox: {
//		        feature: {
//		            saveAsImage: {}
//		        }
//		    },
		    grid: {
		        left: '3%',
		        right: '4%',
		        bottom: '3%',
		        containLabel: true
		    },
		    xAxis : [
		        {
		            type : 'category',
		            boundaryGap : false,
		            axisLine: {
					lineStyle: {
//							color: XsColor
						}
					},
					axisLabel: {
						textStyle: {
//							color: XwColor
						}
					},
		            data : echartsData.data.dataX
		        }
		    ],
		    yAxis : [
		        {
		            name: "单位：" + echartsData.data.dataY[0].unitDuliang,
		            type : 'value',
		            axisLine: {
		            	lineStyle: {
//		            		color: YsColor
						}
					},
					axisLabel: {
						textStyle: {
//							color: YwColor
						}
					},
		        }
		    ],
		    series : seriesData
		};
	if(echartsColorArr!=""&&echartsColorArr!=null){
		option.color=echartsColorArr;
	}
    setOptionColorList(option);
	myChart.setOption(option);
	console.log(JSON.stringify(option));
}
function setOptionColorList(option){
	if(XwColor!=""&&XwColor!=null){
    	option.xAxis[0].axisLabel.textStyle.color = XwColor;
    }
	if(XsColor!=""&&XsColor!=null){
		option.xAxis[0].axisLine.lineStyle.color = XsColor;
	}
	if(YwColor!=""&&YwColor!=null){
		option.yAxis[0].axisLabel.textStyle.color = YwColor;
	}
	if(YsColor!=""&&YsColor!=null){
		option.yAxis[0].axisLine.lineStyle.color = YsColor;
	}
}
//两度量双Y轴 mixTwoMeasureTwoY
function getTowDimTwoYFromCommon(id,$compile,echartsData,scope){
	$('#'+id).append($compile("<div id='"+id + 0 + "' class='singleChart'></div>")(scope));
	var myChart = echarts.init(document.getElementById(id+0),echartsColorTheme);
	var seriesData = new Array();
	var legend = {};
	var legendData = new Array();
	for (var i = echartsData.data.dataY.length-1; i >=0; i--) {
		var serie={
				name: echartsData.data.dataY[i].nameDuliang,
				type: echartsData.data.dataY[i].chartType,
				data: echartsData.data.dataY[i].data_y
		};
		if(i==1){
			serie.yAxisIndex=1;
		}
		legendData.push(echartsData.data.dataY[i].nameDuliang);
		seriesData.push(serie);
	}
	var option  = {
			toolbox: {
		        feature: {
		            dataView: {readOnly:true},
		            saveAsImage: {}
		        }
		    },
		    tooltip: {
		        trigger: 'axis'
		    },
		    legend: {
		        data:legendData
		    },
		    xAxis: [
		        {
		            type: 'category',
		            axisLine: {
//		        		 lineStyle: {
//		        			 color: XsColor
//		        		 }
		        	 },
		            data:echartsData.data.dataX
		        }
		    ],
		    yAxis: [
		        {
		          axisLine: {
//              		  lineStyle: {
//              			  color: YsColor
//              		  }
              	  },
              	  axisLabel: {
//              		  textStyle: {
//              			  color: YwColor
//              		  }
              	  },
		            type: 'value',
		            name: "单位：" + echartsData.data.dataY[0].unitDuliang,
//		            name: legendData[0],
//		            min: 0,
//		            max: 250,
//		            interval: 50,
//		            axisLabel: {
//		                formatter: '{value} ml'
//		            }
		        },
		        {
			        axisLine: {
//	              		lineStyle: {
//	              			color: YsColor
//	              		}
	              	},
	              	axisLabel: {
//	              		textStyle: {
//	              			color: YwColor
//	              		}
	              	},
		            type: 'value',
		            name: "单位：" + echartsData.data.dataY[1].unitDuliang,
//		            name: legendData[1],
//		            min: 0,
//		            max: 25,
//		            interval: 5,
//		            axisLabel: {
//		                formatter: '{value} °C'
//		            }
		        }
		    ],
		    series: seriesData
		};
	if(XwColor!=""&&XwColor!=null){
    	option.xAxis[0].axisLabel.textStyle.color = XwColor;
    }
	if(XsColor!=""&&XsColor!=null){
		option.xAxis[0].axisLine.lineStyle.color = XsColor;
	}
	if(YwColor!=""&&YwColor!=null){
		option.yAxis[0].axisLabel.textStyle.color = YwColor;
		option.yAxis[1].axisLabel.textStyle.color = YwColor;
	}
	if(YsColor!=""&&YsColor!=null){
		option.yAxis[0].axisLine.lineStyle.color = YsColor;
		option.yAxis[1].axisLine.lineStyle.color = YsColor;
	}
	if(echartsColorArr!=""&&echartsColorArr!=null){
		option.color=echartsColorArr;
	}
	myChart.setOption(option);
	console.log(JSON.stringify(option));
}
function getGaugeChart($compile,echartsData,scope,moreDimId){
	if(echartsData.data[0].dataX.length<=8){
		$('#'+moreDimId).css("overflow-y","hidden");
	}else{
		$('#'+moreDimId).css("overflow-y","auto");
	}
	for (var i = 0; i < echartsData.data[0].dataX.length; i++) {
		$('#'+moreDimId).append($compile("<div id='"+moreDimId + i + "' style='width:20%;height:50%'></div>")(scope));
		var myChart = echarts.init(document.getElementById(moreDimId+ i),echartsColorTheme);
		option = {
				toolbox: {
			        feature: {
			            dataView: {readOnly:true},
			            saveAsImage: {}
			        }
			    },
                title: {
                    text: echartsData.data[0].dataX[i],
                    textStyle: {
                        fontWeight: 'normal',
                        fontSize: 14,
                        color: '#c9c9c9'
                    },
                    left: 'center',
                    bottom: '15%'
                },
                axisLabel: {
                    show: false
                },
                series: [
                    {
                        type: 'gauge',
                        detail: {
                            formatter: '{value}',
                            textStyle: {
                                color: 'auto',
                                fontStyle: 'normal',
                                fontWeight: 'normal',
                                fontFamily: 'microsoft yahei',
                                fontSize: 14
                            }
                        },

                        data: [{value: echartsData.data[0].dataY[0].data_y[i]}]
                    }
                ]
			};
		if(echartsColorArr!=""&&echartsColorArr!=null){
			option.color=echartsColorArr;
		}
		myChart.setOption(option);
	}
}

function getStepChart($compile,echartsData,scope,moreDimId,measures,dimTable,filters,cubeId,$http){
	debugger;
	console.log("filtersfiltersfiltersfilters"+JSON.stringify(filters));
	var lastValue=1;
	var foreValue =0;
	var rate =0;
	
	var length = 0;
	if(echartsData!=null){
		length=echartsData.data[0].dataY[0].data_y.length;
	}else{
		rate =0;
		lastValue=0;
	}
	if(length>=2){
		lastValue = echartsData.data[0].dataY[0].data_y[length-1];
		foreValue = echartsData.data[0].dataY[0].data_y[length-2];
		rate = (lastValue-foreValue)/foreValue*100;
	}
		$('#'+moreDimId).append($compile("<div style='background:url(img/zztzfx/u3978.png) no-repeat left top;float:left;' id='"+moreDimId + 0 + "' class='bigRing'></div>")(scope));
		$('#'+moreDimId+0).append($compile("<div id='"+moreDimId + 1 + "'  class='bigRingInside'></div>")(scope));
		$('#'+moreDimId+ 1).append($compile("<p style='margin-left: 40px;padding-top:40px;'><span>共有"+measures.nameDuliang+"</span></p>")(scope));
		$('#'+moreDimId+ 1).append($compile("<p  style='margin-left: 40px;'><span id='"+moreDimId+"p0' class='bigWord all_font_color_lightY'>"+lastValue+"</span><span>&nbsp;"+measures.unitDuliang+"</span></p>")(scope));
		$('#'+moreDimId+ 1).append($compile("<p  style='margin-left: 40px;'><strong id='"+moreDimId+"p1' class='all_font_color_green'>"+rate+"%</strong><span>同比增加</span></p>")(scope));
	debugger;
	
	$('#'+moreDimId).append($compile("<div id='"+moreDimId + "f' style='float:left;width:40%;'></div>")(scope));
	var f= 0;
	var op= 0;
	if(filters!=null&&filters.length>0){
		var values = new Array(filters.length);
		for(;f<filters.length;f++){
			debugger;
			if(filters[f].tableType=="1"){
				op=0;
				$('#'+moreDimId+ "f").append($compile("<select id ='"+moreDimId+"f"+f+"' class='light_blue_l all_font_color_llG select_sczt'"+
		           "style='width:50%;margin-left: 40px;margin-top:30px; float:left;' ></select>")(scope));
				$('#'+moreDimId+"f"+f).append($compile("<option value=''>--请选择--</option> ")(scope));
				for(;op<filters[f].listAllValue.length;op++){
					$('#'+moreDimId+"f"+f).append($compile("<option value='"+filters[f].listAllValue[op]+"'>"+filters[f].listAllValue[op]+"</option> ")(scope));
				}
				$("#"+moreDimId+"f"+f).change(function () { 
					debugger;
					var f1= 0;
					var filters1 = filters;
					for(;f1<filters.length;f1++){
						if(filters[f1]!=null){
							filters1[f1].listFilters = new Array();
							if(filters1[f1].listAllValue!=null){
								filters1[f1].listAllValue.length=0;
							}
							if(filters1[f1].listFilter!=null){
								filters1[f1].listFilter.length=0;
							}
							if($("#"+moreDimId+"f"+f1).val()==""){
								return;
							}
							filters1[f1].listFilters.push($("#"+moreDimId+"f"+f1).val());
						}
					}
					var obj = new Object(); 
					obj = {
	                        "dimTable": dimTable,
	                        "measures": measures,
	                        "filters": filters1,
	                        "dataType":"step",
	                        "cubeId": cubeId
	                    };
					console.log("传到后台对象："+JSON.stringify(obj));
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
							debugger;
							if(echartsData.data[0].dataY.length==0){
								lastValue = "0";
								rate = "0%";
							}else{
								length = echartsData.data[0].dataY[0].data_y.length;
								lastValue = echartsData.data[0].dataY[0].data_y[length-1];
								foreValue = echartsData.data[0].dataY[0].data_y[length-2];
								rate = (lastValue-foreValue)/foreValue*100+"%";
							}
							document.getElementById(moreDimId+"p0").innerText = lastValue;
							document.getElementById(moreDimId+"p1").innerText = rate;
						}
						else {
							ngDialogTips(ngDialog,"无数据！");
						}
					}).error(function (freetrial) {
						ngDialogTips(ngDialog,"获取数据失败！");
					});
				});
			
			}else{
				filters[f] = null;
			}
		}
	}
	
}

function getFloatFromCommon(id,$compile,echartsData,scope){
	debugger;
	var data = new Array();	
	if(echartsData.data.length==1){//一维两度量
		var datax = new Array();
		var maxX = 0;
		var value = 0;
		for(var i =0;i<echartsData.data[0].dataX.length;i++){
			value = parseFloat(echartsData.data[0].dataY[0].data_y[i]);
			if(maxX<value){
				maxX = value;
			}
			var innerData = new Array();
			innerData.push(echartsData.data[0].dataY[0].data_y[i]);
			innerData.push(echartsData.data[0].dataY[1].data_y[i]);
			innerData.push(echartsData.data[0].dataX[i]);
			datax.push(innerData);
		}
		data.push(datax);
	}
	console.log(JSON.stringify(maxX));
	
	$('#'+id).append($compile("<div id='"+id + 0 + "' class='singleChart'></div>")(scope));
	var myChart = echarts.init(document.getElementById(id+0),echartsColorTheme);
	var option = {
		    title: {
		        //text: ''
		    },
		    toolbox: {
		        feature: {
		            dataView: {readOnly:true},
		            saveAsImage: {}
		        }
		    },
		    tooltip : {
		        showDelay : 0,
		        formatter : function (params) {
		                return params.value[2] + ' :<br/>'
		                   + params.value[0] + echartsData.data[0].dataY[0].unitDuliang+ ' <br/>'
		                   + params.value[1] + echartsData.data[0].dataY[1].unitDuliang;
		        }
		      
		    },
		    legend: {
		        right: 10,
		        data: [echartsData.data[0].nameWeidu]
		    },
		    xAxis: {
		    	name: echartsData.data[0].dataY[0].nameDuliang+"：" + echartsData.data[0].dataY[0].unitDuliang,
		        splitLine: {
		            lineStyle: {
		                type: 'dashed'
		            }
		        }
		    },
		    yAxis: {
		    	name: echartsData.data[0].dataY[1].nameDuliang+"：" + echartsData.data[0].dataY[1].unitDuliang,
		        splitLine: {
		            lineStyle: {
		                type: 'dashed'
		            }
		        },
		        scale: true
		    },
		    series: [{
		    	itemStyle : { normal: {label : {show: true}}},
		        name: echartsData.data[0].nameWeidu,
		        data: data[0],
		        type: 'scatter',
		        symbolSize: function (data) {
		            return parseFloat(data[0])*100/ maxX;
		        },
		        label: {
		            emphasis: {
		                show: true,
		                formatter: function (param) {
		                    return param.data[3];
		                },
		                position: 'top'
		            }
		        }
		    }]
	};
	if(XwColor!=""&&XwColor!=null){
    	option.xAxis[0].axisLabel.textStyle.color = XwColor;
    }
	if(XsColor!=""&&XsColor!=null){
		option.xAxis[0].axisLine.lineStyle.color = XsColor;
	}
	if(YwColor!=""&&YwColor!=null){
		option.yAxis[0].axisLabel.textStyle.color = YwColor;
		option.yAxis[1].axisLabel.textStyle.color = YwColor;
	}
	if(YsColor!=""&&YsColor!=null){
		option.yAxis[0].axisLine.lineStyle.color = YsColor;
		option.yAxis[1].axisLine.lineStyle.color = YsColor;
	}
	if(echartsColorArr!=""&&echartsColorArr!=null){
		option.color=echartsColorArr;
	}
	myChart.setOption(option);
	console.log(JSON.stringify(option));
	
}

function getQuadrantFromCommon(id,$compile,echartsData,scope){
	debugger;
	var dataName = new Array();
	if(echartsData.data.length==1){//一维两度量
		var series = new Array();
		for(var i =0;i<echartsData.data[0].dataX.length;i++){
			var data = new Array();
			var data0 = new Array();
			data0.push(echartsData.data[0].dataY[0].data_y[i]);
			data0.push(echartsData.data[0].dataY[1].data_y[i]);
			data.push(data0);
			dataName.push(echartsData.data[0].dataX[i]);
			var innerData = {
					"name":echartsData.data[0].dataX[i],
					"data":data,
					"type":'scatter',
			        "itemStyle": {
		                    "normal": {
		                        "color": '#FFD602',
		                        "borderWidth": 1,
		                        "borderType": 'dashed'
		                    }
			        },
			        "symbolSize": 30
		        
			};
			series.push(innerData);
		}
	}
	
	$('#'+id).append($compile("<div id='"+id + 0 + "' class='singleChart'></div>")(scope));
	var myChart = echarts.init(document.getElementById(id+0),echartsColorTheme);
	var option = {
			title : {
				    },
				    toolbox: {
				        feature: {
				            dataView: {readOnly:true},
				            saveAsImage: {}
				        }
				    },
				    grid: {
				        left: '3%',
				        right: '7%',
				        bottom: '3%',
				        containLabel: true
				    },
				    legend: {
				    	//data: dataName,
				    	left: 'center'
				    },
				    tooltip : {
	                    trigger: 'axis',
	                    showDelay: 0,
	                    axisPointer: {
	                        show: true,
	                        type: 'cross',
	                        lineStyle: {
	                            type: 'dashed',
	                            width: 1
	                        }
	                    }
	                },
				    xAxis : [
				        {
				        	name: echartsData.data[0].dataY[0].nameDuliang+"：" + echartsData.data[0].dataY[0].unitDuliang,
				            type : 'value',
				            scale:true,
				            axisLabel : {
				                formatter: '{value}'+echartsData.data[0].dataY[0].unitDuliang
				            },
				            splitLine: {
				                show: true
				            }
				        }
				    ],
				    yAxis : [
				        {
				        	name: echartsData.data[0].dataY[1].nameDuliang+"：" + echartsData.data[0].dataY[1].unitDuliang,
				            type : 'value',
				            scale:true,
				            axisLabel : {
				                formatter: '{value}'+echartsData.data[0].dataY[1].unitDuliang
				            },
				            splitLine: {
				                show: true
				            }
				        }
				    ],
				    series : series
	};
	if(XwColor!=""&&XwColor!=null){
    	option.xAxis[0].axisLabel.textStyle.color = XwColor;
    }
	if(XsColor!=""&&XsColor!=null){
		option.xAxis[0].axisLine.lineStyle.color = XsColor;
	}
	if(YwColor!=""&&YwColor!=null){
		option.yAxis[0].axisLabel.textStyle.color = YwColor;
		option.yAxis[1].axisLabel.textStyle.color = YwColor;
	}
	if(YsColor!=""&&YsColor!=null){
		option.yAxis[0].axisLine.lineStyle.color = YsColor;
		option.yAxis[1].axisLine.lineStyle.color = YsColor;
	}
	if(echartsColorArr!=""&&echartsColorArr!=null){
		option.color=echartsColorArr;
	}
	myChart.setOption(option);
	console.log(JSON.stringify(option));
}

function getSteptextChart($compile,echartsData,scope,moreDimId){
	debugger;
	var lastValue=1;
	var foreValue =0;
	var rate =0;
	
	var length = 0;
	if(echartsData!=null){
		length=echartsData.data[0].dataY[0].data_y.length;
	}else{
		rate =0;
		lastValue=0;
	}
	if(length>=2){
		lastValue = echartsData.data[0].dataY[0].data_y[length-1];
		foreValue = echartsData.data[0].dataY[0].data_y[length-2];
		rate = (lastValue-foreValue)/foreValue*100;
	}
		$('#'+moreDimId).append($compile("<div style='float:left;' id='"+moreDimId + 0 + "' class='bigRing'></div>")(scope));
		$('#'+moreDimId+0).append($compile("<div id='"+moreDimId + 1 + "'  class='bigRingInside'></div>")(scope));
		$('#'+moreDimId+ 1).append($compile("<p style='margin-left: 40px;padding-top:40px;'><span>共有"+echartsData.data[0].dataY[0].nameDuliang+"</span></p>")(scope));
		$('#'+moreDimId+ 1).append($compile("<p  style='margin-left: 40px;'><span id='"+moreDimId+"p0' class='bigWord all_font_color_lightY'>"+lastValue+"</span><span>&nbsp;"+echartsData.data[0].dataY[0].unitDuliang+"</span></p>")(scope));
		$('#'+moreDimId+ 1).append($compile("<p  style='margin-left: 40px;'><strong id='"+moreDimId+"p1' class='all_font_color_green'>"+rate+"%</strong><span>同比增加</span></p>")(scope));
}
/**
 * ngDialog提示
 * @param ngDialog
 * @param string
 * examples
 * ngDialogTips(ngDialog, '已存在，请不要重复拖拽。');
 */
function ngDialogTips(ngDialog, string) {
	ngDialog.openConfirm({
		template: '<div class="mytitle">' +
		'友情提示：' +
		'<i class="iconfont-close float-position" ng-click="closeThisDialog(0)">&#xe62b;</i>'+
		'</div>' +
		'<div class="my-content"><span>'+string+'</span></div>' +
		'</div>',
		plain: true,
		showClose:false,
		className: 'ngdialog-theme-default custom-theme custom-theme-alert'
	});
}
/**
 * 带input提示框
 * @param ngDialog
 * @param title
 * @param inputLabel
 * @param inputPlaceholder
 * @param $scope
 * @returns {*}
 * exapmes
 * ngDialogInputTips(ngDialog, '保存', '仪表盘名称', '新建仪表盘')
 * .then(function (value) {
 *      console.log('Modal promise resolved. Value: ', value);
 *      //do sometings
 *  }, function (reason) {
 *      console.log('Modal promise rejected. Reason: ', reason);
 *  });
 */
function ngDialogInputTips(ngDialog, title, inputLabel, inputPlaceholder) {
	return ngDialog.openConfirm({
		template:
		'<div class="ngdialog-header "><span>'+title+'</span>' +
		'<i class="iconfont-close float-position" ng-click="closeThisDialog(0)">&#xe62b;</i>'+
		'</div>' +
		'<div class="ngdialog-input">'+
		'<input ng-model="confirmValue" placeholder="'+inputPlaceholder+
		'"/>' +
		'<span>'+inputLabel+' : </span>'+
		'</div>                                                                                                           ' +
		'<div class="ngdialog-buttons">                                                                                   ' +
		'    <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(confirmValue)">保存  ' +
		'    </button>                                                                                                    ' +
		'    <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(\'button\')">' +
		'        取消                                                                                                     ' +
		'    </button>                                                                                                    ' +
		'</div>',
		plain: true,
		showClose:false,
		className: 'ngdialog-theme-default custom-theme dialog-save-alert'
	});
}
/**
 * 删除提示框
 * @param ngDialog
 * @param string
 * exapmes
 * ngDialogWithConfirmButtonTips(ngDialog, '确定删除 ?', '删除仪表盘：xxx，此操作无法撤销。')//请自行调整文字显示
 * .then(function (value) {
 *                console.log('Modal promise resolved. Value: ', value);
 *                //do sometings
 *            }, function (reason) {
 *                console.log('Modal promise rejected. Reason: ', reason);
 *            });
 */
function ngDialogWithConfirmButtonTips(ngDialog, title,string) {
	return ngDialog.openConfirm({
		template: '<div class="mytitle">' +title+
		'<i class="iconfont-close float-position" ng-click="closeThisDialog(0)">&#xe62b;</i>'+
		'</div>' +
		'<div class="my-content"><span>'+string+'</span></div>' +
		'<div class="ngdialog-buttons">                                                                                   ' +
		'    <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">确定  ' +
		'    </button>                                                                                                    ' +
		'    <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">' +
		'        取消                                                                                                     ' +
		'    </button>                                                                                                    ' +
		'</div>',
		plain: true,
		showClose:false,
		className: 'ngdialog-theme-default custom-theme custom-theme-alert'
	});
}

/**
 * 带有list对话框
 * @param ngDialog
 * @param title
 * @param list
 * @param $scope
 * examples
 * ngDialogWithListTips(ngDialog,'以下仪表盘正在使用，无法删除',[{id:5,name:'ddds'},{id:6,name:'啊啊额'}],$scope);//$scope根据directive或者controller
 */
function ngDialogWithListTips(ngDialog,title,list,$scope) {
	$scope.ngDialogWithListTipsListData=list;
	ngDialog.openConfirm({
		template: '<div class="mytitle">' +
		'友情提示：' +
		'<i class="iconfont-close float-position" ng-click="closeThisDialog(0)">&#xe62b;</i>'+
		'</div>' +
		'<div class="my-content"><span>'+title+'</span></div>' +
		'<div class="list"><ul><li ng-repeat=" o in ngDialogWithListTipsListData"><i class="fa fa-file-text-o"> </i>  {{o.name}}</li></ul></div>',
		plain: true,
		className: 'ngdialog-theme-default custom-theme custom-theme-alert',
		showClose:false,
		scope:$scope
	});

}


