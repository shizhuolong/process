package org.apdplat.portal.docManagement.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.portal.docManagement.dao.DocDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

@Service
public class DocService {
	
	@Autowired
	private DocDao dao;

	
	/**
	 * 获取文件列表
	 * @param params
	 * @return
	 */
	public Object listDocs(Map<String, String> params) {
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows = dao.listDocs(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}
	/**
	 * 新增文件
	 * @param params
	 * @return
	 */
	public int addDoc(Map<String, Object> params){
		return dao.addDoc(params);
	}
	/**
	 * 更新文件
	 * @param params
	 * @return
	 */
    public int updateDoc(Map<String, Object> params){
    	return dao.updateDoc(params);
    }
    /**
	 * 删除文件
	 * @param params
	 * @return
	 */
    public int delDoc(String id){
    	return dao.delDoc(id);
    }
    /**
	 * 根据文件ID获取文件信息
	 * @param params
	 * @return
	 */
    public Map<String,Object> getDocById(String id){
    	List<Map<String,Object>> ls=dao.getDocById(id);
    	if(null!=ls&&ls.size()>0){
    		return ls.get(0);
    	}
    	return null;
    }
}
