package org.apdplat.portal.channelManagement.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.portal.channelManagement.dao.GrpManagerDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

@Service
public class GrpMangerService {

	@Autowired
	private GrpManagerDao dao;
	
	/**
	 * 查询集客的客户经理及渠道经理组织架构
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> listTreeNode(Map<String, Object> params) {
		return dao.listTreeNode(params);
	}
	
	/**
	 * 询集客的客户经理及渠道经理信息
	 * @param params
	 * @return
	 */
	public Object queryGrpPerson(Map<String, String> params) {
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows = dao.queryGrpPerson(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}
}
