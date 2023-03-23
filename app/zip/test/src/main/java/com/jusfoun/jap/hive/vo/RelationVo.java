package com.jusfoun.jap.hive.vo;

import java.io.Serializable;

import javax.persistence.Column;

public class RelationVo implements Serializable{
	
	  /**
     * 左表主键
     */
    private String leftTableId;

    /**
     * 关联类型
     */
    private String relationType;

    /**
     * 右表主键
     */
    private String rigthTableId;

    private String leftColumn;

    private String rightColumn;
    
    /**
     * 表示左表是否是主表： y 是 n 不是
     */
    private String primary;

	public String getLeftTableId() {
		return leftTableId;
	}

	public void setLeftTableId(String leftTableId) {
		this.leftTableId = leftTableId;
	}

	public String getRelationType() {
		return relationType;
	}

	public void setRelationType(String relationType) {
		this.relationType = relationType;
	}

	public String getRigthTableId() {
		return rigthTableId;
	}

	public void setRigthTableId(String rigthTableId) {
		this.rigthTableId = rigthTableId;
	}

	public String getLeftColumn() {
		return leftColumn;
	}

	public void setLeftColumn(String leftColumn) {
		this.leftColumn = leftColumn;
	}

	public String getRightColumn() {
		return rightColumn;
	}

	public void setRightColumn(String rightColumn) {
		this.rightColumn = rightColumn;
	}

	public String getPrimary() {
		return primary;
	}

	public void setPrimary(String primary) {
		this.primary = primary;
	}
    
    

}
