package com.jusfoun.core.shiro;

import java.util.List;

import javax.annotation.Resource;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authc.credential.HashedCredentialsMatcher;
import com.jusfoun.jap.dataCenter.request.UserAuthenticationRequest;
import com.jusfoun.jap.dataCenter.response.UserAuthenticationResponse;
import com.jusfoun.jap.dataCenter.service.UserAuthenticationService;
import com.jusfoun.jap.dataCenter.util.ConvertBeanUtil;
import com.jusfoun.jap.dataCenter.util.DataCenterConstant;

public class MyHashedCredentialsMatcher extends HashedCredentialsMatcher {
	@Resource
	private UserAuthenticationService userAuthenticationService;
	public boolean doCredentialsMatch(AuthenticationToken token, AuthenticationInfo info) {
		
		UsernamePasswordToken t = (UsernamePasswordToken) token;
		String username = t.getUsername();
		String password = String.valueOf(t.getPassword());
		
		if ("1".equals(DataCenterConstant.SSO)) {
			UserAuthenticationRequest request = new UserAuthenticationRequest();
			request.setUsername(username);
			request.setPassword(password);
			request.setSystemFlag(DataCenterConstant.SYSTEMFLAG);
			List<UserAuthenticationResponse> response = (List<UserAuthenticationResponse>) userAuthenticationService
					.sendRequest("userAuthenticationService", ConvertBeanUtil.convertBean(request));
			if(null != response && response.size() > 0)
			{
				return true;
			}
			else
			{
				return false;
			}
		} else {
			Object tokenHashedCredentials = hashProvidedCredentials(token, info);
			Object accountCredentials = getCredentials(info);
			return equals(tokenHashedCredentials, accountCredentials);
		}
	}
}
