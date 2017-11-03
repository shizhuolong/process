<%@page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@include file="import_comm.jsp"%>
<html>
  <head>
     <script type="text/javascript">
        var field="SUB_ORDER,ORDER_ID,BRAND_ID,MODEL_ID,ORDER_AMOUNT,AGENT_PRICE,ORDER_PRICE,DISCOUNT_PRICE,ORDER_MONEY,ORDER_TIME,CHNL_ID,SHOP_ID,PROXY_SHOP_ID,PRODUCT_TYPE,GDS_ID,GDS_NAME,SKU_ID,SKU_INFO,DELIVER_STATUS,REMARK,DELIVER_AMOUNT,PROVINCE_CODE,CREATE_TIME,CREATE_STAFF,UPDATE_STAFF,UPDATE_TIME";
        var table="PTEMP.T_ORD_INFO";
        var headRows="1";
        $("#field").val(field);
        $("#headRows").val(headRows);
        $("#table").val(table);
        $("#time").val("");
     </script>
  </head>
</html>
