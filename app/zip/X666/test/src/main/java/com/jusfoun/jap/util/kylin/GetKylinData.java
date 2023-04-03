/**
 * 
 */
package com.jusfoun.jap.util.kylin;

import java.io.FileOutputStream;
import java.io.IOException;
import java.lang.reflect.Method;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import javax.servlet.ServletContext;

import org.apache.commons.lang.StringUtils;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import org.apache.kylin.jdbc.Driver;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRichTextString;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.itmuch.core.web.converter.Result;
import com.jusfoun.jap.common.Results;
import com.jusfoun.jap.workTable.vo.ChartData;
import com.jusfoun.jap.workTable.vo.DataY;
import com.jusfoun.jap.workTable.vo.WorkTableDetail;

/**   
 * 此类描述的是：   从kylin获取数据
 * @author: 王存泉   
 * @version: 2016年6月3日 下午7:05:07    
 */

public class GetKylinData {
	public String  getData(String sql,String kylinUrl,String kylinUsername,String kylinPassword) throws SQLException, JSONException {
		Properties info = new Properties();
		Driver driver = null;
		try {
			driver = (Driver) Class.forName("org.apache.kylin.jdbc.Driver").newInstance();
		} catch (InstantiationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		info.put("user", kylinUsername);
		info.put("password", kylinPassword);
		Connection conn = driver.connect(kylinUrl, info);
		Statement state = conn.createStatement();
		ResultSet resultSet = state.executeQuery(sql);
		String result = "";
		result = resultSetToJson(resultSet);
		conn.close();
		state.close();
		return result;
	}
	public static List  getDataBean(StringBuffer sb,String kylinUrl,String kylinUsername,String kylinPassword,Class  cls) throws Exception {
		Properties info = new Properties();
		Driver driver = null;
		try {
			driver = (Driver) Class.forName("org.apache.kylin.jdbc.Driver").newInstance();
		} catch (InstantiationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		info.put("user", kylinUsername);
		info.put("password", kylinPassword);
		Connection conn = driver.connect(kylinUrl, info);
		Statement state = conn.createStatement();
		ResultSet resultSet = state.executeQuery(sb.toString());
		List resultList = new ArrayList();
		resultList = resultSetToList(resultSet,cls);
		conn.close();
		state.close();
		return resultList;
	}
	public static List resultSetToList(ResultSet rs, Class cls)throws Exception {  
        //取得Method   
        Method[] methods = cls.getDeclaredMethods();   
//       System.out.println(methods[0].getName());  
        List lst = new ArrayList();  
        // 用于获取列数、或者列类型  
        ResultSetMetaData meta = rs.getMetaData();  
        Object obj = null;  
        while (rs.next()) {  
            // 获取formbean实例对象  
            obj = cls.newInstance(); // 用Class.forName方法实例化对象和new创建实例化对象是有很大区别的，它要求JVM首先从类加载器中查找类，然后再实例化，并且能执行类中的静态方法。而new仅仅是新建一个对象实例  
            // 循环获取指定行的每一列的信息  
            for (int i = 1; i <= meta.getColumnCount(); i++) {  
                // 当前列名  
                String colName = meta.getColumnLabel(i);  
//                System.out.println("getColumnLabel结果为："+colName);
//                String colNames = meta.getColumnName(i);  //驼峰转化
//                String colName = camelName(colNames);
//               System.out.println("驼峰转化结果为："+colName);
                // 设置方法名  
                String setMethodName = "set" + colName;  
                    
                  
                 //遍历Method   
                for (int j = 0; j < methods.length; j++) {   
                    if (methods[j].getName().equalsIgnoreCase(setMethodName)) {   
                        setMethodName = methods[j].getName();   
                          
//                        System.out.println(setMethodName);  
                        // 获取当前位置的值，返回Object类型  
                        Object value = rs.getObject(colName);   
                        if(value == null){  
                        	value="";  
                        }  
                        //实行Set方法   
                        try {   
                            //// 利用反射获取对象  
                            //JavaBean内部属性和ResultSet中一致时候   
                            Method setMethod = obj.getClass().getMethod(   
                                    setMethodName, value.getClass());   
//                            Method setMethod = cls.getDeclaredMethod(StringHelper
//                                    .asserSetMethodName(StringHelper
//                                            .toJavaAttributeName(setMethodName)), String.class);   
                            setMethod.invoke(obj, value);   
                        } catch (Exception e) {   
                            //JavaBean内部属性和ResultSet中不一致时候，使用String来输入值。   
                           e.printStackTrace();  
                        }   
                    }   
                }   
            }  
            lst.add(obj);  
        }  
        return lst;  
} 
	public static  String resultSetToJson(ResultSet rs) throws SQLException,JSONException  
	{  
	   // json数组  
	   JSONArray array = new JSONArray();  
	    
	   // 获取列数  
	   ResultSetMetaData metaData = rs.getMetaData();  
	   int columnCount = metaData.getColumnCount();  
	    
	   // 遍历ResultSet中的每条数据  
	    while (rs.next()) {  
	        JSONObject jsonObj = new JSONObject();  
	         
	        // 遍历每一列  
	        for (int i = 1; i <= columnCount; i++) {  
	            String columnName =metaData.getColumnLabel(i);  
	            String value = rs.getString(columnName);  
	            if(value==null){
	            	value="";
	            }
	            jsonObj.put(columnName, value);  
	        }   
	        array.put(jsonObj);   
	    }  
	    
	   return array.toString();  
	}  
	public static  String resultSetToJson(ResultSet rs, List<String> dimSort, List<String> measureDuLiangName, List<String> measureDanWei) throws SQLException,JSONException  
	{  
	   // json数组  
	   JSONArray array = new JSONArray();  
	   JSONArray array1 = new JSONArray();
	   // 获取列数  
	   ResultSetMetaData metaData = rs.getMetaData();  
	   int columnCount = metaData.getColumnCount();  
	    
	   // 遍历ResultSet中的每条数据  
	    while (rs.next()) {  
	        JSONObject jsonObj = new JSONObject();  
	        array = new JSONArray();
	        // 遍历每一列  
	        for (int i = 1; i <= columnCount; i++) {
	        	jsonObj = new JSONObject();
	            String columnName =metaData.getColumnLabel(i);  
	            String value = rs.getString(columnName)==null?"未知":rs.getString(columnName);  
	            if(value==null){
	            	value="";
	            }
	            jsonObj.put("columnName", columnName);  
	            jsonObj.put("value", value); 
	            if(dimSort.size()>=i){
	            	jsonObj.put("columnNameCn", dimSort.get(i-1));
	            }else {
	            	jsonObj.put("columnNameCn", measureDuLiangName.get(i-dimSort.size()-1));
	            	jsonObj.put("unit", measureDanWei.get(i-dimSort.size()-1));
	            }
	            array.put(jsonObj);
	        } 
	        array1.put(array);
	    }  
	    
	   return array1.toString();
	}  
	
	
	public static Results  getMultidimenDataResult (StringBuffer maxAndMinSql,String dataType,List<String> measureDuLiangName,List<WorkTableDetail> measuresList, List<String> dimSort,List<String> measureDanWei,int dimSize,StringBuffer sb,String kylinUrl,String kylinUsername,String kylinPassword) throws SQLException, JSONException {
		Properties info = new Properties();
		Driver driver = null;
		try {
			driver = (Driver) Class.forName("org.apache.kylin.jdbc.Driver").newInstance();
		} catch (InstantiationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		info.put("user", kylinUsername);
		info.put("password", kylinPassword);
		Connection conn = driver.connect(kylinUrl, info);
		Statement state = conn.createStatement();
		ResultSet rsmaxAndMin = state.executeQuery(maxAndMinSql.toString());
		List<String> minY = new ArrayList<String>();//最小度量值合集
		List<String> maxY = new ArrayList<String>();//最大度量值合集
		if(rsmaxAndMin.next()){
			for(int mm=1;mm<=rsmaxAndMin.getMetaData().getColumnCount();mm++){
				int mo = (mm-1)%2;
				int dex = (mm-1)/2;
				if(mo==0){//最大值
					maxY.add(dex, rsmaxAndMin.getString(mm));
				}else minY.add(dex, rsmaxAndMin.getString(mm));
			}
		}
		conn.close();
		state.close();
		conn = driver.connect(kylinUrl, info);
		state = conn.createStatement();
		ResultSet rs = state.executeQuery(sb.toString());
		Results result = new Results();
        if(dataType.equals("table")){//表格
        	result.setData(resultSetToJson(rs,dimSort,measureDuLiangName,measureDanWei));
        } else if ("mixTwoDim".equals(dataType)||"mixTowDimLine".equals(dataType)){//两维多曲线 或者两维面积图
        	result.setData(resultSetToDD(rs,dimSort,measuresList,measureDuLiangName,measureDanWei));
        } else if ("mixTwoMeasure".equals(dataType)){//两度量
        	result.setData(resultSetToDM(rs,dimSort,measuresList,measureDuLiangName,measureDanWei));
        }else if ("mixTwoMeasureTwoY".equals(dataType)){//两度量双Y轴
        	result.setData(resultSetToDM(rs,dimSort,measuresList,measureDuLiangName,measureDanWei));
        }else {//多维图形
        	result = resltsetToPic( maxY, minY, rs,dimSize,dimSort,dataType, measureDuLiangName,measureDanWei);
        }
        	
		conn.close();
		state.close();
		return result;
	}
	private static ChartData resultSetToDM(ResultSet rs, List<String> dimSort, List<WorkTableDetail> measuresList,
			List<String> measureDuLiangName, List<String> measureDanWei) throws SQLException {
		ChartData returnChartData = new ChartData();
		List<String> dataX = new ArrayList<String>();
		List<String> datay1 = new ArrayList<String>();
		List<String> datay2 = new ArrayList<String>();
		DataY DataY1 = new DataY();
		DataY DataY2 = new DataY();
		List<DataY> dataY = new ArrayList<DataY>();
	    while (rs.next()) {
	    	dataX.add(rs.getString(1));
	    	datay1.add(rs.getString(measuresList.get(0).getTableColumn()));
	    	datay2.add(rs.getString(measuresList.get(1).getTableColumn()));
	    }
	    DataY1.setData_y(datay1);
	    DataY1.setNameDuliang(measureDuLiangName.get(0));
	    DataY1.setChartType(measuresList.get(0).getChartType());
	    DataY1.setUnitDuliang(measureDanWei.get(0));
	    DataY2.setData_y(datay2);
	    DataY2.setNameDuliang(measureDuLiangName.get(1));
	    DataY2.setChartType(measuresList.get(1).getChartType());
	    DataY2.setUnitDuliang(measureDanWei.get(1));
	    dataY.add(DataY1);
	    dataY.add(DataY2);
	    returnChartData.setDataY(dataY);
	    returnChartData.setNameWeidu(dimSort.get(0));
	    returnChartData.setDataX(dataX);
	    return returnChartData;
	}
	private static ChartData resultSetToDD(ResultSet rs, List<String> dimSort, List<WorkTableDetail> measuresList, List<String> measureDuLiangName,
			List<String> measureDanWei) throws SQLException{
			ChartData returnChartData = new ChartData();
			List<DataY> dataY = new ArrayList<DataY>();
			String dataType = measuresList.get(0).getChartType();
			DataY DataY = new DataY();
			List<String> datay = new ArrayList<String>();
			List<String> dataX = new ArrayList<String>();
			String firstDV = "";//第一维度的值用来比较当前的值是否改变；
			String secDv = "";
		   returnChartData.setNameWeidu(dimSort.get(1));//第二维度的名称
		   // 遍历ResultSet中的每条数据  
		    while (rs.next()) {  
		        if("".equals(firstDV)||firstDV.equals(rs.getString(1))){//第一行或者相等
		        	
		        	if("".equals(firstDV)){
		        		firstDV = rs.getString(1);
			        	DataY = new DataY();
			        	DataY.setNameDuliang(rs.getString(1));
			        	DataY.setChartType(dataType);
			        	DataY.setUnitDuliang(measureDanWei.get(0));
						datay = new ArrayList<String>();
			        }
		        	//dataX.add(rs.getString(2));
		        }else if(!firstDV.equals(rs.getString(1))){//不是第一行且或者是第一纬度值更改dataY需要新加datay数组
		        	firstDV = rs.getString(1);
		        	for(int i=datay.size();i<dataX.size();i++){
	        			datay.add(null);
	        		}
		        	DataY.setData_y(datay);
		        	dataY.add(DataY);
		        	DataY = new DataY();
		        	DataY.setChartType(dataType);
		        	DataY.setNameDuliang(rs.getString(1));
		        	DataY.setUnitDuliang(measureDanWei.get(0));
					datay = new ArrayList<String>();
		        }

	        	secDv = rs.getString(2);
	        	if(dataX.contains(secDv)){//包含该值
	        		if(datay.size()==dataX.indexOf(secDv)){//位置相同
	        			datay.add(rs.getString(3));
	        		}else if(datay.size()<dataX.indexOf(secDv)){//
	        			for(int i=0;i<dataX.indexOf(secDv)-datay.size();i++){//位置在后面
	        				datay.add(null);
	        			}
	        			datay.add(rs.getString(3));
	        		}else{//位置在前面
	        			datay.set(dataX.indexOf(secDv), rs.getString(3));
	        		}
	        	}else{//不包含该值1直接将该值添加至dataX，datay最后位置2.之前的datay要加null
	        		for(int i=datay.size();i<dataX.size();i++){
	        			datay.add(null);
	        		}
	        		datay.add(rs.getString(3));
	        		dataX.add(secDv);
	        		if(dataY!=null&&dataY.size()>0){
	        			for(DataY dy:dataY){
	        				dy.getData_y().add(null);
	        			}
	        		}
	        	}
		    }
		    //循环结束没有比较的行，将最后的列添加进来
		    for(int i=datay.size();i<dataX.size();i++){
    			datay.add(null);
    		}
		    DataY.setData_y(datay);
        	dataY.add(DataY);
		    returnChartData.setDataX(dataX);
        	returnChartData.setDataY(dataY);
        	return returnChartData;
	}
	public static Results resltsetToPic(List<String> maxY,List<String> minY,ResultSet rs,int dimSize,List<String> dimSort,String dataType,List<String> measureDuLiangName,List<String> measureDanWei) throws SQLException {
		Results result = new Results();
		ResultSetMetaData metaData = rs.getMetaData();  
		int columnCount = metaData.getColumnCount();//总共的列数量
		List<String> dataX = new ArrayList<String>();
		List<DataY> dataYs = new ArrayList<DataY>();
		DataY dataY = new DataY(); 
		if(dimSize==1){//维度只有1的时候
			ChartData chartData = new ChartData();
			List<ChartData> chartOneList = new ArrayList<ChartData>();
			int FirstFlag = 0;
			while (rs.next()) {
				FirstFlag++;
				//一维只需要直接拼接就可以
				String dataXNow = rs.getString(1);
				dataX.add(dataXNow);
				if(FirstFlag==1){//只有第一次的时候才会记录临时变量，第二个开始就需要判断当前和上次有没有变化来决定是否重新取值
					chartData.setNameWeidu(dimSort.get(0));//一维只需要赋值一次  维度名称 即大类名称
					for(int i = (1+dimSize);i <= columnCount;i++){//一维度量从第二列开始
						List<String> data_y = new ArrayList<String>();
						dataY = new DataY();
						dataY.setDataType(dataType);
						dataY.setNameDuliang(measureDuLiangName.get(i-dimSize-1));
						dataY.setUnitDuliang(measureDanWei.get(i-dimSize-1));
						data_y.add(rs.getString(i)==null?"未知":rs.getString(i));
						dataY.setData_y(data_y);
						dataYs.add(dataY);
					}
				}else{
					for(int i = (1+dimSize);i <= columnCount;i++){//取度量从第二列开始
						List<String> data_y = new ArrayList<String>();
						dataY = dataYs.get(i-1-dimSize);//数组是从0个开始需要减去维度个数
						data_y = dataY.getData_y();
						String value = rs.getString(i)==null?"未知":rs.getString(i);
						data_y.add(value);//减1是减去维度的个数
					}
				}
			}
			chartData.setDataY(dataYs);
			chartData.setDataX(dataX);
			chartOneList.add(chartData);
			result.setData(chartOneList);
		}
		if(dimSize>1){
			ChartData[] remarkCD = new ChartData[dimSize+1];//记录每层的对象，当发生改变时将该层及以后的放到前一层记录中，第一个位置存放虚拟的公共父级对象，用于将后面的数据添加进来
			List<List<ChartData>>  returnData = new ArrayList<List<ChartData>>();//
			String [] remarkDV = new String [dimSize-1];//记录每层维度的值，用来和下一层对比
			for(int i=0;i<dimSize+1;i++){
				remarkCD[i] = new ChartData();
				returnData.add(i, new ArrayList<ChartData>());
			}
			while (rs.next()) {
				for(int i = 1;i<=columnCount;i++){
					if(i<dimSize){//前面的维度层
						if(remarkDV[i-1]==null||remarkDV[i-1]==""||rs.getString(i) ==remarkDV[i-1]||(rs.getString(i)==null?("未知").equals(remarkDV[i-1]):rs.getString(i).equals(remarkDV[i-1]))){//第一行数据，数组是空的。值相同
							remarkDV[i-1] = rs.getString(i)==null?"未知":rs.getString(i);
							remarkCD[i].setNameWeidu(dimSort.get(i-1));
							remarkCD[i].setValueName(rs.getString(i)==null?"未知":rs.getString(i));
						}else{//当前维度层值发生变化
							for(int iBack=dimSize;iBack>=i;iBack-- ){//逐层回收到上层数据
								ChartData ChartData = new ChartData();
								ChartData = remarkCD[iBack];
								ChartData.setData(null);
								returnData.get(iBack).add(ChartData);
								remarkCD[iBack-1].setColspan(remarkCD[iBack-1].getColspan()+remarkCD[iBack].getColspan());//将下级占的列加到自己上
								List<ChartData> listdatax = remarkCD[iBack-1].getData();
								if(listdatax == null){
									listdatax = new ArrayList<ChartData>();
								}
								listdatax.add(remarkCD[iBack]);
								remarkCD[iBack-1].setData(listdatax);
								if(iBack<dimSize){
									remarkDV[iBack-1] = rs.getString(iBack)==null?"未知":rs.getString(iBack);//将用来对比维度值得数组置空
								}
								remarkCD[iBack] = new ChartData();//被回收的位置的对象改为新的对象
							}
							//第一个发生改变的位置的对象及对比值置为当前值
							remarkCD[i].setNameWeidu(dimSort.get(i-1));
							remarkCD[i].setValueName(rs.getString(i)==null?"未知":rs.getString(i));
						}
					}else if(i==dimSize){//后面的数据层（一个datax）
						remarkCD[i].setColspan(1);
						remarkCD[i].setNameWeidu(dimSort.get(i-1));
						List xList = remarkCD[dimSize].getDataX();//存放x数据集
						if(xList==null){
							xList = new ArrayList();
						}
						xList.add(rs.getString(i)==null?"未知":rs.getString(i));
						remarkCD[dimSize].setDataX(xList);
					}else{//后面的数据层（一个或多个datay）
						List<DataY> yList = remarkCD[dimSize].getDataY();//存放y数据集
						if(yList==null){
							yList = new ArrayList<DataY>();
						}
						if(yList.size()<i-dimSize){//第一次添加该度量的值
							DataY datay = new DataY();
							datay.setDataType(dataType);
							datay.setNameDuliang(measureDuLiangName.get(i-dimSize-1));
							datay.setUnitDuliang(measureDanWei.get(i-dimSize-1));
							List<String> data_y = datay.getData_y();
							if(data_y==null){
								data_y=new ArrayList<String>();
							}
							data_y.add(rs.getString(i)==null?"未知":rs.getString(i));
							datay.setData_y(data_y);
							datay.setMinY(minY.get(i-dimSize-1));
							datay.setMaxY(maxY.get(i-dimSize-1));
							yList.add(datay);
							remarkCD[dimSize].setDataY(yList);
						}else{//之前插入过该度量的值
							DataY datay = yList.get(i-dimSize-1);
							List<String> data_y = datay.getData_y();
							data_y.add(rs.getString(i)==null?"未知":rs.getString(i));
							datay.setData_y(data_y);
						}
					}
				}
			}
			for(int iBack=dimSize;iBack>=1;iBack-- ){//逐层回收到上层数据*最后的数据没有后面的维度值与之对比所以自动将不为空的对象回收
				List<ChartData> listdatax = remarkCD[iBack-1].getData();
				ChartData ChartData = new ChartData();
				ChartData = remarkCD[iBack];
				ChartData.setData(null);
				returnData.get(iBack).add(ChartData);
				remarkCD[iBack-1].setColspan(remarkCD[iBack-1].getColspan()+remarkCD[iBack].getColspan());//将下级占的列加到自己上
				if(listdatax == null){
					listdatax = new ArrayList<ChartData>();
				}
				listdatax.add(remarkCD[iBack]);
				remarkCD[iBack-1].setData(listdatax);
			}
			returnData.remove(0);
			result.setData(returnData);
		}
		return result;
	}
	public String getKylinData(String url,String authorization){
        DefaultHttpClient httpClient = new DefaultHttpClient();
        HttpGet httpGet = new HttpGet(url);
        httpGet.addHeader("Authorization", authorization);
        String responseString = "";
        try {            
            HttpResponse response = httpClient.execute(httpGet);            
            HttpEntity httpEntity = response.getEntity();            
            responseString = EntityUtils.toString(httpEntity);   
        } catch (ClientProtocolException e) {
        } catch (IOException e) {    
//            ipFlag = false;            
        } catch (Exception e) {
//            ipFlag = false;            
        }
		return responseString;
	}
	public static Results getDoubleDemType(StringBuffer sql) {
		// TODO Auto-generated method stub
		return null;
	}
	public static  Result exportExcel(String workTableName, List<String> measureDuLiangName, List<WorkTableDetail> measuresList,
			List<String> dimSort, List<String> measureDanWei, int dimSize, StringBuffer sql, String kylinUrl,
			String kylinUsername, String kylinPassword) throws SQLException, IOException {
		Result result = new Result();
		Properties info = new Properties();
		Driver driver = null;
		try {
			driver = (Driver) Class.forName("org.apache.kylin.jdbc.Driver").newInstance();
		} catch (InstantiationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		info.put("user", kylinUsername);
		info.put("password", kylinPassword);
		Connection conn = driver.connect(kylinUrl, info);
		Statement state = conn.createStatement();
		ResultSet rs = state.executeQuery(sql.toString());
		  
		   // 获取列数  
		   ResultSetMetaData metaData = rs.getMetaData();  
		   int columnCount = metaData.getColumnCount();
		   if(StringUtils.isEmpty(workTableName)){
			   workTableName="新建数据分析";
		   }
		   SimpleDateFormat dateFormater = new SimpleDateFormat("yyyyMMddhhmmss");
		   Date date=new Date();
		   workTableName = workTableName+dateFormater.format(date)+".xls";
		   FileOutputStream fos = new FileOutputStream(workTableName);
		   HSSFWorkbook wb = new HSSFWorkbook();
      	   HSSFSheet s = wb.createSheet();
      	   wb.setSheetName(0, "Sheet1");
		   // 遍历ResultSet中的每条数据  
      	   HSSFRow row = s.createRow(0);
	      	 for (int i = 1; i <= columnCount; i++) {
	      		HSSFCell cell = row.createCell(i-1);
	      		if(dimSort.size()>=i){
	      			HSSFRichTextString hts=new HSSFRichTextString(dimSort.get(i-1));
	      			cell.setCellValue(hts);
	            }else {
	            	HSSFRichTextString hts=new HSSFRichTextString(measureDuLiangName.get(i-dimSort.size()-1)+"("+measureDanWei.get(i-dimSort.size()-1)+")");
	            	cell.setCellValue(hts);
	            }
	      	 }
      	   int rowCount =0;
		    while (rs.next()) {
		    	row = s.createRow(++rowCount);
		        // 遍历每一列  
		        for (int i = 1; i <= columnCount; i++) {
		        	 HSSFCell cell = row.createCell(i-1);
		            String columnName =metaData.getColumnLabel(i);  
		            String value = rs.getString(columnName);  
		            if(value==null){
		            	value="";
		            }
		            HSSFRichTextString hts=new HSSFRichTextString(value);
		        	 cell.setCellValue(hts);
		        } 
		    } 
		 wb.write(fos);
		 fos.flush();
       	 fos.close();
       	result.setData(workTableName);
		return result;
	}
	
}
