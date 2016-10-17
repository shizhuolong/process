package org.apdplat.portal.channelSubsidyPay.action;

import java.util.HashMap;
import java.util.Map;

import org.apache.struts2.convention.annotation.Namespace;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.portal.channelSubsidyPay.service.ChannelSubsidyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

/**
 * 渠道补贴录入
 * @author lyz
 */
@SuppressWarnings("serial")
@Controller
@Namespace("/channelSubsidy")
@Scope("prototype")
public class ChannelSubsidyAction extends BaseAction{
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	@Autowired
	private ChannelSubsidyService service;
	
	private Map<String, String> params;
	
	public Map<String, String> getParams() {
		return params;
	}

	public void setParams(Map<String, String> params) {
		this.params = params;
	}
	/**
	 * 增加
	 */
	public void addSubsidy(){
		User user = UserHolder.getCurrentLoginUser();
		params.put("userName", user.getUsername());
		Map<String,Object> result = new HashMap<String,Object>();
		try{
			service.addSubsidy(params);
			result.put("ok", true);
			this.reponseJson(result);
		}catch(Exception e){
			logger.error(e.getMessage());
			result.put("ok", false);
			this.reponseJson(result);
		}
	}
	/**
	 * 删除
	 */
	public void deleteSubsidy(){
		Map<String,Object> result = new HashMap<String,Object>();
		try{
			service.deleteSubsidy(params);
			result.put("ok", true);
			this.reponseJson(result);
		}catch(Exception e){
			logger.error(e.getMessage());
			result.put("ok", false);
			this.reponseJson(result);
		}
	}
	/**
	 * 查询
	 * @param params
	 * @return
	 */
	public void listSubsidy(){
		User user = UserHolder.getCurrentLoginUser();
		params.put("userName", user.getUsername());
		params.put("level", user.getOrg().getOrgLevel());
		Object result=service.listSubsidy(params);
		this.reponseJson(result);  
	}
	/**
	 * 更新
	 */
	public void updateSubsidy(){
		User user = UserHolder.getCurrentLoginUser();
		params.put("userName", user.getUsername());
		Map<String,Object> result = new HashMap<String,Object>();
		try{
			service.updateSubsidy(params);
			result.put("ok", true);
			this.reponseJson(result);
		}catch(Exception e){
			logger.error(e.getMessage());
			result.put("ok", false);
			this.reponseJson(result);
		}
	}
	
	/**
	 * 验证渠道编码，本地市下是否存在，同时带出渠道名称
	 * @param params
	 * @return
	 * @throws Exception 
	 */
	public void checkCode(){
		User user = UserHolder.getCurrentLoginUser();
		params.put("userName", user.getUsername());
		params.put("level", user.getOrg().getOrgLevel());
		Map<String,Object> result = new HashMap<String,Object>();
		try{
			Map<String,String> r=service.checkCode(params);
			if(r!=null){
				result.putAll(r);
			}else{
				throw new Exception("");
			}
			result.put("ok", true);
			this.reponseJson(result);
		}catch(Exception e){
			logger.error(e.getMessage());
			result.put("ok", false);
			this.reponseJson(result);
		}
	}
	public void existCode(){
		Map<String,Object> result = new HashMap<String,Object>();
		try{
			Map<String,String> r=service.existCode(params);
			if(r!=null&&r.get("HQ_CHAN_CODE")!=null){
				result.put("ok", true);
			}else{
				result.put("ok", false);
			}
			this.reponseJson(result);
		}catch(Exception e){
			logger.error(e.getMessage());
			result.put("ok", false);
			this.reponseJson(result);
		}
	}
}
