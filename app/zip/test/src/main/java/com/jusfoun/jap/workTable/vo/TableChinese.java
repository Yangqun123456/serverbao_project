/**
 * 
 */
package com.jusfoun.jap.workTable.vo;

import java.util.List;

/**
 * @author 
 *
 */
public class TableChinese {
	private String tableName;
	private String tableNameCn;
	private List<ColumnChineseVo> data;
	public String getTableName() {
		return tableName;
	}
	public void setTableName(String tableName) {
		this.tableName = tableName;
	}
	public String getTableNameCn() {
		return tableNameCn;
	}
	public void setTableNameCn(String tableNameCn) {
		this.tableNameCn = tableNameCn;
	}
	public List<ColumnChineseVo> getData() {
		return data;
	}
	public void setData(List<ColumnChineseVo> data) {
		this.data = data;
	}
	
}
