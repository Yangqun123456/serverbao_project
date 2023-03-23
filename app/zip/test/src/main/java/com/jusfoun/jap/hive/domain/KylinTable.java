package com.jusfoun.jap.hive.domain;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.*;

@Table(name = "T_KYLIN_TABLE")
public class KylinTable implements Serializable {
    /**
     * 主键
     */
    @Id
    @Column(name = "TABLE_ID")
    private String tableId;

    /**
     * cube主键
     */
    @Column(name = "CUBE_ID")
    private String cubeId;

    /**
     * 1：事实表2：维度表
     */
    @Column(name = "TABLE_TYPE")
    private String tableType;

    /**
     * 表名
     */
    @Column(name = "TABLE_NAME")
    private String tableName;

    /**
     * 描述
     */
    @Column(name = "TABLE_DESC")
    private String tableDesc;
    
    
    @Column(name = "SYNC_POLICY")
    private String syncPolicy;
    
    @Column(name = "SYNC_SQL")
    private String syncSql;

    private static final long serialVersionUID = 1L;

    /**
     * 获取主键
     *
     * @return TABLE_ID - 主键
     */
    public String getTableId() {
        return tableId;
    }

    /**
     * 设置主键
     *
     * @param tableId 主键
     */
    public void setTableId(String tableId) {
        this.tableId = tableId;
    }

    /**
     * 获取cube主键
     *
     * @return CUEB_ID - cube主键
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
     * 获取1：事实表2：维度表
     *
     * @return TABLE_TYPE - 1：事实表2：维度表
     */
    public String getTableType() {
        return tableType;
    }

    /**
     * 设置1：事实表2：维度表
     *
     * @param tableType 1：事实表2：维度表
     */
    public void setTableType(String tableType) {
        this.tableType = tableType;
    }

    /**
     * 获取表名
     *
     * @return TABLE_NAME - 表名
     */
    public String getTableName() {
        return tableName;
    }

    /**
     * 设置表名
     *
     * @param tableName 表名
     */
    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    /**
     * 获取描述
     *
     * @return TABLE_DESC - 描述
     */
    public String getTableDesc() {
        return tableDesc;
    }

    /**
     * 设置描述
     *
     * @param tableDesc 描述
     */
    public void setTableDesc(String tableDesc) {
        this.tableDesc = tableDesc;
    }


	public String getSyncPolicy() {
		return syncPolicy;
	}

	public void setSyncPolicy(String syncPolicy) {
		this.syncPolicy = syncPolicy;
	}

	public String getSyncSql() {
		return syncSql;
	}

	public void setSyncSql(String syncSql) {
		this.syncSql = syncSql;
	}
    
    
}