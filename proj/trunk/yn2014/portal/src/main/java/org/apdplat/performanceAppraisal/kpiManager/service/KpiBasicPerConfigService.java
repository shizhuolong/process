package org.apdplat.performanceAppraisal.kpiManager.service;

import java.util.HashMap;
import java.util.Map;

import org.apdplat.performanceAppraisal.kpiManager.dao.KpiBasicPerConfigDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.github.miemiedev.mybatis.paginator.domain.PageList;
@Service
public class KpiBasicPerConfigService {

	@Autowired
	private KpiBasicPerConfigDao kpiBasicPerConfigDao;
	/**
	 * 查询KPI基础绩效配置数据信息
	 * @param resultMap
	 * @return
	 */
	public Object list(Map<String, String> resultMap) {
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows= kpiBasicPerConfigDao.list(resultMap);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}
	
	/**
	 * 新增KPI基础绩效配置数据信息
	 * @param params
	 * @return 
	 * @throws Exception 
	 */
	public Object saveKpiBasicPerConfig(Map<String, String> params) throws Exception {
		return kpiBasicPerConfigDao.saveKpiBasicPerConfig(params);
	}
	
	/**
	 * 根据hr编码查询编辑数据
	 * @param params
	 * @return
	 * @throws Exception 
	 */
	public  Map<String,String> findKpiBasicByHrid(Map<String, Object> params) throws Exception{
		return kpiBasicPerConfigDao.findKpiBasicByHrid(params);
	}
	
	/**
	 * 根据hr编码修改数据
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public Object updateKpiBasicPerConfig(Map<String,String> params) throws Exception{
		return kpiBasicPerConfigDao.updateKpiBasicPerConfig(params);
	}
	
	/**
	 * 删除KPI基础绩效
	 * @param params
	 * @return
	 * @throws Exception 
	 */
	public Object delKpiBasicByHrid(Map<String,String> params) throws Exception{
		return kpiBasicPerConfigDao.delKpiBasicByHrid(params);
	}
}
