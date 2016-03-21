package org.apdplat.performanceAppraisal.kpiManager.dao;

import java.util.Map;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

public interface KpiBasicPerConfigDao {

	/**
	 * 查询KPI基础绩效配置数据信息
	 * @param resultMap
	 * @return
	 */
	public PageList<Map<String, Object>> list(Map<String, String> resultMap);

	/**
	 * 新增KPI基础绩效配置数据信息
	 * @param params
	 * @return
	 */
	public Object saveKpiBasicPerConfig(Map<String, String> params) throws Exception;
	
	
	/**
	 * 根据hr编码查询编辑数据
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public Map<String, String> findKpiBasicByHrid(Map<String, Object> params) throws Exception;
	
	/**
	 * 根据hr编码更新编辑数据
	 * @param params
	 * @throws Exception
	 */
	public Object updateKpiBasicPerConfig(Map<String, String> params) throws Exception;

	
	/**
	 * 删除KPI基础绩效
	 * @return 
	 */
	public Object delKpiBasicByHrid(Map<String,String> params) throws Exception;
}
