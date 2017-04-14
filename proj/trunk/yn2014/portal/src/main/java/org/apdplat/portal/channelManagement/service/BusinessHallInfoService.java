package org.apdplat.portal.channelManagement.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.portal.channelManagement.dao.BussinessHallInfoDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

	public List<Map<String, Object>> loadDetails(Map<String, String> params) {
		return dao.loadDetails(params);
	}
	
    @Transactional
	public void update(Map<String, String> resultMap) {
		dao.update(resultMap);
	}
	
}
