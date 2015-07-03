package org.apdplat.report.devIncome.dao;

import java.util.List;
import java.util.Map;

public interface ReportDao {
	/**
	 * 公用查询
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> query(Map<String, String> params);
}
