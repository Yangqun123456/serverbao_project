package com.jusfoun.jap.workTable.domain;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.Table;

import com.itmuch.core.entity.BaseEntity;

@Table(name = "T_CUBE_DIM")
public class CubeDim extends BaseEntity {

	@Id
	@Column(name = "cube_dim_id")
	private String cubeDimId;

	@Column(name = "cube_id")
	private String cubeId;

	@Column(name = "dim_table_name")
	private String dimTableName;

	@Column(name = "dim_table_column")
	private String dimColumn;
	
	@Column(name = "dim_type")
	private String dimType;

	@Column(name = "table_Connect_Column")
	private String tableConnectColumn;

	public String getTableConnectColumn() {
		return tableConnectColumn;
	}

	public void setTableConnectColumn(String tableConnectColumn) {
		this.tableConnectColumn = tableConnectColumn;
	}

	public String getCubeDimId() {
		return cubeDimId;
	}

	public void setCubeDimId(String cubeDimId) {
		this.cubeDimId = cubeDimId;
	}

	public String getCubeId() {
		return cubeId;
	}

	public void setCubeId(String cubeId) {
		this.cubeId = cubeId;
	}

	public String getDimTableName() {
		return dimTableName;
	}

	public void setDimTableName(String dimTableName) {
		this.dimTableName = dimTableName;
	}

	public String getDimColumn() {
		return dimColumn;
	}

	public void setDimColumn(String dimColumn) {
		this.dimColumn = dimColumn;
	}

	public String getDimType() {
		return dimType;
	}

	public void setDimType(String dimType) {
		this.dimType = dimType;
	}

	
    
	
}