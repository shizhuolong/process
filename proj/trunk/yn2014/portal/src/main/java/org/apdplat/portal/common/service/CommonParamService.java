package org.apdplat.portal.common.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.module.security.model.Org;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.portal.common.Constant;
import org.apdplat.portal.common.bean.StaticParaBean;
import org.apdplat.portal.common.dao.CommonParamDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CommonParamService {
	
	@Autowired
	private CommonParamDao commonParamDao;
	
	/**地市查询条件**/
	public List<Map<String,Object>> qryRegionParam() {
		
		String regionCode = "";
		Org org = UserHolder.getCurrentLoginUser().getOrg();
		if(!Constant.PROVINCE_LEVEL.equals(org.getOrgLevel())) {
			regionCode = org.getRegionCode();
		}
		
		return commonParamDao.qryRegionParam(regionCode);
	}
	
	/**合作商查询条件**/
	public List<Map<String,Object>> qryPartnersByDeaprtCode() {
		
		Org org = UserHolder.getCurrentLoginUser().getOrg();
		String departCode = org.getCode();
		
		return commonParamDao.qryPartnersByDeaprtCode(departCode);
	}
	
	/**
	 * 从产品信息表查询品牌信息
	 * @param regionCode	不为空则查对应地市的品牌
	 * @param productType	产品类型
	 * @return
	 */
	public List<Map<String,Object>> qryBrandNames(String regionCode,String productType) {
		
		Map<String,String> map = new HashMap<String,String>();
		map.put("regionCode", regionCode);
		map.put("productType", productType);
		return commonParamDao.qryBrandNames(map);
	}
	
	
	public List<Map<String,String>> qryPartnersSimpleNameOfRegion(Map<String,String> var) {
		
		return commonParamDao.qryPartnersSimpleNameOfRegion(var);
	}
	
	public List<Map<String,String>> qryPositionsById(String parentId) {
		
		return commonParamDao.qryPositionsById(parentId);
	}
	
	public String getId() {
		return commonParamDao.getId();
	}
	
	public StaticParaBean qryStaticParaByParaCode(String paraCode) {
		
		return commonParamDao.qryStaticParaByParaCode(paraCode);
	}

}
