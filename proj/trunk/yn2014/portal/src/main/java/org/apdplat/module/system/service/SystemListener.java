package org.apdplat.module.system.service;

import org.apdplat.module.dictionary.generator.DictionaryGenerator;
import org.apdplat.module.monitor.model.RuningTime;
import org.apdplat.module.monitor.service.MemoryMonitorThread;
import org.apdplat.module.security.service.UserLoginListener;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.platform.util.FileUtils;
import java.io.File;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.sql.Driver;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Date;
import java.util.Enumeration;
import java.util.Locale;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import org.apdplat.platform.util.SpringContextUtils;
import org.springframework.orm.jpa.EntityManagerFactoryUtils;
import org.springframework.orm.jpa.EntityManagerHolder;
import org.springframework.transaction.support.TransactionSynchronizationManager;
/**
 * 系统启动和关闭的监听器,由Spring来调用
 * @author sun
 *
 */
public class SystemListener{
    protected static final APDPlatLogger LOG = new APDPlatLogger(SystemListener.class);
    
    private static boolean running=false;
    
    private static String basePath;
    private static String contextPath;
    private static RuningTime runingTime=null;
    private static final  boolean memoryMonitor;
    private static final  boolean runingMonitor;
    private static MemoryMonitorThread memoryMonitorThread;
    static{
        memoryMonitor=PropertyHolder.getBooleanProperty("monitor.memory");        
        if(memoryMonitor){
            LOG.info("启用内存监视日志");
            LOG.info("Enable memory monitor log", Locale.ENGLISH);
        }else{
            LOG.info("禁用内存监视日志");
            LOG.info("Disable memory monitor log", Locale.ENGLISH);
        }
        runingMonitor=PropertyHolder.getBooleanProperty("monitor.runing");
        if(runingMonitor){
            LOG.info("启用系统运行日志");
            LOG.info("Enable system log", Locale.ENGLISH);
        }else{
            LOG.info("禁用系统运行日志");
            LOG.info("Disable system log", Locale.ENGLISH);
        }
    }

    public static boolean isRunning() {
        return running;
    }
    
