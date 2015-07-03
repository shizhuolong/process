package org.apdplat.portal.loginStatistics.dao;

import java.util.List;
import java.util.Map;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

public interface LoginStatisticsDao {

	/**
	 * 查询用户登录情况
	 * @param params
	 * @return
	 */
	public PageList<Map<String, Object>> searchUserLoginTimes(Map<String, String> params);
	
	/**
	 * 查询组织架构
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> searchSelectOrg(Map<String, Object> params);
	
}
