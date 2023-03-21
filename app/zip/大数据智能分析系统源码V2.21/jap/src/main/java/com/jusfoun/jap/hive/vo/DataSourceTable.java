package com.jusfoun.jap.hive.vo;

import java.io.Serializable;
import java.util.List;

/*
 * 数据源表和字段信息
 */

public class DataSourceTable implements Serializable{
	private String tableName;
	
	private List<String> columnList;

	public String getTableName() {
		return tableName;
	}

	public void setTableName(String tableName) {
		this.tableName = tableName;
	}

	public List<String> getColumnList() {
		return columnList;
	}

	public void setColumnList(List<String> columnList) {
		this.columnList = columnList;
	}
}