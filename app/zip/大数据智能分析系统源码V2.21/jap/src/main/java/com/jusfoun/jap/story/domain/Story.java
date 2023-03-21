/**
 * 
 */
package com.jusfoun.jap.story.domain;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Table;

/**
 * @author xc
 *	故事
 */
@Table(name = "story")
public class Story {

	/**
	 * 故事id
	 */
	@Column(name = "STORY_ID")
	private String id;
	
	/**
	 * 故事名称
	 */
	@Column(name = "STORY_NAME")
	private String name;
	
	/**
	 * 故事描述
	 */
	@Column(name = "STORY_DESCRIPTION")
	private String description;
	
	/**
	 * 用户id
	 */
	@Column(name = "USER_ID")
	private String userId;
	
	/**
	 * 创建时间
	 */
	@Column(name = "CREATE_TIME")
	private Date createTime;
	
	/**
	 * 更新时间
	 */
	@Column(name = "UPDATE_TIME")
	private Date updateTime;
	
	/**
	 * 故事样式
	 */
	@Column(name = "LAYOUT")
	private String layout;
	
	/**
	 * 故事背景色
	 */
	@Column(name = "BACKGROUND_COLOR")
	private String backgroundColor;
	
	/**
	 * 标题字体大小
	 */
	@Column(name = "TITLE_FONT_SIZE")
	private String titleFontSize;
	
	/**
	 * 标题字体粗细
	 */
	@Column(name = "TITLE_FONT_WEIGHT")
	private String titleFontWeight;
	
	/**
	 * 标题字体颜色
	 */
	@Column(name = "TITLE_FONT_COLOR")
	private String titleFontColor;
	
	/**
	 * 标题是否显示
	 */
	@Column(name = "TITLE_SHOW")
	private String titleShow;
	
	/**
	 * 主题id主键
	 */
	@Column(name = "THEME_ID")
	private String themeId;
	
	public String getThemeId() {
		return themeId;
	}

	public void setThemeId(String themeId) {
		this.themeId = themeId;
	}

	public String getTitleFontSize() {
		return titleFontSize;
	}

	public void setTitleFontSize(String titleFontSize) {
		this.titleFontSize = titleFontSize;
	}

	public String getTitleFontWeight() {
		return titleFontWeight;
	}

	public void setTitleFontWeight(String titleFontWeight) {
		this.titleFontWeight = titleFontWeight;
	}

	public String getTitleFontColor() {
		return titleFontColor;
	}

	public void setTitleFontColor(String titleFontColor) {
		this.titleFontColor = titleFontColor;
	}

	public String getTitleShow() {
		return titleShow;
	}

	public void setTitleShow(String titleShow) {
		this.titleShow = titleShow;
	}

	public String getBackgroundColor() {
		return backgroundColor;
	}

	public void setBackgroundColor(String backgroundColor) {
		this.backgroundColor = backgroundColor;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public Date getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}

	public String getLayout() {
		return layout;
	}

	public void setLayout(String layout) {
		this.layout = layout;
	}
	
	
}
