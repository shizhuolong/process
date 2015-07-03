package org.apdplat.module.security.action;

import org.apdplat.module.security.model.Role;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.model.UserGroup;
import org.apdplat.module.security.service.UserGroupService;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.action.ExtJSSimpleAction;
import org.apdplat.platform.util.Struts2Utils;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.struts2.convention.annotation.Namespace;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

@Scope("prototype")
@Controller
@Namespace("/security")
public class UserGroupAction extends ExtJSSimpleAction<UserGroup> {
    @Resource(name="userGroupService")
    private UserGroupService userGroupService;
    private List<Role> roles = null;
    private String node;
    
    public String store(){     
        String json = userGroupService.toAllUserGroupJson();
        Struts2Utils.renderJson(json);

        return null;
    } 
    /**
     * 删除用户组前，把该用户组从所有引用该用户组的用户中移除
     * @param ids
     */
    @Override
    public void prepareForDelete(Long[] ids){
        User loginUser=UserHolder.getCurrentLoginUser();
        for(long id :ids){
            UserGroup userGroup=getService().retrieve(UserGroup.class, id);
            boolean canDel=true;
            //获取拥有等待删除的角色的所有用户
            List<User> users=userGroup.getUsers();
            for(User user : users){
                if(loginUser.getId()==user.getId()){
                    canDel=false;
                }
            }
            if(!canDel) {
                continue;
            }
            for(User user : users){
                user.removeUserGroup(userGroup);
                getService().update(user);
            }
        }
    }

    @Override
    public void assemblyModelForCreate(UserGroup model) {
        model.setRoles(roles);
    }

    @Override
    public void assemblyModelForUpdate(UserGroup model){
        //默认roles==null
        //当在修改用户组的时候，如果客户端不修改roles，则roles==null
        if(roles!=null){
            model.setRoles(roles);
        }
    }
    @Override
    protected void retrieveAfterRender(Map map,UserGroup model){
        map.put("roles", model.getRoleStrs());
    }
    public void setRoles(String roleStr) {
        String[] ids=roleStr.split(",");
        roles=new ArrayList<>();
        for(String id :ids){
            String[] attr=id.split("-");
            if(attr.length==2){
                if("role".equals(attr[0])){
                    Role role=getService().retrieve(Role.class, Long.parseLong(attr[1]));
                    roles.add(role);
                }
            }
        }   
    }
    
	public void setNode(String node) {
		this.node = node;
	}    
    
    
}