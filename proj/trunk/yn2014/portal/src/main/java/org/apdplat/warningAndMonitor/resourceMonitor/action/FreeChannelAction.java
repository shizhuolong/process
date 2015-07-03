package org.apdplat.warningAndMonitor.resourceMonitor.action;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.module.security.model.Org;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.warningAndMonitor.resourceMonitor.service.FreeChannelService;
import org.springframework.beans.factory.annotation.Autowired;

public class FreeChannelAction extends BaseAction {
	
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	
	@Autowired
	private FreeChannelService freeChannelService;
	private Map<String, String> resultMap;
	
	/**
	 * 打开游离渠道列表界面
	 * @return
	 */
	public String index() {
		return SUCCESS;
	}
	
	/**
	 * 游离渠道列表
	 */
	public void list() {
		try {
	        String group_id_1 = request.getParameter("group_id_1");
	        String hq_chan_code = request.getParameter("hq_chan_code");
	        String group_id_4_name = request.getParameter("group_id_4_name");
	        if(group_id_1 != null && !"".equals(group_id_1.trim())) {
	        	resultMap.put("group_id_1", group_id_1);
	        }
	        if(hq_chan_code != null && !"".equals(hq_chan_code.trim())) {
	        	resultMap.put("hq_chan_code", hq_chan_code);
	        }
	        if(group_id_4_name != null && !"".equals(group_id_4_name.trim())) {
	        	resultMap.put("group_id_4_name", "%"+group_id_4_name+"%");
	        }
			Object result = freeChannelService.list(resultMap);
			this.reponseJson(result);
		} catch (Exception e) {
			logger.error("查询游离渠道信息失败",e);
			outJsonPlainString(response,"{\"msg\":\"查询游离渠道信息失败\"}");
		}
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
		List<Map<String, Object>> result = freeChannelService.searchSelectOrg(params);
		this.reponseJson(result);
	}

	public Map<String, String> getResultMap() {
		return resultMap;
	}

	public void setResultMap(Map<String, String> resultMap) {
		this.resultMap = resultMap;
	}
	
}
