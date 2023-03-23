package com.jusfoun.jap.dataCenter.response;

import org.apache.commons.lang.builder.ReflectionToStringBuilder;

public class BaseResponse {

	//http响应状态
	private String httpResult;

	public String getHttpResult() {
		return httpResult;
	}

	public void setHttpResult(String httpResult) {
		this.httpResult = httpResult;
	}
	
	@Override
	public String toString()
	{
		return ReflectionToStringBuilder.toString(this);
	}
}
