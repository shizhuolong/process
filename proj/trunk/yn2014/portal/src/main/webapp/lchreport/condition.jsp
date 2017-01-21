<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.Calendar"%>
<%@page import="com.lch.report.dto.Equal"%>
<%@page import="com.lch.report.dto.Button"%>
<%@page import="com.lch.report.dto.Like"%>
<%@page import="java.util.List"%>
<%@page import="com.lch.report.dto.Condition"%>
	
			<form id="condition">
<%
	Condition cd=report.getCondition();
	if(cd!=null){
		for(Object o:cd.getConditions()){
			//模糊查询
			if(o instanceof Like){
				Like like=(Like) o;
%>
				<%=like.getDesc() %>:<input type="text" value='' name="<%=like.getColumn()%>"/>&nbsp;
<%			
			}else if(o instanceof Equal){
				Equal equal=(Equal) o;
				//下拉选择
				if(equal.getType().equals("select")){
%>
					<%=equal.getDesc() %>:<select  value='' cdtype='select' name="<%=equal.getColumn()%>" table="<%=equal.getTableName()%>">
					</select>
<%		
				}else if(equal.getType().equals("date")){
					Calendar ca=Calendar.getInstance();
					String time=new SimpleDateFormat(equal.getFormat()).format(ca.getTime());
%>
					<input type="text"  class="Wdate default-text-input wper80" 
						onclick="WdatePicker({skin:'whyGreen',dateFmt:'<%=equal.getFormat()%>'})" value="<%=time %>" name="<%=equal.getColumn() %>">
<%	
				}
			}else if(o instanceof Button){
				Button btn=(Button) o;
%>
				<input type="button" value='<%=btn.getValue() %>' onclick="<%=btn.getMethod()%>"/>&nbsp;
<%			
			}
		}
	}
%>
			</form>