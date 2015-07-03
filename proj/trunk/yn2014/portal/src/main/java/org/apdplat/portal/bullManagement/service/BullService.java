package org.apdplat.portal.bullManagement.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.portal.bullManagement.dao.BullDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

@Service
public class BullService {
	
	@Autowired
	private BullDao dao;

	
	/**
	 * 获取公告列表
	 * @param params
	 * @return
	 */
	public Object listBulls(Map<String, String> params) {
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows = dao.listBulls(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}
	/**
	 * 新增公告
	 * @param params
	 * @return
	 */
	public int addBull(Map<String, Object> params){
		return dao.addBull(params);
	}
	/**
	 * 更新公告
	 * @param params
	 * @return
	 */
    public int updateBull(Map<String, Object> params){
    	return dao.updateBull(params);
    }
    /**
	 * 删除公告
	 * @param params
	 * @return
	 */
    public int delBull(String id){
    	return dao.delBull(id);
    }
}
