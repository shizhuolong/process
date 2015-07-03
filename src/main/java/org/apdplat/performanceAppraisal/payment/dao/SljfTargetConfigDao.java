package org.apdplat.performanceAppraisal.payment.dao;

import java.util.List;
import java.util.Map;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

public interface SljfTargetConfigDao {

	/**
	 * 查询受理积分配置列表数据
	 * @param params
	 * @return
	 */
	public PageList<Map<String, Object>> list(Map<String, String> params);
	
	/**
	 * 通过指标名称获取指标数
	 * @param params
	 * @return
	 */
	public int loadTargetCountByName(Map<String, String> params);
	
	/**
	 * 添加受理积分指标
	 * @param params
	 */
	public void saveTarget(Map<String, String> params);
	
	/**
	 * 根据指标编码查询受理积分指标
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> loadTargetByCode(Map<String, String> params);
	
	public int loadTargetByUpdateCode(Map<String, String> params);
	
	/**
	 * 修改受理积分指标
	 * @param params
	 */
	public void updateTarget(Map<String, String> params);
	
}
