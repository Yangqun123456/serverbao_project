package com.jusfoun.jap.hive.vo;

import java.io.Serializable;

public class ColumnVo implements Serializable{
	private String columnName;
	
	private String dataType;
	
	private String columnRemarks;
	
	/**
	 * 1维度 2度量
	 */
	private String type;

	public String getColumnName() {
		return columnName;
	}

	public void setColumnName(String columnName) {
		this.columnName = columnName;
	}


	public String getDataType() {
		return dataType;
	}

	public void setDataType(String dataType) {
		this.dataType = dataType;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getColumnRemarks() {
		return columnRemarks;
	}

	public void setColumnRemarks(String columnRemarks) {
		this.columnRemarks = columnRemarks;
	}
}