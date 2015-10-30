package org.apdplat.module.security.model;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OrderBy;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;

import org.apdplat.module.module.model.AppModule;
import org.apdplat.module.module.model.Command;
import org.apdplat.module.module.model.Module;
import org.apdplat.platform.annotation.Database;
import org.apdplat.platform.annotation.ModelAttr;
import org.apdplat.platform.annotation.ModelCollRef;
import org.apdplat.platform.model.SimpleModel;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Entity
@Scope("prototype")
@Component
@Table(name = "APDP_USER",
uniqueConstraints = {
    @UniqueConstraint(columnNames = {"username"})})
@XmlRootElement
@XmlType(name = "User")
@Database
public class AppUser extends SimpleModel{
	//用户拥有的角色
	@ManyToMany(cascade = CascadeType.REFRESH, fetch = FetchType.LAZY)
    @JoinTable(name = "APDP_APP_USER_ROLE", joinColumns = {
    @JoinColumn(name = "userID")}, inverseJoinColumns = {
    @JoinColumn(name = "roleID")})
    @OrderBy("id")
    @ModelAttr("用户拥有的角色列表")
    @ModelCollRef("roleName")
    protected List<AppRole> roles = new ArrayList<>();
    //用户拥有的模块
    @ManyToMany(cascade = CascadeType.REFRESH, fetch = FetchType.LAZY)
    @JoinTable(name = "APDP_APP_USER_MODULE", joinColumns = {
    @JoinColumn(name = "userID")}, inverseJoinColumns = {
    @JoinColumn(name = "moduleID")})
    @OrderBy("id")
    protected List<AppModule> modules = new ArrayList<>();
  
    public String getModuleStr(){
        if(this.modules==null || this.modules.isEmpty()){
            return "";
        }
        StringBuilder ids=new StringBuilder();
       
        for(AppModule module : this.modules){
            ids.append("module-").append(module.getId()).append(",");
        }
        ids=ids.deleteCharAt(ids.length()-1);
        return ids.toString();
    }
    public String getRoleStr(){
        if(this.roles==null || this.roles.isEmpty()){
            return "";
        }
        StringBuilder ids=new StringBuilder();
       
        for(AppRole role : this.roles){
            ids.append("role-").append(role.getId()).append(",");
        }
        ids=ids.deleteCharAt(ids.length()-1);
        return ids.toString();
    }
    

    public List<AppRole> getRoles() {
		return roles;
	}
	public void setRoles(List<AppRole> roles) {
		this.roles = roles;
	}
	public List<AppModule> getModules() {
		return modules;
	}
	public void setModules(List<AppModule> modules) {
		this.modules = modules;
	}
	public void addRole(AppRole role) {
        this.roles.add(role);
    }
    public void removeRole(AppRole role) {
        this.roles.remove(role);
    }
    public void addAppModule(AppModule module) {
        this.modules.add(module);
    }
    public void removeAppModule(AppModule module) {
        this.modules.remove(module);
    }
         
    @Override
    public String getMetaData() {
        return "用户信息";
    }
}