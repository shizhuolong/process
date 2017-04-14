package org.apdplat.portal.channelManagement.dao;

import java.util.List;
import java.util.Map;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

public interface BussinessHallInfoDao {

	public PageList<Map<String, Object>> list(Map<String, String> params);

	public List<Map<String, Object>> loadDetails(Map<String, String> params);

	public void update(Map<String, String> resultMap);
	
}
