/**
 * 
 */
package com.jusfoun.jap.workTable.vo;

import java.util.List;

/**
 * @author wcq
 *
 */
public class ChartFour {
	private String nameWeidu;
	private String valueName;
	private List<ChartThree> data;
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
	public List<ChartThree> getData() {
		return data;
	}
	public void setData(List<ChartThree> data) {
		this.data = data;
	}
	
}
