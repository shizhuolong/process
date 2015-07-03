package org.apdplat.wgreport.support.db.queryformer;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public abstract class AbstractQueryformer implements Queryformer {
	String query;
	Object[] parameters;
	final Log logger = LogFactory.getLog(getClass());

	/**
	 * 运行整体整理工作，需达到构建好query和parameters的效果
	 */
	protected abstract void execute();

	public Object[] getParameters() {
		return parameters;
	}

	public String getQuery() {
		return query;
	}

}
