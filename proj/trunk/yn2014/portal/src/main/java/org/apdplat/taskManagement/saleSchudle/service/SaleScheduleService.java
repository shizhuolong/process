package org.apdplat.taskManagement.saleSchudle.service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.activiti.engine.runtime.ProcessInstance;
import org.apache.commons.lang3.StringUtils;
import org.apdplat.module.security.model.Org;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.module.system.service.PropertyHolder;
import org.apdplat.platform.exception.BusiException;
import org.apdplat.portal.common.bean.StaticParaBean;
import org.apdplat.portal.common.service.CommonParamService;
import org.apdplat.portal.common.util.UUIDGeneratorUtils;
import org.apdplat.taskManagement.saleSchudle.TaskConstants;
import org.apdplat.taskManagement.saleSchudle.bean.IndexTargetBean;
import org.apdplat.taskManagement.saleSchudle.bean.TaskRegionBean;
import org.apdplat.taskManagement.saleSchudle.bean.TaskRegionDetailBean;
import org.apdplat.taskManagement.saleSchudle.dao.SaleScheduleDao;
import org.apdplat.workflow.service.WorkOrderService;
import org.apdplat.workflow.vo.WorkOrderVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

/**
 * @author suyi
 * @date 2015年3月24日
 */
@Service
public class SaleScheduleService {
	
	@Autowired
	private SaleScheduleDao saleScheduleDao;
	@Autowired
	private WorkOrderService workOrderService;
	@Autowired
	private CommonParamService commonParamService;

	/**
	 * 任务包排产数据入库，并提交领导审批
	 * @param taskRegionBean	指标汇总数据
	 * @param detailList	下级区域排产数据
	 * @param title			工单主题
	 * @param nextDealer	下一步审批人
	 * @throws BusiException
	 */
	@Transactional(rollbackFor=Exception.class)
	public void addTask(TaskRegionBean taskRegionBean,List<TaskRegionBean> detailList,String title,String nextDealer,String businessKey) throws BusiException{
		
		User user = UserHolder.getCurrentLoginUser();
		Org org = user.getOrg();
		String status = TaskConstants.STATUS_1;
		
		Map<String,String> params = new HashMap<String,String>();
		params.put("regionCode", taskRegionBean.getRegionCode());
		params.put("dateValue", taskRegionBean.getDateValue());
		
		//1.保存总任务信息
		String taskCode = UUIDGeneratorUtils.getUUID();	//主任务编号
		String taskId = UUIDGeneratorUtils.getUUID(); //总任务ID
		taskRegionBean.setTaskCode(taskCode);
		taskRegionBean.setId(taskId);
		taskRegionBean.setParentTaskId("");
		taskRegionBean.setStatus(status);
		taskRegionBean.setIsValid("1");
		taskRegionBean.setCreaterRegion(org.getCode());
		taskRegionBean.setCreater(user.getUsername());
		taskRegionBean.setIsNew("1");
		taskRegionBean.setWorkNo(businessKey);
		saleScheduleDao.addTaskBaseRegion(taskRegionBean);
		for(TaskRegionDetailBean t:taskRegionBean.getTaskDetailList()) {
			params.put("targetId", t.getTargetId());
			int count = saleScheduleDao.checkIfAlreadyAssignTask(params);
			if(count > 0) {
				throw new BusiException("您所排任务中存在指标已排过"+taskRegionBean.getDateDesc()+"的任务值，不能重复排产！");
			}
			t.setId(UUIDGeneratorUtils.getUUID());
			t.setCreater(user.getUsername());
			t.setIsValid("1");
			t.setTaskRegionId(taskId);
			saleScheduleDao.addTaskRegionDetail(t);
		}
		
		//2.保存下级地域排产任务信息
		for(TaskRegionBean t:detailList) {
			String id = UUIDGeneratorUtils.getUUID();
			t.setTaskCode(taskCode);
			t.setId(id);
			t.setParentTaskId(taskId);
			t.setStatus(status);
			t.setIsValid("1");
			t.setCreaterRegion(org.getCode());
			t.setCreater(user.getUsername());
			t.setIsNew("2");
			t.setWorkNo(businessKey);
			saleScheduleDao.addTaskBaseRegion(t);
			for(TaskRegionDetailBean taskDetail:t.getTaskDetailList()) {
				taskDetail.setId(UUIDGeneratorUtils.getUUID());
				taskDetail.setCreater(user.getUsername());
				taskDetail.setIsValid("1");
				taskDetail.setTaskRegionId(id);
				saleScheduleDao.addTaskRegionDetail(taskDetail);
			}
		}
		
		//activity流程key，在activity的bpmn文件中定义
		String processKey = PropertyHolder.getProperty("assigneTaskProcessKey");
		//流程审批中的可编辑页面，类似之前的拟稿人的编辑修改界面
		String assigneTaskProcessEditUrl = PropertyHolder.getProperty("assigneTaskProcessEditUrl");
		//流程审批中的查看界面
		String assigneTaskProcessReadUrl = PropertyHolder.getProperty("assigneTaskProcessReadUrl");
		
		if(StringUtils.isBlank(assigneTaskProcessEditUrl) || StringUtils.isBlank(assigneTaskProcessReadUrl)) {
			throw new BusiException("审批界面变量不能为空！");
		}
		
		WorkOrderVo workOrderVo = new WorkOrderVo();
		workOrderVo.setBusinessKey(businessKey);
		workOrderVo.setProcessKey(processKey);
		workOrderVo.setTitle(title);
		workOrderVo.setEditUrl(assigneTaskProcessEditUrl);
		workOrderVo.setNoEditUrl(assigneTaskProcessReadUrl);
		workOrderVo.setNextDealer(nextDealer);
		workOrderVo.setDesc(title);
		workOrderVo.setStartMan(user.getId().toString());
		workOrderVo.setRegionName(user.getOrg().getRegionName());
		
		ProcessInstance processInstance = workOrderService.startProcessInstanceByKey(workOrderVo);
		if(null == processInstance) {
			throw new BusiException("发送失败！");
		}
	}
	
