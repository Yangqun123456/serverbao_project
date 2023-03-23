package com.jusfoun.jap.admin.domain;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.itmuch.core.entity.BaseEntity;

@Table(name = "B_ROLE")
public class Role extends BaseEntity {
    /**
     * id
     */
    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY, generator = "select B_ROLE_ID_SEQ.nextval from dual")
    private Long id;

    /**
     * 归属机构
     */
    @Column(name = "OFFICE_ID")
    private Long officeId;

    /**
     * 角色名称
     */
    @Column(name = "NAME")
    private String name;

    /**
     * 英文名称
     */
    @Column(name = "ENNAME")
    private String enname;

    /**
     * 角色类型
     */
    @Column(name = "ROLE_TYPE")
    private Short roleType;

    /**
     * 是否系统数据 0否 1是
     */
    @Column(name = "SYS_FLAG")
    private Short sysFlag;

    /**
     * 状态 0:可用 1:禁用
     */
    @Column(name = "STATUS")
    private Short status;

    private static final long serialVersionUID = 1L;

    /**
     * 获取id
     *
     * @return ID - id
     */
    @Override
    public Long getId() {
        return this.id;
    }

    /**
     * 设置id
     *
     * @param id id
     */
    @Override
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * 获取归属机构
     *
     * @return OFFICE_ID - 归属机构
     */
    public Long getOfficeId() {
        return this.officeId;
    }

    /**
     * 设置归属机构
     *
     * @param officeId 归属机构
     */
    public void setOfficeId(Long officeId) {
        this.officeId = officeId;
    }

    /**
     * 获取角色名称
     *
     * @return NAME - 角色名称
     */
    public String getName() {
        return this.name;
    }

    /**
     * 设置角色名称
     *
     * @param name 角色名称
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * 获取英文名称
     *
     * @return ENNAME - 英文名称
     */
    public String getEnname() {
        return this.enname;
    }

    /**
     * 设置英文名称
     *
     * @param enname 英文名称
     */
    public void setEnname(String enname) {
        this.enname = enname;
    }

    /**
     * 获取角色类型
     *
     * @return ROLE_TYPE - 角色类型
     */
    public Short getRoleType() {
        return this.roleType;
    }

    /**
     * 设置角色类型
     *
     * @param roleType 角色类型
     */
    public void setRoleType(Short roleType) {
        this.roleType = roleType;
    }

    /**
     * 获取是否系统数据 0否 1是
     *
     * @return SYS_FLAG - 是否系统数据 0否 1是
     */
    public Short getSysFlag() {
        return this.sysFlag;
    }

    /**
     * 设置是否系统数据 0否 1是
     *
     * @param sysFlag 是否系统数据 0否 1是
     */
    public void setSysFlag(Short sysFlag) {
        this.sysFlag = sysFlag;
    }

    /**
     * 获取状态 0:可用 1:禁用
     *
     * @return STATUS - 状态 0:可用 1:禁用
     */
    public Short getStatus() {
        return this.status;
    }

    /**
     * 设置状态 0:可用 1:禁用
     *
     * @param status 状态 0:可用 1:禁用
     */
    public void setStatus(Short status) {
        this.status = status;
    }
}