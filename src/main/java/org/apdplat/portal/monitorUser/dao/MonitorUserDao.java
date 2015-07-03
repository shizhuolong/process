package org.apdplat.portal.monitorUser.dao;

import java.util.Map;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

public interface MonitorUserDao {
	/**
	 * 获取监控用户列表
	 * @param params
	 * @return
	 */
	public PageList<Map<String, Object>> list(Map<String, String> params);
	/**
	 * 新增
	 * @param params
	 * @return
	 */
	public int add(Map<String, String> params);
	/**
	 * 更新
	 * @param params
	 * @return
	 */
    public int update(Map<String, String> params);
    /**
	 * 删除
	 * @param params
	 * @return
	 */
    public int del(String id);
}
