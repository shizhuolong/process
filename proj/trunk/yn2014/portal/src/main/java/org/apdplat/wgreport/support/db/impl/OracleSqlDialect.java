package org.apdplat.wgreport.support.db.impl;

import org.apdplat.wgreport.support.db.SqlDialect;


public class OracleSqlDialect extends AbstractSqlDialect implements SqlDialect {

	protected String getLimitString(String sql, boolean hasFirst,
			boolean hasLimit) {
		sql = sql.trim();
		boolean isForUpdate = false;
		if (sql.toLowerCase().endsWith(" for update")) {
			sql = sql.substring(0, sql.length() - 11);
			isForUpdate = true;
		}

		StringBuffer pagingSelect = new StringBuffer(sql.length() + 100);
		if (hasFirst && hasLimit) {
			pagingSelect
					.append("select * from ( select row_.*, rownum rownum_ from ( ");
			pagingSelect.append(sql);
			pagingSelect
					.append(" ) row_ where rownum <= ? ) where rownum_ > ?");
		} else if (hasFirst || hasLimit) {// 只有limit
			if (hasFirst) {
				pagingSelect
						.append("select * from ( select row_.*, rownum rownum_ from ( ");
				pagingSelect.append(sql);
				pagingSelect.append(" ) row_ ) where rownum_ > ? ");
			} else {
				pagingSelect.append("select row_.*, rownum rownum_ from ( ");
				pagingSelect.append(sql);
				pagingSelect.append(" ) row_ where rownum <= ?");
			}
		}
		if (isForUpdate) {
			pagingSelect.append(" for update");
		}

		return pagingSelect.toString();
	}

}
