package com.lch.report.util;

import java.io.IOException;
import java.io.StringWriter;

import org.codehaus.jackson.JsonFactory;
import org.codehaus.jackson.JsonGenerator;
import org.codehaus.jackson.map.ObjectMapper;

public class JsonUtil {
	private static final ObjectMapper objectMapper = new ObjectMapper();
	public static String beanToJson(Object obj) {

		StringWriter writer = new StringWriter();

		try {
			JsonGenerator gen = new JsonFactory().createJsonGenerator(writer);
			objectMapper.writeValue(gen, obj);

			gen.close();

			writer.flush();
			writer.close();
		} catch (IOException e) {
			e.printStackTrace();
		}

		return writer.toString();
	}
	public static <T> T jsonToBean(String json, Class<T> clazz) {
		try {
			return objectMapper.readValue(json, clazz);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	public static void main(String[] args) {
		
	}
}
