package com.jusfoun.jap.admin.service;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.apache.shiro.crypto.hash.Md5Hash;
import org.springframework.stereotype.Service;

import com.github.pagehelper.PageHelper;
import com.google.common.collect.Lists;
import com.itmuch.core.constants.CodeConstant;
import com.itmuch.core.page.PageInfo;
import com.itmuch.core.page.PageVo;
import com.itmuch.core.service.BaseService;
import com.itmuch.core.util.DozerUtil;
import com.itmuch.core.util.ErrorMsgUtil;
import com.itmuch.core.util.SaltUtil;
import com.itmuch.core.util.SubjectUtil;
import com.itmuch.core.web.converter.Result;
import com.jusfoun.jap.admin.domain.User;
import com.jusfoun.jap.admin.mapper.UserMapper;
import com.jusfoun.jap.admin.vo.PageInfoVo;
import com.jusfoun.jap.admin.vo.UserAdminEditVo;
import com.jusfoun.jap.admin.vo.UserAdminRegVo;
import com.jusfoun.jap.admin.vo.UserVo;

@Service
public class UserService extends BaseService<UserMapper, User> {

    private static final int SALT_SIZE = 8;

    /**
     * 分页显示条件查询
     * @param vo
     * @param queuryVo
     * @return
     */
    public PageInfoVo<UserVo> conditionPageQuery(PageVo vo, UserVo queuryVo) {

        if ((queuryVo.getRoleIds() != null) && (queuryVo.getRoleIds().size() == 0)) {
            queuryVo.setRoleIds(null);
        }

        PageHelper.startPage(vo.getPage(), vo.getRows(), " u.username");
        List<User> list = this.dao.conditionPageQuery(queuryVo);
        PageInfo<User> info = new PageInfo<User>(list);
        List<UserVo> voList = Lists.newArrayList();

        if ((list != null) && !list.isEmpty()) {

            for (User admin : list) {
                UserVo adminVo = DozerUtil.map(admin, UserVo.class);
                adminVo.setPassword(null);

                // 查询用户的角色
                List<Long> roleIds = this.dao.selectRoleIdListByUserId(admin.getId());
                adminVo.setRoleIds(roleIds);
                voList.add(adminVo);
            }

            PageInfoVo<UserVo> infoVo = new PageInfoVo<UserVo>(info.getList(), voList);
            return infoVo;
        }
        return null;
    }

    public PageInfo<UserVo> listAllPaged(PageVo vo) {
        String order = vo.getOrder("CREATE_TIME");
        PageHelper.startPage(vo.getPage(), vo.getRows(), order);

        List<User> list = this.dao.selectAll();
        PageInfo<User> info = new PageInfo<User>(list);

        List<UserVo> voList = Lists.newArrayList();

        if ((list != null) && !list.isEmpty()) {

            for (User admin : list) {
                UserVo adminVo = DozerUtil.map(admin, UserVo.class);
                adminVo.setPassword(null);

                // 查询用户的角色
                List<Long> roleIds = this.dao.selectRoleIdListByUserId(admin.getId());
                // 之所以要加这个判断,是因为easyui 的combobox
                if ((roleIds != null) && roleIds.isEmpty()) {

                }
                adminVo.setRoleIds(roleIds);
                voList.add(adminVo);
            }
            PageInfo<UserVo> pageInfo = new PageInfo<UserVo>(null);
            pageInfo.setTotal(info.getTotal());
            pageInfo.setList(voList);

            return pageInfo;
        }
        return null;

    }

    public Integer insert(UserAdminRegVo vo) {
        User user = DozerUtil.map(vo, User.class);

        String saltString = SaltUtil.genSaltString(SALT_SIZE);
        user.setSalt(saltString);
        String password = user.getPassword();
        if (!StringUtils.isEmpty(password)) {
            user.setPassword(new Md5Hash(password, saltString).toString());
        }

        // 1. 插入到实体
        super.insertSelective(user);
        Long id = user.getId();

        // 2. 插入到中间表
        List<Long> roleIds = vo.getRoleIds();
        if ((roleIds != null) && !roleIds.isEmpty()) {
            this.dao.insertUserRole(id, roleIds);
        }
        return 0;
    }

