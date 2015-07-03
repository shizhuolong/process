package org.apdplat.module.workflow;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.UUID;

public class EncodeTest {
	public static void main(String[] args) {
		String s="%E7%BD%91%E6%A0%BC%E6%9D%83%E9%99%90%E8%A1%A8%E5%85%B3%E7%B3%BB.pdf";
		try {
			s=java.net.URLDecoder.decode(s,"utf-8");
			System.out.println(s);
			System.out.println(URLEncoder.encode(s, "UTF-8"));
			
			System.out.println(new String(s.getBytes(),"iso8859-1"));
			System.out.println(new String(s.getBytes("GB2312"),"iso8859-1"));
			System.out.println(new String(s.getBytes("utf-8"),"iso8859-1"));
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		System.out.println(UUID.randomUUID().toString().replaceAll("-", ""));
	}
}
