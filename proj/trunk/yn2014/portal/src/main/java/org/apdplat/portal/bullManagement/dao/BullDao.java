package org.apdplat.portal.bullManagement.dao;

import java.util.Map;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

public interface BullDao {
	/**
	 * 获取公告列表
	 * @param params
	 * @return
	 */
	public PageList<Map<String, Object>> listBulls(Map<String, String> params);
	/**
	 * 新增公告
	 * @param params
	 * @return
	 */
	public int addBull(Map<String, Object> params);
	/**
	 * 更新公告
	 * @param params
	 * @return
	 */
    public int updateBull(Map<String, Object> params);
    /**
	 * 删除公告
	 * @param params
	 * @return
	 */
    public int delBull(String id);
}
