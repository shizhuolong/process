package org.apdplat.portal.costManagement.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.portal.costManagement.dao.SalesActualTimeDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

@Service
public class SalesActualTimeService {

	@Autowired
	private SalesActualTimeDao salesActualTimeDao;
	/**
	 * 实时销量
	 * @param paramsMap
	 */
	public List<Map<String,Object>> listSales(Map<String, Object> paramsMap) {
		return salesActualTimeDao.listSales(paramsMap);
		
	}
	
	/**
	 * 实时销量明细图表数据查询
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> showDataChart(Map<String, Object> params) {
		return salesActualTimeDao.showDataChart(params);
	}

	/**
	 * 查询渠道级实时销量明细
	 * @param params
	 * @return
	 * @throws Exception 
	 */
	public Map<String, Object> listChanlSalesDetail(Map<String, String> params) throws Exception {
		Map<String, Object> result = new HashMap<String, Object>();
		PageList<Map<String, Object>> rows = salesActualTimeDao.listChanlSalesDetail(params);
		result.put("rows", rows);
		//result.put("pagin", rows.getPaginator());
		int count = rows.getPaginator().getTotalCount();
		result.put("total", count);
		return result;
	}

}
