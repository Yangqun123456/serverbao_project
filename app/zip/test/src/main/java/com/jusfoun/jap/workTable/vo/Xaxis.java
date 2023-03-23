/**
 * 
 */
package com.jusfoun.jap.workTable.vo;

import java.util.List;

/**
 * @author Rain
 */
public class Xaxis {
	private String type;
	private String name;
	private String splitLine;
	private List<String> data;
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getSplitLine() {
		return splitLine;
	}
	public void setSplitLine(String splitLine) {
		this.splitLine = splitLine;
	}
	public List<String> getData() {
		return data;
	}
	public void setData(List<String> data) {
		this.data = data;
	}
	
	
}
