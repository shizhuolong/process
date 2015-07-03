package org.apdplat.workflow.vo;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.activiti.engine.history.HistoricProcessInstance;
import org.activiti.engine.history.HistoricTaskInstance;
import org.activiti.engine.repository.ProcessDefinition;
import org.activiti.engine.task.Task;
import org.apache.commons.lang3.StringUtils;
import org.apdplat.module.security.model.User;
import org.apdplat.workflow.WorkflowConstant;
import org.apdplat.workflow.util.WorkflowUtils;


public class WorkOrderVo {
	
	/**
	 *流程类型ID 
	 */
	String processKey   ;
	
	/**
	 *流程名称
	 */
	String processName   ;
	/**
	 *举措ID 
	 */
	String wayId  ;
	/**
	 *流程业务主键
	 */
	String businessKey ;
	
	/**
	 *工单流水号ID
	 */
	String processInstanceId ;
	
	/**
	 *任务ID
	 */
	String taskId ;
	/**
	 *审批是否通过 
	 */
	Boolean passOrNot;
	
	/**
	 * 批注
	 */
	String desc ;
	/**
	 * 工单完结状态
	 */
	Boolean Status;
	
	/**
	 * 活动id
	 */
	String activityId;
	
	/**
	 * 工单处理人：userId
	 */
	String assignee;
	
	/**
	 * 处理人名称
	 */
	String assigneeName;
	
	/**
	 * 处理人名称
	 */
	String assigneeDeptName;
	/**
	 * 工单到达时间
	 */
	Date recieveTime;
	/**
	 * 工单提交时间
	 */
	Date submitTime;
	
	/**
	 * 流程节点key
	 */
	String actNodeKey;
	/**
	 * 流程节点名称
	 */
	String actNodeName;
	
	/**
	 * 工单标题
	 */
	String title ;
	/**
	 * 编辑URL
	 */
	String editUrl;
	/**
	 * 不可编辑URL
	 */
	String noEditUrl;
	
	/**
	 * 立单人ID
	 */
	String startMan;
	/**
	 * 立单人中文名称
	 */
	String startManName;
	/**
	 * 立单人部门中文名称
	 */
	String startManDeptName;
	
	/**
	 * 拟稿时间
	 */
	Date createTime;
	
	/**
	 * 地市
	 */
	String regionName;
	
	
	
	String taskDesc ;
	
	int pageNo = 1;
	int pageSize = 20;//默认每页20项
	int startIndex = 1;
	int endIndex = 20 ;
	
	String queryListType = "wait";  // wait 待办  ; doing 在办未结束 ; 涉及人 done结伴
	List<HashMap> nextUserTaskList;
	String nextRouter;
	String nextDealer;
	String fixDealer;
	
	String depType;
	
	String exceed;	//
	
	/** 显示流程号 */
	String displayPid ;
	/**
	 * @return 通过与否 false true 
	 */
	public Boolean getPassOrNot() {
		return passOrNot;
	}
	public void setPassOrNot(Boolean passOrNot) {
		this.passOrNot = passOrNot;
	}
	
	/**
	 * @return 当前任务ID 
	 */
	public String getTaskId() {
		return taskId;
	}
	public void setTaskId(String taskId) {
		this.taskId = taskId;
	}
	
	/**
	 * @return 流程类型KEY 
	 */
	public String getProcessKey() {
		return processKey;
	}
	public void setProcessKey(String processKey) {
		this.processKey = processKey;
	}
	
	/**
	 * @return 举措ID 
	 */
	public String getWayId() {
		return wayId;
	}
	public void setWayId(String wayId) {
		this.wayId = wayId;
	}
	
	/**
	 * @return 流程关联外部唯一ID 
	 */
	public String getBusinessKey() {
		return businessKey;
	}
	public void setBusinessKey(String businessKey) {
		this.businessKey = businessKey;
	}
	
	/**
	 * @return 工单备注 
	 */
	public String getDesc() {
		return desc;
	}
	
	public void setDesc(String desc) {
		this.desc = desc;
	}
	/**
	 * @return 工单状态  
	 * true 结束  
	 * false 未结束
	 */
	public Boolean getStatus() {
		return Status;
	}
	public void setStatus(Boolean status) {
		Status = status;
	}
	/**
	 * @return 工单处理人 
	 */
	public String getAssignee() {
		return assignee;
	}
	public void setAssignee(String assignee) {
		this.assignee = assignee;
	}
	
