package com.jusfoun.jap.admin.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.jusfoun.jap.admin.domain.Role;
import com.jusfoun.jap.admin.vo.RoleVo;

import tk.mybatis.mapper.common.Mapper;

public interface RoleMapper extends Mapper<Role> {

    public Integer insertRoleMenu(@Param("roleId") Long roleId, @Param("menuIds") List<Long> menuIds);

    public void deleteRoleMenuById(Long id);

    public Long selectCountAdminIdByRoleId(Long id);

    public List<Long> selectMenuIdsByRoleId(Long id);

    /**
     * 封装前台查询条件
     * @param queuryVo  前台查询条件
     * @return
     */
    public List<Role> conditionPageQuery(RoleVo queuryVo);
}