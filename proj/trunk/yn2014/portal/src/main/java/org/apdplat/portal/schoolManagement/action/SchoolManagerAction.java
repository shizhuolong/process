package org.apdplat.portal.schoolManagement.action;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

import org.apache.struts2.convention.annotation.Namespace;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.portal.schoolManagement.service.SchoolMangerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

/**
 * 校园管家
 *
 */
@SuppressWarnings("serial")
@Namespace("/school")
@Controller
@Scope("prototype")
public class SchoolManagerAction extends BaseAction {
	
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	
	@Autowired
	private SchoolMangerService schoolMangerService;
	
	//查询学校名称
	public void listSchoolName(){
	    Map<String, String> param=new HashMap<String, String>();
	    String schoolName = request.getParameter("schoolName");
	    String pattern = "[a-zA-Z]+";
	    boolean b = Pattern.matches(pattern, schoolName);
	    if(b){
	        this.reponseJson("");
	    }else{
    	    schoolName = "'%"+schoolName+"%'";
    	    param.put("schoolName", schoolName);
    	    List<Map<String,Object>> list = schoolMangerService.findSchoolName(param);
    	    if (list!=null){
    	        this.reponseJson(list);
    	    }
	    }
	}
	
	//根据id查询学校信息
	public void findSchoolByID(){
	    Map<String, String> param=new HashMap<String, String>();
	    String id = request.getParameter("id");
	    param.put("id", id);
	    Map<String,Object> map = schoolMangerService.findSchoolByID(param);
	    if(map!=null&&map.size()!=0){
	        this.reponseJson(map);
	    }
	}
}