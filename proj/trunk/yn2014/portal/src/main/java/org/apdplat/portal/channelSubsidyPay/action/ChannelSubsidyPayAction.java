package org.apdplat.portal.channelSubsidyPay.action;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.exception.BusiException;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.portal.channelSubsidyPay.RequestResult;
import org.apdplat.portal.channelSubsidyPay.service.ChannelSubsidyPayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

/**
 * 渠道补贴审批
 * @author lyz
 */
@SuppressWarnings("serial")
@Controller
@Namespace("/channelSubsidyPay")
@Scope("prototype")
@Results({
	@Result(name="index", location="/portal/socialChannels/jsp/channel_subsidy_pay_approve.jsp")
})
public class ChannelSubsidyPayAction extends BaseAction{
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	@Autowired
	private ChannelSubsidyPayService channelSubsidyPayService;
	
	private Map<String, String> resultMap;
	public Map<String, String> getResultMap() {
		return resultMap;
	}

	public void setResultMap(Map<String, String> resultMap) {
		this.resultMap = resultMap;
	}

	@Autowired
	public String index() {
		return "index";
	}
	
	/**
	 * 自动生成佣金管理员代办工单
	 * 
	 */
	public void createWorkOrder() {
		RequestResult info=new RequestResult();
		try {
			String title = request.getParameter("title");
			String dealDate = request.getParameter("dealDate");
			
			if(StringUtils.isBlank(title)) {
				throw new BusiException("工单主题不能为空！");
			}
			channelSubsidyPayService.doSendOrder(dealDate,title);
			info.setOk(true);
		} catch (BusiException e) {
			logger.error(e.getMessage(), e);
			info.setOk(false);
			info.setMsg(e.getMessage());
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			info.setOk(false);
			info.setMsg("工单提交审批失败！");
		}
		this.reponseJson(info);
		
	}
	/**
	 * 通过工单编号查询成本预算数据
	 */
	public void listByWorkNo() {
		try {
			String businessKey = request.getParameter("businessKey");
			String channelCode = request.getParameter("channelCode");
			if(businessKey == null || "".equals(businessKey)) {
				throw new BusiException("工单编号不空，查询数据失败！");
			}
			if(channelCode != null && !"".equals(channelCode.trim())) {
				resultMap.put("channelCode",channelCode);
			}
			resultMap.put("businessKey", businessKey);
			Object result = channelSubsidyPayService.listByWorkNo(resultMap);
			this.reponseJson(result);
		} catch(BusiException e) {
			logger.error(e.getMessage(), e);
			outJsonPlainString(response,"{\"msg\":\""+e.getMessage()+"\"}");
		}catch (Exception e) {
			logger.error(e.getMessage(), e);
			logger.error("查询数据失败！",e);
			outJsonPlainString(response,"{\"msg\":\"查询数据失败\"}");
		}
	}
	
	public void updateJf() {
		try {
			double isJf=Double.parseDouble(request.getParameter("isJf"));
			String hqCode=request.getParameter("hqCode");
			String businessKey = request.getParameter("businessKey");
			Map<String,Object> m=new HashMap<String,Object>();
			m.put("isJf",isJf);
			m.put("hqCode",hqCode);
			m.put("businessKey",businessKey);
			channelSubsidyPayService.updateJf(m);
			outJsonPlainString(response,"{\"msg\":\"修改成功\"}");
		} catch (Exception e) {
			e.printStackTrace();
			outJsonPlainString(response,"{\"msg\":\"修改失败\"}");
		}
	}
}
