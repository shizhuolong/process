package org.apdplat.portal.order2i2c.service;

import java.util.HashMap;
import java.util.Map;

import org.apdplat.portal.order2i2c.dao.TeamManagerDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

@Service
public class TeamManagerService {

	@Autowired
	private TeamManagerDao teamManagerDao;

	public Object query(Map<String, String> params) {
		Map<String, Object> result = new HashMap<String, Object>();
		PageList<Map<String, Object>> rows = teamManagerDao.query(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}
	
	@Transactional
	public void del(Map<String, String> params) {
		teamManagerDao.del(params);
	}
	
	@Transactional
	public void delDetail(Map<String, String> params) {
		teamManagerDao.delDetail(params);
	}
	
	@Transactional
	public void innerInsert(Map<String, String> params) {
		teamManagerDao.innerInsert(params);
	}
	
	@Transactional
	public void outInsert(Map<String, String> params) {
		teamManagerDao.outInsert(params);
	}
	
}
