package org.apdplat.performanceAppraisal.payment.action;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.performanceAppraisal.payment.service.SaleTargetConfigService;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.log.APDPlatLogger;
import org.springframework.beans.factory.annotation.Autowired;

@SuppressWarnings("serial")
public class SaleTargetConfigAction extends BaseAction {
	
	private final APDPlatLogger logger = new APDPlatLogger(getClass());

	@Autowired
	private SaleTargetConfigService saleTargetConfigService;
	private Map<String, String> resultMap;
	
	
	/**
	 * 查询销售积分配置列表信息
	 */
	public void list() {
		String itemcode = request.getParameter("itemcode");
		String itemdesc = request.getParameter("itemdesc");
		String busitype = request.getParameter("busitype");
		String busidesc = request.getParameter("busidesc");
		
		if(itemcode != null && !"".equals(itemcode.trim())) {
			resultMap.put("itemcode", itemcode);
		}
		if(itemdesc != null && !"".equals(itemdesc.trim())) {
			resultMap.put("itemdesc", "%"+itemdesc+"%");
		}
		if(busitype != null && !"".equals(busitype.trim())) {
			resultMap.put("busitype", busitype);
		}
		if(busidesc != null && !"".equals(busidesc.trim())) {
			resultMap.put("busidesc", "%"+busidesc+"%");
		}
		Object result = saleTargetConfigService.list(resultMap);
		this.reponseJson(result);
	}
	
	/**
	 * 验证添加销售积分指标是否重复
	 */
	public void validSaleTarget() {
		try {
			String itemcode = request.getParameter("itemcode");
			String itemdesc = request.getParameter("itemdesc");
			Map<String, String> params = new HashMap<String, String>();
			params.put("itemcode", itemcode);
			params.put("itemdesc", itemdesc);
			List<Map<String, Object>> list = saleTargetConfigService.loadCountByCodeAndDesc(params);
			int itemcodeNum = Integer.parseInt(String.valueOf(list.get(0).get("ITEMCODENUM")));
			int itemdescNum = Integer.parseInt(String.valueOf(list.get(0).get("ITEMDESCNUM")));
			if(itemcodeNum>0 && itemdescNum>0) {
				this.outJsonPlainString(response, "{\"msg\":\"指标编码和指标描述已经存在了，不能重复添加.\"}");
			}else if(itemcodeNum>0 && itemdescNum<=0){
				this.outJsonPlainString(response, "{\"msg\":\"指标编码已经存在了，不能重复添加.\"}");
			}else if(itemcodeNum<=0 && itemdescNum>0){
				this.outJsonPlainString(response, "{\"msg\":\"指标描述已经存在了，不能重复添加.\"}");
			}else {
				this.outJsonPlainString(response, "{\"msg\":\"0\"}");
			}
		} catch (Exception e) {
			logger.error("验证指标编码和指标描述查询失败",e);
			this.outJsonPlainString(response, "{\"msg\":\"验证指标编码和指标描述查询失败.\"}");
		}
	}
	
	/**
	 * 添加销售积分指标
	 */
	public void saveTarget() {
		try {
			String itemcode = request.getParameter("itemcode");
			String itemdesc = request.getParameter("itemdesc");
			String busitype = request.getParameter("busitype");
			String busidesc = request.getParameter("busidesc");
			String cre = request.getParameter("cre");
			String money = request.getParameter("money");
			Map<String, String> params = new HashMap<String,String>();
			params.put("itemcode", itemcode);
			params.put("itemdesc", itemdesc);
			params.put("busitype", busitype);
			params.put("busidesc", busidesc);
			params.put("cre", cre);
			params.put("money", money);
			saleTargetConfigService.saveTarget(params);
			this.reponseJson("操作成功");
		} catch (Exception e) {
			logger.error("添加销售积分配置信息失败",e);
			this.reponseJson("添加销售积分配置信息失败");
		}
	}
	
	/**
	 * 根据指标编码查询销售积分指标
	 */
	public void loadTarget() {
		String sourcecode = request.getParameter("sourcecode");
		Map<String, String> params = new HashMap<String, String>();
		params.put("sourcecode", sourcecode);
		List<Map<String, Object>> list = saleTargetConfigService.loadTarget(params);
		this.reponseJson(list);
	}
	
	/**
	 * 验证修改销售积分指标是否重复
	 */
	public void validUpdateSaleTarget() {
		try {
			String itemcode = request.getParameter("itemcode");
			String itemdesc = request.getParameter("itemdesc");
			String sourcecode = request.getParameter("sourcecode");
			Map<String, String> params = new HashMap<String, String>();
			params.put("itemcode", itemcode);
			params.put("itemdesc", itemdesc);
			params.put("sourcecode", sourcecode);
			List<Map<String, Object>> list = saleTargetConfigService.loadUpdateCount(params);
			int itemcodeNum = Integer.parseInt(String.valueOf(list.get(0).get("ITEMCODENUM")));
			int itemdescNum = Integer.parseInt(String.valueOf(list.get(0).get("ITEMDESCNUM")));
			if(itemcodeNum>0 && itemdescNum>0) {
				this.outJsonPlainString(response, "{\"msg\":\"指标编码和指标描述已经存在了，不能重复添加.\"}");
			}else if(itemcodeNum>0 && itemdescNum<=0){
				this.outJsonPlainString(response, "{\"msg\":\"指标编码已经存在了，不能重复添加.\"}");
			}else if(itemcodeNum<=0 && itemdescNum>0){
				this.outJsonPlainString(response, "{\"msg\":\"指标描述已经存在了，不能重复添加.\"}");
			}else {
				this.outJsonPlainString(response, "{\"msg\":\"0\"}");
			}
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("验证指标编码和指标描述查询失败",e);
			this.outJsonPlainString(response, "{\"msg\":\"验证指标编码和指标描述查询失败.\"}");
		}
	}
	
	/**
	 * 修改销售积分指标
	 */
	public void updateTarget() {
		try {
			String itemcode = request.getParameter("itemcode");
			String itemdesc = request.getParameter("itemdesc");
			String busitype = request.getParameter("busitype");
			String busidesc = request.getParameter("busidesc");
			String cre = request.getParameter("cre");
			String money = request.getParameter("money");
			String state = request.getParameter("state");
			String sourcecode = request.getParameter("sourcecode");
			Map<String, String> params = new HashMap<String,String>();
			params.put("itemcode", itemcode);
			params.put("itemdesc", itemdesc);
			params.put("busitype", busitype);
			params.put("busidesc", busidesc);
			params.put("cre", cre);
			params.put("money", money);
			params.put("state", state);
			params.put("sourcecode", sourcecode);
			saleTargetConfigService.updateTarget(params);
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
