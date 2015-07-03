package org.apdplat.workflow.action;

import org.apache.commons.lang3.StringUtils;
import org.apache.struts2.convention.annotation.Namespace;
import org.apdplat.platform.exception.BusiException;
import org.apdplat.platform.util.ResultInfo;
import org.apdplat.workflow.common.BaseAction;
import org.apdplat.workflow.service.LeaveHandlerService;
import org.apdplat.workflow.service.WorkOrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
@Namespace("/leave")
public class LeaveHandlerAction extends BaseAction {

	private static final long serialVersionUID = 1L;
	private static final Logger logger = LoggerFactory.getLogger(ApproverHandlerAction.class);
	
	@Autowired
	private WorkOrderService workOrderService;
	@Autowired
	private LeaveHandlerService leaveHandlerService;
	
	public void submitLeaveOrder() {
		
		ResultInfo resultInfo = null;
		try{
			String title = this.getRequest().getParameter("title");
			String nextDealer = this.getRequest().getParameter("nextDealer");
			if(StringUtils.isBlank(title)) {
				throw new BusiException("请填写请示主题！");
			}
			if(StringUtils.isBlank(nextDealer)) {
				throw new BusiException("请选择下一步审批人！");
			}
			resultInfo = leaveHandlerService.submitLeaveOrder(title, nextDealer);
		}catch(BusiException e) {
			logger.error(e.getMessage(),e);
			resultInfo = new ResultInfo();
			resultInfo.setCode(ResultInfo._CODE_FAIL_);
			resultInfo.setMsg(e.getMessage());
		}catch(Exception e) {
			logger.error(e.getMessage(),e);
			resultInfo = new ResultInfo();
			resultInfo.setCode(ResultInfo._CODE_FAIL_);
			resultInfo.setMsg(e.getMessage());
		}
		this.reponseJson(resultInfo);
	}

}
