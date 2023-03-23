/**
 * 
 */
package com.jusfoun.jap.workTable.vo;

import java.util.List;

/**
 * @author Rain
 *
 */
public class ChartDataVo {
	private Title title;
	private Legend legend;
	private Xaxis xAxis;
	private Yaxis yAxis;
	private List<Serie> series;
	public Title getTitle() {
		return title;
	}
	public void setTitle(Title title) {
		this.title = title;
	}
	public Legend getLegend() {
		return legend;
	}
	public void setLegend(Legend legend) {
		this.legend = legend;
	}
	
	public Xaxis getxAxis() {
		return xAxis;
	}
	public void setxAxis(Xaxis xAxis) {
		this.xAxis = xAxis;
	}
	public Yaxis getyAxis() {
		return yAxis;
	}
	public void setyAxis(Yaxis yAxis) {
		this.yAxis = yAxis;
	}
	public List<Serie> getSeries() {
		return series;
	}
	public void setSeries(List<Serie> series) {
		this.series = series;
	}
	
	
	
	
}
