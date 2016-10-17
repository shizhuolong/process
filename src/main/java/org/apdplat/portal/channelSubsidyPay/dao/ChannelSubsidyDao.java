package org.apdplat.portal.channelSubsidyPay.dao;

import java.util.Map;

import com.github.miemiedev.mybatis.paginator.domain.PageList;


public interface ChannelSubsidyDao {
	/**
	 * 更新
	 * @param params
	 * @return 
	 */
	public Object updateSubsidy(Map<String, String> params) throws Exception;
	/**
	 * 验证渠道编码，本地市下是否存在，同时带出渠道名称
	 * @param params
	 * @return
	 */
	public Map<String,String> checkCode(Map<String,String> params) throws Exception;
	public Map<String,String> existCode(Map<String,String> params) throws Exception;
	
	/**
	 * 查询
	 * @param params
	 * @return
	 */
	public PageList<Map<String, Object>> listSubsidy(Map<String, String> params);

	/**
	 * 删除
	 * @param map
	 * @return 
	 */
	public int deleteSubsidy(Map<String, String> map);
	/**
	 * 新增
	 * @param params
	 * @return
	 */
	public int addSubsidy(Map<String, String> params);	
}
