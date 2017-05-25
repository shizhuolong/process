package org.apdplat.portal.channelManagement.action;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.module.security.model.Org;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.portal.channelManagement.service.AgentPersonService;
import org.apdplat.report.devIncome.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * 代理商人员管理
 * 
 * @author shizl
 * 
 */
@SuppressWarnings("serial")
public class AgentPersonAction extends BaseAction {
	 @SuppressWarnings("unused")
	private final APDPlatLogger logger = new APDPlatLogger(getClass());

	@Autowired
	private AgentPersonService agentPersonService;
	@Autowired
	private ReportService reportService;
	private String orgId;
	private String orgLevel;
	private String code;
	private Map<String, String> resultMap;

	
	public void listTreeNode() {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("orgId", orgId);
		params.put("orgLevel", orgLevel);
		params.put("code", code);
		List<Map<String, Object>> list = agentPersonService
				.listTreeNode(params);
		this.reponseJson(list);
	}

	public void queryAgentPerson() {
		User user = UserHolder.getCurrentLoginUser();
		Org org=user.getOrg();
		String hq_chan_code = request.getParameter("hq_chan_code").trim();
		String hq_chan_name = request.getParameter("hq_chan_name").trim();
		String name = request.getParameter("name").trim();
		String phone = request.getParameter("phone").trim();
		String unit_name = request.getParameter("unit_name").trim();
		String deal_date = request.getParameter("deal_date");
		String hrId=user.getHrId();
		String level=org.getOrgLevel();
		if(level.equals("3")){//营服级别进去特殊处理
			String hrIds=power(hrId,deal_date);
			resultMap.put("hrIds", hrIds);
		}
		resultMap.put("level", level);
		if (hq_chan_code != null && !"".equals(hq_chan_code.trim())) {
			resultMap.put("hq_chan_code", hq_chan_code);
		}
		if (hq_chan_name != null && !"".equals(hq_chan_name.trim())) {
			resultMap.put("hq_chan_name", "%" + hq_chan_name + "%");
		}
		if (name != null && !"".equals(name.trim())) {
			resultMap.put("name", "%" + name + "%");
		}
		if (phone != null && !"".equals(phone.trim())) {
			resultMap.put("phone", "%" + phone + "%");
		}
		if (unit_name != null && !"".equals(unit_name.trim())) {
			resultMap.put("unit_name", "%" + unit_name + "%");
		}
		resultMap.put("deal_date", deal_date);
		Object result = agentPersonService.queryAgentPerson(resultMap);
		this.reponseJson(result);
	}

	public String del() {
		try {
			String nameid = request.getParameter("nameid");
			String deal_date = request.getParameter("deal_date");
			Map<String, String> m = new HashMap<String, String>();
			m.put("nameid", nameid);
			m.put("deal_date", deal_date);
			agentPersonService.del(m);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "success";
	}
	
   public void isPassCheck(){
	    User user = UserHolder.getCurrentLoginUser();
		Org org=user.getOrg();
		String hrId=user.getHrId();
		String level=org.getOrgLevel();
	    Map<String, String> m = new HashMap<String, String>();
	    String hq_chan_code = request.getParameter("hq_chan_code").trim();
		String name = request.getParameter("name").trim();
		String phone = request.getParameter("phone").trim();
		String deal_date = request.getParameter("deal_date");
		String nameid=hq_chan_code+phone;
		String people_type = request.getParameter("people_type");
		m.put("nameid", nameid);
		m.put("hq_chan_code", hq_chan_code);
		m.put("name", name);
		m.put("phone", phone);
		m.put("deal_date", deal_date);
		if(level.equals("3")){//营服级别进去特殊处理
			String hrIds=power(hrId,deal_date);
			m.put("hrIds", hrIds);
		}
		if(people_type.equals("1")){//店长
			List<Map<String,String>> l=agentPersonService.findShopkeeper(m);
			if(l!=null&&l.size()>0){
				this.reponseJson("该代理商已有店长！");
			}
		}else{//店员
			List<Map<String,String>> l=agentPersonService.findSalesman(m);
			if(l!=null&&l.size()>0){
				this.reponseJson("该店员已经存在于该代理商！");
			}
		}
		List<Map<String,String>> o=agentPersonService.isPhoneExist(m);
		if(o!=null&&o.size()>0){
			this.reponseJson("电话号码已存在于该代理商！");
		}
		List<Map<String,String>> n=agentPersonService.isAgentOwn(m);
		if(n==null||n.size()==0){
			this.reponseJson("该代理商不属于你的管辖！");
		}
		this.reponseJson("success");
   }
   
	public void save() {
		Map<String, String> m = new HashMap<String, String>();
		String hq_chan_code = request.getParameter("hq_chan_code").trim();
		String hq_chan_name = request.getParameter("hq_chan_name");
		String name = request.getParameter("name").trim();
		String phone = request.getParameter("phone").trim();
		String deal_date = request.getParameter("deal_date");
		String people_type=request.getParameter("people_type");
		String team_type=request.getParameter("team_type");
		String nameid="";
		if(team_type.equals("1")){
			nameid=request.getParameter("userId");
		}else{
			nameid=hq_chan_code+phone;
		}
		m.put("nameid", nameid);
		m.put("hq_chan_code", hq_chan_code);
		m.put("hq_chan_name", hq_chan_name);
		m.put("name", name);
		m.put("phone", phone);
		m.put("deal_date", deal_date);
		m.put("username", request.getParameter("username"));
		m.put("people_type", people_type);
		
		try {
			agentPersonService.insert(m);
		} catch (Exception e) {
			e.printStackTrace();
			this.reponseJson("新增失败！");
		}
		this.reponseJson("新增成功！");
	}

	public void update() {//未用
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
			agentPersonService.update(m);
			this.reponseJson("修改成功！");
		} catch (Exception e) {
			e.printStackTrace();
			this.reponseJson("修改失败！");
		}
	}

	public String power(String hrId,String month){
		String sql="SELECT PORTAL.HR_PERM('"+hrId+"','"+month+"') HRIDS FROM DUAL";                                                                                
		Map<String,String> m=new HashMap<String,String>();
		m.put("sql", sql);
		List<Map<String, Object>> list=reportService.query(m);
		String hrIds="";
		if(list!=null&&list.size()>0){
			hrIds=list.get(0).get("HRIDS").toString();
		}
		return "("+hrIds+")";
	}
	
	public Map<String, String> getResultMap() {
		return resultMap;
	}

	public void setResultMap(Map<String, String> resultMap) {
		this.resultMap = resultMap;
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

}
