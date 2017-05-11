package org.apdplat.portal.order2i2c.dao;

import java.util.Map;















import com.github.miemiedev.mybatis.paginator.domain.PageList;

public interface TeamManagerDao {
	
	public PageList<Map<String, Object>> query(Map<String, String> params);

	public void del(Map<String, String> params);

	public void delDetail(Map<String, String> params);

	public void innerInsert(Map<String, String> params);
	
	public void outInsert(Map<String, String> params);
	
}
