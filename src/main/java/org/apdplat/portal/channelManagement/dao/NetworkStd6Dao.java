package org.apdplat.portal.channelManagement.dao;

import java.util.List;
import java.util.Map;





import com.github.miemiedev.mybatis.paginator.domain.PageList;

public interface NetworkStd6Dao {

	/**
	 * 查询固网名单制小区清单
	 * @param params
	 * @return
	 */
	public PageList<Map<String, Object>> listNetworkStd6(Map<String, String> params);
	
	/**
	 * 查询营服中心
	 * @param params
	 * @return
	 */
	public PageList<Map<String, Object>> listUnit(Map<String, String> params);
	
	/**
	 * 更新名单制小区归属的营服中心
	 * @param params
	 */
	public void updateStd6(Map<String, String> params);
	
	/**
	 * 删除名单制小区绑定的负责人
	 * @param params
	 */
	public void deleteStd6BindPerson(Map<String, String> params);
	
	/**
	 * 修改名单制小区信息
	 * @param params
	 */
	public void update(Map<String, String> params);
	
	/**
	 * 根据名单制小区编码获取名单制小区信息
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> loadById(String std_6_id);

	public void bind(Map<String, String> params);
}
