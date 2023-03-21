package com.jusfoun.jap.hive.service;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.jusfoun.jap.hive.domain.KylinTable;
import com.jusfoun.jap.hive.util.HiveUtil;
import com.jusfoun.jap.util.Constant;

@Service
public class HiveDataService {
	
	@Resource
	private HiveService hiveService;
	
	public void synchronizeData(String cubeId) throws Exception{
		List<KylinTable> kylinTableList = hiveService.findKylinTableByCubeId(cubeId);
		if(null != kylinTableList && kylinTableList.size() > 0)
		{
			for(KylinTable kylinTable : kylinTableList)
			{
				HiveUtil.executSql(Constant.HIVE_URL+Constant.HIVE_ANALYSIS_DATABASE,kylinTable.getSyncSql());
			}
		}
	}
}
