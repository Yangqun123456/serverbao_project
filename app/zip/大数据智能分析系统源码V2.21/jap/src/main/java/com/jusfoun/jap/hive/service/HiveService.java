package com.jusfoun.jap.hive.service;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.github.pagehelper.PageHelper;
import com.itmuch.core.page.PageInfo;
import com.itmuch.core.page.PageVo;
import com.jusfoun.jap.admin.vo.PageInfoVo;
import com.jusfoun.jap.cube.service.CubeService;
import com.jusfoun.jap.cube.util.CubeConstants.SyncStatus;
import com.jusfoun.jap.cube.vo.CubeVo;
import com.jusfoun.jap.hive.domain.HiveTable;
import com.jusfoun.jap.hive.domain.HiveTableColumn;
import com.jusfoun.jap.hive.domain.HiveTableRelation;
import com.jusfoun.jap.hive.domain.KylinTable;
import com.jusfoun.jap.hive.domain.KylinTableColumn;
import com.jusfoun.jap.hive.mapper.HiveMapper;
import com.jusfoun.jap.hive.mapper.HiveTableColumnMapper;
import com.jusfoun.jap.hive.mapper.HiveTableMapper;
import com.jusfoun.jap.hive.mapper.HiveTableRelationMapper;
import com.jusfoun.jap.hive.mapper.KylinTableColumnMapper;
import com.jusfoun.jap.hive.mapper.KylinTableMapper;
import com.jusfoun.jap.hive.util.HiveUtil;
import com.jusfoun.jap.hive.vo.ColumnVo;
import com.jusfoun.jap.hive.vo.DataSourceTable;
import com.jusfoun.jap.hive.vo.DimensionVo;
import com.jusfoun.jap.hive.vo.HiveTableVo;
import com.jusfoun.jap.hive.vo.MeasureVo;
import com.jusfoun.jap.hive.vo.ModelVo;
import com.jusfoun.jap.hive.vo.RelationVo;
import com.jusfoun.jap.kylin.service.KylinService;
import com.jusfoun.jap.util.Constant;
import com.jusfoun.jap.util.hive.JDBCToHiveUtils;

@Service
public class HiveService {
	@Autowired
	private HiveMapper hiveMapperdao;

	@Autowired
	private HiveTableMapper hiveTableMapper;
	
	@Autowired
	private HiveTableColumnMapper hiveTableColumnMapper;
	
	@Autowired
	private HiveTableRelationMapper hiveTableRelationMapper;
	
	@Autowired
	private KylinTableMapper kylinTableMapper;
	
	@Autowired
	private KylinTableColumnMapper kylinTableColumnMapper;
	
	@Autowired
	private KylinService kylinService;
	
	@Autowired
	private CubeService cubeService;
	
	public String insertHiveTable(HiveTable hiveTable){
		hiveTable.setTableId(HiveUtil.getUUID());
		 hiveTableMapper.insertHiveTable(hiveTable);
		 return hiveTable.getTableId();
	}
	
	public String insertTableColumn(HiveTableColumn tableColumn){
		tableColumn.setColumnId(HiveUtil.getUUID());
		hiveTableColumnMapper.insertTableColumn(tableColumn);
		return tableColumn.getTableId();
	}
	
	public String insertHiveTableRelation(HiveTableRelation hiveTableRelation){
		hiveTableRelation.setRelationId(HiveUtil.getUUID());
		hiveTableRelationMapper.insertHiveTableRelation(hiveTableRelation);
		return hiveTableRelation.getRelationId();
	}
	
	public String insertKylinTableColumn(KylinTableColumn kylinTableColumn){
		kylinTableColumn.setColumnId(HiveUtil.getUUID());
		kylinTableColumnMapper.insertKylinTableColumn(kylinTableColumn);
		return kylinTableColumn.getColumnId();
	}
	
	public String insertKylinTable(KylinTable kylinTable){
		kylinTable.setTableId(HiveUtil.getUUID());
		kylinTableMapper.insertKylinTable(kylinTable);
		return kylinTable.getTableId();
		
	}
	
	public List<KylinTable> findKylinTableByCubeId(String cubeId){
		return kylinTableMapper.findKylinTableByCubeId(cubeId);
	}
	
	public List<KylinTableColumn> findHiveTableColumnByTableId(List<String> ids){
		return kylinTableColumnMapper.findHiveTableColumnByTableId(ids);
	}
	
	public List<HiveTable> findHiveTableByTableId(Set<String> ids){
		return hiveTableMapper.findHiveTableByTableId(ids);
	}
	
