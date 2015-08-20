package org.apdplat.warningAndMonitor.resourceMonitor.dao;

import java.util.List;
import java.util.Map;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

public interface FreeCommunityDao {

	/**
	 * 游离小区列表
	 * @param params
	 * @return
	 */
	public PageList<Map<String, Object>> list(Map<String, String> params);

	/**
	 * 查询组织架构
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> searchSelectOrg(Map<String, Object> params);



}
