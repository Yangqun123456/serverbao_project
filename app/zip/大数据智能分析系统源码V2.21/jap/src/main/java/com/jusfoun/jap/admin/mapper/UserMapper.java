package com.jusfoun.jap.admin.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.jusfoun.jap.admin.domain.User;
import com.jusfoun.jap.admin.vo.UserVo;

import tk.mybatis.mapper.common.Mapper;

public interface UserMapper extends Mapper<User> {

    public List<Long> selectRoleIdListByUserId(Long id);

    public void insertUserRole(@Param("userId") Long userId, @Param("roleIds") List<Long> roleIds);

    public void deleteUserRoleByUserId(Long id);

    public User selectByUsername(String loginName);

    public List<String> selectAllPermissions();

    public List<String> selectPermissionsByRoleIds(List<Long> roleIds);

    public Long selectIdByUsername(String loginName);

    /**
     * 封装前台查询条件
     * @param queuryVo  前台查询条件
     * @return
     */
    public List<User> conditionPageQuery(UserVo queuryVo);

	public void insertBatchUser(List<User> userList);

	public void updateBatchUser(List<User> updateUserList);

	public void delBatchUser(List<Long> delUserList);
}