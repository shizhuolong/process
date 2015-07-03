package org.apdplat.wgreport.support.preferense;

import java.io.IOException;
import java.util.Properties;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apdplat.wgreport.util.PropertyUtil;
import org.springframework.core.io.Resource;

public class Config {
	private final static Log logger = LogFactory.getLog(Config.class);
	private Resource[] configPropertyLocations;

	private static Properties props;

	public void init() throws IOException {
		if (props != null)
			return;
		props = new Properties();
		if (configPropertyLocations != null) {
			PropertyUtil.fillProperties(props, configPropertyLocations);
		}
		System.out.println("Config properties finished,keys are\n:" + props.keySet());
	}

	public static String getProperty(String key) {
		return props.getProperty(key);
	}

	public void setConfigPropertyLocations(Resource[] configPropertyLocations) {
		this.configPropertyLocations = configPropertyLocations;
	}

	
	
}
