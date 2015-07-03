package org.apdplat.wgreport.support.formater;

/**
 * 对实例进行格式或或转换
 * 
 * 
 */
public interface Formater {
	/**
	 * 对实例进行格式或或转换
	 * 
	 * @param obj
	 *            待转换的实例
	 * @return 转换后的实例
	 */
	public Object format(Object obj);
}
