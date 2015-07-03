package org.apdplat.wgreport.support.db.queryformer;

public interface Queryformer {
	/**
	 * 取得查询语句
	 * 
	 * @return 查询语句
	 */
	public String getQuery();

	/**
	 * 取得参数语句的绑定参数
	 * 
	 * @return 查询语句中的参数值
	 */
	public Object[] getParameters();
}
