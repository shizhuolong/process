package org.apdplat.portal.channelManagement.service;

import java.util.HashMap;
import java.util.Map;

import org.apdplat.portal.channelManagement.dao.FreeCommunityManagerDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

@Service
public class FreeCommunityManagerService {
	@Autowired
	private FreeCommunityManagerDao dao;
	
	public Object listUnit(Map<String, String> params) {
		Map<String,Object> result = new HashMap<String, Object>();
		PageList<Map<String,Object>> rows = dao.listUnit(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}

	/**
	 * 划分游离小区归属
	 * @return
	 */
	public Object saveFreeCommunity(Map<String, Object> params) throws Exception{
		
		return dao.updateFreeCommunity(params);
	}


}
