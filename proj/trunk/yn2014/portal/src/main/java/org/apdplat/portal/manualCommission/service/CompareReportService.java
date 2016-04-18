package org.apdplat.portal.manualCommission.service;

import java.util.HashMap;
import java.util.Map;

import org.apdplat.portal.manualCommission.dao.CompareReportDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

@Service
public class CompareReportService {

	@Autowired
	private CompareReportDao compareReportDao;
	/**
	 * 查询对比报表数据(分页查询)
	 * @param params
	 * @return
	 */
	public Object queryCompareData(Map<String, String> params) {
		
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows = compareReportDao.queryCompareData(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}

}
