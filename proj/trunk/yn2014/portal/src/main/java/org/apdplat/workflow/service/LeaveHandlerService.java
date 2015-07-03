package org.apdplat.workflow.service;

import javax.annotation.Resource;

import org.activiti.engine.runtime.ProcessInstance;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.module.system.service.PropertyHolder;
import org.apdplat.platform.util.ResultInfo;
import org.apdplat.portal.common.util.UUIDGeneratorUtils;
import org.apdplat.workflow.vo.WorkOrderVo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LeaveHandlerService {
	
	@Resource
	private WorkOrderService workOrderService;
	
	/**请假例子
	 * 提交工单审批，传参根据具体需要修改，只是演示activiti的大概处理流程
	 * @param title
	 * @return
	 */
	@Transactional(rollbackFor=Exception.class)
	public ResultInfo submitLeaveOrder(String title,String nextDealer) {
		
		User user = UserHolder.getCurrentLoginUser();
		ResultInfo resultInfo = new ResultInfo();
		
		//业务主键.先保存自己的业务数据生成此主键，然后传给activiti，用于和业务数据关联。具体生成规则根据需要来定。
		String businessKey = UUIDGeneratorUtils.getUUID(); 
		
		//保存业务数据，这里是保存请假表单
		/**
		 * to-do
		 */
		
		//activity流程key，在activity的bpmn文件中定义
		String processKey = PropertyHolder.getProperty("commissionPayKey");
		//流程审批中的可编辑页面，类似之前的拟稿人的编辑修改界面
		String commissionPayEditUrl = PropertyHolder.getProperty("commissionPayEditUrl");
		//流程审批中的查看界面
		String commissionPayReadUrl = PropertyHolder.getProperty("commissionPayReadUrl");
		
		WorkOrderVo workOrderVo = new WorkOrderVo();
		workOrderVo.setBusinessKey(businessKey);
		workOrderVo.setProcessKey(processKey);
		workOrderVo.setTitle(title);
		workOrderVo.setEditUrl(commissionPayEditUrl);
		workOrderVo.setNoEditUrl(commissionPayReadUrl);
		workOrderVo.setNextDealer(nextDealer);
		workOrderVo.setDesc(title);
		workOrderVo.setStartMan(user.getId().toString());
		
		ProcessInstance processInstance = workOrderService.startProcessInstanceByKey(workOrderVo);
		if(null != processInstance) {
			resultInfo.setCode(ResultInfo._CODE_OK_);
			resultInfo.setMsg("发送成功");
		}else {
			throw new RuntimeException("发送失败！");
		}
		return resultInfo;
	}

}
