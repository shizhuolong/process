package org.apdplat.workflow.service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.activiti.engine.runtime.ProcessInstance;
import org.apdplat.wgreport.common.SpringManager;
import org.apdplat.workflow.WorkflowConstant;
import org.apdplat.workflow.vo.WorkOrderVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ynunicom.sso.AppConstant;
import com.ynunicom.sso.dto.PendingEntity;
import com.ynunicom.sso.service.SsoTaskService;

@Service
public class TaskTo4AService {
	@Autowired
	SsoTaskService taskService; 

	// 获取待办数据并同步到云门户
	public void sendNewOrderTo4A(WorkOrderVo vo) {
		List<PendingEntity> list = new ArrayList<PendingEntity>();
		SimpleDateFormat format_4a = new SimpleDateFormat("yyyyMMddHHmmss");

		PendingEntity pending = new PendingEntity();
		String taskId = String.valueOf(vo.getTaskId());
		pending.setPendingCode(taskId);// 流程任务id
		pending.setPendingCityCode("yn");// 省分代码
		pending.setPendingDate(format_4a.format(new Date()));// 待办产生时间
		pending.setPendingLevel(0);// 待办等级
		pending.setPendingNote(AppConstant.pendingNote);// 待办所属系统简称
		pending.setPendingSource(vo.getStartManName());// 待办信息来源(上一步处理人的姓名)
		pending.setPendingStatus(PendingEntity.preStatus);// 待办状态
		pending.setPendingTitle(vo.getTitle());// 待办标题

		pending.setPendingURL(AppConstant.URL +"?jobId=" + taskId);// 待办信息URL

		// 获取待办人邮箱
		String sql = "select u.email email from portal.apdp_user u where u.id=" + vo.getAssignee();
		List<Map> emailMap = SpringManager.getFindDao().find(sql);
		Map<String, Object> eMap = emailMap.get(0);
		String email = "";
		if (eMap.get("email") != null && !"".equals(eMap.get("email"))) {
			email = eMap.get("email").toString();
			if (email.indexOf("@") != -1) {
				email = email.substring(0, email.indexOf("@"));
			}
		}
		pending.setPendingUserID(email);// 待办人UserID(统一邮箱前缀)

		String suserIdSql = "select u.email email from portal.apdp_user u where u.id=" + vo.getStartMan();
		List<Map> suserIdMap = SpringManager.getFindDao().find(suserIdSql);
		Map suMap = suserIdMap.get(0);
		String suemail = "";
		if (suMap.get("email") != null && !"".equals(suMap.get("email"))) {
			suemail = suMap.get("email").toString();
			if (suemail.indexOf("@") != -1) {
				suemail = suemail.substring(0, suemail.indexOf("@"));
			}
		}
		pending.setPendingSourceUserID(suemail);// 待办信息上一步处理人邮件前缀

		System.out.println(pending + "**************************************");
		list.add(pending);

		if ((email != null && !"".equals(email)) || (suemail != null && !"".equals(suemail)) || !"".equals(taskId)
				|| (email.endsWith("@chinaunicom.cn") == true && suemail.endsWith("@chinaunicom.cn") == true)) {
			String result4a = taskService.addPending(list);
			int r = result4a.indexOf("100");
			if (r == -1) {
				System.out.println("提交工单并同步云门户待办出错，更新码(" + result4a + ")");
			}
			// 将数据插入到待办稽核表中
			try {
				String psql = "insert into portal.order_pending_view values('" + taskId + "','" + vo.getTitle() + "','"
						+ PendingEntity.preStatus + "',sysdate)";
				SpringManager.getUpdateDao().update(psql);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

	// 获取待办数据并同步到云门户
	public void sendDoingOrderTo4A(WorkOrderVo vo) {
		List<PendingEntity> list = new ArrayList<PendingEntity>();
		SimpleDateFormat format_4a = new SimpleDateFormat("yyyyMMddHHmmss");

		PendingEntity pending = new PendingEntity();
		String taskId = String.valueOf(vo.getBusinessKey());
		pending.setPendingCode(taskId);// 流程任务id
		pending.setPendingCityCode("yn");// 省分代码
		pending.setPendingDate(format_4a.format(new Date()));// 待办产生时间
		pending.setPendingLevel(0);// 待办等级
		pending.setPendingNote(AppConstant.pendingNote);// 待办所属系统简称
		pending.setPendingSource(vo.getStartManName());// 待办信息来源(上一步处理人的姓名)
		pending.setPendingStatus(PendingEntity.afterStatus);// 待办状态
		pending.setPendingTitle(vo.getTitle());// 待办标题
		pending.setLastUpdateDate(format_4a.format(new Date()));
		pending.setPendingURL(AppConstant.URL +"?jobId=" + taskId);// 待办信息URL

		// 获取待办人邮箱
		String sql = "select u.email email from portal.apdp_user u where u.id=" + vo.getNextDealer();
		List<Map> emailMap = SpringManager.getFindDao().find(sql);
		Map<String, Object> eMap = emailMap.get(0);
		String email = "";
		if (eMap.get("email") != null && !"".equals(eMap.get("email"))) {
			email = eMap.get("email").toString();
			if (email.indexOf("@") != -1) {
				email = email.substring(0, email.indexOf("@"));
			}
		}
		pending.setPendingUserID(email);// 待办人UserID(统一邮箱前缀)

		String suserIdSql = "select u.email email from portal.apdp_user u where u.id=" + vo.getStartMan();
		List<Map> suserIdMap = SpringManager.getFindDao().find(suserIdSql);
		Map suMap = suserIdMap.get(0);
		String suemail = "";
		if (suMap.get("email") != null && !"".equals(suMap.get("email"))) {
			suemail = suMap.get("email").toString();
			if (suemail.indexOf("@") != -1) {
				suemail = suemail.substring(0, suemail.indexOf("@"));
			}
		}
		pending.setPendingSourceUserID(suemail);// 待办信息上一步处理人邮件前缀

		System.out.println(pending + "**************************************");
		list.add(pending);

		if ((email != null && !"".equals(email)) || (suemail != null && !"".equals(suemail)) || !"".equals(taskId)
				|| (email.endsWith("@chinaunicom.cn") == true && suemail.endsWith("@chinaunicom.cn") == true)) {
			String result4a = taskService.updatePendingStatus(list);
			int r = result4a.indexOf("100");
			if (r == -1) {
				System.out.println("提交工单并同步云门户待办出错，更新码(" + result4a + ")");
			}
			// 将数据插入到待办稽核表中
			try {
				String psql = "update portal.order_pending_view set STATUS='" + PendingEntity.afterStatus
						+ "' where PENDINGCODE='" + taskId + "'";
				SpringManager.getUpdateDao().update(psql);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

	// 获取待办数据并同步到云门户
	public void sendDoneOrderTo4A(WorkOrderVo vo) {
		List<PendingEntity> list = new ArrayList<PendingEntity>();
		SimpleDateFormat format_4a = new SimpleDateFormat("yyyyMMddHHmmss");

		PendingEntity pending = new PendingEntity();
		String taskId = String.valueOf(vo.getTaskId());
		pending.setPendingCode(taskId);// 流程任务id
		pending.setPendingCityCode("yn");// 省分代码
		pending.setPendingDate(format_4a.format(new Date()));// 待办产生时间
		pending.setPendingLevel(0);// 待办等级
		pending.setPendingNote(AppConstant.pendingNote);// 待办所属系统简称
		pending.setPendingSource(vo.getStartManName());// 待办信息来源(上一步处理人的姓名)
		pending.setPendingStatus(PendingEntity.deleteStatus);// 待办状态
		pending.setPendingTitle(vo.getTitle());// 待办标题

		pending.setPendingURL(AppConstant.URL +"?jobId=" + taskId);// 待办信息URL

		// 获取待办人邮箱
		String sql = "select u.email email from portal.apdp_user u where u.id=" + vo.getAssignee();
		List<Map> emailMap = SpringManager.getFindDao().find(sql);
		Map<String, Object> eMap = emailMap.get(0);
		String email = "";
		if (eMap.get("email") != null && !"".equals(eMap.get("email"))) {
			email = eMap.get("email").toString();
			if (email.indexOf("@") != -1) {
				email = email.substring(0, email.indexOf("@"));
			}
		}
		pending.setPendingUserID(email);// 待办人UserID(统一邮箱前缀)

		String suserIdSql = "select u.email email from portal.apdp_user u where u.id=" + vo.getStartMan();
		List<Map> suserIdMap = SpringManager.getFindDao().find(suserIdSql);
		Map suMap = suserIdMap.get(0);
		String suemail = "";
		if (suMap.get("email") != null && !"".equals(suMap.get("email"))) {
			suemail = suMap.get("email").toString();
			if (suemail.indexOf("@") != -1) {
				suemail = suemail.substring(0, suemail.indexOf("@"));
			}
		}
		pending.setPendingSourceUserID(suemail);// 待办信息上一步处理人邮件前缀

		System.out.println(pending + "**************************************");
		list.add(pending);

		if ((email != null && !"".equals(email)) || (suemail != null && !"".equals(suemail)) || !"".equals(taskId)
				|| (email.endsWith("@chinaunicom.cn") == true && suemail.endsWith("@chinaunicom.cn") == true)) {
			String result4a = taskService.updatePendingStatus(list);
			int r = result4a.indexOf("100");
			if (r == -1) {
				System.out.println("提交工单并同步云门户待办出错，更新码(" + result4a + ")");
			}
			// 将数据插入到待办稽核表中
			try {
				String psql = "update portal.order_pending_view set STATUS='" + PendingEntity.deleteStatus
						+ "' where PENDINGCODE='" + taskId + "'";
				SpringManager.getUpdateDao().update(psql);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}
}
