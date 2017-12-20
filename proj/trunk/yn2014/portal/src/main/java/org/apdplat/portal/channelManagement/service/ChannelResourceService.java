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
	
	public List<Map<String, Object>> listTreeNode(Map<String, Object> params) {
		return channelResourceDao.listTreeNode(params);
	}
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
	
	@Transactional
	public void addChnlType(String type_name) {
		channelResourceDao.addChnlType(type_name);
	}
	
	@Transactional
	public void addTownType(Map<String, String> params) {
		channelResourceDao.addTownType(params);
	}
	
	@Transactional
	public void updateAgent(Map<String, String> params) {
		channelResourceDao.updateAgent(params);
		channelResourceDao.updateMarkStatus(params);
	}
	
	@Transactional
	public void updateNotAgent(Map<String, String> params) {
		channelResourceDao.updateNotAgent(params);
		channelResourceDao.updateMarkStatus(params);
	}
	
	@Transactional
	public void updateChnlDetail(Map<String, String> params) {
		channelResourceDao.updateChnlDetail(params);
	}
	
	@Transactional
	public void updateChnlInMain(Map<String, String> params) {
		channelResourceDao.updateChnlInMain(params);
	}
	
	@Transactional
	public void updateTownDetail(Map<String, String> params) {
		channelResourceDao.updateTownDetail(params);
	}
	
	@Transactional
	public void updateTownInMain(Map<String, String> params) {
		channelResourceDao.updateTownInMain(params);
	}
	
	public Object listChnlDetail(Map<String, String> resultMap) {
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows = channelResourceDao.listChnlDetail(resultMap);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}
	
	public void delChnlDetail(String id) {
		channelResourceDao.delChnlDetail(id);
	}

	public void delTownDetail(String id) {
		channelResourceDao.delTownDetail(id);
	}
	
	public List<Map<String, Object>> loadChnlType() {
		return channelResourceDao.loadChnlType();
	}

	public List<Map<String, String>> isAgentPoint(Map<String, String> params) {
		return channelResourceDao.isAgentPoint(params);
	}

	public List<Map<String, String>> isHavingMark(Map<String, String> params) {
		return channelResourceDao.isHavingMark(params);
	}

	public List<Map<String, Object>> loadCityType(String hq_chan_code) {
		return channelResourceDao.loadCityType(hq_chan_code);
	}

	public List<Map<String, Object>> loadTownType(Map<String, String> params) {
		return channelResourceDao.loadTownType(params);
	}

	public Object listTownDetail(Map<String, String> resultMap) {
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows = channelResourceDao.listTownDetail(resultMap);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}

	public List<Map<String, Object>> isTownExist(Map<String, String> params) {
		return channelResourceDao.isTownExist(params);
	}

	public List<Map<String, Object>> beforeDelChnlDetail(String id) {
		return channelResourceDao.beforeDelChnlDetail(id);
	}
	
	public List<Map<String, Object>> beforeDelTownDetail(String id) {
		return channelResourceDao.beforeDelTownDetail(id);
	}

	public int count(Map<String, Object> params) {
		return channelResourceDao.count(params);
	}
	public void fymark(Map<String, Object> params) {
		channelResourceDao.fymark(params);
	}
	
    public List<Map<String, Object>> loadBusinessName(Map<String, String> params) {
        return channelResourceDao.loadBusinessName(params);
    }
    
    public List<Map<String, Object>> loadSchoolName(Map<String, String> params) {
        return channelResourceDao.loadSchoolName(params);
    }
	
}
