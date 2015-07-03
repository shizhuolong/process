package org.apdplat.workflow.service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import org.activiti.engine.HistoryService;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.history.HistoricProcessInstance;
import org.activiti.engine.history.HistoricProcessInstanceQuery;
import org.activiti.engine.repository.ProcessDefinition;
import org.apache.commons.lang3.StringUtils;
import org.apdplat.platform.util.Pagination;
import org.apdplat.workflow.WorkflowConstant;
import org.apdplat.workflow.vo.WorkOrderVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @author suyi
 * @date 2015年3月23日
 */
@Service
public class ProcessInstanceService {
	
	@Autowired
	private HistoryService historyService;
	@Autowired
	private RepositoryService repositoryService;
	
	/**
	 * 流程实例监控，查询所所有的流程实例
	 * @param vo
	 * @param runningFlag	
	 * @return
	 */
	public Pagination getTraceProcessInstanceList(WorkOrderVo vo) {
		
		String processInstanceStatus = "";
		HistoricProcessInstanceQuery query = historyService.createHistoricProcessInstanceQuery();
		if(StringUtils.isNotBlank(vo.getTitle())) {
			query.variableValueLike("title","%"+vo.getTitle()+"%");
		}
		if(StringUtils.isNotBlank(vo.getDisplayPid())) {
			query.variableValueLike(WorkflowConstant.DISPLAY_PID, "%"+vo.getDisplayPid()+"%");
		}
		if(null != vo.getCreateTime()) {
        	Calendar c = Calendar.getInstance();  
        	c.setTime(vo.getCreateTime());
        	c.add(c.DATE, 1);
        	query.startedAfter(vo.getCreateTime()).startedBefore(c.getTime());
        }
		if(WorkflowConstant.DOING.equals(vo.getQueryListType())) {
			processInstanceStatus = WorkflowConstant.DOING;
			query.unfinished();
		}else if(WorkflowConstant.DONE.equals(vo.getQueryListType())) {
			processInstanceStatus = WorkflowConstant.DONE;
			query.finished();
		}
		Pagination page =  new Pagination();
		List<WorkOrderVo> resultList = new ArrayList<WorkOrderVo>();
		
		query.includeProcessVariables().orderByProcessInstanceStartTime().desc();
        
        List<HistoricProcessInstance> hisList = query.listPage(vo.getStartIndex(), vo.getPageSize());
        long totalCount = query.count();
		if(hisList!=null && hisList.size()>0){
			for(HistoricProcessInstance t : hisList){
				ProcessDefinition pdf = repositoryService.getProcessDefinition(t.getProcessDefinitionId());
				resultList.add(new WorkOrderVo(t,pdf,processInstanceStatus));
			}
		}
		page.setResult(resultList);
		page.setTotalCount(totalCount);
		page.setPageNo(vo.getPageNo());
		page.setPageSize(vo.getPageSize());
		return page;
	}

}
