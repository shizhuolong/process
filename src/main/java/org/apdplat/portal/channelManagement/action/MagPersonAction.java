package org.apdplat.portal.channelManagement.action;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.portal.channelManagement.service.MagPersonService;
import org.springframework.beans.factory.annotation.Autowired;



/**
 * 营业厅主任
 * @author shizl
 *
 */
@SuppressWarnings("serial")
public class MagPersonAction extends BaseAction {
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	
	@Autowired
	private MagPersonService magPersonService;
	private String orgId;
	private String orgLevel;
	private String code;
	private Map<String, String> resultMap;
	
	
	public void listTreeNode() {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("orgId", orgId);
		params.put("orgLevel", orgLevel);
		params.put("code", code);
		List<Map<String, Object>> list = magPersonService.listTreeNode(params);
		this.reponseJson(list);
	}
	
	public void queryMagPerson() {
		String name = request.getParameter("name").trim();
		String unit_name = request.getParameter("unit_name").trim();
		String hr_id = request.getParameter("hr_id").trim();
		String chooseMonth = request.getParameter("chooseMonth");
		
		
		if(name != null && !"".equals(name.trim())) {
			resultMap.put("name", "%"+name+"%");
		}
		if(unit_name != null && !"".equals(unit_name.trim())) {
			resultMap.put("unit_name", "%"+unit_name+"%");
		}
	    if(hr_id != null && !"".equals(hr_id.trim())) {
			resultMap.put("hr_id", "%"+hr_id+"%");
		}
		if(chooseMonth != null) {
			resultMap.put("chooseMonth", chooseMonth);
		}
		Object result = magPersonService.queryMagPerson(resultMap);
		this.reponseJson(result);
	}
	
	public void save(){
		Map<String,String> m=new HashMap<String,String>();
		m.put("hr_id",request.getParameter("hr_id"));
		m.put("chooseMonth",request.getParameter("chooseMonth"));
		m.put("hq_chan_code",request.getParameter("hq_chan_code"));
		try {
			magPersonService.insertToResult(m);
			this.reponseJson("新增成功");
		} catch (Exception e) {
			this.reponseJson("新增失败");
		}
		
	}
	
	public void update(){
		Map<String,String> m=new HashMap<String,String>();
		String chooseMonth=request.getParameter("chooseMonth");
		m.put("chooseMonth",request.getParameter("chooseMonth"));
		m.put("hr_id",request.getParameter("hr_id"));
		m.put("hq_chan_code",request.getParameter("hq_chan_code"));
		m.put("code",code);
		m.put("orgLevel",orgLevel);
		try {
			List<Map<String,String>> l=magPersonService.checkChanCode(m);
			if(l!=null&&!l.isEmpty()){
				magPersonService.updateToResult(m);
				magPersonService.updateWithCode(m);
				this.reponseJson("修改成功");
			}else{
				this.reponseJson("营业厅编码错误");
			}
		} catch (Exception e) {
			this.reponseJson("修改失败");
		}
	}
	public String delMagPerson(){
		Map<String,String> m=new HashMap<String,String>();
		m.put("hr_id",request.getParameter("hr_id"));
		m.put("chooseMonth",request.getParameter("chooseMonth"));
		try {
			magPersonService.del(m);
		} catch (Exception e) {
			this.reponseJson("删除失败");
		}
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
	
}
