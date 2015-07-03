package org.apdplat.wgreport.util;

import java.io.File;
import java.io.IOException;
import java.util.Properties;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PropertiesLoaderUtils;

public abstract class PropertyUtil {
	public static void fillProperties(Properties props, Resource[] ress)
			throws IOException {
		for (int i = 0; i < ress.length; i++)
			fillProperties(props, ress[i]);
	}

	public static void fillProperties(Properties props, Resource res)
			throws IOException {
		File file = res.getFile();
		if (file.isDirectory()) {
			File[] files = file.listFiles();
			for (int i = 0; i < files.length; i++) {
				fillProperties(props, new FileSystemResource(files[i]));
			}
		} else {
			PropertiesLoaderUtils.fillProperties(props, res);
		}
	}

	public static void fillProperties(Properties props, File file)
			throws IOException {
		fillProperties(props, new FileSystemResource(file));
	}
}
