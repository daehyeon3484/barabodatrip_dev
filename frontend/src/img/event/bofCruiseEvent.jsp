<%@ page contentType="text/html" pageEncoding="UTF-8" language="java"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@page import="com.common.Constvars"%>
<!DOCTYPE HTML>
<html lang="ko">
<head><link rel="shortcut icon" href="/img/ico/120x120_bDU_12.ico">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, viewport-fit=cover" />
<title>OPEN PROMOTION EVENT</title>
<link rel="stylesheet" type="text/css" href="/css/style.css">
<link rel="stylesheet" type="text/css" href="/css/fonts/fontawesome-all.min.css">
<link rel="stylesheet" type="text/css" href="/css/framework.css">
<link rel="stylesheet" type="text/css" href="/css/font-awesome/css/font-awesome.css">
<link rel="stylesheet" type="text/css" href="/css/framework-blog.css">

<link href="https://fonts.googleapis.com/css?family=IBM+Plex+Sans:100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i|Roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i" rel="stylesheet">

</head>

<body>

<div id="page-transitions" class="page-build light-skin highlight-red">    
    <div id="menu-hider"></div>
    
    <div id="qr-list" data-selected="menu-components" data-load="/cs/qr.act" data-height="400" class="menu-box menu-load menu-bottom"></div>
    <div id="menu-list" data-selected="menu-components" data-load="/loginForm.act" data-height="250" class="menu-box menu-load menu-bottom"></div>
    <div id="my-page" data-selected="menu-components" data-load="/myPage.act" data-height="435" class="menu-box menu-load menu-bottom"></div>
    <div id="menu-share" data-load="/html/menu-share.html" data-height="250" class="menu-box menu-load menu-bottom"></div>
    <!--------------------- language 일단 제거    
    <div id="menu-demo" data-load="/html/menu-demo.html" data-height="210" class="menu-box menu-load menu-bottom"></div>
 	--------------------------------------->
 	
    <jsp:include page="/WEB-INF/views/layout/footer.jsp">
    	<jsp:param value='2' name="menuParam"/>
    </jsp:include>

    <div class="header header-scroll-effect">
        <%@include file="/WEB-INF/views/layout/menu.jsp" %>  
    </div>

	<div class="page-content header-clear-medium">
		<div class="content reading-time-box">
            <h4 class="color-gray-dark font-18 bolder">OPEN PROMOTION EVENT. 夜间邮轮赏游</h4>
            <div class="decoration"></div>
            <img class="preload-image responsive-image bottom-30 shadow-medium rounded-image" src="/img/event/tipany.jpg" data-src="/img/event/tipany.jpg" >
            <p>
                爱豆旅行准备的特别活动
			</p>
            <img class="preload-image responsive-image bottom-30 shadow-medium rounded-image" src="/img/event/tipany_2.jpg" data-src="/img/event/tipany_2.jpg" >
			<p>
在美丽的釜山夜海中享受海景的浪漫路线,由冬柏岛(nurimaru),海云台,海洋城,广安大桥等路线构成的邮轮旅行，是以釜山观光推荐路线而闻名。
</p>
            <img class="preload-image responsive-image bottom-30 shadow-medium rounded-image" src="/img/event/tipany_1.jpg" data-src="/img/event/tipany_1.jpg" >
<p style="margin-bottom:5px;color:#FF0000;font-weight: bold">
此次邮轮促销活动按照先后顺序筛选出购买4天3夜旅票的顾客,向15名顾客提供优惠。
</p>
<!-- <p style="margin-bottom:5px;color:#FF0000;font-weight: bold"> -->
<!-- ※ -->
<!-- </p> -->
<div style="float: left; width: 33%;"><a href="https://m.weibo.cn/u/7164410754" target="_blank"><img src="/img/ico/weibo_LOGO_32x32.png" style="width:32px; height:32px"/>Weibo</a></div>
					<div style="float: left; width: 33%;"><a href="https://www.xiaohongshu.com/user/profile/5d22ac00000000001102a8ac" target="_blank"><img src="/img/ico/xiaohongshu_logo.png" style="width:64px; height:32px"/>Xiaohongshu</a></div>
<!-- 			<h4 class="color-gray-dark font-12 bottom-30">By <a href="#">Enabled</a>  - <span class="reading-time color-green-dark"></span> Minutes - <span class="reading-words color-green-dark"></span> Words.</h4> -->
			<div class="decoration"></div>
        </div>
        <div class="footer">
            <jsp:include page="/WEB-INF/views/layout/footerTxt.jsp"></jsp:include>
        </div> 
    </div> 
</div>      
<script type="text/javascript" src="/js/jquery.js"></script>
<script type="text/javascript" src="/js/plugins.js"></script>
<script type="text/javascript" src="/js/custom.js"></script>
<script type="text/javascript">
	/*
	 * 필수 (앱에서 호출)
	 */
	function fncInit() {
	}
</script>
</body>
</html>