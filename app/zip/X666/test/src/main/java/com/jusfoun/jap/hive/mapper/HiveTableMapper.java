package com.jusfoun.jap.hive.mapper;

import java.util.List;
import java.util.Set;

import org.apache.ibatis.annotations.Param;

import com.jusfoun.jap.hive.domain.HiveTable;

import tk.mybatis.mapper.common.Mapper;

public interface HiveTableMapper extends Mapper<HiveTable> {
	public void insertHiveTable(HiveTable hiveTable);
	
	public List<HiveTable> findHiveTableByTableId(@Param("set") Set<String> ids);
}