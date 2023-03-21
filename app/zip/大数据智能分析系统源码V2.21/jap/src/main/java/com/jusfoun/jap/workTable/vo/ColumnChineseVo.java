/**
 * 
 */
package com.jusfoun.jap.workTable.vo;

/**
 * @author 
 *
 */
public class ColumnChineseVo {
	private String tableName;
	private String tableColumn;
	private String dataName;
	private String tableColumnCn;
	private Integer columnOrder;
	private Integer nextFlag;
	public String getDataName() {
		return dataName;
	}
	public void setDataName(String dataName) {
		this.dataName = dataName;
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
	public Integer getColumnOrder() {
		return columnOrder;
	}
	public void setColumnOrder(Integer columnOrder) {
		this.columnOrder = columnOrder;
	}
	public Integer getNextFlag() {
		return nextFlag;
	}
	public void setNextFlag(Integer nextFlag) {
		this.nextFlag = nextFlag;
	}
	public String getTableName() {
		return tableName;
	}
	public void setTableName(String tableName) {
		this.tableName = tableName;
	}
	
}
