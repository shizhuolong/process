package org.apdplat.wgreport.util;

import java.math.BigDecimal;

public abstract class NumberUtil {
	/**
	 * 转换成Integer类型,数据将先转换成Double类型
	 * 
	 * @param o
	 *            待转换的对象
	 * @return 数值
	 */
	public static Integer parseInteger(Object o) {
		return new Integer(toInt(o));
	}

	/**
	 * 转换成int类型
	 * 
	 * @param o
	 * @return int
	 */
	public static int toInt(Object o) {
		return safeParseDouble(o).intValue();
	}

	public static Short parseShort(Object o) {
		return new Short(toShort(o));
	}

	public static short toShort(Object o) {
		return safeParseDouble(o).shortValue();
	}

	/**
	 * 转换成Long类型,不会有异常,数据将先转换成Double类型
	 * 
	 * @param o
	 *            待转换的对象
	 * @return 数值
	 */
	public static Long parseLong(Object o) {
		return new Long(toLong(o));
	}

	public static long toLong(Object o) {
		return safeParseDouble(o).longValue();
	}

	/**
	 * 转换成Float类型,数据将先转换成Double类型
	 * 
	 * @param o
	 *            待转换的对象
	 * @return 数值
	 */
	public static Float parseFloat(Object o) {
		return new Float(toFloat(o));
	}

	public static float toFloat(Object o) {
		return safeParseDouble(o).floatValue();
	}

	public static Double parseDouble(Object o) {
		return safeParseDouble(o);
	}

	public static double toDouble(Object o) {
		return safeParseDouble(o).doubleValue();
	}

	/**
	 * 转换成Float类型,不会有异常, 对于转换不了的数据,返回null
	 * 
	 * @param o
	 * @return 转换后的数据类型
	 */
	public static Integer nullParseInteger(Object o) {
		Double d = nullParseDouble(o);
		return d == null ? null : new Integer(d.intValue());
	}

	/**
	 * 转换成Float类型,不会有异常, 对于转换不了的数据,返回null
	 * 
	 * @param o
	 * @return 转换后的数据类型
	 */
	public static Short nullParseShort(Object o) {
		Double d = nullParseDouble(o);
		return d == null ? null : new Short(d.shortValue());
	}

	/**
	 * 转换成Float类型,不会有异常, 对于转换不了的数据,返回null
	 * 
	 * @param o
	 * @return 转换后的数据类型
	 */
	public static Long nullParseLong(Object o) {
		Double d = nullParseDouble(o);
		return d == null ? null : new Long(d.longValue());
	}

	/**
	 * 转换成Float类型,不会有异常, 对于转换不了的数据,返回null
	 * 
	 * @param o
	 * @return 转换后的数据类型
	 */
	public static Float nullParseFloat(Object o) {
		Double d = nullParseDouble(o);
		return d == null ? null : new Float(d.floatValue());
	}

	/**
	 * 转换成Double类型,不会有异常, 对于转换不了的数据,返回null
	 * 
	 * @param o
	 * @return 转换后的数据类型
	 */
	public static Double nullParseDouble(Object o) {
		String s = StringUtil.nullTrim(o);
		try {
			return new Double(s);
		} catch (Exception e) {
			return null;
		}
	}

	/**
	 * 转换成Double类型,不会有异常,通过o.toString()方法先转换成字符串
	 * 
	 * @param o
	 *            待转换的对象
	 * @return 数值,转换不了返回0
	 */
	public static Double safeParseDouble(Object o) {
		String s = StringUtil.nullTrim(o);
		try {
			return new Double(s);
		} catch (Exception e) {
			return new Double(0);
		}
	}

	/**
	 * 转换成BigDecimal类型,不会有异常,通过o.toString()方法先转换成字符串
	 * 
	 * @param o
	 *            待转换的对象
	 * @return 数值,转换不了返回0
	 */
	public static BigDecimal safeParseBigDecimal(Object o) {
		String s = StringUtil.nullTrim(o);
		try {
			return new BigDecimal(s);
		} catch (NumberFormatException e) {
			return new BigDecimal(0);
		}
	}

	/**
	 * 两数相加 数据, 实际类型由第一个非空参数决定
	 * 
	 * @param a
	 *            数字a
	 * @param b
	 *            数字b
	 * @return 相加之和
	 */
	public static Number add(Number a, Number b) {
		return a == null ? b : (b == null ? a : navAdd(a, b));
	}

	/**
	 * 两数相加,实际类型由a决定 参数a和b必须有值，否则将抛出NULL异常
	 * 
	 * @param a
	 *            数字a
	 * @param b
	 *            数字b
	 * @return 相加之和
	 */
	private static Number navAdd(Number a, Number b) {
		Class targetType = a.getClass();
		double resultValue = a.doubleValue() + b.doubleValue();
		Number result = null;
		if (targetType.isAssignableFrom(Double.class))
			result = new Double(resultValue);
		else if (targetType.isAssignableFrom(BigDecimal.class))
			result = new BigDecimal(resultValue);
		else if (targetType.isAssignableFrom(Integer.class))
			result = new Integer((int) resultValue);
		else if (targetType.isAssignableFrom(Short.class))
			result = new Short((short) resultValue);
		else if (targetType.isAssignableFrom(Long.class))
			result = new Long((long) resultValue);
		else if (targetType.isAssignableFrom(Float.class))
			result = new Float((float) resultValue);
		else
			result = new Double(resultValue);
		return result;
	}

	public static int getType(Class targetType) {
		if (targetType.isAssignableFrom(Integer.class))
			return 1;
		else if (targetType.isAssignableFrom(Short.class))
			return 2;
		else if (targetType.isAssignableFrom(Long.class))
			return 3;
		else if (targetType.isAssignableFrom(Float.class))
			return 4;
		else if (targetType.isAssignableFrom(Double.class))
			return 5;
		else if (targetType.isAssignableFrom(BigDecimal.class))
			return 6;
		else
			return 0;
	}

}
