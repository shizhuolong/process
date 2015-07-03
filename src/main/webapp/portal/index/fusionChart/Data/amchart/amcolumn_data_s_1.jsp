
<%@ page language="java" pageEncoding="utf-8" contentType="text/xml"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<chart width="100" height="100">
	<series>
		<value xid="1">高值商务客户</value>
		<value xid="2">中值商务客户</value>
		<value xid="3">普通商务客户</value>
	</series>
	<graphs>
		<s:iterator value="list" status="status">
			<graph gid="${status.index}" title="${type}">
				<value xid="1">${y1}</value>
				<value xid="2">${y2}</value>
				<value xid="3">${y3}</value>
			</graph>
		</s:iterator>			
	</graphs>
</chart>
