package org.apdplat.portal.channelManagement.action;

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
	
	/*public void update() {
		Map<String, String> m = new HashMap<String, String>();
		String hq_chan_code = request.getParameter("hq_chan_code").trim();
		String hq_chan_name = request.getParameter("hq_chan_name");
		String name = request.getParameter("name").trim();
		String phone = request.getParameter("phone").trim();
		String deal_date = request.getParameter("deal_date");
		String people_type=request.getParameter("people_type");
		String nameid=request.getParameter("nameid");
		
		m.put("nameid", nameid);
		m.put("hq_chan_code", hq_chan_code);
		m.put("hq_chan_name", hq_chan_name);
		m.put("name", name);
		m.put("phone", phone);
		m.put("people_type", people_type);
		m.put("deal_date", deal_date);
		m.put("username", request.getParameter("username"));
		try {
			service.update(m);
			this.reponseJson("修改成功");
		} catch (Exception e) {
			e.printStackTrace();
			this.reponseJson("修改失败");
		}
	}
*/
	public Map<String, String> getResultMap() {
		return resultMap;
	}

	public void setResultMap(Map<String, String> resultMap) {
		this.resultMap = resultMap;
	}
	
}
