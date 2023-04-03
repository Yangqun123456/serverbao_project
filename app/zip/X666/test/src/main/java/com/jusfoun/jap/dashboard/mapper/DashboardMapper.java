package com.jusfoun.jap.dashboard.mapper;

import java.util.List;
import java.util.Map;

import com.jusfoun.jap.dashboard.domain.Dashboard;
import com.jusfoun.jap.dashboard.vo.DashboardVo;
import com.jusfoun.jap.story.domain.Story;

import tk.mybatis.mapper.common.Mapper;

public interface DashboardMapper extends Mapper<Dashboard> {

	DashboardVo getDashboard(Dashboard dashboard);

	List<Dashboard> getDashboards(Dashboard dashboard);

	int createDashboard(DashboardVo dashboard);

	void updateDashboard(DashboardVo dashboard);

	void delDashboard(DashboardVo dashboard);

	Integer copyDashboard(Dashboard dashboard);

	List<String> selectNames(Dashboard dashboard);


	String getCopyDashboardId(Dashboard dashboard);

	Integer copyDashboardWorkRela(Map<String,String> map);

	void delDashboardWorkRela(DashboardVo dashboard);

	void insertDashboardWorkRela(DashboardVo dashboard);
	
	List<Dashboard> queryDashboardbyStory(Story story);
	
	List<Story> queryDashboardUsedByStory(DashboardVo dashboard);
	
}