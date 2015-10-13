package org.apdplat.taskManagement.common.action;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.module.security.model.Org;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.exception.BusiException;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.taskManagement.common.service.ScheduleCommonService;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * @author suyi
 * @date 2015年3月23日
 */
public class ScheduleCommonAction extends BaseAction{

	private static final long serialVersionUID = -1967286443869397354L;
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	
	@Autowired
	private ScheduleCommonService scheduleCommonService;
	
	private String code1;
	private String task_region_code;
	private String type;
	private String userType;
	private String month;

	
	public String getMonth() {
		return month;
	}

	public void setMonth(String month) {
		this.month = month;
	}

	public void qryIndexInfoList() {
		
		List<Map<String,String>> list = scheduleCommonService.qryIndexInfoList(code1);
		this.reponseJson(list);
	}
	
	public void qrySubordinateAreas() {
		
		List<Map<String,String>> list = scheduleCommonService.qrySubordinateAreaByCode(code1);
		this.reponseJson(list);
	}
	
	/**
	 * 通过任务region_code查看下级地域
	 * 1.营服中心分解到渠道经理：根据营服中心编码和营服中心责任人类型查询下级负责人信息
	 * 		type 1:营服中心责任人,2:渠道经理,3:集客经理,4:营业员,5:固网专员
	 * 2.渠道经理、固网专员、厅主任、集客行业总监下发任务时，根据userType下发到不同的专业线
	 */
	public void getNextRegion() {
		Map<String, Object> params = new HashMap<String, Object>();
		try {
			if(task_region_code == null || "".equals(task_region_code.trim())) {
				throw new BusiException("地域编码不能为空！");
			}
			params.put("task_region_code", task_region_code);
			if(month == null || "".equals(month.trim())) {
				throw new BusiException("账期不能为空！");
			}
			params.put("month", month);
			
			List<Map<String,String>> list = new ArrayList<Map<String,String>>(); 
			
			if(userType != null && !"".equals(userType.trim()) && !"null".equals(userType.trim())) {
				//渠道经理,查询下级渠道
				if("2".equals(userType.trim())) {
					params.put("userType", userType);
					list = scheduleCommonService.qryRegionByManager(params);
				//固网专员,查询下级名单制小区
				} else if("5".equals(userType.trim())) {
					params.put("userType", userType);
					list = scheduleCommonService.qryRegionByManager(params);
				//营业厅主任，查询下级营业员
				} else if("6".equals(userType.trim())) {
					params.put("userType", userType);
					list = scheduleCommonService.qryRegionByManager(params);
				//集客行业总监，查询下级集客经理
				}else if("7".equals(userType.trim())) {
					params.put("userType", userType);
					list = scheduleCommonService.qryRegionByManager(params);
				}
			//营服中心下级负责人
			} else {
				if(type == null || "".equals(type.trim())) {
					throw new BusiException("下级渠道经理类型不能为空!");
				}
				List<String> types = new ArrayList<String>();
				if(type.indexOf(",")>0) {
					String[] strs = type.split(",");
					for(String str : strs) {
						if(str != null && !"".equals(strs)) {
							types.add(str);
						}
					}
				}else {
					types.add(type);
				}
				params.put("types", types);
				list = scheduleCommonService.qryChanlManager(params);
			}
			this.reponseJson(list);
		} catch (BusiException e) {
			logger.error(e.getMessage());
			this.reponseJson(e.getMessage());
		} catch(Exception e) {
			logger.error(e.getMessage());
			this.reponseJson("查询下级地域信息失败！");
		}
	}
	
	public void selectRegion() {
		User user = UserHolder.getCurrentLoginUser();
		Org org = user.getOrg();
		String level = org.getOrgLevel();
		Map<String, String> map = new HashMap<String,String>();
		map.put("level", level);
		map.put("code", org.getCode());
		Object result = scheduleCommonService.selectRegion(map);
		this.reponseJson(result);
	}

	public void setCode1(String code1) {
		this.code1 = code1;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getTask_region_code() {
		return task_region_code;
	}

	public void setTask_region_code(String task_region_code) {
		this.task_region_code = task_region_code;
	}

	public String getUserType() {
		return userType;
	}

	public void setUserType(String userType) {
		this.userType = userType;
	}
	
	
}
