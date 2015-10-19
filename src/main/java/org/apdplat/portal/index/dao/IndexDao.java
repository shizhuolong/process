package org.apdplat.portal.index.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface IndexDao {

	/**
	 * 查询日收入和发展量
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> searchIncomeAndDev(Map<String, Object> params);
	/**
	 * 查询佣金
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> searchYj(Map<String, Object> params);
	/**
	 * 查询实时发展
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> searchRealTimeDev(Map<String, Object> params);
	
	/**
	 * 日发展用户图表数据查询
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> listIncomeAndDevChart(Map<String, Object> params);
	
	/**
	 * 日净增收入图表数据查询
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> listNetIncomeChart(Map<String, Object> params);
	/**
	 * 查询渠道位置
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> listChanlPositions(Map<String, Object> params);
	/**
	 * 根据位置获取渠道信息
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> getJZPosition(Map<String, Object> params);
	/**
	 * 查询基站位置
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> listJZPositions(Map<String, Object> params);
	/**
	 * 根据位置获取基站信息
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> getChanlPosition(Map<String, Object> params);
	/**
	 * 最新公告
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> listBulls(Map<String, Object> params);
	/**
	 * 销售排行
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> listXsph(Map<String, Object> params);
	/**
	 * 积分排行
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> listJfph(Map<String, Object> params);
	
	/**
	 * 根据公告ID获取公告内容
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> getBullById(Map<String, Object> params);
	
	/**
	 * 文件下载
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> listDoc(Map<String, Object> params);
	
	/**
	 * 游离渠道
	 * @param params
	 * @return
	 */
	public int freeChannel(Map<String, Object> params);
	
	/**
	 * 游离小区
	 * @param params
	 * @return
	 */
	public int freeCommunity(Map<String, Object> params);
	
	
	public int addDesk(Map<String, Object> params);
	
    public int delDesk(String userId);
    
    /**
	 * 添加访问次数
	 */
	
	public int addAccessTimes(Map<String, Object> params);
	/**
	 * 访问统计列表
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> listAccess(Map<String, Object> params);
	
}
