package com.jusfoun.jap.cube.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.github.pagehelper.PageHelper;
import com.itmuch.core.page.PageInfo;
import com.itmuch.core.page.PageVo;
import com.jusfoun.jap.admin.vo.PageInfoVo;
import com.jusfoun.jap.cube.domain.Cube;
import com.jusfoun.jap.cube.domain.Tag;
import com.jusfoun.jap.cube.mapper.CubeMapper;
import com.jusfoun.jap.cube.vo.CubeVo;
import com.jusfoun.jap.util.StringUtil;
import com.jusfoun.jap.util.kylin.GetKylinData;
import com.jusfoun.jap.workTable.domain.CubeDim;
import com.jusfoun.jap.workTable.domain.CubeFact;

@Service
public class CubeService {
	@Value("${kylin.address}")
	private String kylinAddress;
	@Value("${kylin.authorization}")
	private String kylinAuthorization;
	@Value("${kylin.projectName}")
	private String kylinProjectName;
	@Autowired
	private CubeMapper dao;

	public PageInfoVo<Cube> queryByCubeName(PageVo pageVo, CubeVo cubeVo) {

		String order = pageVo.getOrder();
		order = " rownum";
		PageHelper.startPage(pageVo.getPage(), pageVo.getRows(), order);
		List<Cube> list = dao.queryByCubeName(cubeVo);
		PageInfo<Cube> info = new PageInfo<Cube>(list);
		PageInfoVo<Cube> cubePage = new PageInfoVo<Cube>(info.getList(), list);
		return cubePage;
	}
	
	public List<Cube> queryByCubeName(CubeVo cubeVo) {
		return dao.queryByCubeName(cubeVo);
	}

	/**
	 * 处理json返回cube的list
	 *
	 * @param result
	 * @param name
	 * @param fields
	 * @return
	 * @throws JSONException
	 */
	public List<Map<String, Object>> convertJSON2List(String result, String name, String[] fields)
			throws JSONException {
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
		JSONArray array = new JSONObject(result).getJSONArray(name);
		for (int i = 0; i < array.length(); i++) {
			JSONObject object = (JSONObject) array.opt(i);
			Map<String, Object> map = new HashMap<String, Object>();
			for (String str : fields) {
				map.put(str, object.get(str));
			}
			list.add(map);
		}
		return list;
	}

	public void delCubeByCondition(Cube cube) {
		// TODO Auto-generated method stub
		dao.delCubeByCondition(cube);
	}


	public CubeVo viewCubeByCondition(Cube cube) {
		CubeVo cubevo = new CubeVo();
		if(!(cube==null||cube.getCubeId()==null||"".equals(cube.getCubeId()))){
			cubevo = dao.viewCubeByCondition(cube);
			List<Tag> tagList = dao.findOtherTags(cube);
			cubevo.setOtherTagList(tagList);
			return cubevo;
		}else return null;
	}

	/**
	 * 1.删除kylin中没有的数据 2.更新或插入数据
	 *
	 * @param list
	 * @param cubeVo 
	 */
	public void synCubeTable(List<Map<String, Object>> list, CubeVo cubeVo) {
		// 1.删除T_cube_info多余的数据
		StringBuilder sbCubeId = new StringBuilder();
		String sCubeIds = "";
		CubeVo cubeinfo = new CubeVo();
		for (Map<String, Object> cube : list) {// 获取cubeid
			// 在循环获取所有cubeid的时候可将
			// 第二步 2.更新或插入数据顺带完成
			if(!"READY".equals(cube.get("status"))){
				continue;
			}
			cubeinfo.setCubeId((String) cube.get("uuid"));
			cubeinfo.setCubeName((String) cube.get("name"));
			cubeinfo.setCubeNameCn((String) cube.get("nameCn"));
			cubeinfo.setCubeDescription((String) cube.get("descriptor"));
			cubeinfo.setCubeDate(new Date(Long.parseLong(cube.get("create_time_utc").toString())));
			if (dao.updateCubeInfo(cubeinfo).intValue() == 0) {// 更新cubeinfo信息
				cubeinfo.setCubeStatus("0");
				dao.insertCube(cubeinfo);// 插入cube信息
			}
			sbCubeId.append(",'" + cube.get("uuid") + "'");// 获取kylin传来的所有的cubeid
		}
		sCubeIds = sbCubeId.toString().replaceFirst(",", "");
		if (sCubeIds != null && !"".equals(sCubeIds)) {
			sCubeIds = "(" + sCubeIds + ")";
		}
		if(cubeVo==null||StringUtil.isEmpty(cubeVo.getCubeName())){
			dao.delCubeByIds(sCubeIds);// 删除本地比kylin多的cube数据
		}
	}

