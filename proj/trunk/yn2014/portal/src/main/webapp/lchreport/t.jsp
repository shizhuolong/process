<%@page import="java.lang.reflect.Method"%>
<%@page import="com.lch.report.util.CompilerUtil"%>
<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>

<%
String fullName = "com.lch.report.power.UnitOrgPower";
String src="";
src+=" package com.lch.report.power;                                          ";
src+="                                                                        ";
src+=" import org.apdplat.module.security.model.Org;                          ";
src+=" import org.apdplat.module.security.model.User;                         ";
src+=" import org.apdplat.module.security.service.UserHolder;                 ";
src+="                                                                        ";
src+=" public class UnitOrgPower {                                            ";
src+=" 	public String getPowerSql(){                                          ";
src+=" 		String s=\"\";                                                    ";
src+=" 		User user = UserHolder.getCurrentLoginUser();                     ";
src+=" 		Org org = user.getOrg();                                          ";
src+=" 		String level=org.getOrgLevel();                                   ";
src+=" 		String code=org.getCode();                                        ";
src+=" 		if(\"2\".equals(level)){                                          ";
src+=" 			s=  \" and t.GROUP_ID_1='\"+code+\"' \";                      ";
src+=" 		}else if(\"3\".equals(level)){                                    ";
src+=" 			s=  \" and t.unit_id='\"+code+\"' \";                         ";
src+=" 		}else if(\"4\".equals(level)){                                    ";
src+=" 			s=  \" and t.GROUP_ID_4='\"+code+\"' \";                      ";
src+=" 		}else if(4<Integer.parseInt(level)){                              ";
src+=" 			s= \" and 1=2 \";                                             ";
src+=" 		}                                                                 ";
src+=" 		return s;                                                         ";
src+=" 	}                                                                     ";
src+=" }                                                                      ";

System.out.println(src);
CompilerUtil de = CompilerUtil.getInstance();
Object instance =  de.javaCodeToObject(fullName,src.toString());
out.println(instance);
//调用方法
Class clazz=instance.getClass();
Method method=clazz.getDeclaredMethod("getPowerSql", new Class[]{});

Object r= method.invoke(instance);
out.println("执行结果："+r);

%>
