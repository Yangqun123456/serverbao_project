package com.jusfoun.jap.story.mapper;

import java.util.List;
import java.util.Map;

import com.jusfoun.jap.story.domain.Story;
import com.jusfoun.jap.story.vo.StoryVo;

import tk.mybatis.mapper.common.Mapper;

public interface StoryMapper extends Mapper<Story> {

	StoryVo getStory(Story story);

	List<Story> getStorys(Story story);

	int createStory(StoryVo storyVo);

	void updateStory(StoryVo storyVo);

	void delStory(StoryVo storyVo);

	Integer copyStory(Story story);

	List<String> selectNames(Story story);

	String getCopyStoryId(Story story);

	Integer copyStoryDashboardRela(Map<String,String> map);

	void delStoryDashboardRela(StoryVo storyVo);

	void insertStoryDashboardRela(StoryVo storyVo);
	
}