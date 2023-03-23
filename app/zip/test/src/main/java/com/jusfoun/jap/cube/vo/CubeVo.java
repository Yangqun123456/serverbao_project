package com.jusfoun.jap.cube.vo;

import java.util.Date;
import java.util.List;

import javax.persistence.Column;

import com.jusfoun.jap.cube.domain.Tag;

public class CubeVo {
	/**
	 * id
	 */
	// 主键生成策略
	private String cubeId;

	private String cubeName;

	private String cubeNameCn;

	private String cubeDescription;

	private Date cubeDate;
	
	private String cubeStatus;
	
	private Long syncRule;
	
	private Long syncStatus;
	
	private Date syncTime;
	
	private List<Tag> tagList;
	private List<Tag> otherTagList;
	
	private List<Tag> delTagList;
	private List<Tag> addTagList;
	private List<Tag> newTagList;
	
	public List<Tag> getDelTagList() {
		return delTagList;
	}

	public void setDelTagList(List<Tag> delTagList) {
		this.delTagList = delTagList;
	}

	public List<Tag> getAddTagList() {
		return addTagList;
	}

	public void setAddTagList(List<Tag> addTagList) {
		this.addTagList = addTagList;
	}

	public List<Tag> getNewTagList() {
		return newTagList;
	}

	public void setNewTagList(List<Tag> newTagList) {
		this.newTagList = newTagList;
	}

	public String getCubeStatus() {
		return cubeStatus;
	}

	public void setCubeStatus(String cubeStatus) {
		this.cubeStatus = cubeStatus;
	}

	public String getCubeId() {
		return cubeId;
	}

	public void setCubeId(String cubeId) {
		this.cubeId = cubeId;
	}

	public String getCubeName() {
		return cubeName;
	}

	public void setCubeName(String cubeName) {
		this.cubeName = cubeName;
	}

	public String getCubeDescription() {
		return cubeDescription;
	}

	public void setCubeDescription(String cubeDescription) {
		this.cubeDescription = cubeDescription;
	}

	public Date getCubeDate() {
		return cubeDate;
	}

	public void setCubeDate(Date cubeDate) {
		this.cubeDate = cubeDate;
	}

	public List<Tag> getTagList() {
		return tagList;
	}

	public void setTagList(List<Tag> tagList) {
		this.tagList = tagList;
	}

	public String getCubeNameCn() {
		return cubeNameCn;
	}

	public void setCubeNameCn(String cubeNameCn) {
		this.cubeNameCn = cubeNameCn;
	}

	public List<Tag> getOtherTagList() {
		return otherTagList;
	}

	public void setOtherTagList(List<Tag> otherTagList) {
		this.otherTagList = otherTagList;
	}

	public Long getSyncRule() {
		return syncRule;
	}

	public void setSyncRule(Long syncRule) {
		this.syncRule = syncRule;
	}

	public Long getSyncStatus() {
		return syncStatus;
	}

	public void setSyncStatus(Long syncStatus) {
		this.syncStatus = syncStatus;
	}
}