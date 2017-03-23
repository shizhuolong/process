package org.apdplat.portal.order2i2c.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

public interface T2I2CDao {

	/**
	 * 查询未分配订单列表
	 * @param params
	 * @return
	 */
	public PageList<Map<String, Object>> undistributedOrderList(Map<String, String> params);
	

	/**
	 * 查询任务明细
	 * @param params
	 * @return
	 */
	public PageList<Map<String, Object>> taskListDetail(Map<String, String> params);
	/**
	 * 查寻团队
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> getTeamByParentId(@Param("pId") String pId,@Param("regionCode") String regionCode);
	/**
	 * 查寻团队
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> getTeamByWorkNo(@Param("pId") String pId,@Param("workNo") String workNo);
	
	/**
	 * 变更状态
	 * @param params
	 * @return
	 */
	public void updateStatus(@Param("status") String status,@Param("workNo") String workNo);
}
