package org.apdplat.portal.channelManagement.action;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.portal.channelManagement.service.BusinessHallPersonService;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * 营业厅与营业员
 * @author wcyong
 *
 */
@SuppressWarnings("serial")
public class BusinessHallPersonAction extends BaseAction {
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	
	@Autowired
	private BusinessHallPersonService businessHallPersonService;
	private String orgId;
	private String orgLevel;
	private String code;
	private Map<String, String> resultMap;
	
	/**
	 * 查询渠营业厅与营业员组织架构
	 */
	public void listTreeNode() {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("orgId", orgId);
		params.put("orgLevel", orgLevel);
		params.put("code", code);
		List<Map<String, Object>> list = businessHallPersonService.listTreeNode(params);
		this.reponseJson(list);
	}
	
	/**
	 * 查询渠道经理及营服中心负责人信息
	 */
	public void queryMagPerson() {
		String name = request.getParameter("name");
		String hq_chan_code = request.getParameter("hq_chan_code");
		String hq_chan_name = request.getParameter("hq_chan_name");
		String phone = request.getParameter("phone");
		String user_code = request.getParameter("user_code");
		String user_log_code = request.getParameter("user_log_code");
		String deal_date=request.getParameter("deal_date");
		if(hq_chan_code != null && !"".equals(hq_chan_code.trim())) {
			resultMap.put("hq_chan_code", hq_chan_code);
		}
		if(phone != null && !"".equals(phone.trim())) {
			resultMap.put("phone", phone);
		}
		if(name != null && !"".equals(name.trim())) {
			resultMap.put("name", "%"+name+"%");
		}
		if(hq_chan_name != null && !"".equals(hq_chan_name.trim())) {
			resultMap.put("hq_chan_name", "%"+hq_chan_name+"%");
		}
		if(user_code != null && !"".equals(user_code.trim())) {
			resultMap.put("user_code", user_code);
		}
		if(user_log_code != null && !"".equals(user_log_code.trim())) {
			resultMap.put("user_log_code", user_log_code);
		}
		resultMap.put("deal_date",deal_date);
		Object result = businessHallPersonService.queryMagPerson(resultMap);
		this.reponseJson(result);
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
