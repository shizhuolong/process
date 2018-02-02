package org.apdplat.portal.personManagement.dao;

import java.util.List;
import java.util.Map;



















import com.github.miemiedev.mybatis.paginator.domain.PageList;

public interface HallMagPersonDao {

	public PageList<Map<String, Object>> queryMagPerson(Map<String, String> params);
	
	public void del(Map<String, String> m);
	
	public void insertToResult(Map<String, String> m);
    
	public void updateToResult(Map<String, String> m);

    public void updateGroupId();

    public List<Map<String, Object>> query(Map<String, String> params);
}
