package org.apdplat.wgreport.util;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;

public abstract class ObjectUtil {
	/**
	 * 通过反射获得实例
	 * 
	 * @param cls
	 *            类名称
	 * @return 实例
	 */
	public static Object getInstance(String cls) {
		try {
			Class clazz = Class.forName(cls);
			return getInstance(clazz);
		} catch (ClassNotFoundException e) {
			throw new UtilsException(e);
		}

	}

	/**
	 * 通过反射获得实例
	 * 
	 * @param clazz
	 *            类型
	 * @return 实例
	 */
	public static Object getInstance(Class clazz) {
		try {
			return clazz.newInstance();
		} catch (InstantiationException e) {
			throw new UtilsException(e);
		} catch (IllegalAccessException e) {
			throw new UtilsException(e);
		}
	}

	/**
	 * 将byte数组转换为 对象
	 * 
	 * @param bytes
	 *            byte数组
	 * @return 转换后的对象
	 */
	public static Object toObject(byte[] bytes) {
		Object result = null;
		ByteArrayInputStream bin = new ByteArrayInputStream(bytes);
		result = IOUtil.readObject(bin);
		return result;
	}

	/**
	 * 将对象转换为byte数组
	 * 
	 * @param obj
	 *            待转换的对象(可序列化)
	 * @return 转换后的byte数组
	 */
	public static byte[] toByteArray(Object obj) {
		byte[] result = null;
		ByteArrayOutputStream bout = new ByteArrayOutputStream();
		IOUtil.writeObject(obj, bout);
		result = bout.toByteArray();
		return result;
	}

	/**
	 * 两个对象是否相等,含对null值的判断,总是安全的
	 * 
	 * @param o1
	 *            对象1
	 * @param o2
	 *            对象2
	 * @return true/false
	 */
	public static boolean equals(Object o1, Object o2) {
		if (o1 == o2) {
			return true;
		} else if (o1 == null) {
			return false;
		} else if (o1.equals(o2)) {
			return true;
		} else
			return false;
	}
}
