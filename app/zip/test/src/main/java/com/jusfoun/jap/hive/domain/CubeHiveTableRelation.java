package com.jusfoun.jap.hive.domain;

import java.io.Serializable;
import javax.persistence.*;

@Table(name = "T_CUBE_HIVETABLE_RELATION")
public class CubeHiveTableRelation implements Serializable {
    /**
     * 主键
     */
    @Id
    @Column(name = "RELATION_ID")
    private String relationId;

    /**
     * cube主键
     */
    @Column(name = "CUBE_ID")
    private String cubeId;

    /**
     * hive表主键
     */
    @Column(name = "TABLE_ID")
    private String tableId;

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
     * 获取cube主键
     *
     * @return CUBE_ID - cube主键
     */
    public String getCubeId() {
        return cubeId;
    }

    /**
     * 设置cube主键
     *
     * @param cubeId cube主键
     */
    public void setCubeId(String cubeId) {
        this.cubeId = cubeId;
    }

    /**
     * 获取hive表主键
     *
     * @return TABLE_ID - hive表主键
     */
    public String getTableId() {
        return tableId;
    }

    /**
     * 设置hive表主键
     *
     * @param tableId hive表主键
     */
    public void setTableId(String tableId) {
        this.tableId = tableId;
    }
}