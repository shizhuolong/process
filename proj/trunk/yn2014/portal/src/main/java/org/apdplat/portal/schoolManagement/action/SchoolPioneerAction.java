package org.apdplat.portal.schoolManagement.action;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Pattern;

import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.json.JSONUtil;
import org.apdplat.module.security.model.Org;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.portal.common.util.UUIDGeneratorUtils;
import org.apdplat.portal.schoolManagement.model.Area;
import org.apdplat.portal.schoolManagement.model.Point;
import org.apdplat.portal.schoolManagement.service.SchoolMangerService;
import org.apdplat.portal.schoolManagement.service.SchoolPioneerService;
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
public class SchoolPioneerAction extends BaseAction {
	
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	
	@Autowired
	private SchoolPioneerService schoolPioneerService;
	
	private Map<String,String> resultMap = new HashMap<String, String>();
	
	public Map<String,String> getResultMap() {
        return resultMap;
    }

    public void setResultMap(Map<String,String> resultMap) {
        this.resultMap = resultMap;
    }

    //查询学校名称
	public void listTree(){
	    Map<String, Object> map=new HashMap<String, Object>();
	    List<Map<String,Object>> list = schoolPioneerService.listTree();
	    List<Map<String,Object>> list1 = new ArrayList<Map<String,Object>>();
	    for( int i = 0 ; i < list.size() ; i++) {
	        Map<String, Object> mapList = new HashMap<String, Object>();
	        for(Entry entry:list.get(i).entrySet()){
	            if(entry.getKey().equals("ID")){
                    mapList.put("id", entry.getValue());
                    continue;
                }
	            if(entry.getKey().equals("PARENT_NODE")){
	                if(entry.getValue()==null||entry.getValue().equals("0")){
	                    continue;
	                }
	                mapList.put("_parentId", entry.getValue());
	                continue;
	            }
	            if(entry.getKey().equals("PIONEER_LEVEL")){
	                if(Integer.parseInt(entry.getValue().toString())==3){
	                    mapList.put("state", "open");
	                    mapList.put("operate", " ");
	                }else{
	                    mapList.put("state", "closed");
	                    mapList.put("operate", "<a href='javascript:void(0);' onclick='add($(this))' school_name='"+list.get(i).get("SCHOOL_NAME")+"' level='"+list.get(i).get("PIONEER_LEVEL")+"' campus='"+list.get(i).get("CAMPUS")+"' school_id='"+list.get(i).get("SCHOOL_ID")+"' parent_node='"+list.get(i).get("ID")+"'>新增<a>"); 
	                }
	                continue;
	            }
	            mapList.put(entry.getKey().toString(), entry.getValue());

	        }
	        list1.add(i, mapList);
	    }
	  map.put("rows", list1);
	  this.reponseJson(map);
    }

	//添加团长
	public void addHead(){
	    User user = UserHolder.getCurrentLoginUser();
        Org org = user.getOrg();
        String orgLevel=org.getOrgLevel();
        String regionCode = org.getRegionCode();
        String group_id_name = org.getRegionName();
        String id = UUIDGeneratorUtils.getUUID();
        Long user_id = user.getId();
        resultMap.put("group_id", regionCode);
        resultMap.put("group_id_name", group_id_name);
        resultMap.put("id", id);
        resultMap.put("parent_node", "");
        resultMap.put("pioneer_level", "1");
        resultMap.put("user_id", user_id.toString());
	    schoolPioneerService.addHead(resultMap);
	}

	//添加队员
    public void addPioneer(){
        User user = UserHolder.getCurrentLoginUser();
        Org org = user.getOrg();
        String orgLevel=org.getOrgLevel();
        String regionCode = org.getRegionCode();
        String group_id_name = org.getRegionName();
        String id = UUIDGeneratorUtils.getUUID();
        Long user_id = user.getId();
        Integer level = Integer.parseInt(resultMap.get("pioneer_level"))+1;
        resultMap.put("pioneer_level", level.toString());
        resultMap.put("group_id", regionCode);
        resultMap.put("group_id_name", group_id_name);
        resultMap.put("id", id);
 //       resultMap.put("parent_node", "");
 //       resultMap.put("pioneer_level", "1");
        resultMap.put("user_id", user_id.toString());
        schoolPioneerService.addHead(resultMap);
    }
    
    public void listSchool(){
        User user = UserHolder.getCurrentLoginUser();
        Org org = user.getOrg();
        Long user_id = user.getId();
        String regionCode = org.getRegionCode();
        Map<String, String> param=new HashMap<String, String>();
        String schoolName = request.getParameter("schoolName");
        String school = "'%"+schoolName+"%'";
        param.put("schoolName", school);
        param.put("user_id", user_id.toString());
        List<Map<String,Object>> list = schoolPioneerService.listSchool(param);
        if(list.size()>0){
            this.reponseJson(list);
        }else{
            param.remove("user_id");
            param.put("regionCode", regionCode);
            List<Map<String,Object>> list1 = schoolPioneerService.listSchool(param);
            this.reponseJson(list1);
        }
    }
}