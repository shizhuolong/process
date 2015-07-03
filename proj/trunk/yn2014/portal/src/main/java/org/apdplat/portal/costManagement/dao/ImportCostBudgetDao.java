package org.apdplat.portal.costManagement.dao;

import java.util.List;
import java.util.Map;

import com.github.miemiedev.mybatis.paginator.domain.PageList;


public interface ImportCostBudgetDao {

	/**
	 * 查询成本预算导入数据
	 * @param params
	 * @return
	 */
	public PageList<Map<String, Object>> list(Map<String, String> params);
	
	/**
	 * 查询导入的成本中心名称与码表中营服中心名称不一致的数据
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> queryNotExistsUnit(Map<String, String> params);
	
	/**
	 * 根据帐期和成本中心名称查询重复导入过的成本中心数据
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> queryExistsCostName(Map<String, String> params);
	
	/**
	 * 成本预算数据导入到结果表
	 */
	public void importCostData(Map<String, String> params);
	
	/**
	 * 删除导入成本预算临时表数据
	 * @param params
	 */
	public void deleteCostTemp(Map<String, String> params);
	
	/**
	 * 通过id获取成本预算
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> loadById(Map<String, String> params);
	
	/**
	 * 修改成本预算
	 * @param params
	 */
	public void update(Map<String, String> params);
	
	/**
	 * 根据帐期及当前用户归属查询成本预算
	 * @param params
	 * @return
	 */
	public int getDataListCount(Map<String, String> params);
	
	/**
	 * 将工单编号更新到成本预算表中
	 * @param params
	 */
	public void updateDataWorkNo(Map<String, String> params);
	
	/**
	 * 通过工单编号查询成本预算数据
	 * @param params
	 * @return
	 */
	public PageList<Map<String, Object>> listByWorkNo(Map<String, String> params);
	
	/**
	 * 更新成本预算状态
	 * @param workNo
	 */
	public void updateStatus(String workNo);
	
	/**
	 * 伤亡成本预算导入审核
	 * @param workNo
	 */
	public void cancleApply(String workNo);
	
	/**
	 * 查询成本预算拒绝原因
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> getRrefuseInfo(String id);
	
}
