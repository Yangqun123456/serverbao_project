/**
 * Created by mic on 2016/9/6.
 */
zztzApp.factory('RenderPieService', RenderPieService);
function RenderPieService() {
    var func = {
        renderTable: renderTable,
        renderMultiDimTable: renderMultiDimTable,
        renderOneDimChart: renderOneDimChart,
        renderHorizontalDivChartFromCommon: renderHorizontalDivChartFromCommon,
        renderMixDimensionChartFromCommon: renderMixDimensionChartFromCommon,
        renderPieChartFromCommon: renderPieChartFromCommon,
        renderTowDimTwoYFromCommon: renderTowDimTwoYFromCommon,
        renderGaugeChart: renderGaugeChart,
        renderStepChart: renderStepChart,
        renderSteptextChart:renderSteptextChart,
        renderFloatChart:renderFloatChart,
        renderQuadrantChart:renderQuadrantChart,
        renderTowDimLineFromCommon: renderTowDimLineFromCommon,
        judgingChartType: judgingChartType,
        relocation2myPie: relocation2myPie
    }
    return func;
    /**
     * 渲染表格
     * @param parentDivId
     * @param echartsData
     * @param $compile
     * @param scope
     */
    function renderTable(parentDivId, echartsData, $compile, scope) {
        //table渲染
        var echartsDivId = parentDivId;
        var dataObj = eval('(' + echartsData.data + ')');
        getTableChartFromCommon(dataObj, echartsDivId, $compile, scope);
    }

    /**
     * 渲染一维一度量图表
     * @param parentDivId
     * @param echartsData
     * @param $compile
     * @param scope
     */
    function renderOneDimChart(parentDivId, echartsData, $compile, scope) {
        for (var i = 0; i < echartsData.data[0].dataY.length; i++) {
            $("#" + parentDivId).append($compile("<div id='" + parentDivId + i + "' class = 'innerDivChartDataP' ></div>")(scope));
            var echartsDivId = parentDivId + i;
            getOneDimChartFromCommon(echartsData, echartsDivId, i);
        }

    }

    /**
     * 多维样式table,尚未测试
     * @param parentDivId
     * @param echartsData
     * @param $compile
     * @param scope
     */
    function renderMultiDimTable(parentDivId, echartsData, $compile, scope) {
        $("#" + parentDivId).append($compile("<table></table>")(scope));
        //一个维度一行一行的循环
        var echartsDivId = parentDivId;
        getMoreDimensionFromCommon(echartsData, echartsDivId, $compile, scope);
    }

    /**
     * 横的柱状图
     * @param parentDivId
     * @param echartsData
     * @param $compile
     * @param scope
     */
    function renderHorizontalDivChartFromCommon(parentDivId, echartsData, $compile, scope) {
        getHorizontalDivChartFromCommon(parentDivId, $compile, echartsData, scope);

    }

    /**
     * 混合div
     * @param parentDivId
     * @param echartsData
     * @param $compile
     * @param scope
     */
    function renderMixDimensionChartFromCommon(parentDivId, echartsData, $compile, scope) {
        getMixDimensionChartFromCommon(parentDivId, $compile, echartsData, scope);
    }

    /**
     * 饼状图
     * @param parentDivId
     * @param echartsData
     * @param $compile
     * @param scope
     */
    function renderPieChartFromCommon(parentDivId, echartsData, $compile, scope) {
        getPieChartFromCommon(parentDivId, $compile, echartsData, scope);
    }

    /**
     * 混合div两度量双Y轴
     * @param parentDivId
     * @param echartsData
     * @param $compile
     * @param scope
     */
    function renderTowDimTwoYFromCommon(parentDivId, echartsData, $compile, scope) {
        getTowDimTwoYFromCommon(parentDivId, $compile, echartsData, scope); //混合div两度量双Y轴

    }

    /**
     * 一维仪表盘
     * @param parentDivId
     * @param echartsData
     * @param $compile
     * @param scope
     */
    function renderGaugeChart(parentDivId, echartsData, $compile, scope) {
        getGaugeChart($compile, echartsData, scope, parentDivId); //一维样式div
    }
    
    /**
     * 混合div两维度面积图
     * @param parentDivId
     * @param echartsData
     * @param $compile
     * @param scope
     */
    function renderTowDimLineFromCommon(parentDivId, echartsData, $compile, scope) {
        getTowDimLineFromCommon(parentDivId, $compile, echartsData, scope); //混合div两维度面积图
    }

    /**
     * 饼形图
     * @param parentDivId
     * @param echartsData
     * @param $compile
     * @param scope
     */
    function renderPieNullChart(parentDivId, echartsData, $compile, scope) {
        getPieChartFromCommon(parentDivId, $compile, echartsData, scope);

    }
    
    
    /**
     * 同比图
     * @param parentDivId
     * @param echartsData
     * @param $compile
     * @param scope
     */
    function renderStepChart(parentDivId, echartsData, $compile, scope,measures,dimTable,filters,cubeId,$http) {
    	getStepChart($compile, echartsData, scope, parentDivId,measures,dimTable,filters,cubeId,$http);
    }
    /**
     * 同比纯文本
     * @param parentDivId
     * @param echartsData
     * @param $compile
     * @param scope
     */
    function renderSteptextChart(parentDivId, echartsData, $compile, scope,measures) {
    	getSteptextChart($compile,echartsData,scope,parentDivId,measures); //一维样式div
    }
    
    /**
     * 两度量一维度散点图
     * @param parentDivId
     * @param echartsData
     * @param $compile
     * @param scope
     */
    function renderFloatChart(parentDivId, $compile, echartsData, scope) {
    	getFloatFromCommon(parentDivId, $compile, echartsData, scope);
    }
    
    function renderQuadrantChart(parentDivId, $compile, echartsData, scope) {
    	getQuadrantFromCommon(parentDivId, $compile, echartsData, scope);
    }
    /**
     * 判断
     * @param parentDivId
     * @param echartsData
     * @param $compile
     * @param scope
     * @param echartsDataType
     */
    function judgingChartType(parentDivId, echartsData, $compile, scope, echartsDataType,measures,dimTable,filters,cubeId,$http) {
    	debugger;
        if (echartsDataType == "table") {
            renderTable(parentDivId, echartsData, $compile, scope);
        } else if (echartsDataType == "horizontal") {
            renderHorizontalDivChartFromCommon(parentDivId, echartsData, $compile, scope);
        } else if (echartsDataType == "pie") {
            renderPieChartFromCommon(parentDivId, echartsData, $compile, scope); //饼图
        } else if (echartsDataType == "mixTowDimLine") {
            renderTowDimLineFromCommon(parentDivId, echartsData, $compile, scope);

        } else if (echartsDataType == "mixTwoDim" || echartsDataType == "mixTwoMeasure") {
            renderMixDimensionChartFromCommon(parentDivId, echartsData, $compile, scope); //混合div
        } else if (echartsDataType == "mixTwoMeasureTwoY") {
            renderTowDimTwoYFromCommon(parentDivId, echartsData, $compile, scope);
        }else if (echartsDataType == "float") {
        	renderFloatChart(parentDivId, $compile, echartsData, scope)
        }else if (echartsDataType == "quadrant") {
        	renderQuadrantChart(parentDivId, $compile, echartsData, scope)
        } else if (echartsDataType == "gauge") {
            renderGaugeChart(parentDivId, echartsData, $compile, scope);
        }else if (echartsDataType == "step") {
        	debugger;
        	measures["nameDuliang"]=echartsData.data[0].dataY[0].nameDuliang;
        	measures["unitDuliang"]=echartsData.data[0].dataY[0].unitDuliang;
        	if(filters!=null&&filters.length!=0){//有筛选条件的不传查询结果
        		echartsData = null;
        	}
            renderStepChart(parentDivId, echartsData, $compile, scope,measures,dimTable,filters,cubeId,$http);
        }else if (echartsDataType == "steptext") {//同比纯文本
        	debugger;
        	renderSteptextChart(parentDivId, echartsData, $compile, scope);
        } else if (echartsDataType == "pieNull") {
            //    if(echartsData.data[0].dataY[0].dataType=="pieNull"){
            renderPieNullChart(parentDivId, echartsData, $compile, scope);
        }
        else {
            if (echartsData.data.length == 1) {
                //一维样式div
                renderOneDimChart(parentDivId, echartsData, $compile, scope);
            } else if (echartsData.data != null && echartsData.data instanceof Array) {
                //多维样式table
                //加table
                renderMultiDimTable(parentDivId, echartsData, $compile, scope);
            } else {
                //其他暂时不支持

            }
        }
        //******************table开始***********************

        //******************图表结束***********************


    }

    /**
     * 跳转到仪表盘界面
     * @param locals
     * @param $state
     */
    function relocation2myPie(locals, $state) {
        var obj = {
            "currentName": "menu_muyPie"
        }
        locals.setObject("href", obj);
        angular.element("#menu_zztz").find("#menu_muyPie").addClass("active");
        angular.element("#menu_zztz").find("#menu_muyPie").siblings("li").removeClass("active");
        $state.go("zztzfx.myPie");
    }

}