package org.apdplat.wgreport.support.db.impl;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.ResultSetHandler;
import org.apache.commons.dbutils.handlers.MapHandler;
import org.apache.commons.dbutils.handlers.MapListHandler;
import org.apache.commons.dbutils.handlers.ScalarHandler;
import org.apdplat.wgreport.support.db.DbException;
import org.apdplat.wgreport.support.db.DialectSupport;
import org.apdplat.wgreport.support.db.FindSupport;
import org.apdplat.wgreport.support.db.QueryRunnerSupport;
import org.apdplat.wgreport.support.db.UpdateSupport;
import org.apdplat.wgreport.util.NumberUtil;
import org.apdplat.wgreport.util.StringUtil;


public class QueryRunnerSqlSupport extends AbstractSqlSupport implements
		FindSupport, UpdateSupport, QueryRunnerSupport, DialectSupport {

	QueryRunner queryRunner = null;

	ResultSetHandler listResultSetHandler = new MapListHandler();

	ResultSetHandler oneResultSetHandler = new MapHandler();

	ResultSetHandler countHandler = new ScalarHandler();

	public List find(String query, Object[] values) {
		return (List) executeFind(query, values, listResultSetHandler);
	}

	public List find(String query, Object[] values, int firstResult, int limit) {
		if (limit == 0)
			return new ArrayList();
		query = getDialect().getLimitString(query, firstResult, limit);
		values = getDialect().getLimitParameters(values, firstResult, limit);
		return find(query, values);
	}

	public Object findOne(String query, Object[] values) {
		return executeFind(query, values, oneResultSetHandler);
	}

	public int count(String query, Object[] values) {
		query = getDialect().getCountString(query);
		Object o = executeFind(query, values, countHandler);
		return NumberUtil.toInt(o);
	}

	/**
	 * 查询结果<br/>
	 * 注意：<br/>
	 * 不支持lob字段参数
	 * 
	 * @param query
	 *            语句
	 * @param values
	 *            绑定参数
	 * @param rsh
	 *            结果转换器
	 * @return 结果
	 */
	protected Object executeFind(String query, Object[] values,
			ResultSetHandler rsh) {
		logger.debug("参数:[query]" + query + ",[values]"
				+ StringUtil.toString(values));
		try {
			return getQueryRunner().query(query, values, rsh);
		} catch (SQLException e) {
			throw new DbException(e.getLocalizedMessage(), e.getCause());
		}
	}

	/*
	 * set/get method
	 */
	public void setListResultSetHandler(ResultSetHandler listResultSetHandler) {
		this.listResultSetHandler = listResultSetHandler;
	}

	public void setOneResultSetHandler(ResultSetHandler oneResultSetHandler) {
		this.oneResultSetHandler = oneResultSetHandler;
	}

	public void setQueryRunner(QueryRunner queryRunner) {
		this.queryRunner = queryRunner;
	}

	public QueryRunner getQueryRunner() {
		return queryRunner;
	}

	/**
	 * <p>
	 * 注意:
	 * </p>
	 * 对于clob字段,参数采用字符串; 对于blob字段,参数采用byte[]组
	 * 
	 * @see com.unicom.biportal.support.db.UpdateSupport
	 */
	public int update(String query, Object[] values) {
		logger.debug("参数:[query]" + query + ",[values]"
				+ StringUtil.toString(values));
		try {
			return getQueryRunner().update(query, values);
		} catch (SQLException e) {
			throw new DbException(e.getLocalizedMessage(), e.getCause());
		}
	}

	/**
	 * <p>
	 * 注意:
	 * </p>
	 * 对于clob字段,参数采用字符串; 对于blob字段,参数采用byte[]组
	 * 
	 * @see com.unicom.biportal.support.db.UpdateSupport
	 */
	public int[] batch(String query, Object[][] values) {
		logger.debug("参数:[query]" + query);
		try {
			return getQueryRunner().batch(query, values);
		} catch (SQLException e) {
			throw new DbException(e.getLocalizedMessage(), e.getCause());
		}
	}

}
