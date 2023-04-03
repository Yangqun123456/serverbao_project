package com.jusfoun.jap.cube.domain;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.Table;

import com.itmuch.core.entity.BaseEntity;

@Table(name = "T_tag_info")
public class Tag extends BaseEntity implements Serializable {
	/**
	 * id
	 */
	@Id
	@Column(name = "tag_ID")
	// 主键生成策略
	private String tagId;

	/**
	 *
	 */
	@Column(name = "tag_name")
	private String tagName;

	public String getTagId() {
		return tagId;
	}

	public void setTagId(String tagId) {
		this.tagId = tagId;
	}

	public String getTagName() {
		return tagName;
	}

	public void setTagName(String tagName) {
		this.tagName = tagName;
	}
	
}