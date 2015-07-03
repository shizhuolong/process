package org.apdplat.portal.channelManagement.action;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.portal.channelManagement.service.NotReatyMangerService;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * 无协议渠道管理
 * @author lyz
 *
 */
@SuppressWarnings("serial")
public class NotReatyManagerAction extends BaseAction {
	
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	
	@Autowired
	private NotReatyMangerService service;
	private String orgId;
	private String orgLevel;
	private String code;
	private Map<String, String> resultMap;
	private Map<String,String> model;
	
	public Map<String, String> getModel() {
		return model;
	}

	public void setModel(Map<String, String> model) {
		this.model = model;
	}

	private String name;
	private String username;
	
	private String unitId;
	private String areaCode;
	
	public String getUnitId() {
		return unitId;
	}

	public void setUnitId(String unitId) {
		this.unitId = unitId;
	}

	public String getAreaCode() {
		return areaCode;
	}

	public void setAreaCode(String areaCode) {
		this.areaCode = areaCode;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	/**
	 * 查询无协议渠道组织架构
	 */
	public void listTreeNode() {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("orgId", orgId);
		params.put("orgLevel", orgLevel);
		params.put("code", code);
		List<Map<String, Object>> list = service.listTreeNode(params);
		this.reponseJson(list);
	}
	
	/**
	 * 查询无协议渠道信息
	 */
	public void list() {
		try {
			String chanlName = request.getParameter("chanlName");
			String chanlCode = request.getParameter("chanlCode");
			String unitName = request.getParameter("unitName");
			String status = request.getParameter("status");
			if(chanlName != null && !"".equals(chanlName.trim())) {
				resultMap.put("chanlName", "%"+chanlName+"%");
			}
			if(status != null && !"".equals(status.trim())) {
				resultMap.put("status", status);
			}
			if(chanlCode != null && !"".equals(chanlCode.trim())) {
				resultMap.put("chanlCode", "%"+chanlCode+"%");
			}
			if(unitName != null && !"".equals(unitName.trim())) {
				resultMap.put("unitName", "%"+unitName+"%");
			}
			Object result = service.list(resultMap);
			this.reponseJson(result);
		} catch (Exception e) {
			logger.error("查询无协议渠道信息失败",e);
			outJsonPlainString(response,"{\"msg\":\"查询无协议渠道信息失败\"}");
		}
	}
	/**
	 * 查询地市
	 */
	public void listArea(){
		Map<String, String> params = new HashMap<String, String>();
		params.put("orgId", orgId);
		params.put("orgLevel", orgLevel);
		Object result = service.listArea(params);
		this.reponseJson(result);
	}
	/**
	 * 查询营服中心
	 */
	public void listServiceCenter(){
		Map<String, String> params = new HashMap<String, String>();
		params.put("orgId", orgId);
		params.put("orgLevel", orgLevel);
		this.reponseJson(service.listServiceCenter(params));
	}
	/**
	 * 查询某地市下是否存在该渠道名称
	 * @return 
	 */
	public void hasChanlName(){
		this.reponseJson(service.hasChanlName(resultMap));
	}
	/**
	 * 根据渠道编码获取渠道名称和编码
	 * @return 
	 */
	public void getChanlByCode(){
		this.reponseJson(service.getChanlByCode(resultMap));
	}
	/**
	 * 获取可以选择的渠道经理列表
	 * @return 
	 */
	public void listValidUsers(){
		if(name != null && !"".equals(name.trim())) {
			resultMap.put("name", "%"+name+"%");
		}
		if(username != null && !"".equals(username.trim())) {
			resultMap.put("username", "%"+username+"%");
		}
		resultMap.put("areaCode", areaCode);
		resultMap.put("unitId", unitId);
		this.reponseJson(service.listValidUsers(resultMap));
	}
	/**
	 * 新增无协议渠道
	 * @param params
	 * @return
	 */
	public void addUnit(){
		Map<String, Object> result=new HashMap<String, Object>();
		int r=0;
		try{
			r=service.addUnit(model);
		}catch(Exception e){
			e.printStackTrace();
		}
		result.put("result", r);
		result.put("model", model);
		this.reponseJson(result);
	}
	/**
	 * 更新无协议渠道
	 * @param params
	 * @return
	 */
    public void updateUnit(){
    	Map<String, Object> result=new HashMap<String, Object>();
		int r=0;
		try{
			r=service.updateUnit(model);
		}catch(Exception e){
			e.printStackTrace();
		}
		result.put("result", r);
		this.reponseJson(result);
    }
    /**
	 * 失效无协议渠道
	 * @param params
	 * @return
	 */
    public void delUnit(){
    	Map<String, Object> result=new HashMap<String, Object>();
		int r=0;
		try{
			r=service.delUnit(model);
		}catch(Exception e){
			e.printStackTrace();
		}
		result.put("result", r);
		this.reponseJson(result);
    }
    /**
   	 * 获取无协议渠道
   	 * @param params
   	 * @return
   	 */
   	public void getUnit(){
   		this.reponseJson(service.getUnit(model));
   	}
   	/**
	 * 获取无协议渠道图片
	 * @param params
	 * @return
	 */
	public void getPic(){
		this.reponseJson(service.getPic(model));
	}
	public String index(){
		return "success";
	}
	public String add(){
		return "add";
	}
	public String view(){
		return "view";
	}
	public String edit(){
		return "edit";
	}
	public Map<String, String> getResultMap() {
		return resultMap;
	}

	public void setResultMap(Map<String, String> resultMap) {
		this.resultMap = resultMap;
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
	
	
}
