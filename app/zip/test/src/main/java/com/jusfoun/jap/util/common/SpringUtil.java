package com.jusfoun.jap.util.common;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;


public class SpringUtil implements ApplicationContextAware{
	
	private static ApplicationContext staticapplicationcontext;
	
	public void setApplicationContext(ApplicationContext applicationContext)
	  throws BeansException
	{
		SpringUtil.staticapplicationcontext = applicationContext;
	}

	public static Object getBean(String name) {
	  if (staticapplicationcontext != null) {
	    return staticapplicationcontext.getBean(name);
	  }
	  return null;
	}

	public static <T> T getBean(Class<T> clazz) {
	  if (staticapplicationcontext != null) {
	    return staticapplicationcontext.getBean(clazz);
	  }
	  return null;
	}

	public static ApplicationContext getApplicationContext() {
	  return staticapplicationcontext;
	}
	
}

