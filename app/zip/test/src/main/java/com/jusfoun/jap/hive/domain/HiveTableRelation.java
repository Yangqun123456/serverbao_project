package com.jusfoun.jap.hive.domain;

import java.io.Serializable;
import javax.persistence.*;

@Table(name = "T_HIVE_TABLE_RELATION")
public class HiveTableRelation implements Serializable {
    /**
     * 主键
     */
    @Id
    @Column(name = "RELATION_ID")
    private String relationId;

    /**
     * 左表主键
     */
    @Column(name = "LEFT_TABLE_ID")
    private String leftTableId;

    /**
     * 关联类型
     */
    @Column(name = "RELATION_TYPE")
    private String relationType;

    /**
     * 右表主键
     */
    @Column(name = "RIGTH_TABLE_ID")
    private String rigthTableId;

    @Column(name = "LEFT_COLUMN")
    private String leftColumn;

    @Column(name = "RIGHT_COLUMN")
    private String rightColumn;

    @Column(name = "CUBE_ID")
    private String cubeId;

    @Column(name = "FACT_NAME")
    private String factName;

    private static final long serialVersionUID = 1L;

    /**
     * 获取主键
     *
     * @return RELATION_ID - 主键
     */
    public String getRelationId() {
        return relationId;
    }

    /**
     * 设置主键
     *
     * @param relationId 主键
     */
    public void setRelationId(String relationId) {
        this.relationId = relationId;
    }

    /**
     * 获取左表主键
     *
     * @return LEFT_TABLE_ID - 左表主键
     */
    public String getLeftTableId() {
        return leftTableId;
    }

    /**
     * 设置左表主键
     *
     * @param leftTableId 左表主键
     */
    public void setLeftTableId(String leftTableId) {
        this.leftTableId = leftTableId;
    }

    /**
     * 获取关联类型
     *
     * @return RELATION_TYPE - 关联类型
     */
    public String getRelationType() {
        return relationType;
    }

    /**
     * 设置关联类型
     *
     * @param relationType 关联类型
     */
    public void setRelationType(String relationType) {
        this.relationType = relationType;
    }

    /**
     * 获取右表主键
     *
     * @return RIGTH_TABLE_ID - 右表主键
     */
    public String getRigthTableId() {
        return rigthTableId;
    }

    /**
     * 设置右表主键
     *
     * @param rigthTableId 右表主键
     */
    public void setRigthTableId(String rigthTableId) {
        this.rigthTableId = rigthTableId;
    }

    /**
     * @return LEFT_COLUMN
     */
    public String getLeftColumn() {
        return leftColumn;
    }

    /**
     * @param leftColumn
     */
    public void setLeftColumn(String leftColumn) {
        this.leftColumn = leftColumn;
    }

    /**
     * @return RIGHT_COLUMN
     */
    public String getRightColumn() {
        return rightColumn;
    }

    /**
     * @param rightColumn
     */
    public void setRightColumn(String rightColumn) {
        this.rightColumn = rightColumn;
    }

    /**
     * @return CUBE_ID
     */
    public String getCubeId() {
        return cubeId;
    }

    /**
     * @param cubeId
     */
    public void setCubeId(String cubeId) {
        this.cubeId = cubeId;
    }

    /**
     * @return FACT_NAME
     */
    public String getFactName() {
        return factName;
    }

    /**
     * @param factName
     */
    public void setFactName(String factName) {
        this.factName = factName;
    }
}