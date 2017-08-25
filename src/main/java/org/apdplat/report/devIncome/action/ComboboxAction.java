package org.apdplat.report.devIncome.action;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.struts2.convention.annotation.Namespace;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.report.devIncome.service.ComboboxService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

@SuppressWarnings("serial")
@Controller
@Namespace("/combobox")
@Scope("prototype")
public class ComboboxAction extends BaseAction {

	@Autowired
    private ComboboxService service;
	
	public void listCombobox() {
	   String name=request.getParameter("name");
	   name="%"+name+"%";
	   List<Map<String,Object>> list = service.listOutBounds(name); 
       List<Map<String,Object>> l = new ArrayList<Map<String,Object>>(); 
       for (int i = 0; i < list.size(); i++){  
    	   Map<String,Object> m=new HashMap<String,Object>();
    	   m.put("id", list.get(i).get("ID"));
    	   m.put("name", list.get(i).get("NAME"));
           l.add(m);  
       }  
       this.reponseJson(l);  
	}
}
