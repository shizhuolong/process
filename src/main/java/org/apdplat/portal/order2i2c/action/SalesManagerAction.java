package org.apdplat.portal.order2i2c.action;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;
import org.apdplat.module.security.model.Org;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.portal.order2i2c.service.SalesManagerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

@Controller
@Namespace("/salesManager")
@Scope("prototype")
@Results({
	@Result(name="success", location="/portal/channelManagement/jsp/sales_manager_list.jsp")
})
@SuppressWarnings("serial")
public class SalesManagerAction extends BaseAction {
	 @SuppressWarnings("unused")
	private final APDPlatLogger logger = new APDPlatLogger(getClass());

	@Autowired
	private SalesManagerService service;
	private Map<String, String> resultMap;

	
	public void save() {
		Map<String,String> result=new HashMap<String,String>();
		User user = UserHolder.getCurrentLoginUser();
		Org org=user.getOrg();
		try {
			resultMap.put("regionCode", org.getRegionCode());
			resultMap.put("username", user.getUsername());
			resultMap.put("code", org.getCode());
			String order_code=resultMap.get("order_code");
			if(order_code!=null&&!order_code.equals("")){//换机或退货修改原来数据状态，再增加一条并保留工单编号
				service.update(resultMap);
				if(resultMap.get("is_back").equals("1")){//换机
					
				}else{//2退货,不新增记录
					result.put("state","1");
					result.put("msg", "退货成功！");
					this.reponseJson(result); 
					return;
				}
			}else{
				resultMap.put("order_code", UUID.randomUUID().toString());
			}
			SimpleDateFormat s=new SimpleDateFormat("yyyyMMdd HH:mm");
			resultMap.put("create_time", s.format(new Date()));
			resultMap.put("is_back", "0");
			service.insert(resultMap);
			result.put("state","1");
			result.put("msg", "操作成功！");
		} catch (Exception e) {
			e.printStackTrace();
			result.put("state","0");
			result.put("msg", "新增失败！");
		}
		this.reponseJson(result);
	}

	public Map<String, String> getResultMap() {
		return resultMap;
	}

	public void setResultMap(Map<String, String> resultMap) {
		this.resultMap = resultMap;
	}
	
}
