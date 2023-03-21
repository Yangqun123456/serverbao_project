package com.jusfoun.jap.hive.util;

import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;

import com.jusfoun.jap.hive.vo.ColumnVo;
import com.jusfoun.jap.hive.vo.HiveTableVo;
import com.jusfoun.jap.util.Constant;
import com.jusfoun.jap.util.hive.JDBCToHiveUtils;

public class HiveUtil {

	private transient static Logger LOG = LoggerFactory.getLogger(HiveUtil.class);
	
	public static boolean executSql(String url,String sql) throws Exception
	{
		boolean flag = false;
		try {
			Connection conn = JDBCToHiveUtils.getConnnection(url);
			PreparedStatement ps = JDBCToHiveUtils.prepare(conn, sql);
			flag = ps.execute();
		} catch (SQLException e) {
			LOG.error("HiveUtil.executSql url=[" + url + "],sql=["+sql+"]");
			LOG.error(e.getMessage(), e);
			throw e;
		}
		return flag;
	}
	/**
	 * 获得表的comment注释
	 * 
	 * @param tableName
	 * @return
	 * @throws SQLException
	 */
	private static String getTableRemarks(String tableName)  {
		Connection conn = JDBCToHiveUtils.getConnnection(Constant.HIVE_URL+Constant.HIVE_ANALYSIS_DATABASE);
		String remarks = "";
		ResultSet rs=null;
		DatabaseMetaData dmd;
		try {
			dmd = conn.getMetaData();
		
		// String schema = pros.get("user").toString();
		// rs = metaData.getTables(null, schema, null, new
		// String[]{"TABLE","VIEW"});
		 rs = dmd.getTables(null, Constant.HIVE_ANALYSIS_DATABASE, tableName, new String[] { "TABLE" });
		while (rs.next()) {
			remarks = rs.getString("remarks");
		}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}finally{
			JDBCToHiveUtils.closeConnection(conn, null, rs);
		}
	
		return remarks;
	}

	public static List<ColumnVo> getColumnInfo(String tableName) {
		Connection conn = JDBCToHiveUtils.getConnnection(Constant.HIVE_URL+Constant.HIVE_SOURCE_DATABASE);
		List<ColumnVo> list = new ArrayList<ColumnVo>();
		DatabaseMetaData dmd = null;
		ResultSet rs = null;
		String strJavaBean = "";
		try {
			dmd = conn.getMetaData();
			rs = dmd.getColumns(null, Constant.HIVE_SOURCE_DATABASE, tableName, null);
			Map map = new HashMap();
			while (rs.next()) {
				String columnName = rs.getString("COLUMN_NAME");// 列名
				// String dataType =
				// rs.getString("DATA_TYPE");//字段数据类型(对应java.sql.Types中的常量)
				String typeName = rs.getString("TYPE_NAME");// 字段类型名称(例如：VACHAR2)
				String remarks = rs.getString("REMARKS");// 注释
				ColumnVo columnVo = new ColumnVo();
				columnVo.setColumnName(columnName);
				columnVo.setColumnRemarks(remarks);
				columnVo.setDataType(typeName);
				list.add(columnVo);
			}

		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			JDBCToHiveUtils.closeConnection(conn, null, rs);
		}
		return list;
	}

	public static HiveTableVo getHiveTableVo(String tableName) {
		HiveTableVo hiveTableVo = new HiveTableVo();
		hiveTableVo.setTableName(tableName);
		hiveTableVo.setTableRemarks(getTableRemarks(tableName));
//		hiveTableVo.setColumns(getColumnInfo(tableName));
		return hiveTableVo;
	}

	public static String getUUID() {
		return UUID.randomUUID().toString().replace("-", "");
	}
	
	public static List<HiveTableVo> listHiveTableVoList(String tableName){
		if(StringUtils.isEmpty(tableName)){
			tableName="%";
		}else{
			tableName="%"+tableName+"%";
		}
		List<HiveTableVo> list =new ArrayList<HiveTableVo>();
		Connection conn = JDBCToHiveUtils.getConnnection(Constant.HIVE_URL+Constant.HIVE_SOURCE_DATABASE);
		ResultSet rs=null;
		DatabaseMetaData dmd;
		try {
			dmd = conn.getMetaData();
		
		// String schema = pros.get("user").toString();
		// rs = metaData.getTables(null, schema, null, new
		// String[]{"TABLE","VIEW"});
//		 rs = dmd.getTables(null, "%", tableName, new String[] { "TABLE" });
			rs = dmd.getTables(null, Constant.HIVE_SOURCE_DATABASE, tableName, new String[] { "TABLE" });
		while (rs.next()) {
			HiveTableVo htv=new HiveTableVo();
			String name=rs.getString("table_name");
			String remarks = rs.getString("remarks");
//			System.out.println(rs.getString("table_schem"));
			htv.setTableName(name);
			htv.setTableRemarks(remarks);
//			htv.setColumns(getColumnInfo(tableName));
			list.add(htv);
		}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}finally{
			JDBCToHiveUtils.closeConnection(conn, null, rs);
		}
		return list;
		
	}
}
