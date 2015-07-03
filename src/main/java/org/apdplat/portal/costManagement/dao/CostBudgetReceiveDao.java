package org.apdplat.portal.costManagement.dao;

import java.util.List;
import java.util.Map;

import com.github.miemiedev.mybatis.paginator.domain.PageList;


public interface CostBudgetReceiveDao {

	/**
	 * 成本预算接收数据列表
	 * @param params
	 * @return
	 */
	public PageList<Map<String, Object>> list(Map<String, String> params);
	
	/**
	 * 确认成本预算信息
	 * @param params
	 */
	public void confirmTask(Map<String, String> params);
	
	/**
	 * 拒绝成本预算信息
	 * @param params
	 */
	public void refuseCostBudget(Map<String, String> params);
	
	/**
	 * 将拒绝的成本预算信息存入历史表中
	 * @param params
	 */
	public void saveToHistory(Map<String, String> params);
	
	/**
	 * 查询成本预算明细
	 * @param params
	 * @return
	 */
	public PageList<Map<String, Object>> listDetailsInfo(Map<String, String> params);
	
	public List<Map<String, String>> selectRegion(Map<String, String> params);
	
	
}