	/**
	 * 查询任务汇总数据
	 * @param workNo 工单编号
	 * @return
	 * @throws BusiException
	 */
	public TaskRegionBean qrySumTaskInfoByWorkNo(String workNo) throws BusiException{
		
		TaskRegionBean taskRegionBean = saleScheduleDao.qrySumTaskInfoByWorkNo(workNo);
		if(null == taskRegionBean) {
			throw new BusiException("获取任务汇总数据失败！");
		}
		List<TaskRegionDetailBean> list = saleScheduleDao.qryTaskDetailByTaskId(taskRegionBean.getId());
		for(TaskRegionDetailBean taskDetailBean:list) {
			IndexTargetBean targetBean = saleScheduleDao.qryIndexTargetById(taskDetailBean.getTargetId());
			taskDetailBean.setIndexTargetBean(targetBean);
		}
		taskRegionBean.setTaskDetailList(list);
		return taskRegionBean;
	}
	
	/**
	 * 查询下级地域的排产数据
	 * @param parentTaskId 上级任务ID
	 * @param workNo	工单编号
	 * @return
	 * @throws BusiException
	 */
	public List<TaskRegionBean> qrySubordinateTaskInfoByParentTaskId(String parentTaskId,String workNo)
		throws BusiException {
		
		Map<String,String> params = new HashMap<String,String>();
		params.put("parentTaskId", parentTaskId);
		params.put("workNo", workNo);
		List<TaskRegionBean> list = saleScheduleDao.qrySubordinateTaskInfoByParentTaskId(params);
		for(TaskRegionBean taskRegionBean:list) {
			List<TaskRegionDetailBean> taskDetailList = saleScheduleDao.qryTaskDetailByTaskId(taskRegionBean.getId());
			for(TaskRegionDetailBean taskDetailBean:taskDetailList) {
				IndexTargetBean targetBean = saleScheduleDao.qryIndexTargetById(taskDetailBean.getTargetId());
				taskDetailBean.setIndexTargetBean(targetBean);
			}
			taskRegionBean.setTaskDetailList(taskDetailList);
		}
		return list;
	}
	
	/**
	 * 
	 * @param taskId 
	 * @return
	 * @throws BusiException
	 */
	public TaskRegionBean qryTaskById(String taskId) throws BusiException{
		
		TaskRegionBean taskRegionBean = saleScheduleDao.qryTaskById(taskId);
		if(null == taskRegionBean) {
			throw new BusiException("获取任务数据失败！");
		}
		List<TaskRegionDetailBean> list = saleScheduleDao.qryTaskDetailByTaskId(taskRegionBean.getId());
		for(TaskRegionDetailBean taskDetailBean:list) {
			IndexTargetBean targetBean = saleScheduleDao.qryIndexTargetById(taskDetailBean.getTargetId());
			taskDetailBean.setIndexTargetBean(targetBean);
		}
		taskRegionBean.setTaskDetailList(list);
		return taskRegionBean;
	}
	
