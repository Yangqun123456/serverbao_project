/**
 * 
 */
package com.jusfoun.jap.workTable.vo;

import java.util.List;

/**
 * @author wcq
 *
 */
public class ChartOne {
	private String nameWeidu;
	private List<String> dataX;
	private List<DataY> dataY;
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
	
}
