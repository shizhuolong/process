package org.apdplat.wgreport.support.db.impl;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apdplat.wgreport.support.db.SqlDialect;
import org.apdplat.wgreport.util.ArrayUtil;

public abstract class AbstractSqlDialect implements SqlDialect {
	final Log logger = LogFactory.getLog(getClass());

	public String getLimitString(String sql, int first, int limit) {
		return getLimitString(sql, hasFirst(first), hasLimit(limit));
	}

	public Object[] getLimitParameters(Object[] values, int first, int limit) {
		boolean hasFirst = hasFirst(first);
		boolean hasLimit = hasLimit(limit);
		Object[] result = values;
		if (hasFirst && hasLimit) {
			result = ArrayUtil.concat(values, new Object[] {
					new Integer(first + limit), new Integer(first) });
		} else if (hasFirst || hasLimit) {
			if (hasFirst)
				result = ArrayUtil.addObject(values, new Integer(first));
			else
				result = ArrayUtil.addObject(values, new Integer(limit));
		}
		return result;
	}

	public String getCountString(String sql) {
		StringBuffer countSelect = new StringBuffer(sql.length() + 100);
		countSelect.append("select count(*) from (");
		countSelect.append(sql);
		countSelect.append(")");
		return countSelect.toString();
	}

	public boolean hasFirst(int num) {
		return num > 0;
	}

	public boolean hasLimit(int num) {
		return num > -1;
	}

	protected abstract String getLimitString(String sql, boolean hasFirst,
			boolean hasLimit);
}
