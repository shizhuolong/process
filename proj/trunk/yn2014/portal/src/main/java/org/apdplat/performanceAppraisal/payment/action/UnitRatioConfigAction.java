package org.apdplat.performanceAppraisal.payment.action;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.performanceAppraisal.payment.service.UnitRatioConfigService;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.log.APDPlatLogger;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * 营服中心系数配置
 * @author wcyong
 *
 */
@SuppressWarnings("serial")
public class UnitRatioConfigAction extends BaseAction {
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	
	@Autowired
	private UnitRatioConfigService unitRatioConfigService;
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
		List<Map<String, Object>> list = unitRatioConfigService.listTreeNode(params);
		this.reponseJson(list);
	}
	
	/**
	 * 查询营服中心及系数信息
	 */
	public void list() {
		try {
			String unit_name = request.getParameter("unit_name");
			String unit_ratio = request.getParameter("unit_ratio");
			if(unit_name != null && !"".equals(unit_name.trim())) {
				resultMap.put("unit_name", "%"+unit_name+"%");
			}
			if(unit_ratio != null && !"".equals(unit_ratio.trim())) {
				resultMap.put("unit_ratio", unit_ratio);
			}
			Object result = unitRatioConfigService.list(resultMap);
			this.reponseJson(result);
		} catch (Exception e) {
			logger.error("查询营服中心及系数信息失败",e);
			outJsonPlainString(response,"{\"msg\":\"查询营服中心及系数信息失败\"}");
		}
	}
	
	
	/**
	 * 查询渠道系数信息
	 */
	public void loadUnitRatio() {
		String unit_id = request.getParameter("unit_id");
		Map<String, String> params = new HashMap<String, String>();
		params.put("unit_id", unit_id);
		List<Map<String, Object>> list = unitRatioConfigService.loadUnitRatio(params);
		this.reponseJson(list);
	}
	
	/**
	 * 修改营服中心系数
	 */
	public void updateUnitRatio() {
		try {
			String unit_id = request.getParameter("unit_id");
			String unit_ratio = request.getParameter("unit_ratio");
			String unit_manager_ratio=request.getParameter("unit_manager_ratio");
			String unit_head_ratio=request.getParameter("unit_head_ratio");
			
			Map<String, String> params = new HashMap<String, String>();
			params.put("unit_id", unit_id);
			params.put("unit_ratio", unit_ratio);
			params.put("unit_manager_ratio", unit_manager_ratio);
			params.put("unit_head_ratio", unit_head_ratio);
			unitRatioConfigService.updateUnitRatio(params);
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
