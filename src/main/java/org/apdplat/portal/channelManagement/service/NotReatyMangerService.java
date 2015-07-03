package org.apdplat.portal.channelManagement.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.portal.channelManagement.dao.NotReatyManagerDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

@Service
public class NotReatyMangerService {

	@Autowired
	private NotReatyManagerDao dao;
	
	/**
	 * 查询无协议渠道组织架构
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> listTreeNode(Map<String, Object> params) {
		return dao.listTreeNode(params);
	}
	
	/**
	 * 查询渠道经理及营服中心负责人信息
	 * @param params
	 * @return
	 * @throws Exception 
	 */
	public Object list(Map<String, String> params) throws Exception {
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows = dao.list(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}
	
	/**
	 * 查询地市
	 */
	public List<Map<String,String>> listArea(Map<String, String> params){
		return dao.listArea(params);
	}
	/**
	 * 查询营服中心
	 */
	public List<Map<String,Object>> listServiceCenter(Map<String, String> params){
		return dao.listServiceCenter(params);
	}
	/**
	 * 查询某地市下是否存在该渠道名称
	 * @return 
	 */
	public List<Map<String,Object>> hasChanlName(Map<String, String> params){
		return dao.hasChanlName(params);
	}
	/**
	 * 根据渠道编码获取渠道名称和编码
	 * @return 
	 */
	public List<Map<String,Object>> getChanlByCode(Map<String, String> params){
		return dao.getChanlByCode(params);
	}
	/**
	 * 获取可以选择的渠道经理列表
	 * @return 
	 */
	public Object listValidUsers(Map<String, String> params){
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows = dao.listValidUsers(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}
	/**
	 * 新增无协议渠道
	 * @param params
	 * @return
	 */
	public int addUnit(Map<String, String> params){
		return dao.addUnit(params);
	}
	/**
	 * 更新无协议渠道
	 * @param params
	 * @return
	 */
    public int updateUnit(Map<String, String> params){
    	return dao.updateUnit(params);
    }
    /**
	 * 失效无协议渠道
	 * @param params
	 * @return
	 */
    public int delUnit(Map<String, String> params){
    	return dao.delUnit(params);
    }
    /**
   	 * 获取无协议渠道
   	 * @param params
   	 * @return
   	 */
   	public Map<String, Object> getUnit(Map<String, String> params){
   		return dao.getUnit(params);
   	}
   	/**
	 * 获取无协议渠道图片
	 * @param params
	 * @return
	 */
	public Map<String, Object> getPic(Map<String, String> params){
		return dao.getPic(params);
	}
}
