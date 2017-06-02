package org.apdplat.portal.taskdis.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.portal.taskdis.dao.TaskDisDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

@Service
public class TaskDisService {
	
	@Autowired
	private TaskDisDao taskDisDao;
	
	public Object undisList(Map<String, String> params) {
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows = taskDisDao.undisList(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}
	
	public List<Map<String, Object>> getTeamByParentId(String userId){
		List<Map<String, Object>> team=taskDisDao.getTeamByParentId(userId);
		return team;
	}
	
}
