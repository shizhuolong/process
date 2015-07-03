package org.apdplat.module.security.model;

import org.apdplat.module.module.model.Command;
import org.apdplat.module.module.model.Module;
import org.apdplat.platform.annotation.ModelAttr;
import org.apdplat.platform.annotation.ModelAttrRef;
import org.apdplat.platform.annotation.ModelCollRef;
import org.apdplat.platform.generator.ActionGenerator;
import org.apdplat.platform.service.ServiceFacade;
import org.apdplat.platform.util.SpringContextUtils;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OrderBy;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;
import javax.xml.bind.annotation.XmlType;

import org.apdplat.platform.annotation.Database;
import org.apdplat.platform.model.SimpleModel;
import org.springframework.context.annotation.Scope;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
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
public class User extends SimpleModel  implements UserDetails{
    @ManyToOne
    @ModelAttr("组织架构")
    @ModelAttrRef("orgName")
    protected Org org;

    //用户名不分词
    @ModelAttr("用户名")
    protected String username;

    @ModelAttr("姓名")
    protected String realName;

    @ModelAttr("密码")
    protected String password;

    @ModelAttr("备注")
    protected String des;
    
    @ManyToMany(cascade = CascadeType.REFRESH, fetch = FetchType.LAZY)
    @JoinTable(name = "APDP_USER_ROLE", joinColumns = {
    @JoinColumn(name = "userID")}, inverseJoinColumns = {
    @JoinColumn(name = "roleID")})
    @OrderBy("id")
    @ModelAttr("用户拥有的角色列表")
    @ModelCollRef("roleName")
    protected List<Role> roles = new ArrayList<>();
    
    @ManyToMany(cascade = CascadeType.REFRESH, fetch = FetchType.LAZY)
    @JoinTable(name = "APDP_USER_USERGROUP", joinColumns = {
    @JoinColumn(name = "userID")}, inverseJoinColumns = {
    @JoinColumn(name = "userGroupID")})
    @OrderBy("id")
    @ModelAttr("用户拥有的用户组列表")
    @ModelCollRef("userGroupName")
    protected List<UserGroup> userGroups = new ArrayList<>();
    
    @ManyToMany(cascade = CascadeType.REFRESH, fetch = FetchType.LAZY)
    @JoinTable(name = "APDP_USER_POSITION", joinColumns = {
    @JoinColumn(name = "userID")}, inverseJoinColumns = {
    @JoinColumn(name = "positionID")})
    @OrderBy("id")
    @ModelAttr("用户拥有的岗位列表")
    @ModelCollRef("positionName")
    protected List<Position> positions = new ArrayList<>();

    @ModelAttr("账号过期")
    protected boolean accountexpired = false;
    @ModelAttr("账户锁定")
    protected boolean accountlocked = false;
    @ModelAttr("信用过期")
    protected boolean credentialsexpired = false;
    @ModelAttr("账户可用")
    protected boolean enabled = true;
    
    @ModelAttr("联系电话")
    protected String phone;
    @ModelAttr("邮箱")
    protected String email;
    protected String cardId;//身份证号
    
    @Column(name="OA_COM_ID")
    private String oaComId;
    @Column(name="OA_COM_NAME")
    private String oaComName;
    @Column(name="OA_DEP_ID")
    private String oaDepId;
    @Column(name="OA_DEP_NAME")
    private String oaDepName;
    @Column(name="OA_JOB_ID")
    private String oaJobId;
    @Column(name="OA_JOB_NAME")
    private String oaJobName;
    @Column(name="HR_ID")
    private String hrId;		//HR编码
    @Column(name="USER_TYPE")
    private String userType;	//用户类型 0：正式员工  1：紧密外包  2：派遣

