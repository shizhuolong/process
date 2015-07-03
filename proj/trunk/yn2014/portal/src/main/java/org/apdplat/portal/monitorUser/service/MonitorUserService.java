package org.apdplat.portal.monitorUser.service;

import java.util.HashMap;
import java.util.Map;

import org.apdplat.portal.monitorUser.dao.MonitorUserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

@Service
public class MonitorUserService {
	
	@Autowired
	private MonitorUserDao dao;

	
	/**
	 * 获取监控用户列表
	 * @param params
	 * @return
	 */
	public Object list(Map<String, String> params) {
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows = dao.list(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}
	/**
	 * 新增
	 * @param params
	 * @return
	 */
	public int add(Map<String, String> params){
		return dao.add(params);
	}
	/**
	 * 更新
	 * @param params
	 * @return
	 */
    public int update(Map<String, String> params){
    	return dao.update(params);
    }
    /**
	 * 删除
	 * @param params
	 * @return
	 */
    public int del(String id){
    	return dao.del(id);
    }
}
