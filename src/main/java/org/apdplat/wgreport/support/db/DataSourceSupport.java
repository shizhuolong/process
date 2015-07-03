package org.apdplat.wgreport.support.db;

import javax.sql.DataSource;

public interface DataSourceSupport {
	public void setDataSource(DataSource dataSource);

	public DataSource getDataSource();
}
