package org.apdplat.selfrpt.action;

import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.apache.struts2.interceptor.SessionAware;
import org.apache.struts2.json.annotations.JSON;
import org.apdplat.module.security.model.Org;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;


public class PortalBaseAction implements SessionAware{
	@Override
	public void setSession(Map<String, Object> session) {
	}
	@JSON(serialize = false)
	public String getUserId(){
		User user = UserHolder.getCurrentLoginUser();
		return user.getId().toString();
	}
	@JSON(serialize = false)
	public String getUserName(){
		User user = UserHolder.getCurrentLoginUser();
		return user.getUsername();
	}
	@JSON(serialize = false)
	public String getUserAccount(){
		User user = UserHolder.getCurrentLoginUser();
		return user.getUsername();
	}
	@JSON(serialize = false)
	public Long getOrgId(){
		User user = UserHolder.getCurrentLoginUser();
		Org org = user.getOrg();
		return Long.parseLong(org.getCode());
	}
	@JSON(serialize = false)
	public String getOrgCode(){
		User user = UserHolder.getCurrentLoginUser();
		Org org = user.getOrg();
		return org.getCode();
	}
	@JSON(serialize = false)
	public String getOrgLevel(){
		User user = UserHolder.getCurrentLoginUser();
		Org org = user.getOrg();
		return org.getOrgLevel();
	}
	@JSON(serialize = false)
	public Integer getOrgLevelInt(){
		User user = UserHolder.getCurrentLoginUser();
		Org org = user.getOrg();
		return Integer.parseInt(org.getOrgLevel());
	}	
	@JSON(serialize = false)
	public String getRegionCde(){
		User user = UserHolder.getCurrentLoginUser();
		Org org = user.getOrg();
		String regionCode=org.getRegionName();
		if(org.getOrgLevel().equals("1")){
			regionCode="";
		}
		return regionCode;
	}
	@JSON(serialize = false)
	public String getRegionName(){
		User user = UserHolder.getCurrentLoginUser();
		Org org = user.getOrg();
		String regionName=org.getRegionName();
		if(org.getOrgLevel().equals("1")){
			regionName="";
		}
		return regionName;
	}
	@JSON(serialize = false)
	public String getCityCde(){
		User user = UserHolder.getCurrentLoginUser();
		Org org = user.getOrg();
		String areaCode=org.getAreaCode();
		if(org.getOrgLevel().equals("1")){
			areaCode="";
		}
		return areaCode;
	}
	@JSON(serialize = false)
	public String getCityName(){
		User user = UserHolder.getCurrentLoginUser();
		Org org = user.getOrg();
		String areaName=org.getAreaName();
		if(org.getOrgLevel().equals("1")){
			areaName="";
		}
		return areaName;
	}
	
	@JSON(serialize = false)
	public Integer getAppDataRightType(){
		return 2;
	}

	public String  getOrgPmn(String[] columnNames,String whereValues){
		String orgPmn="";
		if(null != StringUtils.trimToNull(getRegionName())){
			for(int i=0;i<columnNames.length;i++){
				if("region_name".equals(columnNames[i])){
					orgPmn+=i+":'"+getRegionName()+"';";
				}
			}
		}
		if(null != StringUtils.trimToNull(getCityName())){
			for(int i=0;i<columnNames.length;i++){
				if("city_cde".equals(columnNames[i])){
					orgPmn+=i+":'"+getCityCde()+"';";
				}
			}
		}
		if(null != StringUtils.trimToNull(orgPmn)){
			orgPmn = orgPmn.substring(0, orgPmn.length()-1);
		}
		if(null != StringUtils.trimToNull(orgPmn)&&null != StringUtils.trimToNull(whereValues)){
			orgPmn += ";"+whereValues;
		}else if(null == StringUtils.trimToNull(orgPmn)&&null != StringUtils.trimToNull(whereValues)){
			orgPmn = whereValues;
		}
		
		return orgPmn;
	}
	
	
}
