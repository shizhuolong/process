package org.apdplat.portal.channelManagement.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.portal.channelManagement.dao.AgentPersonDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

@Service
public class AgentPersonService {

	@Autowired
	private AgentPersonDao agentPersonDao;

	
	public List<Map<String, Object>> listTreeNode(Map<String, Object> params) {
		return agentPersonDao.listTreeNode(params);
	}

	
	public Object queryAgentPerson(Map<String, String> params) {
		Map<String, Object> result = new HashMap<String, Object>();
		PageList<Map<String, Object>> rows = agentPersonDao
				.queryAgentPerson(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}
	
	@Transactional
	public void del(Map<String, String> m) {
		agentPersonDao.del(m);
	}
	
	@Transactional
	public void insert(Map<String, String> m) {
		agentPersonDao.insert(m);
	}

	@Transactional
	public void update(Map<String, String> m) {
		agentPersonDao.update(m);
	}

	public List<Map<String, String>> findShopkeeper(Map<String, String> m) {
		return agentPersonDao.findShopkeeper(m);
	}

	public List<Map<String, String>> findSalesman(Map<String, String> m) {
		return agentPersonDao.findSalesman(m);
	}

	public List<Map<String, String>> isPhoneExist(Map<String, String> m) {
		return agentPersonDao.isPhoneExist(m);
	}

	public List<Map<String, String>> isAgentOwn(Map<String, String> m) {
		return agentPersonDao.isAgentOwn(m);
	}
	
}
