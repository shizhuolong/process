package org.apdplat.portal.channelSubsidyPay.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.github.miemiedev.mybatis.paginator.domain.PageList;


public interface ChannelSubsidyPayDao {
	/**
	 * 通过工单编号查询数据
	 * @param params
	 * @return
	 */
	public PageList<Map<String, Object>> listByWorkNo(Map<String, String> params);
	/**
	 * 查询某地市某账期的数据
	 * @param params
	 * @return
	 */
	public  List<Map<String, Object>>  getAllRegionDealersByTaskId(Map<String, String> params);
	/**
	 * 查询所有地市及所对应的审批人
	 * @param params
	 * @return
	 */
	public  List<Map<String, Object>>  getDealersByTaskIdAndRegionCode(Map<String, String> params);
	/**
	 * 查询某地市及所对应的审批人
	 * @param params
	 * @return
	 */
	public int getDataListCount(Map<String, String> params);
	
	/**
	 * 将工单编号更新到表中且将状态设置为拟稿人提交
	 * @param params
	 */
	public void updateDataWorkNo(Map<String, String> params);
	
	void updateJf(Map<String, Object> m);
	
	/**
	 * 更新状态
	 * @param workNo
	 */
	public void updateStatus(@Param("workNo") String workNo,@Param("status") String status);
}
