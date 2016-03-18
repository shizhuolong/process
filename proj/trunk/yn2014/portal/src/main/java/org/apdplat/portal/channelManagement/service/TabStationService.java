package org.apdplat.portal.channelManagement.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.portal.channelManagement.dao.TabStationDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.github.miemiedev.mybatis.paginator.domain.PageList;


@Service
public class TabStationService {

	@Autowired
	private TabStationDao dao;
	
	/**
	 * 查询基站管理组织架构
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> listTreeNode(Map<String, Object> params) {
		return dao.listTreeNode(params);
	}
	
	/**
	 * 查询基站列表数据
	 * @param params
	 * @return
	 */
	public Object queryStationList(Map<String, String> params) {
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows = dao.queryStationList(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}
	
	/**
	 * 查询基站信息
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> queryStationInfo(Map<String, Object> params) {
		return dao.queryStationInfo(params);
	}
	
	/**
	 * 查询营服中心
	 * @param params
	 * @return
	 */
	public Object listUnit(Map<String, String> params) {
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows = dao.listUnit(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}
	
	/**
	 * 将基站划分到营服中心
	 */
	@Transactional
	public void saveDivideStation(Map<String, String> params) throws Exception {
		dao.updateStationUnit(params);
	}

	public Object queryStationDetail(Map<String, String> params) {
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows = dao.listDetail(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}

	public List<Map<String, Object>> baseDetail(Map<String, Object> params) {
		return dao.baseDetail(params);
	}
}
