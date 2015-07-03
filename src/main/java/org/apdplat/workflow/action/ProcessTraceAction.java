package org.apdplat.workflow.action;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.activiti.bpmn.model.BpmnModel;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.impl.bpmn.diagram.ProcessDiagramGenerator;
import org.activiti.engine.impl.context.Context;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.spring.ProcessEngineFactoryBean;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;
import org.apdplat.workflow.common.BaseAction;
import org.apdplat.workflow.service.WorkflowTraceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
@Namespace("/processTrace")
@ParentPackage("json-default")
@Results({
    @Result(name = "traceProcessSucess", type = "json", params = {}),
})
public class ProcessTraceAction extends BaseAction{
	
	private static final long serialVersionUID = 8301795323699177013L;
	
	private List<Map<String, Object>> activityInfos = new ArrayList<Map<String, Object>>();
	    @Autowired
	    RuntimeService runtimeService;
	    @Autowired
	    WorkflowTraceService traceService;
	    @Autowired
	    RepositoryService repositoryService;

	    private String resourceType;
	    private String pid;

	    public List<Map<String, Object>> getActivityInfos() {
	        return activityInfos;
	    }


	    public void setActivityInfos(List<Map<String, Object>> activityInfos) {
	        this.activityInfos = activityInfos;
	    }


	    public String getPid() {
	        return pid;
	    }


	    public void setPid(String pid) {
	        this.pid = pid;
	    }


	    public String getDeploymentId() {
	        return deploymentId;
	    }


	    public void setDeploymentId(String deploymentId) {
	        this.deploymentId = deploymentId;
	    }


	    public String getExecutionId() {
	        return executionId;
	    }


	    public void setExecutionId(String executionId) {
	        this.executionId = executionId;
	    }


	    private String deploymentId;
	    private String executionId;
	    @Autowired
	    ProcessEngineFactoryBean processEngine;

	    public String traceProcess() throws Exception {
	        activityInfos = traceService.traceProcess(pid);

	        return "traceProcessSucess";
	    }


	    /**
	     * 读取带跟踪的图片
	     */
	    public void readResource() throws Exception {
	        ProcessInstance processInstance = runtimeService.createProcessInstanceQuery().processInstanceId(pid).singleResult();
	        BpmnModel bpmnModel = repositoryService.getBpmnModel(processInstance.getProcessDefinitionId());
	        List<String> activeActivityIds = runtimeService.getActiveActivityIds(pid);
	        // 不使用spring请使用下面的两行代码
//	    ProcessEngineImpl defaultProcessEngine = (ProcessEngineImpl) ProcessEngines.getDefaultProcessEngine();
//	    Context.setProcessEngineConfiguration(defaultProcessEngine.getProcessEngineConfiguration());

	        // 使用spring注入引擎请使用下面的这行代码
	        Context.setProcessEngineConfiguration(processEngine.getProcessEngineConfiguration());

	        InputStream imageStream = ProcessDiagramGenerator.generateDiagram(bpmnModel, "png", activeActivityIds);

	        // 输出资源内容到相应对象
	        byte[] b = new byte[1024];
	        int len;
	        while ((len = imageStream.read(b, 0, 1024)) != -1) {
	            this.getResponse().getOutputStream().write(b, 0, len);
	        }
	    }

}
