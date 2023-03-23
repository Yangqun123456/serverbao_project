/**
 * 
 */
package com.jusfoun.jap.theme.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.itmuch.core.web.converter.Result;
import com.jusfoun.jap.theme.domain.Theme;
import com.jusfoun.jap.theme.mapper.ThemeMapper;
import com.jusfoun.jap.theme.vo.ThemeVO;

/**
 * @author wcq
 *
 */
@Service
public class ThemeService {
	@Autowired 
	protected ThemeMapper dao;
	
	public Result getThemeList(Theme theme){
		Result result = new Result();
		List<ThemeVO> themeList= new ArrayList<ThemeVO>();
		themeList = dao.getThemeList(theme);
		if(themeList!=null&&!"".equals(themeList)){
			for(ThemeVO Themevo:themeList){
				if(Themevo.getThemeColor()!=null&&!"".equals(Themevo.getThemeColor())){
					Themevo.setThemeColorArr(Themevo.getThemeColor().replace("[", "").replace("\"", "").replace("]", "").split(","));
				}
			}
		}
		result.setSuccess(true);
		result.setData(themeList);
		return result;
	}
}
