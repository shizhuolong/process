package org.apdplat.message;

import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.log.APDPlatLogger;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;


/**
 * 
 * @author lyz
 *
 */
@SuppressWarnings("serial")
@Controller
@Scope("prototype")
public class MessageAction extends BaseAction {

	private final APDPlatLogger logger = new APDPlatLogger(getClass());
		
	private String mobilePhone;
	private String mobileContent;
	
	public String getMobilePhone() {
		return mobilePhone;
	}

	public void setMobilePhone(String mobilePhone) {
		this.mobilePhone = mobilePhone;
	}

	public String getMobileContent() {
		return mobileContent;
	}

	public void setMobileContent(String mobileContent) {
		this.mobileContent = mobileContent;
	}

	public void sendMsg() {
		logger.debug("发送信息：电话"+mobilePhone+","+mobileContent);
		UnicomService us = UnicomService.getInstance();
		this.reponseJson(us.sendSMS(mobilePhone,mobileContent));
	}
	
}
