package org.apdplat.portal.channelManagement.action;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.action.BaseAction;
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
	@Autowired
	private GrpMangerService service;
	private String groupId;
	private String level;
	private String name;
	private String chanCode;
	private String chanName;
	private String type;
	private String phone;
	private String developer;
	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
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

	public String getChanName() {
		return chanName;
	}

	public void setChanName(String chanName) {
		this.chanName = chanName;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	private Map<String, String> resultMap;
	
	public Map<String, String> getResultMap() {
		return resultMap;
	}

	public void setResultMap(Map<String, String> resultMap) {
		this.resultMap = resultMap;
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
		if(chanName!=null&&!chanName.trim().equals("")){
			resultMap.put("chanName", "%"+chanName+"%");
		}
		if(type!=null&&!type.trim().equals("")){
			resultMap.put("type", type);
		}
		if(developer!=null&&!developer.trim().equals("")){
			resultMap.put("developer", developer);
		}
		System.out.println("----------------------------------");
		System.out.println("groupId:"+groupId+",level:"+level+",name:"+name+",chanCode:"+chanCode+",chanName:"+chanName+",type:"+type);
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

	public String getDeveloper() {
		return developer;
	}

	public void setDeveloper(String developer) {
		this.developer = developer;
	}

	
	
}
