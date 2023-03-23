package com.jusfoun.jap.admin.vo;

import java.util.Date;
import java.util.List;

import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotEmpty;

public class UserAdminRegVo {

    /**
     * id.
     */
    private Long id;

    /**
     * 登录名.
     */
    @NotEmpty(message = "登录名不能为空.")
    @Length(min = 5, max = 20, message = "登录名长度需在5-20之间.")
    private String username;

    /**
     * 密码.
     */
    @NotEmpty(message = "密码不能为空.")
    @Length(min = 5, max = 20, message = "密码长度需在5-20之间.")
    private String password;
    /**
     * 盐.
     */
    private String salt;

    @NotEmpty(message = "角色不能为空.")
    @NotNull
    private List<Long> roleIds;
    /**
     * 工号.
     */
    private String no;

    /**
     * 姓名.
     */
    private String name;

    /**
     * 邮箱.
     */
    private String email;

    /**
     * 电话.
     */
    private String phone;

    /**
     * 手机.
     */
    private String mobile;

    /**
     * 用户类型 0普通用户 1管理员.
     */
    private Byte userType;

    /**
     * 用户头像.
     */
    private String photo;

    /**
     * 最后登陆IP.
     */
    private String lastIp;

    /**
     * 最后登陆时间.
     */
    private Date lastTime;

    /**
     * 用户状态 0:正常 1:查封 2:待审核.
     */
    private Short status;

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return this.username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getSalt() {
        return this.salt;
    }

    public void setSalt(String salt) {
        this.salt = salt;
    }

    public List<Long> getRoleIds() {
        return this.roleIds;
    }

    public void setRoleIds(List<Long> roleIds) {
        this.roleIds = roleIds;
    }

    public String getNo() {
        return this.no;
    }

    public void setNo(String no) {
        this.no = no;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return this.phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getMobile() {
        return this.mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public Byte getUserType() {
        return this.userType;
    }

    public void setUserType(Byte userType) {
        this.userType = userType;
    }

    public String getPhoto() {
        return this.photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public String getLastIp() {
        return this.lastIp;
    }

    public void setLastIp(String lastIp) {
        this.lastIp = lastIp;
    }

    public Date getLastTime() {
        return this.lastTime;
    }

    public void setLastTime(Date lastTime) {
        this.lastTime = lastTime;
    }

    public Short getStatus() {
        return this.status;
    }

    public void setStatus(Short status) {
        this.status = status;
    }

}
