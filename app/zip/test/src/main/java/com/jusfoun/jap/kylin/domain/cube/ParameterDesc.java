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

import java.io.UnsupportedEncodingException;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 */
public class ParameterDesc {

    @JsonProperty("type")
    private String type;
    @JsonProperty("value")
    private String value;

    @JsonProperty("next_parameter")
    private ParameterDesc nextParameter;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public byte[] getBytes() throws UnsupportedEncodingException {
        return value.getBytes("UTF-8");
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public ParameterDesc getNextParameter() {
        return nextParameter;
    }

    public void setNextParameter(ParameterDesc nextParameter) {
        this.nextParameter = nextParameter;
    }

    public boolean isColumnType() {
        return FunctionDesc.PARAMETER_TYPE_COLUMN.equals(type);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;

        ParameterDesc that = (ParameterDesc) o;

        if (nextParameter != null ? !nextParameter.equals(that.nextParameter) : that.nextParameter != null)
            return false;
        if (type != null ? !type.equals(that.type) : that.type != null)
            return false;
        if (value != null ? !value.equals(that.value) : that.value != null)
            return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = type != null ? type.hashCode() : 0;
        result = 31 * result + (value != null ? value.hashCode() : 0);
        result = 31 * result + (nextParameter != null ? nextParameter.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "ParameterDesc [type=" + type + ", value=" + value + ", nextParam=" + nextParameter + "]";
    }

}
