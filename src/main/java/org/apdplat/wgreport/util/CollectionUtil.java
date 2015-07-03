package org.apdplat.wgreport.util;

import java.util.Collection;
import java.util.Iterator;
import java.util.LinkedHashSet;
import java.util.Set;

public abstract class CollectionUtil {
	/**
	 * 是否为空
	 * 
	 * @param collection
	 *            集合
	 * @return collection==null 或者 collection.isEmpty() 时 true,否则false
	 */
	public static boolean isNull(Collection collection) {
		return collection == null || collection.isEmpty();
	}

	/**
	 * 移除重复值
	 * 
	 * @param collection
	 *            输入集合
	 * @return 移除重复值后的Set
	 */
	public static Set uniqueSet(Collection collection) {
		return new LinkedHashSet(collection);
	}

	/**
	 * 移除重复值,返回新集合,集合类型与输入类型相同
	 * 
	 * @param collection
	 *            输入集合
	 * @return 移除重复值后的集合
	 */
	public static Collection unique(Collection collection) {
		if (collection == null)
			return null;
		Class compType = collection.getClass();
		Collection result = (Collection) ObjectUtil.getInstance(compType);
		if (collection.isEmpty())
			return result;
		Set set = uniqueSet(collection);
		result.addAll(set);
		return result;
	}

	/**
	 * 从集合中取子集
	 * 
	 * @param collection
	 *            集合
	 * @param start
	 *            开始序号
	 * @param num
	 *            个数
	 * @return 子集合
	 */
	public static Collection slice(Collection collection, int start, int num) {
		if (collection == null)
			return null;
		Class compType = collection.getClass();
		Collection result = (Collection) ObjectUtil.getInstance(compType);
		int index = 0;
		if (num == 0)
			return result;
		Iterator it = collection.iterator();
		while (num > 0 && it.hasNext()) {
			if (index++ < start) {
				it.next();
				continue;
			}
			num--;
			result.add(it.next());
		}
		return result;
	}

	/**
	 * 从集合中取子集,拷贝开始位置后的所有元素
	 * 
	 * @param collection
	 *            集合
	 * @param start
	 *            从开始位置开始拷贝
	 * @return 子集合
	 */
	public static Collection slice(Collection collection, int start) {
		if (collection == null)
			return null;
		Class compType = collection.getClass();
		Collection result = (Collection) ObjectUtil.getInstance(compType);
		int index = 0;
		Iterator it = collection.iterator();
		while (it.hasNext()) {
			if (index++ < start) {
				it.next();
				continue;
			}
			result.add(it.next());
		}
		return result;
	}
}
