package org.apdplat.portal.channelManagement.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.portal.channelManagement.dao.NetworkStd6Dao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

@Service
public class NetworkStd6Service {

	@Autowired
	private NetworkStd6Dao networkStd6Dao;
	
	
	/**
	 * 查询固网名单制小区清单
	 * @param params
	 * @return
	 * @throws Exception 
	 */
	public Object listNetworkStd6(Map<String, String> params) {
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows = networkStd6Dao.listNetworkStd6(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}
	
	/**
	 * 查询营服中心
	 * @param params
	 * @return
	 */
	public Object listUnit(Map<String, String> params) {
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows = networkStd6Dao.listUnit(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}
	
	/**
	 * 划分名单制小区归属
	 */
	@Transactional
	public void saveDivideStd6(Map<String, String> params) throws Exception {
		networkStd6Dao.updateStd6(params);
		networkStd6Dao.deleteStd6BindPerson(params);
	}
	
	@Transactional
	public void update(Map<String, String> params) throws Exception {
		networkStd6Dao.update(params);
	}
	
	/**
	 * 根据名单制小区编码获取名单制小区信息
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> loadById(String std_6_id) {
		return networkStd6Dao.loadById(std_6_id);
	}
   /**同步更新小区代理商人员管理*/
	public void bind(Map<String, String> params) {
		networkStd6Dao.bind(params);
	}
	
}
