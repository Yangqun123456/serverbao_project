/**
 *
 */
package com.jusfoun.jap.workTable.vo;

import java.util.List;

/**
 * @author Rain
 *
 */
public class WorkCondition {
	private List<CubeDimVo> dimTable;
	private List<Measures> measures;
	private String cubeId;
	private String workTableName;
	private String workTableCode;
	private String workTableId;

	public String getWorkTableName() {
		return workTableName;
	}

	public void setWorkTableName(String workTableName) {
		this.workTableName = workTableName;
	}

	private String dataType;// line,bar,pie,gauge（仪表盘图）,radar(雷达图),funnel(漏斗图),scatter(散点图),map

	public List<CubeDimVo> getDimTable() {
		return dimTable;
	}

	public void setDimTable(List<CubeDimVo> dimTable) {
		this.dimTable = dimTable;
	}

	public String getDataType() {
		return dataType;
	}

	public List<Measures> getMeasures() {
		return measures;
	}

	public void setMeasures(List<Measures> measures) {
		this.measures = measures;
	}

	public void setDataType(String dataType) {
		this.dataType = dataType;
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

	public String getWorkTableCode() {
		return workTableCode;
	}

	public void setWorkTableCode(String workTableCode) {
		this.workTableCode = workTableCode;
	}

}
