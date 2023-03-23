package com.jusfoun.jap.admin.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.github.pagehelper.PageHelper;
import com.itmuch.core.page.PageInfo;
import com.itmuch.core.page.PageVo;
import com.itmuch.core.service.BaseService;
import com.itmuch.core.util.DozerUtil;
import com.itmuch.core.web.converter.Result;
import com.jusfoun.jap.admin.domain.Role;
import com.jusfoun.jap.admin.mapper.RoleMapper;
import com.jusfoun.jap.admin.vo.PageInfoVo;
import com.jusfoun.jap.admin.vo.RoleVo;

@Service
public class RoleService extends BaseService<RoleMapper, Role> {

    public PageInfoVo<Role> listAllPaged(PageVo pageVo, RoleVo roleVo) {
        PageHelper.startPage(pageVo.getPage(), pageVo.getRows(), " u.id");
        List<Role> list = this.dao.conditionPageQuery(roleVo);
        PageInfo<Role> info = new PageInfo<Role>(list);
        PageInfoVo<Role> infoVo = new PageInfoVo<Role>(info.getList(), list);
        return infoVo;
    }

    public List<Role> listAll() {
        return this.dao.selectAll();
    }

    // TODO 数据权限暂时不做
    public Integer insert(RoleVo vo) {
        Role role = DozerUtil.map(vo, Role.class);

        super.insertSelective(role);
        Long roleId = role.getId();

        // 插入到sys_role_menu中间表
        List<Long> menuIds = vo.getMenuIds();
        if ((menuIds != null) && !menuIds.isEmpty()) {
            this.dao.insertRoleMenu(roleId, menuIds);
        }
        return 0;
    }

    /**
     * 修改角色信息，已更新为只修改角色描述信息，角色授权以独立单独功能
     * @param vo
     * @return
     */
    public Integer updateById(RoleVo vo) {
        // 1. 修改实体
        Role role = DozerUtil.map(vo, Role.class);
        super.updateByPrimaryKeySelective(role);

        //        // 2. 清除中间表
        //        this.dao.deleteRoleMenuById(vo.getId());
        //
        //        // 3. 插入中间表
        //        List<Long> menuIds = vo.getMenuIds();
        //        if ((menuIds != null) && !menuIds.isEmpty()) {
        //            this.dao.insertRoleMenu(vo.getId(), menuIds);
        //        }
        return 0;
    }

    public Result deleteRoleById(Long id) {
        // 1. 查询该角色下有多少用户
        Long count = this.dao.selectCountAdminIdByRoleId(id);
        // 2. 角色下存在用户, 不允许删除
        if (count != 0) {
            return new Result("非法操作", "该角色下有用户存在, 该角色不允许删除!");
        }
        super.deleteById(id);
        return new Result("成功", "角色删除成功.");
    }

    /**
     * 根据角色id获RoleVo
     * @param id 角色id
     * @return
     */
    public RoleVo queryVoById(Long id) {
        if (id == null) {
            return null;
        } else {
            Role role = this.dao.selectByPrimaryKey(id);
            RoleVo roleVo = DozerUtil.map(role, RoleVo.class);
            List<Long> menuIds = this.dao.selectMenuIdsByRoleId(id);
            roleVo.setMenuIds(menuIds);
            return roleVo;
        }
    }

    /**
     * 修改角色、菜单关联关系表
     * @param roleVo
     */
    public int updageRoleMenuAuth(RoleVo roleVo) {
        // 1. 清除中间表
        this.dao.deleteRoleMenuById(roleVo.getId());
        // 2. 插入中间表
        List<Long> menuIds = roleVo.getMenuIds();
        if ((menuIds != null) && !menuIds.isEmpty()) {
            this.dao.insertRoleMenu(roleVo.getId(), menuIds);
        }
        return 0;
    }
}
