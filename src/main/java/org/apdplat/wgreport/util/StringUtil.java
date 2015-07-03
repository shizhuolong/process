package org.apdplat.wgreport.util;

import java.util.Collection;
import java.util.Iterator;
import java.util.Map;
import java.util.regex.Pattern;

public abstract class StringUtil {

	final static Pattern NULLPATTERN = Pattern.compile("\\s*");

	/**
	 * 字符串是否为null
	 * 
	 * @param o
	 *            待测试的对象
	 * @return null或者没有空格外的字符结果true,其余为false
	 */
	public static boolean isNull(Object o) {
		return o == null ? true : isNull(o.toString());
	}

	/**
	 * 字符串是否为null
	 * 
	 * @param s
	 *            待测试的字符串
	 * @return null或者没有空格外的字符结果true,其余为false
	 */
	public static boolean isNull(String s) {
		return s == null ? true : PatternUtil.matches(NULLPATTERN, s);
	}

	/**
	 * 字符串是否为null
	 * 
	 * @param o
	 *            待测试的对象
	 * @return null或者没有空格外的字符结果false,其余为true
	 */
	public static boolean isNotNull(Object o) {
		return !isNull(o);
	}

	/**
	 * 字符串是否为null
	 * 
	 * @param s
	 *            待测试的字符串
	 * @return null或者没有空格外的字符结果false,其余为true
	 */
	public static boolean isNotNull(String s) {
		return !isNull(s);
	}

	/**
	 * 对于string类型，进行trim，其他则不变
	 * 
	 * @param o
	 * @return trim后对象
	 */
	public static Object objectTrim(Object o) {
		return o instanceof String ? o.toString().trim() : o;
	}

	/**
	 * 字符串去除前后空格,空值返回null
	 * 
	 * @param s
	 *            输入
	 * @return trim后字符串
	 */
	public static String nullTrim(String s) {
		return s == null ? null : s.trim();
	}

	/**
	 * Object强制转换称字符串，并去除前后空格,空值返回null
	 * 
	 * @param o
	 *            输入Object
	 * @return trim后字符串,非空对象将调用toString方法先转为String类型
	 */
	public static String nullTrim(Object o) {
		return o == null ? null : o.toString().trim();
	}

	/**
	 * 字符串去除前后空格,空值返回""
	 * 
	 * @param s
	 *            输入
	 * @return trim后字符串
	 */
	public static String safeTrim(String s) {
		return s == null ? "" : s.trim();
	}

	/**
	 * Object强制转换称字符串，并去除前后空格,空值返回""
	 * 
	 * @param o
	 *            输入Object
	 * @return trim后字符串,非空对象将调用toString方法先转为String类型
	 */
	public static String safeTrim(Object o) {
		return o == null ? "" : o.toString().trim();
	}

	/**
	 * 字符串表示，用于测试
	 * 
	 * @param obj
	 *            输入
	 * @return 字符串
	 */
	public static String toString(Object obj) {
		if (obj == null)
			return "null";
		if (obj instanceof Object[])
			return toString((Object[]) obj);
		else if (obj instanceof Collection)
			return toString((Collection) obj);
		else if (obj instanceof Map)
			return toString((Map) obj);
		else
			return obj.toString();
	}

	public static String toString(Map map) {
		if (map == null)
			return "null";
		StringBuffer sb = new StringBuffer();
		Iterator it = map.keySet().iterator();
		while (it.hasNext()) {
			Object key = it.next();
			sb.append(",").append(toString(key)).append(":").append(
					toString(map.get(key)));
		}

		String s = sb.toString();
		if (s.length() > 0)
			s = s.substring(1);
		return "{" + s + "}";
	}

	/**
	 * 字符串表示，用于测试
	 * 
	 * @param collection
	 *            输入collection
	 * @return 字符串
	 */
	public static String toString(Collection collection) {
		if (collection == null)
			return "null";
		StringBuffer sb = new StringBuffer();
		Iterator it = collection.iterator();
		while (it.hasNext()) {
			sb.append(",").append(toString(it.next()));
		}
		String s = sb.toString();
		if (s.length() > 0)
			s = s.substring(1);
		return "[" + s + "]";
	}

	/**
	 * 字符串表示，用于测试
	 * 
	 * @param objs
	 *            待显示的字符串
	 * @return 字符串
	 */
	public static String toString(Object[] objs) {
		if (objs == null)
			return "null";
		StringBuffer sb = new StringBuffer();
		for (int i = 0; i < objs.length; i++)
			sb.append(",").append(toString(objs[i]));
		String s = sb.toString();
		if (s.length() > 0)
			s = s.substring(1);
		return "[" + s + "]";
	}

	/**
	 * 连接对象。分隔符为""
	 * 
	 * @param objs
	 *            待连接的对象
	 * @return 字符串
	 * 
	 * @see #concat(String , Object...)
	 */
	public static String concat(Object[] objs) {
		return concat("", objs);
	}

	/**
	 * 连接对象，将其表示为字符串，将忽略null值
	 * 
	 * @param delema
	 *            连接分隔符
	 * @param objs
	 *            待连接的对象
	 * @return 字符串
	 */
	public static String concat(String delema, Object[] objs) {
		StringBuffer sf = new StringBuffer();
		if (objs != null) {
			for (int i = 0; i < objs.length; i++)
				if (objs[i] != null) {
					sf.append(delema);
					sf.append(objs[i]);
				}
		}
		String result = sf.toString();
		return result.length() > 0 ? result.substring(delema.length()) : result;
	}

	/**
	 * 连接对象，将其表示为字符串，将忽略null值
	 * 
	 * @param delema
	 *            连接分隔符
	 * @param collection
	 *            待连接的对象的集合
	 * @return 字符串
	 */
	public static String concat(String delema, Collection collection) {
		return collection == null ? "" : concat(delema, collection.toArray());
	}

	/**
	 * 重复字符源,以""分隔
	 * 
	 * @param repeatSource
	 *            待重复的源
	 * @param num
	 *            重复次数
	 * @return 字符串
	 */
	public static String repeat(String repeatSource, int num) {
		return repeat(repeatSource, num, "");
	}

	/**
	 * 重复字符源
	 * 
	 * @param repeatSource
	 *            待重复的源
	 * @param num
	 *            重复次数
	 * @param delema
	 *            重复间的分隔符
	 * @return 字符串
	 */
	public static String repeat(String repeatSource, int num, String delema) {
		StringBuffer sb = new StringBuffer(repeatSource);
		for (int i = 0; i < num; i++)
			sb.append(delema).append(repeatSource);
		return sb.toString();
	}
}
