package org.apdplat.workflow.action;

import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.apache.struts2.convention.annotation.Namespace;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.exception.BusiException;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.platform.util.ResultInfo;
import org.apdplat.portal.common.Constant;
import org.apdplat.workflow.common.BaseAction;
import org.apdplat.workflow.service.TaskNodeManageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
@Namespace("/taskNode")
public class TaskNodeManageAction extends BaseAction {

	private static final long serialVersionUID = 9095901427043330781L;
	
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	
	@Autowired
	private TaskNodeManageService taskNodeManageService;
	
	private Map<String, String> resultMap;
	private String taskId;	//节点ID
	private String level;	//ztree节点层级
	private String uncheck;
	private String alcheck;
	private String id;
	
	/**查询审批节点列表**/
	public void qryTaskNodeList() {
		
		try{
			User user = UserHolder.getCurrentLoginUser();
			
			String orgLevel = user.getOrg().getOrgLevel();
			if(Constant.PROVINCE_LEVEL.equals(orgLevel) || Constant.REGION_LEVEL.equals(orgLevel)) {
				resultMap.put("orgLevel", orgLevel);
				Object result = taskNodeManageService.queryTaskNodeList(resultMap);
				this.reponseJson(result);
			}else {
				throw new BusiException("权限不足，无法进行操作！");
			}
		}catch(Exception e) {
			logger.error(e.getMessage(),e);
			outJsonPlainString(response,"{\"msg\":\"查询渠道经理及营服中心负责人信息失败\"}");
		}
	}
	
	/**查询审批节点已配置的审批人信息**/
	public void qryApproversOfTaskNode() {
		
		List<Map<String,Object>> resultList = taskNodeManageService.queryApproversOfTaskNode(taskId);
		if(resultList.size() != 0) {
			HashSet set = new HashSet();
			for (Iterator<Map<String,Object>> iterator = resultList.iterator(); iterator.hasNext();) {
				Map<String,Object> map = (Map<String,Object>) iterator.next();
				String  str1 = map.get("OA_COM_ID").toString();
				String  str2 = map.get("OA_DEP_ID").toString();
				String  str3 = map.get("OA_JOB_ID").toString();
				String  str4 = map.get("USER_ID").toString();
				if(!set.contains(str1)) {
					set.add(str1);
				}
				if(!set.contains(str2)) {
					set.add(str2);
				}
				if(!set.contains(str3)) {
					set.add(str3);
				}
				if(!set.contains(str4)) {
					set.add(str4);
				}
			}
			this.reponseJson(set);
		}
	}
	
	/**查询部门人员属性结构**/
	public void qryDepartmentTree() {
		
		int nodeLevel = Integer.parseInt(level)+1;
		List<Map<String,Object>> resultList = taskNodeManageService.queryDepartmentTree(id,nodeLevel);
		this.reponseJson(resultList);
	}
	
	/**修改节点审批人员**/
	public void configureApproversOfTaskNode() {
		
		ResultInfo resultInfo = new ResultInfo();
		try{
			if(StringUtils.isBlank(taskId) && (StringUtils.isBlank(alcheck)||StringUtils.isBlank(uncheck))) {
				throw new BusiException("请选择节点审批人员！");
			}
			taskNodeManageService.configureApproversOfTaskNode(taskId, uncheck, alcheck);
			resultInfo.setCode(ResultInfo._CODE_OK_);
			resultInfo.setMsg("操作成功！");
		}catch(BusiException e) {
			logger.error(e.getMessage(),e);
			resultInfo.setCode(ResultInfo._CODE_FAIL_);
			resultInfo.setMsg(e.getMessage());
		}catch(Exception e) {
			logger.error(e.getMessage(),e);
			resultInfo.setCode(ResultInfo._CODE_FAIL_);
			resultInfo.setMsg("操作失败！");
		}
		this.reponseJson(resultInfo);
	}


	public Map<String, String> getResultMap() {
		return resultMap;
	}
	public void setResultMap(Map<String, String> resultMap) {
		this.resultMap = resultMap;
	}
	
	public void setTaskId(String taskId) {
		this.taskId = taskId;
	}

	public void setLevel(String level) {
		this.level = level;
	}

	public void setUncheck(String uncheck) {
		this.uncheck = uncheck;
	}

	public void setAlcheck(String alcheck) {
		this.alcheck = alcheck;
	}

	public void setId(String id) {
		this.id = id;
	}
	
}
