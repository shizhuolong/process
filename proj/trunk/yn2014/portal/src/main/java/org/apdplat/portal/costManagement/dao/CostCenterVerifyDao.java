package org.apdplat.portal.costManagement.dao;

import java.util.List;
import java.util.Map;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

/**
 * 成本中心确认
 * @author xuxuejiang
 *
 */
public interface CostCenterVerifyDao {

	/**
	 * 成本中心列表
	 * @param paramsMap
	 * @return
	 */
	public PageList<Map<String, Object>> findCostCenterList(Map<String, String> paramsMap) throws Exception;
	
	/**
	 * 根据地市编码查询该地市下所有营服
	 * @param regionCode
	 * @return
	 */
	public List<Map<String,String>> findUnitList(String unitName) throws Exception; 
	
	/**
	 * 修改单条成本中心信息
	 * @param paramsMap
	 * @return
	 * @throws Exception
	 */
	public int saveRow(Map<String,String> paramsMap) throws Exception;

	/**
	 * 删除成本中心临时表数据
	 * @return
	 */
	public void deleteCostTemp(Map<String,String> params) throws Exception;

	/**
	 * 验证是否有成本中心名称与码表营服中心名称不一致的数据
	 * @param tempParams
	 * @return
	 */
	public List<Map<String, Object>> queryNotExistsUnits(Map<String, String> tempParams);

	/**
	 * 使用临时表中的数据更新结果表
	 * tempParams
	 * @param tempParams
	 */
	public void updateCostData(Map<String, String> tempParams) throws Exception;


	/**
	 * 根据地市编码查询成本中心表中是否有营服中心名称或编码为空的数据
	 * @param regionCode
	 * @return
	 */
	public List<Map<String, Object>> queryNullUnit(String regionCode);

	/**
	 * 更新成本中心表数据(确认划分成本中心)
	 * @param regionCode
	 */
	public void updateState(String regionCode) throws Exception;

	
	
	public void inserToTmp(List<Map<String,String>> list) throws Exception;
}
