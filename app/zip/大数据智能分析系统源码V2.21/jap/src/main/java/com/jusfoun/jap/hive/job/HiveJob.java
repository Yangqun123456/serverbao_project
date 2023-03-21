package com.jusfoun.jap.hive.job;

import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.jusfoun.jap.cube.domain.Cube;
import com.jusfoun.jap.cube.service.CubeService;
import com.jusfoun.jap.cube.util.CubeConstants.SyncStatus;
import com.jusfoun.jap.cube.vo.CubeVo;
import com.jusfoun.jap.hive.service.HiveDataService;
import com.jusfoun.jap.kylin.service.KylinCubeService;
import com.jusfoun.jap.kylin.service.KylinJobService;
import com.jusfoun.jap.util.Constant;

@Component
public class HiveJob {
	
	private transient Logger LOG = LoggerFactory.getLogger(getClass());
	@Resource
	private CubeService cubeService;
	
	@Resource
	private KylinCubeService kylinCubeService;
	
	@Resource
	private HiveDataService hiveDataService;
	
	@Resource
	private KylinJobService kylinJobService;
	
    @Scheduled(cron = "${job.everyFiveMin.cron}")
    public void synchronizeData() {
    	if("0".equals(Constant.JOB_ENABLE))
    	{
    		return;
    	}
    	LOG.info("HiveJob.synchronizeData start...");
    	Date now = new Date();
    	CubeVo cubeVo = new CubeVo();
    	List<Cube> cubeList = cubeService.queryByCubeName(cubeVo);
    	if(null != cubeList && cubeList.size() > 0)
    	{
    		for(Cube cube : cubeList)
    		{
    			if(null != cube.getSyncRule())
    			{
    				if(cube.getSyncStatus() == SyncStatus.REDAY_EXEC)
        			{
        				syncCube(cube);
        			}
        			else if(cube.getSyncStatus() == SyncStatus.EXEC_COMPLATE)
        			{
        				long interval = (now.getTime()- cube.getSyncTime().getTime()) / 1000;
    	    			if(interval > cube.getSyncRule())
    	    			{
    	    				syncCube(cube);
    	    			}
        			}
    			}
    		}
    	}
    	LOG.info("HiveJob.synchronizeData end...");
    }

	private void syncCube(Cube cube) 
	{
		LOG.info("HiveJob.syncCube start... cubeId=" + cube.getCubeId());
		try {
			hiveDataService.synchronizeData(cube.getCubeId());
			CubeVo cubeInfo = new CubeVo();
			cubeInfo.setCubeId(cube.getCubeId());
			cubeInfo.setSyncStatus(new Long(SyncStatus.SYNC_DATA));
			cubeService.updateCubeInfo(cubeInfo);
			kylinCubeService.buildCube(cube.getCubeName());
			
			cubeInfo.setSyncStatus(new Long(SyncStatus.BULID_CUBE));
			cubeService.updateCubeInfo(cubeInfo);
			
		} catch (Exception e) {
			LOG.error(e.getMessage(), e);
		}
    	LOG.info("HiveJob.syncCube end... cubeId=" + cube.getCubeId());
	}
	
	 @Scheduled(cron = "${job.everyTenMin.cron}")
	 public void synchronizeCubeBuildStatus()
	 {
		 if("0".equals(Constant.JOB_ENABLE))
	     {
			 return;
	     }
	     CubeVo cubeVo = new CubeVo();
	     List<Cube> cubeList = cubeService.queryByCubeName(cubeVo);
	     if(null != cubeList && cubeList.size() > 0)
	     {
	    	 for(Cube cube : cubeList)
	    	 {
	    	 }
	     }
	    		
	 }

}
