package org.apdplat.wgreport.util;

import java.sql.Blob;
import java.sql.Clob;

/**
 * 数据库相关工具类
 * 
 * 
 */
public abstract class DBUtil {
	/**
	 * @see #getString(Object)
	 */
	public static String getStringFromClob(Object o) {
		return getString(o);
	}

	/**
	 * 获取字符串<br/>
	 * 
	 * @param o
	 *            待转换的对象
	 * @return o==null时，null<br/>
	 *         o instanceof Clob,读取Clob中的String<br/>
	 *         其他,o.toString()
	 * @see #getString(Clob)
	 */
	public static String getString(Object o) {
		String result = null;
		if (o == null)
			;
		else if (o instanceof Clob)
			result = getString((Clob) o);
		else
			result = o.toString();
		return result;
	}

	/**
	 * 将Clob字段转换为字符串,clob将被转换，其它将返回o.toString
	 * 
	 * @param clob
	 *            clob对象
	 * @return 字符串
	 */
	public static String getString(Clob clob) {
		try {
			return IOUtil.readToString(clob.getCharacterStream());
		} catch (Exception e) {
			throw new UtilsException("读取Clob出错:" + e.getMessage(), e);
		}
	}

	/**
	 * @see #getByteArray(Object)
	 */
	public static byte[] getByteArrayFromBlob(Object o) {
		return getByteArray(o);
	}

	/**
	 * 获取byte[] <br/>
	 * 
	 * @param o
	 *            待转换的对象
	 * @return o==null时，null<br/>
	 *         o instanceof Blob,读取Blob中的byte[]<br/>
	 *         其他,ObjectUtil.toByteArray(Object)
	 * @see #getByteArray(Blob)
	 * @see ObjectUtil#toByteArray(Object)
	 */
	public static byte[] getByteArray(Object o) {
		byte[] result = null;
		if (o == null)
			;
		else if (o instanceof Blob)
			result = getByteArray((Blob) o);
		else
			result = ObjectUtil.toByteArray(o);
		return result;
	}

	/**
	 * 将blob读取到byte组中
	 * 
	 * @param blob
	 *            Blob对象
	 * @return byte数组
	 */
	public static byte[] getByteArray(Blob blob) {
		try {
			return IOUtil.readByteArray(blob.getBinaryStream());
		} catch (Exception e) {
			throw new UtilsException("读取Blob出错:" + e.getMessage(), e);
		}
	}

	/**
	 * 从blob中读出系列化的对象
	 * 
	 * @param o
	 *            blob对象
	 * @return 序列化的对象
	 */
	public static Object getObjectFromBlob(Object o) {
		return getObject(o);
	}

	/**
	 * 获取Object <br/>
	 * 
	 * @param o
	 *            待转换的对象
	 * @return o instanceof Blob,读取Blob中的Object<br/>
	 *         其他,不变
	 * @see #getObject(Blob)
	 */
	public static Object getObject(Object o) {
		Object result = o;
		if (o instanceof Blob)
			result = getObject((Blob) o);
		else if (o instanceof byte[])
			result = ObjectUtil.toObject((byte[]) o);
		return result;
	}

	/**
	 * 从Blob中读取出对象
	 * 
	 * @param blob
	 *            Blob对象
	 * @return 对象
	 */
	public static Object getObject(Blob blob) {
		try {
			return IOUtil.readObject(blob.getBinaryStream());
		} catch (Exception e) {
			throw new UtilsException("读取Blob出错:" + e.getMessage(), e);
		}
	}

}
