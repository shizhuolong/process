package org.apdplat.portal.channelManagement.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.portal.channelManagement.dao.UnitManagerDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

@Service
public class UnitMangerService {

	@Autowired
	private UnitManagerDao unitManagerDao;
	
	/**
	 * 查询营服中心负责人管理组织架构
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> listTreeNode(Map<String, Object> params) {
		return unitManagerDao.listTreeNode(params);
	}
	
	/**
	 * 查询营服中心负责人信息
	 * @param params
	 * @return
	 * @throws Exception 
	 */
	public Object queryMobPerson(Map<String, String> params) throws Exception {
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows = unitManagerDao.queryMobPerson(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}
	
	/**
	 * 查询可以绑定的人员信息
	 * @param params
	 * @return
	 */
	public Object listBindPerson(Map<String, String> params) {
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows = unitManagerDao.listBindPerson(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}
	
	/**
	 * 保存绑定营服中心负责人
	 * @param params
	 */
	@Transactional
	public void saveBindPerson(Map<String, String> params) throws Exception {
		unitManagerDao.saveBindPerson(params);
	}
	
	/**
	 * 营服中心负责人解绑
	 */
	@Transactional
	public void updateBindPerson(Map<String, String> params) throws Exception {
		unitManagerDao.updateBindPerson(params);
	}
	@Transactional
	public void deleteQjPerson(Map<String, String> params) {
		unitManagerDao.deleteQjPerson(params);
	}
}
