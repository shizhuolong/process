package org.apdplat.wgreport.util;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.OutputStream;
import java.io.Reader;
import java.io.UnsupportedEncodingException;
import java.io.Writer;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * <p>
 * IO工具类
 * </p>
 * <p>
 * 注意：此类中很多方法将关闭基础流
 * </p>
 * 
 * 
 */
public abstract class IOUtil {
	final static Log logger = LogFactory.getLog(IOUtil.class);

	/**
	 * 读取文件到字符串中,将关闭基础流
	 * 
	 * @param file
	 *            文件
	 * @return 字符串
	 */
	public static String readToString(File file) {
		try {

			return readToString(new FileInputStream(file));
		} catch (FileNotFoundException e) {
			throw new UtilsException("读取文件[" + file.getAbsolutePath() + "]出错:"
					+ e.getLocalizedMessage(), e);
		}
	}

	/**
	 * 读取输入流到字符串中(读入编码为UTF-8),将关闭基础流
	 * 
	 * @param stream
	 *            输入流
	 * @return 字符串
	 */
	public static String readToString(InputStream stream) {
		return readToString(stream, "UTF-8");
	}

	/**
	 * 以特定编码读取输入流到字符串中,将关闭基础流
	 * 
	 * @param stream
	 *            输入流
	 * @param charset
	 *            编码
	 * @return 字符串
	 */
	public static String readToString(InputStream stream, String charset) {
		try {
			return readToString(new InputStreamReader(stream, charset));
		} catch (UnsupportedEncodingException e) {
			throw new UtilsException("不支持此编码!" + e.getMessage(), e);
		} finally {
			close(stream);
		}
	}

	/**
	 * 读取数据到字符串中,将关闭reader
	 * 
	 * @param reader
	 *            读取器
	 * @return 字符串
	 */
	public static String readToString(Reader reader) {
		StringBuffer result = new StringBuffer();

		String temp;
		try {
			BufferedReader breader = new BufferedReader(reader);
			while (true) {
				temp = breader.readLine();
				if (temp == null)
					break;
				result.append(temp);
			}
		} catch (IOException e) {
			throw new UtilsException("读取出错:" + e.getMessage(), e);
		} finally {
			close(reader);
		}

		return result.toString();
	}

	/**
	 * 写入对象,将关闭基础流
	 * 
	 * @param o
	 *            待写入的对象
	 * @param out
	 *            输出流
	 */
	public static void writeObject(Object o, OutputStream out) {
		ObjectOutputStream oout = null;
		try {
			oout = new ObjectOutputStream(out);
			oout.writeObject(o);
		} catch (IOException e) {
			throw new UtilsException("写入对象出错:" + e.getMessage(), e);
		} finally {
			close(oout);
		}
	}

	/**
	 * 从输入流中读取对象,将关闭基础流
	 * 
	 * @param in
	 *            输入流
	 * @return 对象
	 */
	public static Object readObject(InputStream in) {
		Object result = null;
		ObjectInputStream oin = null;
		try {
			oin = new ObjectInputStream(in);
			result = oin.readObject();
		} catch (Exception e) {
			throw new UtilsException("读取对象出错:" + e.getMessage(), e);
		} finally {
			close(oin);
		}
		return result;
	}

	/**
	 * 从输入流中读取byte数据,将关闭基础流
	 * 
	 * @param in
	 *            输入流
	 * @return byte数组
	 */
	public static byte[] readByteArray(InputStream in) {
		ByteArrayOutputStream bout = new ByteArrayOutputStream();
		IOUtil.writeToOutputStream(in, bout);
		return bout.toByteArray();
	}

	/**
	 * 将输入流中的数据读入到输出流中,将关闭基础流
	 * 
	 * @param in
	 *            输入流
	 * @param out
	 *            输出流
	 * 
	 */
	public static void writeToOutputStream(InputStream in, OutputStream out) {
		writeToOutputStream(in, out, true);
	}

	/**
	 * 将输入流中的数据读入到输出流中
	 * 
	 * @param in
	 *            输入流
	 * @param out
	 *            输出流
	 * @param close
	 *            是否关闭基础流
	 */
	public static void writeToOutputStream(InputStream in, OutputStream out,
			boolean close) {
		try {
			int i = -1;
			byte[] by = new byte[1024];
			while ((i = in.read(by)) != -1) {
				out.write(by, 0, i);
			}
		} catch (IOException e) {
			throw new UtilsException("将输入流中的数据读入到输出流中出错:" + e.getMessage(), e);
		} finally {
			if (close) {
				close(in);
				close(out);
			}
		}
	}

	/**
	 * 关闭流
	 * 
	 * @param in
	 *            输入流
	 */
	public static void close(InputStream in) {
		if (in != null)
			try {
				in.close();
			} catch (IOException e) {
				logger.warn("输入流关闭失败:" + e.getMessage(), e);
			}
	}

	/**
	 * 关闭流
	 * 
	 * @param out
	 *            输出流
	 */
	public static void close(OutputStream out) {
		if (out != null)
			try {
				out.close();
			} catch (IOException e) {
				logger.warn("输出流关闭失败:" + e.getMessage(), e);
			}
	}

	/**
	 * 关闭读取器
	 * 
	 * @param reader
	 *            读取器
	 */
	public static void close(Reader reader) {
		if (reader != null)
			try {
				reader.close();
			} catch (IOException e) {
				logger.warn("读取器关闭失败:" + e.getMessage(), e);
			}
	}

	/**
	 * 关闭写入器
	 * 
	 * @param writer
	 *            写入器
	 */
	public static void close(Writer writer) {
		if (writer != null)
			try {
				writer.close();
			} catch (IOException e) {
				logger.warn("读取器关闭失败:" + e.getMessage(), e);
			}
	}

	/**
	 * 删除多个文件或目录
	 * 
	 * @param files
	 *            目录或文件
	 * @return true/false 是否成功
	 */
	public static boolean delete(String[] files) {
		int len = files.length;
		File[] fs = new File[len];
		for (int i = 0; i < len; i++)
			fs[i] = new File(files[i]);
		return delete(fs);
	}

	/**
	 * 删除一个文件或目录
	 * 
	 * @param file
	 *            目录或文件
	 * @return true/false 是否成功
	 */
	public static boolean delete(String file) {
		return delete(new File(file));
	}

	/**
	 * 删除多个文件或目录
	 * 
	 * @param files
	 *            目录或文件
	 * @return true/false 是否成功
	 */
	public static boolean delete(File[] files) {
		boolean d = true;
		for (int i = 0, imax = files.length; i < imax; i++) {
			if (!delete(files[i]))
				d = false;
		}
		return d;
	}

	/**
	 * 删除一个文件或目录
	 * 
	 * @param file
	 *            目录或文件
	 * @return true/false 是否成功
	 */
	public static boolean delete(File file) {
		boolean exist = file.exists();
		boolean child = true;
		boolean d = true;
		if (exist && file.isDirectory()) {
			child = delete(file.listFiles());
		}
		if (exist && child)
			d = file.delete();
		if (!d)
			logger.warn("删除[" + file.getAbsolutePath() + "]失败");
		return child && d;
	}
}
