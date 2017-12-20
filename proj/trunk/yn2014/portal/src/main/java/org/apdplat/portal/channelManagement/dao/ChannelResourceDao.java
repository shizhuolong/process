package org.apdplat.portal.channelManagement.dao;

import java.util.List;
import java.util.Map;




























import com.github.miemiedev.mybatis.paginator.domain.PageList;

public interface ChannelResourceDao {
	
	public List<Map<String, Object>> listTreeNode(Map<String, Object> params);
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

	public void addChnlType(String type_name);
	
	public void addTownType(Map<String, String> params);

	public void updateAgent(Map<String, String> params);
	
	public void updateNotAgent(Map<String, String> params);

	public PageList<Map<String, Object>> listChnlDetail(Map<String, String> resultMap);

	public void updateChnlDetail(Map<String, String> params);
	
	public void updateChnlInMain(Map<String, String> params);
	
	public void updateTownDetail(Map<String, String> params);
	
	public void updateTownInMain(Map<String, String> params);

	public void delChnlDetail(String id);
	
	public void delTownDetail(String id);

	public List<Map<String, Object>> loadChnlType();

	public List<Map<String, String>> isAgentPoint(Map<String, String> params);

	public List<Map<String, String>> isHavingMark(Map<String, String> params);

	public List<Map<String, Object>> loadCityType(String hq_chan_code);

	public List<Map<String, Object>> loadTownType(Map<String, String> params);

	public PageList<Map<String, Object>> listTownDetail(Map<String, String> resultMap);

	public List<Map<String, Object>> isTownExist(Map<String, String> params);

	public List<Map<String, Object>> beforeDelChnlDetail(String id);
	
	public List<Map<String, Object>> beforeDelTownDetail(String id);

	public int count(Map<String, Object> params);
	
	public void updateMarkStatus(Map<String, String> params);
	
	public void fymark(Map<String, Object> params);
	
    public List<Map<String, Object>> loadBusinessName(Map<String, String> params);
    
    public List<Map<String, Object>> loadSchoolName(Map<String, String> params);
}
