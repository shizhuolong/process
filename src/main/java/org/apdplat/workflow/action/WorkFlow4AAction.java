package org.apdplat.workflow.action;

import org.apache.struts2.convention.annotation.Namespace;
import org.apdplat.platform.util.ResultInfo;
import org.apdplat.workflow.common.BaseAction;
import org.apdplat.workflow.service.TaskTo4AService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;



/**
 *	流程同步云门户控制器
 * @author suyi
 *
 */
@Controller
@Namespace("/workflow_4a")
public class WorkFlow4AAction extends BaseAction{
	
	private static final long serialVersionUID = 6693278193051285904L;
	private static final Logger logger = LoggerFactory.getLogger(ApproverHandlerAction.class);
	/**
	 * 在云门户删除代办
	 */
	public void delete() {
		
		ResultInfo resultInfo = new ResultInfo();
		try{
			TaskTo4AService.handDeleteOrderTo4A(this.getJobId(), pendingCode, pendingSource, pendingTitle, suemail, email);
			resultInfo.setCode(ResultInfo._CODE_OK_);
			resultInfo.setMsg("成功!");
		}catch(Exception e){
			resultInfo.setCode(ResultInfo._CODE_FAIL_);
			resultInfo.setMsg("失败！");
		}
		this.reponseJson(resultInfo);
	}
	/**
	 * 在云门户将代办更新为已办
	 */
	public void update() {
		
		ResultInfo resultInfo = new ResultInfo();
		try{
			TaskTo4AService.handUpdateOrderTo4A(this.getJobId(), pendingCode, pendingSource, pendingTitle, suemail, email);
			resultInfo.setCode(ResultInfo._CODE_OK_);
			resultInfo.setMsg("成功!");
		}catch(Exception e){
			resultInfo.setCode(ResultInfo._CODE_FAIL_);
			resultInfo.setMsg("失败！");
		}
		this.reponseJson(resultInfo);
	}
	/******************************************************************/
	public String getJobId() {
		if(null==this.pendingCode)
			return null;
		return this.pendingCode.substring(0,this.pendingCode.lastIndexOf("-"));
	}
	
	public String getPendingCode() {
		return pendingCode;
	}
	public void setPendingCode(String pendingCode) {
		this.pendingCode = pendingCode;
	}
	public String getPendingSource() {
		return pendingSource;
	}
	public void setPendingSource(String pendingSource) {
		this.pendingSource = pendingSource;
	}
	public String getPendingTitle() {
		return pendingTitle;
	}
	public void setPendingTitle(String pendingTitle) {
		this.pendingTitle = pendingTitle;
	}
	public String getSuemail() {
		return suemail;
	}
	public void setSuemail(String suemail) {
		this.suemail = suemail;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	String pendingCode;//="YN-2016110410495-5857";
	String pendingSource;//="徐开红";//上一步处理人姓名
	String pendingTitle;//="【曲靖市分公司】我的测试工单";
	String suemail;//="kaihongxu";//上一步处理人邮箱前缀
	String email;//="guiliangwang";//当前处理人邮箱前缀
	
	
}