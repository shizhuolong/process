package org.apdplat.portal.channelManagement.dao;

import java.util.List;
import java.util.Map;

import com.github.miemiedev.mybatis.paginator.domain.PageList;


public interface TabStationDao {

	/**
	 * 查询基站管理组织架构
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> listTreeNode(Map<String, Object> params);
	
	/**
	 * 查询基站列表数据
	 * @param params
	 * @return
	 */
	public PageList<Map<String, Object>> queryStationList(Map<String, String> params);
	
	/**
	 * 查询基站信息
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> queryStationInfo(Map<String, Object> params);
	
	/**
	 * 查询营服中心
	 * @param params
	 * @return
	 */
	public PageList<Map<String, Object>> listUnit(Map<String, String> params);
	
	/**
	 * 更新基站表中渠道归属的营服中心
	 * @param params
	 */
	public void updateStationUnit(Map<String, String> params);

	public PageList<Map<String, Object>> listDetail(Map<String, String> params);

	public List<Map<String, Object>> baseDetail(Map<String, Object> params);
	
}
