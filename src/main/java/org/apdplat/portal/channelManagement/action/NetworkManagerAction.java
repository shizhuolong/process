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
	private String userid;
	private String name;
	private String username;
	private String phone;
	private String std_6_id;
	private String hr_id;
	private String group_id_1;
	private String group_id_1_name;
	private String unit_id;
	private String unit_name;
	private String deal_date;
	private String login_name;
	private String std_6_name;
	private String account;
	private String old_hr_id;
	private Map<String, String> resultMap;
	
	/**
	 * 查询名单制小区及绑定负责人列表
	 */
	public void listNetworkPerson() {
		try {
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
			if(deal_date != null && !"".equals(deal_date.trim())) {
				resultMap.put("deal_date", deal_date);
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
			resultMap.put("std_6_id", std_6_id);
			resultMap.put("group_id_1", group_id_1);
			resultMap.put("unit_id", unit_id);
			resultMap.put("orgId", orgId);
			resultMap.put("deal_date", deal_date);
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
			params.put("deal_date", deal_date);
			params.put("login_name", login_name);
			System.out.println("params====="+params);
			networkMangerService.saveBindPerson(params);
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
			Map<String, String> params = new HashMap<String, String>();
			params.put("std_6_id", std_6_id);
			params.put("old_hr_id", old_hr_id);
			params.put("deal_date", deal_date);
			networkMangerService.deleteBindPerson(params);
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

	public String getUserid() {
		return userid;
	}

	public void setUserid(String userid) {
		this.userid = userid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getStd_6_id() {
		return std_6_id;
	}

	public void setStd_6_id(String std_6_id) {
		this.std_6_id = std_6_id;
	}

	public String getHr_id() {
		return hr_id;
	}

	public void setHr_id(String hr_id) {
		this.hr_id = hr_id;
	}

	public String getGroup_id_1() {
		return group_id_1;
	}

	public void setGroup_id_1(String group_id_1) {
		this.group_id_1 = group_id_1;
	}

	public String getGroup_id_1_name() {
		return group_id_1_name;
	}

	public void setGroup_id_1_name(String group_id_1_name) {
		this.group_id_1_name = group_id_1_name;
	}

	public String getUnit_id() {
		return unit_id;
	}

	public void setUnit_id(String unit_id) {
		this.unit_id = unit_id;
	}

	public String getUnit_name() {
		return unit_name;
	}

	public void setUnit_name(String unit_name) {
		this.unit_name = unit_name;
	}

	public String getDeal_date() {
		return deal_date;
	}

	public void setDeal_date(String deal_date) {
		this.deal_date = deal_date;
	}

	public String getLogin_name() {
		return login_name;
	}

	public void setLogin_name(String login_name) {
		this.login_name = login_name;
	}

	public String getStd_6_name() {
		return std_6_name;
	}

	public void setStd_6_name(String std_6_name) {
		this.std_6_name = std_6_name;
	}

	public String getAccount() {
		return account;
	}

	public void setAccount(String account) {
		this.account = account;
	}

	public String getOld_hr_id() {
		return old_hr_id;
	}

	public void setOld_hr_id(String old_hr_id) {
		this.old_hr_id = old_hr_id;
	}

	public APDPlatLogger getLogger() {
		return logger;
	}
	
	
}
