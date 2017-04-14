package org.apdplat.portal.channelManagement.action;

import java.net.URLDecoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.module.security.model.Org;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.portal.channelManagement.service.BusinessHallInfoService;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * 营业厅固话信息维护
 * 
 * @author shizl
 * 
 */
@SuppressWarnings("serial")
public class BusinessHallInfoAction extends BaseAction {
	 @SuppressWarnings("unused")
	private final APDPlatLogger logger = new APDPlatLogger(getClass());

	@Autowired
	private BusinessHallInfoService service;
	private Map<String, String> resultMap;
	
	public void list() {
		User user = UserHolder.getCurrentLoginUser();
		Org org=user.getOrg();
		resultMap.put("code", org.getCode());
		resultMap.put("orgLevel", org.getOrgLevel());
		Object result = service.list(resultMap);
		this.reponseJson(result);
	}
	
	public String toInfo() {
		String hq_chan_code = request.getParameter("hq_chan_code");
		String deal_date = request.getParameter("deal_date");
		Map<String,String> params=new HashMap<String,String>();
		params.put("hq_chan_code",hq_chan_code);
		params.put("deal_date",deal_date);
		List<Map<String, Object>> list = service.loadDetails(params);
		request.setAttribute("detail",list.get(0));
		return "detail";
	}
	public String toUpdate() {
		String hq_chan_code = request.getParameter("hq_chan_code");
		String deal_date = request.getParameter("deal_date");
		Map<String,String> params=new HashMap<String,String>();
		params.put("hq_chan_code",hq_chan_code);
		params.put("deal_date",deal_date);
		List<Map<String, Object>> list = service.loadDetails(params);
		request.setAttribute("detail",list.get(0));
		return "update";
	}
	
	public void save() {
		try {
			for (String key : resultMap.keySet()) {  
			    String value = resultMap.get(key);  
			    value=URLDecoder.decode(value , "UTF-8");
			    resultMap.put(key, value);
			}  
			service.update(resultMap);
			this.reponseJson("修改成功！");
		} catch (Exception e) {
			e.printStackTrace();
			this.reponseJson("修改失败！");
		}
	}

	public Map<String, String> getResultMap() {
		return resultMap;
	}

	public void setResultMap(Map<String, String> resultMap) {
		this.resultMap = resultMap;
	}
	
}
