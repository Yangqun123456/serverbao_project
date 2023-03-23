package com.jusfoun.jap.workTable.vo;

import java.util.Date;
import java.util.List;

import com.jusfoun.jap.common.Results;

public class WorkTableResult {
	private String workTableId;
	private String workTableName;
	private String workTableCode;
	private Date workTableDate;
	private String userId;
	private String dataType;
	private String cubeId;
	private Integer workTableOrder;//仪表盘中工作表顺序
	private String tableBorderShow;
	private String tableBorderColor;
	private String tableBorderWidth;
	private Results result;
	private String xsColor;
	private String xwColor;
	private String ysColor;
	private String ywColor;
	private String tableColor;
	private String bodyColor;
	private String headerColor;
	private List<WorkTableDetail> dimTable;
	private List<WorkTableDetail> measures;
	private List<WorkTableDetail> filters;
	
	
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
	public String getTableBorderShow() {
		return tableBorderShow;
	}

	public void setTableBorderShow(String tableBorderShow) {
		this.tableBorderShow = tableBorderShow;
	}

	public String getTableBorderColor() {
		return tableBorderColor;
	}

	public void setTableBorderColor(String tableBorderColor) {
		this.tableBorderColor = tableBorderColor;
	}

	public String getTableBorderWidth() {
		return tableBorderWidth;
	}

	public void setTableBorderWidth(String tableBorderWidth) {
		this.tableBorderWidth = tableBorderWidth;
	}

	public Integer getWorkTableOrder() {
		return workTableOrder;
	}

	public void setWorkTableOrder(Integer workTableOrder) {
		this.workTableOrder = workTableOrder;
	}

	public String getCubeId() {
		return cubeId;
	}

	public void setCubeId(String cubeId) {
		this.cubeId = cubeId;
	}

	public String getWorkTableId() {
		return workTableId;
	}

	public void setWorkTableId(String workTableId) {
		this.workTableId = workTableId;
	}

	public String getWorkTableName() {
		return workTableName;
	}

	public void setWorkTableName(String workTableName) {
		this.workTableName = workTableName;
	}


	public Date getWorkTableDate() {
		return workTableDate;
	}

	public void setWorkTableDate(Date workTableDate) {
		this.workTableDate = workTableDate;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getDataType() {
		return dataType;
	}

	public void setDataType(String dataType) {
		this.dataType = dataType;
	}

	public Results getResult() {
		return result;
	}

	public void setResult(Results result) {
		this.result = result;
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

	public List<WorkTableDetail> getFilters() {
		return filters;
	}

	public void setFilters(List<WorkTableDetail> filters) {
		this.filters = filters;
	}

	public List<WorkTableDetail> getMeasures() {
		return measures;
	}

	public void setMeasures(List<WorkTableDetail> measures) {
		this.measures = measures;
	}

	public List<WorkTableDetail> getDimTable() {
		return dimTable;
	}

	public void setDimTable(List<WorkTableDetail> dimTable) {
		this.dimTable = dimTable;
	}

	public String getWorkTableCode() {
		return workTableCode;
	}

	public void setWorkTableCode(String workTableCode) {
		this.workTableCode = workTableCode;
	}
	
}
