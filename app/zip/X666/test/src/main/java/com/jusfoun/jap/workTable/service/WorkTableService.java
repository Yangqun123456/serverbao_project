package com.jusfoun.jap.workTable.service;

import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.github.pagehelper.PageHelper;
import com.itmuch.core.page.PageInfo;
import com.itmuch.core.page.PageVo;
import com.itmuch.core.util.SubjectUtil;
import com.itmuch.core.web.converter.Result;
import com.jusfoun.jap.admin.vo.PageInfoVo;
import com.jusfoun.jap.common.Results;
import com.jusfoun.jap.cube.vo.CubeVo;
import com.jusfoun.jap.dashboard.service.DashboardService;
import com.jusfoun.jap.dashboard.vo.DashboardVo;
import com.jusfoun.jap.util.kylin.GetKylinData;
import com.jusfoun.jap.workTable.domain.ColumnChinese;
import com.jusfoun.jap.workTable.mapper.ColumnChineseMapper;
import com.jusfoun.jap.workTable.vo.ConnectionVO;
import com.jusfoun.jap.workTable.vo.CubeDetail;
import com.jusfoun.jap.workTable.vo.CubeDimVo;
import com.jusfoun.jap.workTable.vo.Measures;
import com.jusfoun.jap.workTable.vo.RuleVO;
import com.jusfoun.jap.workTable.vo.TableChinese;
import com.jusfoun.jap.workTable.vo.WorkTableCondition;
import com.jusfoun.jap.workTable.vo.WorkTableDetail;
import com.jusfoun.jap.workTable.vo.WorkTableVo;

@Service
public class WorkTableService {
	@Autowired 
	protected ColumnChineseMapper dao;
	@Resource
    private DashboardService dashboardService;
	@Value("${kylin.url}")
	private String kylinUrl;
	@Value("${kylin.username}")
	private String kylinUsername;
	@Value("${kylin.password}")
	private String kylinPassword;
	@Value("${kylin.database}")//kylin的数据库名称
	private String kylinDatabase;
	
	public Result queryByCubeId(CubeVo cubeVo) {
		Result result = new Result();
		if (cubeVo.getCubeId() == null) {
			result.setSuccess(false);
			result.setMsg("CubeId is null");
			return result;
		}
		List<TableChinese> listDim = dao.queryDimListByCubeId(cubeVo);
		List<ColumnChinese> listFact = dao.queryFactByCubeId(cubeVo);
		if(listFact!=null&&listFact.size()>0){
			for(ColumnChinese ColumnChinese :listFact){
				String rules = ColumnChinese.getFactRules();
				if(rules!=null&&rules.length()>0){
					List<RuleVO> ruleVOList = new ArrayList<RuleVO>();
					String[] listRules = rules.replace("[", "").replace("]","").split(",");
					List<String> ruleIds  = Arrays.asList(listRules);
					ruleVOList = dao.getRules(ruleIds);//[qw,wq,e,o]
					ColumnChinese.setRules(ruleVOList);
				}
			}
		}
		CubeDetail CubeDetail =new CubeDetail();
		CubeDetail.setListDim(listDim);
		CubeDetail.setListFact(listFact);
		result.setData(CubeDetail);
		return result;
	}

	public List<CubeDimVo> queryCubeDimByCondition(CubeDimVo cubeDimVo) {
		List<CubeDimVo> listDim = dao.queryDimByCondition(cubeDimVo);
		return listDim;
	}

	public List<CubeDimVo> getConnectByCubeIdAndTableName(ConnectionVO connectionVO) {
		List<CubeDimVo> listDim = dao.getConnectByCubeIdAndTableName(connectionVO);
		return listDim;
	}

	public String queryCubeDescriptionByCubeId(CubeVo cubeVo) {
		String cubeDescription = dao.queryCubeDescriptionByCubeId(cubeVo);
		return cubeDescription;
	}

	public List<ColumnChinese> queryFactByCubeId(CubeVo cubeVo) {
		List<ColumnChinese> listFact = dao.queryFactByCubeId(cubeVo);
		return listFact;
	}

	public void saveWorkTable(WorkTableCondition workTableCondition) {
		dao.saveWorkTable(workTableCondition);
	}

