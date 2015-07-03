package org.apdplat.performanceAppraisal.payment.dao;

import java.util.List;
import java.util.Map;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

public interface UnitRatioConfigDao {

	/**
	 * 查询组织架构树
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> listTreeNode(Map<String, Object> params);
	
	/**
	 * 查询营服中心及系数信息
	 * @param params
	 * @return
	 */
	public PageList<Map<String, Object>> list(Map<String, String> params);
	
	/**
	 * 查询营服中心系数信息
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> loadUnitRatio(Map<String, String> params);
	
	/**
	 * 修改营服中心系数
	 * @param params
	 */
	public void updateUnitRatio(Map<String, String> params);
	
}
