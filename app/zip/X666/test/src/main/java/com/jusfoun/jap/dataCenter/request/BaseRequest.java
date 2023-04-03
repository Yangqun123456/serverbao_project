package com.jusfoun.jap.dataCenter.request;

import org.apache.commons.lang.builder.ReflectionToStringBuilder;

public class BaseRequest {

	//时间起点
	private String startDate;
	//时间结束点
	private String endDate;
	//系统标识
	private String systemFlag;

	public String getStartDate() {
		return startDate;
	}

	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}

	public String getEndDate() {
		return endDate;
	}

	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}

	public String getSystemFlag() {
		return systemFlag;
	}

	public void setSystemFlag(String systemFlag) {
		this.systemFlag = systemFlag;
	}
	
	@Override
	public String toString()
	{
		return ReflectionToStringBuilder.toString(this);
	}
	
}
