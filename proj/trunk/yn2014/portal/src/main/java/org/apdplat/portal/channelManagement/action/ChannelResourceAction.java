package org.apdplat.portal.channelManagement.action;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.struts2.ServletActionContext;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.portal.channelManagement.service.ChannelResourceService;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * 渠道资源管理
 * @author wcyong
 *
 */
@SuppressWarnings("serial")
public class ChannelResourceAction extends BaseAction {
	
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	
	@Autowired
	private ChannelResourceService channelResourceService;
	private String orgId;
	private String orgLevel;
	private String code;
	private Map<String, String> resultMap;
	
	/**
	 * 查询渠道信息列表
	 */
	public void listChannel() {
		try {
			String hq_chan_code = request.getParameter("hq_chan_code");
			String hq_chan_name = request.getParameter("hq_chan_name");
			String is_default = request.getParameter("is_default");
			if(hq_chan_code != null && !"".equals(hq_chan_code.trim())) {
				resultMap.put("hq_chan_code", hq_chan_code);
			}
			if(hq_chan_name != null && !"".equals(hq_chan_name.trim())) {
				resultMap.put("hq_chan_name", "%"+hq_chan_name+"%");
			}
			if(is_default != null && !"".equals(is_default.trim())) {
				resultMap.put("is_default", is_default);
			}
			Object result = channelResourceService.listChannel(resultMap);
			this.reponseJson(result);
		} catch (Exception e) {
			logger.error("查询渠道信息失败",e);
			outJsonPlainString(response,"{\"msg\":\"查询渠道信息失败\"}");
		}
	}
	
	/**
	 * 查询营服中心
	 */
	public void listUnit() {
		try {
			String group_id_1 = request.getParameter("group_id_1");
			String group_id_4 = request.getParameter("group_id_4");
			String unit_name = request.getParameter("unit_name");
			resultMap.put("group_id_1", group_id_1);
			resultMap.put("group_id_4", group_id_4);
			if(unit_name != null && !"".equals(unit_name.trim())) {
				resultMap.put("unit_name", "%"+unit_name+"%");
			}
			Object result = channelResourceService.listUnit(resultMap);
			this.reponseJson(result);
		} catch (Exception e) {
			logger.error("查询营服中心信息失败",e);
			outJsonPlainString(response,"{\"msg\":\"查询营服中心信息失败\"}");
		}
	}
	
	/**
	 * 将渠道划分到营服中心
	 */
	public void saveDivideChannel() {
		//步骤:
		//1.更新PCDE.TAB_CDE_CHANL_HQ_CODE表中的unit_id,unit_name
		//2.更新PORTAL.APDP_ORG表中的parent_id
		//3.将渠道的渠道负责人解绑，需要更新PORTAL.TAB_PORTAL_MOB_PERSON表中的userid,name,account,phone,hr_id,unit_id,unit_name
		//4.更新PORTAL.TAB_PORTAL_GRP_PERSON表中的unit_id,unit_name
		//5.更新PORTAL.TAB_PORTAL_MAG_PERSON表中的unit_id,unit_name
		try {
			String unit_id = request.getParameter("unit_id");
			String unit_name = request.getParameter("unit_name");
			String group_id_4 = request.getParameter("group_id_4");
			String orgId = request.getParameter("orgId");
			String login_name = request.getParameter("login_name");
			Map<String, String> params = new HashMap<String, String>();
			params.put("unit_id", unit_id);
			params.put("unit_name", unit_name);
			params.put("group_id_4", group_id_4);
			params.put("orgId", orgId);
			params.put("login_name", login_name);
			channelResourceService.saveDivideChannel(params);
			outJsonPlainString(response,"{\"msg\":\"操作成功\"}");
		} catch (Exception e) {
			logger.error("将渠道划分营服中心操作失败",e);
			outJsonPlainString(response,"{\"msg\":\"渠道划分失败\"}");
		}
	}
	
	/**
	 * 查询渠道信息
	 */
	public void queryChanelInfo() {
		String group_id_4 = request.getParameter("group_id_4");
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("group_id_4", group_id_4);
		List<Map<String, Object>> list = channelResourceService.queryChanelInfo(params);
		this.reponseJson(list);
	}
	
	/**
	 * 打开查询渠道明细界面
	 */
	public String loadChanlInfo() {
		String group_id_4 = request.getParameter("group_id_4");
		ServletActionContext.getContext().put("group_id_4", group_id_4);
		return "chanlInfo";
	}
	
	public void loadChanlDetails() {
		String group_id_4 = request.getParameter("group_id_4");
		List<Map<String, Object>> list = channelResourceService.loadChanlDetails(group_id_4);
		this.reponseJson(list);
		
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