	/**
	 * 组装sql数据
	 *
	 * @param workCondition
	 * @return
	 */
	public  StringBuffer getKylinSql(WorkTableCondition workTableCondition) {
		ConnectionVO connectionVO = new ConnectionVO();
		connectionVO.setCubeId(workTableCondition.getCubeId());
		List<WorkTableDetail> dimTableList = workTableCondition.getDimTable();
		List<WorkTableDetail> measuresList = workTableCondition.getMeasures();
		List<WorkTableDetail> filters = workTableCondition.getFilters();

		StringBuffer sb = new StringBuffer();
		String dimColumn = "";
		String measureColumn = "";
		String measureColumnAs = "";//别名
		String dimTable = "";
		String measureTable = "";
		String filterTable = "";
		List<String> tableNameList = new ArrayList<String>();
		sb.append("select ");
		for(int i=0;i<dimTableList.size();i++){
			//RowType 标记行类型1：维度行，2：筛选行，3：即在筛选也在维度行
			dimTable = dimTableList.get(i).getTableName();
			dimColumn = dimTableList.get(i).getTableColumn();
//			if(dimTableList.get(i).getRowType().equals("1")||dimTableList.get(i).getRowType().equals("3")){
				sb.append(dimTable+"."+dimColumn+", ");
//			}
			tableNameList.add(dimTable);
		}
		for(int i=0;i<measuresList.size();i++){
			//RowType 标记行类型1：度量行，2：筛选行，3：即在筛选也在度量行
//			if(measuresList.get(i).getRowType().equals("1")||measuresList.get(i).getRowType().equals("3")){
				measureColumn = measuresList.get(i).getTableColumn();
				measureColumnAs = measureColumn;
				if("count1".equals(measureColumn)){
					measureColumn="'count1'";
				}
				measureTable = measuresList.get(i).getTableName();
				String ruleName = "";//度量规则名称
				ruleName = measuresList.get(i).getFactTableRule();
				if(i == measuresList.size()-1){//度量中的最后一个的时候没有逗号
					if("COUNT_DISTINCT".equals(ruleName)){//sql里不能使用，所以要转换
						sb.append("COUNT(DISTINCT(" + measureColumn+")) as " + measureColumnAs+" ");
					}else{
						sb.append(ruleName+"(" + measureColumn+") as " + measureColumnAs+" ");
					}
				}else{
					if("COUNT_DISTINCT".equals(ruleName)){//sql里不能使用，所以要转换
						sb.append("COUNT(DISTINCT(" + measureColumn+")) as " + measureColumnAs+", ");
					}else{
						sb.append(ruleName+"(" + measureColumn+") as " + measureColumnAs+", ");
					}
				}
//			}
			tableNameList.add(measureTable);
		}
		//虽然不是最后一个，但是有可能最后一个不是类型为2的，这样就会导致最后多一个逗号，需要去除
		if(sb.substring(sb.length()-2, sb.length()-1).equals(",")){
			System.out.println("sql最后一个字符为："+sb.substring(sb.length()-2, sb.length()-1));
			sb.delete(sb.length()-2, sb.length()-1);
		}
		//获取筛选行中可能不存在于维度和度量的表
		for(int i=0;i<filters.size();i++){
			if(filters.get(i)!=null){
				filterTable = filters.get(i).getTableName();
				tableNameList.add(filterTable);
			}
		}
		//表名去重
		List<String> listTableDis = new LinkedList<String>();
		for(int i= 0;i<tableNameList.size();i++){
			String tableNameTem = tableNameList.get(i);
			if(!listTableDis.contains(tableNameTem)){
				listTableDis.add(tableNameTem);
			}
		}
		connectionVO.setTableNameList(listTableDis);
		sb.append("from ");
		for(int i=0;i<measuresList.size()&&i<1;i++){//取度量中的第一个，一个分析模型中只能有一个事实表
			measureTable = measuresList.get(i).getTableName();
			sb.append(kylinDatabase+"."+measureTable+" ");//度量列是否有多个待定
		}
		List<CubeDimVo> listDimCondition = this.getConnectByCubeIdAndTableName(connectionVO);//根据cubeId和tableName查询出关联条件
		//进行表关联，但是维度表中 可能有多个字段来自一个表，所以需要去掉重复的，事实表只有一个，上面已经进行了拼装，现在不需要再次拼接
		List<String> listTableTemp = new LinkedList<String>();
		for(int i=0;i<dimTableList.size();i++){
			String dimTableName = dimTableList.get(i).getTableName();
			if(!listTableTemp.contains(dimTableName)&&!dimTableName.contains("FACT")){//如果维度来自度量的特殊情况下，就不需要进行表连接
				listTableTemp.add(dimTableName);
				sb.append(" inner join ");//使用left 不用inner，inner时错误数据会被过滤；
				sb.append(kylinDatabase+"."+dimTableName+" ");
				sb.append(" on ");
				for(int j=0;j<listDimCondition.size();j++){
					if(listDimCondition.get(j)!=null){
						String dimTableConnectTem = listDimCondition.get(j).getTableConnectColumn() +"  ";
						//比如FACT_ORDER.CUSTOM_KEY=DIM_CUSTOM.CUSTOM_KEY 只要包维度表名称的就是关联字段
						if(dimTableConnectTem.contains(dimTableName)){
							sb.append(listDimCondition.get(j).getTableConnectColumn());
						}
					}
				}
			}else{
				System.out.println("关联表存在重复的表名："+dimTableName+", 重复的维度列为："+dimTableList.get(i).getTableColumn());
			}
		}
		//筛选行中的列，不在度量或者维度中，此时需要将关联表添加上
		for(int i=0;i<filters.size();i++){
			if(filters.get(i)!=null){
				String filterTableName = filters.get(i).getTableName();
				String tableType = filters.get(i).getTableType();//度量表有且只有一个，不需要重复添加1维度2度量
				if(!listTableTemp.contains(filterTableName)&&tableType.equals("1")&&!filterTableName.contains("FACT")){
					listTableTemp.add(filterTableName);
					sb.append(" inner join ");//使用left 不用inner，inner时错误数据会被过滤；
					sb.append(kylinDatabase+"."+filterTableName+" ");
					sb.append(" on ");
					for(int j=0;j<listDimCondition.size();j++){
						String dimTableConnectTem = listDimCondition.get(j).getTableConnectColumn() +"  ";
						//比如FACT_ORDER.CUSTOM_KEY=DIM_CUSTOM.CUSTOM_KEY 只要包维度表名称的就是关联字段
						if(dimTableConnectTem.contains(filterTableName)){
							sb.append(listDimCondition.get(j).getTableConnectColumn());
						}
					}
				}else{
					System.out.println("关联表存在重复的表名："+filterTableName+", 重复的维度列为："+filters.get(i).getTableColumn());
				}
			
			}
		}
		sb.append(" where 1=1 ");
		//filters
		for(int i=0;i<filters.size();i++){
			if(filters.get(i)!=null&&!(null==filters.get(i).getListFilters())){//当筛选条件值不为空时才可以拼接条件
				if(filters.get(i).getListFilters().size()>0){//筛选数据不能为空
					if(filters.get(i).getListFilters().size()==1&&filters.get(i).getListFilters().get(0).equals("")&&filters.get(i).getListFilters().get(0)==null){//空数组长度为1且为空字符或者null，也需要排除
						System.out.println("筛选维度或者度量为空，表名称为："+filters.get(i).getTableName()+"表列名为："+filters.get(i).getListFilters());
					}else{
						if(filters.get(i).getTableType().equals("1")){//1代表筛选行里的维度，2代表筛选行里的度量
							sb.append(" and ");
							dimTable = filters.get(i).getTableName();
							dimColumn = filters.get(i).getTableColumn();
							sb.append(dimTable+"."+dimColumn+" ");
							sb.append("in (");
							List<String> list = filters.get(i).getListFilters();
							for(int j=0;j<list.size();j++){
								String value = list.get(j).replaceAll("\"", "");
								if(j==list.size()-1){
									sb.append("'" +value+ "'" );
								}else{
									sb.append("'" +value+ "'" +",");
								}
							}
							sb.append("" +")");
						}
					}
				}
			}
		}
		sb.append(" group by ");
		for(int i=0;i<dimTableList.size();i++){
			//RowType 标记行类型1：维度行，2：筛选行，3：即在筛选也在维度行
			//如果不是最后一个，但是后面的都是重复的不需要加，此时最后会多一个逗号，所以最后判断删掉
//			if(dimTableList.get(i).getRowType().equals("1")||dimTableList.get(i).getRowType().equals("3")){
				dimColumn = dimTableList.get(i).getTableColumn();
				dimTable = dimTableList.get(i).getTableName();
				if(i == dimTableList.size()-1){
					sb.append(dimTable+"."+dimColumn+" ");
				}else{
					sb.append(dimTable+"."+dimColumn+", ");
				}
//			}
		}
		if(sb.substring(sb.length()-2, sb.length()-1).equals(",")){
			System.out.println("sql最后一个字符为："+sb.substring(sb.length()-2, sb.length()-1));
			sb.delete(sb.length()-2, sb.length()-1);
		}
		//增加度量筛选条件拼接 having 
		for(int i=0;i<filters.size();i++){
			if(filters.get(i)!=null){
				//取度量中的第一个，一个分析模型中只能有一个事实表
				if(i==0){//只有第一个度量循环时才会加having 
					sb.append(" having  1=1 ");
				}
				String tableType = filters.get(i).getTableType();//1代表筛选行里的维度，2代表筛选行里的度量
				String measuresTableName  = filters.get(i).getTableName();
				String measuresColumn   = filters.get(i).getTableColumn();
				String ruleName = filters.get(i).getFactTableRule();//度量规则名称
				//标记行类型1：度量行，2：筛选行，3：即在筛选也在度量行
				if(tableType.equals("2")){
					List<String> measureSizeList = new ArrayList<String>();
					measureSizeList = filters.get(i).getListFilters();
					if(measureSizeList!=null){
						for(int j = 0 ;j<measureSizeList.size();j++){
							String measureSize = measureSizeList.get(j);
							if(!StringUtils.isEmpty(measureSize)&&!"null".equals(measureSize)){
								Double size = Double.valueOf(measureSize);
								if(j==0){//如果是第一个度量时候
									if("count1".equals(measuresColumn)){
										if("COUNT_DISTINCT".equals(ruleName)){//sql里不能使用，所以要转换
											sb.append(" and COUNT(DISTINCT('count1'))>="+size+" ");
										}else{
											sb.append(" and "+ruleName+"('count1')>="+size+" ");
										}
									}else{
										if("COUNT_DISTINCT".equals(ruleName)){//sql里不能使用，所以要转换
											sb.append(" and COUNT(DISTINCT("+measuresTableName+"."+measuresColumn+"))>="+size+" ");
										}else{
											sb.append(" and "+ruleName+" ("+measuresTableName+"."+measuresColumn+")>="+size+" ");
										}
									}
								}else{
									if("count1".equals(measuresColumn)){
										if("COUNT_DISTINCT".equals(ruleName)){//sql里不能使用，所以要转换
											sb.append(" and COUNT(DISTINCT('count1'))<="+size+" ");
										}else{
											sb.append(" and "+ruleName+"('count1')<="+size+" ");
										}
									}else{
										if("COUNT_DISTINCT".equals(ruleName)){//sql里不能使用，所以要转换
											sb.append(" and COUNT(DISTINCT("+measuresTableName+"."+measuresColumn+"))<="+size+" ");
										}else{
											sb.append(" and "+ruleName+" ("+measuresTableName+"."+measuresColumn+")<="+size+" ");
										}
									}
								}
							}
						}
					}
				}
			}
		}
		sb.append(" order by ");
		for(int i=0;i<dimTableList.size();i++){
			//RowType 标记行类型1：维度行，2：筛选行，3：即在筛选也在维度行
			//如果不是最后一个，但是后面的都是重复的不需要加，此时最后会多一个逗号，所以最后判断删掉
//			if(dimTableList.get(i).getRowType().equals("1")||dimTableList.get(i).getRowType().equals("3")){
				dimColumn = dimTableList.get(i).getTableColumn();
				dimTable = dimTableList.get(i).getTableName();
				if(i == dimTableList.size()-1){
					sb.append(dimTable+"."+dimColumn+" ");
				}else{
					sb.append(dimTable+"."+dimColumn+", ");
				}
//			}
		}
		if(sb.substring(sb.length()-2, sb.length()-1).equals(",")){
			System.out.println("sql最后一个字符为："+sb.substring(sb.length()-2, sb.length()-1));
			sb.delete(sb.length()-2, sb.length()-1);
		}
//		sb.append(" limit 16 ");
		System.out.println("查询sql为：");
		System.out.println(sb.toString().toLowerCase());
		return sb;
	}
	// 保存数据分析详情
	public void saveWorkTableDetail(WorkTableCondition workTableCondition) {
		List<WorkTableDetail> filterList = workTableCondition.getFilters();
		if(filterList!=null&filterList.size()>0){
			for(WorkTableDetail d:filterList){
				if(d.getListFilters()!=null&d.getListFilters().size()>0){
					StringBuilder sb = new StringBuilder("[");
					for (String a :d.getListFilters()) {
						sb.append(a+",");
					}
					String filter = sb.toString();
					filter = filter.substring(0, filter.length()-1)+"]";
					d.setListFilter(filter);
				}
			}
			workTableCondition.setFilters(filterList);
			dao.saveFiltersDetail(workTableCondition);
		}
		
		List<WorkTableDetail> measureList = workTableCondition.getMeasures();
		
		if(measureList!=null&measureList.size()>0){
			if("mixTwoMeasureTwoY".equals(workTableCondition.getDataType())
					||"mixTowDimLine".equals(workTableCondition.getDataType())
					||"mixTwoMeasure".equals(workTableCondition.getDataType())
					||"mixTwoDim".equals(workTableCondition.getDataType())){
				int i= 0;
				for(WorkTableDetail d:measureList){
					if(i==0){
						d.setChartType("line");
					}else{
						d.setChartType("bar");
					}
					i++;
				}
			}
			workTableCondition.setMeasures(measureList);
			dao.saveMeasuresDetail(workTableCondition);
		}
		dao.saveDimTableDetail(workTableCondition);
	}

