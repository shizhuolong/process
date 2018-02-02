package org.apdplat.portal.personManagement.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.portal.channelManagement.dao.MagPersonDao;
import org.apdplat.portal.personManagement.dao.HallMagPersonDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

@Service
public class HallMagPersonService {

	@Autowired
	private HallMagPersonDao magPersonDao;

	public Object queryMagPerson(Map<String, String> params) {
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows = magPersonDao.queryMagPerson(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}
	@Transactional
	public void del(Map<String, String> m) {
		magPersonDao.del(m);
	}
	@Transactional
	public void insertToResult(Map<String, String> m) {
		magPersonDao.insertToResult(m);
		magPersonDao.updateGroupId();
	}
	@Transactional
	public void updateGroupId() {
        magPersonDao.updateGroupId();
    }
	
	@Transactional
	public void updateToResult(Map<String, String> m) {
		magPersonDao.updateToResult(m);
	}
	
	public List<Map<String, Object>> query(Map<String, String> params){
        return magPersonDao.query(params);
    }

}
