package org.apdplat.portal.channelManagement.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.portal.channelManagement.dao.ChnlPersonDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

@Service
public class ChnlPersonService {

	@Autowired
	private ChnlPersonDao chnlPersonDao;
	
	public Object listPerson(Map<String, String> params) throws Exception {
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows = chnlPersonDao.listPerson(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}

	public List<Map<String, Object>> listTreeNode(Map<String, Object> params) {
		return chnlPersonDao.listTreeNode(params);
	}

	public void bind(Map<String, String> params) {
		chnlPersonDao.bind(params);
	}

	public void unBind(Map<String, String> params) {
		chnlPersonDao.unBind(params);
	}
	
}
