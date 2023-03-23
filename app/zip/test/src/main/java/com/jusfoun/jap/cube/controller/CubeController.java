package com.jusfoun.jap.cube.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSON;
import com.itmuch.core.page.PageVo;
import com.jusfoun.jap.admin.vo.PageInfoVo;
import com.jusfoun.jap.cube.domain.Cube;
import com.jusfoun.jap.cube.service.CubeService;
import com.jusfoun.jap.cube.vo.CubeVo;
import com.jusfoun.jap.util.kylin.GetKylinData;
import com.jusfoun.jap.workTable.domain.ColumnChinese;
import com.jusfoun.jap.workTable.domain.CubeDim;
import com.jusfoun.jap.workTable.domain.CubeFact;
import com.jusfoun.jap.workTable.service.WorkTableService;
import com.jusfoun.jap.workTable.vo.ColumnChineseList;

@RestController
@RequestMapping(value = "/cube")
public class CubeController {
	@Resource
	private CubeService cubeService;
	@Resource
	private WorkTableService workTableService;


	@RequestMapping("/getCubeByCondition")
	public PageInfoVo<Cube> cubeQueryByStatus(PageVo pageVo, CubeVo cubeVo) {
		
		return cubeService.queryByCubeName(pageVo,cubeVo);
	}
	
	
	/**
	 * 全部同步/粗暴 1.获取kylin返回的所有cube的list 2.根据kylin的cubeid删除本地三张表中多余的数据
	 * 3.cubeinfo表做更新及插入操作 （因为本地不对事实表和维度表操作，数据均来自kylin，所以将本地的两表数据删除再做插入操作）
	 * 4.根据kyin逐个获取的cube详情， 对另外两张表做更新及插入操作
	 *
	 * @param cubeIds
	 * @return
	 * @throws JSONException
	 */
	@RequestMapping("/synCube")
	public PageInfoVo<Cube> synCube(PageVo pageVo,CubeVo cubeVo) throws JSONException {
		return cubeService.synCube(pageVo,cubeVo);
	}
	
	//数据分析用
	@RequestMapping("/getCubeListByCondition")
	public List<Cube> cubeQueryByStatus(CubeVo cubeVo) {
		List<Cube> list = new ArrayList<Cube>();
		list = cubeService.queryByCubeName(cubeVo);
		return list;
	}
	
	@RequestMapping("/del-by-id")
//	@ResponseBody
//	@RequiresPermissions("sys:cube:del")
//	@SystemControllerLog(description = "数据模型删除",module=Constant.XTGL_MXGL,operType=Constant.DELETE)
	public void delCubeByCondition(Cube cube) {
		cubeService.delCubeByCondition(cube);
		cubeService.delDimByCube(cube);
		cubeService.delFactByCube(cube);
	}


	@RequestMapping("/viewCubeInfo")
//	@ResponseBody
//	@RequiresPermissions("sys:cube:view")
	public CubeVo viewCubeInfo(Cube cube) {
			return cubeService.viewCubeByCondition(cube);
	}
	@RequestMapping("/updateCubeInfo")
//	@ResponseBody
	//保存修改的cube
//	@RequiresPermissions("sys:cube:view")
//	@SystemControllerLog(description = "数据模型修改",module=Constant.XTGL_MXGL,operType=Constant.UPDATE)
	public void updateCubeInfo(@ModelAttribute("cubeVo") String cubeVo) {
		CubeVo cubevo = new CubeVo();
		cubevo = JSON.parseObject(cubeVo, CubeVo.class);
		cubeService.updateCubeInfo(cubevo);
	}
	
	/**
	 * 获取cube表名和列名
	 */
	@RequestMapping("/getChnInfo")
//	@ResponseBody
	public PageInfoVo<ColumnChinese> getColumnChinese(PageVo pageVo,ColumnChinese columnChinese) {
		if(pageVo.getPage()==1){//第一页需要更新
			cubeService.insertColumn();
		}
		return workTableService.getColumnChinese(pageVo,columnChinese);
	}
	@RequestMapping("/updateChn")
//	@ResponseBody
	public void updateChnInfo(ColumnChinese columnChinese) {
		 workTableService.updateColumnChinese(columnChinese);
	}
	@RequestMapping("/updateAllChn")
	public void updateAllChn(@ModelAttribute("chnList") String chnList) {
		ColumnChineseList columnChineseList= JSON.parseObject(chnList, ColumnChineseList.class);
		workTableService.updateAllChn(columnChineseList.getColumnChineseList());
	}
	
}
