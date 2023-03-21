package com.jusfoun.jap.kylin.service;

import org.springframework.stereotype.Service;

import com.jusfoun.jap.kylin.domain.job.JobListRequest;
import com.jusfoun.jap.kylin.util.KylinConstants.KylinMethod;
import com.jusfoun.jap.kylin.util.KylinHttpClientUtil;
import com.jusfoun.jap.util.Constant;

@Service
public class KylinJobService {
	
	/**
	 * http://58.240.82.126:7070/kylin/api/jobs?
	 * cubeName=CUBE_FACT_53912C625E974A4B8822C54DBCF27C09&limit=15&offset=0
	 * &projectName=analysis&status=4&timeFilter=1
	 * @return
	 */
	public String getJob(JobListRequest request) throws Exception
	{
		// http请求
		String url = Constant.KYLIN_ADDRESS + KylinMethod.GET_JOBS +"?";
		String responseContent = KylinHttpClientUtil.sendHttpGet(url);
		return responseContent;
	}

}
