/**
 * 
 */
package com.jusfoun.jap.workTable.vo;

import java.util.List;

import com.jusfoun.jap.workTable.domain.ColumnChinese;

/**
 * @author 
 *
 */
public class CubeDetail {
	private List<TableChinese> listDim;
	private List<ColumnChinese> listFact;
	public List<TableChinese> getListDim() {
		return listDim;
	}
	public void setListDim(List<TableChinese> listDim) {
		this.listDim = listDim;
	}
	public List<ColumnChinese> getListFact() {
		return listFact;
	}
	public void setListFact(List<ColumnChinese> listFact) {
		this.listFact = listFact;
	}
	
}
