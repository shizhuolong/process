package org.apdplat.module.security.action;

import java.util.Map;

import org.apache.struts2.convention.annotation.Namespace;
import org.apdplat.module.module.model.AppModule;
import org.apdplat.module.security.model.AppRole;
import org.apdplat.module.security.model.AppUser;
import org.apdplat.module.security.model.Role;
import org.apdplat.platform.action.ExtJSSimpleAction;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

@Scope("prototype")
@Controller
@Namespace("/security")
public class AppUserAction extends ExtJSSimpleAction<AppUser> {
	private String roles;
	private String modules;
	
	
	public void setRoles(String roles) {
		this.roles = roles;
	}
	
	public void setModules(String modules) {
		this.modules = modules;
	}
	public void assemblyRoles(AppUser model) {
		model.getRoles().clear();
		if (roles != null && !"".equals(roles.trim())) {
			String[] roleIds = roles.trim().split(",");
			for (String id : roleIds) {
				String[] attr = id.split("-");
				if (attr.length == 2) {
					long roleId = Long.parseLong(attr[1]);
					AppRole temp = getService().retrieve(AppRole.class, roleId);
					if (temp != null) {
						model.addRole(temp);
					}
				}
			}
		}
	}

	public void assemblyModules(AppUser model) {
		model.getModules().clear();
		if (modules != null && !"".equals(modules.trim())) {
			String[] moduleIds = modules.trim().split(",");
			for (String id : moduleIds) {
				String[] attr = id.split("-");
				if (attr.length == 2) {
					long moduleId = Long.parseLong(attr[1]);
					AppModule temp = getService().retrieve(AppModule.class,
							moduleId);
					if (temp != null) {
						model.addAppModule(temp);
					}
				}
			}
		}
	}
	@Override
    protected void retrieveAfterRender(Map map,AppUser model){
        map.put("roles", model.getRoleStr());
        map.put("modules", model.getModuleStr());
    }
	@Override
    public void assemblyModelForUpdate(AppUser model){
		assemblyRoles(model);
		assemblyModules(model);
    }
}