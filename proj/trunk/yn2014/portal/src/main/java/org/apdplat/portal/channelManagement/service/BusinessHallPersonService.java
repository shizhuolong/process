package org.apdplat.portal.channelManagement.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.portal.channelManagement.dao.BussinessHallPersonDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

@Service
public class BusinessHallPersonService {

	@Autowired
	private BussinessHallPersonDao bussinessHallPersonDao;
	
	/**
	 * 查询渠营业厅与营业员组织架构
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> listTreeNode(Map<String, Object> params) {
		return bussinessHallPersonDao.listTreeNode(params);
	}
	
	/**
	 * 询渠营业厅与营业员信息
	 * @param params
	 * @return
	 */
	public Object queryMagPerson(Map<String, String> params) {
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows = bussinessHallPersonDao.queryMagPerson(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}

	public void del(Map<String, String> m) {
		bussinessHallPersonDao.del(m);
	}

	public void insert(Map<String, String> m) {
		bussinessHallPersonDao.insert(m);
	}
    @Transactional
	public void update(Map<String, String> m) {
		bussinessHallPersonDao.update(m);
	}
    @Transactional
	public void merge(Map<String, String> m) {
		bussinessHallPersonDao.merge(m);
	}
}
