package com.jusfoun.jap.admin.domain;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.itmuch.core.entity.BaseEntity;

@Table(name = "B_MENU")
public class Menu extends BaseEntity {
    /**
     * id
     */
    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY, generator = "select B_MENU_ID_SEQ.nextval from dual")
    private Long id;

    /**
     * 父级id
     */
    @Column(name = "PARENT_ID")
    private Long parentId;

    /**
     * 名称
     */
    @Column(name = "NAME")
    private String name;

    /**
     * 排序
     */
    @Column(name = "LIST_ORDER")
    private Integer listOrder;

    /**
     * 链接
     */
    @Column(name = "HREF")
    private String href;

    /**
     * 目标
     */
    @Column(name = "TARGET")
    private String target;

    /**
     * 图标
     */
    @Column(name = "ICON")
    private String icon;

    /**
     * 是否在菜单中显示 0:否 1:是
     */
    @Column(name = "SHOW_FLAG")
    private Short showFlag;

    /**
     * 权限标识
     */
    @Column(name = "PERMISSION")
    private String permission;

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
     * 获取父级id
     *
     * @return PARENT_ID - 父级id
     */
    public Long getParentId() {
        return this.parentId;
    }

    /**
     * 设置父级id
     *
     * @param parentId 父级id
     */
    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    /**
     * 获取名称
     *
     * @return NAME - 名称
     */
    public String getName() {
        return this.name;
    }

    /**
     * 设置名称
     *
     * @param name 名称
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * 获取排序
     *
     * @return LIST_ORDER - 排序
     */
    public Integer getListOrder() {
        return this.listOrder;
    }

    /**
     * 设置排序
     *
     * @param listOrder 排序
     */
    public void setListOrder(Integer listOrder) {
        this.listOrder = listOrder;
    }

    /**
     * 获取链接
     *
     * @return HREF - 链接
     */
    public String getHref() {
        return this.href;
    }

    /**
     * 设置链接
     *
     * @param href 链接
     */
    public void setHref(String href) {
        this.href = href;
    }

    /**
     * 获取目标
     *
     * @return TARGET - 目标
     */
    public String getTarget() {
        return this.target;
    }

    /**
     * 设置目标
     *
     * @param target 目标
     */
    public void setTarget(String target) {
        this.target = target;
    }

    /**
     * 获取图标
     *
     * @return ICON - 图标
     */
    public String getIcon() {
        return this.icon;
    }

    /**
     * 设置图标
     *
     * @param icon 图标
     */
    public void setIcon(String icon) {
        this.icon = icon;
    }

    /**
     * 获取是否在菜单中显示 0:否 1:是
     *
     * @return SHOW_FLAG - 是否在菜单中显示 0:否 1:是
     */
    public Short getShowFlag() {
        return this.showFlag;
    }

    /**
     * 设置是否在菜单中显示 0:否 1:是
     *
     * @param showFlag 是否在菜单中显示 0:否 1:是
     */
    public void setShowFlag(Short showFlag) {
        this.showFlag = showFlag;
    }

    /**
     * 获取权限标识
     *
     * @return PERMISSION - 权限标识
     */
    public String getPermission() {
        return this.permission;
    }

    /**
     * 设置权限标识
     *
     * @param permission 权限标识
     */
    public void setPermission(String permission) {
        this.permission = permission;
    }
}