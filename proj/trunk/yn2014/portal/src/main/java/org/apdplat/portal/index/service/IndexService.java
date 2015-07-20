package org.apdplat.portal.index.service;

import java.util.List;
import java.util.Map;

import org.apdplat.portal.index.dao.IndexDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class IndexService {
	
	@Autowired
	private IndexDao indexDao;

	/**
	 * 查询日收入和发展量
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> searchIncomeAndDev(Map<String, Object> params) {
		return indexDao.searchIncomeAndDev(params);
	}
	/**
	 * 查询佣金
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> searchYj(Map<String, Object> params) {
		return indexDao.searchYj(params);
	}
	/**
	 * 查询实时发展
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> searchRealTimeDev(Map<String, Object> params) {
		return indexDao.searchRealTimeDev(params);
	}
	
	/**
	 * 日发展用户数据图表数据查询
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> listIncomeAndDevChart(Map<String, Object> params) {
		return indexDao.listIncomeAndDevChart(params);
	}
	
	/**
	 * 日净增收入图表数据查询
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> listNetIncomeChart(Map<String, Object> params) {
		return indexDao.listNetIncomeChart(params);
	}
	/**
	 * 查询渠道位置
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> listChanlPositions(Map<String, Object> params){
		return indexDao.listChanlPositions(params);
	}
	/**
	 * 根据位置获取渠道信息
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> getChanlPosition(Map<String, Object> params){
		return indexDao.getChanlPosition(params);
	}
	/**
	 * 查询基站位置
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> listJZPositions(Map<String, Object> params){
		return indexDao.listJZPositions(params);
	}
	/**
	 * 根据位置获基站道信息
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> getJZPosition(Map<String, Object> params){
		return indexDao.getJZPosition(params);
	}
	/**
	 * 最新公告
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> listBulls(Map<String, Object> params) {
		return indexDao.listBulls(params);
	}
	/**
	 * 销售排行
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> listXsph(Map<String, Object> params) {
		return indexDao.listXsph(params);
	}
	/**
	 * 获取公告内容
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> getBullById(Map<String, Object> params) {
		return indexDao.getBullById(params);
	}
	
	/**
	 * 文件下载
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> listDoc(Map<String, Object> params) {
		return indexDao.listDoc(params);
	}
	
	/**
	 * 游离渠道
	 * @param params
	 * @return
	 */
	public int freeChannel(Map<String, Object> params) {
		return indexDao.freeChannel(params);
	}
}