	/**
	 * 修改任务值
	 * @param taskRegionBean
	 * @param detailList
	 * @throws BusiException
	 */
	@Transactional(rollbackFor=Exception.class)
	public void editTask(TaskRegionBean taskRegionBean,List<TaskRegionBean> detailList) throws BusiException{
		
		for(TaskRegionDetailBean detailBean:taskRegionBean.getTaskDetailList()) {
			if(StringUtils.isBlank(detailBean.getTargetValue()) || StringUtils.isBlank(detailBean.getLastValue())) {
				throw new BusiException("总任务指标值不能为空！");
			}
			saleScheduleDao.updateTaskTargetValue(detailBean);
		}
		
		for(TaskRegionBean taskBean:detailList) {
			for(TaskRegionDetailBean detailBean:taskBean.getTaskDetailList()) {
				if(StringUtils.isBlank(detailBean.getTargetValue()) || StringUtils.isBlank(detailBean.getLastValue())) {
					throw new BusiException("["+taskBean.getRegionName()+"]任务指标值不能为空！");
				}
				saleScheduleDao.updateTaskTargetValue(detailBean);
			}
		}
	}
	
	/**
	 * 修改下级地域已拒绝的任务值并重新提交审批
	 * @param taskRegionBean
	 * @param detailList
	 * @param title
	 * @param nextDealer
	 * @throws BusiException
	 */
	public void editRejectTask(TaskRegionBean taskRegionBean,List<TaskRegionBean> detailList,String title,String nextDealer) throws BusiException{
		
		User user = UserHolder.getCurrentLoginUser();
		String seqId = commonParamService.getId();
		SimpleDateFormat format = new SimpleDateFormat("yyyyMMdd");
		String time = format.format(new Date());
		String businessKey = "YN-"+time+seqId; //工单编号
		String status = TaskConstants.STATUS_1;
		
		//更新总任务指标值
		for(TaskRegionDetailBean detailBean:taskRegionBean.getTaskDetailList()) {
			if(StringUtils.isBlank(detailBean.getTargetValue()) || StringUtils.isBlank(detailBean.getLastValue())) {
				throw new BusiException("总任务指标值不能为空！");
			}
			saleScheduleDao.updateTaskTargetValue(detailBean);
		}
		
		Map<String,String> params = new HashMap<String,String>();
		params.put("status", status);
		params.put("workNo", businessKey);
		for(TaskRegionBean taskBean:detailList) {
			params.put("taskId", taskBean.getId());
			//将状态重新更新为审批状态,工单编号更新
			saleScheduleDao.updateRejectTaskById(params);
			for(TaskRegionDetailBean detailBean:taskBean.getTaskDetailList()) {
				if(StringUtils.isBlank(detailBean.getTargetValue()) || StringUtils.isBlank(detailBean.getLastValue())) {
					throw new BusiException("["+taskBean.getRegionName()+"]任务指标值不能为空！");
				}
				//更新任务值
				saleScheduleDao.updateTaskTargetValue(detailBean);
			}
		}
		
		//activity流程key，在activity的bpmn文件中定义
		String processKey = PropertyHolder.getProperty("assigneTaskProcessKey");
		//流程审批中的可编辑页面，类似之前的拟稿人的编辑修改界面
		String assigneTaskProcessEditUrl = PropertyHolder.getProperty("assigneTaskProcessRejectEditUrl");
		//流程审批中的查看界面
		String assigneTaskProcessReadUrl = PropertyHolder.getProperty("assigneTaskProcessRejectReadUrl");
		
		if(StringUtils.isBlank(assigneTaskProcessEditUrl) || StringUtils.isBlank(assigneTaskProcessReadUrl)) {
			throw new BusiException("审批界面变量不能为空！");
		}
		
		WorkOrderVo workOrderVo = new WorkOrderVo();
		workOrderVo.setBusinessKey(businessKey);
		workOrderVo.setProcessKey(processKey);
		workOrderVo.setTitle(title);
		workOrderVo.setEditUrl(assigneTaskProcessEditUrl);
		workOrderVo.setNoEditUrl(assigneTaskProcessReadUrl);
		workOrderVo.setNextDealer(nextDealer);
		workOrderVo.setDesc(title);
		workOrderVo.setStartMan(user.getId().toString());
		workOrderVo.setRegionName(user.getOrg().getRegionName());
		
		ProcessInstance processInstance = workOrderService.startProcessInstanceByKey(workOrderVo);
		if(null == processInstance) {
			throw new BusiException("发送失败！");
		}
	}
	
	
	/**
	 * 更新任务状态（tab_task_base_region表的status）
	 * @param status
	 * @param workNo
	 * @param isNew 等于1时表示将主任务状态更新为‘已下发(6)’
	 */
	@Transactional(rollbackFor=Exception.class)
	public void updateTaskRegionStatusByWorkNo(String status,String workNo,String isNew) {
		
		Map<String,String> params = new HashMap<String,String>();
		params.put("status", status);
		params.put("workNo", workNo);
		params.put("isNew", isNew);
		saleScheduleDao.updateTaskRegionStatusByWorkNo(params);
	}
	
