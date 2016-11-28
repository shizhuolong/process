package org.apdplat.portal.channelManagement.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.portal.channelManagement.dao.ChannelResourceDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

@Service
public class ChannelResourceService {

	@Autowired
	private ChannelResourceDao channelResourceDao;
	
	
	/**
	 * 查询渠道信息
	 * @param params
	 * @return
	 */
	public Object listChannel(Map<String, String> params) {
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows = channelResourceDao.listChannel(params);
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
		PageList<Map<String, Object>> rows = channelResourceDao.listUnit(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}
	
	/**
	 * 将渠道划分到营服中心
	 */
	@Transactional
	public void saveDivideChannel(Map<String, String> params) throws Exception {
		channelResourceDao.updateChanlUnit(params);
		channelResourceDao.updateOrg(params);
		channelResourceDao.updateChannelManager(params);
		channelResourceDao.updateGrpPerson(params);
		channelResourceDao.updateMagPerson(params);
	}
	
	/**
	 * 查询渠道信息
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> queryChanelInfo(Map<String, Object> params) {
		return channelResourceDao.queryChanelInfo(params);
	}
	
	public List<Map<String, Object>> loadChanlDetails(String group_id_4) {
		return channelResourceDao.loadChanlDetails(group_id_4);
	}

	public List<Map<String, Object>> isExist(String type_name) {
		return channelResourceDao.isExist(type_name);
	}

	public void add(String type_name) {
		channelResourceDao.add(type_name);
	}

	public void update(Map<String, String> params) {
		channelResourceDao.update(params);
	}
	
	public void updateDetail1(Map<String, String> params) {
		channelResourceDao.updateDetail1(params);
	}

	public Object listDetail1(Map<String, String> resultMap) {
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows = channelResourceDao.listDetail1(resultMap);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}
	public void delDetail1(String id) {
		channelResourceDao.delDetail1(id);
	}

	public List<Map<String, Object>> loadChnlType() {
		return channelResourceDao.loadChnlType();
	}
}
