package org.apdplat.portal.channelManagement.action;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.portal.channelManagement.service.ChnlPersonService;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * 小区代理商人员绑定
 * @author shizl
 *
 */
@SuppressWarnings("serial")
public class ChnlPersonAction extends BaseAction {
	
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	
	@Autowired
	private ChnlPersonService chnlPersonService;
	
	private String orgId;
	private String orgLevel;
	private String code;
	private String deal_date;//账期
	private String regionCode;//地市编码
	private String name;//渠道经理
	private String std_6_id;//小区编码
	private String std_6_name;//小区名称
	private String hq_chan_code;//渠道编码
	private String hq_chan_name;//渠道名称
	private String hr_id;
	private String unit_id;
	private String unit_name;
	private String userId;//渠道经理ID
	private String accout;//渠道经理账号
	private String phone;//电话
	private String id;//uuid 唯一标识
	private Map<String, String> resultMap;
	
	public void listTreeNode() {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("orgId", orgId);
		params.put("orgLevel", orgLevel);
		params.put("code", code);
		List<Map<String, Object>> list = chnlPersonService.listTreeNode(params);
		this.reponseJson(list);
	}
	
	public void listPerson() {
		try {
			if(deal_date != null && !"".equals(deal_date)) {
				resultMap.put("deal_date", deal_date);
			}
			if(regionCode != null && !"".equals(regionCode)) {
				resultMap.put("regionCode", regionCode);
			}
			if(std_6_id != null && !"".equals(std_6_id.trim())) {
				resultMap.put("std_6_id", "%"+std_6_id+"%");
			}
			if(std_6_name != null && !"".equals(std_6_name.trim())) {
				resultMap.put("std_6_name", "%"+std_6_name+"%");
			}
			if(hq_chan_code != null && !"".equals(hq_chan_code.trim())) {
				resultMap.put("hq_chan_code", "%"+hq_chan_code+"%");
			}
			if(hq_chan_name != null && !"".equals(hq_chan_name.trim())) {
				resultMap.put("hq_chan_name", "%"+hq_chan_name+"%");
			}
			if(name != null && !"".equals(name.trim())) {
				resultMap.put("name", "%"+name+"%");
			}
			Object result = chnlPersonService.listPerson(resultMap);
			this.reponseJson(result);
		} catch (Exception e) {
			logger.error("查询小区信息失败！",e);
			e.printStackTrace();
		}
	}
	
	public void bind() {
		try {
			User user = UserHolder.getCurrentLoginUser();
			String username=user.getUsername();
			Map<String, String> params = new HashMap<String, String>();
			params.put("id", id);
			params.put("username", username);
			params.put("hq_chan_code", hq_chan_code);
			params.put("hq_chan_name", hq_chan_name);
			params.put("userId", userId);
			params.put("name", name);
			params.put("accout", accout);
			params.put("phone", phone);
			chnlPersonService.bind(params);
			outJsonPlainString(response,"{\"msg\":\"操作成功！\"}");
		} catch (Exception e) {
			logger.error("绑定小区代理商人员失败！",e);
			e.printStackTrace();
			outJsonPlainString(response,"{\"msg\":\"绑定小区代理商人员失败！\"}");
		}
	}
	
	public String unBind() {
		try {
			User user = UserHolder.getCurrentLoginUser();
			String username=user.getUsername();
			Map<String, String> params = new HashMap<String, String>();
			params.put("id", id);
			params.put("username", username);
			chnlPersonService.unBind(params);
			return "success";
		} catch (Exception e) {
			logger.error("解绑小区代理商人员失败！",e);
			e.printStackTrace();
		}
		return null;
	}
	
	public String getOrgId() {
		return orgId;
	}

	public void setOrgId(String orgId) {
		this.orgId = orgId;
	}

	public String getOrgLevel() {
		return orgLevel;
	}

	public void setOrgLevel(String orgLevel) {
		this.orgLevel = orgLevel;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getDeal_date() {
		return deal_date;
	}

	public void setDeal_date(String deal_date) {
		this.deal_date = deal_date;
	}

	public String getRegionCode() {
		return regionCode;
	}

	public void setRegionCode(String regionCode) {
		this.regionCode = regionCode;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getStd_6_id() {
		return std_6_id;
	}

	public void setStd_6_id(String std_6_id) {
		this.std_6_id = std_6_id;
	}

	public String getStd_6_name() {
		return std_6_name;
	}

	public void setStd_6_name(String std_6_name) {
		this.std_6_name = std_6_name;
	}

	public String getHq_chan_code() {
		return hq_chan_code;
	}

	public void setHq_chan_code(String hq_chan_code) {
		this.hq_chan_code = hq_chan_code;
	}

	public String getHq_chan_name() {
		return hq_chan_name;
	}

	public void setHq_chan_name(String hq_chan_name) {
		this.hq_chan_name = hq_chan_name;
	}

	public String getHr_id() {
		return hr_id;
	}

	public void setHr_id(String hr_id) {
		this.hr_id = hr_id;
	}

	public String getUnit_id() {
		return unit_id;
	}

	public void setUnit_id(String unit_id) {
		this.unit_id = unit_id;
	}

	public String getUnit_name() {
		return unit_name;
	}

	public void setUnit_name(String unit_name) {
		this.unit_name = unit_name;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getAccout() {
		return accout;
	}

	public void setAccout(String accout) {
		this.accout = accout;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public Map<String, String> getResultMap() {
		return resultMap;
	}

	public void setResultMap(Map<String, String> resultMap) {
		this.resultMap = resultMap;
	}

	public APDPlatLogger getLogger() {
		return logger;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}
	
}
