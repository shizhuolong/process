package org.apdplat.wgreport.util;

import org.apdplat.wgreport.support.servlets.SpringServlet;


public abstract class PathUtil {
	public static String realPath(String path, String contextpath) {
		return path.replaceAll("^/", contextpath).replaceAll("^\\./",
				contextpath);
	}

	public static String getWebRootAbsolutePath(String path) {
		return SpringServlet.getRealPath(path);
	}

	public static String getWebRootAbsolutePath() {
		return getWebRootAbsolutePath("/");
	}
}
