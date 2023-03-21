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

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * @author yangli9
 * 
 */
public class RowKeyColDesc {

    @JsonProperty("column")
    private String column;
    @JsonProperty("encoding")
    private String encoding;
    @JsonProperty("isShardBy")
    private boolean isShardBy;//usually it is ultra high cardinality column, shard by such column can reduce the agg cache for each shard
    @JsonProperty("index")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String index;

    public String getEncoding() {
        return encoding;
    }

    public void setEncoding(String encoding) {
        this.encoding = encoding;
    }

    public String getColumn() {
        return column;
    }

    public void setColumn(String column) {
        this.column = column;
    }

    public boolean isShardBy() {
        return isShardBy;
    }

    public void setShardBy(boolean shardBy) {
        isShardBy = shardBy;
    }

    public String getIndex() {
        return index;
    }

    public void setIndex(String index) {
        this.index = index;
    }
}