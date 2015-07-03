package org.apdplat.wgreport.support.formater;

import java.sql.Blob;
import java.sql.Clob;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apdplat.wgreport.util.DBUtil;

public class DefaultFormater implements Formater {
	private final static DateFormat dateFormat = new SimpleDateFormat(
			"yyyy-MM-dd HH:mm:ss");

	/**
	 * <code>Date</code>类型--><code>String</code> 格式为'yyyyMMdd hh:mm:ss'<br/>
	 * <code>CLOB</code>类型--><code>String</code> <br/>
	 * <code>BLOB</code>类型--><code>Object</code> <br/>
	 */
	public Object format(Object obj) {
		Object result = obj;
		if (obj instanceof Date)
			result = dateFormat.format(obj);
		else if (obj instanceof Clob)
			result = DBUtil.getString((Clob) obj);
		else if (obj instanceof Blob)
			result = DBUtil.getObject((Blob) obj);
		return result;
	}

}
