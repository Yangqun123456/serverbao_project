package com.jusfoun.jap.dashboard.controller;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import org.json.JSONException;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.itmuch.core.util.SubjectUtil;
import com.jusfoun.jap.dashboard.domain.Dashboard;
import com.jusfoun.jap.dashboard.service.DashboardService;
import com.jusfoun.jap.dashboard.vo.DashboardVo;
import com.jusfoun.jap.story.domain.Story;

@RestController
@RequestMapping(value = "/dashboards")
public class DashboardController {

    @Resource
    DashboardService dashboardService;

    //仪表盘详情
    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public DashboardVo getDashboard(Dashboard dashboard) throws SQLException, JSONException {
        dashboard.setUserId(SubjectUtil.getUserId().toString());
        return dashboardService.getDashboard(dashboard);
    }
    
  //根据多个仪表盘查询详情
  	 @RequestMapping(value="/getDashboards",method=RequestMethod.POST,	consumes=MediaType.APPLICATION_JSON_UTF8_VALUE)
    public List<DashboardVo> getStoryByDashboards(@RequestBody List<Dashboard> dashboards) throws SQLException, JSONException{
  		List<DashboardVo> dashboardVos = new ArrayList<DashboardVo>();
  		 for(Dashboard dashboard : dashboards){
  			DashboardVo sad = dashboardService.getDashboard(dashboard);
  			dashboardVos.add(sad);
  		 }
	 	return dashboardVos;
   }

    //仪表盘列表
    @RequestMapping(method = RequestMethod.GET)
    public List<Dashboard> getDashboards(Dashboard dashboard) {
        dashboard.setUserId(SubjectUtil.getUserId().toString());
        return dashboardService.getDashboards(dashboard);
    }
    
  //仪表盘列表
  	 @RequestMapping(value="/getDashboards",method=RequestMethod.GET)
  	 public List<DashboardVo> getDashboardVos(Dashboard dashboard){
  		dashboard.setUserId(SubjectUtil.getUserId().toString());
  		 return dashboardService.getDashboardVos(dashboard);
  	 }

    //新建仪表盘
    @RequestMapping(method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public DashboardVo createDashboard(@RequestBody DashboardVo dashboardVo) {
//        System.out.println("输入的参数为：" + dashboard);
//        DashboardVo dashboardVo = JSON.parseObject(dashboard, DashboardVo.class);// json转换为WorkCondition的对象
        dashboardVo.setUserId(SubjectUtil.getUserId().toString());
        return dashboardService.createDashboard(dashboardVo);
    }

    //更新仪表盘
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT, consumes = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public void updateDashboard(@PathVariable String id, @RequestBody  DashboardVo dashboardVo) {
        dashboardVo.setId(id);
        dashboardVo.setUserId(SubjectUtil.getUserId().toString());
        dashboardService.updateDashboard(dashboardVo);
    }

    //删除仪表盘
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public List<Story> delDashboard(DashboardVo dashboard) {
        return dashboardService.delDashboard(dashboard);
    }

    //复制仪表盘
    @RequestMapping(value = "/{id}", method = RequestMethod.POST)
    public void copyDashboard(Dashboard dashboard) {
        dashboard.setUserId(SubjectUtil.getUserId().toString());
        dashboardService.copyDashboard(dashboard);
    }
}
