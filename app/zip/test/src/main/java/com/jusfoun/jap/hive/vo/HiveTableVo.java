package com.jusfoun.jap.hive.vo;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class HiveTableVo implements Serializable{
	private String tableName;
	
	private String tableRemarks;
	
	private List<ColumnVo> columns=new ArrayList<ColumnVo>();

	public String getTableName() {
		return tableName;
	}

	public void setTableName(String tableName) {
		this.tableName = tableName;
	}

	public String getTableRemarks() {
		return tableRemarks;
	}

	public void setTableRemarks(String tableRemarks) {
		this.tableRemarks = tableRemarks;
	}

	public List<ColumnVo> getColumns() {
		return columns;
	}

	public void setColumns(List<ColumnVo> columns) {
		this.columns = columns;
	}
	
	public ColumnVo getColumnVo(String columnName){
		Map<String,ColumnVo> map=new HashMap<String,ColumnVo>();
		for(ColumnVo cv:this.columns){
			map.put(cv.getColumnName(), cv);
		}
		return map.get(columnName);
	}
	
	

}


	
	
	
	
