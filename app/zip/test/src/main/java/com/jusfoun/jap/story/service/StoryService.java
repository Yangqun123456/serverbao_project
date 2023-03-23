package com.jusfoun.jap.story.service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.annotation.Resource;

import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jusfoun.jap.dashboard.domain.Dashboard;
import com.jusfoun.jap.dashboard.mapper.DashboardMapper;
import com.jusfoun.jap.dashboard.service.DashboardService;
import com.jusfoun.jap.dashboard.vo.DashboardVo;
import com.jusfoun.jap.story.domain.Story;
import com.jusfoun.jap.story.mapper.StoryMapper;
import com.jusfoun.jap.story.vo.StoryVo;
import com.jusfoun.jap.util.StringUtil;

@Service
public class StoryService{

	@Autowired
	private StoryMapper storyDao;
	
	@Autowired
	private DashboardMapper dashboardDao;
	
	@Resource
	private DashboardService dashboardService;

	public StoryVo getStory(Story story) throws SQLException, JSONException {
		StoryVo Storyvo =  storyDao.getStory(story);
		List<DashboardVo> dashboardVos = new ArrayList<DashboardVo>();
		List<Dashboard> list = dashboardDao.queryDashboardbyStory(story);
		for(Dashboard db : list){
			DashboardVo dbv = dashboardService.getDashboard(db);
			dbv.setBackgroundColor(db.getBackgroundColor());
			dbv.setBorderColor(db.getBorderColor());
			dbv.setBorderShow(db.getBorderShow());
			dashboardVos.add(dbv);
		}
		Storyvo.setDashboardVo(dashboardVos);
		return Storyvo;
	}

	public List<Story> getStorys(Story story) {
		List<Story> Storys = storyDao.getStorys(story);		
		return Storys;
	}

	public String createStory(StoryVo story) {
		String id = UUID.randomUUID().toString().replaceAll("-", "");
		story.setId(id);
		storyDao.createStory(story);
		if(StringUtil.isNotEmpty(story.getDashboardVo())){
			storyDao.insertStoryDashboardRela(story);//插入现在有而原来没有的关联关系
		}
		return id;
	}

	public void updateStory(StoryVo story) {
		storyDao.updateStory(story);//更新详情名称之类
		storyDao.delStoryDashboardRela(story);//删除原来有而最新的没有的关联表信息
		if(StringUtil.isNotEmpty(story.getDashboardVo())){
			storyDao.insertStoryDashboardRela(story);//插入现在有而原来没有的关联关系
		}
	}

	public void delStory(StoryVo story) {
		storyDao.delStory(story);
		storyDao.delStoryDashboardRela(story);
	}

	public void copyStory(Story story) {
		//1获取该仪表盘的副本名列表
		List<String> names = storyDao.selectNames(story);
		int copyOrder =1;
		story.setName(storyDao.getStory(story).getName());
		boolean getOrder = false;//false 表示 该序号的副本没有
		for(;;copyOrder++){
			getOrder = false;
			for(String name:names){
				if((story.getName()+"-副本"+copyOrder).equals(name)){//检测到该序列的副本
					getOrder = true;
					break;
				}
			}
			if(!getOrder){//如果没有检测到循环结束copyOrder为可以使用的值
				break;
			}
		}
		
		//2插入新的仪表盘记录并返回主键
		story.setName(story.getName()+"-副本"+copyOrder);//更换新的名字
		storyDao.copyStory(story);//插入
		String copyId = storyDao.getCopyStoryId(story);//返回主键
		//3.插入与数据分析的关联记录
		Map<String,String> mapId=new HashMap<String,String>();
		mapId.put("copyId", copyId);
		mapId.put("id", story.getId());
		storyDao.copyStoryDashboardRela(mapId);
		
	}
	
}
