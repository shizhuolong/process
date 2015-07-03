package org.apdplat.performanceAppraisal.payment.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.performanceAppraisal.payment.dao.SaleTargetConfigDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

@Service
public class SaleTargetConfigService {

	@Autowired
	private SaleTargetConfigDao saleTargetConfigDao;
	
	/**
	 * 查询销售积分配置列表数据
	 * @param params
	 * @return
	 */
	public Object list(Map<String, String> params) {
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows = saleTargetConfigDao.list(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}
	
	/**
	 * 查询指标编码，指标描述数量
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> loadCountByCodeAndDesc(Map<String, String> params) {
		return saleTargetConfigDao.loadCountByCodeAndDesc(params);
	}
	
	/**
	 * 添加销售积分指标
	 * @param params
	 */
	@Transactional
	public void saveTarget(Map<String, String> params) {
		saleTargetConfigDao.saveTarget(params);
	}
	
	/**
	 * 根据原始指标编码获取销售积分指标信息
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> loadTarget(Map<String, String> params) {
		return saleTargetConfigDao.loadTarget(params);
	}
	
	/**
	 * 修改销售积分指标时验证是否重复
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> loadUpdateCount(Map<String, String> params) {
		return saleTargetConfigDao.loadUpdateCount(params);
	}
	
	/**
	 * 修改销售积分指标
	 * @param params
	 */
	public void updateTarget(Map<String, String> params) {
		saleTargetConfigDao.updateTarget(params);
	}
}
