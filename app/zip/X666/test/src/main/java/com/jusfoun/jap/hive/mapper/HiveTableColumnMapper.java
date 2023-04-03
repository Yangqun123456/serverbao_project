package com.jusfoun.jap.hive.mapper;

import java.util.List;

import com.jusfoun.jap.hive.domain.HiveTableColumn;
import tk.mybatis.mapper.common.Mapper;

public interface HiveTableColumnMapper extends Mapper<HiveTableColumn> {
	public void insertTableColumn(HiveTableColumn tableColumn);

}