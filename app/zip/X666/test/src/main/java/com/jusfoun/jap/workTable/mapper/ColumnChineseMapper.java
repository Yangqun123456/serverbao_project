package com.jusfoun.jap.workTable.mapper;

import java.util.List;
import java.util.Map;

import com.jusfoun.jap.cube.vo.CubeVo;
import com.jusfoun.jap.dashboard.domain.Dashboard;
import com.jusfoun.jap.dashboard.vo.DashboardVo;
import com.jusfoun.jap.workTable.domain.ColumnChinese;
import com.jusfoun.jap.workTable.vo.ConnectionVO;
import com.jusfoun.jap.workTable.vo.CubeDimVo;
import com.jusfoun.jap.workTable.vo.Measures;
import com.jusfoun.jap.workTable.vo.RuleVO;
import com.jusfoun.jap.workTable.vo.TableChinese;
import com.jusfoun.jap.workTable.vo.WorkTableCondition;
import com.jusfoun.jap.workTable.vo.WorkTableDetail;
import com.jusfoun.jap.workTable.vo.WorkTableVo;

public interface ColumnChineseMapper{

	/**
	 * 封装前台查询条件
	 *
	 * @param queuryVo
	 *            前台查询条件
	 * @return
	 */
	public List<CubeVo> queryDimByCubeId(CubeVo cubeVo);

	public List<ColumnChinese> queryFactByCubeId(CubeVo cubeVo);

	public List<CubeDimVo> queryDimByCondition(CubeDimVo cubeDimVo);

	public List<CubeDimVo> getConnectByCubeIdAndTableName(ConnectionVO connectionVO);

	public String queryCubeDescriptionByCubeId(CubeVo cubeVo);

	public int saveWorkTable(WorkTableCondition workTableCondition);
	
	public void saveFiltersDetail(WorkTableCondition workTableCondition);
	public void saveMeasuresDetail(WorkTableCondition workTableCondition);
	public void saveDimTableDetail(WorkTableCondition workTableCondition);

	public List<WorkTableVo> queryWorkTable(WorkTableVo workTable);
	public List<WorkTableVo> queryWorkTablebyPie(Dashboard Dashboard);

	public String queryFactTableRule(Measures measures);
	
	public List<RuleVO> getRules(List<String> ruleIds);
	
	public List<ColumnChinese> queryColumnCn(CubeDimVo CubeDimVo);

	public List<ColumnChinese> getColumnChinese(ColumnChinese columnChinese);

	public void updateColumnChinese(ColumnChinese columnChinese);

	public void deleteWorkTableDetail(String workTableId);

	public Integer updateWorkTable(WorkTableCondition workTableCondition);

	public void updateTableChinese(ColumnChinese columnChinese);

	public List<TableChinese> queryDimListByCubeId(CubeVo cubeVo);

	public List<String> selectNames(WorkTableVo workTableVo);

	public void copyWorkTable(WorkTableVo workTableVo);

	public String getCopyWorkTableId(WorkTableVo workTableVo);


	public List<WorkTableDetail> queryWorkTableDimList(WorkTableCondition workTable);

	public List<WorkTableDetail> queryWorkTablemeasureList(WorkTableCondition workTable);

	public List<WorkTableDetail> queryWorkTablefilterList(WorkTableCondition workTable);

	public WorkTableVo getWorkTable(WorkTableCondition workTable);

	public void copyWorktableDetail(Map<String, String> mapId);

	public void deleteWorkTable(String workTableId);

	public void deleteDashTabRale(String workTableId);

	public List<String> getPieNames(WorkTableVo workTableVo);

	public List<WorkTableVo> queryWorkTableList(List<WorkTableVo> list);

	public List<WorkTableDetail> queryWorkTableAllDetail(WorkTableCondition workTable);

	public int checkWorkTableCode(WorkTableCondition workTableCondition);

}