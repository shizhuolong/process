package org.apdplat.portal.channelManagement.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.portal.channelManagement.dao.QJPersonDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

@Service
public class QJPersonService {

	@Autowired
	private QJPersonDao qjPersonDao;
		
	public List<Map<String, Object>> listTreeNode(Map<String, Object> params) {
		return qjPersonDao.listTreeNode(params);
	}
	
	public Object queryMagPerson(Map<String, String> params) {
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows = qjPersonDao.queryMagPerson(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}
	public void del(Map<String, String> m) {
		qjPersonDao.del(m);
	}
	public void insertToResult(Map<String, String> m) {
		qjPersonDao.insertToResult(m);
	}
/*	public void updateToResult(Map<String, String> m) {
		qjPersonDao.updateToResult(m);
	}*/
	public Map<String, String> isHrIdRepeat(String hr_id) {
		return qjPersonDao.isHrIdRepeat(hr_id);
	}
	
}