	// 查询数据分析列表
	public List<WorkTableVo> queryWorkTable(WorkTableVo workTable) {
		return dao.queryWorkTable(workTable);
	}

	public WorkTableCondition showWorkTable(WorkTableCondition workTable) {
		WorkTableVo workTable1 = new WorkTableVo();
		workTable1 = dao.getWorkTable(workTable);
		if(workTable1==null){
			return null;
		}
		List<WorkTableDetail> dimTable = new ArrayList<WorkTableDetail>();
		List<WorkTableDetail> measures = new ArrayList<WorkTableDetail>();
		List<WorkTableDetail> filters = new ArrayList<WorkTableDetail>();
		List<WorkTableDetail> allDetail = dao.queryWorkTableAllDetail(workTable);
		if(allDetail!=null&&allDetail.size()>0){
			for(WorkTableDetail workTableDetail:allDetail){
				if("3".equals(workTableDetail.getTableType())){
					dimTable.add(workTableDetail);
				}else if("4".equals(workTableDetail.getTableType())){
					measures.add(workTableDetail);
				}else if("1".equals(workTableDetail.getTableType())||"2".equals(workTableDetail.getTableType())){
					filters.add(workTableDetail);
				}
			}
		}
		if(measures!=null&&measures.size()>0){
			for(WorkTableDetail WorkTableDetail :measures){
				String rules = WorkTableDetail.getFactRules();
				if(rules!=null&&rules.length()>0){
					List<RuleVO> ruleVOList = new ArrayList<RuleVO>();
					String[] listRules = rules.replace("[", "").replace("]","").split(",");
					ruleVOList = dao.getRules(Arrays.asList(listRules));//[qw,wq,e,o]
					WorkTableDetail.setRules(ruleVOList);
				}
			}
		}
		
		if(filters!=null&&filters.size()>0){
			CubeDimVo dimv = new CubeDimVo();
			for(WorkTableDetail WorkTableDetail :filters){
				String listFilter = WorkTableDetail.getListFilter();
				if("2".equals(WorkTableDetail.getTableType())){//筛选中的度量字段要带上所有的度量规则
					String rules = WorkTableDetail.getFactRules();
					if(rules!=null&&rules.length()>0){
						List<RuleVO> ruleVOList = new ArrayList<RuleVO>();
						String[] listRules = rules.replace("[", "").replace("]","").split(",");
						ruleVOList = dao.getRules(Arrays.asList(listRules));//[qw,wq,e,o]
						WorkTableDetail.setRules(ruleVOList);
					}
				}else if("step".equals(workTable1.getDataType())){//同比图需要将维度的值返回
					dimv.setTableName(WorkTableDetail.getTableName());
					dimv.setTableColumn(WorkTableDetail.getTableColumn());
					dimv = (CubeDimVo) queryByCondition(dimv).getData();
					WorkTableDetail.setListAllValue(dimv.getResultSet());
				}
				if(listFilter!=null&&listFilter.length()>0){
					String[] listFilters = listFilter.replace("[", "").replace("]","").split(",");
					WorkTableDetail.setListFilters((Arrays.asList(listFilters)));
				}
			}
		}
		workTable.setDimTable(dimTable);
		workTable.setWorkTableId(workTable1.getWorkTableId());
		workTable.setMeasures(measures);
		workTable.setFilters(filters);
		workTable.setCubeId(workTable1.getCubeId());
		workTable.setDataType(workTable1.getDataType());
		workTable.setUserId(workTable1.getUserId());
		workTable.setXsColor(workTable1.getXsColor());
		workTable.setXwColor(workTable1.getXwColor());
		workTable.setYsColor(workTable1.getYsColor());
		workTable.setYwColor(workTable1.getYwColor());
		workTable.setHeaderColor(workTable1.getHeaderColor());
		workTable.setBodyColor(workTable1.getBodyColor());
		workTable.setTableColor(workTable1.getTableColor());
		workTable.setWorkTableName(workTable1.getWorkTableName());
		workTable.setWorkTableCode(workTable1.getWorkTableCode());
		workTable.setThemeId(workTable1.getThemeId());
		if(workTable1.getThemeColor()!=null){
			workTable.setThemeColorArr(Arrays.asList(workTable1.getThemeColor().replace("[", "").replace("\"", "").replace("]", "").split(",")));
		}
		return workTable;
	}

