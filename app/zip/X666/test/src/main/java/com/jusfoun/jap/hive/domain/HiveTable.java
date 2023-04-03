package com.jusfoun.jap.hive.domain;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.Table;

import com.jusfoun.jap.util.StringUtil;

@Table(name = "T_HIVE_TABLE")
public class HiveTable implements Serializable {
    @Id
    @Column(name = "TABLE_ID")
    private String tableId;

    @Column(name = "TABLE_NAME")
    private String tableName;

    @Column(name = "TABLE_DESC")
    private String tableDesc;
    
    @Column(name = "CREATE_TIME")
    private Date createTime;
    
    @Column(name = "UPDATE_TIME")
    private Date updateTime;

    private static final long serialVersionUID = 1L;

    /**
     * @return TABLE_ID
     */
    public String getTableId() {
        return tableId;
    }

    /**
     * @param tableId
     */
    public void setTableId(String tableId) {
        this.tableId = tableId;
    }

    /**
     * @return TABLE_NAME
     */
    public String getTableName() {
        return tableName;
    }

    /**
     * @param tableName
     */
    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    /**
     * @return TABLE_DESC
     */
    public String getTableDesc() {
        return tableDesc;
    }

    /**
     * @param tableDesc
     */
    public void setTableDesc(String tableDesc) {
        this.tableDesc = tableDesc;
    }
    
    @Override
    public boolean equals(Object obj) {
    	if(obj instanceof HiveTable){
    		if(StringUtil.isNotEmpty(this.tableId)){
    			if(this.tableId==((HiveTable)obj).getTableId()){
    				return true;
    			}else{
    				return false;
    			}
    		}else{
    			if(this.tableName.equals(((HiveTable)obj).getTableName())){
    				return true;
    			}else{
    				return false;
    			}
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