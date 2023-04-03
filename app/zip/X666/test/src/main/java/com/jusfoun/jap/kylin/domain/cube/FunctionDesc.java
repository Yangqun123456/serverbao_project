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

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.common.collect.Sets;

/**
 */
public class FunctionDesc {

    public static final String FUNC_SUM = "SUM";
    public static final String FUNC_MIN = "MIN";
    public static final String FUNC_MAX = "MAX";
    public static final String FUNC_COUNT = "COUNT";
    public static final String FUNC_COUNT_DISTINCT = "COUNT_DISTINCT";
    public static final Set<String> BUILT_IN_AGGREGATIONS = Sets.newHashSet();

    static {
        BUILT_IN_AGGREGATIONS.add(FUNC_COUNT);
        BUILT_IN_AGGREGATIONS.add(FUNC_MAX);
        BUILT_IN_AGGREGATIONS.add(FUNC_MIN);
        BUILT_IN_AGGREGATIONS.add(FUNC_SUM);
        BUILT_IN_AGGREGATIONS.add(FUNC_COUNT_DISTINCT);
    }

    public static final String PARAMETER_TYPE_CONSTANT = "constant";
    public static final String PARAMETER_TYPE_COLUMN = "column";

    @JsonProperty("expression")
    private String expression;
    @JsonProperty("parameter")
    private ParameterDesc parameter;
    @JsonProperty("returntype")
    private String returnType;
    public boolean isMin() {
        return FUNC_MIN.equalsIgnoreCase(expression);
    }

    public boolean isMax() {
        return FUNC_MAX.equalsIgnoreCase(expression);
    }

    public boolean isSum() {
        return FUNC_SUM.equalsIgnoreCase(expression);
    }

    public boolean isCount() {
        return FUNC_COUNT.equalsIgnoreCase(expression);
    }

    public boolean isCountDistinct() {
        return FUNC_COUNT_DISTINCT.equalsIgnoreCase(expression);
    }

    public String getExpression() {
        return expression;
    }

    public void setExpression(String expression) {
        this.expression = expression;
    }

    public ParameterDesc getParameter() {
        return parameter;
    }

    public void setParameter(ParameterDesc parameter) {
        this.parameter = parameter;
    }

    public int getParameterCount() {
        int count = 0;
        for (ParameterDesc p = parameter; p != null; p = p.getNextParameter()) {
            count++;
        }
        return count;
    }
    
    public void setReturnType(String returnType) {
        this.returnType = returnType;
    }
    
    public String getReturnType() {
        return returnType;
    }
}
