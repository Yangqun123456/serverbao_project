package com.jusfoun.jap.workTable.vo;

import java.util.Arrays;
import java.util.List;


public class CubeDimVo {
	
    private String cubeDimId;
	
    private String cubeId;
    
    private String tableName;
    
    private String tableColumn;
    
//    private String dimType;
    
    private String tableColumnCn;
    
    private List resultSet;
    
    private String  dimKey;
    
    private List<String> ListDim;
    
    private int dimMeasureOrder ;//拖拽时的顺序
    private String tableConnectColumn;
    
	private String rowType;//标记行类型1：度量行，2：筛选行，3：即在筛选也在度量行
    
    public String getDimKey() {
		return dimKey;
	}

	public void setDimKey(String dimKey) {
		this.dimKey = dimKey;
	}

	public List<String> getListDim() {
		return ListDim;
	}

	public void setListDim(List<String> listDim) {
		ListDim = listDim;
	}

	public String getRowType() {
		return rowType;
	}

	public void setRowType(String rowType) {
		this.rowType = rowType;
	}

	public List getResultSet() {
		return resultSet;
	}

	public void setResultSet(List resultSet) {
		this.resultSet = resultSet;
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


//	public String getDimType() {
//		return dimType;
//	}
//
//	public void setDimType(String dimType) {
//		this.dimType = dimType;
//	}

	

	public String getTableName() {
		return tableName;
	}

	public void setTableName(String tableName) {
		this.tableName = tableName;
	}

	public String getTableConnectColumn() {
		return tableConnectColumn;
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

	public void setTableConnectColumn(String tableConnectColumn) {
		this.tableConnectColumn = tableConnectColumn;
	}

	public void setListDim(String listFilter) {//将形如[1, 2, 3, 5]的字符串转为list<String>
		if(listFilter!=null&!"".equals(listFilter)){
			this.ListDim = Arrays.asList(listFilter.replace("[", "").replace("]","").split(","));
		}
	}

	public int getDimMeasureOrder() {
		return dimMeasureOrder;
	}

	public void setDimMeasureOrder(int dimMeasureOrder) {
		this.dimMeasureOrder = dimMeasureOrder;
	}
}