/**
 * 
 */
package com.jusfoun.jap.workTable.vo;

import java.util.List;

/**
 * @author wcq
 *
 */
public class ChartTwo {
	private String nameWeidu;
	private String valueName;
	private List<ChartOne> data;
	public String getNameWeidu() {
		return nameWeidu;
	}
	public void setNameWeidu(String nameWeidu) {
		this.nameWeidu = nameWeidu;
	}
	public String getValueName() {
		return valueName;
	}
	public void setValueName(String valueName) {
		this.valueName = valueName;
	}
	public List<ChartOne> getData() {
		return data;
	}
	public void setData(List<ChartOne> data) {
		this.data = data;
	}
	
}
