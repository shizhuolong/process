package org.apdplat.performanceAppraisal.payment.dao;

import java.util.List;
import java.util.Map;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

public interface SaleTargetConfigDao {

	/**
	 * 查询销售积分配置列表数据
	 * @param params
	 * @return
	 */
	public PageList<Map<String, Object>> list(Map<String, String> params);
	
	/**
	 * 查询指标编码，指标描述数量
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> loadCountByCodeAndDesc(Map<String, String> params);
	
	/**
	 * 添加销售积分指标
	 * @param params
	 */
	public void saveTarget(Map<String, String> params);
	
	/**
	 * 根据原始指标编码获取销售积分指标信息
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> loadTarget(Map<String, String> params);

	/**
	 * 修改销售积分指标时验证是否重复
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> loadUpdateCount(Map<String, String> params);
	
	/**
	 * 修改销售积分指标
	 * @param params
	 */
	public void updateTarget(Map<String, String> params);
}
