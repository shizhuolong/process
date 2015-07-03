package org.apdplat.workflow.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.portal.common.Constant;
import org.apdplat.workflow.dao.TaskNodeManageDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

@Service
public class TaskNodeManageService {
	
	@Autowired
	private TaskNodeManageDao taskNodeManageDao;
	
	/**
	 * 分页查询所有审批节点列表信息
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public Object queryTaskNodeList(Map<String, String> params){
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows = taskNodeManageDao.queryTaskNodeList(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}
	
	/**
	 * 查询节点taskId已配置的部门人员信息的id用于ztree中节点的回显判断
	 * @param taskId 节点ID
	 * @return
	 */
	public List<Map<String,Object>> queryApproversOfTaskNode(String taskId) {
		
		return taskNodeManageDao.queryApproversOfTaskNode(taskId);
	}
	
	/**
	 * 查询部门人员的树形结构
	 * @param level
	 * @return
	 */
	public List<Map<String,Object>> queryDepartmentTree(String id,int level) {
		
		User user = UserHolder.getCurrentLoginUser();
		String orgLevel = user.getOrg().getOrgLevel();
		Map<String,String> params = new HashMap<String,String>();
		params.put("level", Integer.toString(level));
		params.put("treeId",id);
		if(Constant.REGION_LEVEL.equals(orgLevel)) {
			params.put("oaComId", user.getOaComId());
		}
		return taskNodeManageDao.queryDepartmentTree(params);
	}
	
	/**
	 * 修改节点的审批人员
	 * @param taskId 节点ID
	 * @param uncheck 待删除人员
	 * @param alcheck 待新增人员
	 */
	@Transactional
	public void configureApproversOfTaskNode(String taskId,String uncheck,String alcheck) {
		
		//新增
		if(StringUtils.isNotBlank(alcheck)) {
			String []arr = alcheck.split(",");
			for(int i=0,len=arr.length;i<len;i++) {
				Map<String,String> map = new HashMap<String,String>();
				map.put("taskId", taskId);
				map.put("userId", arr[i]);
				taskNodeManageDao.addApproversOfTaskNode(map);
			}
		}
		
		//删除
		if(StringUtils.isNotBlank(uncheck)) {
			String []arr = uncheck.split(",");
			for(int i=0,len=arr.length;i<len;i++) {
				Map<String,String> map = new HashMap<String,String>();
				map.put("taskId", taskId);
				map.put("userId", arr[i]);
				taskNodeManageDao.deleteApproversOfTaskNode(map);
			}
		}
	}
}