	public Result getFactTableRule(Measures measures) {
		Result result = new Result();
		String rules = dao.queryFactTableRule(measures);//[qw,wq,e,o]
		String[] listRule = rules.replace("[", "").replace("]","").split(",");
		List<String> ruleIds = new ArrayList<String>();
//		ruleIds = listRule;
		ruleIds = Arrays.asList(listRule);
		List<RuleVO> ruleVOList = new ArrayList<RuleVO>();
		ruleVOList = dao.getRules(ruleIds);
		result.setData(ruleVOList);
		return result;
	}
	public List<ColumnChinese> queryColumnCn(CubeDimVo CubeDimVo) {
		return dao.queryColumnCn(CubeDimVo);
	}

	public PageInfoVo<ColumnChinese> getColumnChinese(PageVo pageVo, ColumnChinese columnChinese) {
		PageHelper.startPage(pageVo.getPage(), pageVo.getRows());
		List<ColumnChinese> list = dao.getColumnChinese(columnChinese);
		PageInfo<ColumnChinese> info = new PageInfo<ColumnChinese>(list);
		PageInfoVo<ColumnChinese> ColumnChinesePage = new PageInfoVo<ColumnChinese>(info.getList(), list);
		return ColumnChinesePage;
	}

	public void updateColumnChinese(ColumnChinese columnChinese) {
		dao.updateColumnChinese(columnChinese);
		dao.updateTableChinese(columnChinese);
	}

