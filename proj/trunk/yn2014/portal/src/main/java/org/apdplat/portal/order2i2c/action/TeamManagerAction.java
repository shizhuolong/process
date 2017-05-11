package org.apdplat.portal.order2i2c.action;

import java.util.HashMap;
import java.util.Map;

import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;
import org.apdplat.module.security.model.Org;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.portal.order2i2c.service.TeamManagerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

@Controller
@Namespace("/teamManager")
@Scope("prototype")
@Results({
	@Result(name="success", location="/portal/order2i2c/jsp/team_manager_list.jsp")
})
@SuppressWarnings("serial")
public class TeamManagerAction extends BaseAction {
	 @SuppressWarnings("unused")
	private final APDPlatLogger logger = new APDPlatLogger(getClass());

	@Autowired
	private TeamManagerService teamManagerService;
	private Map<String, String> resultMap;

	public void query() {
		User user = UserHolder.getCurrentLoginUser();
		Org org=user.getOrg();
		resultMap.put("code", org.getCode());
		resultMap.put("orgLevel", org.getOrgLevel());
		if(resultMap.containsKey("NAME")&&!resultMap.get("NAME").equals("")){
			resultMap.put("name", "%"+resultMap.get("NAME")+"%");
		}
		Object result = teamManagerService.query(resultMap);
		this.reponseJson(result);
	}

	public String del() {
		try {
			User user = UserHolder.getCurrentLoginUser();
			Org org=user.getOrg();
			resultMap.put("code", org.getCode());
			teamManagerService.del(resultMap);
			teamManagerService.delDetail(resultMap);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "success";
	}
	
	public void innerSave() {
		Map<String,String> result=new HashMap<String,String>();
		try {
			User user = UserHolder.getCurrentLoginUser();
			Org org=user.getOrg();
			resultMap.put("username", user.getUsername());
			resultMap.put("code", org.getCode());
			teamManagerService.innerInsert(resultMap);
			result.put("state","1");
			result.put("msg", "新增成功！");
		} catch (Exception e) {
			e.printStackTrace();
			result.put("state","0");
			result.put("msg", "新增失败！");
		}
		this.reponseJson(result);
	}

	public void outSave() {
		Map<String,String> result=new HashMap<String,String>();
		try {
			User user = UserHolder.getCurrentLoginUser();
			Org org=user.getOrg();
			resultMap.put("username", user.getUsername());
			resultMap.put("code", org.getCode());
			teamManagerService.outInsert(resultMap);
			result.put("state","1");
			result.put("msg", "新增成功！");
		} catch (Exception e) {
			e.printStackTrace();
			result.put("state","0");
			result.put("msg", "新增失败！");
		}
		this.reponseJson(result);
	}
	
	public Map<String, String> getResultMap() {
		return resultMap;
	}

	public void setResultMap(Map<String, String> resultMap) {
		this.resultMap = resultMap;
	}

}
