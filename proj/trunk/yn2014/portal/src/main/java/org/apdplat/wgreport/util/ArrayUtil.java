package org.apdplat.wgreport.util;

import java.lang.reflect.Array;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;

import org.apdplat.wgreport.support.handler.ItemHandler;


public abstract class ArrayUtil {

	/**
	 * 连接两个数组
	 * 
	 * @param arr1
	 *            数组1
	 * @param arr2
	 *            数组2
	 * @return 连接后的新数组,若两个数组都为null返回null;
	 */
	public static Object[] concat(final Object[] arr1, final Object[] arr2) {
		// 设定返回类型
		Class compType = Object.class;
		if (arr1 != null)
			compType = arr1.getClass().getComponentType();
		else if (arr2 != null)
			compType = arr2.getClass().getComponentType();

		int newArrLength = (arr1 == null ? 0 : arr1.length)
				+ (arr2 == null ? 0 : arr2.length);

		Object[] newArr = (Object[]) Array.newInstance(compType, newArrLength);
		int start = 0;
		// 拷贝两个数组
		if (arr1 != null) {
			System.arraycopy(arr1, 0, newArr, start, arr1.length);
			start = arr1.length;
		}
		if (arr2 != null)
			System.arraycopy(arr2, 0, newArr, start, arr2.length);
		return newArr;
	}

	/**
	 * 添加对象到目标数组,可添加null值
	 * 
	 * @param array
	 *            目标数组
	 * @param obj
	 *            待添加的对象
	 * @return 新的数组
	 */
	public static Object[] addObject(final Object[] array, Object obj) {
		// 设定返回类型
		Class compType = Object.class;
		if (array != null)
			compType = array.getClass().getComponentType();
		else if (obj != null)
			compType = obj.getClass();

		int newArrLength = array == null ? 1 : array.length + 1;

		Object[] newArr = (Object[]) Array.newInstance(compType, newArrLength);
		// 拷贝两个数组
		if (array != null) {
			System.arraycopy(array, 0, newArr, 0, array.length);
		}
		newArr[newArrLength - 1] = obj;
		return newArr;
	}

	/**
	 * 将集合数据转换到数组 <br/>
	 * 返回的数组类型为集合的组件类型
	 * 
	 * @param collection
	 *            集合
	 * @param itemHandler
	 *            转换器
	 * @return 转换后的数组
	 */
	public static Object[] toArray(Collection collection,
			ItemHandler itemHandler) {
		if (collection == null)
			return null;
		if (itemHandler == null)
			return collection.toArray();
		// 设定返回类型
		Class compType = collection.getClass().getComponentType();
		if (compType == null)
			compType = Object.class;
		int newArrLength = collection.size();
		Object[] newArr = (Object[]) Array.newInstance(compType, newArrLength);
		Iterator it = collection.iterator();
		int index = 0;
		while (it.hasNext()) {
			Object o = it.next();
			newArr[index++] = itemHandler.handle(o);
		}
		return newArr;
	}

	/**
	 * 将数组数据转换到另一个数组 <br/>
	 * 返回的数组类型为原数组的组件类型
	 * 
	 * @param array
	 *            数组
	 * @param itemHandler
	 *            转换器
	 * @return 转换后的数组
	 */
	public static Object[] toArray(Object[] array, ItemHandler itemHandler) {
		if (array == null)
			return null;
		// 设定返回类型
		Class compType = array.getClass().getComponentType();
		if (compType == null)
			compType = Object.class;
		int newArrLength = array.length;
		Object[] newArr = (Object[]) Array.newInstance(compType, newArrLength);
		for (int i = 0; i < newArrLength; i++) {
			Object o = array[i];
			newArr[i] = itemHandler.handle(o);
		}
		return newArr;
	}

	/**
	 * 将集合中的对象转换为目标数值类型数组
	 * 
	 * @param collection
	 *            集合
	 * @param targetType
	 *            模板数值类型
	 * @return 数组
	 * @see NumberUtil
	 */
	public static Object[] toArray(Collection collection, Class targetType) {
		if (CollectionUtil.isNull(collection))
			return (Object[]) Array.newInstance(targetType, 0);
		else {
			return toArray(collection, getItemHandler(targetType));
		}
	}

	/**
	 * 根据类型获得数值转换器
	 * 
	 * @param type
	 *            数值类型
	 * @return 数值转换器
	 */
	protected static ItemHandler getItemHandler(Class type) {
		ItemHandler transformer = null;
		if (Integer.class.isAssignableFrom(type))
			transformer = new ItemHandler() {
				public Object handle(Object o) {
					return NumberUtil.parseInteger(o);
				}
			};
		else if (Short.class.isAssignableFrom(type))
			transformer = new ItemHandler() {
				public Object handle(Object o) {
					return NumberUtil.parseShort(o);
				}
			};
		else if (Long.class.isAssignableFrom(type))
			transformer = new ItemHandler() {
				public Object handle(Object o) {
					return NumberUtil.parseLong(o);
				}
			};
		else if (Float.class.isAssignableFrom(type))
			transformer = new ItemHandler() {
				public Object handle(Object o) {
					return NumberUtil.parseFloat(o);
				}
			};
		else if (Double.class.isAssignableFrom(type))
			transformer = new ItemHandler() {
				public Object handle(Object o) {
					return NumberUtil.parseDouble(o);
				}
			};
		else if (BigDecimal.class.isAssignableFrom(type))
			transformer = new ItemHandler() {
				public Object handle(Object o) {
					return NumberUtil.safeParseBigDecimal(o);
				}
			};
		else if (String.class.isAssignableFrom(type))
			transformer = new ItemHandler() {
				public Object handle(Object o) {
					return o == null ? null : o.toString();
				}
			};
		else
			transformer = null;
		return transformer;
	}

	/**
	 * 测试数据是否在数组中存在
	 * 
	 * @param array
	 *            数组
	 * @param o
	 *            数据
	 * @return true/false
	 */
	public static boolean contains(Object[] array, Object o) {
		if (array == null)
			return false;
		for (int i = 0; i < array.length; i++) {
			if (o == null) {
				if (array[i] == null)
					return true;
			} else if (o.equals(array[i]))
				return true;
		}
		return false;
	}

	/**
	 * 测试数据是否在数组中存在
	 * 
	 * @param array
	 *            数组
	 * @param o
	 *            数据
	 * @return true/false
	 */
	public static boolean contains(int[] array, int o) {
		if (array == null)
			return false;
		for (int i = 0; i < array.length; i++) {
			if (array[i] == 0)
				return true;
		}
		return false;
	}

	/**
	 * 去除数组中的重复值
	 * 
	 * @param array
	 *            数组
	 * @return 新数组
	 */
	public static Object[] unique(Object[] array) {
		if (array == null)
			return null;
		Class compType = array.getClass().getComponentType();
		List list = Arrays.asList(array);
		array = CollectionUtil.uniqueSet(list).toArray(
				(Object[]) Array.newInstance(compType, 0));
		return array;
	}

	/**
	 * 将数组转换成List
	 * 
	 * @param array
	 *            数组
	 * @return List
	 */
	public static List toList(Object[] array) {
		if (array == null)
			return null;
		List list = new ArrayList();
		for (int i = 0, imax = array.length; i < imax; i++)
			list.add(array[i]);
		return list;
	}
}
