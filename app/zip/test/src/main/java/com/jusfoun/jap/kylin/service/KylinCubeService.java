package com.jusfoun.jap.kylin.service;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.jusfoun.jap.hive.vo.ColumnVo;
import com.jusfoun.jap.hive.vo.DimensionVo;
import com.jusfoun.jap.hive.vo.HiveTableVo;
import com.jusfoun.jap.hive.vo.MeasureVo;
import com.jusfoun.jap.hive.vo.ModelVo;
import com.jusfoun.jap.kylin.domain.cube.AggregationGroup;
import com.jusfoun.jap.kylin.domain.cube.CubeDesc;
import com.jusfoun.jap.kylin.domain.cube.CubeRequest;
import com.jusfoun.jap.kylin.domain.cube.DimensionDesc;
import com.jusfoun.jap.kylin.domain.cube.FunctionDesc;
import com.jusfoun.jap.kylin.domain.cube.HBaseColumnDesc;
import com.jusfoun.jap.kylin.domain.cube.HBaseColumnFamilyDesc;
import com.jusfoun.jap.kylin.domain.cube.HBaseMappingDesc;
import com.jusfoun.jap.kylin.domain.cube.MeasureDesc;
import com.jusfoun.jap.kylin.domain.cube.ParameterDesc;
import com.jusfoun.jap.kylin.domain.cube.RowKeyColDesc;
import com.jusfoun.jap.kylin.domain.cube.RowKeyDesc;
import com.jusfoun.jap.kylin.domain.cube.SelectRule;
import com.jusfoun.jap.kylin.util.KylinConstants.KylinMethod;
import com.jusfoun.jap.kylin.util.KylinHttpClientUtil;
import com.jusfoun.jap.util.Constant;
import com.jusfoun.jap.util.JacksonUtil;

@Service
public class KylinCubeService {

	private transient Logger LOG = LoggerFactory.getLogger(getClass());
	
	public String buildCube(String cubeName) throws Exception
	{
		// http请求
		String url = Constant.KYLIN_ADDRESS + KylinMethod.BUILD_CUBE + "/" + cubeName + "/rebuild";
		String json = "{\"buildType\":\"BUILD\",\"startTime\":0,\"endTime\":0}";
		String responseContent = KylinHttpClientUtil.sendHttpPut(url, json);
		return responseContent;
	}
	
	
	public String getCube(String cubeName) throws Exception
	{
		// http请求
		String url = Constant.KYLIN_ADDRESS + KylinMethod.CUBE_DESC +"/" + cubeName;
		String responseContent = KylinHttpClientUtil.sendHttpGet(url);
		return responseContent;
	}
	/**
	 * model json 数据发送
	 * @throws Exception 
	 */
	public CubeRequest createCubeModel(ModelVo modelVo, String modelName) throws Exception{
		// http请求
		String url = Constant.KYLIN_ADDRESS + KylinMethod.POST_CUBE;
		
		CubeRequest cubeRequest = new CubeRequest();
		//设置cubeRequest信息,
		cubeRequest.setProject(Constant.KYLIN_PROJECTNAME);
		CubeDesc cubeDesc = createCubeDesc(modelVo, modelName);
		cubeRequest.setCubeDescData(JacksonUtil.toJSon(cubeDesc));
		
		String json = JacksonUtil.toJSon(cubeRequest);
		LOG.info("createCubeModel request json="+json);
		String responseContent = KylinHttpClientUtil.sendHttpPost(url.toString(), json);
		LOG.info("createCubeModel responseContent="+responseContent);
		cubeRequest = JacksonUtil.readValue(responseContent, CubeRequest.class);
		return cubeRequest;
	}
	
	private CubeDesc createCubeDesc(ModelVo modelVo, String modelName) {
		CubeDesc cubeDesc = new CubeDesc();
		cubeDesc.setName("CUBE_"+modelVo.getFactTable().getTableName().replaceAll(Constant.HIVE_ANALYSIS_DATABASE+".", "").toUpperCase());
		cubeDesc.setModelName(modelName);
		cubeDesc.setDescription(modelVo.getModelDesc());
		cubeDesc.setDimensions(createDimensionDescList(modelVo));
		List<MeasureDesc> measures = createMeasureDescList(modelVo.getMeasures());
		cubeDesc.setMeasures(measures);
		cubeDesc.setRowkey(createRowkey(modelVo.getFactTable()));
		cubeDesc.setAggregationGroups(createAggregationGroups(modelVo.getFactTable()));
		cubeDesc.setPartitionDateStart(0);
		
		cubeDesc.setHbaseMapping(createHbaseMapping(measures));
		cubeDesc.setRetentionRange(0);
		List<String> statusNeedNotify = new ArrayList<String>();
		statusNeedNotify.add("ERROR");
		statusNeedNotify.add("DISCARDED");
		statusNeedNotify.add("SUCCEED");
		cubeDesc.setStatusNeedNotify(statusNeedNotify);
		//cubeDesc.setAutoMergeTimeRanges(null);//long[]
		cubeDesc.setEngineType(2);
		cubeDesc.setStorageType(2);
		return cubeDesc;
	}

