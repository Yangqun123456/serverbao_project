package com.jusfoun.jap.kylin.service;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.jusfoun.jap.hive.vo.ColumnVo;
import com.jusfoun.jap.hive.vo.DimensionVo;
import com.jusfoun.jap.hive.vo.HiveTableVo;
import com.jusfoun.jap.hive.vo.ModelVo;
import com.jusfoun.jap.kylin.domain.model.DataModelDesc;
import com.jusfoun.jap.kylin.domain.model.DataModelDesc.RealizationCapacity;
import com.jusfoun.jap.kylin.domain.model.JoinDesc;
import com.jusfoun.jap.kylin.domain.model.LookupDesc;
import com.jusfoun.jap.kylin.domain.model.ModelDimensionDesc;
import com.jusfoun.jap.kylin.domain.model.ModelRequest;
import com.jusfoun.jap.kylin.domain.model.PartitionDesc;
import com.jusfoun.jap.kylin.util.KylinConstants.KylinMethod;
import com.jusfoun.jap.kylin.util.KylinHttpClientUtil;
import com.jusfoun.jap.util.Constant;
import com.jusfoun.jap.util.JacksonUtil;

@Service
public class KylinModelService {

	private transient Logger LOG = LoggerFactory.getLogger(getClass());
	/**
	 * model json 数据发送
	 * 
	 * @throws Exception
	 */
	public String createDataModel(ModelVo modelVo) throws Exception {
		
		// http请求
		String url = Constant.KYLIN_ADDRESS + KylinMethod.POST_MODEL;
				
		ModelRequest modelRequest = new ModelRequest();
		// 设置modelRequest信息,
		modelRequest.setProject(Constant.KYLIN_PROJECTNAME);
		DataModelDesc dataModelDesc = createDataModelDesc(modelVo);
		modelRequest.setModelDescData(JacksonUtil.toJSon(dataModelDesc));
		String json = JacksonUtil.toJSon(modelRequest);
		//
		LOG.info("createDataModel request json="+json);
		String responseContent = KylinHttpClientUtil.sendHttpPost(url.toString(), json);
		LOG.info("createDataModel responseContent="+responseContent);
		return dataModelDesc.getName();
	}

	private DataModelDesc createDataModelDesc(ModelVo modelVo) {
		DataModelDesc dataModelDesc = new DataModelDesc();
		dataModelDesc.setName("MODEL_"+modelVo.getFactTable().getTableName().replaceAll(Constant.HIVE_ANALYSIS_DATABASE+".", "").toUpperCase());
		dataModelDesc.setDescription("");
		dataModelDesc.setFactTable(modelVo.getFactTable().getTableName());
		dataModelDesc.setLookups(createLookupDescList(modelVo.getDimensions()));// List<LookupDesc>
		dataModelDesc.setFilterCondition("");
		dataModelDesc.setCapacity(RealizationCapacity.MEDIUM);
		dataModelDesc.setDimensions(createModelDimensionDescList(modelVo.getFactTable(), modelVo.getDimensions()));// List<ModelDimensionDesc>
		dataModelDesc.setMetrics(createMetrics(modelVo.getFactTable()));// String[]
		dataModelDesc.setPartitionDesc(new PartitionDesc());
		dataModelDesc.setLastModified(0);
		return dataModelDesc;
	}

	private String[] createMetrics(HiveTableVo factTable) {
		List<String> metrics = new ArrayList<String>();
		List<ColumnVo> columns = factTable.getColumns();
		for (ColumnVo vo : columns) {
			metrics.add(vo.getColumnName());
		}
		return (String[]) metrics.toArray(new String[metrics.size()]);
	}

	// createDataModel->createDataModelDesc->setLookups
	private List<LookupDesc> createLookupDescList(List<DimensionVo> dimensionVoList) {
		List<LookupDesc> lookupDescList = new ArrayList<LookupDesc>();
		// 循环体
		for (DimensionVo dimensionVo : dimensionVoList) {
			LookupDesc lookupDesc = new LookupDesc();
			lookupDesc.setTable(dimensionVo.getTableName());
			lookupDesc.setJoin(createJoinDesc(dimensionVo.getColumnName()));// JoinDesc
			lookupDescList.add(lookupDesc);
		}
		return lookupDescList;
	}

	// createDataModel->createDataModelDesc->createLookupDescList->setJoin
	private JoinDesc createJoinDesc(String columnName) {
		JoinDesc joinDesc = new JoinDesc();
		joinDesc.setType("inner");
		List<String> primaryKeList = new ArrayList<String>();
		primaryKeList.add(columnName);
		joinDesc.setPrimaryKey(primaryKeList);// String[]
		joinDesc.setForeignKey(primaryKeList);// String[]
		return joinDesc;
	}

	// createDataModel->createDataModelDesc->setDimensions
	private List<ModelDimensionDesc> createModelDimensionDescList(HiveTableVo hiveTableVo,
			List<DimensionVo> dimensionVoList) {
		List<ModelDimensionDesc> modelDimensionDescList = new ArrayList<ModelDimensionDesc>();
		// 第一个diension从hiveTableVo获取
		ModelDimensionDesc firstDimensionDesc = new ModelDimensionDesc();
		firstDimensionDesc.setTable(hiveTableVo.getTableName());
		List<String> columnList = new ArrayList<String>();
		for (ColumnVo columnVo : hiveTableVo.getColumns()) {
			columnList.add(columnVo.getColumnName());
		}
		firstDimensionDesc.setColumns(columnList);
		modelDimensionDescList.add(firstDimensionDesc);

		// 循环体
		for (DimensionVo dimensionVo : dimensionVoList) {
			ModelDimensionDesc modelDimensionDesc = new ModelDimensionDesc();
			modelDimensionDesc.setTable(dimensionVo.getTableName());
			List<String> columnsList = new ArrayList<String>();
			columnsList.add(dimensionVo.getColumnName());
			modelDimensionDesc.setColumns(columnsList);// String[]
			modelDimensionDescList.add(modelDimensionDesc);
		}

		return modelDimensionDescList;
	}

	// createDataModel->createDataModelDesc->setPartitionDesc
	private PartitionDesc createPartitionDesc() {
		PartitionDesc partitionDesc = new PartitionDesc();
		partitionDesc.setPartitionDateColumn(null);
		partitionDesc.setPartitionDateStart(null);
		partitionDesc.setPartitionType(null);
		partitionDesc.setPartitionDateFormat(null);
		partitionDesc.setPartitionTimeColumn(null);
		partitionDesc.setPartitionTimeStart(null);
		return partitionDesc;
	}

}
