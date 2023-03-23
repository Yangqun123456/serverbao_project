package com.jusfoun.jap.workTable.vo;

import java.util.List;

/**
 *
 * @author zsy
 *
 */
public class WorkTableDetail {
	private String tableType;// 1代表筛选行里的维度，2代表筛选行里的度量,3维度行，4度量行
	private String workTableId;// 数据分析id
	private String tableName;// 事实表或维表表名
	private String tableNameCn;
	private String tableColumn;// 事实表或维表列名
	private String tableColumnCn;
	private String factTableRule;// 度量计算规则
	private String ruleName;//度量规则中文名
	private String dimFactFilterId;// 主键
	private List<String> listFilters;// 筛选条件
	private List<String> listAllValue;// 该维度的所有值
	private String listFilter;// 筛选条件
	private String nextFlag;
	private String chartType;
	private Integer dimMeasureOrder;//维度或度量的顺序
	private String factRules;
	private List<RuleVO> rules;
	
	public String getTableNameCn() {
		return tableNameCn;
	}

	public void setTableNameCn(String tableNameCn) {
		this.tableNameCn = tableNameCn;
	}

	public String getTableColumnCn() {
		return tableColumnCn;
	}

	public void setTableColumnCn(String tableColumnCn) {
		this.tableColumnCn = tableColumnCn;
	}

	public String getRuleName() {
		return ruleName;
	}

	public void setRuleName(String ruleName) {
		this.ruleName = ruleName;
	}


	/**
	 * @return the listFilters
	 */
	public List<String> getListFilters() {
		return listFilters;
	}

	/**
	 * @param listFilters the listFilters to set
	 */
	public void setListFilters(List<String> listFilters) {
		this.listFilters = listFilters;
	}

	/**
	 * @return the listFilter
	 */
	public String getListFilter() {
		return listFilter;
	}

	/**
	 * @param listFilter the listFilter to set
	 */
	public void setListFilter(String listFilter) {
		this.listFilter = listFilter;
	}

	public String getFactTableRule() {
		return factTableRule;
	}

	public void setFactTableRule(String factTableRule) {
		this.factTableRule = factTableRule;
	}

	public String getTableType() {
		return tableType;
	}

	public void setTableType(String tableType) {
		this.tableType = tableType;
	}

	public String getWorkTableId() {
		return workTableId;
	}

	public void setWorkTableId(String workTableId) {
		this.workTableId = workTableId;
	}

	public String getTableName() {
		return tableName;
	}

	public void setTableName(String tableName) {
		this.tableName = tableName;
	}

	public String getTableColumn() {
		return tableColumn;
	}

	public void setTableColumn(String tableColumn) {
		this.tableColumn = tableColumn;
	}

	public String getDimFactFilterId() {
		return dimFactFilterId;
	}

	public void setDimFactFilterId(String dimFactFilterId) {
		this.dimFactFilterId = dimFactFilterId;
	}

	public Integer getDimMeasureOrder() {
		return dimMeasureOrder;
	}

	public void setDimMeasureOrder(Integer dimMeasureOrder) {
		this.dimMeasureOrder = dimMeasureOrder;
	}

	public String getNextFlag() {
		return nextFlag;
	}

	public void setNextFlag(String nextFlag) {
		this.nextFlag = nextFlag;
	}

	public List<RuleVO> getRules() {
		return rules;
	}

	public void setRules(List<RuleVO> rules) {
		this.rules = rules;
	}

	public String getFactRules() {
		return factRules;
	}

	public void setFactRules(String factRules) {
		this.factRules = factRules;
	}

	public String getChartType() {
		return chartType;
	}

	public void setChartType(String chartType) {
		this.chartType = chartType;
	}

	public List<String> getListAllValue() {
		return listAllValue;
	}

	public void setListAllValue(List<String> listAllValue) {
		this.listAllValue = listAllValue;
	}
	
}
