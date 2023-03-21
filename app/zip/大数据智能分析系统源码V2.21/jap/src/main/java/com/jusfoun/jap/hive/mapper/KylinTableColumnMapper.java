package com.jusfoun.jap.hive.mapper;

import java.util.List;

import com.jusfoun.jap.hive.domain.HiveTableColumn;
import com.jusfoun.jap.hive.domain.KylinTableColumn;
import tk.mybatis.mapper.common.Mapper;

public interface KylinTableColumnMapper extends Mapper<KylinTableColumn> {
	public void insertKylinTableColumn(KylinTableColumn kylinTableColumn);
	
	
	public List<KylinTableColumn> findHiveTableColumnByTableId(List<String> ids);
}