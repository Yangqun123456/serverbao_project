package jap;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import com.alibaba.fastjson.JSON;
import com.jusfoun.Application;
import com.jusfoun.jap.hive.domain.HiveTable;
import com.jusfoun.jap.hive.domain.HiveTableRelation;
import com.jusfoun.jap.hive.domain.KylinTable;
import com.jusfoun.jap.hive.domain.KylinTableColumn;
import com.jusfoun.jap.hive.service.HiveService;
import com.jusfoun.jap.hive.util.HiveUtil;
import com.jusfoun.jap.hive.vo.ColumnVo;
import com.jusfoun.jap.hive.vo.DimensionVo;
import com.jusfoun.jap.hive.vo.HiveTableVo;
import com.jusfoun.jap.hive.vo.MeasureVo;
import com.jusfoun.jap.hive.vo.ModelVo;
import com.jusfoun.jap.hive.vo.RelationVo;
import com.jusfoun.jap.kylin.service.KylinService;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = Application.class)
@WebAppConfiguration
public class HiveTest {
	@Autowired
	HiveService hiveService;
	@Autowired
	KylinService kylinService;
	@Test
	public void test(){
		ModelVo modelVo=new ModelVo();
		List<DimensionVo> dimensions=new ArrayList<DimensionVo>();
		DimensionVo dim=new DimensionVo();
		dim.setColumnName("customtype");
		dim.setDataType("string");
		dim.setRemarks("客户类型");
		dim.setTableName("orderTable");
		dimensions.add(dim);
		DimensionVo dim2=new DimensionVo();
		dim2.setColumnName("time");
		dim2.setDataType("string");
		dim2.setRemarks("时间");
		dim2.setTableName("timeTable");
		dimensions.add(dim2);
		DimensionVo dim3=new DimensionVo();
		dim3.setColumnName("ordertype");
		dim3.setDataType("string");
		dim3.setRemarks("订单类型");
		dim3.setTableName("orderTable");
		dimensions.add(dim3);
		modelVo.setDimensions(dimensions);
		List<MeasureVo> measures=new ArrayList<MeasureVo>();
		MeasureVo mea=new MeasureVo();
		mea.setColumnName("money");
		mea.setComputationRules("sum");
		mea.setDataType("string");
		mea.setRemarks("金钱度量");
		mea.setTableName("moneyTable");
		measures.add(mea);
//		MeasureVo mea2=new MeasureVo();
//		mea2.setColumnName("total");
//		mea2.setComputationRules("sum");
//		mea2.setDataType("string");
//		mea2.setRemarks("数量度量");
//		mea2.setTableName("time_table");
//		measures.add(mea2);
		modelVo.setMeasures(measures);
		modelVo.setModelDesc("zhanghao_order");
		modelVo.setModelName("zhanghao_order");
//		modelVo.setRelations(relations);
//		modelVo.setSyncPolicy("每5分钟");
		try {
			kylinService.sendKylinRequest(hiveService.generateModel(modelVo));
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
//	@Test
	public void createHive(){
		HiveTableVo vo=new HiveTableVo();
		vo.setTableName("hivetable");
		vo.setTableRemarks("张浩的第一张hive表");
		List<ColumnVo> columns=new ArrayList<ColumnVo>();
		ColumnVo cv1=new ColumnVo();
		cv1.setColumnName("column1");
		cv1.setColumnRemarks("字段1");
		cv1.setDataType("String");
		columns.add(cv1);
		ColumnVo cv2=new ColumnVo();
		cv2.setColumnName("column2");
		cv2.setColumnRemarks("字段2");
		cv2.setDataType("String");
		columns.add(cv2);
		vo.setColumns(columns);
		hiveService.creatTableInHive(vo);
	}
	
//	@Test
	public void getHiveList(){
//		for(HiveTableVo vo: HiveUtil.listHiveTableVoList("fact_water_quality_change")){
//			System.out.println(JSON.toJSON(vo));
//		}
		
	}
	
//	@Test
	public void getHive(){
		List<RelationVo> list=hiveService.findHiveTableRelationVoByCubeId("1");
		System.out.println(JSON.toJSON(list.get(0)));
		
	}
	
	public void showModelDetail(){
		String cubeId="1";
		ModelVo mv=new ModelVo();
		HiveTableVo factTable=new HiveTableVo();
		List<KylinTable> kylinTables=hiveService.findKylinTableByCubeId(cubeId);
		List<String> ids=new ArrayList<String>();
		Set<String> tableIds=new HashSet<String>(); 
		Map<String,String> tableMap=new HashMap<String,String>();
		for(KylinTable kt:kylinTables){
			ids.add(kt.getTableId());
			tableMap.put(kt.getTableId(), kt.getTableName());
			//如果为1 说明是事实表
			if("1".equals(kt.getTableType())){
				factTable.setTableName(kt.getTableName());
				mv.setModelDesc(kt.getTableDesc());
//				mv.setSyncPolicy(kt.getSyncPolicy());
			}
		}
		List<KylinTableColumn> kylinTableColumns=hiveService.findHiveTableColumnByTableId(ids);
		
		for(KylinTableColumn ktc :kylinTableColumns){
			tableIds.add(ktc.getColumnSource());
		}
		List<HiveTable> hiveTables=hiveService.findHiveTableByTableId(tableIds);
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
			}
		}
		//事实表
		mv.setFactTable(factTable);
		//关系
		List<RelationVo> relations=hiveService.findHiveTableRelationVoByCubeId(cubeId);
		mv.setRelations(relations);
		
		
	}
	
	
	

}
