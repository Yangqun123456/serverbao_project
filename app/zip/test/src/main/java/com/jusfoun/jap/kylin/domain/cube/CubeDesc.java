/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

package com.jusfoun.jap.kylin.domain.cube;

import java.util.Collections;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.jusfoun.jap.kylin.common.IEngineAware;
import com.jusfoun.jap.kylin.common.IStorageAware;

/**
 */
public class CubeDesc {
    @JsonProperty("name")
    private String name;
    @JsonProperty("model_name")
    private String modelName;
    @JsonProperty("description")
    private String description;
    @JsonProperty("dimensions")
    private List<DimensionDesc> dimensions;
    @JsonProperty("measures")
    private List<MeasureDesc> measures;
    @JsonProperty("rowkey")
    private RowKeyDesc rowkey;
    @JsonProperty("aggregation_groups")
    private List<AggregationGroup> aggregationGroups;
    @JsonProperty("hbase_mapping")
    private HBaseMappingDesc hbaseMapping;
    @JsonProperty("notify_list")
    private List<String> notifyList;
    @JsonProperty("status_need_notify")
    private List<String> statusNeedNotify = Collections.emptyList();
    @JsonProperty("partition_date_start")
    private long partitionDateStart = 0L;
    @JsonProperty("auto_merge_time_ranges")
    private long[] autoMergeTimeRanges;
    @JsonProperty("retention_range")
    private long retentionRange = 0;
    @JsonProperty("engine_type")
    private int engineType = IEngineAware.ID_MR_V2;
    @JsonProperty("storage_type")
    private int storageType = IStorageAware.ID_SHARDED_HBASE;
    
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getModelName() {
		return modelName;
	}
	public void setModelName(String modelName) {
		this.modelName = modelName;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public List<DimensionDesc> getDimensions() {
		return dimensions;
	}
	public void setDimensions(List<DimensionDesc> dimensions) {
		this.dimensions = dimensions;
	}
	public List<MeasureDesc> getMeasures() {
		return measures;
	}
	public void setMeasures(List<MeasureDesc> measures) {
		this.measures = measures;
	}
	public RowKeyDesc getRowkey() {
		return rowkey;
	}
	public void setRowkey(RowKeyDesc rowkey) {
		this.rowkey = rowkey;
	}
	public List<AggregationGroup> getAggregationGroups() {
		return aggregationGroups;
	}
	public void setAggregationGroups(List<AggregationGroup> aggregationGroups) {
		this.aggregationGroups = aggregationGroups;
	}
	public HBaseMappingDesc getHbaseMapping() {
		return hbaseMapping;
	}
	public void setHbaseMapping(HBaseMappingDesc hbaseMapping) {
		this.hbaseMapping = hbaseMapping;
	}
	public List<String> getNotifyList() {
		return notifyList;
	}
	public void setNotifyList(List<String> notifyList) {
		this.notifyList = notifyList;
	}
	public List<String> getStatusNeedNotify() {
		return statusNeedNotify;
	}
	public void setStatusNeedNotify(List<String> statusNeedNotify) {
		this.statusNeedNotify = statusNeedNotify;
	}
	public long getPartitionDateStart() {
		return partitionDateStart;
	}
	public void setPartitionDateStart(long partitionDateStart) {
		this.partitionDateStart = partitionDateStart;
	}
	public long[] getAutoMergeTimeRanges() {
		return autoMergeTimeRanges;
	}
	public void setAutoMergeTimeRanges(long[] autoMergeTimeRanges) {
		this.autoMergeTimeRanges = autoMergeTimeRanges;
	}
	public long getRetentionRange() {
		return retentionRange;
	}
	public void setRetentionRange(long retentionRange) {
		this.retentionRange = retentionRange;
	}
	public int getEngineType() {
		return engineType;
	}
	public void setEngineType(int engineType) {
		this.engineType = engineType;
	}
	public int getStorageType() {
		return storageType;
	}
	public void setStorageType(int storageType) {
		this.storageType = storageType;
	}
    
    
}
