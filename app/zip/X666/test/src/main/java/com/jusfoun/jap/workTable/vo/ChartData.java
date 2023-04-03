/**
 * 
 */
package com.jusfoun.jap.workTable.vo;

import java.util.List;

/**
 * @author 
 *
 */
public class ChartData {
	private String nameWeidu;
	private int colspan;
	private String valueName;
	private List<String> dataX;
	private List<DataY> dataY;
	private List<ChartData> data;
	public String getValueName() {
		return valueName;
	}
	public void setValueName(String valueName) {
		this.valueName = valueName;
	}
	public List<ChartData> getData() {
		return data;
	}
	public void setData(List<ChartData> data) {
		this.data = data;
	}
	public String getNameWeidu() {
		return nameWeidu;
	}
	public void setNameWeidu(String nameWeidu) {
		this.nameWeidu = nameWeidu;
	}
	public List<String> getDataX() {
		return dataX;
	}
	public void setDataX(List<String> dataX) {
		this.dataX = dataX;
	}
	public List<DataY> getDataY() {
		return dataY;
	}
	public void setDataY(List<DataY> dataY) {
		this.dataY = dataY;
	}
	public int getColspan() {
		return colspan;
	}
	public void setColspan(int colspan) {
		this.colspan = colspan;
	}
}
