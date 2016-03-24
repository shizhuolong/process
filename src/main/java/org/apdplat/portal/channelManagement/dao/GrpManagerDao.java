package org.apdplat.portal.channelManagement.dao;

import java.util.List;
import java.util.Map;













import com.github.miemiedev.mybatis.paginator.domain.PageList;

public interface GrpManagerDao {
	
	/**
	 * 更新集客经理(1)
	 * @param params
	 * @return 
	 */
	public Object updateGrp(Map<String, String> params) throws Exception;

	/**
	 * 更新集客经理(2)
	 * @param params
	 * @return 
	 */
	public Object meregIntoGrp(Map<String, String> params) throws Exception;
	
	/**
	 * 修改集客经理时候验证hr编码
	 * @param params
	 * @return
	 */
	public Map<String,String> checkHrCode(Map<String,String> params) throws Exception;
	
	/**
	 * 修改集客经理时候验证渠道编码
	 * @param params
	 * @return
	 */
	public Map<String,String> checkChannelCode(Map<String,String> params) throws Exception;

	/**
	 * 查询集客的客户经理及渠道经理组织架构
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> listTreeNode(Map<String, Object> params);
	
	/**
	 * 询集客的客户经理及渠道经理信息
	 * @param params
	 * @return
	 */
	public PageList<Map<String, Object>> queryGrpPerson(Map<String, String> params);

	/**
	 * 删除集客经理
	 * @param map
	 * @return 
	 */
	public int delGrpPerson(Map<String, Object> map);

	/**
	 * 查询发展人编码
	 * @param params
	 * @return
	 */
	public PageList<Map<String, Object>> searchDevNum(Map<String, String> params);

	/**
	 * 查询hr编码
	 * @param params
	 * @return
	 */
	public PageList<Map<String, Object>> searchHrNum(Map<String, String> params);

	/**
	 * 新增集客经理
	 * @param params
	 * @return
	 */
	public int addGrpManager(Map<String, Object> params);

	
	
}
