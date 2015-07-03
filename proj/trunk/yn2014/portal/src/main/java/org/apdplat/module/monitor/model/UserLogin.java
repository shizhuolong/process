package org.apdplat.module.monitor.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.apdplat.platform.annotation.Database;
import org.apdplat.platform.annotation.IgnoreBusinessLog;
import org.apdplat.platform.annotation.IgnoreUser;
import org.apdplat.platform.annotation.ModelAttr;
import org.apdplat.platform.generator.ActionGenerator;
import org.apdplat.platform.model.Model;
import org.apdplat.platform.util.ConvertUtils;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

/**
 *
 *不需要保存该模型的增删改日志
 * 不需要自动设置模型的添加用户
 * @author sun
 */
@Entity
@Scope("prototype")
@Component
@IgnoreBusinessLog
@IgnoreUser
@Table(name="APDP_LOG_USERLOGIN")
@Database("log")
public class UserLogin extends Model {
    public String getOnlineTimeStr(){
        return ConvertUtils.getTimeDes(onlineTime);
    }
    @ModelAttr("登录IP地址")
    protected String loginIP;
    
    @ModelAttr("用户代理")
    @Column(length=2550)
    protected String userAgent;
    
    @ModelAttr("服务器IP地址")
    protected String serverIP;

    @ModelAttr("应用系统名称")
    protected String appName;

    @Temporal(TemporalType.TIMESTAMP)
    @ModelAttr("登录时间")
    protected Date loginTime;

    @Temporal(TemporalType.TIMESTAMP)
    @ModelAttr("注销时间")
    protected Date logoutTime;

    //单位为毫秒
    @ModelAttr("用户在线时间")
    protected Long onlineTime;

    
    //用户名不分词
    @ModelAttr("用户名")
    protected String username;    

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
    
    public Long getOnlineTime() {
        return onlineTime;
    }

    public void setOnlineTime(Long onlineTime) {
        this.onlineTime = onlineTime;
    }
    
    public String getLoginIP() {
        return loginIP;
    }

    public void setLoginIP(String loginIP) {
        this.loginIP = loginIP;
    }

    public String getServerIP() {
        return serverIP;
    }

    public void setServerIP(String serverIP) {
        this.serverIP = serverIP;
    }

    public String getAppName() {
        return appName;
    }

    public void setAppName(String appName) {
        this.appName = appName;
    }

    public Date getLoginTime() {
        return loginTime;
    }

    public void setLoginTime(Date loginTime) {
        this.loginTime = loginTime;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }

    public Date getLogoutTime() {
        return logoutTime;
    }

    public void setLogoutTime(Date logoutTime) {
        this.logoutTime = logoutTime;
    }
    @Override
    public String getMetaData() {
        return "用户登陆注销日志";
    }
    public static void main(String[] args){
        UserLogin obj=new UserLogin();
        //生成Action
        ActionGenerator.generate(obj.getClass());
    }
}