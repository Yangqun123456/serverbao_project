package com.jusfoun.jap.dataCenter.response;

import org.apache.commons.lang.builder.ReflectionToStringBuilder;

public class UserAuthenticationResponse extends BaseResponse {
	//权限ID
	private String moduleId;
	//权限名称
	private String moduleName;
	//权限连接/权限标识
	private String url;
	//父ID
	private String parentId;

	public String getModuleId() {
		return moduleId;
	}

	public void setModuleId(String moduleId) {
		this.moduleId = moduleId;
	}

	public String getModuleName() {
		return moduleName;
	}

	public void setModuleName(String moduleName) {
		this.moduleName = moduleName;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getParentId() {
		return parentId;
	}

	public void setParentId(String parentId) {
		this.parentId = parentId;
	}
	
	@Override
	public String toString()
	{
		return ReflectionToStringBuilder.toString(this);
	}
}
