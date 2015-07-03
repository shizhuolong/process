package org.apdplat.wgreport.support.db;

public interface UpdateSupport {
	/**
	 * 执行插入、新增、删除语句
	 * 
	 * @param query
	 *            语句
	 * @return 受影响的条数
	 */
	public int update(String query);

	/**
	 * 执行插入、新增、删除语句
	 * 
	 * @param query
	 *            语句
	 * @param value
	 *            一个绑定参数
	 * @return 受影响的条数
	 */
	public int update(String query, Object value);

	/**
	 * 执行插入、新增、删除语句
	 * 
	 * @param query
	 *            语句
	 * @param values
	 *            绑定参数
	 * @return 受影响的条数
	 */
	public int update(String query, Object[] values);

	/**
	 * 批量执行插入、新增、删除语句
	 * 
	 * @param query
	 *            语句
	 * @param values
	 *            每一行为一条语句的绑定参数
	 * @return 受印象的条数(每条语句执行结果)
	 */
	public int[] batch(String query, Object[][] values);
}