	/**
	 * @return 工单到达时间 
	 */
	public Date getRecieveTime() {
		return recieveTime;
	}
	public void setRecieveTime(Date recieveTime) {
		this.recieveTime = recieveTime;
	}
	/**
	 * @return 工单提交时间 
	 */
	public Date getSubmitTime() {
		return submitTime;
	}
	public void setSubmitTime(Date submitTime) {
		this.submitTime = submitTime;
	}
	/**
	 * @return 流程类型名称
	 */
	public String getProcessName() {
		return processName;
	}
	public void setProcessName(String processName) {
		this.processName = processName;
	}
	/**
	 * @return 流程节点Key
	 */
	public String getActNodeKey() {
		return actNodeKey;
	}
	public void setActNodeKey(String actNodeKey) {
		this.actNodeKey = actNodeKey;
	}
	/**
	 * @return 流程节点名称
	 */
	public String getActNodeName() {
		return actNodeName;
	}
	public void setActNodeName(String actNodeName) {
		this.actNodeName = actNodeName;
	}
	/**
	 * @return 流程实例ID
	 */
	public String getProcessInstanceId() {
		return processInstanceId;
	}
	public void setProcessInstanceId(String processInstanceId) {
		this.processInstanceId = processInstanceId;
	}
	public String getAssigneeName() {
		return assigneeName;
	}
	public void setAssigneeName(String assigneeName) {
		this.assigneeName = assigneeName;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getEditUrl() {
		return editUrl;
	}
	public void setEditUrl(String editUrl) {
		this.editUrl = editUrl;
	}
	public String getNoEditUrl() {
		return noEditUrl;
	}
	public void setNoEditUrl(String noEditUrl) {
		this.noEditUrl = noEditUrl;
	}
	public String getStartMan() {
		return startMan;
	}
	public void setStartMan(String startMan) {
		this.startMan = startMan;
	}
	public String getTaskDesc() {
		return taskDesc;
	}
	public void setTaskDesc(String taskDesc) {
		this.taskDesc = taskDesc;
	}
	public int getPageNo() {
		return pageNo;
	}
	public void setPageNo(int pageNo) {
		this.pageNo = pageNo;
	}
	public int getPageSize() {
		return pageSize;
	}
	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
	}
	public int getStartIndex() {
		return startIndex = (this.pageNo-1)*pageSize;
	}
	public int getEndIndex() {
		return endIndex = this.pageNo*pageSize;
	}

	public String getQueryListType() {
		return queryListType;
	}
	public void setQueryListType(String queryListType) {
		this.queryListType = queryListType;
	}
	public String getStartManName() {
		return startManName;
	}
	public void setStartManName(String startManName) {
		this.startManName = startManName;
	}
	public String getStartManDeptName() {
		return startManDeptName;
	}
	public void setStartManDeptName(String startManDeptName) {
		this.startManDeptName = startManDeptName;
	}
	
	public List<HashMap> getNextUserTaskList() {
		return nextUserTaskList;
	}
	public void setNextUserTaskList(List<HashMap> nextUserTaskList) {
		this.nextUserTaskList = nextUserTaskList;
	}

	public String getNextRouter() {
		return nextRouter;
	}
	public void setNextRouter(String nextRouter) {
		this.nextRouter = nextRouter;
	}
	
	public Date getCreateTime() {
		return createTime;
	}
	public void setCreateTime(String createTime) throws ParseException {
		
		this.createTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(createTime);
	}
	
	public String getAssigneeDeptName() {
		return assigneeDeptName;
	}
	public void setAssigneeDeptName(String assigneeDeptName) {
		this.assigneeDeptName = assigneeDeptName;
	}
	
	public String getNextDealer() {
		return nextDealer;
	}
	public void setNextDealer(String nextDealer) {
		this.nextDealer = nextDealer;
	}
	
	public String getDisplayPid() {
		return displayPid;
	}
	
	public void setDisplayPid(String displayPid) {
		this.displayPid = displayPid;
	}
	public WorkOrderVo(){
		
	}
	
