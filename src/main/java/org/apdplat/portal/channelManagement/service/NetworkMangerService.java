package org.apdplat.portal.channelManagement.service;

import java.util.HashMap;
import java.util.Map;

import org.apdplat.portal.channelManagement.dao.NetworkManagerDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

@Service
public class NetworkMangerService {

	@Autowired
	private NetworkManagerDao networkManagerDao;
	
	/**
	 * 查询名单制小区及绑定负责人列表
	 * @param params
	 * @return
	 * @throws Exception 
	 */
	public Object listNetworkPerson(Map<String, String> params) throws Exception {
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows = networkManagerDao.listNetworkPerson(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}
	
	/**
	 * 查询名单制小区可以绑定的人员信息
	 * @param params
	 * @return
	 */
	public Object listBindPerson(Map<String, String> params) {
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows = networkManagerDao.listBindPerson(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}
	
	/**
	 * 保存绑定名单制小区负责人
	 * @param params
	 */
	@Transactional
	public void saveBindPerson(Map<String, String> params) throws Exception {
		networkManagerDao.saveBindPerson(params);
	}
	
	/**
	 * 解除名单制小区绑定的负责人
	 * @param params
	 * @throws Exception
	 */
	@Transactional
	public void deleteBindPerson(Map<String, String> params) throws Exception {
		networkManagerDao.deleteBindPerson(params);
	}
	
}
