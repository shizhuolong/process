package org.apdplat.module.security.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementWrapper;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;
import javax.xml.bind.annotation.XmlType;

import org.apdplat.module.module.model.AppModule;
import org.apdplat.module.module.model.Command;
import org.apdplat.module.module.model.Module;
import org.apdplat.platform.annotation.Database;
import org.apdplat.platform.annotation.ModelAttr;
import org.apdplat.platform.annotation.ModelAttrRef;
import org.apdplat.platform.annotation.ModelCollRef;
import org.apdplat.platform.annotation.RenderIgnore;
import org.apdplat.platform.generator.ActionGenerator;
import org.apdplat.platform.model.SimpleModel;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Entity
@Scope("prototype")
@Component
@Table(name = "APDP_APP_ROLE",
uniqueConstraints = {
    @UniqueConstraint(columnNames = {"roleName"})})
@XmlRootElement
@XmlType(name = "Role")
@Database
public class AppRole extends SimpleModel {
    @Column(length=40)
    @ModelAttr("角色名")
    protected String roleName;
    @ModelAttr("备注")
    protected String des;

    @ManyToOne
    @ModelAttr("上级角色")
    @ModelAttrRef("roleName")
    protected AppRole parent;

    @RenderIgnore
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "parent")
    @OrderBy("id DESC")
    @ModelAttr("下级角色")
    @ModelCollRef("roleName")
    protected List<AppRole> child = new ArrayList<>();
    @ManyToMany(cascade = CascadeType.REFRESH, mappedBy = "roles", fetch = FetchType.LAZY)
    protected List<AppUser> users=new ArrayList<>();
    @ModelAttr("超级管理员")
    protected boolean superManager = false;
    /**
     * 角色拥有的模块
     */
    @ManyToMany(cascade = CascadeType.REFRESH, fetch = FetchType.LAZY)
    @JoinTable(name = "APDP_APP_ROLE_MODULE", joinColumns = {
    @JoinColumn(name = "roleID")}, inverseJoinColumns = {
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
    @XmlAttribute
    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    @XmlAttribute
    public String getDes() {
        return des;
    }

    public void setDes(String des) {
        this.des = des;
    }

    @XmlTransient
    public AppRole getParent() {
        return parent;
    }

    public void setParent(AppRole parent) {
        this.parent = parent;
    }

    @XmlElementWrapper(name = "subRoles")
    @XmlElement(name = "role")
    public List<AppRole> getChild() {
        return this.child;
    }

    public void addChild(AppRole child) {
        this.child.add(child);
    }

    public void removeChild(AppRole child) {
        this.child.remove(child);
    }

    public void clearChild() {
        this.child.clear();
    }
    @XmlAttribute
    public boolean isSuperManager() {
        return superManager;
    }

    public void setSuperManager(boolean superManager) {
        this.superManager = superManager;
    }

    public void setAppModules(List<AppModule> modules) {
        this.modules = modules;
    }

    @XmlTransient
    public List<AppModule> getAppModules() {
        return Collections.unmodifiableList(modules);
    }
  
    public void addAppModules(AppModule module) {
        this.modules.add(module);
    }
  
    public void removeAppModules(AppModule module) {
        this.modules.remove(module);
    }
    public void clearAppModules() {
    	modules.clear();
    }
    @XmlTransient
    public List<AppUser> getUsers() {
        return Collections.unmodifiableList(users);
    } 
    @Override
    public String getMetaData() {
        return "角色信息";
    }

    public static void main(String[] args){
        AppRole obj=new AppRole();
        //生成Action
        ActionGenerator.generate(obj.getClass());
    }
}