package org.apdplat.wgreport.support.db;

import org.apache.commons.dbutils.QueryRunner;

/**
 * @see org.apache.commons.dbutils.QueryRunner
 * 
 */
public interface QueryRunnerSupport {
	public void setQueryRunner(QueryRunner queryRunner);

	public QueryRunner getQueryRunner();
}
