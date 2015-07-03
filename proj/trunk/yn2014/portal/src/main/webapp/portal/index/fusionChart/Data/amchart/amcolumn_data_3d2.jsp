
<%@ page language="java" pageEncoding="utf-8" contentType="text/xml"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<chart width="100" height="100">
  <!-- <message bg_color="#BBBB00" text_color="#FFFFFF"><![CDATA[You can broadcast any message to chart from data XML file]]></message> -->
	<series>
		<s:iterator value="list" status="status">
			<value xid="${status.index}">${x}</value>
		</s:iterator>
	</series>
	<graphs>
		<graph gid="1">
			<s:iterator value="list" status="status">
				<value xid="${status.index}">${y1}</value>
			</s:iterator>
		</graph>
		<graph gid="2">
			<s:iterator value="list" status="status">
				<value xid="${status.index}">${y2}</value>
			</s:iterator>
		</graph>
		<!-- 
		<graph gid="3">
			<s:iterator value="list" status="status">
				<value xid="${status.index}">${y3}</value>
			</s:iterator>
		</graph>
		 -->
	</graphs>
	
	
</chart>
