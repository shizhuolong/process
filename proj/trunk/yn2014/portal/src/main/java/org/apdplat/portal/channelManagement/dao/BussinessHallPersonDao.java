package org.apdplat.portal.channelManagement.dao;

import java.util.List;
import java.util.Map;


import com.github.miemiedev.mybatis.paginator.domain.PageList;

public interface BussinessHallPersonDao {

	/**
	 * 查询营业厅与营业员组织架构
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> listTreeNode(Map<String, Object> params);
	
	/**
	 * 查询渠营业厅与营业员信息
	 * @param params
	 * @return
	 */
	public PageList<Map<String, Object>> queryMagPerson(Map<String, String> params);
	
}
