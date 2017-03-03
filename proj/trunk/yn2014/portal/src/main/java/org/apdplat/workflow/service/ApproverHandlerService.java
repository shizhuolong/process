package org.apdplat.workflow.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.apdplat.workflow.dao.ApproverHandlerDao;
import org.springframework.stereotype.Service;

@Service
public class ApproverHandlerService {
	
	@Resource
	private ApproverHandlerDao approverHandlerDao;
	
	public List<Map<String,String>> qryTaskApproverTreeData(String userIds) {
		Map<String,String> params=new HashMap<String,String>();
		params.put("userIds", userIds);
		return approverHandlerDao.qryTaskApproverTreeData(params);
	}
	/**
	 * 根据activiti的userTask节点id查询TB_ACT_TASK_APPROVER表中配置的改节点下的审批人员
	 * 如果为省公司节点（如“省总经理”），表中该节点只配置了省公司人员，只需传taskId即可
	 * @param taskId activiti的userTask ID
	 * @param oaComId 分公司ID
	 * @param oaDepId 部门ID
	 * @return
	 */
	public List<Map<String,String>> qryTaskApprover(String taskId,String oaComId,String oaDepId) {
	
		Map<String,String> var = new HashMap<String,String>();
		var.put("taskId", taskId);
		if(StringUtils.isNotBlank(oaComId)) {
			var.put("oaComId", oaComId);
		}
		if(StringUtils.isNotBlank(oaDepId)) {
			var.put("oaDepId", oaDepId);
		}
		return approverHandlerDao.qryTaskApprover(var);
	}
	
	/**
	 * 获取当前用户的部门领导，user表中oa_job_name like '%经理%' or like '%主任%'
	 * @param oaComId
	 * @param oaDepId
	 * @return
	 */
	public List<Map<String,String>> qryMyDepartLeader(String oaComId,String oaDepId) {
		
		Map<String,String> var = new HashMap<String,String>();
		var.put("oaComId", oaComId);
		var.put("oaDepId", oaDepId);
		return approverHandlerDao.qryMyDepartLeader(var);
	}
	
	/**
	 * 获取activiti userTask的额外属性
	 * task_flag:0-当前审批环节审批人为拟稿人；1-当前审批环节审批人为省公司人员；2-当前审批环节审批人为同分公司人员；3-当前审批人为同部门人员。
	 * @param taskId
	 * @return
	 */
	public Map<String,Object> getUserTaskProperty(String taskId) {
		
		return approverHandlerDao.getUserTaskProperty(taskId);
	}

}
