package org.apdplat.portal.channelManagement.dao;

import java.util.List;
import java.util.Map;







import com.github.miemiedev.mybatis.paginator.domain.PageList;

public interface ChnlPersonDao {

	public PageList<Map<String, Object>> listPerson(Map<String, String> params) throws Exception;

	public List<Map<String, Object>> listTreeNode(Map<String, Object> params);

	public void bind(Map<String, String> params);

	public void unBind(Map<String, String> params);
	
}
