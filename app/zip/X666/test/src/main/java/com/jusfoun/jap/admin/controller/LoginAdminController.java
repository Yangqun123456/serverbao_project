package com.jusfoun.jap.admin.controller;

import java.util.Map;

import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.Subject;
import org.apache.tomcat.util.http.fileupload.servlet.ServletRequestContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.itmuch.core.util.SubjectUtil;
import com.jusfoun.jap.admin.domain.User;
import com.jusfoun.jap.util.StringUtil;

/**
 * 登陆controller, 用于未整合cas的情况
 * @author zhouli
 */
@Controller
public class LoginAdminController {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(LoginAdminController.class);
	
    @RequestMapping("/login")
    public String login(ServletRequest request) {
    	String username = request.getParameter("username");
    	String sysflag = request.getParameter("sysflag");
        Subject subject = SecurityUtils.getSubject();
        if (!subject.isAuthenticated()) {
        	if(StringUtil.isEmpty(sysflag))
        	{
        		return "redirect:/logon.html";
        	}
        	else
        	{
				try {
					UsernamePasswordToken token = new UsernamePasswordToken(username, "");
					SecurityUtils.getSubject().login(token);
				} catch (AuthenticationException e) {
					LOGGER.error(e.getMessage(), e);
					return "redirect:/logon.html";
				}
				return "redirect:/index.html";
			}
        } else {
            // 登陆成功/以及已经登陆过的用户,直接跳到后台首页
            return "redirect:/index.html";
        }

    }

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    @ResponseBody
    public boolean preLogin(User user, RedirectAttributes ra,ServletRequest request) throws Exception {
        // 查询用户的手机号和验证码对比，如果成功：
        boolean mobileCheck = true;
        if (mobileCheck) {
            UsernamePasswordToken token = new UsernamePasswordToken(user.getUsername(), user.getPassword());
            try {
                SecurityUtils.getSubject().login(token);
                ra.addFlashAttribute("username", user.getUsername());
            } catch (AuthenticationException e) {
            	LOGGER.error(e.getMessage(), e);
                ra.addFlashAttribute("loginError", "账号或密码有误.");
                ra.addFlashAttribute("username", user.getUsername());
                ra.addFlashAttribute("password", user.getPassword());
                return false;
            }
            return true;
        } else {
            // 告诉用户验证码不正确
            return true;
        }
    }
    
    /**
     * 登出
     *
     * @param result
     *            返回结果
     * @return 登出返回的信息
     * @throws Exception 
     */
    @RequestMapping(value = "/logout")
    @ResponseBody
    public String logout(ServletRequest request) throws Exception {
    	if (SecurityUtils.getSubject().getSession() != null) {
        SecurityUtils.getSubject().logout();
    	 }
        return "redirect:/logon.html";
    }
    
    /**
     * 获取用户名
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getUserName")
    @ResponseBody
    public String getUserName() throws Exception {
    	String name = SubjectUtil.getUser().getUsername();
        if(name != null){
        	return name;
        }else{
        	return null;
        }
    }

}