    public static void prepareForSpring(){
        //供spring扫描组件用
        String basePackage=PropertyHolder.getProperty("basePackages");
        String localBasePackage=PropertyHolder.getProperty("basePackages.local");
        if(localBasePackage!=null && !"".equals(localBasePackage.trim())){
            basePackage=basePackage+","+localBasePackage;
        }
        System.setProperty("basePackage", basePackage);        
    }
    public static void contextInitialized(ServletContextEvent sce) {
        contextPath=sce.getServletContext().getContextPath();
        ServletContext sc=sce.getServletContext();
        basePath=sc.getRealPath("/");
        if(!basePath.endsWith(File.separator)){
            basePath=basePath+File.separator;
        }
        //整个系统中的文件操作都以basePath为基础
        FileUtils.setBasePath(basePath);
        LOG.info("basePath:"+basePath);
        String userDir = System.getProperty("user.dir");
        LOG.info("user.dir:"+userDir);
        userDir=FileUtils.getAbsolutePath("/WEB-INF/classes/data/");
        System.setProperty("user.dir", userDir);
        LOG.info("将user.dir重新设置为:"+userDir);
        
        String encoding=System.getProperty("file.encoding"); 
        LOG.info("你的操作系统所用的编码file.encoding："+encoding);
        LOG.info("Encoding of your OS is file.encoding："+encoding, Locale.ENGLISH);
        
        //为spring的配置做预处理
        prepareForSpring();
        //注册模块
 //       registerModules();
        //解析所有的dic.xml文件，并生成供客户端EXT JS调用的文件
 //       DictionaryGenerator.generateDic(basePath);
        
        if(runingMonitor){
            LOG.info("记录服务器启动日志");
            LOG.info("Recording the server boot logging", Locale.ENGLISH);
            runingTime=new RuningTime();
            try {
                runingTime.setServerIP(InetAddress.getLocalHost().getHostAddress());
            } catch (UnknownHostException e) {
                LOG.error("记录服务器启动日志出错", e);
                LOG.error("Failed to record the server boot logging", e, Locale.ENGLISH);
            }
            runingTime.setAppName(contextPath);
            runingTime.setOsName(System.getProperty("os.name"));
            runingTime.setOsVersion(System.getProperty("os.version"));
            runingTime.setOsArch(System.getProperty("os.arch"));
            runingTime.setJvmName(System.getProperty("java.vm.name"));
            runingTime.setJvmVersion(System.getProperty("java.vm.version"));
            runingTime.setJvmVendor(System.getProperty("java.vm.vendor"));
            runingTime.setStartupTime(new Date());
        }
        if(memoryMonitor){
            LOG.info("启动内存监视线程");
            LOG.info("Enable memory monitor thread", Locale.ENGLISH);
            int circle=PropertyHolder.getIntProperty("monitor.memory.circle");
            memoryMonitorThread=new MemoryMonitorThread(circle);
            memoryMonitorThread.start();
        }
        running=true;
    }
    public static void contextDestroyed(ServletContextEvent sce) {
        UserLoginListener.forceAllUserOffline();
        
        if(runingMonitor){
            LOG.info("记录服务器关闭日志");
            LOG.info("Recording the server shutdown logging", Locale.ENGLISH);             
            runingTime.setShutdownTime(new Date());
            runingTime.setRuningTime(runingTime.getShutdownTime().getTime()-runingTime.getStartupTime().getTime());
            LogQueue.addLog(runingTime);
        }
        if(memoryMonitor){
            LOG.info("停止内存监视线程");
            LOG.info("Stop memory monitor thread", Locale.ENGLISH);
            memoryMonitorThread.running=false;
            memoryMonitorThread.interrupt();
        }
        
        if(LogQueue.getLogQueue()!=null){
            //在关闭系统的时候，保存日志数据需要打开日志数据库em
            EntityManagerFactory entityManagerFactoryForLog = SpringContextUtils.getBean("entityManagerFactoryForLog");
            openEntityManagerForLog(entityManagerFactoryForLog);
            LogQueue.getLogQueue().saveLog();
            closeEntityManagerForLog(entityManagerFactoryForLog);
        }
//        deregisterDrivers();
//        LOG.info("卸载JDBC驱动");
//        LOG.info("Uninstalled JDBC driver", Locale.ENGLISH);
    }    
    /**
     * 打开日志数据库em
     * @param entityManagerFactory 
     */
    private static void openEntityManagerForLog(EntityManagerFactory entityManagerFactory){        
        EntityManager em = entityManagerFactory.createEntityManager();
        TransactionSynchronizationManager.bindResource(entityManagerFactory, new EntityManagerHolder(em));
        LOG.info("打开ForLog实体管理器");
    }
    /**
     * 关闭日志数据库em
     * @param entityManagerFactory 
     */
    private static void closeEntityManagerForLog(EntityManagerFactory entityManagerFactory){
        EntityManagerHolder emHolder = (EntityManagerHolder)TransactionSynchronizationManager.unbindResource(entityManagerFactory);
        LOG.info("关闭ForLog实体管理器");
        EntityManagerFactoryUtils.closeEntityManager(emHolder.getEntityManager());
    }
    public static String getContextPath() {
        return contextPath;
    }

    private static void deregisterDrivers() {
        Enumeration<Driver> drivers=DriverManager.getDrivers();
        while(drivers.hasMoreElements()){
            Driver driver=drivers.nextElement();
            try {
                DriverManager.deregisterDriver(driver);
            } catch (SQLException e) {
                LOG.warn("卸载JDBC驱动失败："+driver, e);
                LOG.warn("Fail to uninstall JDBC driver："+driver, e, Locale.ENGLISH);
            }
        }
    }

}