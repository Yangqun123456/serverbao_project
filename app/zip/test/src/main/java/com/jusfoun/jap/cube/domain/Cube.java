package com.jusfoun.jap.cube.domain;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.Table;

import com.itmuch.core.entity.BaseEntity;

@Table(name = "T_cube_info")
public class Cube extends BaseEntity implements Serializable {
	/**
	 * id
	 */
	@Id
	@Column(name = "CUBE_ID")
	// 主键生成策略
	private String cubeId;

	/**
	 *
	 */
	@Column(name = "cube_name")
	private String cubeName;

	/**
	 * 操作
	 */
	@Column(name = "cube_name_cn")
	private String cubeNameCn;

	/**
	 * 操作类型
	 */
	@Column(name = "cube_description")
	private String cubeDescription;

	/**
	 * 登陆平台
	 */
	@Column(name = "cube_date")
	private Date cubeDate;
	
	@Column(name = "cube_status")
	private String cubeStatus;
	
	@Column(name = "sync_rule")
	private Long syncRule;
	
	@Column(name = "sync_status")
	private Long syncStatus;
	
	@Column(name = "sync_time")
	private Date syncTime;
	
	private static final long serialVersionUID = 1L;

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

	public String getCubeNameCn() {
		return cubeNameCn;
	}

	public void setCubeNameCn(String cubeNameCn) {
		this.cubeNameCn = cubeNameCn;
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

	public Date getSyncTime() {
		return syncTime;
	}

	public void setSyncTime(Date syncTime) {
		this.syncTime = syncTime;
	}

}