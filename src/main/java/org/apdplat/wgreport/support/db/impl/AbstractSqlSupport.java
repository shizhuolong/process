package org.apdplat.wgreport.support.db.impl;

import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apdplat.wgreport.support.db.DialectSupport;
import org.apdplat.wgreport.support.db.FindSupport;
import org.apdplat.wgreport.support.db.SqlDialect;
import org.apdplat.wgreport.support.db.UpdateSupport;
import org.apdplat.wgreport.util.ObjectUtil;


public abstract class AbstractSqlSupport implements FindSupport, UpdateSupport,
		DialectSupport {

	final Log logger = LogFactory.getLog(getClass());

	Class dialectClass = OracleSqlDialect.class;

	SqlDialect dialect;

	public List find(String query) {
		return find(query, (Object[]) null);
	}

	public List find(String query, Object value) {
		return find(query, new Object[] { value });
	}

	public Object findOne(String query) {
		return findOne(query, (Object[]) null);
	}

	public Object findOne(String query, Object value) {
		return findOne(query, new Object[] { value });
	}

	public List find(String query, int firstResult, int limit) {
		return find(query, (Object[]) null, firstResult, limit);
	}

	public List find(String query, Object value, int firstResult, int limit) {
		return find(query, new Object[] { value }, firstResult, limit);
	}
	
	public int update(String query) {
		return update(query, (Object[]) null);
	}

	public int update(String query, Object value) {
		return update(query, new Object[] { value });
	}

	public void setDialectClass(Class dialectClass) {
		this.dialectClass = dialectClass;
	}

	public SqlDialect getDialect() {
		if (dialect == null)
			dialect = (SqlDialect) ObjectUtil.getInstance(dialectClass);
		return dialect;
	}
}
