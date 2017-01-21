package org.apdplat.module.workflow;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.junit.Test;

public class RegexText {

	@Test
	public void test01() {
		//var reg = "/^([\w]+)(.[\w]+)*@([\w-]+\.){1,5}([A-Za-z]){2,4}$/";
		String str = "aaa@wo.com.cn";
		String reg = "^([\\w]+)(.[\\w]+)*@([\\w-]+\\.){1,5}([A-Za-z]){2,4}$";
		Pattern p = Pattern.compile(reg);
		Matcher m = p.matcher(str);
		//System.out.println(m.matches());
	}
	
	@Test
	public void test02() {
		String str = "18669270883";
		String reg = "^((13[0-2])|(145)|(15[5-6])|(18[5-6])|(176))\\d{8}$";
		Pattern p = Pattern.compile(reg);
		Matcher m = p.matcher(str);
		//System.out.println(m.matches());
	}
	
	@Test
	public void genUUID() {
		for(int i=0; i<3; i++) {
			String uuid = UUID.randomUUID().toString().replaceAll("-", "");
			//System.out.println(uuid);
		}
	}
	
	@Test
	public void genSeq() {
		SimpleDateFormat format = new SimpleDateFormat("yyyyMMdd");
    	String time = format.format(new Date());
    	//System.out.println(time);
	}
	@Test
	public void testABAB(){
		String str = "asdABAdk";
		String reg = ".*(AB){2}.*";
		Pattern p = Pattern.compile(reg);
		Matcher m = p.matcher(str);
		System.out.println("testABAB:"+m.matches());
		if(m.matches()){
			System.out.println(m.group(0));
		}
	}
	
}
