package com.jusfoun.jap.hive.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSON;
import com.itmuch.core.page.PageVo;
import com.jusfoun.jap.hive.service.HiveService;
import com.jusfoun.jap.hive.util.HiveUtil;
import com.jusfoun.jap.hive.vo.ColumnVo;
import com.jusfoun.jap.hive.vo.DataSourceTable;
import com.jusfoun.jap.hive.vo.HiveTableVo;
import com.jusfoun.jap.hive.vo.ModelVo;
import com.jusfoun.jap.kylin.service.KylinCubeService;
import com.jusfoun.jap.kylin.service.KylinModelService;

@RestController
@RequestMapping(value = "/hive")
public class HiveController {
	
	@Autowired
	HiveService hiveService;
	@Autowired
	static KylinModelService kylinModelService;
	@Autowired
	static KylinCubeService kylinCubeService;
	//数据模型展示和查询
	@RequestMapping("/myDataModel")
	public void myDataModel(PageVo pageVo, String modelName, Boolean isShow){
		hiveService.myDataModel(pageVo, modelName, isShow);
	}
	
	//数据模型新增
	@RequestMapping("/myDataModelAdd")
	public List<DataSourceTable> myDataModelAdd(){
		return hiveService.myDataModelAdd();
	}
	
	//根据表名称搜索
	public List<DataSourceTable> DataSourceTableSearch(String tableName,List<DataSourceTable> DataSourceTable){
		return hiveService.DataSourceTableSearch(tableName, DataSourceTable);
	}
		
	@RequestMapping(value="/myDataModelSave", method=RequestMethod.POST,consumes=MediaType.APPLICATION_JSON_UTF8_VALUE)
	public void myDataModelSave( @RequestBody ModelVo  model){
		
//		System.out.println(model);
		hiveService.generateModel(model);
	}
	
	@RequestMapping("/generateModel")
//	public void generateModel(ModelVo modelVo){
		public void generateModel(){
		String modelVoStr="{'dimensions':[{'columnName':'order_customtype','dataType':'string','remarks':'客户类型','tableName':'dim_1cd97bd8aa9b4aa48a4a4f053fc4274a'},{'columnName':'order_time','dataType':'string','remarks':'时间','tableName':'dim_b25d4a7a6c5743a9b6ad08d83b0fa8c2'},{'columnName':'order_ordertype','dataType':'string','remarks':'订单类型','tableName':'dim_70c0d528e13e4521a97c87b796f115e9'}],'factTable':{'columns':[{'columnName':'order_money','columnRemarks':'金钱度量','dataType':'string','type':'2'},{'columnName':'order_customtype','columnRemarks':'客户类型','dataType':'string','type':'1'},{'columnName':'order_time','columnRemarks':'时间','dataType':'string','type':'1'},{'columnName':'order_ordertype','columnRemarks':'订单类型','dataType':'string','type':'1'}],'tableName':'fact_f4f4f9b3531d4a4d8e6d3ddc1acff839','tableRemarks':'订单数据模型'},'measures':[{'columnName':'order_money','computationRules':'sum','dataType':'string','remarks':'金钱度量','tableName':'fact_f4f4f9b3531d4a4d8e6d3ddc1acff839'}],'modelDesc':'订单数据模型','modelName':'订单','relations':[]}";
		ModelVo modelVo=(ModelVo)JSON.parseObject(modelVoStr,ModelVo.class);
	}
	
	@RequestMapping("/queryHiveTable")
	public List<HiveTableVo> queryHiveTable(String tableName){
		//fact_water_quality_change
		List<HiveTableVo> list=HiveUtil.listHiveTableVoList(tableName);
		return list;
	}
	@RequestMapping("/queryHiveTableColumns")
	public List<ColumnVo> queryHiveTableColumns(String tableName){
		List<ColumnVo> list=HiveUtil.getColumnInfo(tableName);
		return list;
	}
	
	@RequestMapping("/showModelDetail")
	public ModelVo myDataModelDetail(String cubeId){
		return hiveService.myDataModelDetail(cubeId);
	}
}
