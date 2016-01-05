package org.apdplat.workflow.action;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.zip.ZipInputStream;

import javax.servlet.http.HttpServletResponse;

import org.activiti.engine.HistoryService;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.history.HistoricProcessInstance;
import org.activiti.engine.repository.Deployment;
import org.activiti.engine.repository.ProcessDefinition;
import org.activiti.engine.repository.ProcessDefinitionQuery;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.struts2.ServletActionContext;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.module.system.service.PropertyHolder;
import org.apdplat.platform.exception.BusiException;
import org.apdplat.platform.util.Pagination;
import org.apdplat.platform.util.ResultInfo;
import org.apdplat.workflow.WorkflowConstant;
import org.apdplat.workflow.common.BaseAction;
import org.apdplat.workflow.service.WorkOrderService;
import org.apdplat.workflow.util.DateJsonValueProcessor;
import org.apdplat.workflow.util.Struts2Utils;
import org.apdplat.workflow.util.WorkflowUtils;
import org.apdplat.workflow.vo.WorkOrderVo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import net.sf.json.JsonConfig;



/**
 *	流程管理控制器
 * @author suyi
 *
 */
@Controller
@Namespace("/workflow")
@Results({
	@Result(name="processList",location="/workflow/jsp/deployProcessDefinition.jsp"),
	@Result(name="activeProcessList",location="/workflow/jsp/activeProcessList.jsp"),
	@Result(name = "toProcessWaitEditDetail", location = "/workflow/workorder/activityApproval/${approveUrl}"),
	@Result(name = "toProcessWaitReadOnlyDetail", location = "/workflow/workorder/activityApproval/${approveUrl}"),
	@Result(name = "toProcessDoingDetail", location = "/workflow/workorder/activityApproval/${approveUrl}"),
	@Result(name = "toProcessDoneDetail", location = "/workflow/workorder/activityApproval/${approveUrl}")
})
public class WorkFlowAction extends BaseAction{
	
	private static final long serialVersionUID = 6693278193051285904L;
	private static final Logger logger = LoggerFactory.getLogger(ApproverHandlerAction.class);

	@Autowired
	private RepositoryService repositoryService;
	@Autowired
	private WorkOrderService workOrderService;
	@Autowired
	private HistoryService historyService;
	
	private File file;
	private String fileFileName;
	private Pagination pagination;
	private String processDefinitionId;			//流程定义ID
	private String resourceType;				//资源类型(xml|image)
	private String state;
	private String deploymentId;
	private String processInstanceId;
	
	private WorkOrderVo workOrderVo;
	private String approveUrl;
	private String isNeedApprover;
	
	private String taskId;
	
	public String getTaskId() {
		return taskId;
	}

	public void setTaskId(String taskId) {
		this.taskId = taskId;
	}

