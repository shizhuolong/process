package org.apdplat.portal.loginStatistics.action;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.module.security.model.Org;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.portal.loginStatistics.service.LoginStatisticsService;
import org.springframework.beans.factory.annotation.Autowired;

@SuppressWarnings("serial")
public class LoginStatisticsAction extends BaseAction {
	
	
	@SuppressWarnings("unused")
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	
	@Autowired
	private LoginStatisticsService loginStatisticsService;
	private Map<String, String> resultMap;

	/**
	 * 查询用户登录信息
	 */
	public void searchUserLoginTimes() {
		String queryOrgCode = request.getParameter("queryOrgCode");
		String realname = request.getParameter("realname");
		String username = request.getParameter("username");
		String startTime = request.getParameter("startTime");
		String endTime = request.getParameter("endTime");
		String appName = request.getParameter("appName");
		appName = "/"+appName;
		resultMap.put("startTime", startTime);
		resultMap.put("endTime", endTime);
		resultMap.put("appName", appName);
		if(queryOrgCode != null && !"".equals(queryOrgCode.trim())) {
			resultMap.put("queryOrgCode", queryOrgCode);
		}
		if(realname != null && !"".equals(realname.trim())) {
			resultMap.put("realname", "%"+realname+"%");
		}
		if(username!= null && !"".equals(username.trim())) {
			resultMap.put("username", username);
		}
		Object result = loginStatisticsService.searchUserLoginTimes(resultMap);
		this.reponseJson(result);
	}
	
	/**
	 * 查询组织架构
	 * @param params
	 * @return
	 */
	public void searchSelectOrg() {
		
		User user = UserHolder.getCurrentLoginUser();
		Org org = user.getOrg();
		String orgLevel = org.getOrgLevel();
		String orgCode = org.getCode();
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("orgLevel", orgLevel);
		params.put("code", orgCode);
		List<Map<String, Object>> result = loginStatisticsService.searchSelectOrg(params);
		this.reponseJson(result);
	}

	public Map<String, String> getResultMap() {
		return resultMap;
	}

	public void setResultMap(Map<String, String> resultMap) {
		this.resultMap = resultMap;
	}
	
}
