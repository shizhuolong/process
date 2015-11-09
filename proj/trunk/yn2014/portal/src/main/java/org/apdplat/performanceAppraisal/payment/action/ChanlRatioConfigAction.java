package org.apdplat.performanceAppraisal.payment.action;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.performanceAppraisal.payment.service.ChanlRatioConfigService;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.log.APDPlatLogger;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * 渠道积分配置
 * @author wcyong
 *
 */
@SuppressWarnings("serial")
public class ChanlRatioConfigAction extends BaseAction {
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	
	@Autowired
	private ChanlRatioConfigService chanlRatioConfigService;
	private String orgId;
	private String orgLevel;
	private String code;
	private Map<String, String> resultMap;
	/**
	 * 查询组织架构树
	 */
	public void listTreeNode() {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("orgId", orgId);
		params.put("orgLevel", orgLevel);
		params.put("code", code);
		List<Map<String, Object>> list = chanlRatioConfigService.listTreeNode(params);
		this.reponseJson(list);
	}
	
	/**
	 * 查询渠道及系数信息
	 */
	public void list() {
		try {
			String hq_chan_code = request.getParameter("hq_chan_code");
			String group_id_4_name = request.getParameter("group_id_4_name");
			String status = request.getParameter("status");
			String ratio = request.getParameter("ratio");
			String server_ratio = request.getParameter("server_ratio");
			String month = request.getParameter("month");
			if(hq_chan_code != null && !"".equals(hq_chan_code.trim())) {
				resultMap.put("hq_chan_code", hq_chan_code);
			}
			if(group_id_4_name != null && !"".equals(group_id_4_name.trim())) {
				resultMap.put("group_id_4_name", "%"+group_id_4_name+"%");
			}
			if(status != null && !"".equals(status.trim())) {
				resultMap.put("status", status);
			}
			if(ratio != null && !"".equals(ratio.trim())) {
				resultMap.put("ratio", ratio);
			}
			if(server_ratio != null && !"".equals(server_ratio.trim())) {
				resultMap.put("server_ratio", server_ratio);
			}
			if(month != null && !"".equals(month.trim())) {
				resultMap.put("month", month);
			}
			Object result = chanlRatioConfigService.list(resultMap);
			this.reponseJson(result);
		} catch (Exception e) {
			logger.error("查询渠道及系数信息失败",e);
			outJsonPlainString(response,"{\"msg\":\"查询渠道及系数信息失败\"}");
		}
	}
	
	/**
	 * 查询渠道类型
	 */
	public void loadChanlType() {
		List<Map<String, Object>> list = chanlRatioConfigService.loadChanlType();
		this.reponseJson(list);
	}
	
	/**
	 * 查询渠道系数信息
	 */
	public void loadChanlRatio() {
		String hq_chan_code = request.getParameter("hq_chan_code");
		String month = request.getParameter("month");
		Map<String, String> params = new HashMap<String, String>();
		params.put("hq_chan_code", hq_chan_code);
		params.put("month", month);
		List<Map<String, Object>> list = chanlRatioConfigService.loadChanlRatio(params);
		this.reponseJson(list);
	}
	
	/**
	 * 修改渠道系数
	 */
	public void updateChanlRatio() {
		try {
			String groupcode = request.getParameter("groupcode");
			String groupname = request.getParameter("groupname");
			String server_ratio = request.getParameter("server_ratio");
			String ratio = request.getParameter("ratio");
			String group_id_1 = request.getParameter("group_id_1");
			String month = request.getParameter("month");
			Map<String, String> params = new HashMap<String, String>();
			params.put("groupcode", groupcode);
			params.put("groupname", groupname);
			params.put("group_id_1", group_id_1);
			params.put("ratio", ratio);
			params.put("server_ratio", server_ratio);
			params.put("month", month);
			chanlRatioConfigService.updateChanlRatio(params);
			this.reponseJson("操作成功");
		} catch (Exception e) {
			logger.error("修改渠道系数信息失败",e);
			this.reponseJson("修改渠道系数信息失败");
		}
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
	public Map<String, String> getResultMap() {
		return resultMap;
	}
	public void setResultMap(Map<String, String> resultMap) {
		this.resultMap = resultMap;
	}
		
}
