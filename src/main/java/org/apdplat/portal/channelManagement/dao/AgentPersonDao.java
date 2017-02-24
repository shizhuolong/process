package org.apdplat.portal.channelManagement.dao;

import java.util.List;
import java.util.Map;













import com.github.miemiedev.mybatis.paginator.domain.PageList;

public interface AgentPersonDao {

	
	public List<Map<String, Object>> listTreeNode(Map<String, Object> params);
	
	public PageList<Map<String, Object>> queryAgentPerson(Map<String, String> params);

	public void del(Map<String, String> m);

	public void insert(Map<String, String> m);

	public void update(Map<String, String> m);

	public List<Map<String, String>> findShopkeeper(Map<String, String> m);

	public List<Map<String, String>> findSalesman(Map<String, String> m);

	public List<Map<String, String>> isPhoneExist(Map<String, String> m);

	public List<Map<String, String>> isAgentOwn(Map<String, String> m);
	
}
