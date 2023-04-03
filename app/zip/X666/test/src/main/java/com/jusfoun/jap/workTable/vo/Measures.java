/**
 * 
 */
package com.jusfoun.jap.workTable.vo;

import java.util.Arrays;
import java.util.List;

/**
 * @author Rain
 *
 */
public class Measures {
	private String measuresTableName ;
	private String measuresColumn ;
	private List<String> ListMeasures ;
	private String rowType ;	//标记行类型1：度量行，2：筛选行，3：即在筛选也在度量行
	private int dimMeasureOrder ;//拖拽时的顺序
	
	public String getMeasuresTableName() {
		return measuresTableName;
	}
	public void setMeasuresTableName(String measuresTableName) {
		this.measuresTableName = measuresTableName;
	}
	public String getMeasuresColumn() {
		return measuresColumn;
	}
	public void setMeasuresColumn(String measuresColumn) {
		this.measuresColumn = measuresColumn;
	}
	public String getRowType() {
		return rowType;
	}
	public List<String> getListMeasures() {
		return ListMeasures;
	}
	public void setListMeasures(List<String> listMeasures) {
		ListMeasures = listMeasures;
	}
	public void setRowType(String rowType) {
		this.rowType = rowType;
	}
	public void setListMeasures(String listFilter) {//将形如[1, 2, 3, 5]的字符串转为list<String>
		if(listFilter!=null&!"".equals(listFilter)){
			this.ListMeasures = Arrays.asList(listFilter.replace("[", "").replace("]","").split(","));
		}
	}
	public int getDimMeasureOrder() {
		return dimMeasureOrder;
	}
	public void setDimMeasureOrder(int dimMeasureOrder) {
		this.dimMeasureOrder = dimMeasureOrder;
	}

}
