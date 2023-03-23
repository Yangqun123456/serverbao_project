package com.jusfoun.jap.workTable.controller;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;
import javax.annotation.Resource;

import org.json.JSONException;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.itmuch.core.util.SubjectUtil;
import com.itmuch.core.web.converter.Result;
import com.jusfoun.jap.common.Results;
import com.jusfoun.jap.cube.vo.CubeVo;
import com.jusfoun.jap.dashboard.service.DashboardService;
import com.jusfoun.jap.dashboard.vo.DashboardVo;
import com.jusfoun.jap.workTable.domain.ColumnChinese;
import com.jusfoun.jap.workTable.service.WorkTableService;
import com.jusfoun.jap.workTable.vo.ConnectionVO;
import com.jusfoun.jap.workTable.vo.CubeDimVo;
import com.jusfoun.jap.workTable.vo.Measures;
import com.jusfoun.jap.workTable.vo.WorkTableCondition;
import com.jusfoun.jap.workTable.vo.WorkTableVo;

@RestController
@RequestMapping(value = "/workTable")
public class WorkTableController {

	@Resource
	private WorkTableService workTableService;
	@Resource
	private DashboardService dashboardService;
	
	@RequestMapping("")
	//@RequiresPermissions("sys:cube:view")
	public String index() {
		return "workTable/html/zztzfx/html/zztzfx_work";
	}

	/**
	 * 加载单个cube详细信息，输入参数为cubeId
	 *
	 * @param pageVo
	 * @param cubeVo
	 * @return
	 */
	@RequestMapping("/getFactTableRule")
	@ResponseBody
	//@RequiresPermissions("sys:cube:view")
	public Result getFactTableRule(Measures measures) {
		Result result = new Result();
		result = workTableService.getFactTableRule(measures);
		return result;
	}

	@RequestMapping("/getCubeDetailById")
	@ResponseBody
	//@RequiresPermissions("sys:cube:view")
	public Result cubeQueryByCubeId(CubeVo cubeVo) {
		Result result = new Result();
		result = workTableService.queryByCubeId(cubeVo);
		return result;
	}
	/**
	 * 根据选择的维度，查询维度的取值范围，入参为维度名称
	 *
	 * @param cubeDimVo
	 * @return
	 */
	@RequestMapping("/queryByCondition")
	@ResponseBody
	//@RequiresPermissions("sys:cube:view")
	public Result queryByCondition(CubeDimVo cubeDimVo) {
		return workTableService.queryByCondition(cubeDimVo);
	}


	

	/**
	 * 根据cubeId和tableName查询出关联条件
	 *
	 * @param cubeDimVo
	 * @return
	 */
	public List<CubeDimVo> getConnectByCubeIdAndTableName(ConnectionVO connectionVO) {
		List<CubeDimVo> listDim = workTableService.getConnectByCubeIdAndTableName(connectionVO);
		return listDim;
	}

	/**
	 * 根据cubeId查询cube描述
	 *
	 * @param cubeDimVo
	 * @return
	 */
	public String queryCubeDescriptionByCubeId(CubeVo cubeVo) {
		String cubeDescription = workTableService.queryCubeDescriptionByCubeId(cubeVo);
		return cubeDescription;
	}

	/**
	 * 根据cubeId查询度量列中文名称
	 *
	 * @param cubeVo
	 * @return
	 */
	public List<ColumnChinese> queryFactByCubeId(CubeVo cubeVo) {
		List<ColumnChinese> listFact = workTableService.queryFactByCubeId(cubeVo);
		return listFact;
	}

	/**
	 * 1.获取json转换为WorkCondition的对象 2.存储work_table表 3.存储work_table_detail表
	 * @return 
	 *
	 *
	 * @return
	 */
	@RequestMapping("/saveWorkTable")
	@ResponseBody
	//@RequiresPermissions("sys:cube:view")
	public Result saveWorkTable(@ModelAttribute("workConditionString") String workConditionString) {
		return workTableService.saveWorkTable(workConditionString);
	}

	@RequestMapping("/queryWorkTable")
	@ResponseBody
	//@RequiresPermissions("sys:cube:view")
	public List<WorkTableVo> queryWorkTable(WorkTableVo workTable) {
		workTable.setUserId(SubjectUtil.getUserId().toString());
		List<WorkTableVo> tableList = workTableService.queryWorkTable(workTable);
		return tableList;
	}

	@RequestMapping("/showWorkTable")
	@ResponseBody
	//@RequiresPermissions("sys:cube:view")
	public WorkTableCondition showWorkTable(WorkTableCondition workTable) {
		WorkTableCondition workTable1 = workTableService.showWorkTable(workTable);
		return workTable1;
	}
	
	
	
	@RequestMapping(value = "/getKylinByCondition",	consumes=MediaType.APPLICATION_JSON_UTF8_VALUE)
	@ResponseBody
	//@RequiresPermissions("sys:cube:view")
	public Results getKylinByCondition(@RequestBody WorkTableCondition workTableCondition) throws SQLException, JSONException{
        return workTableService.getKylinByCondition(workTableCondition);
	}
	
	//复制数据分析
	@RequestMapping(value="/{workTableId}",method=RequestMethod.POST)
	 public void copyWorktable(WorkTableVo WorkTableVo){
		workTableService.copyWorktable(WorkTableVo);
	 }
	
	//删除数据分析
	@RequestMapping(value="/{workTableId}",method=RequestMethod.DELETE)
	 public Results delWorktable(WorkTableVo WorkTableVo){
		Results result = new Results();
		String listPie = workTableService.delWorktable(WorkTableVo);//返回挂载该工作表的仪表盘
		result.setData(listPie);
		return result;
	 }
	
	@RequestMapping(value="/getKylinListByCondition",consumes=MediaType.APPLICATION_JSON_UTF8_VALUE,method=RequestMethod.POST)
	@ResponseBody
	//@RequiresPermissions("sys:cube:view")
	public DashboardVo getListKylinByCondition(@RequestBody DashboardVo DashboardVo) throws SQLException, JSONException{
        return dashboardService.getListKylinByCondition(DashboardVo.getWorkTables());
	}
	
	
	@RequestMapping(value = "/exportExcel",	consumes=MediaType.APPLICATION_JSON_UTF8_VALUE)
	@ResponseBody
	//@RequiresPermissions("sys:cube:view")
	public Result exportExcel(@RequestBody WorkTableCondition workTableCondition) throws SQLException, JSONException, IOException{
        return workTableService.exportExcel(workTableCondition);
	}
	
}
