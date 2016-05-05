package org.apdplat.portal.channelManagement.dao;

import java.util.List;
import java.util.Map;



import com.github.miemiedev.mybatis.paginator.domain.PageList;

public interface UnitManagerDao {

	/**
	 * 查询营服中心负责人管理组织架构
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> listTreeNode(Map<String, Object> params);
	
	/**
	 * 查询营服中心负责人信息
	 * @param params
	 * @return
	 */
	public PageList<Map<String, Object>> queryMobPerson(Map<String, String> params) throws Exception;
	
	/**
	 * 查询可以绑定的人员信息
	 * @param params
	 * @return
	 */
	public PageList<Map<String, Object>> listBindPerson(Map<String, String> params);
	
	/**
	 * 保存绑定营服中心负责人
	 * @param params
	 */
	public void saveBindPerson(Map<String, String> params);
	
	/**
	 * 营服中心负责人解绑
	 */
	public void updateBindPerson(Map<String, String> params);
    /**
     * 删除唯一身份
     * */
	public void deleteQjPerson(Map<String, String> params);
}
