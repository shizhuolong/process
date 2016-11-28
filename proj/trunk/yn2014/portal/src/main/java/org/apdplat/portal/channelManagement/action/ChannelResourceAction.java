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
 * 
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
			String chn_cde_1_name = request.getParameter("chn_cde_1_name");
			String chn_cde_2_name = request.getParameter("chn_cde_2_name");
			String chn_cde_3_name = request.getParameter("chn_cde_3_name");
			String chn_cde_4_name = request.getParameter("chn_cde_4_name");
			if (hq_chan_code != null && !"".equals(hq_chan_code.trim())) {
				resultMap.put("hq_chan_code", hq_chan_code);
			}
			if (hq_chan_name != null && !"".equals(hq_chan_name.trim())) {
				resultMap.put("hq_chan_name", "%" + hq_chan_name + "%");
			}
			if (is_default != null && !"".equals(is_default.trim())) {
				resultMap.put("is_default", is_default);
			}
			if (chn_cde_1_name != null && !"".equals(chn_cde_1_name.trim())) {
				resultMap.put("chn_cde_1_name", "%"+chn_cde_1_name+"%");
			}
			if (chn_cde_2_name != null && !"".equals(chn_cde_2_name.trim())) {
				resultMap.put("chn_cde_2_name", "%"+chn_cde_2_name+"%");
			}
			if (chn_cde_3_name != null && !"".equals(chn_cde_3_name.trim())) {
				resultMap.put("chn_cde_3_name", "%"+chn_cde_3_name+"%");
			}
			if (chn_cde_4_name != null && !"".equals(chn_cde_4_name.trim())) {
				resultMap.put("chn_cde_4_name", "%"+chn_cde_4_name+"%");
			}
			Object result = channelResourceService.listChannel(resultMap);
			this.reponseJson(result);
		} catch (Exception e) {
			logger.error("查询渠道信息失败", e);
			outJsonPlainString(response, "{\"msg\":\"查询渠道信息失败\"}");
		}
	}

	public void listDetail1() {
		Object result = channelResourceService
				.listDetail1(resultMap);
		this.reponseJson(result);
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
			if (unit_name != null && !"".equals(unit_name.trim())) {
				resultMap.put("unit_name", "%" + unit_name + "%");
			}
			Object result = channelResourceService.listUnit(resultMap);
			this.reponseJson(result);
		} catch (Exception e) {
			logger.error("查询营服中心信息失败", e);
			outJsonPlainString(response, "{\"msg\":\"查询营服中心信息失败\"}");
		}
	}

	/**
	 * 将渠道划分到营服中心
	 */
	public void saveDivideChannel() {
		// 步骤:
		// 1.更新PCDE.TAB_CDE_CHANL_HQ_CODE表中的unit_id,unit_name
		// 2.更新PORTAL.APDP_ORG表中的parent_id
		// 3.将渠道的渠道负责人解绑，需要更新PORTAL.TAB_PORTAL_MOB_PERSON表中的userid,name,account,phone,hr_id,unit_id,unit_name
		// 4.更新PORTAL.TAB_PORTAL_GRP_PERSON表中的unit_id,unit_name
		// 5.更新PORTAL.TAB_PORTAL_MAG_PERSON表中的unit_id,unit_name
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
			outJsonPlainString(response, "{\"msg\":\"操作成功\"}");
		} catch (Exception e) {
			logger.error("将渠道划分营服中心操作失败", e);
			outJsonPlainString(response, "{\"msg\":\"渠道划分失败\"}");
		}
	}

	/**
	 * 查询渠道信息
	 */
	public void queryChanelInfo() {
		String group_id_4 = request.getParameter("group_id_4");
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("group_id_4", group_id_4);
		List<Map<String, Object>> list = channelResourceService
				.queryChanelInfo(params);
		this.reponseJson(list);
	}

	/**
	 * 打开查询渠道明细界面
	 */
	public String loadChanlInfo() {
		String group_id_4 = request.getParameter("group_id_4");
		String chnl_id = request.getParameter("chnl_id");
		ServletActionContext.getContext().put("group_id_4", group_id_4);
		ServletActionContext.getContext().put("chnl_id", chnl_id);
		return "chanlInfo";
	}

	public void loadChanlDetails() {
		String group_id_4 = request.getParameter("group_id_4");
		List<Map<String, Object>> list = channelResourceService
				.loadChanlDetails(group_id_4);
		this.reponseJson(list);

	}

	public void add() {
		Map m = new HashMap<String, String>();
		try {
			String type_name = request.getParameter("type_name");
			channelResourceService.add(type_name);
			m.put("msg", "添加成功！");
		} catch (Exception e) {
			logger.error("出现异常，添加失败！", e);
			m.put("msg", "出现异常,添加失败！");
		}
		this.reponseJson(m);
	}

	public void isExist() {
		Map m = new HashMap<String, String>();
		String type_name = request.getParameter("type_name");
		List<Map<String, Object>> list = channelResourceService
				.isExist(type_name);
		if (list != null && !list.isEmpty()) {
			m.put("msg", "类型名称已存在,添加失败！");
		}
		this.reponseJson(m);
	}
	
	public void loadChnlType() {
		List<Map<String, Object>> list = channelResourceService
				.loadChnlType();
		this.reponseJson(list);
	}
	
	public void update() {
		Map m = new HashMap<String, String>();
		try {
			Map<String, String> params = new HashMap<String, String>();
			String chnl_type = request.getParameter("chnl_type");
			String chnl_id = request.getParameter("chnl_id");
			String hq_chan_code = request.getParameter("hq_chan_code");
			params.put("chnl_type", chnl_type);
			params.put("chnl_id", chnl_id);
			params.put("hq_chan_code", hq_chan_code);
			channelResourceService.update(params);
			m.put("msg", "修改成功！");
		} catch (Exception e) {
			logger.error("出现异常，修改失败！", e);
			m.put("msg", "出现异常,修改失败！");
		}
		this.reponseJson(m);
	}

	public void updateDetail1(){
		Map m=new HashMap<String,String>();
		try {
			Map<String,String> params=new HashMap<String,String>();
			String id = request.getParameter("id");
			String type_name=request.getParameter("type_name");
			params.put("id",id);
			params.put("type_name",type_name);
			channelResourceService.updateDetail1(params);
			m.put("msg","修改成功！");
		} catch (Exception e) {
			logger.error("出现异常，修改失败！", e);
			m.put("msg","出现异常,修改失败！");
		}
		this.reponseJson(m);
	}
	public void delDetail1() {
		try {
			String id = request.getParameter("id");
			channelResourceService.delDetail1(id);
			this.reponseJson("删除成功！");
		} catch (Exception e) {
			logger.error("出现异常，删除失败！", e);
			this.reponseJson("删除失败！");
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
