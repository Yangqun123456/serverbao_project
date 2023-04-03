package com.jusfoun.jap.dashboard.domain;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Table;
@Table(name = "Dashboard")
public class Dashboard{
	/**
	 * id
	 */
	@Column(name = "DASHBOARD_ID")
	private String id;

	/**
	 *
	 */
	@Column(name = "DASHBOARD_NAME")
	private String name;

	/**
	 * 操作
	 */
	@Column(name = "DASHBOARD_DESCRIPTION")
	private String description;
	
	@Column(name = "user_id")
	private String userId;
	
	@Column(name = "create_Time")
	private Date createTime;
	
	@Column(name = "update_Time")
	private Date updateTime;
	
	@Column(name = "LAYOUT")
	private String layout;
	@Column(name = "background_Color")
	private String backgroundColor;
	
	@Column(name = "BORDER_SHOW")
	private String borderShow;
	
	@Column(name = "BORDER_COLOR")
	private String borderColor;
	
	@Column(name = "BORDER_WIDTH")
	private String borderWidth;

	@Column(name = "TITLE_FONT_SIZE")
	private String titleFontSize;
	
	@Column(name = "TITLE_FONT_WEIGHT")
	private String titleFontWeight;
	
	@Column(name = "TITLE_FONT_COLOR")
	private String titleFontColor;
	
	@Column(name = "TITLE_SHOW")
	private String titleShow;
	
	@Column(name = "THEME_ID")
	private String themeId;
	
	
	public String getThemeId() {
		return themeId;
	}


	public void setThemeId(String themeId) {
		this.themeId = themeId;
	}


	public String getBackgroundColor() {
		return backgroundColor;
	}


	public void setBackgroundColor(String backgroundColor) {
		this.backgroundColor = backgroundColor;
	}


	public String getBorderShow() {
		return borderShow;
	}



	public void setBorderShow(String borderShow) {
		this.borderShow = borderShow;
	}



	public String getBorderColor() {
		return borderColor;
	}



	public void setBorderColor(String borderColor) {
		this.borderColor = borderColor;
	}



	public String getBorderWidth() {
		return borderWidth;
	}



	public void setBorderWidth(String borderWidth) {
		this.borderWidth = borderWidth;
	}
	public String getLayout() {
		return layout;
	}

	public void setLayout(String layout) {
		this.layout = layout;
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
	
}
