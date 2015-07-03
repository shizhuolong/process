package org.apdplat.platform.action;

import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.platform.model.Model;
import org.apdplat.platform.util.SpringContextUtils;
import java.io.IOException;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

/**
 *
 * @author sun
 */
public class FacadeFilter implements Filter {
    protected static final APDPlatLogger LOG = new APDPlatLogger(FacadeFilter.class);

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        String modelName=request.getParameter("modelName");
        if(modelName!=null){
            Model model = SpringContextUtils.getBean(modelName);
            request.setAttribute("model", model);
            LOG.info("用户使用facade action,modelName="+modelName);
        }
        chain.doFilter(request, response);
    }

    @Override
    public void init(FilterConfig fc) throws ServletException {
        LOG.info("初始化facade filter");
    }

    @Override
    public void destroy() {
        LOG.info("销毁facade filter");
    }
}