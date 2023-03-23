package com.jusfoun.jap.story.controller;

import java.sql.SQLException;
import java.util.List;

import javax.annotation.Resource;

import org.json.JSONException;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSON;
import com.itmuch.core.util.SubjectUtil;
import com.jusfoun.jap.story.domain.Story;
import com.jusfoun.jap.story.vo.StoryVo;
import com.jusfoun.jap.story.service.StoryService;

@RestController
@RequestMapping(value = "/stories")
public class StoryController {

	@Resource
	StoryService storyService;
	
	//故事详情
	 @RequestMapping(value="/{id}",method=RequestMethod.GET)
	    public StoryVo getStory(Story story) throws SQLException, JSONException{
		 	story.setUserId(SubjectUtil.getUserId().toString());
		 	return storyService.getStory(story);
	   }
	 //故事列表
	 @RequestMapping(method=RequestMethod.GET)
	    public List<Story> getStorys( Story story){
		 story.setUserId(SubjectUtil.getUserId().toString());
		 	return storyService.getStorys(story);
	   }
	 //新建故事
	 @RequestMapping(method=RequestMethod.POST)
	    public String createStory(@ModelAttribute("story") String story){
		 	System.out.println("输入的参数为："+story);
		 	StoryVo storyVo = JSON.parseObject(story, StoryVo.class);// json转换为WorkCondition的对象
		 	storyVo.setUserId(SubjectUtil.getUserId().toString());
		 	return storyService.createStory(storyVo);
	   }
	 //更新故事
	 @RequestMapping(value="/{id}",method=RequestMethod.PUT)
	    public void updateStory(@PathVariable String id,@ModelAttribute("story") String story){
		 	StoryVo storyVo = JSON.parseObject(story, StoryVo.class);// json转换为WorkCondition的对象
		 	storyVo.setId(id);
		 	storyVo.setUserId(SubjectUtil.getUserId().toString());
		 	storyService.updateStory(storyVo);
	   }
	 //删除故事
	 @RequestMapping(value="/{id}",method=RequestMethod.DELETE)
	    public void delStory(StoryVo story){
		 	storyService.delStory(story);
	   }
	 
	 //复制故事
	 @RequestMapping(value="/{id}",method=RequestMethod.POST)
	    public void copyStory(Story story){
		 	story.setUserId(SubjectUtil.getUserId().toString());
		 	storyService.copyStory(story);
	 }
}