	public void insertCube( CubeVo cubeinfo){
		dao.insertCube(cubeinfo);
	}
	public void delDimAndFactByCondition(CubeVo cubeVo) {
		dao.delDimByCondition(cubeVo);
		dao.delFactByCondition(cubeVo);
	}

	public void insertCubeFact(List<CubeFact> listValue) {
		dao.insertFact(listValue);

	}

	public void insertCubeDim(List<CubeDim> listDim) {
		dao.insertDim(listDim);
	}

	public void delDimByCube(Cube cube) {
		dao.delDimByCubeID(cube);
	}

	public void delFactByCube(Cube cube) {
		dao.delFactByCubeID(cube);
	}
	public void updateCubeInfo(CubeVo cube) {
		dao.updateCubeInfo(cube);
		if(cube.getNewTagList()!=null&&cube.getNewTagList().size()>0){//插入新添加的标签
			dao.insertTagList(cube.getNewTagList());
			dao.insertNewCubeTag(cube);//建立与新标签的关联
		}
		/*List<Tag> list = dao.findTags(cube.getNewTagList());
		cube.setNewTagList(list);*/
		if(cube.getDelTagList()!=null&&cube.getDelTagList().size()>0){
			dao.delTagList(cube);//删除去掉的表情
		}
		if(cube.getAddTagList()!=null&&cube.getAddTagList().size()>0){
			dao.insertCubeTag(cube);//建立与旧标签的关联
		}
		
		dao.delOtherTag();//删除不被使用的标签
		
	}

	public int insertColumn() {
		return dao.insertColumn();
	}
	
