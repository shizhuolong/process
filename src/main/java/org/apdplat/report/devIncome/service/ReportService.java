package org.apdplat.report.devIncome.service;

import java.util.List;
import java.util.Map;

import org.apdplat.report.devIncome.dao.ReportDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReportService {
	@Autowired
	private ReportDao dao;
	
	/**
	 * 公用查询
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> query(Map<String, String> params){
		return this.dao.query(params);
	}
}
