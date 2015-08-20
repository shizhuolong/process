package org.apdplat.portal.channelManagement.dao;

import java.util.Map;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

public interface FreeCommunityManagerDao {

	/**
	 * 查询营服中心
	 * @param params
	 * @return
	 */
	PageList<Map<String, Object>> listUnit(Map<String, String> params);

	/**
	 * 更新游离小区归属营服中心
	 * @param params
	 * @return 
	 */
	public Object updateFreeCommunity(Map<String, Object> params);

}
