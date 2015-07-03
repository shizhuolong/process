package org.apdplat.portal.docManagement.dao;

import java.util.List;
import java.util.Map;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

public interface DocDao {
	/**
	 * 获取文件列表
	 * @param params
	 * @return
	 */
	public PageList<Map<String, Object>> listDocs(Map<String, String> params);
	/**
	 * 新增文件
	 * @param params
	 * @return
	 */
	public int addDoc(Map<String, Object> params);
	/**
	 * 更新文件
	 * @param params
	 * @return
	 */
    public int updateDoc(Map<String, Object> params);
    /**
	 * 删除文件
	 * @param params
	 * @return
	 */
    public int delDoc(String id);
    /**
	 * 根据文件ID获取文件信息
	 * @param params
	 * @return
	 */
    public List<Map<String, Object>> getDocById(String id);
}
