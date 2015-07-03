package org.apdplat.portal.loginStatistics.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.portal.loginStatistics.dao.LoginStatisticsDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

@Service
public class LoginStatisticsService {

	@Autowired
	private LoginStatisticsDao loginStatisticsDao;
	
	/**
	 * 查询用户登录情况
	 * @param params
	 * @return
	 */
	public Object searchUserLoginTimes(Map<String, String> params) {
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows = loginStatisticsDao.searchUserLoginTimes(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}
	
	/**
	 * 查询组织架构
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> searchSelectOrg(Map<String, Object> params) {
		return loginStatisticsDao.searchSelectOrg(params);
	}
	
}
