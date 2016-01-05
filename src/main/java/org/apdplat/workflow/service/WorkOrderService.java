package org.apdplat.workflow.service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.activiti.engine.HistoryService;
import org.activiti.engine.IdentityService;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.history.HistoricProcessInstance;
import org.activiti.engine.history.HistoricProcessInstanceQuery;
import org.activiti.engine.history.HistoricTaskInstance;
import org.activiti.engine.impl.RepositoryServiceImpl;
import org.activiti.engine.impl.persistence.entity.ExecutionEntity;
import org.activiti.engine.impl.persistence.entity.ProcessDefinitionEntity;
import org.activiti.engine.impl.pvm.PvmActivity;
import org.activiti.engine.impl.pvm.PvmTransition;
import org.activiti.engine.impl.pvm.process.ActivityImpl;
import org.activiti.engine.repository.ProcessDefinition;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Task;
import org.activiti.engine.task.TaskQuery;
import org.apache.commons.lang3.StringUtils;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.util.Pagination;
import org.apdplat.workflow.WorkflowConstant;
import org.apdplat.workflow.vo.WorkOrderVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class WorkOrderService {
	
	@Autowired
	private IdentityService identityService;
	@Autowired
	private RuntimeService runtimeService;
	@Autowired
	private TaskService taskService;
	@Autowired
	private RepositoryService repositoryService;
	@Autowired
	private HistoryService historyService;
	@Autowired
	TaskTo4AService taskTo4AService;
	/**
	 * 启动流程实例
	 * @param vo
	 * @return
	 */
	public ProcessInstance startProcessInstanceByKey(WorkOrderVo vo) {
		
		ProcessInstance processInstance = null;
		User user = UserHolder.getCurrentLoginUser();
		identityService.setAuthenticatedUserId(user.getId().toString());
		
		Map<String, Object> variables = new HashMap<String, Object>();
		variables.put("wayId", vo.getWayId());
		variables.put("OWNER_", user.getId());
		variables.put("description",vo.getDesc());
		variables.put("title",vo.getTitle());
		variables.put("activityId", vo.getActivityId());
		variables.put("editUrl",vo.getEditUrl());
		variables.put("noEditUrl",vo.getNoEditUrl());
		variables.put("businessKey",vo.getBusinessKey());
		variables.put("fixDealer", vo.getFixDealer());
		variables.put("depType", vo.getDepType());
		variables.put(WorkflowConstant.NEXT_DEALER,vo.getNextDealer());
		variables.put(WorkflowConstant.DISPLAY_PID,vo.getBusinessKey());//显示的工单编号
		
		processInstance =runtimeService.startProcessInstanceByKey(vo.getProcessKey(),
						vo.getBusinessKey(), variables);
		//添加代办同步云门户
		try{
			taskTo4AService.sendNewOrderTo4A(vo);
		}catch(Exception e){e.printStackTrace();}
		//添加短信发送
		//////////////////////
		return processInstance;
	}
	
	/**
	 * 查询待办工单数
	 * @return
	 */
	public long qryTodoWorkOrderNum() {
		
		User user = UserHolder.getCurrentLoginUser();
		TaskQuery taskQuery = taskService.createTaskQuery().taskAssignee(user.getId().toString()).active();
		return taskQuery.count();
	}
	
	/**
	 * 查询工单列表，包含待办、在办、办结
	 * @param vo
	 * @return
	 */
	public Pagination qryProcessList(WorkOrderVo vo) {
		
		String queryListType  = vo.getQueryListType();
		if(queryListType.equals(WorkflowConstant.WAIT)){//当前人待办任务列表
			Pagination page = new Pagination();
			page = getTodoWorkOrderList(vo);
			return page;
		} else if(queryListType.equals(WorkflowConstant.DOING)){//涉及人过且工单未结束的
			return getInvolvedUserDoingProcessList(vo);
		}else if(queryListType.equals(WorkflowConstant.DONE)){//个人创建已经完结的
			return getOwnerDoneProcessList(vo);
		} else { //不满足返回一个新对象
			return new Pagination();
		}
	}
	
	/**
	 * 查询待办任务列表
	 * @param vo
	 * @return
	 */
	private Pagination getTodoWorkOrderList(WorkOrderVo vo) {
		
		Pagination page =  new Pagination();
		User user = UserHolder.getCurrentLoginUser();
		String userId = user.getId().toString();
		String processKey = formatBlankValueToNull(vo.getProcessKey());
		String processInstanceId = formatBlankValueToNull(vo.getProcessInstanceId());
		String displayPid = formatBlankValueToNull(vo.getDisplayPid());	//工单编号
		String title = formatBlankValueToNull(vo.getTitle());	//请示主题
		
		List<WorkOrderVo> resultList = new ArrayList<WorkOrderVo>();
		
		TaskQuery taskQuery = taskService.createTaskQuery().taskAssignee(userId).processDefinitionKey(processKey)
				.processInstanceId(processInstanceId).active().includeTaskLocalVariables().includeProcessVariables();
		if(null != displayPid) {
			taskQuery.processVariableValueEquals(WorkflowConstant.DISPLAY_PID,displayPid);
		}
		if(StringUtils.isNotBlank(title)) {
			taskQuery.processVariableValueLike("title","%"+title+"%");
		}
		if(null != vo.getCreateTime()) {
        	Calendar c = Calendar.getInstance();  
        	c.setTime(vo.getCreateTime());
        	c.add(c.DATE, 1);
        	taskQuery.taskCreatedAfter(vo.getCreateTime()).taskCreatedBefore(c.getTime());
        }
		taskQuery.orderByTaskCreateTime().desc();
		
		List<Task> taskList = taskQuery.listPage(vo.getStartIndex(), vo.getPageSize());
		long totalCount = taskQuery.count();
		
		if(null!=taskList && taskList.size()>0) {
			for(Task task : taskList) {
				ProcessDefinition pdf = repositoryService.getProcessDefinition(task.getProcessDefinitionId());
				resultList.add(new WorkOrderVo(task,pdf,WorkflowConstant.WAIT));
			}
		}
		
		page.setResult(resultList);
		page.setTotalCount(totalCount);
		page.setPageNo(vo.getPageNo());
		page.setPageSize(vo.getPageSize());
		
		return page;
	}
	
	/**
	 * 在办工单列表。涉及处理过的但还没完成的工单
	 * @param vo
	 * @return
	 */
	public Pagination getInvolvedUserDoingProcessList(WorkOrderVo vo) {
			
		Pagination page =  new Pagination();
		User user = UserHolder.getCurrentLoginUser();
		String userId = user.getId().toString();

		String processKey = formatBlankValueToNull(vo.getProcessKey());
		String processInstanceId = formatBlankValueToNull(vo.getProcessInstanceId());
		String displayPid = formatBlankValueToNull(vo.getDisplayPid()); //工单编号

		List<WorkOrderVo> rsList = new ArrayList<WorkOrderVo>();
        HistoricProcessInstanceQuery query = historyService.createHistoricProcessInstanceQuery().unfinished().involvedUser(userId)
        		.processDefinitionKey(processKey).processInstanceId(processInstanceId)
        		.includeProcessVariables();
        
        if(displayPid!=null){
        	query.variableValueEquals(WorkflowConstant.DISPLAY_PID, displayPid);
		}
        if(StringUtils.isNotBlank(vo.getTitle())) {
			query.variableValueLike("title","%"+vo.getTitle()+"%");
		}
        if(null != vo.getCreateTime()) {
        	Calendar c = Calendar.getInstance();  
        	c.setTime(vo.getCreateTime());
        	c.add(c.DATE, 1);
        	query.startedAfter(vo.getCreateTime()).startedBefore(c.getTime());
        }
        query.orderByProcessInstanceEndTime().desc();
        
        List<HistoricProcessInstance> hisList = query.listPage(vo.getStartIndex(), vo.getPageSize());
        long totalCount = query.count();
		if(hisList!=null && hisList.size()>0){
			for(HistoricProcessInstance t : hisList){
				ProcessDefinition pdf = repositoryService.getProcessDefinition(t.getProcessDefinitionId());
				rsList.add(new WorkOrderVo(t,pdf,WorkflowConstant.DOING));
			}
		}

		page.setResult(rsList);
		page.setTotalCount(totalCount);
		page.setPageNo(vo.getPageNo());
		page.setPageSize(vo.getPageSize());
		return page;
	}
	
	/**
	 * 办结列表 自己创建且审批完结的工单
	 * @param vo
	 * @return
	 */
	public Pagination getOwnerDoneProcessList(WorkOrderVo vo) {
		
		Pagination page =  new Pagination();
		User user = UserHolder.getCurrentLoginUser();
		String userId = user.getId().toString();
		String processKey = formatBlankValueToNull(vo.getProcessKey());
		String processInstanceId = formatBlankValueToNull(vo.getProcessInstanceId());
		String displayPid = formatBlankValueToNull(vo.getDisplayPid());

		List<WorkOrderVo> rsList = new ArrayList<WorkOrderVo>();
		
		HistoricProcessInstanceQuery query = historyService.createHistoricProcessInstanceQuery().finished().involvedUser(userId)
				.processDefinitionKey(processKey).processInstanceId(processInstanceId).includeProcessVariables();
		
		if(displayPid!=null){
        	query.variableValueEquals(WorkflowConstant.DISPLAY_PID, displayPid);
		}
		if(StringUtils.isNotBlank(vo.getTitle())) {
			query.variableValueLike("title","%"+vo.getTitle()+"%");
		}
		if(null != vo.getCreateTime()) {
        	Calendar c = Calendar.getInstance();  
        	c.setTime(vo.getCreateTime());
        	c.add(c.DATE, 1);
        	query.startedAfter(vo.getCreateTime()).startedBefore(c.getTime());
        }
        query.orderByProcessInstanceEndTime().desc();
	        
		List<HistoricProcessInstance> hisList = query.listPage(vo.getStartIndex(), vo.getPageSize());
		long totalCount = query.count();
		
		if(hisList!=null && hisList.size()>0){
			for(HistoricProcessInstance t : hisList){
				ProcessDefinition pdf = repositoryService.getProcessDefinition(t.getProcessDefinitionId());
				rsList.add(new WorkOrderVo(t,pdf,WorkflowConstant.DONE));				
			}
		}
		
		page.setResult(rsList);
		page.setTotalCount(totalCount);
		page.setPageNo(vo.getPageNo());
		page.setPageSize(vo.getPageSize());
		return page;
	}
	
	/**
	 * 查询审批历史记录
	 * @param vo
	 * @param bool
	 * @return
	 */
	public List<WorkOrderVo> getAuditHistory(WorkOrderVo vo,Boolean bool) {
		String businessKey = formatBlankValueToNull(vo.getBusinessKey());
		String processInstanceId = formatBlankValueToNull(vo.getProcessInstanceId());
		List<HistoricTaskInstance> hisTaskList = null;
		if(bool){  // true 审批历史记录
			hisTaskList =historyService.createHistoricTaskInstanceQuery()
    		.processInstanceBusinessKey(businessKey)
    		.processInstanceId(processInstanceId)
    		.includeTaskLocalVariables()
    		.orderByHistoricTaskInstanceStartTime()
    		.asc()
    		.list();
		}else{   // false 审批流程图
			hisTaskList =historyService.createHistoricTaskInstanceQuery()
    		.processInstanceBusinessKey(businessKey)
    		.processInstanceId(processInstanceId)
    		.includeTaskLocalVariables()
    		.finished()
    		.orderByHistoricTaskInstanceStartTime()
    		.asc()
    		.list();
		}
        
        List<WorkOrderVo> rsList = new ArrayList<WorkOrderVo>();
       
        WorkOrderVo rsVo = this.getStartInfo(vo);
        if(rsVo!=null){
        	rsList.add(rsVo);
            String processDefinitionKey = rsVo.getProcessKey();
     		ProcessDefinition pdf = repositoryService.createProcessDefinitionQuery().processDefinitionKey(processDefinitionKey).latestVersion().singleResult();
     		
             if(hisTaskList!=null && hisTaskList.size()>0){
     			for(HistoricTaskInstance t : hisTaskList){
     				rsList.add(new WorkOrderVo(t,pdf,""));
     			}
     		}
        }
       
		return rsList;
	}
	
	public WorkOrderVo getStartInfo(WorkOrderVo vo) {

		String businessKey = formatBlankValueToNull(vo.getBusinessKey());
		String processInstanceId = formatBlankValueToNull(vo.getProcessInstanceId());

		HistoricProcessInstance his = historyService.createHistoricProcessInstanceQuery()
				.processInstanceId(processInstanceId)
				.processInstanceBusinessKey(businessKey)
				.includeProcessVariables()
				.singleResult();
		if(his!=null){
			Map<String, Object> variableMap = his.getProcessVariables();
			ProcessDefinition pdf = repositoryService.getProcessDefinition(his.getProcessDefinitionId());
			WorkOrderVo  rsVo = new WorkOrderVo(his,pdf,""); 
			//为了前台统一取数据 进行整合
			rsVo.setTaskId(rsVo.getProcessInstanceId());//发起节点的序号使用流程号来标志
			rsVo.setAssigneeDeptName(rsVo.getStartManDeptName()); 
			rsVo.setAssigneeName(rsVo.getStartManName());
			rsVo.setAssignee(rsVo.getStartMan());
			rsVo.setSubmitTime(his.getStartTime());
			rsVo.setPassOrNot(true);
			String title = variableMap.get("title") + "";
			rsVo.setTaskDesc(title);
			
			if(processInstanceId==null){
				processInstanceId=rsVo.getProcessInstanceId();
			}
			HashMap startDefMap = this.getStartActNodeName(processInstanceId);
			if(startDefMap!=null && startDefMap.size()>0){
				rsVo.setActNodeKey(startDefMap.get("actNodeKey")+"");
				rsVo.setActNodeName(startDefMap.get("actNodeName")+"");
			}
			return rsVo;
		} else{
			return null;
		}
	}
	
	public HashMap getStartActNodeName(String processInstanceId) {
		HistoricProcessInstance his = historyService
				.createHistoricProcessInstanceQuery()
				.processInstanceId(processInstanceId).singleResult();
		ProcessDefinitionEntity processDefinition = (ProcessDefinitionEntity) ((RepositoryServiceImpl) repositoryService)
				.getDeployedProcessDefinition(his.getProcessDefinitionId());
		ActivityImpl impl = processDefinition.getInitial();// 获得当前任务的所有节点
		String startActNodeName = impl.getProperties().get("name") + "";
		String startActNodeId = impl.getId();
		
		HashMap map = new HashMap();
		map.put("actNodeKey", startActNodeId);
		map.put("actNodeName", startActNodeName);

		return map;
	}
	
	
	public WorkOrderVo getWorkOrderInfo(WorkOrderVo vo) {
		
		String taskId = vo.getTaskId();
		Task task = taskService.createTaskQuery().taskId(taskId).includeProcessVariables().includeTaskLocalVariables().singleResult();
		
		ProcessDefinition pdf = repositoryService.getProcessDefinition(task.getProcessDefinitionId());

		WorkOrderVo rsVo = new WorkOrderVo(task,pdf,"");
		List<HashMap> nextUserTaskList = getNextUserTask(taskId);
		rsVo.setNextUserTaskList(nextUserTaskList);
		
		return rsVo;
	}
	public WorkOrderVo getWorkOrderInfoByTaskId(String taskId,String type) {
		
		Task task = taskService.createTaskQuery().taskId(taskId).includeProcessVariables().includeTaskLocalVariables().singleResult();
		
		ProcessDefinition pdf = repositoryService.getProcessDefinition(task.getProcessDefinitionId());

		WorkOrderVo rsVo = new WorkOrderVo(task,pdf,type);
		List<HashMap> nextUserTaskList = getNextUserTask(taskId);
		rsVo.setNextUserTaskList(nextUserTaskList);
		
		return rsVo;
	}
	
	public List<HashMap> getNextUserTask(String taskId) {
		List<HashMap> list =  new ArrayList<HashMap>();
		Task task = taskService.createTaskQuery().taskId(taskId).singleResult();
		ProcessDefinitionEntity processDefinition = (ProcessDefinitionEntity) ((RepositoryServiceImpl) repositoryService)
				.getDeployedProcessDefinition(task.getProcessDefinitionId());
		List<ActivityImpl> activitiList = processDefinition.getActivities();// 获得当前任务的所有节点

		String excId = task.getExecutionId();
		ExecutionEntity execution = (ExecutionEntity) runtimeService
				.createExecutionQuery().executionId(excId).singleResult();
		String activitiId = execution.getActivityId();

		
		for (ActivityImpl activityImpl : activitiList) {
			String id = activityImpl.getId();
			if (activitiId.equals(id)) {
				List<PvmTransition> outTransitions = activityImpl.getOutgoingTransitions();// 获取从某个节点出来的所有线路
				for (PvmTransition tr : outTransitions) {
					HashMap map = new HashMap();
					PvmActivity ac = tr.getDestination(); // 获取线路的终点节点
					String type = ac.getProperty("type")+"";
					String actId =  ac.getId();
					String actName = ac.getProperty("name")+"";
					String conditionText = tr.getProperty("conditionText")+"";
					String trueFlag = getRouterPropertiesTrueOrFalse(conditionText);
					String exceedFlag = getRouterPropertiesExceed(conditionText);

					if(!type.equals("userTask")){//如果接来下的不是用户节点 则继续递归
						List<PvmTransition> nextOutTrance = ac.getOutgoingTransitions();
						for (PvmTransition nextTr : nextOutTrance) {
							HashMap nextMap = new HashMap();
							PvmActivity nextAc = nextTr.getDestination(); // 获取线路的终点节点
							String nextActId = nextAc.getId();
							String nextActName =nextAc.getProperty("name")+"";
							String nextConditionText = nextTr.getProperty("conditionText")+"";
							String nextTrueFlag = getRouterPropertiesTrueOrFalse(nextConditionText);
							String nextExceedFlag = getRouterPropertiesExceed(nextConditionText);
							nextMap.put("nextActId",nextActId);
							nextMap.put("nextActName",nextActName);
							nextMap.put("nextTrueFlag",nextTrueFlag);
							nextMap.put("exceedFlag",nextExceedFlag);
							list.add(nextMap);
						}
					} else {
 						map.put("nextActId",actId);
 						map.put("nextActName",actName);
 						map.put("nextTrueFlag",trueFlag);
 						map.put("exceedFlag",exceedFlag);
						
						list.add(map);
					}
				}
				break;
			}
		}
		
		return list;
	}
	
	public String getRouterPropertiesTrueOrFalse(String routerConditionText){
		if(routerConditionText==null || routerConditionText.equals("")|| routerConditionText.equals("null")) 
			return "TRUE";
		 
		return (StringUtils.upperCase(routerConditionText).contains("TRUE")) ? "TRUE" :"FALSE";
	 
	}
	public String getRouterPropertiesExceed(String routerConditionText){
		if(routerConditionText==null || routerConditionText.equals("")|| routerConditionText.equals("null")) 
			return "TRUE";
		
		return (StringUtils.upperCase(routerConditionText).contains("EXCEED=='TRUE'")) ? "TRUE" :"FALSE";
		
	}
	
	/**
	 * 任务审批
	 * @param workOrderVo
	 */
	@Transactional(rollbackFor=Exception.class)
	public void submitTask(WorkOrderVo workOrderVo) {
		
		User user = UserHolder.getCurrentLoginUser();
		identityService.setAuthenticatedUserId(user.getId().toString());

		taskService.setVariableLocal(workOrderVo.getTaskId(), WorkflowConstant.PASS_OR_NOT, workOrderVo.getPassOrNot());
		taskService.setVariableLocal(workOrderVo.getTaskId(), WorkflowConstant.APPROVE_DESC, workOrderVo.getDesc());
		taskService.setVariableLocal(workOrderVo.getTaskId(), WorkflowConstant.NEXT_ROUTER, workOrderVo.getNextRouter());
		taskService.setVariableLocal(workOrderVo.getTaskId(), WorkflowConstant.NEXT_DEALER, workOrderVo.getNextDealer());

		Map<String, Object> variables = new HashMap<String, Object>();
		variables.put(WorkflowConstant.PASS_OR_NOT, workOrderVo.getPassOrNot()); // 同意与否标签
		variables.put(WorkflowConstant.NEXT_ROUTER, workOrderVo.getNextRouter()); // 同意后选择的路由标签
		variables.put(WorkflowConstant.NEXT_DEALER, workOrderVo.getNextDealer()); // 同意后选择的路由标签
		variables.put(WorkflowConstant.PASS_OR_NOT_ALL, workOrderVo.getPassOrNot()); // 同意与否标签
		variables.put(WorkflowConstant.EXCEED_FLAG, workOrderVo.getExceed()); // 
		
		//佣金支付工单审批存在当某级领导审核不同意时，可以退回给拟稿人或拒绝支付两个选项，当选择‘拒绝支付’时将表达式中的needPay设为false流程直接结束
		if("拒绝支付".equals(workOrderVo.getActNodeName())) {
			variables.put(WorkflowConstant.NEED_PAY,"no"); // 
		}else {
			variables.put(WorkflowConstant.NEED_PAY,"yes"); // 
		}

		taskService.complete(workOrderVo.getTaskId(),variables);
		//添加代办同步云门户
		try{
			taskTo4AService.sendDoingOrderTo4A(workOrderVo);
		}catch(Exception e){e.printStackTrace();}
		//添加短信发送
	}

	
	
	 public String formatBlankValueToNull(String val){
		   if(val==null)  return null ;
		   if(val.equals("") || val.equals("null")) return null;
		   
		   return val ;
	   }
}
