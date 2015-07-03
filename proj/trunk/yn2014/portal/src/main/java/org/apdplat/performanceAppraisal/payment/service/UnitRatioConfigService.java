package org.apdplat.performanceAppraisal.payment.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.performanceAppraisal.payment.dao.UnitRatioConfigDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

@Service
public class UnitRatioConfigService {

	@Autowired
	private UnitRatioConfigDao unitRatioConfigDao;
	
	/**
	 * 查询组织架构树
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> listTreeNode(Map<String, Object> params) {
		return unitRatioConfigDao.listTreeNode(params);
	}
	
	/**
	 * 查询营服中心及系数信息
	 * @param params
	 * @return
	 */
	public Object list(Map<String, String> params) {
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows = unitRatioConfigDao.list(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}
	
	/**
	 * 查询营服中心系数信息
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> loadUnitRatio(Map<String, String> params) {
		return unitRatioConfigDao.loadUnitRatio(params);
	}
	
	/**
	 * 修改营服中心系数
	 * @param params
	 */
	@Transactional
	public void updateUnitRatio(Map<String, String> params) {
		unitRatioConfigDao.updateUnitRatio(params);
	}
	
}