	/**
	 * 更新任务状态（tab_task_base_region表的status）
	 * @param status
	 * @param taskId
	 */
	@Transactional(rollbackFor=Exception.class)
	public void updateTaskRegionStatusById(String status,String taskId) {
		
		Map<String,String> params = new HashMap<String,String>();
		params.put("status", status);
		params.put("taskId", taskId);
		saleScheduleDao.updateTaskRegionStatusById(params);
	}
	
	/**
	 * 查询我的任务列表
	 * @param params
	 * @return
	 */
	public Object queryMyTaskList(Map<String, String> params){
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<TaskRegionBean> rows = saleScheduleDao.queryMyTaskList(params);
		for(TaskRegionBean taskRegionBean:rows) {
			//指标明细
			List<TaskRegionDetailBean> taskDetailList = saleScheduleDao.qryTaskDetailByTaskId(taskRegionBean.getId());
			//下级拒绝的任务数
			List<TaskRegionBean> list = saleScheduleDao.qryRejectTaskByParentTaskId(taskRegionBean.getId());
			taskRegionBean.setRejectTaskNum(list.size());		
			for(TaskRegionDetailBean taskDetailBean:taskDetailList) {
				IndexTargetBean targetBean = saleScheduleDao.qryIndexTargetById(taskDetailBean.getTargetId());
				taskDetailBean.setIndexTargetBean(targetBean);
			}
			taskRegionBean.setTaskDetailList(taskDetailList);
		}
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}
	
	/**
	 * 查询下级地域拒绝的任务列表
	 * @param 
	 * @return
	 * @throws BusiException
	 */
	public List<TaskRegionBean> qryRejectTaskByParentTaskId(String parentTaskId)
		throws BusiException {
		
		List<TaskRegionBean> list = saleScheduleDao.qryRejectTaskByParentTaskId(parentTaskId);
		for(TaskRegionBean taskRegionBean:list) {
			List<TaskRegionDetailBean> taskDetailList = saleScheduleDao.qryTaskDetailByTaskId(taskRegionBean.getId());
			for(TaskRegionDetailBean taskDetailBean:taskDetailList) {
				IndexTargetBean targetBean = saleScheduleDao.qryIndexTargetById(taskDetailBean.getTargetId());
				taskDetailBean.setIndexTargetBean(targetBean);
			}
			taskRegionBean.setTaskDetailList(taskDetailList);
		}
		return list;
	}

	/**
	 * 营服中心任务分解
	 * @param taskId	营服中心任务id
	 * @param taskCode	总任务编号
	 * @param detailList	下级分解任务
	 */
	@Transactional(rollbackFor=Exception.class)
	public void addChanlManagerTask(String taskId, String taskCode,
			List<TaskRegionBean> detailList) throws BusiException{
		User user = UserHolder.getCurrentLoginUser();
		Org org = user.getOrg();
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		//更新营服中心状态为6
		Map<String, String> params = new HashMap<String,String>();
		params.put("status", TaskConstants.STATUS_6);
		params.put("taskId", taskId);
		saleScheduleDao.updateTaskRegionStatusById(params);
		for(TaskRegionBean t : detailList) {
			String id = UUIDGeneratorUtils.getUUID(); //总任务ID
			TaskRegionBean taskRegionBean = new TaskRegionBean();
			taskRegionBean.setId(id);
			taskRegionBean.setDateType(t.getDateType());
			taskRegionBean.setDateDesc(t.getDateDesc());
			taskRegionBean.setRegionCode(t.getRegionCode());
			taskRegionBean.setRegionName(t.getRegionName());
			taskRegionBean.setTaskCode(taskCode);
			taskRegionBean.setParentTaskId(taskId);
			taskRegionBean.setStatus(TaskConstants.STATUS_4);
			taskRegionBean.setIsValid("1");
			taskRegionBean.setCreaterRegion(org.getCode());
			taskRegionBean.setCreater(user.getUsername());
			taskRegionBean.setDateValue(t.getDateValue());
			taskRegionBean.setIsNew("2");
			taskRegionBean.setRegionType(t.getRegionType());
			taskRegionBean.setWorkNo("");
			taskRegionBean.setUserType(t.getUserType());
			saleScheduleDao.addTaskBaseRegion(taskRegionBean);
			for(TaskRegionDetailBean taskDetailBean : t.getTaskDetailList()) {
				TaskRegionDetailBean detail = new TaskRegionDetailBean();
				String detailId = UUIDGeneratorUtils.getUUID(); //总任务ID
				detail.setId(detailId);
				detail.setTargetId(taskDetailBean.getTargetId());
				detail.setTargetValue(taskDetailBean.getTargetValue());
				detail.setCreater(user.getUsername());
				detail.setIsValid("1");
				detail.setTaskRegionId(id);
				saleScheduleDao.addTaskRegionDetail(detail);
			}
		}
	}
	