    public Result updateUserById(UserAdminEditVo vo) {
        Long idSession = SubjectUtil.getUser().getId();
        if (idSession != 1L) {
            if (vo.getId() == 1) {
                return ErrorMsgUtil.error("失败", "该用户不允许被其他用户修改.", CodeConstant.DUPLICATE_DATA);
            }

            // 对于非id=1的用户,不允许修改自己的角色
            if (vo.getRoleIds() != null) {
                List<Long> roleIdsDB = this.dao.selectRoleIdListByUserId(vo.getId());
                if (!vo.getRoleIds().equals(roleIdsDB)) {
                    return ErrorMsgUtil.error("失败", "用户不允许修改自己的角色.", CodeConstant.PARAMTER_ERROR_CODE);
                }
            }
        }

        User userById = this.dao.selectByPrimaryKey(vo.getId());
        // 如果修改了用户名
        if (!userById.getUsername().equals(vo.getUsername())) {
            Long id = this.selectIdByUsername(vo.getUsername());
            if (id != null) {
                return ErrorMsgUtil.error("失败", "修改会员失败, 用户名重复.", CodeConstant.DUPLICATE_DATA);
            }
        }

        // 以下是允许修改的情况
        User user = DozerUtil.map(vo, User.class);
        String plainPassword = vo.getPassword();
        if (!StringUtils.isEmpty(plainPassword)) {
            user.setPassword(new Md5Hash(plainPassword, userById.getSalt()).toString());
        }
        // 1. 修改基础表
        super.updateByPrimaryKeySelective(user);

        // 2. 清除中间表
        this.dao.deleteUserRoleByUserId(vo.getId());

        // 3. 插入中间表
        List<Long> roleIds = vo.getRoleIds();
        if ((roleIds != null) && !roleIds.isEmpty()) {
            this.dao.insertUserRole(vo.getId(), roleIds);
        }
        return new Result("成功", "修改会员成功.");

    }

    /**
     * 通过登录名, 查询用户
     * @param loginName 登录名
     * @return 用户
     */
    public User selectByUsername(String loginName) {

        return this.dao.selectByUsername(loginName);
    }

    /**
     * 通过用户id, 查询用户拥有的角色id列表
     * @param id id
     * @return 角色id列表
     */
    public List<Long> selectRoleIdListByUserId(Long id) {
        return this.dao.selectRoleIdListByUserId(id);
    }

    /**
     * 查询所有的权限字符串, 用于超管授权
     * @return 所有权限字符串
     */
    public List<String> selectAllPermissions() {
        return this.dao.selectAllPermissions();
    }

    /**
     * 通过角色id列表, 查询权限字符串列表
     * @param roleIds 角色id列表
     * @return 权限字符串列表
     */
    public List<String> selectPermissionsByRoleIds(List<Long> roleIds) {

        return this.dao.selectPermissionsByRoleIds(roleIds);
    }

    @Override
    public Integer deleteById(Long id) {

        // 1. 删除用户 b_user表
        super.deleteById(id);
        // 2. 删除b_user_role表数据, 避免脏数据
        this.dao.deleteUserRoleByUserId(id);
        return 0;
    }

    /**
     * 通过登录名查询用户id
     * @param loginName 登录名
     * @return 个数
     */
    public Long selectIdByUsername(String loginName) {
        return this.dao.selectIdByUsername(loginName);
    }
    
    public List<User> queryAllUser()
    {
    	return this.dao.selectAll();
    }

	public void insertBatchUser(List<User> userList) {
		List<Long> roleIds = new ArrayList<Long>();
		roleIds.add(new Long(2));
		for(User user : userList)
		{
			this.dao.insertSelective(user);
	        this.dao.insertUserRole(user.getId(), roleIds);
		}
	}

	public void updateBatchUser(List<User> updateUserList) {
		for(User user : updateUserList)
		{
			this.dao.updateByPrimaryKeySelective(user);
		}
	}

	public void delBatchUser(List<Long> delUserList) {
		this.dao.delBatchUser(delUserList);
	}
}
