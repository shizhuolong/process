package org.apdplat.performanceAppraisal.payment.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.performanceAppraisal.payment.dao.ChanlRatioConfigDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

@Service
public class ChanlRatioConfigService {

	@Autowired
	private ChanlRatioConfigDao chanlRatioConfigDao;
	
	/**
	 * 查询基站管理组织架构
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> listTreeNode(Map<String, Object> params) {
		return chanlRatioConfigDao.listTreeNode(params);
	}
	/**
	 * 查询渠道及系数信息
	 * @param params
	 * @return
	 */
	public Object list(Map<String, String> params) {
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows = chanlRatioConfigDao.list(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}
	
	/**
	 * 查询渠道类型
	 * @return
	 */
	public List<Map<String, Object>> loadChanlType() {
		return chanlRatioConfigDao.loadChanlType();
	}
	
	/**
	 * 查询渠道系数信息
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> loadChanlRatio(Map<String, String> params) {
		return chanlRatioConfigDao.loadChanlRatio(params);
	}
	
	/**
	 * 新增或者修改渠道系数
	 * @param params
	 */
	@Transactional
	public void updateChanlRatio(Map<String, String> params) {
		chanlRatioConfigDao.updateChanlRatio(params);
	}
	
}
