package org.apdplat.workflow.action;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.workflow.WorkflowConstant;
import org.apdplat.workflow.common.BaseAction;
import org.apdplat.workflow.service.ApproverHandlerService;
import org.apdplat.workflow.util.WorkflowUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
@Namespace("/approver")
@Results({
		@Result(name = "processList", location = "/workflow/jsp/deployProcessDefinition.jsp"),
		@Result(name = "activeProcessList", location = "/workflow/jsp/activeProcessList.jsp") })
public class ApproverHandlerAction extends BaseAction {

	private static final long serialVersionUID = 1L;
	private static final Logger logger = LoggerFactory
			.getLogger(ApproverHandlerAction.class);
	private String applyUserId;
	private String taskId;
	private String taskFlag; // 0:拟稿人 1:查询省公司审批人员 2：查询分公司审批人员 3：本部门审批人员

	/**
	 * 
	 */
	private String userIds;
	/*
	 * private static final Properties properties;
	 * 
	 * static { InputStream inputStream =
	 * ApproverHandlerAction.class.getClassLoader
	 * ().getResourceAsStream("activityProcess.properties"); properties = new
	 * Properties(); try { properties.load(inputStream); } catch (IOException e)
	 * { logger.error(e.getMessage(),e); }finally{ try { inputStream.close(); }
	 * catch (IOException e) { logger.error(e.getMessage(),e); } } }
	 */

	public String getUserIds() {
		return userIds;
	}
	public void setUserIds(String userIds) {
		this.userIds = userIds;
	}

	@Autowired
	private ApproverHandlerService approverHandlerService;

	//获取审批人的树型结构数据
	public void qryTaskApproverTreeData() {
			List<Map<String, String>> list = null;
			list = approverHandlerService.qryTaskApproverTreeData(userIds);
			if (list.size() == 0) {
				list = new ArrayList<Map<String,String>>();
			}
			this.reponseJson(list);
			
			
	}
	/** 获取任务节点的审批人员 **/
	public void qryTaskApprover() {

		List<Map<String, String>> approverList = null;
		User user = UserHolder.getCurrentLoginUser();
		User startUser;
		String oaComId = "";
		if(applyUserId!=null&&!applyUserId.equals("")){
			startUser=WorkflowUtils.getUserInfo(Long.valueOf(applyUserId));
			if(WorkflowConstant.TASK_TYPE_PRO.equals(startUser.getOrg().getOrgLevel())){
				oaComId=user.getOaComId();
			}else{
				oaComId=startUser.getOaComId();
			}
		}else{
			oaComId=user.getOaComId();
		}
		
		String oaDepId = user.getOaDepId();
		if (WorkflowConstant.TASK_TYPE_PRO.equals(taskFlag)) {
			approverList = approverHandlerService.qryTaskApprover(taskId, "",
					"");
		} else if (WorkflowConstant.TASK_TYPE_COM.equals(taskFlag)) {
			approverList = approverHandlerService.qryTaskApprover(taskId,
					oaComId, "");
		} else if (WorkflowConstant.TASK_TYPE_DEP.equals(taskFlag)) {
			approverList = approverHandlerService.qryTaskApprover(taskId,
					oaComId, oaDepId);
		}
		this.reponseJson(approverList);
	}

	// 获取当前用户的部门领导
	public void qryMyDepartLeader() {

		User user = UserHolder.getCurrentLoginUser();
		String oaComId = user.getOaComId();
		String oaDepId = user.getOaDepId();
		List<Map<String, String>> list = null;
		// 现在节点审批人员配置表（tb_act_task_approver）中查是否有配置部门领导审批人，
		// 没有的话再查同部门job_name like '%经理%' or job_name like '%主任%' 的人员
		list = approverHandlerService.qryTaskApprover(
				WorkflowConstant.DEPART_LEADER_TASK_ID, oaComId, oaDepId);
		if (list.size() == 0) {
			list = approverHandlerService.qryMyDepartLeader(oaComId, oaDepId);
		}
		this.reponseJson(list);
	}

	//
	public void qryUserTaskProperty() {

		Map<String, Object> map = approverHandlerService
				.getUserTaskProperty(taskId);
		this.reponseJson(map);
	}

	public String getTaskId() {
		return taskId;
	}

	public void setTaskId(String taskId) {
		this.taskId = taskId;
	}

	public String getTaskFlag() {
		return taskFlag;
	}

	public void setTaskFlag(String taskFlag) {
		this.taskFlag = taskFlag;
	}

	public String getApplyUserId() {
		return applyUserId;
	}

	public void setApplyUserId(String applyUserId) {
		this.applyUserId = applyUserId;
	}

}
