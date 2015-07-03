package org.apdplat.platform.spring;

import javax.servlet.ServletContextEvent;
import org.apdplat.module.system.service.SystemListener;
import org.springframework.web.context.ContextLoaderListener;

public class APDPlatContextLoaderListener extends ContextLoaderListener {

	 @Override
	    public void contextInitialized(ServletContextEvent event) {
	        //接管系统的启动
	        SystemListener.contextInitialized(event);
	        super.contextInitialized(event);
	    }

	    @Override
	    public void contextDestroyed(ServletContextEvent event) {
	        //接管系统的关闭
	        SystemListener.contextDestroyed(event);
	        super.contextDestroyed(event);
	    }
}