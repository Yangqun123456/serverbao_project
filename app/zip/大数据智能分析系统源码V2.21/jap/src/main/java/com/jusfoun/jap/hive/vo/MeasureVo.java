package com.jusfoun.jap.hive.vo;

import java.io.Serializable;

public class MeasureVo implements Serializable{

	private String tableName;

	private String columnName;// metrics,从List<MeasureVo>中提取

	private String remarks;

	private String dataType;

	private String computationRules;

	public String getRemarks() {
		return remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}

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

	public String getDataType() {
		return dataType;
	}

	public void setDataType(String dataType) {
		this.dataType = dataType;
	}

	public String getComputationRules() {
		return computationRules;
	}

	public void setComputationRules(String computationRules) {
		this.computationRules = computationRules;
	}

}
