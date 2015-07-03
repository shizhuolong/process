package org.apdplat.wgreport.util;

import java.util.regex.Pattern;

public abstract class BooleanUtil {
	final static Pattern BOOLEAN_false = Pattern
			.compile("(?i)\\s*(false|(\\-\\d+)|0)\\s*");

	/**
	 * 扩展转换，按javascript,c,c++的规则
	 * 
	 * @param o
	 * @return true或false
	 */
	public static boolean safeParse(Object o) {
		if (StringUtil.isNull(o)
				|| PatternUtil.matches(BOOLEAN_false, o.toString()))
			return false;
		else
			return true;
	}
}
