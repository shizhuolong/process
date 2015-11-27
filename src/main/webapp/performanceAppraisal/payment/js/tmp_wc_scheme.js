    var nowData = [];
    var title=[["活动编码","活动名称"]];
    var field=["SCHEME_ID","SCHEME_NAME"];
    var orderBy = '';
    var report = null;
	$(function() {
		report = new LchReport({
			title : title,
			field : field,
			css:[{gt:3,css:LchReport.RIGHT_ALIGN}],
			rowParams : [],//第一个为rowId
			content : "lchcontent",
			getSubRowsCallBack : function($tr) {
				return {
					data : nowData,
					extra : {}
				};
			}
		});
		search(0);
		$("#searchBtn").click(function(){
			search(0);
		});
	});

	var pageSize = 10;
	//分页
	function initPagination(totalCount) {
		$("#totalCount").html(totalCount);
		$("#pagination").pagination(totalCount, {
			callback : search,
			items_per_page : pageSize,
			link_to : "###",
			prev_text : '上页', //上一页按钮里text  
			next_text : '下页', //下一页按钮里text  
			num_display_entries : 5,
			num_edge_entries : 2
		});
	}
	function getSql(){
		var fs=field.join(",");
		return "select "+fs+" from ptemp.TB_TMP_WC_SCHEME where 1=1";
	}
	//列表信息
	function search(pageNumber) {
		pageNumber = pageNumber + 1;
		var start = pageSize * (pageNumber - 1);
		var end = pageSize * pageNumber;
		var scheme_id = $.trim($("#scheme_id").val());
		var scheme_name = $.trim($("#scheme_name").val());

		var sql = getSql();
		if(scheme_id!=null&&scheme_id!=""){
			sql+=" and scheme_id like '%"+scheme_id+"%'";
		}
		if(scheme_name!=null&&scheme_name!=""){
			sql+=" and scheme_name like '%"+scheme_name+"%'";
		}
		var cdata = query("select count(*) total from("+sql+")");
		var total = 0;
		if (cdata && cdata.length) {
			total = cdata[0].TOTAL;
		} else {
			return;
		}
		sql = "select ttt.* from ( select tt.*,rownum r from (" + sql
				+ " ) tt where rownum<=" + end + " ) ttt where ttt.r>" + start;
		var d = query(sql);
		if (pageNumber == 1) {
			initPagination(total);
		}
		nowData = d;

		report.showSubRow();
		$("#lch_DataHead").find("TH").unbind();
		$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
		$(".page_count").width($("#lch_DataHead").width());
		$("#lch_DataBody").find("TR").each(function(){
			var area=$(this).find("TD:eq(0)").find("A").text();
			if(area)
				$(this).find("TD:eq(0)").empty().text(area);
		});
		
	}
	/////////////////////////下载开始/////////////////////////////////////////////
	function downsAll() {
		var scheme_id = $.trim($("#scheme_id").val());
		var scheme_name = $.trim($("#scheme_name").val());

		var sql = getSql();
		if(scheme_id!=null&&scheme_id!=""){
			sql+=" and scheme_id like '%"+scheme_id+"%'";
		}
		if(scheme_name!=null&&scheme_name!=""){
			sql+=" and scheme_name like '%"+scheme_name+"%'";
		}
	
		showtext = '活动明细';
		downloadExcel(sql,title,showtext);
	}
	/////////////////////////下载结束/////////////////////////////////////////////