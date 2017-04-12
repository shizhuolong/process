package org.apdplat.portal.channelManagement.service;

import java.util.HashMap;
import java.util.Map;

import org.apdplat.portal.channelManagement.dao.BussinessHallInfoDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

@Service
public class BusinessHallInfoService {

	@Autowired
	private BussinessHallInfoDao dao;
	
	public Object list(Map<String, String> params) {
		Map<String, Object> result = new HashMap<String, Object>();
		PageList<Map<String, Object>> rows = dao
				.list(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}
	
}
