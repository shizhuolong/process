package org.apdplat.portal.channelManagement.action;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.portal.channelManagement.service.UnitMangerService;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * 营服中心负责人管理
 * @author wcyong
 *
 */
@SuppressWarnings("serial")
public class UnitManagerAction extends BaseAction {
	
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	
	@Autowired
	private UnitMangerService unitMangerService;
	private String orgId;
	private String orgLevel;
	private String code;
	private Map<String, String> resultMap;
	
	/**
	 * 查询营服中心负责人管理组织架构
	 */
	public void listTreeNode() {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("orgId", orgId);
		params.put("orgLevel", orgLevel);
		params.put("code", code);
		List<Map<String, Object>> list = unitMangerService.listTreeNode(params);
		this.reponseJson(list);
	}
	
	/**
	 * 查询营服中心负责人信息
	 */
	public void queryMobPerson() {
		try {
			String name = request.getParameter("name");
			String month = request.getParameter("month");
			String hq_chan_code = request.getParameter("hq_chan_code");
			String hq_chan_name = request.getParameter("hq_chan_name");
			String hr_id = request.getParameter("hr_id");
			String unit_name = request.getParameter("unit_name");
			if(hq_chan_code != null && !"".equals(hq_chan_code.trim())) {
				resultMap.put("hq_chan_code", hq_chan_code);
			}
			if(hr_id != null && !"".equals(hr_id.trim())) {
				resultMap.put("hr_id", hr_id);
			}
			if(name != null && !"".equals(name.trim())) {
				resultMap.put("name", "%"+name+"%");
			}
			if(month != null && !"".equals(month.trim())) {
				resultMap.put("month",month);
			}
			if(hq_chan_name != null && !"".equals(hq_chan_name.trim())) {
				resultMap.put("hq_chan_name", "%"+hq_chan_name+"%");
			}
			if(unit_name != null && !"".equals(unit_name.trim())) {
				resultMap.put("unit_name", "%"+unit_name+"%");
			}
			Object result = unitMangerService.queryMobPerson(resultMap);
			this.reponseJson(result);
		} catch (Exception e) {
			logger.error("查询营服中心负责人信息失败",e);
			outJsonPlainString(response,"{\"msg\":\"查询营服中心负责人信息失败\"}");
		}
	}
	
	/**
	 * 查询可以绑定的人员信息
	 */
	public void listBindPerson() {
		try {
			String id = request.getParameter("id");
			String month = request.getParameter("month");
			String group_id_1 = request.getParameter("group_id_1");
			String unit_id = request.getParameter("unit_id");
			String name = request.getParameter("name");
			String username = request.getParameter("username");
			resultMap.put("id", id);
			resultMap.put("month", month);
			resultMap.put("group_id_1", group_id_1);
			resultMap.put("unit_id", unit_id);
			if(name != null && !"".equals(name.trim())) {
				resultMap.put("name", "%"+name+"%");
			}
			if(username != null && !"".equals(username.trim())) {
				resultMap.put("username", username);
			}
			Object result = unitMangerService.listBindPerson(resultMap);
			this.reponseJson(result);
		} catch (Exception e) {
			logger.error("查询绑定人员信息失败",e);
			outJsonPlainString(response,"{\"msg\":\"查询绑定人员信息失败\"}");
		}
	}
	
	/**
	 * 打开绑定营服中心负责人界面
	 * @return
	 */
	public String addBindPerson() {
		return "add_bind_person";
	}
	
	/**
	 * 绑定营服中心负责人
	 */
	public void saveBindPerson() {
		try {
			String userid = request.getParameter("userid");
			String name = request.getParameter("name");
			String month = request.getParameter("month");
			String username = request.getParameter("username");
			String phone = request.getParameter("phone");
			String group_id_code = request.getParameter("group_id_code");
			String hr_id = request.getParameter("hr_id");
			Map<String, String> params = new HashMap<String, String>();
			params.put("userid", userid);
			params.put("name", name);
			params.put("month", month);
			params.put("username", username);
			params.put("phone", phone);
			params.put("group_id_code", group_id_code);
			params.put("hr_id", hr_id);
			unitMangerService.saveBindPerson(params);
			outJsonPlainString(response,"{\"msg\":\"绑定成功\"}");
		} catch (Exception e) {
			logger.error("绑定营服中心负责人失败",e);
			outJsonPlainString(response,"{\"msg\":\"绑定人员信息失败\"}");
		}
	}
	
	/**
	 * 营服中心负责人解绑
	 */
	public void updateBindPerson() {
		try {
			String group_id_code = request.getParameter("group_id_code");
			String month = request.getParameter("month");
			Map<String, String> params = new HashMap<String, String>();
			params.put("group_id_code", group_id_code);
			params.put("month", month);
			unitMangerService.updateBindPerson(params);
			outJsonPlainString(response,"{\"msg\":\"操作成功\"}");
		} catch (Exception e) {
			logger.error("解绑操作失败",e);
			outJsonPlainString(response,"{\"msg\":\"解绑操作失败\"}");
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
