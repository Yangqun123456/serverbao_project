/**
 * 
 */
package com.jusfoun.jap.theme.domain;

/**
 * @author wcq
 *
 */
public class Theme {
	private String themeId;
	private String themeName;
	private String dashboardTitle;
	private String dashboardBorder;
	private String dashboardBackground;
	private String storyTitle;
	private String storyBorder;
	private String storyBackground;
	private String themeColor;

	/**
	 * @return the themeColor
	 */
	public String getThemeColor() {
		return themeColor;
	}

	/**
	 * @param themeColor the themeColor to set
	 */
	public void setThemeColor(String themeColor) {
		this.themeColor = themeColor;
	}

	public String getThemeId() {
		return themeId;
	}

	public void setThemeId(String themeId) {
		this.themeId = themeId;
	}

	public String getThemeName() {
		return themeName;
	}

	public void setThemeName(String themeName) {
		this.themeName = themeName;
	}

	public String getDashboardTitle() {
		return dashboardTitle;
	}

	public void setDashboardTitle(String dashboardTitle) {
		this.dashboardTitle = dashboardTitle;
	}

	public String getDashboardBorder() {
		return dashboardBorder;
	}

	public void setDashboardBorder(String dashboardBorder) {
		this.dashboardBorder = dashboardBorder;
	}

	public String getDashboardBackground() {
		return dashboardBackground;
	}

	public void setDashboardBackground(String dashboardBackground) {
		this.dashboardBackground = dashboardBackground;
	}

	public String getStoryTitle() {
		return storyTitle;
	}

	public void setStoryTitle(String storyTitle) {
		this.storyTitle = storyTitle;
	}

	public String getStoryBorder() {
		return storyBorder;
	}

	public void setStoryBorder(String storyBorder) {
		this.storyBorder = storyBorder;
	}

	public String getStoryBackground() {
		return storyBackground;
	}

	public void setStoryBackground(String storyBackground) {
		this.storyBackground = storyBackground;
	}

}
