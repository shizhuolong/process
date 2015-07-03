package org.apdplat.wgreport.util;

import java.util.LinkedHashMap;
import java.util.Map;

import org.apache.commons.beanutils.DynaBean;
import org.apache.commons.beanutils.DynaProperty;

public abstract class MapUtil {
	/**
	 * 将对象转换成map,目前支持java.util.Map的子类和org.apache.commons.beanutils.DynaBean子类
	 * @throws java.lang.IllegalArgumentException
	 * 
	 * @param o
	 *            对象
	 * @return 转换后的map
	 */
	public static Map getMap(Object o) {
		if (o == null)
			return null;
		if (o instanceof Map)
			return (Map) o;
		else if (o instanceof DynaBean)
			return dynaBeanToMap((DynaBean) o);
		else
			throw new IllegalArgumentException("不支持此种类型的转换,对象的类型为:"
					+ o.getClass());
	}

	public static Map dynaBeanToMap(DynaBean bean) {
		Map result = new LinkedHashMap();
		if (bean == null)
			return result;
		DynaProperty[] props = bean.getDynaClass().getDynaProperties();
		for (int i = 0; i < props.length; i++) {
			DynaProperty dynaProperty = props[i];
			String key = dynaProperty.getName();
			Object value = bean.get(dynaProperty.getName());
			result.put(key, value);
		}
		return result;
	}

	/**
	 * map是否为空
	 * 
	 * @param map
	 * @return map==null或者map.isEmpty
	 */
	public static boolean isNull(Map map) {
		return map == null || map.isEmpty();
	}

}
