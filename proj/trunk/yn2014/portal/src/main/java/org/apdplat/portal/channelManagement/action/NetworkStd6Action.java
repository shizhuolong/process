package org.apdplat.portal.channelManagement.action;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.portal.channelManagement.service.NetworkStd6Service;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * 固网小区负责人绑定
 * @author wcyong
 *
 */
@SuppressWarnings("serial")
public class NetworkStd6Action extends BaseAction {
	
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	
	@Autowired
	private NetworkStd6Service networkStd6Service;
	private String orgId;
	private String orgLevel;
	private String code;
	private Map<String, String> resultMap;
	
	/**
	 * 查询固网名单制小区清单
	 */
	public void listNetworkStd6() {
		try {
			String std_6_id = request.getParameter("std_6_id");
			String std_6_name = request.getParameter("std_6_name");
			if(std_6_id != null && !"".equals(std_6_id.trim())) {
				resultMap.put("std_6_id", std_6_id);
			}
			if(std_6_name != null && !"".equals(std_6_name.trim())) {
				resultMap.put("std_6_name", "%"+std_6_name+"%");
			}
			Object result = networkStd6Service.listNetworkStd6(resultMap);
			this.reponseJson(result);
		} catch (Exception e) {
			logger.error("查询固网名单制小区信息失败",e);
			outJsonPlainString(response,"{\"msg\":\"查询固网名单制小区信息失败\"}");
		}
	}
	
	/**
	 * 查询营服中心
	 */
	public void listUnit() {
		try {
			String group_id_1 = request.getParameter("group_id_1");
			String std_6_id = request.getParameter("std_6_id");
			String unit_name = request.getParameter("unit_name");
			resultMap.put("group_id_1", group_id_1);
			resultMap.put("std_6_id", std_6_id);
			if(unit_name != null && !"".equals(unit_name.trim())) {
				resultMap.put("unit_name", "%"+unit_name+"%");
			}
			Object result = networkStd6Service.listUnit(resultMap);
			this.reponseJson(result);
		} catch (Exception e) {
			logger.error("查询营服中心信息失败",e);
			outJsonPlainString(response,"{\"msg\":\"查询营服中心信息失败\"}");
		}
	}
	
	/**
	 * 划分名单制小区归属
	 */
	public void saveDivideStd6() {
		//步骤：
		//1.更新PCDE.TAB_CDE_6_STD表中的unit_id,unit_name
		//2.删除PORTAL.TAB_PORTAL_NET_PERSON表中绑定的人
		try {
			String unit_id = request.getParameter("unit_id");
			String unit_name = request.getParameter("unit_name");
			String std_6_id = request.getParameter("std_6_id");
			String login_name = request.getParameter("login_name");
			Map<String, String> params = new HashMap<String, String>();
			params.put("unit_id", unit_id);
			params.put("unit_name", unit_name);
			params.put("std_6_id", std_6_id);
			params.put("login_name", login_name);
			networkStd6Service.saveDivideStd6(params);
			outJsonPlainString(response,"{\"msg\":\"操作成功\"}");
		} catch (Exception e) {
			logger.error("将小区划分营服中心操作失败",e);
			outJsonPlainString(response,"{\"msg\":\"将小区划分营服中心操作失败\"}");
		}
	}
	
	/**
	 * 修改名单制小区信息
	 */
	public void update() {
		try {
			String std_6_id = request.getParameter("std_6_id");
			String house_pe = request.getParameter("house_pe");
			String cover_house_pe = request.getParameter("cover_house_pe");
			String jd = request.getParameter("jd");
			String wd = request.getParameter("wd");
			String zw_name = request.getParameter("zw_name");
			String zw_name_num = request.getParameter("zw_name_num");
			String service_name = request.getParameter("service_name");
			String service_num = request.getParameter("service_num");
			Map<String, String> params = new HashMap<String, String>();
			params.put("std_6_id", std_6_id);
			params.put("house_pe", house_pe);
			params.put("cover_house_pe", cover_house_pe);
			params.put("jd", jd);
			params.put("wd", wd);
			params.put("zw_name", zw_name);
			params.put("zw_name_num", zw_name_num);
			params.put("service_name", service_name);
			params.put("service_num", service_num);
			networkStd6Service.update(params);
			outJsonPlainString(response,"{\"msg\":\"操作成功\"}");
		} catch (Exception e) {
			logger.error("修改名单制小区信息失败！",e);
			outJsonPlainString(response,"{\"msg\":\"修改名单制小区信息失败！\"}");
		}
		
	}
	
	/**
	 * 根据名单制小区编码获取名单制小区信息
	 */
	public void loadById() {
		String std_6_id = request.getParameter("std_6_id");
		List<Map<String, Object>> list = networkStd6Service.loadById(std_6_id);
		this.reponseJson(list);
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
