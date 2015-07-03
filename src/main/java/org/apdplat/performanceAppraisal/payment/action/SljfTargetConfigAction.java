package org.apdplat.performanceAppraisal.payment.action;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.performanceAppraisal.payment.service.SljfTargetConfigService;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.log.APDPlatLogger;
import org.springframework.beans.factory.annotation.Autowired;

@SuppressWarnings("serial")
public class SljfTargetConfigAction extends BaseAction {
	
	private final APDPlatLogger logger = new APDPlatLogger(getClass());

	@Autowired
	private SljfTargetConfigService sljfTargetConfigService;
	private Map<String, String> resultMap;
	
	
	/**
	 * 查询受理积分配置列表信息
	 */
	public void list() {
		String bigbusi_desc = request.getParameter("bigbusi_desc");
		if(bigbusi_desc != null && !"".equals(bigbusi_desc.trim())) {
			resultMap.put("bigbusi_desc", "%"+bigbusi_desc+"%");
		}
		Object result = sljfTargetConfigService.list(resultMap);
		this.reponseJson(result);
	}
	
	/**
	 * 验证受理积分指标是否存在
	 */
	public void validTargetByName() {
		String bigbusi_desc = request.getParameter("bigbusi_desc");
		Map<String, String> params = new HashMap<String, String>();
		params.put("bigbusi_desc", bigbusi_desc);
		int c = sljfTargetConfigService.loadTargetCountByName(params);
		if(c > 0) {
			this.outJsonPlainString(response, "{\"msg\":\"该受理积分指标配置信息已经存在了，不能重复添加.\"}");
		}else {
			this.outJsonPlainString(response, "{\"msg\":\"0\"}");
		}
	}

	public void saveTarget() {
		try {
			String bigbusi_desc = request.getParameter("bigbusi_desc");
			String cre = request.getParameter("cre");
			String money = request.getParameter("money");
			Map<String, String> params = new HashMap<String,String>();
			params.put("bigbusi_desc", bigbusi_desc);
			params.put("cre", cre);
			params.put("money", money);
			sljfTargetConfigService.saveTarget(params);
			this.reponseJson("操作成功");
		} catch (Exception e) {
			logger.error("添加受理积分配置信息失败",e);
			this.reponseJson("添加受理积分配置信息失败");
		}
	}
	
	/**
	 * 根据指标编码查询受理积分指标
	 */
	public void loadTargetByCode() {
		String code = request.getParameter("code");
		Map<String, String> params = new HashMap<String, String>();
		params.put("code", code);
		List<Map<String, Object>> list = sljfTargetConfigService.loadTargetByCode(params);
		this.reponseJson(list);
	}
	
	public void loadTargetByUpdateCode() {
		String bigbusi_desc = request.getParameter("bigbusi_desc");
		String code = request.getParameter("code");
		Map<String, String> params = new HashMap<String, String>();
		params.put("bigbusi_desc", bigbusi_desc);
		params.put("code", code);
		int c = sljfTargetConfigService.loadTargetByUpdateCode(params);
		if(c > 0) {
			this.outJsonPlainString(response, "{\"msg\":\"该受理积分指标配置信息已经存在了.\"}");
		}else {
			this.outJsonPlainString(response, "{\"msg\":\"0\"}");
		}
	}
	
	/**
	 * 更新受理积分指标
	 */
	public void updateTarget() {
		try {
			String bigbusi_desc = request.getParameter("bigbusi_desc");
			String cre = request.getParameter("cre");
			String money = request.getParameter("money");
			String bigbusi_code = request.getParameter("bigbusi_code");
			Map<String, String> params = new HashMap<String,String>();
			params.put("bigbusi_desc", bigbusi_desc);
			params.put("cre", cre);
			params.put("money", money);
			params.put("bigbusi_code", bigbusi_code);
			sljfTargetConfigService.updateTarget(params);
			this.reponseJson("操作成功");
		} catch (Exception e) {
			logger.error("修改受理积分配置信息失败",e);
			this.reponseJson("修改受理积分配置信息失败");
		}
	}
	
	public Map<String, String> getResultMap() {
		return resultMap;
	}

	public void setResultMap(Map<String, String> resultMap) {
		this.resultMap = resultMap;
	}
	
	
	
}
