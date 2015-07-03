package org.apdplat.portal.common.dao;

import java.util.List;
import java.util.Map;

import org.apdplat.portal.common.bean.StaticParaBean;

public interface CommonParamDao {
	
	public List<Map<String,Object>> qryRegionParam(String regionCode);

	public List<Map<String,Object>> qryPartnersByDeaprtCode(String regionCode);
	
	public List<Map<String,Object>> qryBrandNames(Map<String,String> map);
	
	public List<Map<String,String>> qryPartnersSimpleNameOfRegion(Map<String,String> var);
	
	public List<Map<String,String>> qryPositionsById(String parentId);
	
	public String getId();
	
	public StaticParaBean qryStaticParaByParaCode(String paraCode);
	
}
