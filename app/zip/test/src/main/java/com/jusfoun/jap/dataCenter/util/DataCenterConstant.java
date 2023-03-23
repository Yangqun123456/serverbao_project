package com.jusfoun.jap.dataCenter.util;

import java.util.HashMap;
import java.util.Map;

import com.jusfoun.jap.util.InitParam;


public interface DataCenterConstant {
	
	/**
	 * 统一认证平台
	 */
	String DATACENTER_URL = InitParam.getInitParamMap().get("datacenter.url");
	int SOCKETTIMEOUT = Integer.parseInt(InitParam.getInitParamMap().get("datacenter.socketTimeout"));
	String SYSTEMFLAG = InitParam.getInitParamMap().get("datacenter.systemFlag");
	String SSO = InitParam.getInitParamMap().get("datacenter.sso");
	/**
     * 功能地址 
     */
    interface Method
    {
    	//Get请求 权限列表
    	String M_GETUSERAUTHENTICATION = "/sysUser/userInfo/getUserAuthentication";
    	//Post请求 用户信息同步
    	String M_SYNCHRONIZATION = "/sysUser/userInfo/synchronization";
    	//Post请求 组织机构同步
    	String M_GETSYSGOVLISTBYDATE = "/sysGov/getSysGovListByDate";
    	
    }
    
	Map<String, String> SERVICE_METHOD = new HashMap<String, String>()
    {
		{
			put("userAuthenticationService", Method.M_GETUSERAUTHENTICATION);
			put("sysSimpleUserService", Method.M_SYNCHRONIZATION);
    		put("sysSimpleGovService", Method.M_GETSYSGOVLISTBYDATE);
    	}
    };
    
    
	/**
	 * 请求类型
	 * @author syk
	 *
	 */
	interface requestType
	{
		String GET = "GET";
		String POST = "POST";
	}
	
}
