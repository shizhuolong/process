package org.apdplat.module.monitor.filter;

import org.apdplat.module.monitor.model.ProcessTime;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.OnlineUserService;
import org.apdplat.module.system.service.LogQueue;
import org.apdplat.module.system.service.PropertyHolder;
import org.apdplat.module.system.service.SystemListener;
import org.apdplat.platform.log.APDPlatLogger;
import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Date;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

/**
 *
 * @author sun
 */
public class PerformanceFilter implements Filter {
    protected static final APDPlatLogger LOG = new APDPlatLogger(PerformanceFilter.class);
    private boolean enabled = false;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException,
            ServletException {
        HttpServletRequest req=(HttpServletRequest)request;
        
        long start=0;
        if (enabled && filter(req)) {            
		start=System.currentTimeMillis();
        }
        chain.doFilter(request, response);
        if (enabled && filter(req)) {
		long end=System.currentTimeMillis();
                User user=OnlineUserService.getUser(req.getSession().getId());
                ProcessTime logger=new ProcessTime();
                logger.setUsername(user.getUsername());
                logger.setUserIP(req.getRemoteAddr());
                try {
                    logger.setServerIP(InetAddress.getLocalHost().getHostAddress());
                } catch (UnknownHostException ex) {
                    LOG.error("保存日志出错(Error in saving log)",ex);
                }
                logger.setAppName(SystemListener.getContextPath());
                String resource=req.getRequestURI().replace(logger.getAppName(), "");
                logger.setResource(resource);
                logger.setStartTime(new Date(start));
                logger.setEndTime(new Date(end));
                logger.setProcessTime(end-start);
                LogQueue.addLog(logger);
        }
    }

    @Override
    public void init(FilterConfig fc) throws ServletException {
        LOG.info("初始化性能过滤器(Initialize the filter performance)");
        enabled = PropertyHolder.getBooleanProperty("monitor.performance");
        if(enabled){
            LOG.info("启用性能分析日志(Enable performance analyzing log)");
        }else{            
            LOG.info("禁用性能分析日志(Disable performance analyzing log)");
        }
    }

    @Override
    public void destroy() {
        LOG.info("销毁性能过滤器(Destroy the filter performance)");
    }

    private boolean filter(HttpServletRequest req) {
        String path=req.getRequestURI();
        if(path.contains("/log/")){
            LOG.info("路径包含/log/,不执行性能分析(/log/ in path, not execute performance analysis) "+path);
            return false;
        }
        if(path.contains("/monitor/")){
            LOG.info("路径包含/monitor/,不执行性能分析(/log/ in path, not execute performance analysis) "+path);
            return false;
        }
        return true;
    }
}