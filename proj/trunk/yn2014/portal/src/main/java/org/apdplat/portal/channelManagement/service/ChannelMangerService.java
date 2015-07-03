package org.apdplat.portal.channelManagement.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.portal.channelManagement.dao.ChannelManagerDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

@Service
public class ChannelMangerService {

	@Autowired
	private ChannelManagerDao channelManagerDao;
	
	/**
	 * 查询渠道经理及营服中心负责人组织架构
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> listTreeNode(Map<String, Object> params) {
		return channelManagerDao.listTreeNode(params);
	}
	
	/**
	 * 查询渠道经理及营服中心负责人信息
	 * @param params
	 * @return
	 * @throws Exception 
	 */
	public Object queryMobPerson(Map<String, String> params) throws Exception {
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows = channelManagerDao.queryMobPerson(params);
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
		PageList<Map<String, Object>> rows = channelManagerDao.listBindPerson(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}
	
	/**
	 * 保存绑定渠道经理及营服中心负责人
	 * @param params
	 */
	public void saveBindPerson(Map<String, String> params) throws Exception {
		channelManagerDao.saveBindPerson(params);
	}
	
	/**
	 * 渠道经理及营服中心负责人解绑
	 */
	public void updateBindPerson(Map<String, String> params) throws Exception {
		channelManagerDao.updateBindPerson(params);
	}
}
