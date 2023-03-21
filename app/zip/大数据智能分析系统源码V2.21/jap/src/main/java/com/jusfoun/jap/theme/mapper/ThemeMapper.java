/**
 * 
 */
package com.jusfoun.jap.theme.mapper;

import java.util.List;

import com.jusfoun.jap.theme.domain.Theme;
import com.jusfoun.jap.theme.vo.ThemeVO;

/**
 * @author wcq
 *
 */
public interface ThemeMapper {
	public List<ThemeVO> getThemeList(Theme theme);
}
