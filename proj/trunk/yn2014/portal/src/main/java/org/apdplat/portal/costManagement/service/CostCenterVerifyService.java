package org.apdplat.portal.costManagement.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.portal.costManagement.dao.CostCenterVerifyDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

/**
 * 成本中心确认
 * @author xuxuejiang
 *
 */
@Service
public class CostCenterVerifyService {

	@Autowired
	private CostCenterVerifyDao dao;
	
	/**
	 * 成本中心列表
	 * @param paramsMap
	 * @return
	 * @throws Exception 
	 */
	public Map<String,Object> findCostCenterList(Map<String, String> paramsMap) throws Exception {
		Map<String, Object> result = new HashMap<String, Object>();
		PageList<Map<String, Object>> rows = dao.findCostCenterList(paramsMap);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}

	/**
	 * 根据地市编码查询该地市下所有营服
	 * @param unitName
	 * @return
	 * @throws Exception
	 */
	public List<Map<String,String>> findUnitList(String unitName) throws Exception{
		return dao.findUnitList(unitName);
	}
	
	/**
	 * 修改单条成本中心信息
	 * @param paramsMap
	 * @return
	 * @throws Exception
	 */
	@Transactional
	public int saveRow(Map<String,String> paramsMap) throws Exception{
		return dao.saveRow(paramsMap);
	}
	
	/**
	 * 删除成本中心临时表数据
	 * @throws Exception 
	 */
	@Transactional
	public void deleteCostTemp(Map<String,String> params) throws Exception {
		 dao.deleteCostTemp(params);
	}

	/**
	 * 验证是否有成本中心名称与码表营服中心名称不一致的数据
	 * @param tempParams
	 * @return
	 */
	public List<Map<String, Object>> queryNotExistsUnits(Map<String, String> tempParams) {
		return dao.queryNotExistsUnits(tempParams);
	}

	/**
	 * 使用临时表中的数据更新结果表
	 * @param tempParams
	 * @throws Exception 
	 */
	@Transactional                                                                                                                                              
	public void updateCostData(Map<String, String> tempParams) throws Exception {
		dao.updateCostData(tempParams);
	}

	@Transactional
	public void inserToTmp(List<Map<String,String>> list) throws Exception {
		dao.inserToTmp(list);
	}

	/**
	 * 根据地市编码查询成本中心表中是否有营服中心名称或编码为空的数据
	 * @param regionCode
	 * @return
	 */
	public List<Map<String, Object>> queryNullUnit(String regionCode) {
		return dao.queryNullUnit(regionCode);
	}

	/**
	 * 更新成本中心表数据(确认划分成本中心)
	 * @param regionCode
	 * @throws Exception 
	 */
	public void updateState(String regionCode) throws Exception {
		dao.updateState(regionCode);
	}
 }
