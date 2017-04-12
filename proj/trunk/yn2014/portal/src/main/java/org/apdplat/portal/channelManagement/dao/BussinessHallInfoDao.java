package org.apdplat.portal.channelManagement.dao;

import java.util.Map;
import com.github.miemiedev.mybatis.paginator.domain.PageList;

public interface BussinessHallInfoDao {

	public PageList<Map<String, Object>> list(Map<String, String> params);
	
}
