package org.apdplat.portal.channelManagement.action;

import java.util.HashMap;
import java.util.Map;

import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.portal.channelManagement.service.FreeCommunityManagerService;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * 游离小区绑定
 * @author levovo
 *
 */
public class FreeCommunityManagerAction extends BaseAction{
	private static final long serialVersionUID = 1L;
	
	@Autowired
	private FreeCommunityManagerService freeCommunityManager;
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	private String orgId;
	private String orgLevel;
	private String code;
	private Map<String,String> resultMap;
	
	/**
	 * 查询营服中心
	 */
	public void listUnit(){
		try {
			String group_id_1 = request.getParameter("group_id_1");
			String std_6_id = request.getParameter("std_6_id");
			String unit_name = request.getParameter("unit_name");
			resultMap.put("std_6_id", std_6_id);
			resultMap.put("group_id_1", group_id_1);
			if(unit_name!=null && !"".equals(unit_name)){
				resultMap.put("unit_name", "%"+unit_name+"%");
			}
			Object result = freeCommunityManager.listUnit(resultMap);
			this.reponseJson(result);
		} catch (Exception e) {
			logger.error("查询营服中心信息失败",e);
			outJsonPlainString(response,"{\"msg\":\"查询营服中心信息失败\"}");
		}
	}

	/**
	 * 绑定游离小区到营服中心
	 */
	public void saveFreeCommunity(){
		try {
			String unit_id = request.getParameter("unit_id");
			String unit_name = request.getParameter("unit_name");
			String std_6_id  = request.getParameter("std_6_id");
			Map<String,Object> params =  new HashMap<String, Object>(); 
			params.put("unit_id", unit_id);
			params.put("unit_name", unit_name);
			params.put("std_6_id", std_6_id);
			Object result = freeCommunityManager.saveFreeCommunity(params);
			if(result!=null){
				outJsonPlainString(response,"{\"msg\":\"将小区划分营服中心操作成功\"}");
			}else{
				outJsonPlainString(response,"{\"msg\":\"将小区划分营服中心操作失败\"}");
			}
			
		} catch (Exception e) {
			logger.error("将小区划分营服中心操作失败",e);
			outJsonPlainString(response,"{\"msg\":\"将小区划分营服中心操作失败\"}");
		}
		
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

	public Map<String, String> getResultMap() {
		return resultMap;
	}

	public void setResultMap(Map<String, String> resultMap) {
		this.resultMap = resultMap;
	}

	
	
}
