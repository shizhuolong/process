package org.apdplat.portal.costManagement.dao;


import java.util.List;
import java.util.Map;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

public interface SalesActualTimeDao {
	
	/**
	 * 实时销量
	 * @param paramsMap
	 * @return
	 */
	public List<Map<String,Object>> listSales(Map<String, Object> paramsMap);

	/**
	 * 实时销量明细图表数据查询
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> showDataChart(Map<String, Object> params);

	/**
	 * 查询渠道级实时销量明细
	 * @param params
	 * @return
	 */
	public PageList<Map<String, Object>> listChanlSalesDetail(Map<String, String> params) throws Exception;
}
