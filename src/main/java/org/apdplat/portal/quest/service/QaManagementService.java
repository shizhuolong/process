package org.apdplat.portal.quest.service;

import java.util.List;
import java.util.Map;

import org.apdplat.portal.quest.dao.QaManagementDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class QaManagementService {
	@Autowired
	private QaManagementDao dao;

	/**
	 * 查询问题列表
	 * @return
	 */
	public List<Map<String, Object>> qaList() {
		return dao.qaList();
	}

	/**
	 * 问题新增
	 * @param params
	 * @return
	 */
	public int addQuest(Map<String, Object> params) {
		return dao.addQuest(params);
	}

	/**
	 * 新增回复
	 * @param params
	 * @return
	 */
	public int answerQuest(Map<String, Object> params) {
		return dao.answerQuest(params);
	}

	/**
	 * 问题回复列表
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> answerDetail(Map<String, Object> params) {
		return dao.answerDetail(params);
	}

	/**
	 * 新增常见问题
	 * @param map
	 * @return
	 */
	public int addCommonQuest(Map<String, Object> params) {
		
		return dao.addCommonQuest(params);
	}

	/**
	 * 查询常见问题
	 * @param params
	 * @return
	 */
	public List<Map<String, Object>> commonQuestList() {
		return dao.commonQuestList();
	}

}
