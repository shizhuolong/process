
<%@ page language="java" pageEncoding="utf-8" contentType="text/xml"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<chart width="100" height="100">
	<series>
		<s:iterator value="list" status="status">
			<!--<value xid="<s:property value="#status.index"/>">${name}</value>-->
			<value xid="${status.index}">${x}</value>
		</s:iterator>
	</series>
	<graphs>
		<graph gid="1">
			<s:iterator value="list" status="status">
				<value xid="${status.index}" color="${color}">${y}</value>
			</s:iterator>
		</graph>
	</graphs>
</chart>
