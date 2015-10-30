package org.apdplat.module.security.service;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import org.apdplat.module.security.model.AppRole;
import org.apdplat.module.security.model.Role;
import org.apdplat.platform.criteria.Criteria;
import org.apdplat.platform.criteria.Operator;
import org.apdplat.platform.criteria.PropertyCriteria;
import org.apdplat.platform.criteria.PropertyEditor;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.platform.result.Page;
import org.apdplat.platform.service.ServiceFacade;
import org.springframework.stereotype.Service;

@Service
public class AppRoleService {
    protected static final APDPlatLogger LOG = new APDPlatLogger(AppRoleService.class);
    @Resource(name="serviceFacade")
    private ServiceFacade serviceFacade;

    public static List<String> getChildNames(AppRole role){
        List<String> names=new ArrayList<>();
        List<AppRole> child=role.getChild();
        for(AppRole item : child){
            names.add(item.getRoleName());
            names.addAll(getChildNames(item));
        }
        return names;
    }
    public static List<Long> getChildIds(AppRole role){
        List<Long> ids=new ArrayList<>();
        List<AppRole> child=role.getChild();
        for(AppRole item : child){
            ids.add(item.getId());
            ids.addAll(getChildIds(item));
        }
        return ids;
    }
    public static boolean isParentOf(Role parent,Role child){
        Role role=child.getParent();
        while(role!=null){
            if(role.getId()==parent.getId()){
                return true;
            }
            role=role.getParent();
        }
        return false;
    }
    
    public String toRootJson(boolean recursion){
    	AppRole rootRole=getRootRole();
        if(rootRole==null){
            LOG.error("获取根角色失败！");
            return "";
        }
        StringBuilder json=new StringBuilder();
        json.append("[");

        json.append("{'text':'")
            .append(rootRole.getRoleName())
            .append("','id':'role-")
            .append(rootRole.getId());
            if(rootRole.getChild().isEmpty()){
                json.append("','leaf':true,'cls':'file'");
            }else{ 
                json.append("','leaf':false,'cls':'folder'");
                if (recursion) {
                	json.append(",children:[");
                    json.append(toJson(rootRole.getId(), recursion));
                    json.append("]");
                }
            }
        json.append("}");
        json.append("]");
        
        return json.toString();
    }
    public String toJson(long roleId, boolean recursion){
    	
    		AppRole role=serviceFacade.retrieve(AppRole.class, roleId);
	        if(role==null){
	            LOG.error("获取ID为 "+roleId+" 的角色失败！");
	            return "";
	        }
	        List<AppRole> child=role.getChild();
	        if(child.isEmpty()){
	            return "";
	        }
	        StringBuilder json=new StringBuilder();
	        
	        for(AppRole item : child){
	            json.append("{'text':'")
	                .append(item.getRoleName())
	                .append("','id':'role-")
	                .append(item.getId());
	                if(item.getChild().isEmpty()){
	                    json.append("','leaf':true,'cls':'file'");
	                }else{
	                    json.append("','leaf':false,'cls':'folder'");
	                    if (recursion) {
	                        json.append(",children:[").append(toJson(item.getId(), recursion));
	                        json.append("]");
	                    }
	                }
	           json .append("},");
	        }
	        //删除最后一个,号，添加一个]号
	        json=json.deleteCharAt(json.length()-1);
	        //json.append("]");
	
	        return json.toString();
    	
    }
    public AppRole getRootRole(){//
        PropertyCriteria propertyCriteria = new PropertyCriteria(Criteria.or);
        propertyCriteria.addPropertyEditor(new PropertyEditor("roleName", Operator.eq, "String","角色"));
        Page<AppRole> page = serviceFacade.query(AppRole.class, null, propertyCriteria);
        if (page.getTotalRecords() == 1) {
            return page.getModels().get(0);
        }
        return null;
    }
}