package com.jusfoun.jap.hive.vo;

import java.io.Serializable;

public class DimensionVo implements Serializable{
	
	private String tableName;//lookups->table;dimensions->table
	
	private String columnName;//lookups->join->primary_key
	
	private String remarks;//dimensions->columns,list就一个
	
	private String dataType;

	public String getTableName() {
		return tableName;
	}

	public void setTableName(String tableName) {
		this.tableName = tableName;
	}

	public String getColumnName() {
		return columnName;
	}

	public void setColumnName(String columnName) {
		this.columnName = columnName;
	}

	public String getRemarks() {
		return remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}

	public String getDataType() {
		return dataType;
	}

	public void setDataType(String dataType) {
		this.dataType = dataType;
	}
	
	
	

}