	/**
	 * 部署流程
	 */
	public String deploy() {
		
		InputStream fileInputStream = null;
		ZipInputStream zipInputStream = null;
		try {
			fileInputStream = new FileInputStream(file);
			Deployment deployment = null;
			String extension = FilenameUtils.getExtension(fileFileName);
			if(extension.contains("zip") || extension.contains("bar")){
				zipInputStream = new ZipInputStream(fileInputStream);
				deployment = repositoryService.createDeployment().addZipInputStream(zipInputStream).deploy();
			}else {
				deployment = repositoryService.createDeployment().addInputStream(fileFileName,fileInputStream).deploy();
			}
			List<ProcessDefinition> list = repositoryService.createProcessDefinitionQuery().deploymentId(deployment.getId()).list();
			String exportDir = PropertyHolder.getProperty("export.diagram.path");
			for(ProcessDefinition processDefinition:list){
				WorkflowUtils.exportDiagramToFile(repositoryService, processDefinition, exportDir);
			}
			
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}finally{
			if(fileInputStream != null){
				try {
					fileInputStream.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
			if(zipInputStream != null){
				try {
					zipInputStream.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		return processList();
	}
	
	/**
	 * 流程定义列表
	 */
	public String processList() {
		
		List<Object[]> objects = new ArrayList<Object[]>();
		ProcessDefinitionQuery processDefinitionQuery = repositoryService.createProcessDefinitionQuery().orderByProcessDefinitionVersion().desc();
		pagination = new Pagination<Object[]>();
		pagination.setPageNo(this.page);
		pagination.setPageSize(this.rows);
		List<ProcessDefinition> processDefinitionList = processDefinitionQuery.listPage(pagination.getFirst()-1, pagination.getPageSize());
		for(ProcessDefinition processDefinition:processDefinitionList) {
			String deploymentId = processDefinition.getDeploymentId();
			Deployment deployment = repositoryService.createDeploymentQuery().deploymentId(deploymentId).singleResult();
			objects.add(new Object[]{processDefinition,deployment});
		}
		pagination.setResult(objects);
		pagination.setTotalCount(processDefinitionQuery.count());
		return "processList";
	}
	
	/**
	 * 读取资源，通过部署ID
	 * @throws IOException 
	 */
	public void loadByDeployment() throws IOException {
		
		HttpServletResponse response = ServletActionContext.getResponse();
		ProcessDefinition processDefinition = repositoryService.createProcessDefinitionQuery().processDefinitionId(processDefinitionId)
											  .singleResult();
		String resourceName = "";
		if("image".equals(resourceType)) {
			resourceName = processDefinition.getDiagramResourceName();
		}else{
			resourceName = processDefinition.getResourceName();
		}
		InputStream inputStream = repositoryService.getResourceAsStream(processDefinition.getDeploymentId(),resourceName);
		byte []b = new byte[1024];
		int len = -1;
		while((len=inputStream.read(b, 0, 1024)) != -1) {
			response.getOutputStream().write(b, 0, len);
		}
	}
	
	 public String loadByProcessInstance() throws IOException {

        InputStream resourceAsStream = null;
        HistoricProcessInstance processInstance = historyService.createHistoricProcessInstanceQuery().processInstanceId(processInstanceId).singleResult();
        ProcessDefinition processDefinition = repositoryService.createProcessDefinitionQuery().processDefinitionId(processInstance.getProcessDefinitionId())
                .singleResult();

        String resourceName = "";
        if (resourceType.equals("image")) {
            resourceName = processDefinition.getDiagramResourceName();
        } else if (resourceType.equals("xml")) {
            resourceName = processDefinition.getResourceName();
        }
        resourceAsStream = repositoryService.getResourceAsStream(processDefinition.getDeploymentId(), resourceName);
        byte[] b = new byte[1024];
        int len = -1;
        while ((len = resourceAsStream.read(b, 0, 1024)) != -1) {
            this.getResponse().getOutputStream().write(b, 0, len);
        }

        return null;
    }
	
	/**
	 * 挂起、激活流程实例
	 * @return
	 */
	public String updateStateOfProcessDefinition() {
		
		if("active".equals(state)) {
			repositoryService.activateProcessDefinitionById(processDefinitionId);
		}else if("suspend".equals(state)) {
			repositoryService.suspendProcessDefinitionById(processDefinitionId, true, null);
		}
		return processList();  
	}
	
	/**
	 * 删除部署的流程，级联删除流程实例
	 * @return
	 */
	public String delete() {
		
		repositoryService.deleteDeployment(deploymentId, true);
		return processList();
	}
	
	
	/**
	 * 查询可创建工单的流程定义列表
	 * @return
	 */
	public String activeProcessList() {
		
		pagination = new Pagination<List<ProcessDefinition>>();
		pagination.setPageNo(this.page);
		pagination.setPageSize(this.rows);
		ProcessDefinitionQuery processDefinitionQuery = repositoryService.createProcessDefinitionQuery().active().orderByDeploymentId().desc();
		List<ProcessDefinition> list = processDefinitionQuery.listPage(pagination.getFirst()-1, pagination.getPageSize());
		pagination.setResult(list);
		pagination.setTotalCount(processDefinitionQuery.count());
		return "activeProcessList";
	}
	
	/**
	 * 查询待办任务列表
	 */
	public void qryProcessOrderList() {
		
		User user = UserHolder.getCurrentLoginUser();
		workOrderVo.setAssignee(user.getId().toString());
		
		pagination = workOrderService.qryProcessList(workOrderVo);
		JsonConfig config = new JsonConfig();
	    config.registerJsonValueProcessor(Date.class,new DateJsonValueProcessor("yyyy-MM-dd HH:mm:ss"));
		Struts2Utils.renderJson(pagination,config);
	}
	
	/**
	 * 待办审批跳转至工单明细审批界面
	 * @return
	 */
	public String toProcessWaitDetail() {
		if(null==workOrderVo&&taskId!=null){
			workOrderVo=this.workOrderService.getWorkOrderInfoByTaskId(taskId, WorkflowConstant.WAIT);
		}
		String userId = UserHolder.getCurrentLoginUser().getId().toString();
		if(userId.equals(workOrderVo.getStartMan())){//当前可修改页面
			this.setApproveUrl(workOrderVo.getEditUrl());
			return "toProcessWaitEditDetail";
		}else{
			this.setApproveUrl(workOrderVo.getNoEditUrl());//不可编辑的审批页面
			return "toProcessWaitReadOnlyDetail";
		}
	}
	
	/**
	 * 跳转在办详细页面
	 * @return
	 */
	public String toProcessDoingDetail(){
		if(null==workOrderVo&&taskId!=null){
			workOrderVo=this.workOrderService.getWorkOrderInfoByTaskId(taskId, WorkflowConstant.DOING);
		}
		this.setApproveUrl(workOrderVo.getNoEditUrl());//不可编辑的审批页面
		return "toProcessDoingDetail";
	}
	/**
	 * 跳转办结页面
	 * @return
	 */
	public String toProcessDoneDetail(){
		if(null==workOrderVo&&taskId!=null){
			workOrderVo=this.workOrderService.getWorkOrderInfoByTaskId(taskId, WorkflowConstant.DONE);
		}
		this.setApproveUrl(workOrderVo.getNoEditUrl());//不可编辑的审批页面
		return "toProcessDoneDetail";
	}
	
	/**
	 * 查询审批历史记录
	 */
	public void qryApproveAdviceHistory() {
		
		JsonConfig config = new JsonConfig();
	    config.registerJsonValueProcessor(Date.class,new DateJsonValueProcessor("yyyy-MM-dd HH:mm:ss"));
		Struts2Utils.renderJson(this.workOrderService.getAuditHistory(this.workOrderVo,true),config);
	}
	
	/**
	 * 查询下一步任务节点
	 */
	public void queryNextUserTasks(){
		Struts2Utils.renderJson(this.workOrderService.getWorkOrderInfo(workOrderVo));
	}
	
	/**
	 * 任务审批
	 */
	public void doSubmitTask() {
		
		ResultInfo resultInfo = new ResultInfo();
		try{
			if("true".equals(isNeedApprover) && StringUtils.isBlank(workOrderVo.getNextDealer())) {
				throw new BusiException("请选择下一步审批人！");
			}
			if(StringUtils.isBlank(workOrderVo.getNextRouter())) {
				throw new BusiException("下一步审批步骤不能为空！");
			}
			if(StringUtils.isBlank(workOrderVo.getActNodeName())) {
				throw new BusiException("下一步审批步骤不能为空！");
			}
			workOrderService.submitTask(workOrderVo);
			resultInfo.setCode(ResultInfo._CODE_OK_);
			resultInfo.setMsg("发送成功!");
		}catch(BusiException e) {
			logger.error(e.getMessage(),e);
			resultInfo.setCode(ResultInfo._CODE_FAIL_);
			resultInfo.setMsg(e.getMessage());
		}catch(Exception e){
			resultInfo.setCode(ResultInfo._CODE_FAIL_);
			resultInfo.setMsg("发送失败！");
		}
		this.reponseJson(resultInfo);
	}
	
	public File getFile() {
		return file;
	}
	public void setFile(File file) {
		this.file = file;
	}

	public String getFileFileName() {
		return fileFileName;
	}

	public void setFileFileName(String fileFileName) {
		this.fileFileName = fileFileName;
	}

	public RepositoryService getRepositoryService() {
		return repositoryService;
	}

	public void setRepositoryService(RepositoryService repositoryService) {
		this.repositoryService = repositoryService;
	}

	public Pagination getPagination() {
		return pagination;
	}

	public void setPagination(Pagination pagination) {
		this.pagination = pagination;
	}

	public void setProcessDefinitionId(String processDefinitionId) {
		this.processDefinitionId = processDefinitionId;
	}

	public void setResourceType(String resourceType) {
		this.resourceType = resourceType;
	}

	public void setState(String state) {
		this.state = state;
	}

	public void setDeploymentId(String deploymentId) {
		this.deploymentId = deploymentId;
	}

	public WorkOrderVo getWorkOrderVo() {
		return workOrderVo;
	}

	public void setWorkOrderVo(WorkOrderVo workOrderVo) {
		this.workOrderVo = workOrderVo;
	}

	public String getApproveUrl() {
		return approveUrl;
	}

	public void setApproveUrl(String approveUrl) {
		this.approveUrl = approveUrl;
	}

	public String getIsNeedApprover() {
		return isNeedApprover;
	}

	public void setIsNeedApprover(String isNeedApprover) {
		this.isNeedApprover = isNeedApprover;
	}

	public void setProcessInstanceId(String processInstanceId) {
		this.processInstanceId = processInstanceId;
	}

	

}