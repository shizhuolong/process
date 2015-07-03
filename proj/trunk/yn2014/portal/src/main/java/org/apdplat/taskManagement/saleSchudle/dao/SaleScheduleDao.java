package org.apdplat.taskManagement.saleSchudle.dao;

import java.util.List;
import java.util.Map;

import org.apdplat.taskManagement.saleSchudle.bean.IndexTargetBean;
import org.apdplat.taskManagement.saleSchudle.bean.TaskRegionBean;
import org.apdplat.taskManagement.saleSchudle.bean.TaskRegionDetailBean;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

/**
 * @author suyi
 * @date 2015年3月24日
 */
public interface SaleScheduleDao {

	public void addTaskBaseRegion(TaskRegionBean taskRegionBean);
	
	public void addTaskRegionDetail(TaskRegionDetailBean taskRegionDetailBean);
	
	public TaskRegionBean qrySumTaskInfoByWorkNo(String workNo);
	
	public TaskRegionBean qryTaskById(String taskId);
	
	public List<TaskRegionBean> qrySubordinateTaskInfoByParentTaskId(Map<String,String> params);
	
	public List<TaskRegionDetailBean> qryTaskDetailByTaskId(String taskId);
	
	public IndexTargetBean qryIndexTargetById(String id);
	
	public void updateTaskTargetValue(TaskRegionDetailBean taskRegionDetailBean);
	
	public void updateTaskRegionStatusByWorkNo(Map<String,String> params);
	
	public void updateTaskRegionStatusById(Map<String,String> params);
	
	public void updateRejectTaskById(Map<String,String> params);
	
	public PageList<TaskRegionBean> queryMyTaskList(Map<String, String> params);
	
	public List<TaskRegionBean> qryRejectTaskByParentTaskId(String parentTaskId);
	
	public void moveTaskToHistoryInCascade(String parentTaskId);
	
	public void moveTaskDetailToHistoryInCascade(String parentTaskId);
	
	public void deleteTaskByParentIdInCascade(String parentTaskId);
	
	public void deleteTaskDetailByParentIdInCascade(String parentTaskId);
	
	public Integer qryApprovingTaskNumByParentId(String parentTaskId);
	
	public void cancelTaskByWorkNo(String workNo);
	
	public void moveTaskToHistoryById(String parentTaskId);
	
	public void moveTaskDetailToHistoryById(String parentTaskId);
	
	public void deleteTaskById(String parentTaskId);
	
	public void deleteTaskDetailById(String parentTaskId);
	
	public Integer checkIfAlreadyAssignTask(Map<String,String> params);
	
	public PageList<TaskRegionBean> qrySaleScheculeReport(Map<String,String> params);
	
	public List<TaskRegionDetailBean> qrySaleScheduleReportDetail(Map<String,String> params);
}
