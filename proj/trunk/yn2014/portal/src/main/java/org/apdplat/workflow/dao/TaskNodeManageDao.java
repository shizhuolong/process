package org.apdplat.workflow.dao;

import java.util.List;
import java.util.Map;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

public interface TaskNodeManageDao {
	
	public PageList<Map<String, Object>> queryTaskNodeList(Map<String, String> params);
	
	public List<Map<String,Object>> queryApproversOfTaskNode(String taskId);
	
	public List<Map<String,Object>> queryDepartmentTree(Map<String, String> params);
	
	public void addApproversOfTaskNode(Map<String,String> params);
	
	public void deleteApproversOfTaskNode(Map<String,String> params);

}
