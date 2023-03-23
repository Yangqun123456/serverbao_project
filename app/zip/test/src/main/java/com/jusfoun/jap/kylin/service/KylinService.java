package com.jusfoun.jap.kylin.service;

import java.util.List;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.itmuch.core.page.PageVo;
import com.jusfoun.jap.cube.service.CubeService;
import com.jusfoun.jap.hive.vo.DimensionVo;
import com.jusfoun.jap.hive.vo.ModelVo;
import com.jusfoun.jap.kylin.domain.cube.CubeRequest;
import com.jusfoun.jap.kylin.util.KylinConstants;
import com.jusfoun.jap.kylin.util.KylinHttpClientUtil;
import com.jusfoun.jap.util.Constant;

@Service
public class KylinService {
	

	private transient Logger LOG = LoggerFactory.getLogger(getClass());
	@Resource
	private KylinModelService kylinModelService;
	@Resource
	private KylinCubeService kylinCubeService;
	@Resource
	private CubeService cubeService;
	
	public String sendKylinRequest(ModelVo modelVo) throws Exception{
		
		//1:加载hive表
		loadHiveTable(modelVo);
		//2:创建model
		String modelName = kylinModelService.createDataModel(modelVo);
		//3:创建cube
		CubeRequest cubeRequest = kylinCubeService.createCubeModel(modelVo, modelName);
		return cubeRequest.getUuid();
	}

	private void loadHiveTable(ModelVo modelVo) throws Exception {
		
		StringBuffer url = new StringBuffer();
		url.append(Constant.KYLIN_ADDRESS).append(KylinConstants.KylinMethod.LOAD_HIVETABLE).append("/");
		url.append(modelVo.getFactTable().getTableName()).append(",");
		List<DimensionVo> dimensionList = modelVo.getDimensions();
		for(DimensionVo vo : dimensionList)
		{
			url.append(vo.getTableName()).append(",");
		}
		url.append("/").append(Constant.KYLIN_PROJECTNAME);
		String json = "{\"calculate\":\"true\"}";
		LOG.info("loadHiveTable request url="+url.toString());
		String responseContent = KylinHttpClientUtil.sendHttpPost(url.toString(), json);
		LOG.info("loadHiveTable response="+responseContent);
	}
}
