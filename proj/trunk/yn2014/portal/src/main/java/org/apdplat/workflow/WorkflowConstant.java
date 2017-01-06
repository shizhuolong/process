package org.apdplat.workflow;

public class WorkflowConstant {
	
	public static final String TASK_TYPE_PRO = "1";
	public static final String TASK_TYPE_COM = "2";
	public static final String TASK_TYPE_DEP = "3";
	public static final String PROVINCIALAGENCY = "7";
	
	public static final String DEPART_LEADER_TASK_ID ="departLeaderAudit";
	
	public static final String PASS_OR_NOT_ALL ="passOrNotAll";
	public static final String PASS_OR_NOT ="passOrNot";
	public static final String PASS_COUNT ="passCount";
	public static final String CAN_END_FLAG ="canEndFlag";
	public static final String PROJECT_PLAN_AUDIT_APPLY = "projectPlanAuditApply"; //活动创建审批
	public static final String PROCESS_FEED_BACK_APPLY = "processFeedBackApply"; //实施反馈审批
	public static final String PROCESS_FEED_BACK_APPLY_BACK = "processFeedBackApplyBack"; //实施反馈打回
	public static final Boolean TASK_STATUS_END = true ;
	public static final Boolean TASK_STATUS_NOT_END = false ;
	public static final String APPROVE_DESC ="approveDesc"; //审批意见
	public static final String EXCEED_FLAG ="exceed";
	public static final String NEED_PAY ="needPay";
	
	public static final String  WAIT = "wait"; //待办标志
	public static final String  DOING = "doing"; //再办标志
	public static final String  DONE = "done"; //结伴标志
	public static final String  NEXT_ROUTER="nextRouter"; //提交任务选择的路由
	public static final String  NEXT_DEALER="nextDealer"; //下一步任务处理人
	public static final String BUSINESS_KEY="businessKey";//业务主键
	public static final String DISPLAY_PID="displayPid";//业务主键
	
	public static final String ADMIN = "admin"; //超级管理员，用于查看所有的工单
	
	public static String getSmsContent(String userName,String title) {
		
		StringBuffer sb = new StringBuffer();
		sb.append("您有一个来自")
		.append(userName).append("标题为《").append(title).append("》的工单等待您处理！--广东联通马上富");
		return sb.toString();
	}
}
