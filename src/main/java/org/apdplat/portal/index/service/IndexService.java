package org.apdplat.portal.index.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.portal.index.dao.IndexDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

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
	 * 公告弹窗
	 * @param id
	 * @return
	 */
	public List<Map<String, Object>> queryAlertBulls(String id) {
		return indexDao.queryAlertBulls(id);
	}
	
	/**
	 * 用户确认弹出公告后把公告信息插入到数据库
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public int addAlertBull(Map<String,String> params) throws Exception{
		return  indexDao.addAlertBull(params);
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
	 * 积分排行
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> listJfph(Map<String, Object> params) {
		return indexDao.listJfph(params);
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
	
	
	/**
	 * 游离小区
	 * @param params
	 * @return
	 */
	public int freeCommunity(Map<String, Object> params) {
		return indexDao.freeCommunity(params);
	}
	/**
	 * 保存工作台
	 * @param params
	 * @return
	 */
	public int saveDesk(String moduleIds,String userId){
		indexDao.delDesk(userId);
		Map<String, Object> params=new HashMap<String, Object>();
		params.put("userId", userId);
		params.put("moduleIds", moduleIds);
		return indexDao.addDesk(params);
	}
	/**
	 * 添加访问次数
	 */
	@Transactional
	public int addAccessTimes(String userId,String url,String text) throws Exception{
		    Map<String, Object> params=new HashMap<String, Object>();
			params.put("userId", userId);
			params.put("url", url);
			params.put("text", text);
			int r=indexDao.addAccessTimes(params);
			indexDao.addAccessTimeDetail(params);
			return r;
	}
	/**
	 * 访问统计列表
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> listAccess(String userId,int number){
		Map<String, Object> params=new HashMap<String, Object>();
		params.put("userId", userId);
		params.put("number", number);
		return indexDao.listAccess(params);
	}
	public Map<String, Object> searchLeftRankData(Map<String, Object> params) {
		Map<String,Object> r=new HashMap<String,Object>();   
		r=indexDao.searchLeftRankData(params);
		Map<String,Object> maxDate=indexDao.getMaxDateTop();
		params.put("maxDate", maxDate.get("MAXDATE"));
		Map<String,Object> m=indexDao.searchLeftTopData(params);
		if(r==null){
			r=new HashMap<String,Object>();
		}
		if(m!=null){
			r.put("LJ_DEV_KD", m.get("LJ_DEV_KD"));
			r.put("LJ_DEV_MOB_NUM", m.get("LJ_DEV_MOB_NUM"));
			r.put("ALL_SR_MOB_RATIO", m.get("ALL_SR_MOB_RATIO"));
		}
		return r;
	}
	public Map<String, Object> searchTaskRateData(Map<String, Object> params) {
		return indexDao.searchTaskRateData(params);
	}
	public Map<String, Object> checkChnlAgent(String hrId) {
		return indexDao.checkChnlAgent(hrId);
	}
	public Object queryJfRank(Map<String, Object> params) {
		Map<String, Object> result = new HashMap<String, Object>();
		PageList<Map<String, Object>> rows = indexDao
				.queryJfRank(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}
	
}
