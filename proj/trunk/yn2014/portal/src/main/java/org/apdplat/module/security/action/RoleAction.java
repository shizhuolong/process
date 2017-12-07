package org.apdplat.module.security.action;

import org.apdplat.manager.bean.TreeJson;
import org.apdplat.manager.dao.ItemSetDao;
import org.apdplat.module.module.model.Command;
import org.apdplat.module.security.model.Role;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.RoleService;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.module.system.service.PropertyHolder;
import org.apdplat.platform.action.ExtJSSimpleAction;
import org.apdplat.platform.service.ServiceFacade;
import org.apdplat.platform.util.Struts2Utils;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.apache.struts2.convention.annotation.Namespace;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

@Scope("prototype")
@Controller
@Namespace("/security")
public class RoleAction extends ExtJSSimpleAction<Role> {
    private String node;
    @Resource(name="roleService")
    private RoleService roleService;
    @Resource(name="serviceFacade")
    private ServiceFacade serviceFacade;
    private List<Command> commands;
    private boolean recursion=false;
    @Autowired
	private ItemSetDao dao;
    
    public String store(){            
        if(recursion){
        	User user = UserHolder.getCurrentLoginUser();
        	if(user.isSuperManager()) {
	            long rootId = roleService.getRootRole().getId();
	            /*String json=roleService.toJson(rootId,recursion,null,roleService.hasRoleIds());
	            Struts2Utils.renderJson(json);*/
	            List<TreeJson> allRole = dao.listTreeData();
	            for(TreeJson t:allRole){
	    			t.setId("role-"+t.getId());
	    			t.setPid("role-"+t.getPid());
	    		}
	    		String l=TreeJson.createTreeJson(allRole);
	    		Struts2Utils.renderJson(l);
        	}else {
        		Long param[] = {user.getId()};
            	String roleSql = "SELECT DISTINCT T2.ID,T2.ROLENAME FROM APDP_USER_ROLE T1 INNER JOIN APDP_ROLE T2 ON T1.ROLEID=T2.ID WHERE T1.USERID=?";
            	List<Map> list = serviceFacade.queryForMap(roleSql, param);
            	if(list.isEmpty()) {
            		Struts2Utils.renderJson("");
            	}else{
	            	List<String> roleIds=new ArrayList<String>();
	            	
	            	for(Map m:list){
	            		if(m!=null)
	            			roleIds.add(((BigDecimal)m.get("ID")).longValue()+"");
	            	}
	            	List<TreeJson> allRole = dao.listTreeData();
	            	List<Map> hasRoleIds = roleService.hasRoleIds();
	            	List<String> funcIds=new ArrayList<String>();
	            	for(Map m:hasRoleIds){
	            		if(m!=null&&m.containsKey("ID")){
	            			String tid=(String)m.get("ID");
	            			funcIds.add(tid);
	            		}
	            	}
		            for(TreeJson t:allRole){
		    			if(roleIds.contains(t.getId())){
		    				t.setDisabled(false);
		    			}else{
		    				if(funcIds.contains(t.getId())){
		    					t.setDisabled(false);
			    			}else{
			    				t.setDisabled(true);
			    			}
		    			}
		    			t.setId("role-"+t.getId());
		    			t.setPid("role-"+t.getPid());
		    		}
		    		String l=TreeJson.createTreeJson(allRole);
		    		Struts2Utils.renderJson(l);
            	}
            	/*
            	Map map = null;
            	StringBuilder json=new StringBuilder();
                json.append("[");
            	for(int i=0,len=list.size();i<len;i++) {
            		map = list.get(i);
                 	json.append("{\'text\':\'").append(map.get("ROLENAME")).append("\',\'id\':\'role-").append(map.get("ID"));
                 	List<Map> childList = serviceFacade.queryForMap(childSql, new Object[]{map.get("ID")});
                 	if(childList.isEmpty()) {
                 		json.append("','leaf':true,'cls':'file'");
                 	}else {
                 		json.append("','leaf':false,'cls':'folder'");
         				json.append(",children:").append(roleService.toJson(Long.parseLong(map.get("ID").toString()), recursion));
                 	}
                 	json.append("},");
                 }
            	 json=json.deleteCharAt(json.length()-1);
                 json.append("]");
                 Struts2Utils.renderJson(json.toString());*/
        	}
            return null;
        }
        return query();
    }
    
    @Override
    public String query(){
        //如果node为null则采用普通查询方式
        if(node==null){
            return super.query();
        }
        //如果指定了node则采用自定义的查询方式
        if(node.trim().startsWith("root")){
            /*String json=roleService.toRootJson(recursion);
            Struts2Utils.renderJson(json);*/
        	 List<TreeJson> allRole = dao.listTreeData();
	            for(TreeJson t:allRole){
	    			t.setId("role-"+t.getId());
	    			t.setPid("role-"+t.getPid());
	    		}
	    		String l=TreeJson.createTreeJson(allRole);
	    		Struts2Utils.renderJson(l);
        }else{
            String[] attr=node.trim().split("-");
            if(attr.length==2){
                int roleId=Integer.parseInt(attr[1]);
                String json=roleService.toJson(roleId,recursion,null,roleService.hasRoleIds());
                Struts2Utils.renderJson(json);                    
            }   
        }
        return null;
    }
    @Override
    protected void old(Role model) {
        if(PropertyHolder.getBooleanProperty("demo")){
            if(model.isSuperManager()){
                throw new RuntimeException("演示版本不能修改具有超级管理员权限的角色");
            }
        }
    }
    
    /**
     * 删除角色前，把该角色从所有引用该角色的用户中移除
     * @param ids
     */
    @Override
    public void prepareForDelete(Long[] ids){
        User loginUser=UserHolder.getCurrentLoginUser();
        for(long id :ids){
            Role role=getService().retrieve(Role.class, id);            
            boolean canDel=true;
            //获取拥有等待删除的角色的所有用户
            List<User> users=role.getUsers();
            for(User user : users){                
                if(PropertyHolder.getBooleanProperty("demo")){
                    if(user.getUsername().equals("admin")){
                        throw new RuntimeException("演示版本不能删除admin用户拥有的角色");
                    }
                }
                if(loginUser.getId()==user.getId()){
                    canDel=false;
                }
            }
            if(!canDel) {
                continue;
            }
            for(User user : users){
                user.removeRole(role);
                getService().update(user);
            }
        }
    }

    @Override
    public void assemblyModelForCreate(Role model) {
        if(model.isSuperManager()){
            return;
        }
        model.setCommands(commands);
    }

    @Override
    public void assemblyModelForUpdate(Role model){
        if(model.isSuperManager()){
            model.clearCommand();
            return;
        }
        //默认commands==null
        //当在修改角色的时候，如果客户端不修改commands，则commands==null
        if(commands!=null){
            model.setCommands(commands);
        }
    }
    @Override
    protected void retrieveAfterRender(Map map,Role model){
        map.put("privileges", model.getModuleCommandStr());
        map.put("superManager", model.isSuperManager());
    }
    public void setPrivileges(String privileges) {
        String[] ids=privileges.split(",");
        commands=new ArrayList<>();
        for(String id :ids){
            String[] attr=id.split("-");
            if(attr.length==2){
                if("command".equals(attr[0])){
                    Command command=getService().retrieve(Command.class, Long.parseLong(attr[1]));
                    commands.add(command);
                }
            }
        }        
    }

    public void setRecursion(boolean recursion) {
        this.recursion = recursion;
    }

    public void setNode(String node) {
        this.node = node;
    }
}