package org.apdplat.module.security.action;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.struts2.convention.annotation.Namespace;
import org.apdplat.module.module.model.AppModule;
import org.apdplat.module.security.model.AppRole;
import org.apdplat.module.security.model.AppUser;
import org.apdplat.module.security.service.AppRoleService;
import org.apdplat.module.system.service.PropertyHolder;
import org.apdplat.platform.action.ExtJSSimpleAction;
import org.apdplat.platform.service.ServiceFacade;
import org.apdplat.platform.util.Struts2Utils;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

@Scope("prototype")
@Controller
@Namespace("/security")
public class AppRoleAction extends ExtJSSimpleAction<AppRole> {
    private String node;
    @Resource(name="appRoleService")
    private AppRoleService roleService;
    @Resource(name="serviceFacade")
    private ServiceFacade serviceFacade;
    private List<AppModule> modules;
    private boolean recursion=false; 
    @Override
    public String query(){
        //如果node为null则采用普通查询方式
        if(node==null){
            return super.query();
        }
        //如果指定了node则采用自定义的查询方式
        if(node.trim().startsWith("root")){
            String json=roleService.toRootJson(recursion);
            Struts2Utils.renderJson(json);
        }else{
            String[] attr=node.trim().split("-");
            if(attr.length==2){
                int roleId=Integer.parseInt(attr[1]);
                String json="["+roleService.toJson(roleId,recursion)+"]";
                Struts2Utils.renderJson(json);                    
            }   
        }
        return null;
    }
    @Override
    protected void old(AppRole model) {
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
        for(long id :ids){
            AppRole role=getService().retrieve(AppRole.class, id);            
            //获取拥有等待删除的角色的所有用户
            List<AppUser> users=role.getUsers();
        
            for(AppUser user : users){
                user.removeRole(role);
                getService().update(user);
            }
           
        }
    }

    @Override
    public void assemblyModelForCreate(AppRole model) {
        if(model.isSuperManager()){
            return;
        }
        if(modules!=null){
            model.setAppModules(modules);
        }
    }

    @Override
    public void assemblyModelForUpdate(AppRole model){
        if(model.isSuperManager()){
            model.clearAppModules();
            return;
        }
        //默认modules==null
        //当在修改角色的时候，如果客户端不修改modules，则modules==null
        if(modules!=null){
            model.setAppModules(modules);
        }
    }
    @Override
    protected void retrieveAfterRender(Map map,AppRole model){
        map.put("privileges", model.getModuleStr());
        map.put("superManager", model.isSuperManager());
        
    }
    public void setPrivileges(String privileges) {
        String[] ids=privileges.split(",");
        modules=new ArrayList<>();
        for(String id :ids){
            String[] attr=id.split("-");
            if(attr.length==2){
                if("module".equals(attr[0])){
                    AppModule module=getService().retrieve(AppModule.class, Long.parseLong(attr[1]));
                    modules.add(module);
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