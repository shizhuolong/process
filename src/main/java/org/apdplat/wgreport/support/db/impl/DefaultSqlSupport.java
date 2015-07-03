package org.apdplat.wgreport.support.db.impl;

import javax.sql.DataSource;

import org.apache.commons.dbutils.QueryRunner;
import org.apdplat.wgreport.support.db.DataSourceSupport;
import org.apdplat.wgreport.support.db.DialectSupport;
import org.apdplat.wgreport.support.db.FindSupport;
import org.apdplat.wgreport.support.db.QueryRunnerSupport;
import org.apdplat.wgreport.support.db.UpdateSupport;

public class DefaultSqlSupport extends QueryRunnerSqlSupport implements
		FindSupport, UpdateSupport, QueryRunnerSupport, DataSourceSupport,
		DialectSupport {
	DataSource dataSource;

	public void setDataSource(DataSource dataSource) {
		this.dataSource = dataSource;
		queryRunner = new QueryRunner(dataSource);
	}

	public DataSource getDataSource() {
		return this.dataSource;
	}
}
