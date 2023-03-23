/**
 * 
 */
package com.jusfoun.jap.theme.controller;

import javax.annotation.Resource;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.itmuch.core.web.converter.Result;
import com.jusfoun.jap.theme.domain.Theme;
import com.jusfoun.jap.theme.service.ThemeService;

/**
 * @author wcq
 *
 */
@RestController
@RequestMapping(value = "/theme")
public class ThemeController {
	@Resource
	private ThemeService themeService;
	
	@RequestMapping("/getThemeList")
	public Result getThemeList(Theme theme) {
		Result result = new Result();
		result = themeService.getThemeList(theme);
		return result;
	}
}
