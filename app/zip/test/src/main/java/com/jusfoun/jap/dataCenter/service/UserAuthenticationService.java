package com.jusfoun.jap.dataCenter.service;

import java.lang.reflect.Type;
import java.util.List;

import org.springframework.stereotype.Service;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import com.jusfoun.jap.dataCenter.response.UserAuthenticationResponse;
import com.jusfoun.jap.dataCenter.util.DataCenterConstant;


@Service
public class UserAuthenticationService  extends HttpRequestService {

	@Override
	protected Object parseResult(String result) {
		Gson gson = new GsonBuilder().create();
		Type type = new TypeToken<List<UserAuthenticationResponse>>(){}.getType();
		return gson.fromJson(result, type);
	}

	/**
     * 请求类型
     * @return
     */
    protected String getRequestType()
    {
    	return DataCenterConstant.requestType.GET;
    }
}