	/**
	 * 作废排产任务
	 * @param parentTaskId
	 * @throws BusiException
	 */
	@Transactional(rollbackFor=Exception.class)
	public void cancelTask(String parentTaskId) throws BusiException {
		
		if(StringUtils.isBlank(parentTaskId)) {
			throw new BusiException("任务ID不能为空");
		}
		
		StaticParaBean staticParaBean = commonParamService.qryStaticParaByParaCode("1");
		if(null == staticParaBean) {
			throw new BusiException("获取任务排产限时控制失败！");
		}
		String cMonth = new SimpleDateFormat("yyyyMM").format(new Date());
		TaskRegionBean taskRegionBean = saleScheduleDao.qryTaskById(parentTaskId);
		
		if(!cMonth.equals(taskRegionBean.getDateValue()) && "1".equals(staticParaBean.getParaValue())) {
			throw new BusiException("该任务已超过可作废时间范围，不能作废了！");
		}
		
		
		if("1".equals(taskRegionBean.getIsNew()) && null==taskRegionBean.getParentTaskId()) {
			//如果是地市作废，则将本条汇总任务一起作废
			saleScheduleDao.moveTaskToHistoryById(parentTaskId);
			saleScheduleDao.moveTaskDetailToHistoryById(parentTaskId);
			
			saleScheduleDao.deleteTaskById(parentTaskId);
			saleScheduleDao.deleteTaskDetailById(parentTaskId);
		}else {
			//营服中心或渠道经理作废，则将状态重新跟新为4，使其可重新分解排产
			Map<String,String> params = new HashMap<String,String>();
			params.put("taskId", parentTaskId);
			params.put("status", TaskConstants.STATUS_4);
			saleScheduleDao.updateTaskRegionStatusById(params);
		}
		
		//1.判断下级地域任务中是否还存在审批中的任务，如果有则不让作废
		int num = saleScheduleDao.qryApprovingTaskNumByParentId(parentTaskId);
		if(num > 0) {
			throw new BusiException("下级任务还存在审批中的任务，暂时无法作废！");
		}
		
		//2.将数据移入历史表
		saleScheduleDao.moveTaskToHistoryInCascade(parentTaskId);
		saleScheduleDao.moveTaskDetailToHistoryInCascade(parentTaskId);
		
		//3.删除待作废任务数据
		saleScheduleDao.deleteTaskByParentIdInCascade(parentTaskId);
		saleScheduleDao.deleteTaskDetailByParentIdInCascade(parentTaskId);
		
	}
	
	/**
	 * 审批流程中作废排产任务
	 * 1.将状态status更新为3
	 * 2.将isvalid更新为0
	 * @param workNo
	 */
	public void cancelTaskByWorkNo(String workNo) {
		
		saleScheduleDao.cancelTaskByWorkNo(workNo);
	}
	
	
	public Object qrySaleScheculeReport(Map<String,String> params1) {
		
		Map<String,Object> result = new HashMap<String,Object>();
		Map<String,String> params2 = new HashMap<String,String>();
		PageList<TaskRegionBean> rows = saleScheduleDao.qrySaleScheculeReport(params1);
		for(TaskRegionBean taskRegionBean:rows) {
			params2.put("regionType",taskRegionBean.getRegionType());
			params2.put("taskCode", taskRegionBean.getTaskCode());
			params2.put("regionCode", taskRegionBean.getRegionCode());
			params2.put("dateValue", taskRegionBean.getDateValue());
			params2.put("userType", taskRegionBean.getUserType());
			List<TaskRegionDetailBean> detailList = saleScheduleDao.qrySaleScheduleReportDetail(params2);
			taskRegionBean.setTaskDetailList(detailList);
		}
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}

}
