package org.apdplat.portal.channelManagement.dao;

import java.util.List;
import java.util.Map;











import com.github.miemiedev.mybatis.paginator.domain.PageList;

public interface ChannelResourceDao {

	/**
	 * 查询渠道信息
	 * @param params
	 * @return
	 */
	public PageList<Map<String, Object>> listChannel(Map<String, String> params);
	
	/**
	 * 查询营服中心
	 * @param params
	 * @return
	 */
	public PageList<Map<String, Object>> listUnit(Map<String, String> params);
	
	/**
	 * 更新渠道负责人表
	 * @param params
	 */
	public void updateChannelManager(Map<String, String> params);
	
	/**
	 * 更新APDP_ORG表中渠道归属的营服中心
	 */
	public void updateOrg(Map<String, String> params);
	
	/**
	 * 更新渠道表中渠道归属的营服中心
	 * @param params
	 */
	public void updateChanlUnit(Map<String, String> params);
	
	/**
	 * 更新集客经理表
	 * @param params
	 */
	public void updateGrpPerson(Map<String, String> params);
	
	/**
	 * 更新营业人员表
	 * @param params
	 */
	public void updateMagPerson(Map<String, String> params);
	
	/**
	 * 查询渠道信息
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> queryChanelInfo(Map<String, Object> params);
	
	/**
	 * 查询渠道明细
	 * @param group_id_4
	 * @return
	 */
	public List<Map<String, Object>> loadChanlDetails(String group_id_4);

	public List<Map<String, Object>> isExist(String type_name);

	public void add(String type_name);

	public void update(Map<String, String> params);

	public PageList<Map<String, Object>> listDetail1(Map<String, String> resultMap);

	public void updateDetail1(Map<String, String> params);

	public void delDetail1(String id);

	public List<Map<String, Object>> loadChnlType();
}
