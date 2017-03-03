package org.apdplat.workflow.dao;

import java.util.List;
import java.util.Map;

public interface ApproverHandlerDao {
	
	public List<Map<String,String>> qryTaskApproverTreeData(Map<String,String> var);
	
	public List<Map<String,String>> qryTaskApprover(Map<String,String> var);
	
	public List<Map<String,String>> qryMyDepartLeader(Map<String,String> var);
	
	public Map<String,Object> getUserTaskProperty(String taskId);
}
