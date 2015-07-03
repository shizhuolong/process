package org.apdplat.wgreport.support.servlets;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.URLDecoder;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apdplat.wgreport.util.BooleanUtil;

public class FileDownloadServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void service(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		String path = request.getParameter("path");// 文件的url访问路径
		String alias = request.getParameter("alias");// 文件别名
		String inline = request.getParameter("inline");// 是否内联,true时表示允许在浏览器中打开

		String filePath = path.matches("(?i)\\s*system:.*") ? path
				.replaceFirst("(?i)\\s*system:", "") : getServletContext()
				.getRealPath(path);
				System.out.println(filePath);
		boolean isInline = BooleanUtil.safeParse(inline); // 是否允许直接在浏览器内打开(如果浏览器能够预览此文件内容,
		// 那么文件将被打开, 否则会提示下载)

		// 清空缓冲区, 防止页面中的空行, 空格添加到要下载的文件内容中去
		// 如果不清空的话在调用 response.reset() 的时候 Tomcat 会报错
		// java.lang.IllegalStateException: getOutputStream() has already been
		// called for
		// this response,
		// out.clear();

		// {{{ BEA Weblogic 必读
		// 修正 Bea Weblogic 出现
		// "getOutputStream() has already been called for this response"错误的问题
		// 关于文件下载时采用文件流输出的方式处理：
		// 加上response.reset()，并且所有的％>后面不要换行，包括最后一个；
		// 因为Application Server在处理编译jsp时对于％>和<％之间的内容一般是原样输出，而且默认是PrintWriter，
		// 而你却要进行流输出：ServletOutputStream，这样做相当于试图在Servlet中使用两种输出机制，
		// 就会发生：getOutputStream() has already been called for this response的错误
		// 详细请见《More Java Pitfill》一书的第二部分 Web层Item 33：试图在Servlet中使用两种输出机制 270
		// 而且如果有换行，对于文本文件没有什么问题，但是对于其它格式，比如AutoCAD、Word、Excel等文件
		// 下载下来的文件中就会多出一些换行符0x0d和0x0a，这样可能导致某些格式的文件无法打开，有些也可以正常打开。
		// 同时这种方式也能清空缓冲区, 防止页面中的空行等输出到下载内容里去
		response.reset();
		// }}}

		try {
			java.io.File f = new java.io.File(filePath);
			if (f.exists() && f.canRead()) {
				// 我们要检查客户端的缓存中是否已经有了此文件的最新版本, 这时候就告诉
				// 客户端无需重新下载了, 当然如果不想检查也没有关系
				if (checkFor304(request, f)) {
					// 客户端已经有了最新版本, 返回 304
					response.sendError(HttpServletResponse.SC_NOT_MODIFIED);
					return;
				}

				// 从服务器的配置来读取文件的 contentType 并设置此contentType, 不推荐设置为
				// application/x-download, 因为有时候我们的客户可能会希望在浏览器里直接打开,
				// 如 Excel 报表, 而且 application/x-download 也不是一个标准的 mime type,
				// 似乎 FireFox 就不认识这种格式的 mime type
				String mimetype = null;
				mimetype = getServletContext().getMimeType(filePath);
				if (mimetype == null) {
					// IE 的话就只能用 IE 才认识的头才能下载 HTML 文件, 否则 IE 必定要打开此文件!
					String ua = request.getHeader("User-Agent"); // 获取终端类型
					if (ua == null)
						ua = "User-Agent: Mozilla/4.0 (compatible; MSIE 6.0;)";
					boolean isIE = ua.toLowerCase().indexOf(" msie ") != -1; // 是否为
					// IE

					if (isIE && !isInline) {
						mimetype = "application/x-msdownload;charset=ISO8859-1";
					} else
						mimetype = "application/octet-stream;charset=ISO8859-1";
				}

				response.setContentType(mimetype);

				// 下面我们将设法让客户端保存文件的时候显示正确的文件名, 具体就是将文件名
				// 转换为 ISO8859-1 编码
				// 若有别名取别名为下载文件的名称,否则取真实文件的名字
				String downFileName = alias == null ? f.getName() : alias;
				downFileName = URLDecoder.decode(downFileName, "UTF-8");

				downFileName = new String(downFileName.getBytes("UTF-8"), "ISO8859-1");

				String inlineType = isInline ? "inline" : "attachment"; // 是否内联附件

				// or using this, but this header might not supported by FireFox
				// response.setContentType("application/x-download");
				response.setHeader("Content-Disposition", inlineType
						+ ";filename=\"" + downFileName + "\"");

				response.setContentLength((int) f.length()); // 设置下载内容大小

				byte[] buffer = new byte[4096]; // 缓冲区
				BufferedOutputStream output = null;
				BufferedInputStream input = null;

				//
				try {
					output = new BufferedOutputStream(response
							.getOutputStream());
					input = new BufferedInputStream(new FileInputStream(f));

					int n = (-1);
					while ((n = input.read(buffer, 0, 4096)) > -1) {
						output.write(buffer, 0, n);
					}
					response.flushBuffer();
				} catch (Exception e) {
					// e.printStackTrace();
				} // 用户可能取消了下载
				finally {
					if (input != null)
						input.close();
					if (output != null)
						output.close();
				}

			}
			return;
		} catch (Exception ex) {
			// ex.printStackTrace();
		}
		// 如果下载失败了就告诉用户此文件不存在
		response.sendError(404);
	}

	/**
	 * If returns true, then should return a 304 (HTTP_NOT_MODIFIED)
	 */
	protected boolean checkFor304(HttpServletRequest req, File file) {
		// 
		// We'll do some handling for CONDITIONAL GET (and return a 304)
		// If the client has set the following headers, do not try for a 304.
		// 
		// pragma: no-cache
		// cache-control: no-cache
		//

		if ("no-cache".equalsIgnoreCase(req.getHeader("Pragma"))
				|| "no-cache".equalsIgnoreCase(req.getHeader("cache-control"))) {
			// Wants specifically a fresh copy
		} else {
			// 
			// HTTP 1.1 ETags go first
			//
			String thisTag = Long.toString(file.lastModified());

			String eTag = req.getHeader("If-None-Match");

			if (eTag != null) {
				if (eTag.equals(thisTag)) {
					return true;
				}
			}

			// 
			// Next, try if-modified-since
			//
			DateFormat rfcDateFormat = new SimpleDateFormat(
					"EEE, dd MMM yyyy HH:mm:ss z");
			Date lastModified = new Date(file.lastModified());

			try {
				long ifModifiedSince = req.getDateHeader("If-Modified-Since");

				// log.info("ifModifiedSince:"+ifModifiedSince);
				if (ifModifiedSince != -1) {
					long lastModifiedTime = lastModified.getTime();

					// log.info("lastModifiedTime:" + lastModifiedTime);
					if (lastModifiedTime <= ifModifiedSince) {
						return true;
					}
				} else {
					try {
						String s = req.getHeader("If-Modified-Since");

						if (s != null) {
							Date ifModifiedSinceDate = rfcDateFormat.parse(s);
							// log.info("ifModifiedSinceDate:" +
							// ifModifiedSinceDate);
							if (lastModified.before(ifModifiedSinceDate)) {
								return true;
							}
						}
					} catch (ParseException e) {
						// log.warn(e.getLocalizedMessage(), e);
					}
				}
			} catch (IllegalArgumentException e) {
				// Illegal date/time header format.
				// We fail quietly, and return false.
				// FIXME: Should really move to ETags.
			}
		}

		return false;
	}

}
