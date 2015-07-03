package org.apdplat.portal.channelManagement.dao;

import java.util.Map;




import com.github.miemiedev.mybatis.paginator.domain.PageList;

public interface NetworkManagerDao {

	
	/**
	 * 查询名单制小区及绑定负责人列表
	 * @param params
	 * @return
	 */
	public PageList<Map<String, Object>> listNetworkPerson(Map<String, String> params) throws Exception;
	
	/**
	 * 查询名单制小区可以绑定的人员信息
	 * @param params
	 * @return
	 */
	public PageList<Map<String, Object>> listBindPerson(Map<String, String> params);
	
	/**
	 * 保存名单制小区绑定的负责人
	 * @param params
	 */
	public void saveBindPerson(Map<String, String> params);
	
	/**
	 * 解除名单制小区绑定的负责人
	 * @param params
	 */
	public void deleteBindPerson(Map<String, String> params);
	
}
