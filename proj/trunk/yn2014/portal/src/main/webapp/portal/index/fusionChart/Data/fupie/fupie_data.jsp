<%@ page language="java" pageEncoding="utf-8" contentType="text/xml"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<graph showNames='1'  decimalPrecision='0'  >
	<s:iterator value="list" status="status">
		<set name='${x}' value='${y}' />
	</s:iterator>
</graph>