	public WorkOrderVo(Task task,ProcessDefinition pdf,String queryListType){
		this.queryListType = queryListType;
		this.processInstanceId = task.getProcessInstanceId();
		this.taskId = task.getId();
		this.assignee = task.getAssignee();
		this.actNodeKey = task.getTaskDefinitionKey();
		this.actNodeName = task.getName(); //当前任务环节名称
		this.createTime = task.getCreateTime(); //工单创建时间
		Map<String, Object> proInstanceMap = task.getProcessVariables();
		if(proInstanceMap!=null && proInstanceMap.size()>0){
			this.editUrl = proInstanceMap.get("editUrl")+"";
			this.noEditUrl = proInstanceMap.get("noEditUrl")+"";
			this.title = proInstanceMap.get("title")+"";
			this.startMan =   proInstanceMap.get("OWNER_")+"";
			this.desc =  proInstanceMap.get("description")+"";
			this.businessKey = proInstanceMap.get("businessKey")+"";
			this.displayPid = proInstanceMap.get(WorkflowConstant.DISPLAY_PID)+"";
			this.regionName = proInstanceMap.get("regionName")+"";
		}
		
		Map<String, Object> taskLocalMap = task.getTaskLocalVariables();
		if(taskLocalMap!=null && taskLocalMap.size()>0){
			this.passOrNot = taskLocalMap.get("passOrNot") == null ? false : (Boolean)taskLocalMap.get("passOrNot");
			this.taskDesc = taskLocalMap.get("approveDesc") +"";
		}
		
		if(StringUtils.isNotEmpty(this.startMan) ){
			User user = WorkflowUtils.getUserInfo(Long.parseLong(startMan));
			if(null != user){
				this.setStartManName(user.getRealName());
				this.setStartManDeptName(user.getOaDepName());
			}
		}
		
		if(StringUtils.isNotEmpty(this.assignee) ){
			User user = WorkflowUtils.getUserInfo(Long.parseLong(assignee));
			if(null != user){
				this.assigneeName = user.getRealName();
				this.assigneeDeptName = user.getOaDepName();
			}
		}

		if(pdf!=null){
			this.processName = pdf.getName();
			this.processKey = pdf.getKey();
		}
	}
	
	
	public WorkOrderVo(HistoricProcessInstance hisProIns,ProcessDefinition pdf,String queryListType){
		this.queryListType = queryListType;
		this.processInstanceId = hisProIns.getId();
		this.processKey = pdf.getKey();
		this.createTime = hisProIns.getStartTime();
		this.processName = pdf.getName();

		Map<String, Object> proInstanceMap = hisProIns.getProcessVariables();
		if(proInstanceMap!=null  && proInstanceMap.size()>0){
			this.editUrl = proInstanceMap.get("editUrl")+"";
			this.noEditUrl = proInstanceMap.get("noEditUrl")+"";
			this.title = proInstanceMap.get("title")+"";
			this.startMan =   proInstanceMap.get("OWNER_")+"";
			this.desc =  proInstanceMap.get("description")+"";
			this.businessKey = proInstanceMap.get("businessKey")+"";
			this.displayPid = proInstanceMap.get(WorkflowConstant.DISPLAY_PID)+"";
		}
		
		if(StringUtils.isNotEmpty(this.startMan) ){
			
			User user = WorkflowUtils.getUserInfo(Long.parseLong(startMan));
			if(null != user){
				this.setStartManName(user.getRealName());
				this.setStartManDeptName(user.getOaDepName());
			}
		}

	}
	
	
	public WorkOrderVo(HistoricTaskInstance task,ProcessDefinition pdf,String queryListType){
		this.queryListType = queryListType;
		this.processInstanceId = task.getProcessInstanceId();
		this.processKey = pdf.getKey();
		this.taskId = task.getId();
		this.assignee = task.getAssignee();
		this.actNodeName = task.getName();
		this.actNodeKey = task.getTaskDefinitionKey();
		this.submitTime = task.getEndTime();
		this.createTime = task.getStartTime();
		Map<String, Object> proInstanceMap = task.getProcessVariables();
		if(proInstanceMap!=null && proInstanceMap.size()>0){
			this.editUrl = proInstanceMap.get("editUrl")+"";
			this.noEditUrl = proInstanceMap.get("noEditUrl")+"";
			this.title = proInstanceMap.get("title")+"";
			this.startMan =   proInstanceMap.get("OWNER_")+"";
			this.desc =  proInstanceMap.get("description")+"";
			this.businessKey = proInstanceMap.get("businessKey")+"";
			this.displayPid = proInstanceMap.get(WorkflowConstant.DISPLAY_PID)+"";
		}
		Map<String, Object> taskLocalMap = task.getTaskLocalVariables();
		if(taskLocalMap!=null && taskLocalMap.size()>0){
			this.passOrNot = taskLocalMap.get("passOrNot") == null ? false : (Boolean)taskLocalMap.get("passOrNot");
			this.taskDesc = taskLocalMap.get("approveDesc") +"";
			System.out.println(this.taskId +" desc : " +this.taskDesc);
		}
		
		if(StringUtils.isNotEmpty(this.assignee)){
			User user = WorkflowUtils.getUserInfo(Long.parseLong(assignee));
			if(null != user){
				this.assigneeName = user.getRealName();
				this.assigneeDeptName = user.getOaDepName();
			}
		}

	
	}
	public String getActivityId() {
		return activityId;
	}
	public void setActivityId(String activityId) {
		this.activityId = activityId;
	}
	public String getFixDealer() {
		return fixDealer;
	}
	public void setFixDealer(String fixDealer) {
		this.fixDealer = fixDealer;
	}
	public String getDepType() {
		return depType;
	}
	public void setDepType(String depType) {
		this.depType = depType;
	}
	public String getExceed() {
		return exceed;
	}
	public void setExceed(String exceed) {
		this.exceed = exceed;
	}
	public String getRegionName() {
		return regionName;
	}
	public void setRegionName(String regionName) {
		this.regionName = regionName;
	}
	
}
