package org.apdplat.portal.quest.action;


import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.portal.quest.service.QaManagementService;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * QA管理
 * @author only
 *
 */
@SuppressWarnings("serial")
public class QaManagementAction extends BaseAction {
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	@Autowired
	private QaManagementService service;
	private String questName;//问题名称
	private String questCountent;//问题描述
	private String answerContent;//问题答案
	private String askTime;//提问日期
	private String askName;//提问人
	private String answerName;//回复人姓名
	private String answerTime;//回复时间
	private String fdId;
	private String questType;//0常见问题，1用户提问问题，2问题回复
	
	/**
	 * 常见问题查询
	 */
	public void commonQuestList(){
		try {
			List<Map<String,Object>> list  = service.commonQuestList();
			this.reponseJson(list);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("查询常见问题失败",e);
			outJsonPlainString(response,"{\"msg\":\"查询常见问题失败\"}");
		}
		
				
	}
	/**
	 * 新增常见问题
	 */
	public void addCommonQuest(){
		try {
			String id = UUID.randomUUID().toString();
			Map<String,Object> map = new HashMap<String,Object>();
			map.put("id", id);
			map.put("questName", questName);
			map.put("questCountent", questCountent);
			map.put("answerContent", answerContent);
			/*map.put("askTime", askTime);
			map.put("answerTime", answerTime);*/
			map.put("askName", askName);
			map.put("answerName", answerName);
			map.put("fdId", fdId);
			map.put("questType", questType);
			System.out.println(map);
			int num  = service.addCommonQuest(map);
			this.reponseJson(num);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("新增常见问题失败",e);
			outJsonPlainString(response,"{\"msg\":\"新增常见问题失败\"}");
		}
	}
	/**
	 * 查询问题列表
	 */
	public void qaList(){
		List<Map<String,Object>> list = service.qaList();
		this.reponseJson(list);
 	}
	/**
	 * 问题回复列表
	 */
	public void  answerDetail(){
		try {
		Map<String,Object> params = new HashMap<String,Object>();
		params.put("fdId", fdId);
		List<Map<String,Object>> list=service.answerDetail(params);
		this.reponseJson(list);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("查询问题回复失败",e);
			outJsonPlainString(response,"{\"msg\":\"查询问题回复失败\"}");
		}
	}
	
	/**
	 * 新增回复
	 */
	public void answerQuest(){
		try {
			String id = UUID.randomUUID().toString();
			Map<String,Object> params = new HashMap<String,Object>();
			params.put("id", id);
			params.put("askName", askName);
			params.put("answerName", answerName);
			/*params.put("answerTime", answerTime);*/
			params.put("answerContent", answerContent);
			params.put("fdId", fdId);
			params.put("questType", questType);
			int num = service.answerQuest(params);
			this.reponseJson(num);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("新增问题失败",e);
			outJsonPlainString(response,"{\"msg\":\"新增问题失败\"}");
		}
	}
	
	/**
	 * 问题新增
	 */
	public void addQuset(){
		try {
			String id = UUID.randomUUID().toString();
			Map<String,Object> map = new HashMap<String, Object>();
			map.put("id", id);
			map.put("questName", questName);
			map.put("questCountent", questCountent);
			/*map.put("askTime", askTime);*/
			map.put("askName", askName);
			map.put("fdId", fdId);
			map.put("questType", questType);
			System.out.println(map);
			int num = service.addQuest(map);
			this.reponseJson(num);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("新增问题失败",e);
			outJsonPlainString(response,"{\"msg\":\"新增问题失败\"}");
		}
		
	}
	public String getQuestName() {
		return questName;
	}
	public void setQuestName(String questName) {
		this.questName = questName;
	}
	public String getAnswerContent() {
		return answerContent;
	}
	public void setAnswerContent(String answerContent) {
		this.answerContent = answerContent;
	}
	
	public String getQuestCountent() {
		return questCountent;
	}
	public void setQuestCountent(String questCountent) {
		this.questCountent = questCountent;
	}
	public String getAskTime() {
		return askTime;
	}
	public void setAskTime(String askTime) {
		this.askTime = askTime;
	}
	public String getAskName() {
		return askName;
	}
	public void setAskName(String askName) {
		this.askName = askName;
	}

	public String getAnswerName() {
		return answerName;
	}

	public void setAnswerName(String answerName) {
		this.answerName = answerName;
	}

	public String getAnswerTime() {
		return answerTime;
	}

	public void setAnswerTime(String answerTime) {
		this.answerTime = answerTime;
	}

	public String getFdId() {
		return fdId;
	}

	public void setFdId(String fdId) {
		this.fdId = fdId;
	}
	public String getQuestType() {
		return questType;
	}
	public void setQuestType(String questType) {
		this.questType = questType;
	}
	
	
}
