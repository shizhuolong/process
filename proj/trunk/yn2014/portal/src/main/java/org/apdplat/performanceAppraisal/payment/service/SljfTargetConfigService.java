package org.apdplat.performanceAppraisal.payment.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.performanceAppraisal.payment.dao.SljfTargetConfigDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

@Service
public class SljfTargetConfigService {

	@Autowired
	private SljfTargetConfigDao sljfTargetConfigDao;
	
	/**
	 * 查询受理积分配置列表数据
	 * @param params
	 * @return
	 */
	public Object list(Map<String, String> params) {
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows = sljfTargetConfigDao.list(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}
	
	/**
	 * 通过指标名称获取指标数
	 * @param params
	 * @return
	 */
	public int loadTargetCountByName(Map<String, String> params) {
		return sljfTargetConfigDao.loadTargetCountByName(params);
	}
	
	/**
	 * 添加受理积分指标
	 * @param params
	 */
	@Transactional
	public void saveTarget(Map<String, String> params) {
		sljfTargetConfigDao.saveTarget(params);
	}
	
	/**
	 * 根据指标编码查询受理积分指标
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> loadTargetByCode(Map<String, String> params) {
		return sljfTargetConfigDao.loadTargetByCode(params);
	}
	
	public int loadTargetByUpdateCode(Map<String, String> params) {
		return sljfTargetConfigDao.loadTargetByUpdateCode(params);
	}
	
	/**
	 * 修改受理积分指标
	 * @param params
	 */
	@Transactional
	public void updateTarget(Map<String, String> params) {
		sljfTargetConfigDao.updateTarget(params);
	}
	
}
