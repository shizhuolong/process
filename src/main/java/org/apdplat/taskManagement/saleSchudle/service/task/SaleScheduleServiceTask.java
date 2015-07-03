package org.apdplat.taskManagement.saleSchudle.service.task;

import org.activiti.engine.delegate.DelegateExecution;
import org.apdplat.taskManagement.saleSchudle.TaskConstants;
import org.apdplat.taskManagement.saleSchudle.service.SaleScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * @author suyi
 * @date 2015年3月25日
 */
@Service
public class SaleScheduleServiceTask {
	
	@Autowired
	private SaleScheduleService saleScheduleService;
	
	@Transactional(rollbackFor=Exception.class)
	public void assigneTask(DelegateExecution arg0) {
		
		String workNo = arg0.getProcessBusinessKey();
		
		//将下级地域任务状态更新为‘等待领取’（2）
		String status = TaskConstants.STATUS_2;
		saleScheduleService.updateTaskRegionStatusByWorkNo(status, workNo,"");
		
		//将主任务更新为‘已下发’（6）
		saleScheduleService.updateTaskRegionStatusByWorkNo(TaskConstants.STATUS_6, workNo,"1");
	}
	
	
	@Transactional(rollbackFor=Exception.class)
	public void cancelTask(DelegateExecution arg0) {
		
		String workNo = arg0.getProcessBusinessKey();
		saleScheduleService.cancelTaskByWorkNo(workNo);
	}

}
