package org.apdplat.portal.channelManagement.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.portal.channelManagement.dao.GrpManagerDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

/**
 * @author only
 *
 */
@Service
public class GrpMangerService {
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	@Autowired
	private GrpManagerDao dao;
	
	/**
	 * 修改集客经理
	 * @param params
	 * @return
	 */
	@Transactional
	public int updateGrpPerson(Map<String, String> params) {
		try {
			dao.updateGrp(params);
			dao.meregIntoGrp(params);
			return 1;
		} catch (Exception e) {
			logger.error("修改集客经理失败",e);
			return 0;
		}
	}
	
	
	/**
	 * 修改集客经理时候验证hr编码
	 * @param params
	 * @return
	 * @throws Exception 
	 */
	public Map<String,String> checkHrCode(Map<String,String> params) throws Exception{
		return dao.checkHrCode(params);
	}
	
	/**
	 * 修改集客经理时候验证渠道编码
	 * @param params
	 * @return
	 * @throws Exception 
	 */
	public Map<String,String>  checkChannelCode(Map<String,String> params) throws Exception{
		return dao.checkChannelCode(params);
	}
	
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
	
	/**
	 * 查询发展人编码
	 * @param resultMap
	 * @return
	 */
	public Object searchDevNum(Map<String, String> params) {
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows = dao.searchDevNum(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}
	/**
	 * 删除集客经理
	 * @param map
	 * @return 
	 */
	public int delGrpPerson(Map<String, Object> map) {
		return dao.delGrpPerson(map);
	}

	/**
	 * 查询Hr编码
	 * @param resultMap
	 * @return
	 */
	public Map<String, Object> searchHrNum(Map<String, String> params) {
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows = dao.searchHrNum(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}

	/**
	 * 新增集客经理
	 * @param resultMap
	 * @return
	 */
	public int addGrpManager(Map<String, Object> params) {
		return dao.addGrpManager(params);
	}



	
}
