package org.apdplat.workflow.service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.activiti.engine.HistoryService;
import org.activiti.engine.IdentityService;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.delegate.Expression;
import org.activiti.engine.history.HistoricProcessInstance;
import org.activiti.engine.identity.User;
import org.activiti.engine.impl.RepositoryServiceImpl;
import org.activiti.engine.impl.bpmn.behavior.UserTaskActivityBehavior;
import org.activiti.engine.impl.persistence.entity.ProcessDefinitionEntity;
import org.activiti.engine.impl.pvm.delegate.ActivityBehavior;
import org.activiti.engine.impl.pvm.process.ActivityImpl;
import org.activiti.engine.impl.task.TaskDefinition;
import org.activiti.engine.task.Task;
import org.apache.commons.beanutils.PropertyUtils;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apdplat.workflow.util.WorkflowUtils;
import org.apdplat.workflow.vo.WorkOrderVo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class WorkflowTraceService {

	protected Logger logger = LoggerFactory.getLogger(getClass());

	protected SimpleDateFormat sft = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

	@Autowired
	protected RuntimeService runtimeService;

	@Autowired
	protected TaskService taskService;

	@Autowired
	protected RepositoryService repositoryService;

	@Autowired
	protected IdentityService identityService;
	@Autowired
	protected HistoryService historyService;
	@Autowired
	protected WorkOrderService workOrderService;

	/**
	 * 流程跟踪图
	 * 
	 * @param processInstanceId
	 *            流程实例ID
	 * @return 封装了各种节点信息
	 */
	public List<Map<String, Object>> traceProcess(String processInstanceId)
			throws Exception {
		List<Task> taskList = taskService.createTaskQuery()
				.processInstanceId(processInstanceId).list();
		Task task = null;
		String activityId = "";
		if (taskList != null && taskList.size() > 0) {
			task = taskList.get(0);
			Object property = PropertyUtils.getProperty(task,
					"taskDefinitionKey");
			if (property != null) {
				activityId = property.toString();
			}
		}

		HashMap hisActMap = new HashMap();
		WorkOrderVo vo = new WorkOrderVo();
		vo.setProcessInstanceId(processInstanceId);
		List<WorkOrderVo> listAudit = workOrderService.getAuditHistory(vo,
				false); // false 时不取审批中的人员节点信息
		if (listAudit != null && !listAudit.isEmpty()) {
			for (WorkOrderVo hisTask : listAudit) {
				String key = hisTask.getActNodeKey();
				hisActMap.put(key, true); // 历史节点
			}
		}

		List<Map<String, Object>> activityInfos = new ArrayList<Map<String, Object>>();
		Map<String, Object> hisMap = new HashMap<String, Object>();
		hisMap.put("his", listAudit);
		activityInfos.add(hisMap); // 获取历史信息

		// ProcessInstance processInstance =
		// runtimeService.createProcessInstanceQuery().processInstanceId(processInstanceId)
		// .singleResult();

		HistoricProcessInstance processInstance = historyService
				.createHistoricProcessInstanceQuery()
				.processInstanceId(processInstanceId).singleResult();

		ProcessDefinitionEntity processDefinition = (ProcessDefinitionEntity) ((RepositoryServiceImpl) repositoryService)
				.getDeployedProcessDefinition(processInstance
						.getProcessDefinitionId());
		List<ActivityImpl> activitiList = processDefinition.getActivities();// 获得当前任务的所有节点
		for (ActivityImpl activity : activitiList) {

			boolean hisActiviti = false;
			boolean currentActiviti = false;
			String id = activity.getId();

			// 当前节点
			if (id.equals(activityId)) {
				currentActiviti = true;
			}

			if (hisActMap.get(id) != null && (Boolean) hisActMap.get(id)) {
				hisActiviti = true;
			}

			Map<String, Object> activityImageInfo = packageSingleActivitiInfo(
					activity, processInstance, currentActiviti, hisActiviti,
					listAudit);

			activityInfos.add(activityImageInfo);
		}

		return activityInfos;
	}

	/**
	 * 封装输出信息，包括：当前节点的X、Y坐标、变量信息、任务类型、任务描述
	 * 
	 * @param activity
	 * @param processInstance
	 * @param currentActiviti
	 * @return
	 */
	private Map<String, Object> packageSingleActivitiInfo(
			ActivityImpl activity, HistoricProcessInstance processInstance,
			boolean currentActiviti, boolean hisActiviti,
			List<WorkOrderVo> listAudit) throws Exception {
		Map<String, Object> vars = new HashMap<String, Object>();
		Map<String, Object> activityInfo = new HashMap<String, Object>();
		activityInfo.put("currentActiviti", currentActiviti);
		activityInfo.put("hisActiviti", hisActiviti);
		setPosition(activity, activityInfo);
		setWidthAndHeight(activity, activityInfo);

		Map<String, Object> properties = activity.getProperties();
		vars.put("任务类型",
				WorkflowUtils.parseToZhType(properties.get("type").toString()));
		ActivityBehavior activityBehavior = activity.getActivityBehavior();
		logger.debug("activityBehavior={}", activityBehavior);
		if (activityBehavior instanceof UserTaskActivityBehavior) {

			Task currentTask = null;
			/*
			 * 当前节点的task
			 */
			if (currentActiviti) {
				currentTask = getCurrentTaskInfo(processInstance);
			}

			/*
			 * 当前任务的分配角色
			 */
			UserTaskActivityBehavior userTaskActivityBehavior = (UserTaskActivityBehavior) activityBehavior;
			TaskDefinition taskDefinition = userTaskActivityBehavior
					.getTaskDefinition();
			Set<Expression> candidateGroupIdExpressions = taskDefinition
					.getCandidateGroupIdExpressions();
			if (!candidateGroupIdExpressions.isEmpty()) {

				// 任务的处理角色
				setTaskGroup(vars, candidateGroupIdExpressions);

				// 当前处理人
				if (currentTask != null) {
					setCurrentTaskAssignee(vars, currentTask);
				}
			}
		}

		vars.put("节点说明", properties.get("documentation"));
		String description = activity.getProcessDefinition().getDescription();
		vars.put("描述", description);

		int approveTimes = 0;
		HashMap mutilApproveRocord = new HashMap();
		for (WorkOrderVo task : listAudit) {
			String key = task.getActNodeKey();
			String actId = activity.getId() + "";
			if (key.equals(actId)) {
				++approveTimes;
				vars.remove("节点说明");
				vars.remove("描述");
				vars.remove("任务类型");
				mutilApproveRocord.put("assineeName", task.getAssigneeName());
				mutilApproveRocord.put("actNodeName", task.getActNodeName());

				if (task.getCreateTime() != null) {
					mutilApproveRocord.put("recieveTime",
							sft.format(task.getCreateTime()));
				}
				if (task.getSubmitTime() != null) {
					mutilApproveRocord.put("submitTime",
							sft.format(task.getSubmitTime()));
				}

				String passText = task.getPassOrNot() ? "同意" : "不同意";
				mutilApproveRocord.put("passOrNot", passText);
				mutilApproveRocord.put("taskDesc", task.getTaskDesc());
				mutilApproveRocord.put("assigneeDeptName",
						task.getAssigneeDeptName());

				vars.put("mutilApproveRecord_" + approveTimes,
						mutilApproveRocord);
				mutilApproveRocord = new HashMap();
			}
		}

		logger.debug("trace variables: {}", vars);

		activityInfo.put("taskDefId", activity.getId());
		activityInfo.put("vars", vars);
		return activityInfo;
	}

	private void setTaskGroup(Map<String, Object> vars,
			Set<Expression> candidateGroupIdExpressions) {
		String roles = "";
		for (Expression expression : candidateGroupIdExpressions) {
			String expressionText = expression.getExpressionText();
			String roleName = identityService.createGroupQuery()
					.groupId(expressionText).singleResult().getName();
			roles += roleName;
		}
		vars.put("任务所属角色", roles);
	}

	/**
	 * 设置当前处理人信息
	 * 
	 * @param vars
	 * @param currentTask
	 */
	private void setCurrentTaskAssignee(Map<String, Object> vars,
			Task currentTask) {
		String assignee = currentTask.getAssignee();
		if (assignee != null) {
			User assigneeUser = identityService.createUserQuery()
					.userId(assignee).singleResult();
			String userInfo = assigneeUser.getFirstName() + " "
					+ assigneeUser.getLastName();
			vars.put("当前处理人", userInfo);
		}
	}

	/**
	 * 获取当前节点信息
	 * 
	 * @param processInstance
	 * @return
	 */
	private Task getCurrentTaskInfo(HistoricProcessInstance processInstance) {
		Task currentTask = null;
		try {
			String activitiId = (String) PropertyUtils.getProperty(
					processInstance, "activityId");
			logger.debug("current activity id: {}", activitiId);

			currentTask = taskService.createTaskQuery()
					.processInstanceId(processInstance.getId())
					.taskDefinitionKey(activitiId).singleResult();
			logger.debug("current task for processInstance: {}",
					ToStringBuilder.reflectionToString(currentTask));

		} catch (Exception e) {
			logger.error("can not get property activityId from processInstance: {}",
					processInstance);
		}
		return currentTask;
	}

	/**
	 * 设置宽度、高度属性
	 * 
	 * @param activity
	 * @param activityInfo
	 */
	private void setWidthAndHeight(ActivityImpl activity,
			Map<String, Object> activityInfo) {
		activityInfo.put("width", activity.getWidth());
		activityInfo.put("height", activity.getHeight());
	}

	/**
	 * 设置坐标位置
	 * 
	 * @param activity
	 * @param activityInfo
	 */
	private void setPosition(ActivityImpl activity,
			Map<String, Object> activityInfo) {
		activityInfo.put("x", activity.getX());
		activityInfo.put("y", activity.getY());
	}

}
