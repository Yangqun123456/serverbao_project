package com.jusfoun.core.shiro;

import java.util.List;
import java.util.Set;

import javax.annotation.Resource;

import org.apache.commons.collections.CollectionUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.cache.Cache;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.subject.SimplePrincipalCollection;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.util.ByteSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.itmuch.core.constants.SessionConstants;
import com.itmuch.core.util.SubjectUtil;
import com.jusfoun.jap.admin.domain.User;
import com.jusfoun.jap.admin.service.RoleService;
import com.jusfoun.jap.admin.service.UserService;

public class ShiroDbRealm extends AuthorizingRealm {

	@Resource
    private UserService userService;
    @Resource
    private RoleService roleService;

    private static final Logger LOGGER = LoggerFactory.getLogger(ShiroDbRealm.class);

    /**
     * 授权查询回调函数, 进行鉴权但缓存中无用户的授权信息时调用.
     */
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {

        SimpleAuthorizationInfo auth = new SimpleAuthorizationInfo();

        // 1. 通过用户id,查询用户具有的角色(查询sys_admin_role)
        Long id = SubjectUtil.getUser().getId();
        // 如果是超级管理员, 则拥有所有权限, 不受角色约束
        List<String> permissions = null;
        if (1L == id) {
            permissions = this.userService.selectAllPermissions();
        }
        // 并非超管
        else {
            List<Long> roleIds = this.userService.selectRoleIdListByUserId(id);
            if ((roleIds != null) && !roleIds.isEmpty()) {
                // 2. 通过角色id, 查询角色具有的权限
                permissions = this.userService.selectPermissionsByRoleIds(roleIds);

            }
        }
        if ((permissions != null) && !permissions.isEmpty()) {
            auth.addStringPermissions(permissions);
            return auth;
        }
        return null;
    }

    /**
     * 认证回调函数,登录时调用.
     */
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
        UsernamePasswordToken token = (UsernamePasswordToken) authenticationToken;
        String username = token.getUsername();
        LOGGER.info("用户:{}尝试登陆.", username);

        User user = this.userService.selectByUsername(username);

        if (user != null) {
            SimpleAuthenticationInfo info = new SimpleAuthenticationInfo(username, user.getPassword(), ByteSource.Util.bytes(user.getSalt()),
                    this.getName());

            com.itmuch.core.util.User currUser = new com.itmuch.core.util.User();
            currUser.setUsername(user.getUsername());
            currUser.setMobile(user.getMobile());
            currUser.setId(user.getId());

            this.setSession(SessionConstants.USER, currUser);

            return info;
        } else {
            return null;
        }

    }

    /**
     * 设置session
     * @param key key
     * @param value value
     */
    private void setSession(Object key, Object value) {
        Subject currentUser = SecurityUtils.getSubject();
        if (null != currentUser) {
            Session session = currentUser.getSession();
            if (null != session) {
                session.setAttribute(key, value);
            }
        }
    }

    /**
     * 参考文档: http://www.tuicool.com/articles/rEvqym
     * 参考文档: http://sishuok.com/forum/blogPost/list/7461.html
     * 参考文档: http://m.blog.csdn.net/blog/LHacker/19340757
     */
    public void clearCache() {
        Subject subject = SecurityUtils.getSubject();
        super.clearCachedAuthorizationInfo(subject.getPrincipals());
    }

    /**
     * 通过身份信息, 清空该用户的权限缓存
     * 参考: http://m.blog.csdn.net/blog/LHacker/19340757
     * @param principle 身份信息
     */
    public void clearAuthorizationCacheByPrinciple(String principle) {
        String cacheName = this.getAuthorizationCacheName();
        Cache<Object, Object> cache = this.getCacheManager().getCache(cacheName);

        Set<Object> keys = cache.keys();
        if (CollectionUtils.isNotEmpty(keys)) {
            for (Object key : keys) {
                SimplePrincipalCollection spc = (SimplePrincipalCollection) key;
                if (principle.equals(spc.toString())) {
                    cache.remove(key);
                    break;
                }
            }
        }

    }

}
