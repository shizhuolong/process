var field=['REGINO_NAME',
           'DEAL_DATE',
           
           'G2_DEV_MON',
           'G2_SW',
           'G2_LOW',
           'G2_S_L_P',
           
           'G3_DEV_MON',
           'G3_SW',
           'G3_LOW',
           'G3_S_L_P',
           
           'G4_DEV_MON',
           'G4_SW',
           'G4_LOW',
           'G4_S_L_P',
           
           'ALL_DEV_MON',
           'ALL_SW',
           'ALL_LOW',
           'ALL_S_L_P'
           ];
var title=[['分公司','账期',
            '2G','','','',
            '3G','','','',
            '4G','','','',
            '移动网','','',''
            ],
           ['','',
            '当月累计发展数','三无用户数','极低用户数','三无及极低用户占比',
            '当月累计发展数','三无用户数','极低用户数','三无及极低用户占比',
            '当月累计发展数','三无用户数','极低用户数','三无及极低用户占比',
            '当月累计发展数','三无用户数','极低用户数','三无及极低用户占比'
            ]
            ];

var  tsql="";

tsql+="  select t.regino_name,                                                                            ";
tsql+="         t.deal_date,                                                                              ";
tsql+="         t.g2_dev_mon,                                                                             ";
tsql+="         t.g2_sw,                                                                                  ";
tsql+="         t.g2_low,                                                                                 ";
tsql+="         to_char(t.g2_s_l_p * 100, '9g999g999g999g999g999g999g999g999g990d00') || '%' g2_s_l_p,    ";
tsql+="         t.g3_dev_mon,                                                                             ";
tsql+="         t.g3_sw,                                                                                  ";
tsql+="         t.g3_low,                                                                                 ";
tsql+="         to_char(t.g3_s_l_p * 100, '9g999g999g999g999g999g999g999g999g990d00') || '%' g3_s_l_p,    ";
tsql+="         t.g4_dev_mon,                                                                             ";
tsql+="         t.g4_sw,                                                                                  ";
tsql+="         t.g4_low,                                                                                 ";
tsql+="         to_char(t.g4_s_l_p * 100, '9g999g999g999g999g999g999g999g999g990d00') || '%' g4_s_l_p,    ";
tsql+="         t.all_dev_mon,                                                                            ";
tsql+="         t.all_sw,                                                                                 ";
tsql+="         t.all_low,                                                                                ";
tsql+="         to_char(t.all_s_l_p * 100,                                                                ";
tsql+="                 '9g999g999g999g999g999g999g999g999g990d00') || '%' all_s_l_p                      ";
tsql+="    from PMRT.TAB_MRT_KPITB_234_AREA t   where t.deal_date='#time#'                                ";
tsql+="  union all                                                                                        ";
tsql+="  select '全省' regino_name,                                                                       ";
tsql+="         max(t.deal_date) deal_date,                                                               ";
tsql+="         sum(t.g2_dev_mon) g2_dev_mon,                                                             ";
tsql+="         sum(t.g2_sw) g2_sw,                                                                       ";
tsql+="         sum(t.g2_low) g2_low,                                                                     ";
tsql+="         case sum(t.g2_dev_mon)                                                                    ";
tsql+="           when 0 then                                                                             ";
tsql+="            '-%'                                                                                   ";
tsql+="           else                                                                                    ";
tsql+="            to_char((sum(t.g2_sw) + sum(t.g2_low)) / sum(t.g2_dev_mon) * 100,                      ";
tsql+="                    '9g999g999g999g999g999g999g999g999g990d00') || '%'                             ";
tsql+="         end g2_s_l_p,                                                                             ";
tsql+="                                                                                                   ";
tsql+="         sum(t.g3_dev_mon) g3_dev_mon,                                                             ";
tsql+="         sum(t.g3_sw) g3_sw,                                                                       ";
tsql+="         sum(t.g3_low) g3_low,                                                                     ";
tsql+="         case sum(t.g3_dev_mon)                                                                    ";
tsql+="           when 0 then                                                                             ";
tsql+="            '-%'                                                                                   ";
tsql+="           else                                                                                    ";
tsql+="            to_char((sum(t.g3_sw) + sum(t.g3_low)) / sum(t.g3_dev_mon) * 100,                      ";
tsql+="                    '9g999g999g999g999g999g999g999g999g990d00') || '%'                             ";
tsql+="         end g3_s_l_p,                                                                             ";
tsql+="                                                                                                   ";
tsql+="         sum(t.g4_dev_mon) g4_dev_mon,                                                             ";
tsql+="         sum(t.g4_sw) g4_sw,                                                                       ";
tsql+="         sum(t.g4_low) g4_low,                                                                     ";
tsql+="         case sum(t.g4_dev_mon)                                                                    ";
tsql+="           when 0 then                                                                             ";
tsql+="            '-%'                                                                                   ";
tsql+="           else                                                                                    ";
tsql+="            to_char((sum(t.g4_sw) + sum(t.g4_low)) / sum(t.g4_dev_mon) * 100,                      ";
tsql+="                    '9g999g999g999g999g999g999g999g999g990d00') || '%'                             ";
tsql+="         end g4_s_l_p,                                                                             ";
tsql+="                                                                                                   ";
tsql+="         sum(all_dev_mon) all_dev_mon,                                                             ";
tsql+="         sum(t.all_sw) all_sw,                                                                     ";
tsql+="         sum(t.all_low) all_low,                                                                   ";
tsql+="         case sum(t.all_dev_mon)                                                                   ";
tsql+="           when 0 then                                                                             ";
tsql+="            '-%'                                                                                   ";
tsql+="           else                                                                                    ";
tsql+="            to_char((sum(t.all_sw) + sum(t.all_low)) / sum(t.all_dev_mon) * 100,                   ";
tsql+="                    '9g999g999g999g999g999g999g999g999g990d00') || '%'                             ";
tsql+="         end all_s_l_p                                                                             ";
tsql+="                                                                                                   ";
tsql+="    from PMRT.TAB_MRT_KPITB_234_AREA t  where t.deal_date='#time#'                                 ";


var nowData = [];
var orderBy = ' order by REGINO_NAME ';
var report = null;
$(function() {
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:0,css:LchReport.RIGHT_ALIGN}],
		rowParams : [],//第一个为rowId
		content : "lchcontent",
		orderCallBack : function(index, type) {
			//orderBy = " order by " + field[index] + " " + type + " ";
			search(0);
		},
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

var pageSize = 20;
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

//列表信息
function search(pageNumber) {
	var time=$("#time").val();
	//条件
	var sql = tsql;
	if(time!=''){
		sql=sql.replace(/\#time\#/g, time);
	}
	var d = query(sql);
	nowData = d;
	report.showSubRow();
	///////////////////////////////////////////
	$("#lch_DataHead").find("TH").unbind();
	$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
	$(".page_count").width($("#lch_DataHead").width()).hide();

	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
}
function isNull(obj){
	if(obj==0||obj=='0'){
		return 0;
	}
	if(obj == undefined || obj == null || obj == '') {
		return "";
	}
	return obj;
}
function roundN(number,fractionDigits){   
    with(Math){   
        return round(number*pow(10,fractionDigits))/pow(10,fractionDigits);   
    }   
}   
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var time=$("#time").val();
	//条件
	var sql = tsql;
	if(time!=''){
		sql=sql.replace(/\#time\#/g, time);
	}
	showtext = '移动网新发展用户质态统计表-'+time;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////