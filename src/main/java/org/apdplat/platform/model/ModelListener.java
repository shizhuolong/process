package org.apdplat.platform.model;

import org.apdplat.module.log.model.OperateLog;
import org.apdplat.module.log.model.OperateLogType;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.module.system.service.LogQueue;
import org.apdplat.module.system.service.PropertyHolder;
import org.apdplat.module.system.service.SystemListener;
import org.apdplat.platform.annotation.IgnoreBusinessLog;
import org.apdplat.platform.annotation.IgnoreUser;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.platform.util.SpringContextUtils;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Date;
import javax.persistence.PostLoad;
import javax.persistence.PostPersist;
import javax.persistence.PostRemove;
import javax.persistence.PostUpdate;
import javax.persistence.PrePersist;
import javax.persistence.PreRemove;
import javax.persistence.PreUpdate;
/**
 * 模型监听器
 * @author sun
 *
 */
public class ModelListener {
    protected static final APDPlatLogger LOG = new APDPlatLogger(ModelListener.class);
    
    private static final boolean create;
    private static final boolean delete;
    private static final boolean update;
    
    static{
        create=PropertyHolder.getBooleanProperty("log.create");
        delete=PropertyHolder.getBooleanProperty("log.delete");
        update=PropertyHolder.getBooleanProperty("log.update");
        if(create){
            LOG.info("启用添加数据日志(Enable add data log)");
        }else{
            LOG.info("禁用添加数据日志(Disable add data log)");
        }
        if(delete){
            LOG.info("启用删除数据日志(Enable delete data log)");
        }else{
            LOG.info("禁用删除数据日志(Disable delete data log)");
        }
        if(update){
            LOG.info("启用更新数据日志(Enable update data log)");
        }else{
            LOG.info("禁用更新数据日志(Disable update data log)");
        }
    }


    @PrePersist
    public void prePersist(Model model) {
        User user=UserHolder.getCurrentLoginUser();
        if(model instanceof SimpleModel){
            SimpleModel simpleModel = (SimpleModel)model;
            if(user!=null && simpleModel.getOwnerUser()==null && !model.getClass().isAnnotationPresent(IgnoreUser.class)){
                //设置数据的拥有者
                simpleModel.setOwnerUser(user);
            }
        }
        //设置创建时间
        model.setCreateTime(new Date());
    }

    @PostPersist
    public void postPersist(Model model) {
        if(create){
            saveLog(model,OperateLogType.ADD);
        }
    }
    private void saveLog(Model model, String type){
        if(!model.getClass().isAnnotationPresent(IgnoreBusinessLog.class)){
            User user=UserHolder.getCurrentLoginUser();
            String ip=UserHolder.getCurrentUserLoginIp();
            OperateLog operateLog=new OperateLog();
            if(user != null){
                operateLog.setUsername(user.getUsername());
            }
            operateLog.setLoginIP(ip);
            try {
                operateLog.setServerIP(InetAddress.getLocalHost().getHostAddress());
            } catch (UnknownHostException ex) {
                ex.printStackTrace();
            }
            operateLog.setAppName(SystemListener.getContextPath());
            operateLog.setOperatingTime(new Date());
            operateLog.setOperatingType(type);
            operateLog.setOperatingModel(model.getMetaData());
            operateLog.setOperatingID(model.getId());
            LogQueue.addLog(operateLog);
        }
    }
    @PreRemove
    public void preRemove(Model model) {

    }

    @PostRemove
    public void postRemove(Model model) {
        if(delete){
            saveLog(model,OperateLogType.DELETE);
        }
    }

    @PreUpdate
    public  void preUpdate(Model model) {
        //设置更新时间
        model.setUpdateTime(new Date());
    }

    @PostUpdate
    public void postUpdate(Model model) {
        if(update){
            saveLog(model,OperateLogType.UPDATE);
        }
    }

    @PostLoad
    public void postLoad(Model model) {
    }
}