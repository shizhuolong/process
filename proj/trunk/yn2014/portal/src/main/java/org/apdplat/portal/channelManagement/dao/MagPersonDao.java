package org.apdplat.portal.channelManagement.dao;

import java.util.List;
import java.util.Map;












import com.github.miemiedev.mybatis.paginator.domain.PageList;

public interface MagPersonDao {

	public List<Map<String, Object>> listTreeNode(Map<String, Object> params);
	
	public PageList<Map<String, Object>> queryMagPerson(Map<String, String> params);
	
	public void del(Map<String, String> m);
	
	public void insertToResult(Map<String, String> m);
    
	public void updateToResult(Map<String, String> m);

	public void updateWithCode(Map<String, String> m);

	public List<Map<String, String>> checkChanCode(Map<String, String> m);
}
