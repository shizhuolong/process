package org.apdplat.portal.channelManagement.action;

import java.util.HashMap;
import java.util.Map;

import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.portal.channelManagement.service.NetworkMangerService;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * 固网名单制小区负责人绑定
 * @author wcyong
 *
 */
@SuppressWarnings("serial")
public class NetworkManagerAction extends BaseAction {
	
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	
	@Autowired
	private NetworkMangerService networkMangerService;
	private String orgId;
	private String orgLevel;
	private String code;
	private Map<String, String> resultMap;
	
	
	/**
	 * 查询名单制小区及绑定负责人列表
	 */
	public void listNetworkPerson() {
		try {
			String unit_name = request.getParameter("unit_name");
			String std_6_id = request.getParameter("std_6_id");
			String std_6_name = request.getParameter("std_6_name");
			String name = request.getParameter("name");
			String account = request.getParameter("account");
			String hr_id = request.getParameter("hr_id");
			if(unit_name != null && !"".equals(unit_name.trim())) {
				resultMap.put("unit_name", "%"+unit_name+"%");
			}
			if(std_6_id != null && !"".equals(std_6_id.trim())) {
				resultMap.put("std_6_id", std_6_id);
			}
			if(std_6_name != null && !"".equals(std_6_name.trim())) {
				resultMap.put("std_6_name", "%"+std_6_name+"%");
			}
			if(name != null && !"".equals(name.trim())) {
				resultMap.put("name", "%"+name+"%");
			}
			if(account != null && !"".equals(account.trim())) {
				resultMap.put("account", account);
			}
			if(hr_id != null && !"".equals(hr_id.trim())) {
				resultMap.put("hr_id", hr_id);
			}
			Object result = networkMangerService.listNetworkPerson(resultMap);
			this.reponseJson(result);
		} catch (Exception e) {
			logger.error("查询名单制小区及绑定负责人信息失败",e);
			outJsonPlainString(response,"{\"msg\":\"查询名单制小区及绑定负责人信息失败\"}");
		}
	}
	
	/**
	 * 查询名单制小区可以绑定的负责人信息
	 */
	public void listBindPerson() {
		try {
			String std_6_id = request.getParameter("std_6_id");
			String group_id_1 = request.getParameter("group_id_1");
			String unit_id = request.getParameter("unit_id");
			String orgId = request.getParameter("orgId");
			String name = request.getParameter("name");
			String username = request.getParameter("username");
			resultMap.put("std_6_id", std_6_id);
			resultMap.put("group_id_1", group_id_1);
			resultMap.put("unit_id", unit_id);
			resultMap.put("orgId", orgId);
			if(name != null && !"".equals(name.trim())) {
				resultMap.put("name", "%"+name+"%");
			}
			if(username != null && !"".equals(username.trim())) {
				resultMap.put("username", username);
			}
			Object result = networkMangerService.listBindPerson(resultMap);
			this.reponseJson(result);
		} catch (Exception e) {
			logger.error("查询绑定人员信息失败",e);
			outJsonPlainString(response,"{\"msg\":\"查询绑定人员信息失败\"}");
		}
	}
	
	/**
	 * 绑定名单制小区负责人
	 */
	public void saveBindPerson() {
		try {
			String userid = request.getParameter("userid");
			String name = request.getParameter("name");
			String username = request.getParameter("username");
			String phone = request.getParameter("phone");
			String std_6_id = request.getParameter("std_6_id");
			String hr_id = request.getParameter("hr_id");
			String group_id_1 = request.getParameter("group_id_1");
			String group_id_1_name = request.getParameter("group_id_1_name");
			String unit_id = request.getParameter("unit_id");
			String unit_name = request.getParameter("unit_name");
			Map<String, String> params = new HashMap<String, String>();
			params.put("userid", userid);
			params.put("name", name);
			params.put("username", username);
			params.put("phone", phone);
			params.put("std_6_id", std_6_id);
			params.put("hr_id", hr_id);
			params.put("group_id_1", group_id_1);
			params.put("group_id_1_name", group_id_1_name);
			params.put("unit_id", unit_id);
			params.put("unit_name", unit_name);
			networkMangerService.saveBindPerson(params);
			networkMangerService.insertIntoAllPerson(params);
			outJsonPlainString(response,"{\"msg\":\"操作成功\"}");
		} catch (Exception e) {
			logger.error("绑定名单制小区负责人失败",e);
			outJsonPlainString(response,"{\"msg\":\"绑定名单制小区负责人失败\"}");
		}
	}
	
	/**
	 * 解除名单制小区绑定的负责人
	 */
	public void deleteBindPerson() {
		try {
			String std_6_id = request.getParameter("std_6_id");
			String old_hr_id = request.getParameter("old_hr_id");
			Map<String, String> params = new HashMap<String, String>();
			params.put("std_6_id", std_6_id);
			params.put("old_hr_id", old_hr_id);
			System.out.println("============================="+std_6_id);
			networkMangerService.deleteBindPerson(params);
			networkMangerService.saveBindAllPerson(params);
			outJsonPlainString(response,"{\"msg\":\"操作成功\"}");
		} catch (Exception e) {
			logger.error("解除名单制小区绑定的负责人失败",e);
			outJsonPlainString(response,"{\"msg\":\"解除名单制小区绑定的负责人失败\"}");
		}
	}
	
	public Map<String, String> getResultMap() {
		return resultMap;
	}

	public void setResultMap(Map<String, String> resultMap) {
		this.resultMap = resultMap;
	}

	public String getOrgId() {
		return orgId;
	}

	public void setOrgId(String orgId) {
		this.orgId = orgId;
	}

	public String getOrgLevel() {
		return orgLevel;
	}

	public void setOrgLevel(String orgLevel) {
		this.orgLevel = orgLevel;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}
	
	
}
