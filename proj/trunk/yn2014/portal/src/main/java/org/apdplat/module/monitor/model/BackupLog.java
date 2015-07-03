package org.apdplat.module.monitor.model;

import java.util.Date;

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
 *不需要保存该模型的增删改日志
 * 不需要自动设置模型的添加用户
 * @author sun
 */
@Entity
@Scope("prototype")
@Component
@IgnoreBusinessLog
@IgnoreUser
@Table(name="APDP_LOG_BACKUPLOG")
@Database("log")
public class BackupLog extends Model {
    public String getProcessTimeStr(){
        return ConvertUtils.getTimeDes(processTime);
    }
    @ModelAttr("登录IP地址")
    protected String loginIP;
    @ModelAttr("服务器IP地址")
    protected String serverIP;
    @ModelAttr("应用系统名称")
    protected String appName;
    
    @Temporal(TemporalType.TIMESTAMP)
    @ModelAttr("开始备份时间")
    protected Date startTime;

    @Temporal(TemporalType.TIMESTAMP)
    @ModelAttr("备份完成时间")
    protected Date endTime;

    //单位为毫秒
    @ModelAttr("操作耗时")
    protected Long processTime;

    @ModelAttr("操作类型")
    protected String operatingType;
    @ModelAttr("操作结果")
    protected String operatingResult;

    
    //用户名不分词
    @ModelAttr("用户名")
    protected String username;    

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
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

    public String getOperatingResult() {
        return operatingResult;
    }

    public void setOperatingResult(String operatingResult) {
        this.operatingResult = operatingResult;
    }

    public Long getProcessTime() {
        return processTime;
    }

    public void setProcessTime(Long processTime) {
        this.processTime = processTime;
    }

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }


    public String getOperatingType() {
        return operatingType;
    }

    public void setOperatingType(String operatingType) {
        this.operatingType = operatingType;
    }

    @Override
    public String getMetaData() {
        return "备份恢复日志";
    }
    public static void main(String[] args){
        BackupLog obj=new BackupLog();
        //生成Action
        ActionGenerator.generate(obj.getClass());
    }
}