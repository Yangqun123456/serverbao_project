/**
 * 
 */
package com.jusfoun.jap.workTable.vo;

import java.util.List;

/**
 * @author wcq
 *
 */
public class DataY {
private String nameDuliang;
private String unitDuliang;
private String dataType;
private String chartType;
private String maxY;
private String minY;
private List<String> data_y;

public String getMaxY() {
	return maxY;
}
public void setMaxY(String maxY) {
	this.maxY = maxY;
}
public String getMinY() {
	return minY;
}
public void setMinY(String minY) {
	this.minY = minY;
}
public String getNameDuliang() {
	return nameDuliang;
}
public void setNameDuliang(String nameDuliang) {
	this.nameDuliang = nameDuliang;
}
public String getUnitDuliang() {
	return unitDuliang;
}
public void setUnitDuliang(String unitDuliang) {
	this.unitDuliang = unitDuliang;
}
public String getDataType() {
	return dataType;
}
public void setDataType(String dataType) {
	this.dataType = dataType;
}
public List<String> getData_y() {
	return data_y;
}
public void setData_y(List<String> data_y) {
	this.data_y = data_y;
}
public String getChartType() {
	return chartType;
}
public void setChartType(String chartType) {
	this.chartType = chartType;
}

}
