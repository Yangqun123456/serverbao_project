/**
 * 
 */
package com.jusfoun.jap.workTable.vo;

import java.util.List;

/**
 * @author wcq
 *
 */
public class ChartThree {
	private String nameWeidu;
	private String valueName;
	private List<ChartTwo> data;
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
	public List<ChartTwo> getData() {
		return data;
	}
	public void setData(List<ChartTwo> data) {
		this.data = data;
	}
	
}
