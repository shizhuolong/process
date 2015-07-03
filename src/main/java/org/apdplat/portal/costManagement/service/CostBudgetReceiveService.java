package org.apdplat.portal.costManagement.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.portal.costManagement.dao.CostBudgetReceiveDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.github.miemiedev.mybatis.paginator.domain.PageList;


@Service
public class CostBudgetReceiveService {
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	@Autowired
	private CostBudgetReceiveDao costBudgetRecevieDao;
	
	/**
	 * 成本预算接收数据列表
	 * @param params
	 * @return
	 */
	public Object list(Map<String, String> params) {
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows = costBudgetRecevieDao.list(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}
	
	/**
	 * 确认成本预算信息
	 * @param params
	 */
	@Transactional(rollbackFor=Exception.class)
	public void confirmTask(Map<String, String> params) throws Exception{
		costBudgetRecevieDao.confirmTask(params);
	}
	
	/**
	 * 拒绝成本预算信息
	 */
	@Transactional(rollbackFor=Exception.class)
	public void refuseCostBudget(Map<String, String> params) throws Exception{
		costBudgetRecevieDao.refuseCostBudget(params);
		costBudgetRecevieDao.saveToHistory(params);
	}
	
	/**
	 * 查询成本预算明细
	 * @return
	 */
	public Object listDetailsInfo(Map<String, String> params) {
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows = costBudgetRecevieDao.listDetailsInfo(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}
	
	public List<Map<String, String>> selectRegion(Map<String, String> params) {
		return costBudgetRecevieDao.selectRegion(params);
	}
	
}
