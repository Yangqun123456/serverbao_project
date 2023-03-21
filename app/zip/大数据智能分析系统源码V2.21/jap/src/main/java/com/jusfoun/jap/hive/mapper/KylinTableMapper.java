package com.jusfoun.jap.hive.mapper;

import java.util.List;

import com.jusfoun.jap.hive.domain.KylinTable;
import com.jusfoun.jap.hive.domain.KylinTableColumn;

import tk.mybatis.mapper.common.Mapper;

public interface KylinTableMapper extends Mapper<KylinTable> {
	public void insertKylinTable(KylinTable kylinTable);
	
	public List<KylinTable> findKylinTableByCubeId(String cubeId);
}