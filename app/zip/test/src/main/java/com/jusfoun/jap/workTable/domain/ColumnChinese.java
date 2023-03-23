package com.jusfoun.jap.workTable.domain;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.Table;
import com.itmuch.core.entity.BaseEntity;
import com.jusfoun.jap.workTable.vo.RuleVO;

@Table(name = "T_COLUMN_CHINESE")
public class ColumnChinese {
	
	@Id
    @Column(name = "ID")
    private String id;
	private String factRules;
	private List<RuleVO> rules;
	private String cubeName;
	@Column(name = "COLUMN_NAME")
    private String tableColumn;
    
	@Column(name = "COLUMN_NAME_CN")
    private String tableColumnCn;
	
	@Column(name = "COLUMN_ORDER")
    private Integer columnOrder;
    
	@Column(name = "TABLE_NAME")
    private String tableName;
	
	@Column(name = "TABLE_NAME_CN")
    private String tableNameCn;
	
	@Column(name = "NEXT_FLAG")
    private Integer nextFlag;
	@Column(name = "DATA_NAME")
    private String dataName;
	
	@Column(name = "MEASURE_UNIT")
    private String measureUnit;
	public String getFactRules() {
		return factRules;
	}

	public void setFactRules(String factRules) {
		this.factRules = factRules;
	}

	public List<RuleVO> getRules() {
		return rules;
	}

	public void setRules(List<RuleVO> rules) {
		this.rules = rules;
	}
	public Integer getNextFlag() {
		return nextFlag;
	}

	public void setNextFlag(Integer nextFlag) {
		this.nextFlag = nextFlag;
	}

	public String getMeasureUnit() {
		return measureUnit;
	}

	public void setMeasureUnit(String measureUnit) {
		this.measureUnit = measureUnit;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}


	public Integer getColumnOrder() {
		return columnOrder;
	}

	public void setColumnOrder(Integer columnOrder) {
		this.columnOrder = columnOrder;
	}

	public String getTableNameCn() {
		return tableNameCn;
	}

	public void setTableNameCn(String tableNameCn) {
		this.tableNameCn = tableNameCn;
	}

	public String getTableName() {
		return tableName;
	}

	public void setTableName(String tableName) {
		this.tableName = tableName;
	}

	public String getDataName() {
		return dataName;
	}

	public String getTableColumn() {
		return tableColumn;
	}

	public void setTableColumn(String tableColumn) {
		this.tableColumn = tableColumn;
	}

	public String getTableColumnCn() {
		return tableColumnCn;
	}

	public void setTableColumnCn(String tableColumnCn) {
		this.tableColumnCn = tableColumnCn;
	}

	public void setDataName(String dataName) {
		this.dataName = dataName;
	}

	public String getCubeName() {
		return cubeName;
	}

	public void setCubeName(String cubeName) {
		this.cubeName = cubeName;
	}

	
    
	
}