package org.apdplat.wgreport.support.db;

public interface SqlDialect {
	/**
	 * 将语句包装成限制条数的语句
	 * 
	 * @param query
	 *            语句
	 * @param first
	 *            开始行
	 * @param limit
	 *            限定条数
	 * @return 限制条数语句
	 */
	public String getLimitString(String query, int first, int limit);

	/**
	 * 获取加入限定条数后的参数集
	 * 
	 * @param values
	 *            参数
	 * @param first
	 *            起始行
	 * @param limit
	 *            限定条数
	 * @return 限定条数后的参数集
	 */
	public Object[] getLimitParameters(Object[] values, int first, int limit);

	/**
	 * 将语句包装为count语句
	 * 
	 * @param query
	 *            语句
	 * @return 包装后的count语句
	 */
	public String getCountString(String query);
}
