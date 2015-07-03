package org.apdplat.portal.monitorUser.action;

import java.sql.Timestamp;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.portal.monitorUser.service.MonitorUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;


/**
 * 监控用户管里
 * @author lyz
 *
 */
@SuppressWarnings("serial")
@Controller
@Scope("prototype")
public class MonitorUserAction extends BaseAction {

	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	
	@Autowired
	private MonitorUserService service;
	
	private Map<String, String> resultMap;
	
	
	private String id;
	private String name;
	private String phone;
	private String isUncom;
	private String sendFlag;
	private String busiType;
    private String regionCode;
    private String unitCode;
    
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getIsUncom() {
		return isUncom;
	}

	public void setIsUncom(String isUncom) {
		this.isUncom = isUncom;
	}

	public String getSendFlag() {
		return sendFlag;
	}

	public void setSendFlag(String sendFlag) {
		this.sendFlag = sendFlag;
	}

	public String getBusiType() {
		return busiType;
	}

	public void setBusiType(String busiType) {
		this.busiType = busiType;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public Map<String, String> getResultMap() {
		return resultMap;
	}

	public void setResultMap(Map<String, String> resultMap) {
		this.resultMap = resultMap;
	}
	
	public String getRegionCode() {
		return regionCode;
	}

	public void setRegionCode(String regionCode) {
		this.regionCode = regionCode;
	}
    
	public String getUnitCode() {
		return unitCode;
	}

	public void setUnitCode(String unitCode) {
		this.unitCode = unitCode;
	}

	/**
	 * 获取列表
	 */
	public void list() {
		if(name!=null&&!name.trim().equals("")){
			resultMap.put("name", "%"+name+"%");
		}
		if(phone!=null&&!phone.trim().equals("")){
			resultMap.put("phone", "%"+phone+"%");
		}
		if(sendFlag!=null&&!sendFlag.trim().equals("")){
			resultMap.put("sendFlag", sendFlag);
		}
		if(isUncom!=null&&!isUncom.trim().equals("")){
			resultMap.put("isUncom", isUncom);
		}
		if(regionCode!=null&&!regionCode.trim().equals("")){
			resultMap.put("regionCode", regionCode);
		}
		if(unitCode!=null&&!unitCode.trim().equals("")){
			resultMap.put("unitCode", unitCode);
		}
		Object list = service.list(resultMap);
		this.reponseJson(list);
	}

	
	/**
	 * 增加
	 */
	public void add() {
		int r=0;
		String id=resultMap.get("id");
		String levelDesc=resultMap.get("levelDesc");
		if(levelDesc!=null&&levelDesc.trim().equals("省级管理员")){
			resultMap.put("levelDesc", "01");
		}
		if(levelDesc!=null&&levelDesc.trim().equals("地市管理员")){
			resultMap.put("levelDesc", "02");
			System.out.println(resultMap);
		}
		if(levelDesc!=null&&levelDesc.trim().equals("营服管理员")){
			resultMap.put("levelDesc", "03");
		}
		if(id!=null&&!id.trim().equals("")){
			r=service.update(resultMap);
		}else{
			r=service.add(resultMap);
		}
		Map<String, Boolean> result=new HashMap<String, Boolean>();
		if(r>0){
			result.put("ok", true);
		}else{
			result.put("ok", false);
		}
		this.reponseJson(result);
	}
	/**
	 * 删除
	 */
	public void del() {
		if(null!=id){
			//删除数据库
			int r=service.del(id);
			Map<String, Boolean> result=new HashMap<String, Boolean>();
			if(r>0){
				result.put("ok", true);
			}else{
				result.put("ok", false);
			}
			this.reponseJson(result);
		}
	}
}
