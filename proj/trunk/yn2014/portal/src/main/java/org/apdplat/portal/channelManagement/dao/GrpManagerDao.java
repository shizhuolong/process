package org.apdplat.portal.channelManagement.dao;

import java.util.List;
import java.util.Map;


import com.github.miemiedev.mybatis.paginator.domain.PageList;

public interface GrpManagerDao {

	/**
	 * 查询集客的客户经理及渠道经理组织架构
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> listTreeNode(Map<String, Object> params);
	
	/**
	 * 询集客的客户经理及渠道经理信息
	 * @param params
	 * @return
	 */
	public PageList<Map<String, Object>> queryGrpPerson(Map<String, String> params);
	
}
