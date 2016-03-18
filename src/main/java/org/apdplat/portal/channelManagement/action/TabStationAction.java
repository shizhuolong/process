package org.apdplat.portal.channelManagement.action;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.portal.channelManagement.service.TabStationService;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * 基站管理
 * @author wcyong
 *
 */
@SuppressWarnings("serial")
public class TabStationAction extends BaseAction {
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	
	@Autowired
	private TabStationService service;
	private String orgId;
	private String orgLevel;
	private String code;
	private Map<String, String> resultMap;
	
	/**
	 * 查询基站管理组织架构树
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
	 * 查询基站列表数据
	 */
	public void queryStationList() {
		try {
			String station_addr_code = request.getParameter("station_addr_code");
			String station_addr_name = request.getParameter("station_addr_name");
			String isDivide = request.getParameter("isDivide");
			String dealdate=request.getParameter("dealdate");
			if(station_addr_code != null && !"".equals(station_addr_code.trim())) {
				resultMap.put("station_addr_code", "%"+station_addr_code+"%");
			}
			if(station_addr_name != null && !"".equals(station_addr_name.trim())) {
				resultMap.put("station_addr_name", "%"+station_addr_name+"%");
			}
			if(isDivide != null && !"".equals(isDivide.trim())) {
				resultMap.put("isDivide", isDivide);
			}
			if(dealdate != null && !"".equals(dealdate.trim())) {
				resultMap.put("dealdate", dealdate);
			}
			Object result = service.queryStationList(resultMap);
			this.reponseJson(result);
		} catch (Exception e) {
			logger.error("查询基站列表信息失败",e);
			outJsonPlainString(response,"{\"msg\":\"查询基站列表信息失败\"}");
		}
	}
	public void queryStationDetail() {
		try {
			String station_addr_code = request.getParameter("station_addr_code");
			String station_addr_name = request.getParameter("station_addr_name");
			String isDivide = request.getParameter("isDivide");
			String unitid=request.getParameter("unitid");
			String basetype=request.getParameter("basetype");
			//String orgLevel=request.getParameter("orgLevel");
			String dealdate=request.getParameter("dealdate");
			if(station_addr_code != null && !"".equals(station_addr_code.trim())) {
				resultMap.put("station_addr_code", "%"+station_addr_code+"%");
			}
			if(station_addr_name != null && !"".equals(station_addr_name.trim())) {
				resultMap.put("station_addr_name", "%"+station_addr_name+"%");
			}
			if(isDivide != null && !"".equals(isDivide.trim())) {
				resultMap.put("isDivide", isDivide);
			}
			if(unitid != null && !"".equals(unitid.trim())){
				resultMap.put("unitid", unitid);
			}
			if(basetype != null && !"".equals(basetype.trim())){
				if(basetype.trim().equals("2")){
					resultMap.put("basetype", "2G");
				}
				if(basetype.trim().equals("3")){
					resultMap.put("basetype", "3G");
				}
				
			}
			if(dealdate != null && !"".equals(dealdate.trim())) {
				resultMap.put("dealdate", dealdate);
			}
			Object result = service.queryStationDetail(resultMap);
			this.reponseJson(result);
		} catch (Exception e) {
			logger.error("查询基站列表信息失败",e);
			outJsonPlainString(response,"{\"msg\":\"查询基站列表信息失败\"}");
		}
	}
	
	/**
	 * 查询基站信息
	 */
	public void BaseDetail() {
		String station_name = request.getParameter("station_name").trim();
		String dealdate=request.getParameter("dealdate").trim();
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("station_name", "%"+station_name+"%");
		params.put("dealdate", dealdate);
		List<Map<String, Object>> list = service.baseDetail(params);
		this.reponseJson(list);
	}
	
	/**
	 * 查询营服中心
	 */
	public void listUnit() {
		try {
			String group_id_1 = request.getParameter("group_id_1");
			String unit_name = request.getParameter("unit_name");
			resultMap.put("group_id_1", group_id_1);
			if(unit_name != null && !"".equals(unit_name.trim())) {
				resultMap.put("unit_name", "%"+unit_name+"%");
			}
			Object result = service.listUnit(resultMap);
			this.reponseJson(result);
		} catch (Exception e) {
			logger.error("查询营服中心信息失败",e);
			outJsonPlainString(response,"{\"msg\":\"查询营服中心信息失败\"}");
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
