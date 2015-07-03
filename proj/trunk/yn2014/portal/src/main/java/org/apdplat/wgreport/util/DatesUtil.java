package org.apdplat.wgreport.util;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public abstract class DatesUtil {
	final static String DEFAULT_FORMAT = "yyyy-MM-dd HH:mm:ss";

	/**
	 * 根据指定格式解析时间字符串
	 * 
	 * @see java.text.DateFormat#parse(String)
	 * @param dateStr
	 *            待格式化的字符
	 * @param format
	 *            格式
	 * @return java.util.Date
	 */
	public static Date parse(String dateStr, String format) {
		DateFormat dateFormat = new SimpleDateFormat(format);
		try {
			return dateFormat.parse(dateStr);
		} catch (ParseException e) {
			throw new UtilsException(e);
		}
	}

	/**
	 * 按默认格式(yyyy-MM-dd HH:mm:ss)转换字符串
	 * 
	 * @see #parse(String, String)
	 * @param dateStr
	 *            时间String
	 * @return java.util.Date
	 */
	public static Date parse(String dateStr) {
		return parse(dateStr, DEFAULT_FORMAT);
	}

	/**
	 * 将毫秒时间转为Date类型
	 * 
	 * @param time
	 *            long时间
	 * @return java.util.Date
	 */
	public static Date parse(long time) {
		return new Date(time);
	}

	/**
	 * 将时间字符串按指定格式解析成java.sql.Date
	 * 
	 * @param dateStr
	 *            时间字符串
	 * @param format
	 *            格式
	 * @return java.sql.Date
	 */
	public static java.sql.Date parseSqlDate(String dateStr, String format) {
		return parseSqlDate(parse(dateStr, format).getTime());
	}

	/**
	 * 将时间字符串按默认格式(yyyy-MM-dd HH:mm:ss)解析成java.sql.Date
	 * 
	 * @param dateStr
	 *            时间字符串
	 * @return java.sql.Date
	 */
	public static java.sql.Date parseSqlDate(String dateStr) {
		return parseSqlDate(dateStr, DEFAULT_FORMAT);
	}

	/**
	 * 将时间解析成java.sql.Date
	 * 
	 * @param time
	 *            long时间
	 * @return java.sql.Date
	 */
	public static java.sql.Date parseSqlDate(long time) {
		return new java.sql.Date(time);
	}

	/**
	 * 时间转换成对应显示
	 * 
	 * @see #parse(Object)
	 * @param time
	 *            能toString为时间的字符串或数字
	 * @param format
	 *            格式
	 * @return String
	 */
	public static String timeFormat(long time, String format) {
		return format(parse(time), format);
	}

	/**
	 * 将时间字符串转换成另一种格式的字符串
	 * 
	 * @param dateStr
	 *            时间字符串
	 * @param dateFormat
	 *            当前格式
	 * @param toFormat
	 *            转换的目标格式
	 * @return String
	 */
	public static String timeFormat(String dateStr, String dateFormat,
			String toFormat) {
		return format(parse(dateStr, dateFormat), toFormat);
	}

	/**
	 * 以默认格式(yyyy-MM-dd HH:mm:ss)解析时间字符串后按指定格式格式化。
	 * 
	 * @param dateStr
	 *            时间字符串
	 * @param toFormat
	 *            转换的目标格式
	 * @return String
	 */
	public static String timeFormat(String dateStr, String toFormat) {
		return timeFormat(dateStr, DEFAULT_FORMAT, toFormat);
	}

	/**
	 * 时间转换成对应显示
	 * 
	 * @param date
	 *            时间
	 * @param format
	 *            格式
	 * @return String
	 */
	public static String format(Date date, String format) {
		DateFormat dateFormat = new SimpleDateFormat(format);
		return dateFormat.format(date);
	}

	/**
	 * 按默认格式(yyyy-MM-dd HH:mm:ss)格式化Date
	 * 
	 * @see #format(Date, String)
	 * @param date
	 *            Date
	 * @return 字符串
	 */
	public static String format(Date date) {
		return format(date, DEFAULT_FORMAT);
	}

	/**
	 * 按指定格式格式化当前时间
	 * 
	 * @see #format(Date, String)
	 * @param format
	 *            格式
	 * @return String
	 */
	public static String format(String format) {
		return format(new Date(), format);
	}

	/**
	 * 获取默认格式(yyyy-MM-dd HH:mm:ss)的当前时间
	 * 
	 * @return String
	 */
	public static String format() {
		return format(new Date(), DEFAULT_FORMAT);
	}

	/**
	 * 获取指定月份的天数
	 * 
	 * @param year
	 *            年
	 * @param month
	 *            月份(从1开始)
	 * @return 指定月份的天数
	 */
	public static int daysInMonth(int year, int month) {
		if (month == 2) {
			if (year % 4 == 0 && year % 100 != 0)
				return 29;
			else
				return 28;
		} else if ((month <= 7 && month % 2 == 1)
				|| (month > 7 && month % 2 == 0))
			return 31;
		else
			return 30;
	}

	/**
	 * 判断是否是闰年
	 * 
	 * @param year
	 *            年
	 * @return 闰年:true,否则:false
	 */
	public static boolean isLeepYear(int year) {
		return (year % 4 == 0 && year % 100 != 0);
	}

	/**
	 * 获得默认的日历实现
	 * 
	 * @return 类Calendar
	 */
	public static Calendar getDefaultCalendar() {
		return Calendar.getInstance();
	}

	/**
	 * 获得date所在月份的第一天的时间对象
	 * 
	 * @see #getDefaultCalendar()
	 * @param date
	 *            时间对象
	 * @return date所在月份的第一天的时间对象
	 */
	public static Date firstMonDate(Date date) {
		Calendar cal = getDefaultCalendar();
		cal.setTime(date);
		int day = 1;// 设置日期为月的最后一天
		cal.set(Calendar.DAY_OF_MONTH, day);
		return cal.getTime();
	}

	/**
	 * 获得date所在月份的最后一天的时间对象,返回结果由Calendar日历规则决定
	 * 
	 * @see #getDefaultCalendar()
	 * @param date
	 *            时间对象
	 * @return date所在月份的最后一天的时间对象
	 */
	public static Date lastMonDate(Date date) {
		Calendar cal = getDefaultCalendar();
		cal.setTime(date);
		int day = daysInMonth(cal.get(Calendar.YEAR), cal.get(Calendar.MONTH)+1);
		cal.set(Calendar.DAY_OF_MONTH, day);// 设置日期为月的最后一天
		return cal.getTime();
	}

	/**
	 * 设置日期对象指定日期字段的值
	 * 
	 * @param date
	 *            日期对象
	 * @param field
	 *            日期字段,由Calendar定义
	 * @param amount
	 *            待设置的值
	 */
	public static void set(Date date, int field, int amount) {
		Calendar cal = getDefaultCalendar();
		cal.setTime(date);
		cal.set(field, amount);
	}

	/**
	 * 得到日期对象指定字段的值
	 * 
	 * @param date
	 *            日期对象
	 * @param field
	 *            日期字段,由Calendar定义
	 * @return 日期对象指定字段的值
	 */
	public static int get(Date date, int field) {
		Calendar cal = getDefaultCalendar();
		cal.setTime(date);
		return cal.get(field);
	}

	/**
	 * 更改时间对象特定日历字段的值
	 * 
	 * @param date
	 *            时间对象
	 * @param field
	 *            日历字段,由Calendar定义
	 * @param amount
	 *            添加或减去指定的时间量,有符号
	 * @return 更改后的时间对象
	 */
	public static Date add(Date date, int field, int amount) {
		Calendar cal = getDefaultCalendar();
		cal.setTime(date);
		cal.add(field, amount);
		return cal.getTime();
	}

	/**
	 * 添加或减去毫秒数
	 * 
	 * @see #getDefaultCalendar()
	 * @param date
	 *            时间对象
	 * @param milliseconds
	 *            毫秒数
	 * @return 变化后的时间对象
	 */
	public static Date addMilliseconds(Date date, int milliseconds) {
		return add(date, Calendar.MILLISECOND, milliseconds);
	}

	/**
	 * 添加或减去秒数
	 * 
	 * @see #getDefaultCalendar()
	 * @param date
	 *            时间对象
	 * @param seconds
	 *            秒数
	 * @return 变化后的时间对象
	 */
	public static Date addSeconds(Date date, int seconds) {
		return add(date, Calendar.SECOND, seconds);
	}

	/**
	 * 添加或减去分钟数
	 * 
	 * @see #getDefaultCalendar()
	 * @param date
	 *            时间对象
	 * @param minutes
	 *            分钟数
	 * @return 变化后的时间对象
	 */
	public static Date addMinutes(Date date, int minutes) {
		return add(date, Calendar.MINUTE, minutes);
	}

	/**
	 * 添加或减去小时数
	 * 
	 * @see #getDefaultCalendar()
	 * @param date
	 *            时间对象
	 * @param hours
	 *            小时数
	 * @return 变化后的时间对象
	 */
	public static Date addHours(Date date, int hours) {
		return add(date, Calendar.HOUR, hours);
	}

	/**
	 * 添加或减去天数
	 * 
	 * @see #getDefaultCalendar()
	 * @param date
	 *            时间对象
	 * @param days
	 *            天数
	 * @return 变化后的时间对象
	 */
	public static Date addDays(Date date, int days) {
		return add(date, Calendar.DAY_OF_MONTH, days);
	}

	/**
	 * 添加或减去月数
	 * 
	 * @see #getDefaultCalendar()
	 * @param date
	 *            时间对象
	 * @param months
	 *            月数
	 * @return 变化后的时间对象
	 */
	public static Date addMonths(Date date, int months) {
		return add(date, Calendar.MONTH, months);
	}

	/**
	 * 添加或减去年数
	 * 
	 * @see #getDefaultCalendar()
	 * @param date
	 *            时间对象
	 * @param years
	 *            年数
	 * @return 变化后的时间对象
	 */
	public static Date addYears(Date date, int years) {
		return add(date, Calendar.YEAR, years);
	}

}