	public void deleteWorkTableDetail(String workTableId) {
		dao.deleteWorkTableDetail(workTableId);
	}

	public Integer updateWorkTable(WorkTableCondition workTableCondition) {
		Integer updateRow = dao.updateWorkTable(workTableCondition);
		return updateRow;
	}

	public void updateAllChn(List<ColumnChinese> columnChineseList) {
		for(ColumnChinese columnChinese:columnChineseList){
			dao.updateColumnChinese(columnChinese);
		}
	}

	public void copyWorktable(WorkTableVo workTableVo) {
		//1获取该数据分析的副本名列表
		List<String> names = dao.selectNames(workTableVo);
		int copyOrder =1;
		boolean getOrder = false;//false 表示 该序号的副本没有
		for(;;copyOrder++){
			getOrder = false;
			for(String name:names){
				if((workTableVo.getWorkTableName()+"-副本"+copyOrder).equals(name)){//检测到该序列的副本
					getOrder = true;
					break;
				}
			}
			if(!getOrder){//如果没有检测到循环结束copyOrder为可以使用的值
				break;
			}
		}
		
		//2插入新的数据分析记录并返回主键
		workTableVo.setWorkTableName(workTableVo.getWorkTableName()+"-副本"+copyOrder);//更换新的名字
		dao.copyWorkTable(workTableVo);//插入
		String copyId = dao.getCopyWorkTableId(workTableVo);//返回主键
		//3.插入与数据分析的关联记录
		Map<String,String> mapId=new HashMap<String,String>();
		mapId.put("copyId", copyId);
		mapId.put("id", workTableVo.getWorkTableId());
		dao.copyWorktableDetail(mapId);
				
	}

