package com.jusfoun.jap.dashboard.service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.annotation.Resource;

import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jusfoun.jap.common.Results;
import com.jusfoun.jap.dashboard.domain.Dashboard;
import com.jusfoun.jap.dashboard.mapper.DashboardMapper;
import com.jusfoun.jap.dashboard.vo.DashboardVo;
import com.jusfoun.jap.story.domain.Story;
import com.jusfoun.jap.workTable.mapper.ColumnChineseMapper;
import com.jusfoun.jap.workTable.service.WorkTableService;
import com.jusfoun.jap.workTable.vo.WorkTableCondition;
import com.jusfoun.jap.workTable.vo.WorkTableResult;
import com.jusfoun.jap.workTable.vo.WorkTableVo;

@Service
public class DashboardService {

    @Autowired
    private DashboardMapper dao;
    @Autowired
    private ColumnChineseMapper daoc;
    @Resource
    private WorkTableService workTableService;

    public DashboardVo getDashboard(Dashboard dashboard) throws SQLException, JSONException {
        DashboardVo Dashboardvo = dao.getDashboard(dashboard);
        List<WorkTableVo> workTableList = daoc.queryWorkTablebyPie(dashboard);
        Dashboardvo.setWorkTableResults(this.wt2wtr(workTableList));
        return Dashboardvo;
    }

    private List<WorkTableResult> wt2wtr(List<WorkTableVo> workTableList) throws SQLException, JSONException {
        List<WorkTableResult> WorkTables = new ArrayList<WorkTableResult>();
        if (workTableList != null && workTableList.size() > 0) {//求出工作表的结果
            for (int i = 0; i < workTableList.size(); i++) {
                WorkTableVo WorkTableVo = workTableList.get(i);
                WorkTableResult WorkTableResult = new WorkTableResult();
                WorkTableCondition workTable = new WorkTableCondition();
                workTable.setWorkTableId(WorkTableVo.getWorkTableId());
                WorkTableCondition workTable1 = workTableService.showWorkTableofPie(workTable);
                WorkTableResult.setResult(workTableService.getKylinByCondition(workTable1));
                WorkTableResult.setWorkTableId(WorkTableVo.getWorkTableId());
                WorkTableResult.setWorkTableName(WorkTableVo.getWorkTableName());
                WorkTableResult.setWorkTableCode(WorkTableVo.getWorkTableCode());
                WorkTableResult.setWorkTableDate(WorkTableVo.getWorkTableDate());
                WorkTableResult.setUserId(WorkTableVo.getUserId());
                WorkTableResult.setCubeId(WorkTableVo.getCubeId());
                WorkTableResult.setDataType(WorkTableVo.getDataType());
                WorkTableResult.setTableBorderColor(WorkTableVo.getTableBorderColor());
                WorkTableResult.setTableBorderShow(WorkTableVo.getTableBorderShow());
                WorkTableResult.setTableBorderWidth(WorkTableVo.getTableBorderWidth());
                WorkTableResult.setWorkTableOrder(WorkTableVo.getWorkTableOrder());
                WorkTableResult.setXsColor(WorkTableVo.getXsColor());
                WorkTableResult.setYsColor(WorkTableVo.getYsColor());
                WorkTableResult.setXwColor(WorkTableVo.getXwColor());
                WorkTableResult.setYwColor(WorkTableVo.getYwColor());
                WorkTableResult.setHeaderColor(WorkTableVo.getHeaderColor());
                WorkTableResult.setBodyColor(WorkTableVo.getBodyColor());
                WorkTableResult.setTableColor(WorkTableVo.getTableColor());
                if("step".equals(WorkTableVo.getDataType())){//同比环比图需要传维度度量筛选
                	WorkTableResult.setFilters(workTable1.getFilters());
                	WorkTableResult.setDimTable(workTable1.getDimTable());
                	WorkTableResult.setMeasures(workTable1.getMeasures());
                }else if("steptext".equals(WorkTableVo.getDataType())){
                	WorkTableResult.setMeasures(workTable1.getMeasures());
                }
                WorkTables.add(WorkTableResult);
            }
        }
        return WorkTables;
    }

