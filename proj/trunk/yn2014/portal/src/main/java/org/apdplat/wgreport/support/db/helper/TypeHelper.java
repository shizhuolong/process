package org.apdplat.wgreport.support.db.helper;

import java.util.Date;

import org.apdplat.wgreport.util.ArrayUtil;

public abstract class TypeHelper {
	/**
	 * 模糊匹配类型,"begin_with", "end_with", "contain"
	 */
	public final static String[] like_types = new String[] { "begin_with",
			"end_with", "contain" };

	/**
	 * 是否是模糊匹配类型,即"begin_with", "end_with", "contain" 中的一种
	 * 
	 * @param type
	 *            待检测的类型
	 * @return true/false
	 */
	public static boolean isLike(String type) {
		return ArrayUtil.contains(like_types, type);
	}

	public static Class getType(String columntype) {
		if (columntype.matches("(?i)(varchar|char).*"))
			return String.class;
		else if (columntype.matches("(?i)short.*"))
			return Short.class;
		else if (columntype.matches("(?i)long.*"))
			return Long.class;
		else if (columntype.matches("(?i)(num|int|decimal).*")) {
			if (columntype.contains(","))
				return Double.class;
			else
				return Integer.class;
		} else if (columntype.matches("(?i)(date|time).*"))
			return Date.class;
		else
			return Object.class;

	}
}
