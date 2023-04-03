package com.jusfoun.jap.hive.vo;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class ModelVo implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private String modelName;//name
		
	private String modelDesc; //description
	
	private List<MeasureVo> measures=new ArrayList<MeasureVo>();
	
	private List<DimensionVo> dimensions=new ArrayList<DimensionVo>();
	
	private List<RelationVo> relations=new ArrayList<RelationVo>();
	
	private Long syncPolicy;
	
	private HiveTableVo factTable;

	public String getModelName() {
		return modelName;
	}

	public void setModelName(String modelName) {
		this.modelName = modelName;
	}

	public String getModelDesc() {
		return modelDesc;
	}

	public void setModelDesc(String modelDesc) {
		this.modelDesc = modelDesc;
	}

	public List<MeasureVo> getMeasures() {
		return measures;
	}

	public void setMeasures(List<MeasureVo> measures) {
		this.measures = measures;
	}

	public List<DimensionVo> getDimensions() {
		return dimensions;
	}

	public void setDimensions(List<DimensionVo> dimensions) {
		this.dimensions = dimensions;
	}

	public List<RelationVo> getRelations() {
		return relations;
	}

	public void setRelations(List<RelationVo> relations) {
		this.relations = relations;
	}

	public Long getSyncPolicy() {
		return syncPolicy;
	}

	public void setSyncPolicy(Long syncPolicy) {
		this.syncPolicy = syncPolicy;
	}

	public HiveTableVo getFactTable() {
		return factTable;
	}

	public void setFactTable(HiveTableVo factTable) {
		this.factTable = factTable;
	}
	
	

}
