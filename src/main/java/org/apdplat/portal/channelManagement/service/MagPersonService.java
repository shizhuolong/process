package org.apdplat.portal.channelManagement.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.portal.channelManagement.dao.MagPersonDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

@Service
public class MagPersonService {

	@Autowired
	private MagPersonDao magPersonDao;
		
	public List<Map<String, Object>> listTreeNode(Map<String, Object> params) {
		return magPersonDao.listTreeNode(params);
	}
	
	public Object queryMagPerson(Map<String, String> params) {
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows = magPersonDao.queryMagPerson(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}
	public void del(Map<String, String> m) {
		magPersonDao.del(m);
	}
	public void insertToResult(Map<String, String> m) {
		magPersonDao.insertToResult(m);
	}
	@Transactional
	public void updateToResult(Map<String, String> m) {
		magPersonDao.updateToResult(m);
	}
	@Transactional
	public void updateWithCode(Map<String, String> m) {
		magPersonDao.updateWithCode(m);
	}

	public List<Map<String, String>> checkChanCode(Map<String, String> m) {
		return magPersonDao.checkChanCode(m);
	}
	
}
