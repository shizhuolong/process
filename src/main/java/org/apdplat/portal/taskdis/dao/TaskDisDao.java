package org.apdplat.portal.taskdis.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

public interface TaskDisDao {

	/**
	 * 查询未分配列表
	 * @param params
	 * @return
	 */
	public PageList<Map<String, Object>> undisList(Map<String, String> params);
	
	/**
	 * 查寻待分配人员
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> getTeamByParentId(@Param("pUserId") String pUserId);
	
}
