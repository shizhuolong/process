package org.apdplat.warningAndMonitor.resourceMonitor.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.warningAndMonitor.resourceMonitor.dao.FreeChannelDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

@Service
public class FreeChannelService {
	
	@Autowired
	private FreeChannelDao freeChannelDao;

	public Object list(Map<String, String> params) {
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows = freeChannelDao.list(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}
	
	/**
	 * 查询组织架构
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> searchSelectOrg(Map<String, Object> params) {
		return freeChannelDao.searchSelectOrg(params);
	}
	
}
