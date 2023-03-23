package com.jusfoun.jap.admin.domain;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.itmuch.core.entity.BaseEntity;

@Table(name = "B_USER")
public class User extends BaseEntity {
    /**
     * id
     */
    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY, generator = "select B_USER_ID_SEQ.nextval from dual")
    private Long id;

    /**
     * 用户名
     */
    @Column(name = "USERNAME")
    private String username;

    /**
     * 密码
     */
    @Column(name = "PASSWORD")
    private String password;

    /**
     * 盐
     */
    @Column(name = "SALT")
    private String salt;

    /**
     * 姓名
     */
    @Column(name = "NAME")
    private String name;

    /**
     * 邮箱
     */
    @Column(name = "EMAIL")
    private String email;

    /**
     * 电话
     */
    @Column(name = "PHONE")
    private String phone;

    /**
     * 手机
     */
    @Column(name = "MOBILE")
    private String mobile;

    /**
     * 用户类型 0普通用户 1管理员
     */
    @Column(name = "USER_TYPE")
    private Short userType;

    /**
     * 用户头像
     */
    @Column(name = "PHOTO")
    private String photo;

    /**
     * 最后登陆IP
     */
    @Column(name = "LAST_IP")
    private String lastIp;

    /**
     * 最后登陆时间
     */
    @Column(name = "LAST_TIME")
    private Date lastTime;

    /**
     * 用户状态 0:正常 1:查封 2:待审核
     */
    @Column(name = "STATUS")
    private Short status;
    

    /**
     * 用户uuid-用户中心
     */
    @Column(name = "USER_ID")
    private String userId;

    /**
     * 性别
     */
    @Column(name = "USER_GENDER")
    private String userGender;

    /**
     * 安全级别
     */
    @Column(name = "SECURITY_LEVEL")
    private String securityLevel;

    /**
     * 所在机构
     */
    @Column(name = "GOV_NAME")
    private String govName;

    /**
     * 所在岗位
     */
    @Column(name = "JOB_NAME")
    private String jobName;
    
    /**
     * 创建时间
     */
    @Column(name = "CREATE_TIME")
    private Date createTime;
    
    /**
     * 更新时间
     */
    @Column(name = "UPDATE_TIME")
    private Date updateTime;

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
     * 获取用户名
     *
     * @return USERNAME - 用户名
     */
    public String getUsername() {
        return this.username;
    }

    /**
     * 设置用户名
     *
     * @param username 用户名
     */
    public void setUsername(String username) {
        this.username = username;
    }

    /**
     * 获取密码
     *
     * @return PASSWORD - 密码
     */
    public String getPassword() {
        return this.password;
    }

    /**
     * 设置密码
     *
     * @param password 密码
     */
    public void setPassword(String password) {
        this.password = password;
    }

    /**
     * 获取盐
     *
     * @return SALT - 盐
     */
    public String getSalt() {
        return this.salt;
    }

    /**
     * 设置盐
     *
     * @param salt 盐
     */
    public void setSalt(String salt) {
        this.salt = salt;
    }

    /**
     * 获取姓名
     *
     * @return NAME - 姓名
     */
    public String getName() {
        return this.name;
    }

    /**
     * 设置姓名
     *
     * @param name 姓名
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * 获取邮箱
     *
     * @return EMAIL - 邮箱
     */
    public String getEmail() {
        return this.email;
    }

    /**
     * 设置邮箱
     *
     * @param email 邮箱
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * 获取电话
     *
     * @return PHONE - 电话
     */
    public String getPhone() {
        return this.phone;
    }

    /**
     * 设置电话
     *
     * @param phone 电话
     */
    public void setPhone(String phone) {
        this.phone = phone;
    }

    /**
     * 获取手机
     *
     * @return MOBILE - 手机
     */
    public String getMobile() {
        return this.mobile;
    }

    /**
     * 设置手机
     *
     * @param mobile 手机
     */
    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    /**
     * 获取用户类型 0普通用户 1管理员
     *
     * @return USER_TYPE - 用户类型 0普通用户 1管理员
     */
    public Short getUserType() {
        return this.userType;
    }

    /**
     * 设置用户类型 0普通用户 1管理员
     *
     * @param userType 用户类型 0普通用户 1管理员
     */
    public void setUserType(Short userType) {
        this.userType = userType;
    }

    /**
     * 获取用户头像
     *
     * @return PHOTO - 用户头像
     */
    public String getPhoto() {
        return this.photo;
    }

    /**
     * 设置用户头像
     *
     * @param photo 用户头像
     */
    public void setPhoto(String photo) {
        this.photo = photo;
    }

    /**
     * 获取最后登陆IP
     *
     * @return LAST_IP - 最后登陆IP
     */
    public String getLastIp() {
        return this.lastIp;
    }

    /**
     * 设置最后登陆IP
     *
     * @param lastIp 最后登陆IP
     */
    public void setLastIp(String lastIp) {
        this.lastIp = lastIp;
    }

    /**
     * 获取最后登陆时间
     *
     * @return LAST_TIME - 最后登陆时间
     */
    public Date getLastTime() {
        return this.lastTime;
    }

    /**
     * 设置最后登陆时间
     *
     * @param lastTime 最后登陆时间
     */
    public void setLastTime(Date lastTime) {
        this.lastTime = lastTime;
    }

    /**
     * 获取用户状态 0:正常 1:查封 2:待审核
     *
     * @return STATUS - 用户状态 0:正常 1:查封 2:待审核
     */
    public Short getStatus() {
        return this.status;
    }

    /**
     * 设置用户状态 0:正常 1:查封 2:待审核
     *
     * @param status 用户状态 0:正常 1:查封 2:待审核
     */
    public void setStatus(Short status) {
        this.status = status;
    }

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getUserGender() {
		return userGender;
	}

	public void setUserGender(String userGender) {
		this.userGender = userGender;
	}

	public String getSecurityLevel() {
		return securityLevel;
	}

	public void setSecurityLevel(String securityLevel) {
		this.securityLevel = securityLevel;
	}

	public String getGovName() {
		return govName;
	}

	public void setGovName(String govName) {
		this.govName = govName;
	}

	public String getJobName() {
		return jobName;
	}

	public void setJobName(String jobName) {
		this.jobName = jobName;
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