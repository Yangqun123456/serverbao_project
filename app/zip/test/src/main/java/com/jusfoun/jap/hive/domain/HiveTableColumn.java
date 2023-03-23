package com.jusfoun.jap.hive.domain;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.*;

@Table(name = "T_HIVE_TABLE_COLUMN")
public class HiveTableColumn implements Serializable {
    /**
     * 主键
     */
    @Id
    @Column(name = "COLUMN_ID")
    private String columnId;

    /**
     * 表ID
     */
    @Column(name = "TABLE_ID")
    private String tableId;

    /**
     * 列名
     */
    @Column(name = "COLUMN_NAME")
    private String columnName;

    /**
     * 数据类型
     */
    @Column(name = "DATE_TYPE")
    private String dateType;

    /**
     * 长度
     */
    @Column(name = "LENGTH")
    private String length;

    /**
     * 描述
     */
    @Column(name = "COLUMN_DESC")
    private String columnDesc;
    
    @Column(name = "CREATE_TIME")
    private Date createTime;
    
    @Column(name = "UPDATE_TIME")
    private Date updateTime;

    private static final long serialVersionUID = 1L;

    /**
     * 获取主键
     *
     * @return COLUMN_ID - 主键
     */
    public String getColumnId() {
        return columnId;
    }

    /**
     * 设置主键
     *
     * @param columnId 主键
     */
    public void setColumnId(String columnId) {
        this.columnId = columnId;
    }

    /**
     * 获取表ID
     *
     * @return TABLE_ID - 表ID
     */
    public String getTableId() {
        return tableId;
    }

    /**
     * 设置表ID
     *
     * @param tableId 表ID
     */
    public void setTableId(String tableId) {
        this.tableId = tableId;
    }

    /**
     * 获取列名
     *
     * @return COLUMN_NAME - 列名
     */
    public String getColumnName() {
        return columnName;
    }

    /**
     * 设置列名
     *
     * @param columnName 列名
     */
    public void setColumnName(String columnName) {
        this.columnName = columnName;
    }

    /**
     * 获取数据类型
     *
     * @return DATE_TYPE - 数据类型
     */
    public String getDateType() {
        return dateType;
    }

    /**
     * 设置数据类型
     *
     * @param dateType 数据类型
     */
    public void setDateType(String dateType) {
        this.dateType = dateType;
    }

    /**
     * 获取长度
     *
     * @return LENGTH - 长度
     */
    public String getLength() {
        return length;
    }

    /**
     * 设置长度
     *
     * @param length 长度
     */
    public void setLength(String length) {
        this.length = length;
    }

    /**
     * 获取描述
     *
     * @return COLUMN_DESC - 描述
     */
    public String getColumnDesc() {
        return columnDesc;
    }

    /**
     * 设置描述
     *
     * @param columnDesc 描述
     */
    public void setColumnDesc(String columnDesc) {
        this.columnDesc = columnDesc;
    }
    
    @Override
    public boolean equals(Object obj) {
    	if(obj instanceof HiveTableColumn){
    		if(((HiveTableColumn)obj).getTableId().equals(this.getTableId())&&((HiveTableColumn)obj).getColumnName().equals(this.getColumnName())){
    			return true;
    		}else{
    			return false;
    		}
    	}else{
    		return false;
    	}
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
    
    
}