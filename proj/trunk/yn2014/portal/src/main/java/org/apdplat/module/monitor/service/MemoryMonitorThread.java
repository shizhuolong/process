package org.apdplat.module.monitor.service;

import org.apdplat.module.monitor.model.MemoryState;
import org.apdplat.module.system.service.LogQueue;
import org.apdplat.module.system.service.SystemListener;
import org.apdplat.platform.log.APDPlatLogger;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Date;

/**
 *
 * @author sun
 */
public class MemoryMonitorThread extends Thread{
    protected static final APDPlatLogger LOG = new APDPlatLogger(MemoryMonitorThread.class);
    public boolean running=true;
    private int circle=10;
    public MemoryMonitorThread(int circle){
        this.setDaemon(true);
        this.setName("内存监视线程(Memory monitor thread)");
        LOG.info("内存监视间隔为(Memory monitor interval) "+circle+" 分钟(min)");
        this.circle=circle;
    }
    
    @Override
    public void run(){
        LOG.info("内存监视线程启动(Launch memory monitor thread)");
        while(running){
            log();
            try {
                Thread.sleep(circle*60*1000);
            } catch (InterruptedException ex) {
                if(!running){
                    LOG.info("内存监视线程退出(Exit memory monitor thread)");
                }else{
                    LOG.error("内存监视线程出错(Error in memory monitor thread)",ex);
                }
            }
        }
    }
    private void log(){        
        float max=(float)Runtime.getRuntime().maxMemory()/1000000;
        float total=(float)Runtime.getRuntime().totalMemory()/1000000;
        float free=(float)Runtime.getRuntime().freeMemory()/1000000;
        
        MemoryState logger=new MemoryState();
        try {
            logger.setServerIP(InetAddress.getLocalHost().getHostAddress());
        } catch (UnknownHostException ex) {
            LOG.error("用户记录日志出错(Error in user record log)",ex);
        }
        logger.setAppName(SystemListener.getContextPath());
        logger.setRecordTime(new Date());
        logger.setMaxMemory(max);
        logger.setTotalMemory(total);
        logger.setFreeMemory(free);
        logger.setUsableMemory(logger.getMaxMemory()-logger.getTotalMemory()+logger.getFreeMemory());
        LogQueue.addLog(logger);
    }
}