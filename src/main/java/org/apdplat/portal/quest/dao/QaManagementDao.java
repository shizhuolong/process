package org.apdplat.portal.quest.dao;

import java.util.List;
import java.util.Map;


public interface QaManagementDao {

	/**
	 * 查询问题列表
	 * @return
	 */
	List<Map<String, Object>> qaList();

	/**
	 * 问题新增
	 * @param params
	 * @return
	 */
	int addQuest(Map<String, Object> params);

	/**
	 * 新增回复
	 * @param params
	 * @return
	 */
	int answerQuest(Map<String, Object> params);

	/**
	 * 问题回复列表
	 * @param params
	 * @return
	 */
	List<Map<String, Object>> answerDetail(Map<String, Object> params);

	/**
	 * 新增常见问题
	 * @param params
	 * @return
	 */
	 int addCommonQuest(Map<String, Object> params);

	/**
	 * 查询常见问题
	 * @param params
	 * @return
	 */
	List<Map<String, Object>> commonQuestList();


}
