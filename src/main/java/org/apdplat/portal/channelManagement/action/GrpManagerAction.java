package org.apdplat.portal.channelManagement.action;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.portal.channelManagement.service.ChannelMangerService;
import org.apdplat.portal.channelManagement.service.GrpMangerService;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * 集客的客户经理及渠道经理
 * @author liyz
 *
 */
@SuppressWarnings("serial")
public class GrpManagerAction extends BaseAction {
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	@Autowired
	private GrpMangerService service;
	private String groupId;
	private String level;
	private String name;
	private String chanCode;
	private String dealDate;
	private String type;
	private String phone;
	private String developer;
	private String dev_num;
	
	//新增集客经理
	private String orgLevel;
	private String orgCode;
	private String unit_id;
	private String unit_name;
	private String grpType;
	private String devNum;
	private String hrNum;
	private String userName;
	private String regionCode;

	private Map<String, String> resultMap;

	public void addGrpManager(){
		Map<String,Object> m = new HashMap<String,Object>();
			if(grpType!=null&&!grpType.trim().equals("")){
				m.put("grpType", grpType);
			}
			if(devNum!=null&&!devNum.trim().equals("")){
				m.put("devNum", devNum);
			}
			if(hrNum!=null&&!hrNum.trim().equals("")){
				m.put("hrNum", hrNum);
			}
			if(userName!=null&&!userName.trim().equals("")){
				m.put("userName", userName);
			}
			if(regionCode!=null&&!regionCode.trim().equals("")){
				m.put("regionCode", regionCode);
			}
			if(dealDate!=null&&!dealDate.trim().equals("")){
				m.put("dealDate", dealDate);
			}
			
			try {
			int num = service.addGrpManager(m);
			if(num>0){
				this.reponseJson(num);
			}else{
				logger.error("插入集客经理失败");
				outJsonPlainString(response,"{\"msg\":\"插入集客经理失败\"}");
			}
		} catch (Exception e) {
			logger.error("插入集客经理失败",e);
			outJsonPlainString(response,"{\"msg\":\"插入集客经理失败\"}");
		}
	}
	//查询hr编码
	public void searchHrNum(){
		try {
			if(unit_id!=null&&!unit_id.trim().equals("")){
				resultMap.put("unit_id", unit_id);
			}
			if(grpType!=null&&!grpType.trim().equals("")){
				resultMap.put("grpType", grpType);
			}
			if(dealDate!=null&&!dealDate.trim().equals("")){
				resultMap.put("dealDate", dealDate);
			}
			Map<String,Object> result = service.searchHrNum(resultMap);
			this.reponseJson(result);
		} catch (Exception e) {
			logger.error("查询HR编码失败",e);
			outJsonPlainString(response,"{\"msg\":\"查询HR编码失败\"}");
		}
	}
	
	
	/**
	 *查询发展人编码（新增） 
	 */
	public void searchDevNum(){
		try {
			if(orgLevel!=null&&!orgLevel.trim().equals("")){
				resultMap.put("orgLevel", orgLevel);
			}
			if(orgCode!=null&&!orgCode.trim().equals("")){
				resultMap.put("orgCode", orgCode);
			}
			if(devNum!=null&&!devNum.trim().equals("")){
				resultMap.put("devNum", devNum);
			}
			if(unit_name!=null&&!unit_name.trim().equals("")){
				resultMap.put("unit_name", "%"+unit_name+"%");
			}
			if(dealDate!=null&&!dealDate.trim().equals("")){
				resultMap.put("dealDate", dealDate);
			}
			Object result = service.searchDevNum(resultMap);
			this.reponseJson(result);
		} catch (Exception e) {
			logger.error("查询发展人编码失败",e);
			outJsonPlainString(response,"{\"msg\":\"查询发展人编码失败\"}");
		}
	}
	
