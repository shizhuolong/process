package org.apdplat.platform.filter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import org.apache.commons.lang.StringUtils;
/**
*JPA事务开启和关闭过滤器
* @author sun
*/
public class OpenEntityManagerInViewFilter extends org.springframework.orm.jpa.support.OpenEntityManagerInViewFilter {
        public static HttpServletRequest request;
	public static final String EXCLUDE_SUFFIXS_NAME = "excludeSuffixs";
	public static final String ENTITY_MANAGER_FACTORY_BEAN_NAME = "entityManagerFactoryBeanName";

	private static final String[] DEFAULT_EXCLUDE_SUFFIXS = { ".js", ".css", ".jpg", ".gif" };

	private String[] excludeSuffixs = DEFAULT_EXCLUDE_SUFFIXS;

	@Override
	protected boolean shouldNotFilter(final HttpServletRequest request) throws ServletException {
                OpenEntityManagerInViewFilter.request=request;
		String path = request.getServletPath();
                
		for (String suffix : excludeSuffixs) {
			if (path.endsWith(suffix)) {
                            return true;
                        }
		}

		return false;
	}

	@Override
	protected void initFilterBean() throws ServletException {
		String entityManagerFactoryBeanName = getFilterConfig().getInitParameter(ENTITY_MANAGER_FACTORY_BEAN_NAME);
		if (StringUtils.isNotBlank(entityManagerFactoryBeanName)) {
                    setEntityManagerFactoryBeanName(entityManagerFactoryBeanName);
                }

		String excludeSuffixStr = getFilterConfig().getInitParameter(EXCLUDE_SUFFIXS_NAME);
		if (StringUtils.isNotBlank(excludeSuffixStr)) {
			excludeSuffixs = excludeSuffixStr.split(",");
			//处理匹配字符串为".后缀名"
			for (int i = 0; i < excludeSuffixs.length; i++) {
				excludeSuffixs[i] = "." + excludeSuffixs[i];
			}
		}
	}
}