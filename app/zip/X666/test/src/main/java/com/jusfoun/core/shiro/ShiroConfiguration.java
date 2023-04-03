package com.jusfoun.core.shiro;

import java.util.LinkedHashMap;
import java.util.Map;

import javax.servlet.Filter;

import org.apache.shiro.cache.ehcache.EhCacheManager;
import org.apache.shiro.session.mgt.eis.EnterpriseCacheSessionDAO;
import org.apache.shiro.spring.LifecycleBeanPostProcessor;
import org.apache.shiro.spring.web.ShiroFilterFactoryBean;
import org.apache.shiro.web.filter.authc.LogoutFilter;
import org.apache.shiro.web.mgt.DefaultWebSecurityManager;
import org.apache.shiro.web.servlet.SimpleCookie;
import org.apache.shiro.web.session.mgt.DefaultWebSessionManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ShiroConfiguration {
    
	@Bean(name = "securityManager")
	public DefaultWebSecurityManager securityManager(){
		DefaultWebSecurityManager securityManager = new DefaultWebSecurityManager();
		securityManager.setCacheManager(shiroCacheManager());
		securityManager.setRealm(shiroDbRealm());
		securityManager.setSessionMode("native");
		securityManager.setSessionManager(shiroSessionManager());
		return securityManager;
	}
	
	@Bean(name = "shiroCacheManager")
	public EhCacheManager shiroCacheManager(){
		EhCacheManager ehCacheManager = new EhCacheManager();
		ehCacheManager.setCacheManagerConfigFile("classpath:ehcache.xml");
		return ehCacheManager;
	}
	
	@Bean(name = "shiroDbRealm")
    public ShiroDbRealm shiroDbRealm() {
		ShiroDbRealm realm = new ShiroDbRealm(); 
		realm.setCredentialsMatcher(credentialsMatcher());
        return realm;
    }
	
	@Bean(name = "credentialsMatcher")
	public MyHashedCredentialsMatcher credentialsMatcher() {
		MyHashedCredentialsMatcher credentialsMatcher = new MyHashedCredentialsMatcher();
		credentialsMatcher.setHashAlgorithmName("MD5");
		credentialsMatcher.setHashIterations(1);
		credentialsMatcher.setStoredCredentialsHexEncoded(true);
		return credentialsMatcher;
	}
	
	@Bean(name = "shiroSessionManager")
    public DefaultWebSessionManager shiroSessionManager() {
		DefaultWebSessionManager sessionManager = new DefaultWebSessionManager(); 
		sessionManager.setSessionDAO(sessionDAO());
		sessionManager.setSessionIdCookieEnabled(true);
		sessionManager.setSessionIdCookie(sessionIdCookie());
		sessionManager.setSessionValidationSchedulerEnabled(true);
		sessionManager.setDeleteInvalidSessions(true);
        return sessionManager;
    }
	
	@Bean(name = "sessionDAO")
    public EnterpriseCacheSessionDAO sessionDAO() {
		EnterpriseCacheSessionDAO sessionDao = new EnterpriseCacheSessionDAO(); 
		sessionDao.setActiveSessionsCacheName("shiro-activeSessionCache");
        return sessionDao;
    }
	
	@Bean(name = "sessionIdCookie")
    public SimpleCookie sessionIdCookie() {
		SimpleCookie simpleCookie = new SimpleCookie(); 
		simpleCookie.setName("sid");
		simpleCookie.setHttpOnly(true);
		simpleCookie.setMaxAge(-1);
        return simpleCookie;
    }
	
	@Bean(name = "shiroFilter")
	public ShiroFilterFactoryBean shiroFilterFactoryBean(){
		ShiroFilterFactoryBean shiroFilterFactoryBean = new ShiroFilterFactoryBean();
		shiroFilterFactoryBean.setSecurityManager(securityManager());
		shiroFilterFactoryBean.setLoginUrl("/login");
		shiroFilterFactoryBean.setSuccessUrl("/");
		shiroFilterFactoryBean.setUnauthorizedUrl("/403");
		
		Map<String, Filter> filters = new LinkedHashMap<String, Filter>();
		LogoutFilter logoutFilter = new LogoutFilter();
		logoutFilter.setRedirectUrl("/login");
		filters.put("logout", logoutFilter);
		shiroFilterFactoryBean.setFilters(filters);
		
		Map<String, String> filterChainDefinitionManager = new LinkedHashMap<String, String>();
		//放开请求kylin的公共方法
		filterChainDefinitionManager.put("/api/kylin/**", "anon");
		filterChainDefinitionManager.put("/stories/**", "anon");
		filterChainDefinitionManager.put("/login", "anon");
		filterChainDefinitionManager.put("/logout", "logout");
		filterChainDefinitionManager.put("/logon.html", "anon");
		filterChainDefinitionManager.put("/api.html", "anon");
		filterChainDefinitionManager.put("/css/**", "anon");
		filterChainDefinitionManager.put("/img/**", "anon");
		filterChainDefinitionManager.put("/js/**", "anon");
		filterChainDefinitionManager.put("/scripts/**", "anon");
		filterChainDefinitionManager.put("/jsonData/**", "anon");
		filterChainDefinitionManager.put("/**", "user");
		filterChainDefinitionManager.put("/*.json", "anon");
		shiroFilterFactoryBean.setFilterChainDefinitionMap(filterChainDefinitionManager);
		
		return shiroFilterFactoryBean;
	}

	@Bean(name = "lifecycleBeanPostProcessor")
    public LifecycleBeanPostProcessor lifecycleBeanPostProcessor() {
        return new LifecycleBeanPostProcessor();
    }
}