	/**
	 * 删除集客经理
	 */
	public  void delGrpPerson(){
		Map<String,Object> map = new HashMap<String,Object>();
		if(dev_num!=null&&!dev_num.trim().equals("")){
			map.put("dev_num", dev_num);
		}
		if(dealDate!=null&&!dealDate.trim().equals("")){
			map.put("dealDate", dealDate);
		}
		int num = service.delGrpPerson(map);
		this.reponseJson(num);
	}
	
	/**
	 * 查询集客的客户经理及渠道经理组织架构
	 */
	public void initTreeNode() {
		Map<String, Object> params = new HashMap<String, Object>();
		//取出用户信息
		User user=UserHolder.getCurrentLoginUser();
		if(null==groupId||groupId.trim().equals("")){
			groupId=user.getOrg().getCode();
			params.put("flag", "0");
		}else{
			params.put("flag", "1");
		}
		params.put("groupId", groupId);
		params.put("level", level);
		List<Map<String, Object>> list = service.listTreeNode(params);
		this.reponseJson(list);
	}
	
	
	/**
	 * 询渠道经理及营服中心负责人信息
	 */
	public void queryGrpPerson() {
		resultMap.put("groupId", groupId);
		if(level!=null&&!level.trim().equals("")){
			resultMap.put("level", level);
		}
		if(name!=null&&!name.trim().equals("")){
			resultMap.put("name","%"+ name+"%");
		}
		if(phone!=null&&!phone.trim().equals("")){
			resultMap.put("phone", "%"+phone+"%");
		}
		if(chanCode!=null&&!chanCode.trim().equals("")){
			resultMap.put("chanCode", "%"+chanCode+"%");
		}
		if(dealDate!=null&&!dealDate.trim().equals("")){
			resultMap.put("dealDate", dealDate);
		}
		if(type!=null&&!type.trim().equals("")){
			resultMap.put("type", type);
		}
		if(developer!=null&&!developer.trim().equals("")){
			resultMap.put("developer", developer);
		}
		Object result = service.queryGrpPerson(resultMap);
		this.reponseJson(result);
	}
	
	
	public String getGroupId() {
		return groupId;
	}
	public void setGroupId(String groupId) {
		this.groupId = groupId;
	}
	public String getLevel() {
		return level;
	}
	public void setLevel(String level) {
		this.level = level;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getChanCode() {
		return chanCode;
	}
	public void setChanCode(String chanCode) {
		this.chanCode = chanCode;
	}

	public String getDealDate() {
		return dealDate;
	}
	public void setDealDate(String dealDate) {
		this.dealDate = dealDate;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public String getDeveloper() {
		return developer;
	}
	public void setDeveloper(String developer) {
		this.developer = developer;
	}
	public String getDev_num() {
		return dev_num;
	}
	public void setDev_num(String dev_num) {
		this.dev_num = dev_num;
	}
	public String getOrgLevel() {
		return orgLevel;
	}
	public void setOrgLevel(String orgLevel) {
		this.orgLevel = orgLevel;
	}
	public String getOrgCode() {
		return orgCode;
	}
	public void setOrgCode(String orgCode) {
		this.orgCode = orgCode;
	}
	
	public String getUnit_id() {
		return unit_id;
	}


	public void setUnit_id(String unit_id) {
		this.unit_id = unit_id;
	}


	public String getGrpType() {
		return grpType;
	}
	public void setGrpType(String grpType) {
		this.grpType = grpType;
	}


	public String getDevNum() {
		return devNum;
	}


	public void setDevNum(String devNum) {
		this.devNum = devNum;
	}


	public String getHrNum() {
		return hrNum;
	}


	public void setHrNum(String hrNum) {
		this.hrNum = hrNum;
	}


	public String getUnit_name() {
		return unit_name;
	}
	public void setUnit_name(String unit_name) {
		this.unit_name = unit_name;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	
	public String getRegionCode() {
		return regionCode;
	}
	public void setRegionCode(String regionCode) {
		this.regionCode = regionCode;
	}
	
	public Map<String, String> getResultMap() {
		return resultMap;
	}
	public void setResultMap(Map<String, String> resultMap) {
		this.resultMap = resultMap;
	}
	
	
}
