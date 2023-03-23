package com.jusfoun.jap.dataCenter.service;

import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.jusfoun.jap.dataCenter.util.DataCenterConstant;
import com.jusfoun.jap.dataCenter.util.HttpClientUtil;

@Service
public abstract class HttpRequestService {

	/**
     * 日志
     */
    private Logger LOGGER = LoggerFactory.getLogger(getClass());
    
    /**
     * @brief 功能:发送http请求主方法
     * @param params 请求参数
     * @return Object
     * @throws Exception 
     */
    public Object sendRequest(String method, Map<String, Object> params)
    {
    	String httpUrl = null;
    	String result = null;
    	Object object = null;
    	try{
	    	httpUrl = DataCenterConstant.DATACENTER_URL + DataCenterConstant.SERVICE_METHOD.get(method);
	    	if(DataCenterConstant.requestType.POST.equals(getRequestType()))
	    	{
	    		result = HttpClientUtil.sendHttpPost(httpUrl, params);
	    	}
	    	else if(DataCenterConstant.requestType.GET.equals(getRequestType()))
	    	{
	    		result = HttpClientUtil.sendHttpGet(httpUrl, params);
	    	}
	    	object = parseResult(result);
    	}
    	catch(Exception e)
    	{
    		LOGGER.error("request:httpUrl="+httpUrl +";params="+params.toString());
    		LOGGER.error(e.getMessage(), e);
    	}
    	return object;
    }
    
    protected abstract Object parseResult(String result);

	/**
     * 请求类型
     * @return
     */
    protected String getRequestType()
    {
    	return DataCenterConstant.requestType.POST;
    }
}
