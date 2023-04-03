/**
 * 
 */
package com.jusfoun.jap.common;

/**
 * @author wcq
 *
 */
 
import java.sql.SQLException;

import javax.annotation.Resource;

import org.json.JSONException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.itmuch.core.web.converter.Result;
import com.jusfoun.jap.util.kylin.GetKylinData;
import com.jusfoun.jap.workTable.service.WorkTableService;
import com.jusfoun.jap.workTable.vo.WorkTableCondition;

@RestController
@RequestMapping(value = "/api/jap")
public class Api {

	private transient Logger LOG = LoggerFactory.getLogger(getClass());
	@Resource
	private WorkTableService workTableService;
	@Value("${kylin.url}")
	private String kylinUrl;
	@Value("${kylin.username}")
	private String kylinUsername;
	@Value("${kylin.password}")
	private String kylinPassword;
	@Value("${kylin.database}")//kylin的数据库名称
	private String kylinDatabase;
	
	@RequestMapping(value="/query",method=RequestMethod.POST)
	public String queryKylinData(String sql) throws Exception {
		GetKylinData data = new GetKylinData();
		String result = "";
		try {
			result = data.getData(sql, kylinUrl, kylinUsername, kylinPassword);
		} catch (SQLException e) {
			LOG.error(e.getMessage(),e);
			throw e;
		} catch (Exception e) {
			LOG.error(e.getMessage(),e);
		}
		return result;
	}
	@RequestMapping(value = "/{workTableCode}",method=RequestMethod.GET)
	public Result queryWorktableData(WorkTableCondition workTable) throws Exception {
		return workTableService.queryWorktableData(workTable);
	}
	
}

