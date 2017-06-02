package org.apdplat.portal.taskdis.action;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.util.HashMap;
import java.util.Map;

import org.apache.struts2.convention.annotation.Namespace;
import org.apdplat.module.security.model.Org;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.platform.service.ServiceFacade;
import org.apdplat.platform.util.SpringContextUtils;
import org.apdplat.portal.taskdis.HttpSendMessageUtil;
import org.apdplat.portal.taskdis.OrderUtil;
import org.apdplat.portal.taskdis.model.DisDto;
import org.apdplat.portal.taskdis.service.TaskDisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.lch.report.util.JsonUtil;

@SuppressWarnings("serial")
@Controller
@Namespace("/taskDis")
@Scope("prototype")
public class TaskDisAction extends BaseAction{
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	@Autowired
	private TaskDisService taskDisService;
	private Map<String, String> resultMap;
	
	private String jsonStr;
	
	public String getJsonStr() {
		return jsonStr;
	}
	public void setJsonStr(String jsonStr) {
		this.jsonStr = jsonStr;
	}
	public Map<String, String> getResultMap() {
		return resultMap;
	}
	public void setResultMap(Map<String, String> resultMap) {
		this.resultMap = resultMap;
	}
	/**
	 * 查询未分配列表
	 */
	public void undisList(){
		User user = UserHolder.getCurrentLoginUser();
		resultMap.put("userId",user.getId()+"");
		this.reponseJson(taskDisService.undisList(resultMap));
	}
	/**
	 * 任务分配
	 */
	public void distribute(){
		User user = UserHolder.getCurrentLoginUser();
		Org org = user.getOrg();
		
		Map<String,Object> r=new HashMap<String,Object>();
		logger.info(jsonStr);
		DisDto[] dto=JsonUtil.jsonToBean(jsonStr, new DisDto[]{}.getClass());
		if(dto==null||dto.length==0){
			r.put("ok", false);
			r.put("msg", "分配数据为空！");
			this.reponseJson(r);
			return ;
		}
		
		String batchNo=OrderUtil.randomBatchNo();

		Connection conn = null;
		PreparedStatement pre = null;
		try {
			conn = this.getCon();
			conn.setAutoCommit(false);
			
			String 	sql=" insert into PODS.TAB_ODS_23TO4_TRAD_LIST select sysdate,?,?,?,?,? from dual";
			pre=conn.prepareStatement(sql);
			
			for(DisDto dis:dto){
				pre.setString(1,batchNo);
				pre.setString(2, dis.getSubscriptionId());
				pre.setString(3, dis.getProType());
				pre.setString(4, dis.getUserId());
				pre.setString(5,user.getId()+"");
				pre.addBatch();
			}
			pre.executeBatch();
			
			
			conn.commit();
			
			//短信通知
			sendMsg(dto);
			
			r.put("ok", true);
			r.put("msg", "分配成功");
		} catch (Exception e) {
			e.printStackTrace();
			try{conn.rollback();}catch(Exception ee){}
			
			r.put("ok", false);
			r.put("msg", "分配失败");
		}finally{
			try {
				if(conn!=null)
				conn.setAutoCommit(true);
				conn.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		this.reponseJson(r);
	}
	/**
	 * 查询待分配人员
	 */
	public void getTeam(){
		User user = UserHolder.getCurrentLoginUser();
		this.reponseJson(taskDisService.getTeamByParentId(user.getId()+""));
	}
	
	private void sendMsg(DisDto[] disArray){
		//统计出每个人有多少条任务
		if(null==disArray||disArray.length==0) return ;
		Map<String,Integer> counter=new HashMap<String,Integer>();
		for(int i=0;i<disArray.length;i++){
			String userId=disArray[i].getUserId();
			if(counter.containsKey(userId)){
				counter.put(userId, counter.get(userId)+1);
			}else{
				counter.put(userId, 1);
			}
		}
		
		//对每个用户发送信息
		String proType=disArray[0].getProType();
		String sendUserName=UserHolder.getCurrentLoginUser().getRealName();
		// 您收到【发送人】分配的【3】条【23转4】任务，请登录基层单元系统查看
		ServiceFacade serviceFacade = (ServiceFacade)SpringContextUtils.getBean("serviceFacade");
		for(String userId:counter.keySet()){
			String count=counter.get(userId).toString();
			
			User toUser = serviceFacade.retrieve(User.class, Long.parseLong(userId));
			if(toUser==null) continue;
			String phone=toUser.getPhone();
			
			String sms="您在基层收到"+sendUserName+"分配的"+proType+"任务【"+count+"】条，请登录查看";
			HttpSendMessageUtil.sendMessage(phone, sms);
		}
	}
}
