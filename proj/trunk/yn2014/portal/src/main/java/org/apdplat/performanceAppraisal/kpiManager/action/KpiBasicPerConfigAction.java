package org.apdplat.performanceAppraisal.kpiManager.action;

import java.util.HashMap;
import java.util.Map;

import org.apdplat.performanceAppraisal.kpiManager.service.KpiBasicPerConfigService;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.log.APDPlatLogger;
import org.springframework.beans.factory.annotation.Autowired;

@SuppressWarnings("serial")
public class KpiBasicPerConfigAction extends BaseAction{

	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	@Autowired
	private KpiBasicPerConfigService kpiBasicPerConfigService;
	private Map<String,String> resultMap=null;
	
	/**
	 * 查询KPI基础绩效配置数据
	 */
	public void list(){
		logger.info("查询KPI基础绩效配置数据");
		String time =  request.getParameter("time");
		String regionCode = request.getParameter("regionCode");
		String regionName = request.getParameter("regionName");
		String userName = request.getParameter("userName");
		String orgLevel = request.getParameter("orgLevel");
		resultMap.put("time", time);
		resultMap.put("orgLevel", orgLevel);
		if(null!=regionName&&!"".equals(regionName)){
			resultMap.put("regionName", regionName);
		}
		if(null!=regionCode&&!"".equals(regionCode)){
			resultMap.put("regionCode", regionCode);
		}
		if(null!=userName&&!"".equals(userName)){
			resultMap.put("userName", userName);
		}
		
		Object resultList = kpiBasicPerConfigService.list(resultMap);
		this.reponseJson(resultList);
 	}

	/**
	 * 新增KPI基础绩效配置数据信息
	 */
	public void saveKpiBasicPerConfig(){
		try {
			Map<String, String> params = new HashMap<String,String>();
			String time =  request.getParameter("time");
			String regionCode =  request.getParameter("regionCode");
			String userName =  request.getParameter("userName");
			String hrCode =  request.getParameter("hrCode");
			String baseSalary =  request.getParameter("baseSalary");
			params.put("time",time);
			params.put("regionCode",regionCode);
			params.put("userName",userName);
			params.put("hrCode",hrCode);
			params.put("baseSalary",baseSalary);
			kpiBasicPerConfigService.saveKpiBasicPerConfig(params);
			this.reponseJson("操作成功");
		} catch (Exception e) {
			logger.error("添加KPI基础绩效配置数据信息失败",e);
			this.reponseJson("添加KPI基础绩效配置数据信息失败");
		}
	}
	
	
	/**
	 * 根据hr编码查询编辑数据
	 */
	public void  findKpiBasicByHrid(){
		String hrId = request.getParameter("hrId");
		String time = request.getParameter("time");
		Map<String,Object> params = new HashMap<String,Object>();
		params.put("hrId", hrId);
		params.put("time", time);
		try {
			Map<String, String> result = kpiBasicPerConfigService.findKpiBasicByHrid(params);
			this.reponseJson(result);
		} catch (Exception e) {
			logger.error("根据hr编码查询数据失败",e);
			this.reponseJson("查询数据失败");
		}
	}
	
	/**
	 * 根据hr编码更新数据
	 */
	public void updateKpiBasicPerConfig(){
		String time= request.getParameter("time");
		String hrId = request.getParameter("hrId");
		String baseSalary = request.getParameter("baseSalary");
		Map<String,String> params = new HashMap<String,String>();
		if(null!=baseSalary||"".equals(baseSalary)){
			params.put("baseSalary", baseSalary);
		}
		params.put("hrId", hrId);
		params.put("time", time);
		try {
			kpiBasicPerConfigService.updateKpiBasicPerConfig(params);
			this.reponseJson("修改kpi绩效成功");
		} catch (Exception e) {
			logger.error("修改kpi绩效成功失败",e);
			this.reponseJson("修改kpi绩效成功失败");
		}
	}
	
	/**
	 * 删除kpi绩效
	 */
	public void delKpiBasicByHrid(){
		String time= request.getParameter("time");
		String hrId = request.getParameter("hrId");
		Map<String,String> params = new HashMap<String,String>();
		params.put("hrId", hrId);
		params.put("time", time);
		try {
			kpiBasicPerConfigService.delKpiBasicByHrid(params);
			this.reponseJson("删除kpi绩效成功");
		} catch (Exception e) {
			logger.error("删除kpi绩效成功失败",e);
			this.reponseJson("删除kpi绩效成功失败");
		}
	}
	public Map<String, String> getResultMap() {
		return resultMap;
	}

	public void setResultMap(Map<String, String> resultMap) {
		this.resultMap = resultMap;
	}

	
	
	
}
