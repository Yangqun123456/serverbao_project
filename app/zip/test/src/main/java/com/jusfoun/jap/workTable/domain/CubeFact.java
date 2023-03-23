package com.jusfoun.jap.workTable.domain;


import java.util.List;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.Table;

import com.itmuch.core.entity.BaseEntity;

@Table(name = "T_CUBE_FACT")
public class CubeFact extends BaseEntity{
	
	@Id
    @Column(name = "cube_fact_id")
    private Long cubeFactId;
	
	@Column(name = "cube_id")
    private String cubeId;
    
	@Column(name = "fact_table_name")
    private String factTableName;
    
	@Column(name = "fact_table_column")
    private String factTableColumn;
	
	@Column(name = "fact_table_rule")
    private List<String> factTableRule;
	/*
	 *存储和查询时用字符串factTableRules
	 *返回给js时用list形式
	 */
	private String factTableRules;
	public List<String> getFactTableRule() {
		return factTableRule;
	}

	public void setFactTableRule(List<String> factTableRule) {
		this.factTableRule = factTableRule;
	}

	public Long getCubeFactId() {
		return cubeFactId;
	}

	public void setCubeFactId(Long cubeFactId) {
		this.cubeFactId = cubeFactId;
	}

	public String getCubeId() {
		return cubeId;
	}

	public void setCubeId(String cubeId) {
		this.cubeId = cubeId;
	}

	public String getFactTableName() {
		return factTableName;
	}

	public void setFactTableName(String factTableName) {
		this.factTableName = factTableName;
	}

	public String getFactTableColumn() {
		return factTableColumn;
	}

	public void setFactTableColumn(String factTableColumn) {
		this.factTableColumn = factTableColumn;
	}

	public String getFactTableRules() {
		return factTableRules;
	}

	public void setFactTableRules(String factTableRules) {
		this.factTableRules = factTableRules;
	}
	
	
	
	
    
	
}