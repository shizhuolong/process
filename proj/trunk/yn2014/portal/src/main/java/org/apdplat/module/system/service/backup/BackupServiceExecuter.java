package org.apdplat.module.system.service.backup;

import org.apdplat.module.system.service.PropertyHolder;
import org.apdplat.platform.util.SpringContextUtils;
import org.springframework.stereotype.Service;

/**
 *执行备份恢复的服务，自动判断使用的是什么数据库，并找到该数据库备份恢复服务的实现并执行
 * @author sun
 */
@Service
public class BackupServiceExecuter extends BackupService{  
    private BackupService backupService=null;
    /**
     * 查找并执行正在使用的数据的备份实现实例
     * @return 
     */
    @Override
    public boolean backupImpl() {
        if(backupService==null){
            backupService=SpringContextUtils.getBean(PropertyHolder.getProperty("jpa.database"));
        }
        return backupService.backupImpl();
    }
    /**
     * 查找并执行正在使用的数据的恢复实现实例
     * @param date
     * @return 
     */
    @Override
    public boolean restoreImpl(String date) {
        if(backupService==null){
            backupService=SpringContextUtils.getBean(PropertyHolder.getProperty("jpa.database"));
        }
        return backupService.restoreImpl(date);
    }    
}