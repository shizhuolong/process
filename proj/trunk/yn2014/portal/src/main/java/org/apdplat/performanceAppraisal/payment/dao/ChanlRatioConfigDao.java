package org.apdplat.performanceAppraisal.payment.dao;

import java.util.List;
import java.util.Map;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

public interface ChanlRatioConfigDao {

	/**
	 * 查询组织架构树
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> listTreeNode(Map<String, Object> params);
	
	/**
	 * 查询渠道及系数信息
	 * @param params
	 * @return
	 */
	public PageList<Map<String, Object>> list(Map<String, String> params);
	
	/**
	 * 查询渠道类型
	 * @return
	 */
	public List<Map<String, Object>> loadChanlType();
	
	/**
	 * 查询渠道系数信息
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> loadChanlRatio(Map<String, String> params);
	
	/**
	 * 新增或者修改渠道系数
	 * @param params
	 */
	public void updateChanlRatio(Map<String, String> params);
	
}
