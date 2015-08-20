package org.apdplat.warningAndMonitor.resourceMonitor.action;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.module.monitor.model.UserLogin;
import org.apdplat.module.security.model.Org;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.warningAndMonitor.resourceMonitor.service.FreeCommunityService;
import org.apdplat.platform.log.APDPlatLogger;
import org.springframework.beans.factory.annotation.Autowired;

public class FreeCommunityAction  extends BaseAction{
	private static final long serialVersionUID = 1L;
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	@Autowired
	private FreeCommunityService freeCommunityService;
	private Map<String,String>  resultMap;
	
	/**
	 * 打开游离小区界面
	 * @return
	 */
	public String index(){
		return SUCCESS;
	}
	
	/**
	 * 游离小区列表
	 */
	public void list(){
		try {
			String group_id_1= request.getParameter("group_id_1");
			String std_6_id = request.getParameter("std_6_id");
			String std_6_name = request.getParameter("std_6_name");
			if(group_id_1!=null && !"".equals(group_id_1.trim())){
				resultMap.put("group_id_1", group_id_1);
			}
			if(std_6_id!=null && !"".equals(std_6_id.trim())){
				resultMap.put("std_6_id", std_6_id);
			}
			if(std_6_name!=null && !"".equals(std_6_name.trim())){
				resultMap.put("std_6_name", "%"+std_6_name+"%");
			}
			Object result = freeCommunityService.list(resultMap);
			this.reponseJson(result);
		} catch (Exception e) {
			logger.error("查询游离小区信息失败",e);
			outJsonPlainString(response,"{\"msg\":\"查询游离小区信息失败\"}");
		}
	}
	
	public void searchSelectOrg(){
		User user = UserHolder.getCurrentLoginUser();
		Org org = user.getOrg();
		String orgLevel = org.getOrgLevel();
		String orgCode = org.getCode();
		Map<String,Object> params = new HashMap<String, Object>();
		params.put("orgLevel", orgLevel);
		params.put("code", orgCode);
		List<Map<String,Object>> list = freeCommunityService.searchSelectOrg(params);
		this.reponseJson(list);
	}
	
	public Map<String, String> getResultMap() {
		return resultMap;
	}

	public void setResultMap(Map<String, String> resultMap) {
		this.resultMap = resultMap;
	}
}