    public List<Dashboard> getDashboards(Dashboard dashboard) {
        List<Dashboard> Dashboards = dao.getDashboards(dashboard);
        return Dashboards;
    }

    public List<DashboardVo> getDashboardVos(Dashboard dashboard) {
        List<DashboardVo> dashboardVos = new ArrayList<DashboardVo>();
        List<Dashboard> Dashboards = dao.getDashboards(dashboard);
        for (Dashboard db : Dashboards) {
            DashboardVo dashboardVo = new DashboardVo();
//			dashboardVo.setWorkTableResults(this.wt2wtr(daoc.queryWorkTablebyPie(db)));
            dashboardVo.setId(db.getId());
            dashboardVo.setName(db.getName());
            dashboardVo.setDescription(db.getDescription());
            dashboardVo.setUserId(db.getUserId());
            dashboardVo.setCreateTime(db.getCreateTime());
            dashboardVo.setUpdateTime(db.getUpdateTime());
            dashboardVo.setLayout(db.getLayout());
            dashboardVo.setBackgroundColor(db.getBackgroundColor());
            dashboardVo.setBorderColor(db.getBorderColor());
            dashboardVo.setBorderShow(db.getBorderShow());
            dashboardVo.setBorderWidth(db.getBorderWidth());
            dashboardVos.add(dashboardVo);
        }
        return dashboardVos;
    }

    public DashboardVo createDashboard(DashboardVo dashboard) {
        String id = UUID.randomUUID().toString().replaceAll("-", "");
        dashboard.setId(id);
        dao.createDashboard(dashboard);
        if (dashboard.getWorkTables() != null && !dashboard.getWorkTables().isEmpty()) {
            dao.insertDashboardWorkRela(dashboard);//插入关联关系
        }
        return dashboard;
    }

    public void updateDashboard(DashboardVo dashboard) {
        dao.updateDashboard(dashboard);//更新详情名称之类
        dao.delDashboardWorkRela(dashboard);//删除原来的关联表信息
        if (dashboard.getWorkTables() != null && !dashboard.getWorkTables().isEmpty()) {
            dao.insertDashboardWorkRela(dashboard);//插入关联关系
        }
    }

    public List<Story> delDashboard(DashboardVo dashboard) {
        List<Story> list = dao.queryDashboardUsedByStory(dashboard);
        if (list == null || list.size() == 0) {
            dao.delDashboard(dashboard);
            dao.delDashboardWorkRela(dashboard);
        }
        return list;
    }

    public void copyDashboard(Dashboard dashboard) {
        //1获取该仪表盘的副本名列表
        List<String> names = dao.selectNames(dashboard);
        int copyOrder = 1;
        dashboard.setName(dao.getDashboard(dashboard).getName());
        boolean getOrder = false;//false 表示 该序号的副本没有
        for (; ; copyOrder++) {
            getOrder = false;
            for (String name : names) {
                if ((dashboard.getName() + "-副本" + copyOrder).equals(name)) {//检测到该序列的副本
                    getOrder = true;
                    break;
                }
            }
            if (!getOrder) {//如果没有检测到循环结束copyOrder为可以使用的值
                break;
            }
        }

        //2插入新的仪表盘记录并返回主键
        dashboard.setName(dashboard.getName() + "-副本" + copyOrder);//更换新的名字
        dao.copyDashboard(dashboard);//插入
        String copyId = dao.getCopyDashboardId(dashboard);//返回主键
        //3.插入与数据分析的关联记录
        Map<String, String> mapId = new HashMap<String, String>();
        mapId.put("copyId", copyId);
        mapId.put("id", dashboard.getId());
        dao.copyDashboardWorkRela(mapId);

    }

    public DashboardVo getListKylinByCondition(List<WorkTableVo> list) throws SQLException, JSONException {
		DashboardVo Dashboardvo = new DashboardVo();
        List<WorkTableVo> workTableList = daoc.queryWorkTableList(list);
        Dashboardvo.setWorkTableResults(this.wt2wtr(workTableList));
        return Dashboardvo;
	}
}
