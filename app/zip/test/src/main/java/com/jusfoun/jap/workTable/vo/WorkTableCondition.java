/**
 *
 */
package com.jusfoun.jap.workTable.vo;

import java.util.List;

/**
 * @author Rain
 *
 */
public class WorkTableCondition {
	private List<WorkTableDetail> dimTable;
	private List<WorkTableDetail> measures;
	private List<WorkTableDetail> filters;
	private String cubeId;
	private String userId;
	private String workTableName;
	private String workTableCode;//工作表编码
	private String workTableId;
	private String dataType;// line,bar,pie,gauge（仪表盘图）,radar(雷达图),funnel(漏斗图),scatter(散点图),map
	private String xsColor;
	private String xwColor;
	private String ysColor;
	private String ywColor;
	private String tableColor;
	private String bodyColor;
	private String headerColor;
	private String themeId;
	private String themeColor;
	private List<String> themeColorArr;
	
	
	/**
	 * @return the themeId
	 */
	public String getThemeId() {
		return themeId;
	}

	/**
	 * @param themeId the themeId to set
	 */
	public void setThemeId(String themeId) {
		this.themeId = themeId;
	}

	public String getTableColor() {
		return tableColor;
	}

	public void setTableColor(String tableColor) {
		this.tableColor = tableColor;
	}

	public String getBodyColor() {
		return bodyColor;
	}

	public void setBodyColor(String bodyColor) {
		this.bodyColor = bodyColor;
	}

	public String getHeaderColor() {
		return headerColor;
	}

	public void setHeaderColor(String headerColor) {
		this.headerColor = headerColor;
	}

	public List<WorkTableDetail> getFilters() {
		return filters;
	}

	public void setFilters(List<WorkTableDetail> filters) {
		this.filters = filters;
	}

	public String getWorkTableId() {
		return workTableId;
	}

	public void setWorkTableId(String workTableId) {
		this.workTableId = workTableId;
	}

	public List<WorkTableDetail> getDimTable() {
		return dimTable;
	}

	public void setDimTable(List<WorkTableDetail> dimTable) {
		this.dimTable = dimTable;
	}

	public List<WorkTableDetail> getMeasures() {
		return measures;
	}

	public void setMeasures(List<WorkTableDetail> measures) {
		this.measures = measures;
	}

	public String getCubeId() {
		return cubeId;
	}

	public void setCubeId(String cubeId) {
		this.cubeId = cubeId;
	}

	public String getWorkTableName() {
		return workTableName;
	}

	public void setWorkTableName(String workTableName) {
		this.workTableName = workTableName;
	}

	public String getDataType() {
		return dataType;
	}

	public void setDataType(String dataType) {
		this.dataType = dataType;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getXsColor() {
		return xsColor;
	}

	public void setXsColor(String xsColor) {
		this.xsColor = xsColor;
	}

	public String getXwColor() {
		return xwColor;
	}

	public void setXwColor(String xwColor) {
		this.xwColor = xwColor;
	}

	public String getYsColor() {
		return ysColor;
	}

	public void setYsColor(String ysColor) {
		this.ysColor = ysColor;
	}

	public String getYwColor() {
		return ywColor;
	}

	public void setYwColor(String ywColor) {
		this.ywColor = ywColor;
	}

	public String getThemeColor() {
		return themeColor;
	}

	public void setThemeColor(String themeColor) {
		this.themeColor = themeColor;
	}

	public List<String> getThemeColorArr() {
		return themeColorArr;
	}

	public void setThemeColorArr(List<String> themeColorArr) {
		this.themeColorArr = themeColorArr;
	}

	public String getWorkTableCode() {
		return workTableCode;
	}

	public void setWorkTableCode(String workTableCode) {
		this.workTableCode = workTableCode;
	}
	
	
}
