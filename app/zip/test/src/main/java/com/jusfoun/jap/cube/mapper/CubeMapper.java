package com.jusfoun.jap.cube.mapper;

import java.util.List;

import com.jusfoun.jap.cube.domain.Cube;
import com.jusfoun.jap.cube.domain.Tag;
import com.jusfoun.jap.cube.vo.CubeVo;
import com.jusfoun.jap.workTable.domain.CubeDim;
import com.jusfoun.jap.workTable.domain.CubeFact;

public interface CubeMapper{
	public List<Cube> queryByCubeName(CubeVo cubeVo);

	// Cube表插入数据
	public void insertCube(CubeVo cubeinfo);

	// 事实表插入数据
	public void insertFact(List<CubeFact> cubeFacts);

	// 维表插入数据
	public void insertDim(List<CubeDim> cubeDims);

	//
	public void delCubeByCondition(Cube cube);

	//
	public Integer updateCubeInfo(CubeVo cube);

	//
	public CubeVo viewCubeByCondition(Cube cube);

	//
	public void delCubeByIds(String sCubeIds);

	//
	public void delDimByCondition(CubeVo cubeVo);

	//
	public void delFactByCondition(CubeVo cubeVo);

	public void delFactByCubeID(Cube cube);

	//
	public void delDimByCubeID(Cube cube);

	public int insertColumn();

	public List<Tag> findOtherTags(Cube cube);

	public void insertTagList(List<Tag> list);

	public List<Tag> findTags(List<Tag> newTagList);

	public void insertNewCubeTag(CubeVo cube);

	public void delTagList(CubeVo cube);

	public void insertCubeTag(CubeVo cube);

	public void delOtherTag();

}