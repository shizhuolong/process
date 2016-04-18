package org.apdplat.portal.manualCommission.dao;

import java.util.Map;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

public interface CompareReportDao {

	/**
	 * 查询对比报表数据(分页查询)
	 * @param params
	 * @return
	 */
	PageList<Map<String, Object>> queryCompareData(Map<String, String> params);

}