	public String delWorktable(WorkTableVo workTableVo) {
		List<String> pieNames = dao.getPieNames(workTableVo);
		if(pieNames==null||pieNames.size()==0){//该工作表未挂在仪表盘下
			dao.deleteWorkTable(workTableVo.getWorkTableId());
			dao.deleteWorkTableDetail(workTableVo.getWorkTableId());
			return null;
		}else{
			return pieNames.toString();
		}
		//dao.deleteDashTabRale(workTableVo.getWorkTableId());
	}
	public List<String> getFilterList (){
		return null;
		
	}
	public Result queryByCondition(CubeDimVo cubeDimVo) {
		Result result = new Result();
		List<CubeDimVo> list = new ArrayList<CubeDimVo>();
		list = queryCubeDimByCondition(cubeDimVo);
		String kylin = queryFromKylin(cubeDimVo);
		System.out.println(kylin);
		List<String> filterList = new ArrayList<String>();
		String key = "";
		String value = "";
		try {
			JSONArray myJsonArray = new JSONArray(kylin);
			for (int i = 0; i < myJsonArray.length(); i++) {
				JSONObject myObject = myJsonArray.getJSONObject(i);
				Iterator<?> iterator = myObject.keys();
				while (iterator.hasNext()) {
					key = (String) iterator.next();
					value = myObject.getString(key);
					filterList.add(value);
				}
			}

		} catch (JSONException e1) {
			e1.printStackTrace();
		}
		// new CubeDimVo();
		for (int i = 0; i < list.size(); i++) {
			cubeDimVo = list.get(i);// 查询汉语列名称最多只有一条
		}
		cubeDimVo.setResultSet(filterList);
		result.setData(cubeDimVo);
		return result;
	}
	