    /**
     * 用户是否为超级管理员
     * @return
     */
    public boolean isSuperManager(){
        if(this.roles != null && !this.roles.isEmpty()) {
            for(Role role : this.roles){
                if(role.isSuperManager()) {
                    return true;
                }
            }
        }
        if(this.userGroups != null && !this.userGroups.isEmpty()){
            for(UserGroup userGroup : this.userGroups){
                for(Role role : userGroup.getRoles()){
                    if(role.isSuperManager()) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
    public String getRoleStrs(){
        if(this.roles==null || this.roles.isEmpty()) {
            return "";
        }
        StringBuilder result=new StringBuilder();
        for(Role role : this.roles){
            result.append("role-").append(role.getId()).append(",");
        }
        result=result.deleteCharAt(result.length()-1);
        return result.toString();
    }
    
    public String getPositionStrs(){
        if(this.positions==null || this.positions.isEmpty()) {
            return "";
        }
        StringBuilder result=new StringBuilder();
        for(Position position : this.positions){
            result.append("position-").append(position.getId()).append(",");
        }
        result=result.deleteCharAt(result.length()-1);
        return result.toString();
    }
    
    public String getUserGroupStrs(){
        if(this.userGroups==null || this.userGroups.isEmpty()) {
            return "";
        }
        StringBuilder result=new StringBuilder();
        for(UserGroup userGroup : this.userGroups){
            result.append("userGroup-").append(userGroup.getId()).append(",");
        }
        result=result.deleteCharAt(result.length()-1);
        return result.toString();
    }

    public List<Command> getCommand() {
        List<Command> result = new ArrayList<>();

        if(this.roles != null && !this.roles.isEmpty()) {
            //如果用户为超级管理员
            for (Role role : this.roles) {
                if (role.isSuperManager()) {
                    return getAllCommand();
                }
            }
            //如果用户不是超级管理员则进行一下处理
            for (Role role : this.roles) {
                result.addAll(role.getCommands());
            }
        }
        if(this.userGroups != null && !this.userGroups.isEmpty()){
            for(UserGroup userGroup : this.userGroups){
                //如果用户为超级管理员
                for(Role role : userGroup.getRoles()){
                    if(role.isSuperManager()) {
                        return getAllCommand();
                    }
                }
                //如果用户不是超级管理员则进行一下处理
                for(Role role : userGroup.getRoles()){
                    result.addAll(role.getCommands());
                }
            }
        }
        if(this.positions != null && !this.positions.isEmpty()) {
            for (Position position : this.positions) {
                result.addAll(position.getCommands());
            }
        }
        return result;
    }

    private List<Command> getAllCommand(){
    	ServiceFacade serviceFacade = SpringContextUtils.getBean("serviceFacade");
        List<Command> allCommand = serviceFacade.query(Command.class).getModels();
        return allCommand;
    }

    public List<Module> getModule() {
        List<Module> result = new  ArrayList<>();

        if(this.roles != null && !this.roles.isEmpty()) {
            //如果用户为超级管理员
            for (Role role : this.roles) {
                if (role.isSuperManager()) {
                    return getAllModule();
                }
            }
            //如果用户不是超级管理员则进行一下处理
            for (Role role : this.roles) {
                result.addAll(assemblyModule(role.getCommands()));
            }
        }
        if(this.userGroups != null && !this.userGroups.isEmpty()){
            for(UserGroup userGroup : this.userGroups){
                //如果用户为超级管理员
                for(Role role : userGroup.getRoles()){
                    if(role.isSuperManager()) {
                        return getAllModule();
                    }
                }
                //如果用户不是超级管理员则进行一下处理
                for(Role role : userGroup.getRoles()){
                    result.addAll(assemblyModule(role.getCommands()));
                }
            }
        }
        if(this.positions != null && !this.positions.isEmpty()) {
            for (Position position : this.positions) {
                result.addAll(assemblyModule(position.getCommands()));
            }
        }

        return result;
    }
    private List<Module> getAllModule(){
    	ServiceFacade serviceFacade = SpringContextUtils.getBean("serviceFacade");
        List<Module> allModule = serviceFacade.query(Module.class).getModels();
        return allModule;
    }
    private List<Module> assemblyModule(List<Command> commands){
        List<Module> modules=new ArrayList<>();
        if(commands==null) {
            return modules;
        }
        
        for(Command command : commands){
            if(command!=null){
                Module module=command.getModule();
                if(module!=null){
                    modules.add(module);
                    assemblyModule(modules,module);
                }
            }
        }
        return modules;
    }
    private void assemblyModule(List<Module> modules,Module module){
        if(module!=null){
            Module parentModule=module.getParentModule();
            if(parentModule!=null){
                modules.add(parentModule);
                assemblyModule(modules,parentModule);
            }
        }
    }
    public String getAuthoritiesStr(){
        StringBuilder result=new StringBuilder();
        for(GrantedAuthority auth : getAuthorities()){
            result.append(auth.getAuthority()).append(",");
        }
        return result.toString();
    }
    /**
     * 获取授予用户的权利
     * @return
     */
    @Override
    public Collection<GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> grantedAuthArray=new HashSet<>();

        LOG.debug("user privilege:");
        //如果用户是超级管理员，则只需加入ROLE_SUPERMANAGER标识
        //就不用对其他的权限对象进行检查
        if(isSuperManager()){
            grantedAuthArray.add(new SimpleGrantedAuthority("ROLE_SUPERMANAGER"));
            LOG.debug("ROLE_SUPERMANAGER");
        }else{
            if(this.roles != null && !this.roles.isEmpty()) {
                LOG.debug("     roles:");
                for (Role role : this.roles) {
                    for (String priv : role.getAuthorities()) {
                        LOG.debug(priv);
                        grantedAuthArray.add(new SimpleGrantedAuthority(priv.toUpperCase()));
                    }
                }
            }
            if(this.userGroups != null && !this.userGroups.isEmpty()){
                LOG.debug("     userGroups:");
                for(UserGroup userGroup : this.userGroups){
                    for(Role role : userGroup.getRoles()){
                        for (String priv : role.getAuthorities()) {
                            LOG.debug(priv);
                            grantedAuthArray.add(new SimpleGrantedAuthority(priv.toUpperCase()));
                        }
                    }
                }
            }        
            if(this.positions != null && !this.positions.isEmpty()) {
                LOG.debug("     positions:");
                for (Position position : this.positions) {
                    for (String priv : position.getAuthorities()) {
                        LOG.debug(priv);
                        grantedAuthArray.add(new SimpleGrantedAuthority(priv.toUpperCase()));
                    }
                }
            }
        }
        if(grantedAuthArray.isEmpty()){
            return null;
        }
        grantedAuthArray.add(new SimpleGrantedAuthority("ROLE_MANAGER"));
        LOG.debug("ROLE_MANAGER");
        return grantedAuthArray;
    }

    @Override
    public boolean isAccountNonExpired() {
        return !accountexpired;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !accountlocked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return !credentialsexpired;
    }

    public String getRealName() {
        return realName;
    }

    public void setRealName(String realName) {
        this.realName = realName;
    }

    @Override
    @XmlAttribute
    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public void setAccountexpired(boolean accountexpired) {
        this.accountexpired = accountexpired;
    }

    public void setAccountlocked(boolean accountlocked) {
        this.accountlocked = accountlocked;
    }

    public void setCredentialsexpired(boolean credentialsexpired) {
        this.credentialsexpired = credentialsexpired;
    }

    @XmlTransient
    public List<UserGroup> getUserGroups() {
        return Collections.unmodifiableList(this.userGroups);
    }

    public void setUserGroups(List<UserGroup> userGroups) {
        this.userGroups = userGroups;
    }

    public void addUserGroup(UserGroup userGroup) {
        this.userGroups.add(userGroup);
    }

    public void removeUserGroup(UserGroup userGroup) {
        this.userGroups.remove(userGroup);
    }

    public void clearUserGroup() {
        this.userGroups.clear();
    }

    @XmlTransient
    public List<Role> getRoles() {
        return Collections.unmodifiableList(this.roles);
    }

    public void addRole(Role role) {
        this.roles.add(role);
    }

    public void removeRole(Role role) {
        this.roles.remove(role);
    }

    public void clearRole() {
        this.roles.clear();
    }
    

    @XmlTransient
    public List<Position> getPositions() {
        return Collections.unmodifiableList(this.positions);
    }

    public void addPosition(Position position) {
        this.positions.add(position);
    }

    public void removePosition(Position position) {
        this.positions.remove(position);
    }

    public void clearPosition() {
        this.positions.clear();
    }
            
    @Override
    @XmlAttribute
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @XmlAttribute
    public String getDes() {
        return des;
    }

    public void setDes(String des) {
        this.des = des;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @XmlTransient
    public Org getOrg() {
        return org;
    }

    public void setOrg(Org org) {
        this.org = org;
    }

    @Override
    @XmlAttribute
    public String getUsername() {
        return username;
    }
    @Override
    public String getMetaData() {
        return "用户信息";
    }
    
    

    public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getCardId() {
		return cardId;
	}

	public void setCardId(String cardId) {
		this.cardId = cardId;
	}
	
	
	public String getOaComId() {
		return oaComId;
	}
	public void setOaComId(String oaComId) {
		this.oaComId = oaComId;
	}

	public String getOaComName() {
		return oaComName;
	}
	public void setOaComName(String oaComName) {
		this.oaComName = oaComName;
	}

	public String getOaDepId() {
		return oaDepId;
	}
	public void setOaDepId(String oaDepId) {
		this.oaDepId = oaDepId;
	}

	public String getOaDepName() {
		return oaDepName;
	}
	public void setOaDepName(String oaDepName) {
		this.oaDepName = oaDepName;
	}

	public String getOaJobId() {
		return oaJobId;
	}
	public void setOaJobId(String oaJobId) {
		this.oaJobId = oaJobId;
	}

	public String getOaJobName() {
		return oaJobName;
	}
	public void setOaJobName(String oaJobName) {
		this.oaJobName = oaJobName;
	}
	
	public String getHrId() {
		return hrId;
	}

	public void setHrId(String hrId) {
		this.hrId = hrId;
	}

	public String getUserType() {
		return userType;
	}

	public void setUserType(String userType) {
		this.userType = userType;
	}

	public static void main(String[] args){
        User obj=new User();
        //生成Action
        ActionGenerator.generate(obj.getClass());
    }
}