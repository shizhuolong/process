package org.apdplat.wgreport.util;

import java.net.InetAddress;

public abstract class UUIDUtil {
	private static final int IP;
	static {
		int ipadd;
		try {
			ipadd = ByteUtil.toInt(InetAddress.getLocalHost().getAddress());
		} catch (Exception e) {
			ipadd = 0;
		}
		IP = ipadd;
	}
	private static short counter = (short) 0;
	private static final int JVM = (int) (System.currentTimeMillis() >>> 8);

	/**
	 * Unique across JVMs on this machine (unless they load this class in the
	 * same quater second - very unlikely)
	 */
	public static int getJVM() {
		return JVM;
	}

	/**
	 * Unique in a millisecond for this JVM instance (unless there are >
	 * Short.MAX_VALUE instances created in a millisecond)
	 */
	public static short getCount() {
		synchronized (UUIDUtil.class) {
			if (counter < 0)
				counter = 0;
			return counter++;
		}
	}

	/**
	 * Unique in a local network
	 */
	public static int getIP() {
		return IP;
	}

	/**
	 * Unique down to millisecond
	 */
	public static short getHiTime() {
		return (short) (System.currentTimeMillis() >>> 32);
	}

	public static int getLoTime() {
		return (int) System.currentTimeMillis();
	}

	/**
	 * 分隔符
	 */
	private static final String sep = "";

	public static String format(int intval) {
		String formatted = Integer.toHexString(intval);
		StringBuffer buf = new StringBuffer("00000000");
		buf.replace(8 - formatted.length(), 8, formatted);
		return buf.toString();
	}

	public static String format(short shortval) {
		String formatted = Integer.toHexString(shortval);
		StringBuffer buf = new StringBuffer("0000");
		buf.replace(4 - formatted.length(), 4, formatted);
		return buf.toString();
	}

	public static String generate() {
		return new StringBuffer(36)
		.append(format(getIP())).append(sep)
		.append(format(getJVM())).append(sep)
		.append(format(getHiTime())).append(sep)
		.append(format(getLoTime())).append(sep)
		.append(format(getCount()))
		.toString();
	}

}