	public PageInfoVo<Cube> synCube(PageVo pageVo,CubeVo cubeVo) throws JSONException {
		String url = kylinAddress + "/kylin/api/cubes?projectName="+kylinProjectName;
		if(cubeVo!=null&&StringUtil.isNotEmpty(cubeVo.getCubeName())){
			url+="&cubeName="+cubeVo.getCubeName();
		}
		GetKylinData getKylinData = new GetKylinData();
		String segment = null, sFact = "", sDimTables = "", sForKey = "", sKey = "";// 内部json字符串，主表表名，维表名，事实表外键，维表主键
		String[] dictionaries = null;
		String responseString = getKylinData.getKylinData(url, kylinAuthorization);
		List<Map<String, Object>> list = convertJSON2List(// 获取json内所有cube转化为list
				"{\"cubes\":" + responseString + "}", "cubes",
				new String[] { "uuid", "name", "descriptor", "create_time_utc", "segments","status" });
		// 4.1逐个解析cube详情来给维表和度量表增数据
		List<CubeDim> listDim = new ArrayList<CubeDim>();// 存储需要插入的dim对象
		List<CubeFact> listValue = new ArrayList<CubeFact>();// 存储需要插入的fact对象
		for (Map<String, Object> cube : list) {
			if(!"READY".equals(cube.get("status"))){
				continue;
			}
			Map<String, String> mapDim = new HashMap<String, String>();// 维度表及其关联关系
			url = kylinAddress + "/kylin/api/cube_desc/" + cube.get("name");
			getKylinData = new GetKylinData();
			responseString = getKylinData.getKylinData(url, kylinAuthorization);
			responseString = responseString.substring(1, responseString.length() - 1);
			System.out.println("单个的cube为：");
			System.out.println(responseString);
			segment = new JSONObject(((JSONArray) cube.get("segments")).getString(0)).getJSONObject("dictionaries")
					.toString();// 获取cubes里面的维表相关信息，包括事实表名与事实表和维表的关联关系
			dictionaries = segment.split(",");
			sFact = dictionaries[0].substring(dictionaries[0].indexOf(".") + 1, dictionaries[0].indexOf("/"));
			for (String sTemString : dictionaries) {
				sDimTables = sTemString.substring(sTemString.indexOf(".", sTemString.indexOf(":")) + 1,
						sTemString.indexOf("/", sTemString.indexOf(".", sTemString.indexOf(":")) + 1));// 维度表的表名
				sForKey = sTemString.substring(sTemString.indexOf("/") + 1, sTemString.indexOf(":") - 1);
				sKey = sTemString.substring(
						sTemString.indexOf("/", sTemString.indexOf(".", sTemString.indexOf(":"))) + 1,
						sTemString.indexOf("/",
								sTemString.indexOf("/", sTemString.indexOf(".", sTemString.indexOf(":"))) + 1));
				mapDim.put(sDimTables, sFact + "." + sForKey + "=" + sDimTables + "." + sKey);
			}

			// 4.2维表详情开始解析
			JSONArray array = new JSONObject(responseString).getJSONArray("dimensions");
			String nameCnAndDesc = new JSONObject(responseString).getString("description");
			String uuid = new JSONObject(responseString).getString("uuid");//cube列表中的uuid和单个cube获取到的uuid不是一个
			cube.put("uuid", uuid);
			cube.put("descriptor", nameCnAndDesc);
			cube.put("nameCn", nameCnAndDesc);
			String sTablename = "", sColumn = "", sTableConnectColumn = "";// 维表表名，列名
			String[] arrColumn = null;
			for (int i = 0; i < array.length(); i++) {
				JSONObject jo = array.getJSONObject(i);
				sColumn = jo.getString("column");
				if (sColumn == "null") {
					sColumn = jo.getString("derived");
					arrColumn = sColumn.substring(2, sColumn.length() - 2).split("\",\"");
					for (String stem : arrColumn) {
						CubeDim cubeDim = new CubeDim();
						sTablename = jo.getString("table");
						sTablename = sTablename.substring(sTablename.indexOf(".") + 1);
						cubeDim.setDimTableName(sTablename);
						cubeDim.setCubeId((String) cube.get("uuid"));
						sTableConnectColumn = mapDim.get(sTablename);
						cubeDim.setTableConnectColumn(sTableConnectColumn);
						cubeDim.setDimColumn(stem);
						listDim.add(cubeDim);
					}
				} else {
					CubeDim cubeDim = new CubeDim();
					sTablename = jo.getString("table");
					sTablename = sTablename.substring(sTablename.indexOf(".") + 1);
					cubeDim.setDimTableName(sTablename);
					cubeDim.setCubeId((String) cube.get("uuid"));
					sTableConnectColumn = mapDim.get(sTablename);
					cubeDim.setTableConnectColumn(sTableConnectColumn);
					cubeDim.setDimColumn(sColumn);
					listDim.add(cubeDim);
				}
			}

			// 4.3度量表详情开始解析
			array = new JSONObject(responseString).getJSONArray("measures");
			String sValue = "";
			for (int i = 0; i < array.length(); i++) {
				sValue = array.getJSONObject(i).getJSONObject("function").getJSONObject("parameter").getString("value");
				String factTableRule = array.getJSONObject(i).getJSONObject("function").getString("expression");
				//if (!"1".equals(sValue)) {
					boolean hasTheCol = false;//假设list里没有该列
					for(CubeFact cubeFact1 :listValue){//一个列在有一种以上的运算方式的情况下json里会出现两次,若是第二次出现，则在原有的对象的FactTableRule添加新的统计方式，而不增加新的对象
						if(sTablename.equals(cubeFact1.getFactTableName())&&sValue.equals(cubeFact1.getFactTableColumn())){//该列存在
							List<String> factTableRules = cubeFact1.getFactTableRule();
							factTableRules.add(factTableRule);
							cubeFact1.setFactTableRule(factTableRules);
							cubeFact1.setFactTableRules(factTableRules.toString().replaceAll(" ", ""));
							hasTheCol = true;
						}
					}
					if(!hasTheCol){//如果没有该列，
						CubeFact cubeFact = new CubeFact();
						cubeFact.setCubeId((String) cube.get("uuid"));
						cubeFact.setFactTableName(sFact);
						if ("1".equals(sValue)) {
							sValue = "count1";
						}
						cubeFact.setFactTableColumn(sValue);
						List<String> factTableRules = new ArrayList<String>();
						factTableRules.add(factTableRule);
						cubeFact.setFactTableRule(factTableRules);
						cubeFact.setFactTableRules(factTableRules.toString());
						listValue.add(cubeFact);
					}
				//}
			}
		}
		delDimAndFactByCondition(cubeVo);// 3删除本地维表及度量表已有数据
		synCubeTable(list,cubeVo);// 1,2两步调用完成
		insertCubeDim(listDim);// 将所有值插入维度表
		insertCubeFact(listValue);// 度量表插值
		return queryByCubeName(pageVo,null);
	}


}