	public String queryFromKylin(CubeDimVo cubeDimVo) {
		StringBuffer sb = new StringBuffer();
		sb.append("select distinct ");
		String column = cubeDimVo.getTableColumn();
		String table = cubeDimVo.getTableName();
		sb.append(column + " from " +kylinDatabase+"."+table);
		/* sb.append("select distinct custom_name from dim_custom"); */
		GetKylinData data = new GetKylinData();
		String result = "";
		try {
			result = data.getData(sb.toString(), kylinUrl, kylinUsername, kylinPassword);
			System.out.println(result);

		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return result;
	}
	
	@RequestMapping("/saveWorkTable")
	@ResponseBody
	@RequiresPermissions("sys:cube:view")
	public Result saveWorkTable(String workConditionString) {
		Result result = new Result();
		WorkTableCondition workTableCondition = JSON.parseObject(workConditionString, WorkTableCondition.class);// json转换为WorkCondition的对象
		workTableCondition.setUserId(SubjectUtil.getUserId().toString());
		String workTableId = "";
		boolean insertWorkTable = true;//判断该数据分析是新建的（true）还是修改的（false）
		if(insertWorkTable=("".equals(workTableCondition.getWorkTableId())||workTableCondition.getWorkTableId()==null)){
			int count = dao.checkWorkTableCode(workTableCondition);//工作表编码重复的数量
			if(count >0){//重复code
				result.setSuccess(false);
				result.setCode(1001);
				result.setMsg("工作表编码有重复");
				return result;
			}
			workTableId = UUID.randomUUID().toString().replaceAll("-", "");// 为新建的数据分析创建主键
		}else{
			workTableId = workTableCondition.getWorkTableId();//修改数据分析使用原来的主键
		}
		workTableCondition.setWorkTableId(workTableId);
		if(insertWorkTable){//新增的数据分析
			saveWorkTable(workTableCondition);
		}else{
			if(0==updateWorkTable(workTableCondition)){//更新时原数据丢了，执行保存
				insertWorkTable = true;//标志为保存
				workTableId  = UUID.randomUUID().toString().replaceAll("-", "");// 为新建的数据分析创建主键
				workTableCondition.setWorkTableId(workTableId);
			}
		}
		
		if(!insertWorkTable){//修改的数据分析需要将原来的删除
			deleteWorkTableDetail(workTableCondition.getWorkTableId());
		}
		saveWorkTableDetail(workTableCondition);// 保存数据分析详情
		result.setData(workTableCondition);
		result.setSuccess(true);
		result.setCode(1000);
		return result;
	}
	

	public Results getKylinByCondition(WorkTableCondition workTableCondition) throws SQLException, JSONException {
        Results result = new Results();
		StringBuffer sql = getKylinSql(workTableCondition);
		String dataType = workTableCondition.getDataType();
		List<WorkTableDetail> dimTableList = workTableCondition.getDimTable();
		List<WorkTableDetail> measuresList = workTableCondition.getMeasures();
		List<String> dimSort = new ArrayList<String>();
		List<String> measureDanWei = new ArrayList<String>();
		List<String> measureDuLiangName = new ArrayList<String>();
		//获取最大最小值
		StringBuffer sb = new StringBuffer();
		String measureColumn = "";
		String measureColumnAs = "";//别名
        sb.append("select ");
		for(int i=0;i<measuresList.size();i++){
			measureColumn = measuresList.get(i).getTableColumn();
			measureColumnAs = measureColumn;
			if("count1".equals(measureColumn)){
				measureColumn="'count1'";
			}
			if(i == measuresList.size()-1){//度量中的最后一个的时候没有逗号
				sb.append("max(" + measureColumn+") as max" + measureColumnAs+", ");
				sb.append("min(" + measureColumn+") as min" + measureColumnAs+" ");
			}else{
				sb.append("max(" + measureColumn+") as max" + measureColumnAs+", ");
				sb.append("min(" + measureColumn+") as min" + measureColumnAs+", ");				
				}
		}
		sb.append("from ( "+sql +" ) ");
		int dimSize = 0;
		for(int i = 0;i<dimTableList.size();i++){
			WorkTableDetail CubeDimVo = new WorkTableDetail();
			CubeDimVo = dimTableList.get(i);
			//标记行类型1：维度行，2：筛选行，3：即在筛选也在维度行
//			if(CubeDimVo.getRowType().equals("1")||CubeDimVo.getRowType().equals("3")){
				//查询维度的中文名称
				List<ColumnChinese> columnChineseList = new ArrayList<ColumnChinese>();
				CubeDimVo CubeDimVoCond = new CubeDimVo();
				CubeDimVoCond.setTableColumn(CubeDimVo.getTableColumn());
				CubeDimVoCond.setTableName(CubeDimVo.getTableName());
				columnChineseList = queryColumnCn(CubeDimVoCond);
				for(int j=0;j<columnChineseList.size();j++){
					ColumnChinese ColumnChinese = new ColumnChinese();
					ColumnChinese= columnChineseList.get(j);
					dimSort.add(ColumnChinese.getTableColumnCn());
				}
				dimSize++;
//			}
		}
		for(int i = 0;i<measuresList.size();i++){
			WorkTableDetail Measures = new WorkTableDetail();
			Measures = measuresList.get(i);
			//标记行类型1：度量行，2：筛选行，3：即在筛选也在度量行
//			if(Measures.getRowType().equals("1")||Measures.getRowType().equals("3")){
				//查询每个度量的单位
				List<ColumnChinese> columnChineseList = new ArrayList<ColumnChinese>();
				CubeDimVo CubeDimVo = new CubeDimVo();
				CubeDimVo.setTableColumn(Measures.getTableColumn());
				CubeDimVo.setTableName(Measures.getTableName());
				columnChineseList = queryColumnCn(CubeDimVo);
				for(int j=0;j<columnChineseList.size();j++){
					ColumnChinese ColumnChinese = new ColumnChinese();
					ColumnChinese= columnChineseList.get(j);
					String danWei = ColumnChinese.getMeasureUnit();
					String duLiangName = ColumnChinese.getTableColumnCn();
					if(StringUtils.isEmpty(danWei)){
						danWei="";
					}
					measureDuLiangName.add(duLiangName);
					measureDanWei.add(danWei);
				}
//			}
		}
		result = GetKylinData.getMultidimenDataResult(sb,dataType,measureDuLiangName,measuresList,dimSort,measureDanWei,dimSize,sql,kylinUrl,kylinUsername,kylinPassword);
		result.setWorkTableId(workTableCondition.getWorkTableId());
		return result;
	}

	public WorkTableCondition showWorkTableofPie(WorkTableCondition workTable) {
		WorkTableVo workTable1 = new WorkTableVo();
		workTable1 = dao.getWorkTable(workTable);
		List<WorkTableDetail> dimTable = new ArrayList<WorkTableDetail>();
		List<WorkTableDetail> measures = new ArrayList<WorkTableDetail>();
		List<WorkTableDetail> filters = new ArrayList<WorkTableDetail>();
		List<WorkTableDetail> allDetail = dao.queryWorkTableAllDetail(workTable);
		if(allDetail!=null&&allDetail.size()>0){
			for(WorkTableDetail workTableDetail:allDetail){
				if("3".equals(workTableDetail.getTableType())){
					dimTable.add(workTableDetail);
				}else if("4".equals(workTableDetail.getTableType())){
					measures.add(workTableDetail);
				}else if("1".equals(workTableDetail.getTableType())||"2".equals(workTableDetail.getTableType())){
					filters.add(workTableDetail);
				}
			}
		}
		
		if(filters!=null&&filters.size()>0){
			CubeDimVo dimv = new CubeDimVo();
			for(WorkTableDetail WorkTableDetail :filters){
				String listFilter = WorkTableDetail.getListFilter();
				if("step".equals(workTable1.getDataType())&&"1".equals(WorkTableDetail.getTableType())){//同比图需要将维度的值返回
					dimv.setTableName(WorkTableDetail.getTableName());
					dimv.setTableColumn(WorkTableDetail.getTableColumn());
					dimv = (CubeDimVo) queryByCondition(dimv).getData();
					WorkTableDetail.setListAllValue(dimv.getResultSet());
				}
				if(listFilter!=null&&listFilter.length()>0){
					String[] listFilters = listFilter.replace("[", "").replace("]","").split(",");
					WorkTableDetail.setListFilters((Arrays.asList(listFilters)));
				}
			}
		}
		
		workTable.setDimTable(dimTable);
		workTable.setMeasures(measures);
		workTable.setFilters(filters);
		workTable.setCubeId(workTable1.getCubeId());
		workTable.setDataType(workTable1.getDataType());
		workTable.setUserId(workTable1.getUserId());
		workTable.setXsColor(workTable1.getXsColor());
		workTable.setXwColor(workTable1.getXwColor());
		workTable.setYsColor(workTable1.getYsColor());
		workTable.setYwColor(workTable1.getYwColor());
		workTable.setHeaderColor(workTable1.getHeaderColor());
		workTable.setBodyColor(workTable1.getBodyColor());
		workTable.setTableColor(workTable1.getTableColor());
		workTable.setWorkTableName(workTable1.getWorkTableName());
		workTable.setThemeId(workTable1.getThemeId());
		if(workTable1.getThemeColor()!=null){
			workTable.setThemeColorArr(Arrays.asList(workTable1.getThemeColor().replace("[", "").replace("\"", "").replace("]", "").split(",")));
		}
		return workTable;
	
	}

	public Result queryWorktableData(WorkTableCondition workTable) throws SQLException, JSONException {
		Results result = new Results();
		WorkTableCondition workTableCondition = showWorkTable(workTable);
		if(workTableCondition==null){
			return null;
		}
		Map<String,Object> worktable = new HashMap<String, Object>();
		worktable.put("workTableDetail", workTableCondition);
		worktable.put("workTableDate", getKylinByCondition(workTableCondition).getData());
		result.setData(worktable);
		result.setSuccess(true);
		return result;
	}

	public Result exportExcel(WorkTableCondition workTableCondition) throws SQLException, JSONException, IOException {
        Result result = new Result();
		StringBuffer sql = getKylinSql(workTableCondition);
		List<WorkTableDetail> dimTableList = workTableCondition.getDimTable();
		List<WorkTableDetail> measuresList = workTableCondition.getMeasures();
		List<String> dimSort = new ArrayList<String>();
		List<String> measureDanWei = new ArrayList<String>();
		List<String> measureDuLiangName = new ArrayList<String>();
		int dimSize = 0;
		for(int i = 0;i<dimTableList.size();i++){
			WorkTableDetail CubeDimVo = new WorkTableDetail();
			CubeDimVo = dimTableList.get(i);
				List<ColumnChinese> columnChineseList = new ArrayList<ColumnChinese>();
				CubeDimVo CubeDimVoCond = new CubeDimVo();
				CubeDimVoCond.setTableColumn(CubeDimVo.getTableColumn());
				CubeDimVoCond.setTableName(CubeDimVo.getTableName());
				columnChineseList = queryColumnCn(CubeDimVoCond);
				for(int j=0;j<columnChineseList.size();j++){
					ColumnChinese ColumnChinese = new ColumnChinese();
					ColumnChinese= columnChineseList.get(j);
					dimSort.add(ColumnChinese.getTableColumnCn());
				}
				dimSize++;
		}
		for(int i = 0;i<measuresList.size();i++){
			WorkTableDetail Measures = new WorkTableDetail();
			Measures = measuresList.get(i);
				List<ColumnChinese> columnChineseList = new ArrayList<ColumnChinese>();
				CubeDimVo CubeDimVo = new CubeDimVo();
				CubeDimVo.setTableColumn(Measures.getTableColumn());
				CubeDimVo.setTableName(Measures.getTableName());
				columnChineseList = queryColumnCn(CubeDimVo);
				for(int j=0;j<columnChineseList.size();j++){
					ColumnChinese ColumnChinese = new ColumnChinese();
					ColumnChinese= columnChineseList.get(j);
					String danWei = ColumnChinese.getMeasureUnit();
					String duLiangName = ColumnChinese.getTableColumnCn();
					if(StringUtils.isEmpty(danWei)){
						danWei="";
					}
					measureDuLiangName.add(duLiangName);
					measureDanWei.add(danWei);
				}
		}
		result = GetKylinData.exportExcel(workTableCondition.getWorkTableName(),measureDuLiangName,measuresList,dimSort,measureDanWei,dimSize,sql,kylinUrl,kylinUsername,kylinPassword);
		return result;
	}

	
}
