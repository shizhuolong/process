package org.apdplat.portal.common.action;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.apdplat.module.security.model.Org;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.exception.BusiException;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.portal.common.Constant;
import org.apdplat.portal.common.bean.StaticParaBean;
import org.apdplat.portal.common.service.CommonParamService;
import org.springframework.beans.factory.annotation.Autowired;

public class CommonParamAction extends BaseAction {

	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	private static final long serialVersionUID = -1658467334048400859L;
	
	@Autowired  
	private CommonParamService commonParamService;
	
	private String parentId;
	private String paraCode;
	
	
	public void doQryRegionNames() {
		
		List<Map<String,Object>> list = commonParamService.qryRegionParam();
		this.reponseJson(list);
	}
	
	public void doQryPartnersByDeaprtCode() {
		
		List<Map<String,Object>> list = commonParamService.qryPartnersByDeaprtCode();
		this.reponseJson(list);
	}
	
	/**
	 * 查询品牌查询条件
	 */
	public void doQryBrandNames() {
		
		try{
			String productType = request.getParameter("productType");
			String regionCode = "";
			if(StringUtils.isBlank(productType)) {
				throw new BusiException("产品类型不能为空！");
			}
			Org org = UserHolder.getCurrentLoginUser().getOrg();
			if(!Constant.PROVINCE_LEVEL.equals(org.getOrgLevel())) {
				regionCode = org.getRegionCode();
			}
			List<Map<String,Object>> list = commonParamService.qryBrandNames(regionCode, productType);
			this.reponseJson(list);
		}catch(BusiException e){
			logger.error(e.getMessage(),e);
			outJsonPlainString(response,"{\"msg\":\""+e.getMessage()+"\"}");
		}catch(Exception e) {
			outJsonPlainString(response,"{\"msg\":\""+e.getMessage()+"\"}");
			logger.error(e.getMessage(),e);
		}
	}
	
	/**查询代理商简称**/
	public void qryPartnersSimpleNameOfRegion() {
		
		User user = UserHolder.getCurrentLoginUser();
		Org org = user.getOrg();
		Map<String,String> var = new HashMap<String,String>();
		var.put("orgLevel", org.getOrgLevel());
		String regionCode = request.getParameter("regionCode");
		if(StringUtils.isNotBlank(regionCode)) {
			var.put("regionCode",regionCode);
		}else {
			if(Constant.REGION_LEVEL.equals(org.getOrgLevel())) {
				var.put("regionCode", org.getRegionCode());
			}else if(Constant.CITY_LEVEL.equals(org.getOrgLevel())) {
				var.put("cityCode", org.getAreaCode());
			}else if(Constant.DEPART_LEVEL.equals(org.getOrgLevel())){
				var.put("departCode",org.getCode());
			}
		}
		List<Map<String,String>> list = commonParamService.qryPartnersSimpleNameOfRegion(var);
		this.reponseJson(list);
	}
	
	
	public void qryPositionsById() {
		
		List<Map<String,String>> list = commonParamService.qryPositionsById(parentId);
		this.reponseJson(list);
	}
	
	public void qryStaticParaByParaCode() {
		
		StaticParaBean staticParaBean = commonParamService.qryStaticParaByParaCode(paraCode);
		this.reponseJson(staticParaBean);
	}

	public void setParentId(String parentId) {
		this.parentId = parentId;
	}

	public void setParaCode(String paraCode) {
		this.paraCode = paraCode;
	}
	
	

}
