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

package com.jusfoun.jap.kylin.domain.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class DataModelDesc{
    public static enum RealizationCapacity {
        SMALL, MEDIUM, LARGE
    }
    
    @JsonProperty("name")
    private String name;

    @JsonProperty("description")
    private String description;

    @JsonProperty("fact_table")
    private String factTable;

    @JsonProperty("lookups")
    private List<LookupDesc> lookups;

    @JsonProperty("dimensions")
    private List<ModelDimensionDesc> dimensions;

    @JsonProperty("metrics")
    private String[] metrics;

    @JsonProperty("filter_condition")
    private String filterCondition;

    @JsonProperty("partition_desc")
    PartitionDesc partitionDesc; 
    
    @JsonProperty("last_modified")
    long lastModified;

	@JsonProperty("capacity")
    private RealizationCapacity capacity = RealizationCapacity.MEDIUM;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getFactTable() {
        return factTable;
    }

    public void setFactTable(String factTable) {
        this.factTable = factTable.toUpperCase();
    }

    public List<LookupDesc> getLookups() {
        return lookups;
    }

    public void setLookups(List<LookupDesc> lookups) {
        this.lookups = lookups;
    }

    public String getFilterCondition() {
        return filterCondition;
    }

    public void setFilterCondition(String filterCondition) {
        this.filterCondition = filterCondition;
    }

    public PartitionDesc getPartitionDesc() {
        return partitionDesc;
    }

    public void setPartitionDesc(PartitionDesc partitionDesc) {
        this.partitionDesc = partitionDesc;
    }

    public RealizationCapacity getCapacity() {
        return capacity;
    }

    public void setCapacity(RealizationCapacity capacity) {
        this.capacity = capacity;
    }

    public List<ModelDimensionDesc> getDimensions() {
        return dimensions;
    }

    public String[] getMetrics() {
        return metrics;
    }

    public void setDimensions(List<ModelDimensionDesc> dimensions) {
        this.dimensions = dimensions;
    }

    public void setMetrics(String[] metrics) {
        this.metrics = metrics;
    }

	public long getLastModified() {
		return lastModified;
	}

	public void setLastModified(long lastModified) {
		this.lastModified = lastModified;
	}
    
}
