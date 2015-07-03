package org.apdplat.wgreport.support.db;

/**
 * 方言支持
 * 
 */
public interface DialectSupport {
	/**
	 * <p>
	 * 获得方言
	 * </p>
	 * 
	 * @return SqlDialect 方言
	 */
	public SqlDialect getDialect();

	/**
	 * <p>
	 * 设置方言
	 * </p>
	 * 
	 * @param dialectClass
	 *            方言实现类名
	 */
	public void setDialectClass(Class dialectClass);
}
