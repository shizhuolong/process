package org.apdplat.workflow.action;

import java.util.Date;
import java.util.List;

import net.sf.json.JsonConfig;

import org.activiti.engine.RuntimeService;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.runtime.ProcessInstanceQuery;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.util.Pagination;
import org.apdplat.workflow.common.BaseAction;
import org.apdplat.workflow.service.ProcessInstanceService;
import org.apdplat.workflow.util.DateJsonValueProcessor;
import org.apdplat.workflow.util.Struts2Utils;
import org.apdplat.workflow.vo.WorkOrderVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

/**
 * 
 * @author suyi
 *
 */
@Controller
@Namespace("/workflow/processInstance")
@Results({
	@Result(name="running",location="/workflow/jsp/runningManage.jsp")
})
public class ProcessInstanceAction extends BaseAction{
	
	private static final long serialVersionUID = 8723212061616911358L;
	
	@Autowired
	private RuntimeService runtimeService;
	@Autowired
	private ProcessInstanceService processInstanceService;
	
	private Pagination<ProcessInstance> pagination;
	private WorkOrderVo vo;
	

	/**
	 * 运行中的流程
	 * @return
	 */
	public String running() {
		
		pagination = new Pagination<ProcessInstance>();
		pagination.setPageSize(this.rows);
		pagination.setPageNo(this.page);
		ProcessInstanceQuery processInstanceQuery = runtimeService.createProcessInstanceQuery();
		List<ProcessInstance> processInstanceList = processInstanceQuery.listPage(pagination.getFirst()-1, pagination.getPageSize());
		pagination.setResult(processInstanceList);
		pagination.setTotalCount(processInstanceQuery.count());
		return "running";
	}
	
	/**流程实例监控**/
	public void qryTraceProcessInstanceList() {
		
		pagination = processInstanceService.getTraceProcessInstanceList(vo);
		JsonConfig config = new JsonConfig();
	    config.registerJsonValueProcessor(Date.class,new DateJsonValueProcessor("yyyy-MM-dd HH:mm:ss"));
		Struts2Utils.renderJson(pagination,config);
	}

	
	public Pagination<ProcessInstance> getPagination() {
		return pagination;
	}

	public void setPagination(Pagination<ProcessInstance> pagination) {
		this.pagination = pagination;
	}

	public WorkOrderVo getVo() {
		return vo;
	}
	public void setVo(WorkOrderVo vo) {
		this.vo = vo;
	}

}