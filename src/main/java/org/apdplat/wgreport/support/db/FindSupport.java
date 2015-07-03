package org.apdplat.wgreport.support.db;

import java.util.List;

/**
 * 通过语句，查找结果
 * 
 * 
 */
public interface FindSupport {
	/**
	 * 查找第一个结果
	 * 
	 * @param query
	 *            查询语句
	 * @param values
	 *            参数
	 * @return 第一个结果
	 */
	public Object findOne(String query, Object[] values);

	/**
	 * 查找第一个结果
	 * 
	 * @param query
	 *            查询语句
	 * @param value
	 *            参数
	 * @return 第一个结果
	 */
	public Object findOne(String query, Object value);

	/**
	 * 查找第一个结果
	 * 
	 * @param query
	 *            查询语句
	 * @return 第一个结果
	 */
	public Object findOne(String query);

	/**
	 * 查找所有结果,list中的元素表示一行记录,在开始条数和最大条数的限制内
	 * 
	 * @param query
	 *            查询语句
	 * @param values
	 *            值
	 * @param firstResult
	 *            起始行
	 * @param limit
	 *            限定条数
	 * @return 列表
	 */
	public List find(String query, Object[] values, int firstResult, int limit);

	/**
	 * 查找所有结果,list中的元素表示一行记录,在开始条数和最大条数的限制内
	 * 
	 * @param query
	 *            查询语句
	 * @param value
	 *            值
	 * @param firstResult
	 *            起始行
	 * @param limit
	 *            限定条数
	 * @return 列表
	 */
	public List find(String query, Object value, int firstResult, int limit);

	/**
	 * 查找所有结果,list中的元素表示一行记录,在开始条数和最大条数的限制内
	 * 
	 * @param query
	 *            语句
	 * @param firstResult
	 *            起始行
	 * @param limit
	 *            限定条数
	 * @return 结果集
	 */
	public List find(String query, int firstResult, int limit);

	/**
	 * 查找所有结果,list中的元素表示一行记录
	 * 
	 * @param query
	 *            语句
	 * @return 结果集
	 */
	public List find(String query);

	/**
	 * 查找所有结果,list中的元素表示一行记录
	 * 
	 * @param query
	 *            语句
	 * @param value
	 *            一个绑定参数
	 * @return 结果集
	 */
	public List find(String query, Object value);

	/**
	 * 查找结果
	 * 
	 * @param query
	 *            语句
	 * @param values
	 *            绑定参数
	 * @return 结果集
	 */
	public List find(String query, Object[] values);

	/**
	 * 根据语句返回条数
	 * 
	 * @param query
	 * @param values
	 * @return 条数
	 */
	public int count(String query, Object[] values);
}
