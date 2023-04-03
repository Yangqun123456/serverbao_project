package com.jusfoun.jap.dataCenter.request;

import org.apache.commons.lang.builder.ReflectionToStringBuilder;

public class UserAuthenticationRequest extends BaseRequest{
	//用户名
	private String username;
	//密码
	private String password;

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
	
	@Override
	public String toString()
	{
		return ReflectionToStringBuilder.toString(this);
	}

}
