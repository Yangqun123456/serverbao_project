package com.jusfoun.jap.hive.mapper;

import java.util.List;

import com.jusfoun.jap.cube.domain.Cube;
import com.jusfoun.jap.cube.domain.Tag;
import com.jusfoun.jap.cube.vo.CubeVo;
import com.jusfoun.jap.hive.vo.DataSourceTable;
import com.jusfoun.jap.hive.vo.ModelVo;
import com.jusfoun.jap.workTable.domain.CubeDim;
import com.jusfoun.jap.workTable.domain.CubeFact;

public interface HiveMapper{
	
	//查询数据模型主页面
	public List<ModelVo> queryDataModel(String modelName,Boolean isShow);
	
	//查询所有的表信息
	public List<DataSourceTable> querydataSourceTable();
}
