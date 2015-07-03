package org.apdplat.module.security.service;

import org.apdplat.module.security.model.Role;
import org.apdplat.platform.criteria.Criteria;
import org.apdplat.platform.criteria.Operator;
import org.apdplat.platform.criteria.PropertyCriteria;
import org.apdplat.platform.criteria.PropertyEditor;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.platform.result.Page;
import org.apdplat.platform.service.ServiceFacade;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

@Service
public class RoleService {
    protected static final APDPlatLogger LOG = new APDPlatLogger(RoleService.class);
    @Resource(name="serviceFacade")
    private ServiceFacade serviceFacade;

    public static List<String> getChildNames(Role role){
        List<String> names=new ArrayList<>();
        List<Role> child=role.getChild();
        for(Role item : child){
            names.add(item.getRoleName());
            names.addAll(getChildNames(item));
        }
        return names;
    }
    public static List<Long> getChildIds(Role role){
        List<Long> ids=new ArrayList<>();
        List<Role> child=role.getChild();
        for(Role item : child){
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
        Role rootRole=getRootRole();
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
                    for(Role item : rootRole.getChild()){
                        json.append(",children:").append(toJson(item.getId(), recursion,null));
                    }
                }
            }
        json.append("}");
        json.append("]");
        
        return json.toString();
    }
    public String toJson(long roleId, boolean recursion,List<String> roleIds){
    	if(roleIds==null){
	        Role role=serviceFacade.retrieve(Role.class, roleId);
	        if(role==null){
	            LOG.error("获取ID为 "+roleId+" 的角色失败！");
	            return "";
	        }
	        List<Role> child=role.getChild();
	        if(child.isEmpty()){
	            return "";
	        }
	        StringBuilder json=new StringBuilder();
	        json.append("[");
	
	        
	        for(Role item : child){
	            json.append("{'text':'")
	                .append(item.getRoleName())
	                .append("','id':'role-")
	                .append(item.getId());
	                if(item.getChild().isEmpty()){
	                    json.append("','leaf':true,'cls':'file'");
	                }else{
	                    json.append("','leaf':false,'cls':'folder'");
	                    if (recursion) {
	                        json.append(",children:").append(toJson(item.getId(), recursion,roleIds));
	                    }
	                }
	           json .append("},");
	        }
	        //删除最后一个,号，添加一个]号
	        json=json.deleteCharAt(json.length()-1);
	        json.append("]");
	
	        return json.toString();
    	}else{
    		Role role=serviceFacade.retrieve(Role.class, roleId);
	        if(role==null){
	            LOG.error("获取ID为 "+roleId+" 的角色失败！");
	            return "";
	        }
	        List<Role> child=role.getChild();
	        if(child.isEmpty()){
	            return "";
	        }
	        StringBuilder json=new StringBuilder();
	        json.append("[");
	   
	        for(Role item : child){
	        	String disabled="true";
	        	Long roleLongId=item.getId();
	        	if(roleIds.contains(roleLongId+"")){
	        		disabled="false";
	        	}
	            json.append("{'disabled':"+disabled+",'text':'")
	                .append(item.getRoleName())
	                .append("','id':'role-")
	                .append(item.getId());
	                if(item.getChild().isEmpty()){
	                    json.append("','leaf':true,'cls':'file'");
	                }else{
	                    json.append("','leaf':false,'cls':'folder'");
	                    if (recursion) {
	                        json.append(",children:").append(toJson(item.getId(), recursion,roleIds));
	                    }
	                }
	           json .append("},");
	        }
	        //删除最后一个,号，添加一个]号
	        json=json.deleteCharAt(json.length()-1);
	        json.append("]");
	
	        return json.toString();
    	}
    }
    public Role getRootRole(){
        PropertyCriteria propertyCriteria = new PropertyCriteria(Criteria.or);
        propertyCriteria.addPropertyEditor(new PropertyEditor("roleName", Operator.eq, "String","角色"));
        Page<Role> page = serviceFacade.query(Role.class, null, propertyCriteria);
        if (page.getTotalRecords() == 1) {
            return page.getModels().get(0);
        }
        return null;
    }
}