	private HBaseMappingDesc createHbaseMapping(List<MeasureDesc> measures) {
		
		HBaseMappingDesc hBaseMappingDesc = new HBaseMappingDesc();
		
		List<HBaseColumnFamilyDesc> columnFamilyDescList = new ArrayList<HBaseColumnFamilyDesc>();
		HBaseColumnFamilyDesc columnFamily = new HBaseColumnFamilyDesc();
		columnFamily.setName("F1");
		
		List<HBaseColumnDesc> columns = new ArrayList<HBaseColumnDesc>();
		HBaseColumnDesc hBaseColumnDesc = new HBaseColumnDesc();
		hBaseColumnDesc.setQualifier("M");
		List<String> measureRefs = new ArrayList<String>();
		for(MeasureDesc desc : measures)
		{
			measureRefs.add(desc.getName());
		}
		hBaseColumnDesc.setMeasureRefs(measureRefs);
		columns.add(hBaseColumnDesc);
		
		HBaseColumnDesc[] columnsArray = (HBaseColumnDesc[]) columns.toArray(
				new HBaseColumnDesc[columns.size()]);
		columnFamily.setColumns(columnsArray);
		
		columnFamilyDescList.add(columnFamily);
		
		HBaseColumnFamilyDesc[] array = (HBaseColumnFamilyDesc[]) columnFamilyDescList.toArray(
				new HBaseColumnFamilyDesc[columnFamilyDescList.size()]);
		hBaseMappingDesc.setColumnFamily(array);
		return hBaseMappingDesc;
	}

	//createcCubeDesc->setDimensions
	private List<DimensionDesc> createDimensionDescList(ModelVo modelVo) {
		List<DimensionDesc> dimensionDescList = new ArrayList<DimensionDesc>();
		HiveTableVo factTable = modelVo.getFactTable();
		List<ColumnVo> factColums = factTable.getColumns();
		DimensionDesc dimensionDesc = null;
		for(ColumnVo vo : factColums)
		{
			dimensionDesc = new DimensionDesc();
			dimensionDesc.setName(factTable.getTableName()+"."+vo.getColumnName());
			dimensionDesc.setTable(factTable.getTableName());
			dimensionDesc.setColumn(vo.getColumnName());
			dimensionDescList.add(dimensionDesc);
		}
		List<DimensionVo> list = modelVo.getDimensions();
		for(DimensionVo dimensionVo : list)
		{
			dimensionDesc = new DimensionDesc();
			dimensionDesc.setName(dimensionVo.getTableName()+"_DERIVED");
			dimensionDesc.setTable(dimensionVo.getTableName());
			String[] derived = new String[]{dimensionVo.getColumnName()};
			dimensionDesc.setDerived(derived);//String[]
			dimensionDescList.add(dimensionDesc);
		}
		
		return dimensionDescList;
	}
	
	//createcCubeDesc->setMeasures
	private List<MeasureDesc> createMeasureDescList(List<MeasureVo> measuresList) {
		List<MeasureDesc> measureDescList = new ArrayList<MeasureDesc>();
		//第一个默认信息
		MeasureDesc defaultMeasureDesc = new MeasureDesc();
		defaultMeasureDesc.setName("_COUNT_");
		
		FunctionDesc defaultFunctionDesc = new FunctionDesc();
		defaultFunctionDesc.setExpression("COUNT");
		defaultFunctionDesc.setReturnType("BIGINT");
		
		ParameterDesc defaultParameterDesc = new ParameterDesc();
		defaultParameterDesc.setType("constant");
		defaultParameterDesc.setValue("1");
		defaultParameterDesc.setNextParameter(null);
		
		defaultFunctionDesc.setParameter(defaultParameterDesc);
		defaultMeasureDesc.setFunction(defaultFunctionDesc);//FunctionDesc
		measureDescList.add(defaultMeasureDesc);
		
		MeasureDesc measureDesc = null;
		FunctionDesc functionDesc = null;
		ParameterDesc parameterDesc = null;
		//循环体
//		for(MeasureVo measureVo:measuresList){
//			measureDesc = new MeasureDesc();
//			measureDesc.setName("_"+measureVo.getComputationRules()+"_");
//			
//			functionDesc = new FunctionDesc();
//			functionDesc.setReturnType("column");
//			parameterDesc = new ParameterDesc();
//			parameterDesc.setValue(measureVo.getColumnName());
//			//parameterDesc.setValue();
//			functionDesc.setParameter(parameterDesc);
//			measureDesc.setFunction(functionDesc);//FunctionDesc
//			measureDescList.add(measureDesc);
//		}
		return measureDescList;
	}
	
	//createcCubeDesc->setRowkey
	private RowKeyDesc createRowkey(HiveTableVo factTable) {
		
		RowKeyDesc rowKeyDesc = new RowKeyDesc();
		List<RowKeyColDesc>  list = new ArrayList<RowKeyColDesc>();
		
		List<ColumnVo> columns= factTable.getColumns();
		RowKeyColDesc rowKeyColDesc = null;
		for(ColumnVo vo : columns)
		{
			rowKeyColDesc = new RowKeyColDesc();
			rowKeyColDesc.setColumn(vo.getColumnName());
			rowKeyColDesc.setEncoding("dict");
			list.add(rowKeyColDesc);
		}
		
		rowKeyDesc.setRowkeyColumns((RowKeyColDesc[]) list.toArray(new RowKeyColDesc[list.size()]));
		return rowKeyDesc;
	}

	//createcCubeDesc->setAggregationGroups
	private List<AggregationGroup> createAggregationGroups(HiveTableVo factTable) {
		
		List<ColumnVo> columns = factTable.getColumns();
		List<String> includes = new ArrayList<String>();
		for (ColumnVo vo : columns) {
			includes.add(vo.getColumnName());
		}
		
		List<AggregationGroup> agregationGroupList= new ArrayList<AggregationGroup>();
		AggregationGroup agregationGroup = new AggregationGroup();
		agregationGroup.setIncludes((String[]) includes.toArray(new String[includes.size()]));
		
		SelectRule selectRule = new  SelectRule();
		agregationGroup.setSelectRule(selectRule);
		agregationGroupList.add(agregationGroup);
		return agregationGroupList;
	}
	
}
