package com.jusfoun.jap.hive.mapper;

import java.util.List;

import com.jusfoun.jap.hive.domain.HiveTableRelation;
import com.jusfoun.jap.hive.vo.RelationVo;

import tk.mybatis.mapper.common.Mapper;

public interface HiveTableRelationMapper extends Mapper<HiveTableRelation> {
	public void insertHiveTableRelation(HiveTableRelation hiveTableRelation);
	
	public List<HiveTableRelation> findHiveTableRelationByCubeId(String cubeId);
	
	public List<RelationVo> findHiveTableRelationVoByCubeId(String cubeId);
}