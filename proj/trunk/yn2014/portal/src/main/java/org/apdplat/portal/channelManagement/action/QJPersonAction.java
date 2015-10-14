package org.apdplat.portal.channelManagement.action;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.portal.channelManagement.service.QJPersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

/**
 * 唯一身份管理
 * @author shizl
 *
 */
@SuppressWarnings("serial")
public class QJPersonAction extends BaseAction {
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	
	@Autowired
	private QJPersonService qjPersonService;
	private String orgId;
	private String orgLevel;
	private String code;
	private Map<String, String> resultMap;
	private String job;
	private String user_code;
	private String hr_id;
	private String job_type;
	private String name;
	private String unit_name;
	private String time;
	private String emp_type;
	
	
	public void listTreeNode() {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("orgId", orgId);
		params.put("orgLevel", orgLevel);
		params.put("code", code);
		List<Map<String, Object>> list = qjPersonService.listTreeNode(params);
		this.reponseJson(list);
	}
	
	public void queryMagPerson() {
		String name = request.getParameter("name").trim();
		String unit_name = request.getParameter("unit_name").trim();
		String job_type = request.getParameter("job_type").trim();
		String job = request.getParameter("job").trim();
		String hr_id = request.getParameter("hr_id").trim();
		String active_time = request.getParameter("active_time");
		String chooseMonth = request.getParameter("chooseMonth");
		
		if(name != null && !"".equals(name.trim())) {
			resultMap.put("name", "%"+name+"%");
		}
		if(unit_name != null && !"".equals(unit_name.trim())) {
			resultMap.put("unit_name", "%"+unit_name+"%");
		}
		if(job_type != null && !"".equals(job_type.trim())) {
			resultMap.put("job_type", "%"+job_type+"%");
		}
		if(job != null && !"".equals(job.trim())) {
			resultMap.put("job", "%"+job+"%");
		}
		if(hr_id != null && !"".equals(hr_id.trim())) {
			resultMap.put("hr_id", "%"+hr_id+"%");
		}
		if(active_time != null && !"".equals(active_time.trim())) {
			resultMap.put("active_time", active_time);
		}
		if(chooseMonth != null) {
			resultMap.put("chooseMonth", chooseMonth);
		}
		Object result = qjPersonService.queryMagPerson(resultMap);
		this.reponseJson(result);
	}
	public void checkIsHrIdRepeat(){
		Map<String,String> r=qjPersonService.isHrIdRepeat(hr_id);
		Map<String,String> result=new HashMap<String,String>();
		if(r!=null&&!r.isEmpty()){
			result.put("message","主管编码重复");
		}
		this.reponseJson(result);
	}
	public void save(){
		Map<String,String> m=new HashMap<String,String>();
		m.put("unit_name",unit_name);
		m.put("hr_id",hr_id);
		m.put("job_type",job_type);
		m.put("emp_type",emp_type);
		m.put("job",job);
		m.put("time",time);
		m.put("code",code);
		m.put("user_code",user_code);
		qjPersonService.insertToResult(m);
		this.reponseJson("新增成功");
	}
	/*public void update(){
		Map<String,String> m=new HashMap<String,String>();
		m.put("name",name.trim());
		m.put("unit_name",unit_name);
		m.put("job",job);
		m.put("job_type",job_type);
		m.put("hr_id",hr_id);
		try {
			qjPersonService.updateToResult(m);
			this.reponseJson("修改成功");
		} catch (Exception e) {
			this.reponseJson("修改失敗");
		}
		
	}*/
    public String del(){
    	String hr_id=request.getParameter("hr_id");
    	String month = request.getParameter("month");
    	Map<String,String> m=new HashMap<String,String>();
    	if(hr_id != null && !"".equals(hr_id.trim())) {
			m.put("hr_id",hr_id);
		}
    	m.put("month",month);
    	qjPersonService.del(m);
    	return "success";
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
	
	public String getHr_id() {
		return hr_id;
	}

	public void setHr_id(String hr_id) {
		this.hr_id = hr_id;
	}
	
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getUnit_name() {
		return unit_name;
	}

	public void setUnit_name(String unit_name) {
		this.unit_name = unit_name;
	}

	public String getJob() {
		return job;
	}

	public void setJob(String job) {
		this.job = job;
	}

	public String getJob_type() {
		return job_type;
	}

	public void setJob_type(String job_type) {
		this.job_type = job_type;
	}

	public String getTime() {
		return time;
	}

	public void setTime(String time) {
		this.time = time;
	}

	public String getEmp_type() {
		return emp_type;
	}

	public void setEmp_type(String emp_type) {
		this.emp_type = emp_type;
	}

	public String getUser_code() {
		return user_code;
	}

	public void setUser_code(String user_code) {
		this.user_code = user_code;
	}

	
}
