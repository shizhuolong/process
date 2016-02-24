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

	public void del(Map<String, String> m);

	public void insert(Map<String, String> m);

	public void update(Map<String, String> m);

	public void merge(Map<String, String> m);
	
}