	public List<HiveTableRelation> findHiveTableRelationByCubeId(String cubeId){
		return hiveTableRelationMapper.findHiveTableRelationByCubeId(cubeId);
	}
	
	public List<RelationVo> findHiveTableRelationVoByCubeId(String cubeId){
		return hiveTableRelationMapper.findHiveTableRelationVoByCubeId(cubeId);
	}
		
	public void creatTableInHive(HiveTableVo vo){
		StringBuffer sb=new StringBuffer("create table ");
		sb.append(vo.getTableName()+" ( ");
		List<ColumnVo> columns=vo.getColumns();
		int size=columns.size();
		for(ColumnVo columnVo:columns){
			if(StringUtils.isNotEmpty(columnVo.getColumnRemarks())){
			sb.append(columnVo.getColumnName()+" "+columnVo.getDataType()+" comment '"+columnVo.getColumnRemarks()+"',");
			}else{
				sb.append(columnVo.getColumnName()+" "+columnVo.getDataType()+",");
			}
		}
		sb=new StringBuffer(sb.substring(0, sb.length()-1));
		if(StringUtils.isNotEmpty(vo.getTableRemarks())){
		sb.append(") comment '"+vo.getTableRemarks()+"'");
		}else{
			sb.append(")");
		}
		Connection conn=JDBCToHiveUtils.getConnnection(Constant.HIVE_URL+Constant.HIVE_ANALYSIS_DATABASE);
		try {
			JDBCToHiveUtils.prepare(conn, sb.toString()).execute();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		System.out.println(sb.toString());
	}
	
	public ModelVo generateModel(ModelVo modelVo){
				Map<String,String> syncDimension=new HashMap<String,String>();
				Map<String,String> syncFactTable=new HashMap<String,String>();
				Set<String> hiveTableIds=new HashSet<String>();
				Map<String,String> tableNameMap=new HashMap<String,String>();
		
				Map<String, Set<HiveTableColumn>> tableMap=new HashMap<String,Set<HiveTableColumn>>();
				//用于kylin建立cube的dto对象
				ModelVo modelForKylin=new ModelVo();
				modelForKylin.setModelName(modelVo.getModelName());
				modelForKylin.setModelDesc(modelVo.getModelDesc());
				
				HiveTableVo factTable=new HiveTableVo();
				//hive定义事实表
				String factTableName="fact_"+HiveUtil.getUUID();
				factTable.setTableRemarks(modelVo.getModelDesc());
				factTable.setTableName(factTableName);
				Map<String,String> columnAndTable=new HashMap<String,String>();
				
			
				//hive定义度量表
				List<MeasureVo> measures=modelVo.getMeasures();
				for(MeasureVo measuer : measures){
					Set<HiveTableColumn> measureSet=tableMap.get(measuer.getTableName());
					if(measureSet==null){
						measureSet = new HashSet<HiveTableColumn>();
					}
					HiveTableColumn htc=new HiveTableColumn();
					htc.setColumnDesc(measuer.getRemarks());
					htc.setColumnName(measuer.getColumnName());
					htc.setDateType(measuer.getDataType());
					measureSet.add(htc);
					tableMap.put(measuer.getTableName(), measureSet);
					
					
					//hive事实表建模
					ColumnVo cv=new ColumnVo();
					cv.setColumnName(measuer.getTableName()+"_"+measuer.getColumnName());
					cv.setDataType(measuer.getDataType());
					cv.setColumnRemarks(measuer.getRemarks());
					cv.setType("2");
					factTable.getColumns().add(cv);
					
					syncFactTable.put(measuer.getTableName()+"_"+measuer.getColumnName(), measuer.getTableName()+"."+measuer.getColumnName());
					
					MeasureVo measuerForKylin =new MeasureVo();
					BeanUtils.copyProperties(measuer, measuerForKylin);
					measuerForKylin.setColumnName(measuer.getTableName()+"_"+measuer.getColumnName());
					measuerForKylin.setTableName(Constant.HIVE_ANALYSIS_DATABASE+"."+factTable.getTableName());
					modelForKylin.getMeasures().add(measuerForKylin);
					
					
					 
					
				}
				
				//hive定义维度表
				List<HiveTableVo> dimensionTables=new ArrayList<HiveTableVo>();
				List<DimensionVo> dimensions=modelVo.getDimensions();
				for(DimensionVo dimension:dimensions){
					Set<HiveTableColumn> dimensionSet=tableMap.get(dimension.getTableName());
					if(dimensionSet==null){
						dimensionSet = new HashSet<HiveTableColumn>();
					}
					HiveTableColumn htc=new HiveTableColumn();
					htc.setColumnDesc(dimension.getRemarks());
					htc.setColumnName(dimension.getColumnName());
					htc.setDateType(dimension.getDataType());
					dimensionSet.add(htc);
					tableMap.put(dimension.getTableName(),dimensionSet);
					//hive事实表建模
					ColumnVo cv=new ColumnVo();
					cv.setType("1");
					cv.setColumnName(dimension.getTableName()+"_"+dimension.getColumnName());
					cv.setDataType(dimension.getDataType());
					cv.setColumnRemarks(dimension.getRemarks());
					factTable.getColumns().add(cv);
					
					syncFactTable.put(dimension.getTableName()+"_"+dimension.getColumnName(),dimension.getTableName()+"."+dimension.getColumnName());
					
					//hive维度表赋值
					HiveTableVo htv=new HiveTableVo();
					String tableName="dim_"+HiveUtil.getUUID();
					htv.setTableName(tableName);
					htv.setTableRemarks(dimension.getRemarks());
					List<ColumnVo> columns=new ArrayList<ColumnVo>();
					ColumnVo column=new ColumnVo();
					column.setType("1");
					column.setColumnName(dimension.getTableName()+"_"+dimension.getColumnName());
					column.setColumnRemarks(dimension.getRemarks());
					column.setDataType(dimension.getDataType());
					columns.add(column);
					htv.setColumns(columns);
					dimensionTables.add(htv);
					//hive创建维度表
					this.creatTableInHive(htv);
					
					//同步数据
					syncDimension.put(tableName, dimension.getTableName()+";"+dimension.getColumnName());
					
					//维度表for kylin
					DimensionVo dimensionForKylin=new DimensionVo();
					BeanUtils.copyProperties(dimension, dimensionForKylin);
					 dimensionForKylin.setTableName(Constant.HIVE_ANALYSIS_DATABASE+"."+tableName);
					 dimensionForKylin.setColumnName(dimension.getTableName()+"_"+dimension.getColumnName());
					 modelForKylin.getDimensions().add(dimensionForKylin);
				}
				
				Set<String> tableSet=tableMap.keySet();

				for(String tableName :tableSet){
					HiveTable hiveTable=new HiveTable();
					hiveTable.setTableName(tableName);
					HiveTableVo htv=HiveUtil.getHiveTableVo(tableName);
					hiveTable.setTableDesc(htv.getTableRemarks());
					//oracle插入hivetable
					String tableId=this.insertHiveTable(hiveTable);
					hiveTableIds.add(tableId);
					tableNameMap.put(tableId, tableName);
					
					Set<HiveTableColumn> columnSet=tableMap.get(tableName);
					for(HiveTableColumn htc :columnSet){
						htc.setTableId(tableId);
						//oracle插入hiveTableColumn
						this.insertTableColumn(htc);
						columnAndTable.put(tableName+"_"+htc.getColumnName(), tableId);
					}
				}
				
				
				//hive生成事实表
				this.creatTableInHive(factTable);
				//给facttable增加数据库名称
				factTable.setTableName(factTable.getTableName());
				HiveTableVo factTableForKylin=new HiveTableVo();
				BeanUtils.copyProperties(factTable, factTableForKylin);
				factTableForKylin.setTableName(Constant.HIVE_ANALYSIS_DATABASE+"."+factTable.getTableName());
				modelForKylin.setFactTable(factTableForKylin);
				
				//kylin生成kylinTable
				//TODO 调用未涛接口
				String cubeId="";
				try {
					cubeId = kylinService.sendKylinRequest(modelForKylin);
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				
				List<RelationVo> relationList=modelVo.getRelations();
				for(RelationVo rv : relationList){
					HiveTableRelation hiveTableRelation=new HiveTableRelation();
					hiveTableRelation.setCubeId(cubeId);
					hiveTableRelation.setLeftColumn(rv.getLeftColumn());
					hiveTableRelation.setLeftTableId(rv.getLeftTableId());
					hiveTableRelation.setRelationType(rv.getRelationType());
					hiveTableRelation.setRightColumn(rv.getRightColumn());
					hiveTableRelation.setRigthTableId(rv.getRigthTableId());
					//oracle插入hiveTableRelation
					this.insertHiveTableRelation(hiveTableRelation);
				}
				//在cubeInfo中插入數據
				//TODO
				//保存hivetable
				KylinTable kylinTable =new KylinTable();
				kylinTable.setCubeId(cubeId);
				kylinTable.setTableName(factTable.getTableName());
				kylinTable.setTableDesc(factTable.getTableRemarks());
				kylinTable.setTableType("1");
				List<String> columnListSelect=new ArrayList<String>();
				List<String> columnListInsert=new ArrayList<String>();
				for(ColumnVo cv:factTable.getColumns()){
					columnListSelect.add(cv.getColumnName());
					columnListInsert.add(syncFactTable.get(cv.getColumnName()));
				}
				String sync="insert overwrite table "+Constant.HIVE_ANALYSIS_DATABASE+"."+factTable.getTableName()+ " select "
						+StringUtils.join(columnListInsert,",") +" from ";
				List<RelationVo> relations= modelVo.getRelations();
				StringBuffer relationSql = new StringBuffer();
				if(null == relations || relations.size() == 0)
				{
					relationSql.append(measures.get(0).getTableName());
				}
				else
				{
					for(int i=0;i<relations.size();i++)
					{
						RelationVo relationVo = relations.get(i);
						HiveTableRelation htr=new HiveTableRelation();
						if(i==0)
						{
							relationSql.append(Constant.HIVE_SOURCE_DATABASE).append(".").append(relationVo.getLeftTableId()).append(" ");
							relationSql.append(relationVo.getRelationType()).append(" ");
							relationSql.append(Constant.HIVE_SOURCE_DATABASE).append(".").append(relationVo.getRigthTableId()).append(" on ");
							relationSql.append(relationVo.getLeftTableId()).append(".").append(relationVo.getLeftColumn());
							relationSql.append(" = ").append(relationVo.getRigthTableId()).append(".").append(relationVo.getRightColumn());
						}
						else
						{
							relationSql.append(" ").append(relationVo.getRelationType()).append(" ");
							relationSql.append(Constant.HIVE_SOURCE_DATABASE).append(".").append(relationVo.getRigthTableId()).append(" on ");
							relationSql.append(relationVo.getLeftTableId()).append(".").append(relationVo.getLeftColumn());
							relationSql.append(" = ").append(relationVo.getRigthTableId()).append(".").append(relationVo.getRightColumn());
						}
						htr.setCubeId(cubeId);
						htr.setLeftColumn(relations.get(i).getLeftColumn());
						htr.setLeftTableId(relations.get(i).getLeftTableId());
						htr.setRelationType(relations.get(i).getRelationType());
						htr.setRightColumn(relations.get(i).getRightColumn());
						htr.setRigthTableId(relations.get(i).getRigthTableId());
						//保存关联关系
						this.insertHiveTableRelation(htr);
					}
				}
				kylinTable.setSyncSql((sync+relationSql.toString()).toLowerCase());
				String kylinTableId=this.insertKylinTable(kylinTable);

				for(HiveTableVo htv:dimensionTables){
					KylinTable kylinTable_dim =new KylinTable();
					kylinTable_dim.setCubeId(cubeId);
					kylinTable_dim.setTableDesc(htv.getTableRemarks());
					kylinTable_dim.setTableName(htv.getTableName());
					String[] column=syncDimension.get(htv.getTableName()).split(";");
					//同步sql
					String sql="insert overwrite table " + Constant.HIVE_ANALYSIS_DATABASE+"." + 
					htv.getTableName() + " select distinct "+column[1]+" from "+ Constant.HIVE_SOURCE_DATABASE+ "." + column[0];
					kylinTable_dim.setSyncSql(sql.toLowerCase());
					kylinTable_dim.setTableType("2");
					String kylinTableId_dim=this.insertKylinTable(kylinTable_dim);
					
					for(ColumnVo cv:htv.getColumns()){
						KylinTableColumn ktc=new KylinTableColumn();
						ktc.setColumnDesc(cv.getColumnRemarks());
						ktc.setColumnName(cv.getColumnName());
						ktc.setColumnSource(columnAndTable.get(cv.getColumnName()));
						ktc.setDateType(cv.getDataType());
						ktc.setColumnType(cv.getType());
						ktc.setTableId(kylinTableId_dim);
						this.insertKylinTableColumn(ktc);
					}
				}
				
				for(ColumnVo cv:factTable.getColumns()){
					KylinTableColumn ktc=new KylinTableColumn();
					ktc.setColumnDesc(cv.getColumnRemarks());
					ktc.setColumnName(cv.getColumnName());
					ktc.setColumnSource(columnAndTable.get(cv.getColumnName()));
					ktc.setDateType(cv.getDataType());
					ktc.setColumnType(cv.getType());
					ktc.setTableId(kylinTableId);
					//生成kylinTableColumn
					this.insertKylinTableColumn(ktc);
				}
				//TODO
				//執行同步sql后 同步接口
				CubeVo cubeinfo=new CubeVo();
					cubeinfo.setCubeId(cubeId);
					cubeinfo.setCubeName("CUBE_"+modelForKylin.getFactTable().getTableName().replaceAll(Constant.HIVE_ANALYSIS_DATABASE+".", "").toUpperCase());
					cubeinfo.setCubeNameCn(modelForKylin.getModelName());
					cubeinfo.setCubeDescription(modelForKylin.getModelDesc());
					cubeinfo.setCubeDate(new Date());
					cubeinfo.setCubeStatus("0");//默认为隐藏
					cubeinfo.setSyncRule(modelVo.getSyncPolicy());
					cubeinfo.setSyncStatus(new Long(SyncStatus.REDAY_EXEC));
					cubeService.insertCube(cubeinfo);
				//kylinCubeService.buildCube("CUBE_"+modelVo.getFactTable().getTableName().replaceAll("default.", "").toUpperCase());
				
			return modelForKylin;
				
				
	}
	
	public ModelVo myDataModelDetail(String cubeId){

		ModelVo mv=new ModelVo();
		HiveTableVo factTable=new HiveTableVo();
		List<KylinTable> kylinTables=this.findKylinTableByCubeId(cubeId);
		List<String> ids=new ArrayList<String>();
		Set<String> tableIds=new HashSet<String>(); 
		Map<String,String> tableMap=new HashMap<String,String>();
		for(KylinTable kt:kylinTables){
			tableMap.put(kt.getTableId(), kt.getTableName());
			//如果为1 说明是事实表
			if("1".equals(kt.getTableType())){
				ids.add(kt.getTableId());
				factTable.setTableName(kt.getTableName());
				mv.setModelDesc(kt.getTableDesc());
			}
		}
		List<KylinTableColumn> kylinTableColumns=this.findHiveTableColumnByTableId(ids);
		
		for(KylinTableColumn ktc :kylinTableColumns){
			tableIds.add(ktc.getColumnSource());
		}
		List<HiveTable> hiveTables=this.findHiveTableByTableId(tableIds);
		for(HiveTable ht:hiveTables){
			tableMap.put(ht.getTableId(), ht.getTableName());
		}
		
		for(KylinTableColumn ktc :kylinTableColumns){
			//1表示维度
			if("1".equals(ktc.getColumnType())){
				DimensionVo dim=new DimensionVo();
				dim.setColumnName(ktc.getColumnName());
				dim.setDataType(ktc.getDateType());
				dim.setRemarks(ktc.getColumnDesc());
				dim.setTableName(tableMap.get(ktc.getColumnSource()));
				mv.getDimensions().add(dim);
			}else{
				//度量
				MeasureVo mea=new MeasureVo();
				mea.setColumnName(ktc.getColumnName());
				mea.setDataType(ktc.getDateType());
				mea.setComputationRules(ktc.getComputationRules());
				mea.setRemarks(ktc.getColumnDesc());
				mea.setTableName(tableMap.get(ktc.getColumnSource()));
				mv.getMeasures().add(mea);
			}
		}
		//事实表
		mv.setFactTable(factTable);
		//关系
		List<RelationVo> relations=this.findHiveTableRelationVoByCubeId(cubeId);
		for(RelationVo rv:relations){
//			rv.setLeftTableId(tableMap.get(rv.getLeftTableId()));
//			rv.setRigthTableId(tableMap.get(rv.getRigthTableId()));
		}
		mv.setRelations(relations);
		
		return mv;
	
	}

	public PageInfoVo<ModelVo> myDataModel(PageVo pageVo,String modelName, Boolean isShow) {
		String order = pageVo.getOrder();
		order = "rownum";
		PageHelper.startPage(pageVo.getPage(), pageVo.getRows(), order);
		List<ModelVo> list = hiveMapperdao.queryDataModel(modelName,isShow);
		PageInfo<ModelVo> info = new PageInfo<ModelVo>(list);
		PageInfoVo<ModelVo> cubePage = new PageInfoVo<ModelVo>(info.getList(), list);
		return cubePage;
	}
	
	//数据模型新增
	public  List<DataSourceTable> myDataModelAdd() {
		List<DataSourceTable> dataSourceTableList = hiveMapperdao.querydataSourceTable();
		return dataSourceTableList;
	}
	
	public List<DataSourceTable> DataSourceTableSearch(String tableName, List<DataSourceTable> dataSourceTableList) {
		List<DataSourceTable>  selectedTableList = new ArrayList<DataSourceTable>();
		for(DataSourceTable DataSourceTable :dataSourceTableList){
			if(DataSourceTable.getTableName().contains(tableName)){
				selectedTableList.add(DataSourceTable);
			}
		}
		return selectedTableList;
		
	}
	
	

	
}
