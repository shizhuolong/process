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
}
