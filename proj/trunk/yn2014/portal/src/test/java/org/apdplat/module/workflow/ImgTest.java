package org.apdplat.module.workflow;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class ImgTest {
	public static final String addPath="$$$$$$$$$$$$$$$";
	public static String changeImgPath(String content){
		String imgReg = "(<img[^>]*src=['\"])([^'\"]+)([^>]*>)";
		Pattern imgPattern = Pattern.compile(imgReg);
		Matcher m = imgPattern.matcher(content);
		while(m.find()){
			
  			String img=m.group();
  			
  			//String src=img.replaceAll("<img[^>]*src=['\"]", "");
  			String src=m.group(2);
  			//src=src.replaceAll("['\"][^>]*>", "");
  			String newImg=img.replace(src, addPath+src);
  			content=content.replace(img,newImg);
  		}
		return content;
	}
	public static String changeImgPath2(String content){
		String imgReg = "(<img[^>]*src=['\"])([^'\"]+)([^>]*>)";
		Pattern imgPattern = Pattern.compile(imgReg);
		Matcher m = imgPattern.matcher(content);
		while(m.find()){
			
  			String img=m.group();
  			String src=m.group(2);
  			String newImg=img.replace(src, addPath+src);
  			content=content.replace(img,newImg);
  		}
		return content;
	}
	public static void main(String[] args){
		String content="<a target=\"_blank\" href=\"http://baike.baidu.com/view/22180.htm\">香格里拉</a>，有一座被藏人称作&ldquo;独克宗&rdquo;的古城，它是按照佛经中的<a target=\"_blank\" href=\"http://baike.baidu.com/subview/40690/5080293.htm\">香巴拉</a>理想国建成的。古城依山势而建，路面起伏不平，那是一些岁月久远的旧石头就着自然地势铺成的，至今，石板路上还留着深深的马蹄印，那是当年的马帮给时间留下的信物了。<br />"+
				"<img alt=\"\" src=\"/ynlyt/data/ynly/fck/01_system/Image/2016/0111/1816LTcnz.jpg\"/>&nbsp;<br />"+
				"在<a target=\"_blank\" href=\"http://baike.baidu.com/view/22180.htm\">香格里拉</a>，有一座被藏人称作&ldquo;独克宗&rdquo;的古城，它是按照佛经中的<a target=\"_blank\" href=\"http://baike.baidu.com/subview/40690/5080293.htm\">香巴拉</a>理想国建成的。古城依山势而建，路面起伏不平，那是一些岁月久远的旧石头就着自然地势铺成的，至今，石板路上还留着深深的马蹄印，那是当年的马帮给时间留下的信物了。<br />"+
				"<img alt=\"\" src=\"/ynlyt/data/ynly/fck/01_system/Image/2016/0111/1816LTcnz1.jpg\" />";
		
		System.out.println(changeImgPath2(content));
	}
}
