//setInterval(loadXMLDoc, 60000);
const xhttpTAM = new XMLHttpRequest();
var TAMLoaded;
var itemTAM;
var bInProcessing = false;
var centerlat = 35.95;
var centerlon = 128.25;
var centerzoom;
var pixelWidth = 1786;
var pixelHeight = 1616;
var zoom1 = 8;
var zoom2 = 7;
var zoom3 = 7;
var selectTAM = ["10", "11", "14", "16", "17", "18", "26", "32"/*, "27"*/];
var Coordinate = [
    ["Tamnip", 36.41085, 127.400005, "", "탑립동", "대전광역시 유성구", "주식회사&nbsp;&nbsp;공감센서", "Tamnip-dong", "Yuseong-gu, Daejeon", "Gonggam Sensors Co., Ltd."],
    //["Seodaejeon police station", 36.32253, 127.41408, "","Seodaejeon police station", "",],
    ["Korea University", 37.58541, 127.02551, "","고려대학교", "서울특별시 은평구", "주식회사&nbsp;&nbsp;공감센서", "Korea University", " Eunpyeong-gu, Seoul", "Gonggam Sensors Co., Ltd."],
    ["Jeongwang", 37.34692, 126.74001, "", "시흥시 정왕보건지소", "경기도 시흥시", "주식회사&nbsp;&nbsp;공감센서", "Siheung Jeongwang Health Center", "Siheung-si, Gyeonggi-do", "Gonggam Sensors Co., Ltd."],
    ["ETRI B.S.", 36.38381, 127.36707, "","한국전자통신연구원", "대전광역시 유성구", "주식회사&nbsp;&nbsp;공감센서", "ETRI", "Yuseong-gu, Daejeon", "Gonggam Sensors Co., Ltd."],
    ["KRISS B.S.", 36.38538, 127.37345, "", "한국표준과학연구원", "대전광역시 유성구", "주식회사&nbsp;&nbsp;공감센서", "KRISS", "Yuseong-gu, Daejeon", "Gonggam Sensors Co., Ltd."],
    ["KT B.S.", 36.38460, 127.36161, "", "KT북대전지사", "대전광역시 유성구", "주식회사&nbsp;&nbsp;공감센서", "KT Bukdaejeon", "Yuseong-gu, Daejeon", "Gonggam Sensors Co., Ltd."],
    ["Hanwha B.S.", 36.38520, 127.35313, "","한화솔루션중앙연구소", "대전광역시 유성구", "주식회사&nbsp;&nbsp;공감센서", "Hanwha Solution", "Yuseong-gu, Daejeon", "Gonggam Sensors Co., Ltd."],
    //["Munpyeong 119 Safety Center", 36.44697, 127.40469, "", "Munpyeong 119 Safety Center", "",],
    ["Deokpyeong", 36.73103, 127.80465, "", "청천면사무소 덕평민원봉사실", "충청북도 괴산군", "주식회사&nbsp;&nbsp;공감센서", "Cheongcheon Deokpyeong Office", "Geosan-gun, Chungcheongbuk-do", "Gonggam Sensors Co., Ltd."],
    //["ggsensor", 36.383150, 127.363116, "관광지 ", "공감센서", "대전광역시 유성구", "주식회사&nbsp;&nbsp;공감센서"],
    //["Korea Testing Laboratory", 35.17557, 128.14653, "관광지 ","고려대메디힐지구환경관", "서울특별시 은평구", "주식회사&nbsp;&nbsp;공감센서"]
];
var GPSDiff = 0.0006;
var TAMMarker;
var mymap = null;
var markers = null;
var currentYear = new Date().getFullYear();
let osmUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?ver=1";
let osmAttrib = "&copy; <a href='https://openstreetmap.org/copyright'>OpenStreetMap</a> contributors | ©" + currentYear + ". Gonggam Sensors Co., Ltd. All rights reserved.";
let osm = L.tileLayer(osmUrl, { maxZoom: 18, attribution: osmAttrib });
var mapView = L.map("mapid", { zoomControl: false, minZoom: 4, maxZoom: 18, })
var startDate;
var startDate_10;
var ajaxDate;
var ajaxEndDate;
var AQIStatus;
var body;
var modal;
var btnOpenPopup;
var circleClass;
var loadCount = 0;
var transfer;
var transferLatLng;
var body;
var modal;
var arrayData;
var circleClass;
var arrayGeoJSON = new Array();
var arrayTAM = new Array();
var timestamp = new Date().getTime();

// 다른 페이지로 이동하다가 다시 돌아올 시 사용자가 입력한 값을 초기화하기 위해 새로고침하는 프로세스
// yh1 : unstable
var type = navigator.appName;
var lang;
if (type == 'Netscape')
    lang = navigator.language;
else lang = navigator.userLanguage;

if (lang == "ko-KR" || lang == "ko") {   
    document.getElementById('global').setAttribute("value", lang);
}
else {
    document.getElementById('global').setAttribute("value", "en-US");
}
mapZoom();
mymap = mapView.setView([centerlat, centerlon], centerzoom).addLayer(osm);
loadXMLDoc();
window.addEventListener("pageshow", function (event) {
    var historyTraversal = event.persisted || (typeof window.performance != "undefined" && window.performance.navigation.type === 2);
    if (historyTraversal) {
        // Handle page restore.
        window.location.reload();
    }
});
function mapZoom() {
    if (window.innerWidth >= pixelWidth || window.innerHeight >= pixelHeight) {
        centerzoom = zoom1;
    }
    else if ((window.innerWidth >= pixelWidth / 2 && window.innerWidth < pixelWidth) || (window.innerHeight >= pixelHeight / 2 && window.innerHeight < pixelHeight)) {
        centerzoom = zoom2;
        centerlat = 35.8735;
        centerlon = 127.759;
    }
    else if (window.innerWidth < pixelWidth / 2 || window.innerHeight < pixelHeight / 2) {
        centerzoom = zoom3;
        centerlat = 35.8735;
        centerlon = 127.759;
    }
}
function loadXMLDoc() {
    loadTAM();
}
function loadTAM() {
    xhttpTAM.onload = function () {
        const xmlDoc = xhttpTAM.responseXML;
        itemTAM = xmlDoc.getElementsByTagName("item");
        TAMLoaded = true;
        processXMLMain();
    }
    let urlTAM = "https://airnow.kr/cgi-bin/getRecent?latitude=35.95&longitude=128.25&height=5.9&width=7.5"; //대한민국 전체 TAM727정보표출
    xhttpTAM.open("GET", urlTAM);
    xhttpTAM.send();
}
function processXMLMain() {
    loadCount += 1;
    let bindPopup;
    startDate = new Date(Dateformat3_2(new Date()));
    startDate_10 = new Date(Dateformat3_3(new Date()));
    ajaxDate = Dateformat3_dash(new Date());
    ajaxEndDate = Dateformat3_dash_today(new Date());
    if (TAMLoaded == true) {
        if (itemTAM.length != 0) {
            let TAMSymbolStatus;
            markers = L.markerClusterGroup({
	            maxClusterRadius: 35,
	            iconCreateFunction: function (cluster) {
	            	let markers = cluster.getAllChildMarkers();
	            	let n = findMinNum(markers);
                    let o = n[0];
                    let p;
                    let q = n[1];
                    let a,b,c,d;
                    if (q.substr(0,3) == "관광지") {
                        a = 55;
                        b = 35;
                        c = 839/790;
                        d = 745/839;
                        if (markers.length <= 5)
                            p = markers.length;
                        else p = 5;
                        let iconSize = a + (10 * p) + (2 * 2);
                        let fontSize = 12 + (3 * p);
			    	    return L.divIcon({
                            html: "<div style='position: relative'><div style='position: absolute; transform: translate(-50%, -50%); top: " + b + "%; left: 50%; text-align: center; font-size: " + fontSize + "px;'><span>" + o + "</span></div><img style='width: "+ iconSize +"px' src='gtourIcon/mapIcon/" + q + "'></div>",
                            className: '',
                            iconSize: [iconSize, iconSize * c],
                            iconAnchor: [iconSize/2, iconSize* c * d]
                        });
                    }
                    if (q.substr(0,2) == "일반") {
                        a = 32;
                        b = 31;
                        c = 771/596;
                        d = 710/771;
                        if (markers.length <= 5)
                            p = markers.length;
                        else p = 5;
                        let iconSize = a + (10 * p) + (2 * 2);
                        let fontSize = 12 + (3 * p);
			    	    return L.divIcon({
                            html: "<div style='position: relative'><div style='position: absolute; transform: translate(-50%, -50%); top: " + b + "%; left: 50%; text-align: center; font-size: " + fontSize + "px;'><span>" + o + "</span></div><img style='width: "+ iconSize +"px' src='gtourIcon/mapIcon/" + q + "'></div>",
                            className: '',
                            iconSize: [iconSize, iconSize * c],
                            iconAnchor: [iconSize/2, iconSize* c * d]
                        });
                    }
                    else {
                        let r;
                        if (o == 'E')
                            r = 'pm25black';
                        else if (o >= 0 && o <= 15)
                            r = 'pm25blue';
                        else if (o > 15 && o <= 35)
                            r = 'pm25green';
                        else if (o > 35 && o <= 75)
                            r = 'pm25yellow';
                        else if (o > 75)
                            r = 'pm25red';
                        if (markers.length <= 5)
                            p = markers.length;
                        else p = 5;
                        let style = 'style="width: ' + (30 + (10 * p)) + 'px; height: ' + (30 + (10 * p)) + 'px; border-width: ' + 2 + 'px;"';
                        let iconSize = 30 + (10 * p) + (2 * 2);
			    	    return L.divIcon({
                            html: '<span class="' + 'circle ' + r + '" ' + style + '>' + o + '</span>',
                            className: '',
                            iconSize: [iconSize, iconSize]
                        });
                    }
	            },
			    //Disable all of the defaults:
		        spiderfyOnMaxZoom: false, showCoverageOnHover: false, zoomToBoundsOnClick: false
            });
            for (let i = 0; i < selectTAM.length; i++) {
                for (let j = 0; j < itemTAM.length; j++) {
                    if (selectTAM[i] == itemTAM[j].getElementsByTagName("id")[0].childNodes[0].nodeValue) {
                        let TAMID = itemTAM[j].getElementsByTagName("id")[0].childNodes[0].nodeValue;
                        let TAMLat = itemTAM[j].getElementsByTagName("latitude")[0].childNodes[0].nodeValue;
                        let TAMLon = itemTAM[j].getElementsByTagName("longitude")[0].childNodes[0].nodeValue;
                        let TAMAmbTmp = itemTAM[j].getElementsByTagName("Temperature")[0].childNodes[0].nodeValue;
                        let TAMAmbHmd = itemTAM[j].getElementsByTagName("Humidity")[0].childNodes[0].nodeValue;
                        let TAMTACTmp = itemTAM[j].getElementsByTagName("tacTemperature")[0].childNodes[0].nodeValue;
                        let TAMTACHmd = itemTAM[j].getElementsByTagName("tacHumidity")[0].childNodes[0].nodeValue;
                        let TAMSite;
                        let tourSite;
                        let tourAddress;
                        let dataProvider;
                        let tourSiteEN;
                        let tourAddressEN;
                        let dataProviderEN;
                        let TAMError = itemTAM[j].getElementsByTagName("error")[0].childNodes[0].nodeValue;
                        let TAMErrorStatus;
                        let TAMPM1 = itemTAM[j].getElementsByTagName("pm1Value")[0].childNodes[0].nodeValue;
                        let TAMPM25 = itemTAM[j].getElementsByTagName("pm25Value")[0].childNodes[0].nodeValue;
                        let TAMPM40 = itemTAM[j].getElementsByTagName("pm40Value")[0].childNodes[0].nodeValue;
                        let TAMPM10 = itemTAM[j].getElementsByTagName("pm10Value")[0].childNodes[0].nodeValue;
                        let TAMPress = itemTAM[j].getElementsByTagName("pressure")[0].childNodes[0].nodeValue;
                        let TAMPM25Status;
                        let emoticon;
                        let emoticonPng;
                        let emoticonPng1;
                        let markerText;
                        let popupText;
                        let tempIcon;
                        let hmdIcon;
                        let pressIcon;
                        let errorCaption;
                        let squareStatus;
                        let squareStatusEN;
                        for (let k = 0; k < Coordinate.length; k++) {
                            if (((TAMLat >= numEP(Coordinate[k][1]-GPSDiff)) && (TAMLat <= numEP(Coordinate[k][1]+GPSDiff))) && ((TAMLon >= numEP(Coordinate[k][2]-GPSDiff)) && (TAMLon <= numEP(Coordinate[k][2]+GPSDiff)))) {
                                TAMSite = Coordinate[k][0];
                                tourSite = Coordinate[k][4];
                                tourAddress = Coordinate[k][5];
                                dataProvider = Coordinate[k][6];
                                tourSiteEN = Coordinate[k][7];
                                tourAddressEN = Coordinate[k][8];
                                dataProviderEN = Coordinate[k][9];
                                if (TAMError == "no")
                                    errorCaption = "";
                                else errorCaption = "!";
                                if (TAMError == 'PM sensor error') {
                                    TAMPM25Status = "black";
                                    emoticon = "고장";
                                    circleClass = 'pm25black';
                                    squareStatus = emoticon + ".png?ver=1";
                                    squareStatusEN = emoticon + "EN.png?ver=1";
                                    emoticonPng = emoticon + errorCaption + ".png?ver=1";
                                    emoticonPng1 = Coordinate[k][3] + emoticon;
                                    TAMSymbolStatus = Coordinate[k][3] + emoticonPng;
                                    //circleClass = 'pm25black';
                                    markerText = 'E';
                                    popupText = '--';
                                    TAMPM1 = '--';
                                    TAMPM40 = '--';
                                    TAMPM10 = '--';
                                }
                                else if (TAMPM25 >= 0 && TAMPM25 <= 15) {
                                    TAMPM25Status = "#135FB7";
                                    circleClass = 'pm25blue';
                                    emoticon = "좋음";
                                    squareStatus = emoticon + ".png?ver=1";
                                    squareStatusEN = emoticon + "EN.png?ver=1";
                                    emoticonPng = emoticon + errorCaption + ".png?ver=1";
                                    emoticonPng1 = Coordinate[k][3] + emoticon;
                                    TAMSymbolStatus = Coordinate[k][3] + emoticonPng;
                                    //circleClass = 'pm25blue';
                                    markerText = popupText = TAMPM25;
                                }
                                else if (TAMPM25 > 15 && TAMPM25 <= 35) {
                                    TAMPM25Status = "#4BA81F";
                                    circleClass = 'pm25green';
                                    emoticon = "보통";
                                    squareStatus = emoticon + ".png?ver=1";
                                    squareStatusEN = emoticon + "EN.png?ver=1";
                                    emoticonPng = emoticon + errorCaption + ".png?ver=1";
                                    emoticonPng1 = Coordinate[k][3] + emoticon;
                                    TAMSymbolStatus = Coordinate[k][3] + emoticonPng;
                                    //circleClass = 'pm25green';
                                    markerText = popupText = TAMPM25;
                                }
                                else if (TAMPM25 > 35 && TAMPM25 <= 75) {
                                    TAMPM25Status = "#EACA28";
                                    circleClass = 'pm25yellow';
                                    emoticon = "나쁨";
                                    squareStatus = emoticon + ".png?ver=1";
                                    squareStatusEN = emoticon + "EN.png?ver=1";
                                    emoticonPng = emoticon + errorCaption + ".png?ver=1";
                                    emoticonPng1 = Coordinate[k][3] + emoticon;
                                    TAMSymbolStatus = Coordinate[k][3] + emoticonPng;
                                    //circleClass = 'pm25yellow';
                                    markerText = popupText = TAMPM25;
                                }
                                else if (TAMPM25 > 75) {
                                    TAMPM25Status = "#D82828";
                                    circleClass = 'pm25red';
                                    emoticon = "매우나쁨";
                                    squareStatus = emoticon + ".png?ver=1";
                                    squareStatusEN = emoticon + "EN.png?ver=1";
                                    emoticonPng = emoticon + errorCaption + ".png?ver=1";
                                    emoticonPng1 = Coordinate[k][3] + emoticon;
                                    TAMSymbolStatus = Coordinate[k][3] + emoticonPng;
                                    //circleClass = 'pm25red';
                                    markerText = popupText = TAMPM25;
                                } //20211018수정(lyh)
                                let TAMdataTime = Dateformat3_1(KK_HH(itemTAM, j));
                                let TAMdataTime1 = Dateformat5(KK_HH(itemTAM, j));
                                processAjax(TAMID);
                                let AQIValue = window['TAMAQI_' + TAMID];
                                if (AQIValue >= 0 && AQIValue <= 50)
                                    AQIStatus = "#00E400";
                                else if (AQIValue >= 51 && AQIValue <= 100)
                                    AQIStatus = "#FFFF00";
                                else if (AQIValue >= 101 && AQIValue <= 150)
                                    AQIStatus = "#FF7E00";
                                else if (AQIValue >= 151 && AQIValue <= 200)
                                    AQIStatus = "#FF0000";
                                else if (AQIValue >= 201 && AQIValue <= 300)
                                    AQIStatus = "#8F3F97";
                                else if (AQIValue >= 301 && AQIValue <= 500)
                                    AQIStatus = "#7E0023";
                                else if (AQIValue >= 501)
                                    AQIStatus = "black";
                                else if (AQIValue == "ND")
                                    AQIStatus = "#747474";
                                processAjax10(TAMID);
                                if (TAMError == "TEMPERATURE error") {
                                    tempIcon = "온도계 회색.png?ver=1";
                                    TAMAmbTmp = "--";
                                    hmdIcon = "습도 아이콘 회색.png?ver=1";
                                    TAMAmbHmd = "--";
                                    pressIcon = "기압계 고장.png?ver=1";
                                    TAMPress = "--";
                                }
                                else {
                                    tempIcon = "온도계.png?ver=1";
                                    hmdIcon = "습도 아이콘.png?ver=1";
                                    pressIcon = "기압계.png?ver=1";
                                }
                                if (TAMError == "HTR TEMPERATURE error") {
                                    TAMTACTmp = "--";
                                    TAMTACHmd = "--";
                                }
                                if (TAMError == "GPS error") {
                                    TAMLat = "--";
                                    TAMLon = "--";
                                }
                                let arrayTAM1 = [TAMID, TAMLat, TAMLon, TAMSite, markerText, TAMAmbTmp, TAMAmbHmd, TAMTACTmp, TAMTACHmd, TAMPM25Status, TAMdataTime, AQIValue, TAMSymbolStatus, AQIStatus, TAMErrorStatus, TAMError, TAMPM1, TAMPM40, TAMPM10, TAMPress, popupText, tourSite, tourAddress, dataProvider, emoticon, emoticonPng, window['arrayDataTAMRaw_' + TAMID], tempIcon, hmdIcon, pressIcon, emoticonPng1, squareStatus, circleClass, TAMdataTime1, squareStatusEN, tourSiteEN, tourAddressEN, dataProviderEN];
                                arrayTAM.push(arrayTAM1); //각 장치별로 구분함
                                break;
                            }
                        }
                    }
                }
            }
            for (let i = 0; i < arrayTAM.length; i++) {
                bindPopup = TAMTooltip(arrayTAM[i][3], arrayTAM[i][0], arrayTAM[i][20], arrayTAM[i][9], arrayTAM[i][11], arrayTAM[i][13], arrayTAM[i][33], arrayTAM[i][15], arrayTAM[i][16], arrayTAM[i][17], arrayTAM[i][18], arrayTAM[i][5], arrayTAM[i][6], arrayTAM[i][19], arrayTAM[i][7], arrayTAM[i][8], arrayTAM[i][1], arrayTAM[i][2]); //20211018수정(lyh)
                let a,b,c,d;
                let icon;
                if (arrayTAM[i][12].substr(0,3) == "관광지") {
                    a = 55;
                    b = 35;
                    c = 839/790;
                    d = 745/839;
                    let iconSize = a + (2 * 2);
                    icon = L.divIcon({
                        html: "<div style='position: relative'><div style='position: absolute; transform: translate(-50%, -50%); top: " + b + "%; left: 50%; text-align: center;'><span>" + arrayTAM[i][4] + "</span></div><img style='width: "+ iconSize +"px' src='gtourIcon/mapIcon/" + arrayTAM[i][12] + "'></div>",
                        className: '',
                        iconSize: [iconSize, iconSize * c],
                        iconAnchor: [iconSize/2, iconSize* c * d]
                    });
                }
                else if (arrayTAM[i][12].substr(0,2) == "일반") {
                    a = 32;
                    b = 31;
                    c = 771/596;
                    d = 710/771;
                    let iconSize = a + (2 * 2);
                    icon = L.divIcon({
                        html: "<div style='position: relative'><div style='position: absolute; transform: translate(-50%, -50%); top: " + b + "%; left: 50%; text-align: center;'><span>" + arrayTAM[i][4] + "</span></div><img style='width: "+ iconSize +"px' src='gtourIcon/mapIcon/" + arrayTAM[i][12] + "'></div>",
                        className: '',
                        iconSize: [iconSize, iconSize * c],
                        iconAnchor: [iconSize/2, iconSize* c * d]
                    });
                }
                else {
                    let a;
                    if (arrayTAM[i][4] >= 100)
                        a=32;
                    else a=30;
                    let style = 'style="width: ' + a + 'px; height: ' + a + 'px; border-width: ' + 2 + 'px;"';
                    let iconSize = a + (2 * 2);
                    icon = L.divIcon({
                        html: '<span class="' + 'circle ' + arrayTAM[i][32] + '" ' + style + '>' + arrayTAM[i][4] + '</span>',
                        className: '',
                        iconSize: [iconSize, iconSize]
                    });
                }
                /*let icon = L.divIcon({
                    html: '<span class="' + 'circle ' + arrayTAM[i][12] + '" ' + style + '>' + arrayTAM[i][4] + '</span>',
                    className: '',
                    iconSize: [iconSize, iconSize]
                });*/
                arrayGeoJSON.push({
                    "type": "Feature",
                    "properties": {
                        "index": i,
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [arrayTAM[i][2], arrayTAM[i][1]]
                    }
                })
                if (arrayTAM[i][12].substr(0,2) == "일반") {
                    TAMMarker = L.marker([arrayTAM[i][1], arrayTAM[i][2]], { icon: icon }).bindPopup(bindPopup);
                }
                else {
                    TAMMarker = L.marker([arrayTAM[i][1], arrayTAM[i][2]], { icon: icon }).on('click', function () {
                        body = document.querySelector('body');
                        modal = document.querySelector('.modal');
                        btnOpenPopup = document.querySelector('.btn-open-popup');
                        document.getElementById('popup').style.display = 'block';
                        document.getElementById('popup1').style.display = 'none';
                        document.getElementById('TAM_Time').innerHTML = arrayTAM[i][10];
                        if (document.getElementById('global').getAttribute("value") == "ko-KR" || document.getElementById('global').getAttribute("value") == "ko") {
                            document.getElementById('tourSite').innerHTML = arrayTAM[i][21];
                            document.getElementById('tourAddress').innerHTML = arrayTAM[i][22];
                            document.getElementById('mainStatus').style.backgroundImage = "url('gtourIcon/nemobox/" + arrayTAM[i][31] + "')";
                            document.getElementById('dataProvider').innerHTML = arrayTAM[i][23];
                            document.getElementById('tourChangeBtn').innerHTML = "사이트 변경";
                        }
                        else {
                            document.getElementById('tourSite').innerHTML = arrayTAM[i][35];
                            document.getElementById('tourAddress').innerHTML = arrayTAM[i][36];
                            document.getElementById('mainStatus').style.backgroundImage = "url('gtourIcon/nemobox/" + arrayTAM[i][34] + "')";
                            document.getElementById('dataProvider').innerHTML = arrayTAM[i][37];
                            document.getElementById('tourChangeBtn').innerHTML = "Change Site";
                        }
                        document.getElementById('TAM_ID').innerHTML = arrayTAM[i][0];
                        document.getElementById('PMNumber').innerHTML = arrayTAM[i][4];
                        document.getElementById('AQINumber').innerHTML = arrayTAM[i][11];
                        document.getElementById('tempIcon').style.backgroundImage = "url('gtourIcon/" + arrayTAM[i][27] + "')";
                        document.getElementById('ambTmp').innerHTML = arrayTAM[i][5];
                        document.getElementById('hmdIcon').style.backgroundImage = "url('gtourIcon/" + arrayTAM[i][28] + "')";
                        document.getElementById('ambHmd').innerHTML = arrayTAM[i][6];
                        document.getElementById('pressIcon').style.backgroundImage = "url('gtourIcon/" + arrayTAM[i][29] + "')";
                        document.getElementById('ambPress').innerHTML = arrayTAM[i][19];
                        if (arrayTAM[i][15] == "no")
                            document.getElementById('errorText').innerHTML = "";
                        else document.getElementById('errorText').innerHTML = arrayTAM[i][15];
                        document.getElementById('PM1Num').innerHTML = arrayTAM[i][16];
                        document.getElementById('PM25Num').innerHTML = arrayTAM[i][4];
                        document.getElementById('PM40Num').innerHTML = arrayTAM[i][17];
                        document.getElementById('PM10Num').innerHTML = arrayTAM[i][18];
                        document.getElementById('ambTmpNum').innerHTML = arrayTAM[i][5];
                        document.getElementById('ambHmdNum').innerHTML = arrayTAM[i][6];
                        document.getElementById('ambPressNum').innerHTML = arrayTAM[i][19];
                        document.getElementById('TACTmpNum').innerHTML = arrayTAM[i][7];
                        document.getElementById('TACHmdNum').innerHTML = arrayTAM[i][8];
                        document.getElementById('TAMLat').innerHTML = arrayTAM[i][1];
                        document.getElementById('TAMLon').innerHTML = arrayTAM[i][2];
                        arrayData = arrayTAM[i][26];
                        function show() {
                            document.querySelector(".background").className = "background show";
                        }
                        function close() {
                            document.querySelector(".background").className = "background";
                        }
                        function tourChange() {
                            document.querySelector(".background").className = "background";
                            mapZoom();
                            mymap.setView([centerlat, centerlon], centerzoom);
                        }
                        show();
                        //textFit(document.getElementById('tourSite'));
                        google.charts.load('current', { packages: ['corechart', 'line'] });
                        google.charts.setOnLoadCallback(drawLineColors);
                        document.querySelector("#close").addEventListener("click", close);
                        document.querySelector("#tourChangeBtn").addEventListener("click", tourChange);
                        document.getElementById("global").setAttribute("onClick", "changeLanguage('" + document.getElementById('global').getAttribute("value") + "','" + arrayTAM[i][21] + "','" + arrayTAM[i][22] + "','" + arrayTAM[i][31] + "','" + arrayTAM[i][23] + "','" + arrayTAM[i][35] + "','" + arrayTAM[i][36] + "','" + arrayTAM[i][34] + "','" + arrayTAM[i][37] + "')");
                        mymap.setZoom();
                    });
                    }
                TAMMarker.number = arrayTAM[i][4];
                TAMMarker.error = arrayTAM[i][15];
                TAMMarker.status = arrayTAM[i][30];
                markers.addLayer(TAMMarker);
            }
            mymap.addLayer(markers);
            markers.on('clusterclick', function(c) {
                transferLatLng = c.layer.getLatLng();
                transfer = c.layer
                var popup = L.popup()
                .setLatLng(transferLatLng)
                .setContent('This cluster represents ' + c.layer._childCount +' TAMs<br><a href="javascript:clusterZoom();">Zoom to</a>')
                .openOn(mymap);
            }).on('animationend',function(){
                mymap.closePopup();
            })
        }
    }
    mymap.locate({
        //setView: true
    })
    mymap.on('locationfound', onLocationFound);
}

function onLocationFound(e) {
    let a = 20;
    let b = 31;
    let c = 1;
    //let d = 1451/1469;
    let o = 1;
    let iconSize = a + (2 * 2);
    let icon = L.divIcon({
        html: "<div style='position: relative'><div style='position: absolute; transform: translate(-50%, -50%); top: " + b + "%; left: 50%; text-align: center;'></div><img style='width: "+ iconSize +"px; height: "+ iconSize * c +"px; opacity: " + o + ";' src='gtourIcon/mapIcon/myLocation.png?ver=" + timestamp + "'></div>",
        className: '',
        iconSize: [iconSize, iconSize * c],
        iconAnchor: [iconSize/2, iconSize/2]
    });
    let userMarker = L.marker(e.latlng, { icon: icon, clickable: false });
    mymap.addLayer(userMarker);
    let geojsonlayer = L.geoJson(arrayGeoJSON);
    let index = leafletKnn(geojsonlayer);
    nearArray = index.nearest(e.latlng, 1);
    let centerLat = numEP((e.latlng.lat+parseFloat(nearArray[0].lat))/2);
    let centerLon = numEP((e.latlng.lng+parseFloat(nearArray[0].lon))/2);
    let latDiff = numEP(Math.abs(centerLat-e.latlng.lat));
    let lonDiff = numEP(Math.abs(centerLon-e.latlng.lng));
    let q1CorX = q4CorX = numEP(centerLon + lonDiff);
    let q1CorY = q2CorY = numEP(centerLat + latDiff);
    let q2CorX = q3CorX = numEP(centerLon - lonDiff);
    let q3CorY = q4CorY = numEP(centerLat - latDiff);
    let distanceTop = L.latLng([q2CorY, q2CorX]).distanceTo(L.latLng([q1CorY, q1CorX]));
    let distanceRight = L.latLng([q1CorY, q1CorX]).distanceTo(L.latLng([q4CorY, q4CorX]));
    let distanceBottom = L.latLng([q4CorY, q4CorX]).distanceTo(L.latLng([q3CorY, q3CorX]));
    let distanceLeft = L.latLng([q3CorY, q3CorX]).distanceTo(L.latLng([q2CorY, q2CorX]));
    let mOverPTop = distanceTop / window.innerWidth;
    let mOverPRight = distanceRight / window.innerHeight;
    let mOverPBottom = distanceBottom / window.innerWidth;
    let mOverPLeft = distanceLeft / window.innerHeight;
    let mOverP = Math.max(mOverPTop, mOverPRight, mOverPBottom, mOverPLeft);
    mymap.setView([centerLat, centerLon], zoomLevels(mOverP));
    let i = nearArray[0].layer.feature.properties.index;
    body = document.querySelector('body');
    modal = document.querySelector('.modal');
    btnOpenPopup = document.querySelector('.btn-open-popup');
    document.getElementById('popup').style.display = 'block';
    document.getElementById('popup1').style.display = 'none';
    document.getElementById('TAM_Time').innerHTML = arrayTAM[i][10];
    if (document.getElementById('global').getAttribute("value") == "ko-KR" || document.getElementById('global').getAttribute("value") == "ko") {
        document.getElementById('tourSite').innerHTML = arrayTAM[i][21];
        document.getElementById('tourAddress').innerHTML = arrayTAM[i][22];
        document.getElementById('mainStatus').style.backgroundImage = "url('gtourIcon/nemobox/" + arrayTAM[i][31] + "')";
        document.getElementById('dataProvider').innerHTML = arrayTAM[i][23];
        document.getElementById('tourChangeBtn').innerHTML = "사이트 변경";
    }
    else {
        document.getElementById('tourSite').innerHTML = arrayTAM[i][35];
        document.getElementById('tourAddress').innerHTML = arrayTAM[i][36];
        document.getElementById('mainStatus').style.backgroundImage = "url('gtourIcon/nemobox/" + arrayTAM[i][34] + "')";
        document.getElementById('dataProvider').innerHTML = arrayTAM[i][37];
        document.getElementById('tourChangeBtn').innerHTML = "Change Site";
    }
    document.getElementById('TAM_ID').innerHTML = arrayTAM[i][0];
    document.getElementById('PMNumber').innerHTML = arrayTAM[i][4];
    document.getElementById('AQINumber').innerHTML = arrayTAM[i][11];
    document.getElementById('tempIcon').style.backgroundImage = "url('gtourIcon/" + arrayTAM[i][27] + "')";
    document.getElementById('ambTmp').innerHTML = arrayTAM[i][5];
    document.getElementById('hmdIcon').style.backgroundImage = "url('gtourIcon/" + arrayTAM[i][28] + "')";
    document.getElementById('ambHmd').innerHTML = arrayTAM[i][6];
    document.getElementById('pressIcon').style.backgroundImage = "url('gtourIcon/" + arrayTAM[i][29] + "')";
    document.getElementById('ambPress').innerHTML = arrayTAM[i][19];
    if (arrayTAM[i][15] == "no")
        document.getElementById('errorText').innerHTML = "";
    else document.getElementById('errorText').innerHTML = arrayTAM[i][15];
    document.getElementById('PM1Num').innerHTML = arrayTAM[i][16];
    document.getElementById('PM25Num').innerHTML = arrayTAM[i][4];
    document.getElementById('PM40Num').innerHTML = arrayTAM[i][17];
    document.getElementById('PM10Num').innerHTML = arrayTAM[i][18];
    document.getElementById('ambTmpNum').innerHTML = arrayTAM[i][5];
    document.getElementById('ambHmdNum').innerHTML = arrayTAM[i][6];
    document.getElementById('ambPressNum').innerHTML = arrayTAM[i][19];
    document.getElementById('TACTmpNum').innerHTML = arrayTAM[i][7];
    document.getElementById('TACHmdNum').innerHTML = arrayTAM[i][8];
    document.getElementById('TAMLat').innerHTML = arrayTAM[i][1];
    document.getElementById('TAMLon').innerHTML = arrayTAM[i][2];
    arrayData = arrayTAM[i][26];
    function show() {
        document.querySelector(".background").className = "background show";
    }
    function close() {
        document.querySelector(".background").className = "background";
    }
    function tourChange() {
        document.querySelector(".background").className = "background";
        mapZoom();
        mymap.setView([centerlat, centerlon], centerzoom);
    }
    show();
    //textFit(document.getElementById('tourSite'));
    google.charts.load('current', { packages: ['corechart', 'line'] });
    google.charts.setOnLoadCallback(drawLineColors);
    document.querySelector("#close").addEventListener("click", close);
    document.querySelector("#tourChangeBtn").addEventListener("click", tourChange);
    document.getElementById("global").setAttribute("onClick", "changeLanguage('" + document.getElementById('global').getAttribute("value") + "','" + arrayTAM[i][21] + "','" + arrayTAM[i][22] + "','" + arrayTAM[i][31] + "','" + arrayTAM[i][23] + "','" + arrayTAM[i][35] + "','" + arrayTAM[i][36] + "','" + arrayTAM[i][34] + "','" + arrayTAM[i][37] + "')");
    mymap.setZoom();
}

function KK_HH(item, a) {
    let dataTimeTag = item[a].getElementsByTagName("dataTime")[0].childNodes[0].nodeValue;
    let replaceSlash = new Date(dataTimeTag.substr(0, 10).replace(/-/g, '/'));
    if (dataTimeTag.substr(11, 2) != "24") {
        // 2021-09-15 01:00 => 2021/09/15 01:00
        return dataTimeTag.replace(/-/g, '/')
    }
    else {
        // 2020-12-31 24:00 => 2020/12/31 24:00 => 2021/01/01 24:00 => 2021/01/01 00:00 (YYYY-MM-DD KK:MM => YYYY/MM/DD HH:MM)
        // 2020년 12월 31일 부분은 여러과정을 거쳐 1일 더하고 24:00 부분은 00:00로 치환함
        return Dateformat3(new Date(replaceSlash.setHours(replaceSlash.getHours() + 24))) + " 00:00"
    }
}
function Dateformat3(date) {
    let year = date.getFullYear();
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    let day = ('0' + date.getDate()).slice(-2);
    return year + '/' + month + '/' + day;
}
function Dateformat3_dash(date) {
    date.setHours(date.getHours() - 24);
    let year = date.getFullYear();
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    let day = ('0' + date.getDate()).slice(-2);
    return year + '-' + month + '-' + day;
}
function Dateformat3_dash_today(date) {
    let year = date.getFullYear();
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    let day = ('0' + date.getDate()).slice(-2);
    return year + '-' + month + '-' + day;
}
function Dateformat3_2(date) {
    date.setHours(date.getHours() - 24);
    let year = date.getFullYear();
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    let day = ('0' + date.getDate()).slice(-2);
    return year + '/' + month + '/' + day + " 00:59";
}
function Dateformat3_3(date) {
    date.setHours(date.getHours() - 3);
    let year = date.getFullYear();
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    let day = ('0' + date.getDate()).slice(-2);
    let hour = ('0' + date.getHours()).slice(-2);
    let minutes = ('0' + date.getMinutes()).slice(-2).substring(0, 1);
    return year + '/' + month + '/' + day + " " + hour + ":" + minutes + "9";
}
function Dateformat5(date) {
    let time = date.substr(11, 5);
    let monthNamesShort = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];
    let month = monthNamesShort[parseInt(date.substr(5, 2))-1];
    let day = date.substr(8, 2);
    let year = date.substr(0, 4);
    return month + " " + day + ", " + year + " " + time;
} //20211018수정(lyh)
function Dateformat3_1(date) {
    let year = date.substr(2, 2);
    let month = date.substr(5, 2);
    let day = date.substr(8, 2);
    let time = date.substr(11, 5);
    return year + '/' + month + '/' + day + " " + time;
}
function processAjax(TAMID) {
    window['xhttpTAM_' + TAMID] = new XMLHttpRequest();
    window['xhttpTAM_' + TAMID].onload = function () {
        window['xmlDocTAM_' + TAMID] = window['xhttpTAM_' + TAMID].responseXML;
        window['itemTAM_' + TAMID] = window['xmlDocTAM_' + TAMID].getElementsByTagName("item");
        processAQI(TAMID);
    }
    let urlTAM = "https://airnow.kr/cgi-bin/getDataList?id=" + TAMID + "&from=" + ajaxDate + "&to=" + ajaxDate + "&average=hourly&format=xml";
    window['xhttpTAM_' + TAMID].open("GET", urlTAM, false);
    window['xhttpTAM_' + TAMID].send();
}
function processAQI(TAMID) {
    if (window['itemTAM_' + TAMID].length != 0 ) {
        window['arrayDataTAM_' + TAMID] = new Array();
        let intervalHour = 24;
        for (let i = 0; i < intervalHour; i++) {
            startDate.setHours(startDate.getHours() + i);
            let TAMData = findPM25atDate(window['itemTAM_' + TAMID], startDate);
            if (TAMData != "-") {
                window['arrayDataTAM_' + TAMID].push(parseFloat(TAMData));
            }
            startDate = new Date(Dateformat3_2(new Date()));
        }
        let average = parseFloat((parseInt((averagef(window['arrayDataTAM_' + TAMID])) * 10)/10).toFixed(1));
        let maxAQI;
        let minAQI;
        let maxAverage;
        let minAverage;
        if (average >= 0.0 && average <= 500.4 ) {
            if (average >= 0.0 && average <= 12.0) {
                maxAQI = 50;
                minAQI = 0;
                maxAverage = 12.0;
                minAverage = 0.0;
            }
            else if (average >= 12.1 && average <= 35.4) {
                maxAQI = 100;
                minAQI = 51;
                maxAverage = 35.4;
                minAverage = 12.1;
            }
            else if (average >= 35.5 && average <= 55.4) {
                maxAQI = 150;
                minAQI = 101;
                maxAverage = 55.4;
                minAverage = 35.5;
            }
            else if (average >= 55.5 && average <= 150.4) {
                maxAQI = 200;
                minAQI = 151;
                maxAverage = 150.4;
                minAverage = 55.5;
            }
            else if (average >= 150.5 && average <= 250.4) {
                maxAQI = 300;
                minAQI = 201;
                maxAverage = 250.4;
                minAverage = 150.5;
            }
            else if (average >= 250.5 && average <= 350.4) {
                maxAQI = 400;
                minAQI = 301;
                maxAverage = 350.4;
                minAverage = 250.5;
            }
            else if (average >= 350.5 && average <= 500.4) {
                maxAQI = 500;
                minAQI = 401;
                maxAverage = 500.4;
                minAverage = 350.5;
            }
            window['TAMAQI_' + TAMID] = Round(numEP(((average - minAverage)*(maxAQI-minAQI)/(maxAverage-minAverage))+minAQI),0);
        }
        else if (average > 500.4)
            window['TAMAQI_' + TAMID] = "Beyond the AQI.";
    }
    else window['TAMAQI_' + TAMID] = "--";
}
function processAjax10(TAMID) {
    window['xhttpTAMRaw_' + TAMID] = new XMLHttpRequest();
    window['xhttpTAMRaw_' + TAMID].onload = function () {
        window['xmlDocTAMRaw_' + TAMID] = window['xhttpTAMRaw_' + TAMID].responseXML;
        window['itemTAMRaw_' + TAMID] = window['xmlDocTAMRaw_' + TAMID].getElementsByTagName("item");
        processGraph(TAMID);
    }
    let urlTAM = "https://airnow.kr/cgi-bin/getDataList?id=" + TAMID + "&from=" + ajaxDate + "&to=" + ajaxEndDate + "&average=raw&format=xml";
    window['xhttpTAMRaw_' + TAMID].open("GET", urlTAM, false);
    window['xhttpTAMRaw_' + TAMID].send();
}
function processGraph(TAMID) {
    let intervalMin = 3 * 60 / 10;
    window['arrayDataTAMRaw_' + TAMID] = new Array(intervalMin);
    for (let i = 0; i < window['arrayDataTAMRaw_' + TAMID].length; i++)
        window['arrayDataTAMRaw_' + TAMID][i] = new Array();
    for (let i = 0; i < intervalMin; i++) {
        startDate_10.setMinutes(startDate_10.getMinutes() + (i * 10));
        window['arrayDataTAMRaw_' + TAMID][i].push(startDate_10);
        let TAMData = findPM25atDate(window['itemTAMRaw_' + TAMID], startDate_10);
        if (TAMData != "-") {
            window['arrayDataTAMRaw_' + TAMID][i].push(parseFloat(TAMData));
            window['arrayDataTAMRaw_' + TAMID][i].push(lineTooltipHourly(parseFloat(TAMData), startDate_10, "㎍/m³"));
            window['arrayDataTAMRaw_' + TAMID][i].push('point { size: 3; shape-type: circle; fill-color: #0778fd; }');
        }
        else {
            window['arrayDataTAMRaw_' + TAMID][i].push(null);
            window['arrayDataTAMRaw_' + TAMID][i].push(lineTooltipHourly(null, startDate_10, "㎍/m³"));
            window['arrayDataTAMRaw_' + TAMID][i].push('point { size: 3; shape-type: circle; fill-color: #0778fd; }');
        }
        startDate_10 = new Date(Dateformat3_3(new Date()));
    }
}
function averagef(array) {
    let sum = 0.0;
    for (let i = 0; i < array.length; i++)
        sum = numEP(sum + array[i]);
    return numEP(sum / array.length);
}
function findPM25atDate(item, atDate) {
    let left = 0;
    let right = item.length - 1;
    while (left < right) {
        let middle = Math.floor((left + right) / 2);
        if (new Date(KK_HH(item, 0)).getTime() - new Date(KK_HH(item, 1)).getTime() < 0) {
            if (atDate.getTime() <= new Date(KK_HH(item, middle)).getTime()) {
                right = middle;
            } else {
                left = middle + 1;
            }
        }
        else {
            if (atDate.getTime() >= new Date(KK_HH(item, middle)).getTime()) {
                right = middle;
            } else {
                left = middle + 1;
            }
        }
    }
    if (atDate.getTime() == new Date(KK_HH(item, right)).getTime())
        return item[right].getElementsByTagName("pm25Value")[0].childNodes[0].nodeValue;
    return "-";
}
function Round(n, pos) {
    var digits = Math.pow(10, pos);
    var sign = 1;
    if (n < 0) { sign = -1; }
    // 음수이면 양수처리후 반올림 한 후 다시 음수처리 
    n = n * sign;
    var num = Math.round(n * digits) / digits;
    num = num * sign;
    return num.toFixed(pos);
}
function TAMTooltip(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r) {
    return "<style>" +
        "table.tooltip1 {border-top: 1px solid #A5A5A5; border-bottom: 1px solid #A5A5A5; border-collapse: collapse; margin: 10px auto; width:200px;}" + 
        "th.tooltip1, td.tooltip1 {border-left: 1px solid #000000; padding: 10px; font-weight: normal; text-align: center;}" + 
        "th.tooltip1 {background-color: #EDEDED;}" + 
        "th.tooltip1:first-child, td.tooltip1:first-child {border-left: none;}" + 
        ".PM25Value" + b + "{box-sizing: border-box; width: 70px; height: 30px; background-color: " + d + "; border-radius: 10px 10px 10px 10px / 10px 10px 10px 10px; color: white; text-align: center; display:table-cell; vertical-align: middle; text-shadow: -1px 0 #000, 0 1px #000, 1px 0 #000, 0 -1px #000;}" + 
        ".AQIValue" + b + " {box-sizing: border-box; width: 70px; height: 30px; background-color: " + f + "; border-radius: 10px 10px 10px 10px / 10px 10px 10px 10px; color: white; text-align: center; display:table-cell; vertical-align: middle; text-shadow: -1px 0 #000, 0 1px #000, 1px 0 #000, 0 -1px #000;}" + 
        ".TAMStation1 {text-align: center;}" +
        "h3.Time {font-size:9pt; font-weight:normal; margin: 0 0 0 60px; display: inline; word-spacing: -1px;}" +
    "</style>" +
    "<p class='TAMStation1'><strong>TAM" + b + " (" + a + ")</strong></p>" +
    "<table class='tooltip1'>" + 
        "<thead>" +
            "<tr>" +
                "<th class='tooltip1' align=center>PM2.5 (㎍/m³)</th>" + 
                "<th class='tooltip1' align=center>US AQI</th>" +
            "</tr>" +
        "</thead>" +
        "<tbody>" +
            "<tr>" +
                "<td class='tooltip1' align=center><div class='PM25Value" + b + "'><strong>" + c + "</strong></div></td>" +
                "<td class='tooltip1' align=center><div class='AQIValue" + b + "'><strong>" + e + "</strong></div></td>" +
            "<tr>" +
        "</tbody>" +
    "</table>" +
    "<a href='javascript:;' onclick='popup_1(" +b + ",\""  + a + "\",\""  + h + "\","  + i + ","  + c + ","  + j + ","  + k + ","  + l + ","  + m + ","  + n + ","  + o + ","  + p + ","  + q + ","  + r + ");'" + "><u>details</u></a><h3 class='Time'>" + g + "</h3>"
} //20211018수정(lyh)
function numEP(a) {
    return Math.round((a + Number.EPSILON)*10000000000000) / 10000000000000;
}
function findMinNum(arr) {
    let array = new Array(arr.length);
    let errorCount = 0;
    let errorCaption;
    for (let i = 0; i < array.length; i++)
        array[i] = new Array(arr[i].number, arr[i].error, arr[i].status);
    for (let i = 0; i < array.length; i++) {
        if (array[i][1] != "no")
            errorCount += 1;
    }
    for (let i = 0; i < array.length; i++) {
        if (array[i][0] == 'E') {
            array.splice(i, 1);
            i--;
        }
    }
    if (errorCount == 0)
        errorCaption = "";
    else errorCaption = "!";
    if (array.length != 0) {
        let minNum = array[0][0];
        let clusterState = array[0][2];
        let clusterStateFinal;
        for (let i = 0; i < array.length; i++) {
            if (array[i][0] > minNum) {
                minNum = array[i][0];
                clusterState = array[i][2];
            }
        }
        clusterStateFinal = clusterState + errorCaption + ".png?ver=1";
        return [minNum, clusterStateFinal];
    }
    else return ['E', "관광지 고장!.png?ver=1"]
}
function clusterZoom() {
    var cluster = transfer;
	cluster.zoomToBounds({
		padding: [45, 45]
	});
}
$("#scroll-modal-top").click(function() {
    $(".popupBody").scrollTop(0);
});
function drawLineColors() {
    let data = new google.visualization.DataTable();
    data.addColumn('date', 'X');
    data.addColumn('number', "unknown");
    data.addColumn({ type: 'string', role: 'tooltip'});
    data.addColumn({ type: 'string', role: 'style'});
    data.addRows(arrayData);
    let options = {
        hAxis: {
            titleTextStyle: { bold: false, italic: false },
            gridlines: {interval: 0},
            minorGridlines: {count: 0},
        },
        vAxis: {
            titleTextStyle: { bold: false, italic: false },
            minorGridlines: {count: 0},
            viewWindow: { min: 0 }
            //viewWindow: { min: 0} //20211019수정(lyh)
        },
        // 차트영역 크기조절하여야 함
        chartArea: {width:'85%',height:'80%'},
        colors: ["#0778fd"],
        tooltip: {textStyle: {fontSize: 12, textAlign: 'center'}},
        legend: {position: 'none'},
        lineWidth: 0.75,
        pointsVisible: true,
    };
    let chart = new google.visualization.LineChart(document.getElementById('trendGraph'));
    chart.draw(data, options);
}
function lineTooltipHourly(a, b, c) {
    if (typeof(a) == 'number') {
        return a.toFixed(1) + c;
    }
}

function popup_1(a, b, c, d, e, f, g, h, i ,j, k, l, m, n) {
    body = document.querySelector('body');
    modal = document.querySelector('.modal');
    btnOpenPopup = document.querySelector('.btn-open-popup');
    document.getElementById('popup').style.display = 'none';
    document.getElementById('popup1').style.display = 'block';
    document.getElementById('TAM_ID').innerHTML = a;
    document.getElementById('TAM_Site').innerHTML = b;
    if (c == "no")
        document.getElementById('errorText1').innerHTML = "";
    else document.getElementById('errorText1').innerHTML = c;
    document.getElementById('PM_Sensor_1').innerHTML = d;
    document.getElementById('PM_Sensor_25').innerHTML = e;
    document.getElementById('PM_Sensor_40').innerHTML = f;
    document.getElementById('PM_Sensor_10').innerHTML = g;
    document.getElementById('Press').innerHTML = j;
    document.getElementById('Ambient_T').innerHTML = h;
    document.getElementById('Ambient_H').innerHTML = i;
    document.getElementById('TAC_T').innerHTML = k;
    document.getElementById('TAC_H').innerHTML = l;
    document.getElementById('GPS_Lat').innerHTML = m;
    document.getElementById('GPS_Lon').innerHTML = n;
    function show() {
        document.querySelector(".background").className = "background show";
    }
    function close() {
        document.querySelector(".background").className = "background";
    }
    show();
    document.querySelector("#close1").addEventListener("click", close);
}
function zoomLevels(a) {
    if (a < 0.149)
        return 20;
    else if (a >= 0.149 && a < 0.298)
        return 19
    else if (a >= 0.298 && a < 0.596)
        return 18
    else if (a >= 0.596 && a < 1.193)
        return 17
    else if (a >= 1.193 && a < 2.387)
        return 16
    else if (a >= 2.387 && a < 4.773)
        return 15
    else if (a >= 4.773 && a < 9.547)
        return 14
    else if (a >= 9.547 && a < 19.093)
        return 13
    else if (a >= 19.093 && a < 38.187)
        return 12
    else if (a >= 38.187 && a < 76.373)
        return 11
    else if (a >= 76.373 && a < 152.746)
        return 10
    else if (a >= 152.746 && a < 305.942)
        return 9
    else if (a >= 305.942 && a < 610.984)
        return 8
    else if (a >= 610.984 && a < 1222)
        return 7
    else if (a >= 1222 && a < 2444)
        return 6
    else if (a >= 2444 && a < 4888)
        return 5
    else if (a >= 4888 && a < 9776)
        return 4
    else if (a >= 9776 && a < 19551)
        return 3
    else if (a >= 19551 && a < 39103)
        return 2
    else if (a >= 39103 && a < 78206)
        return 1
    else if (a >= 78206)
        return 0
}
function changeLanguage(a, b, c, d, e, f, g, h, i) {
    if (a == "ko-KR" || a == "ko") {
        document.getElementById('css').href="style/css/gtourEN.css?ver=" + timestamp;
        document.getElementById('tourSite').innerHTML = f;
        document.getElementById('tourAddress').innerHTML = g;
        document.getElementById('mainStatus').style.backgroundImage = "url('gtourIcon/nemobox/" + h + "')";
        document.getElementById('dataProvider').innerHTML = i;
        document.getElementById('tourChangeBtn').innerHTML = "Change Site";
        document.getElementById("global").setAttribute("value", "en-US");
        document.getElementById("global").setAttribute("onClick", "changeLanguage('en-US','" + b + "','" + c + "','" + d + "','" + e + "','" + f + "','" + g + "','" + h + "','" + i + "')");
    }
    else {
        document.getElementById('css').href="style/css/gtour.css?ver=" + timestamp;
        document.getElementById('tourSite').innerHTML = b;
        document.getElementById('tourAddress').innerHTML = c;
        document.getElementById('mainStatus').style.backgroundImage = "url('gtourIcon/nemobox/" + d + "')";
        document.getElementById('dataProvider').innerHTML = e;
        document.getElementById('tourChangeBtn').innerHTML = "사이트 변경";
        document.getElementById("global").setAttribute("value", "ko-KR");
        document.getElementById("global").setAttribute("onClick", "changeLanguage('ko-KR','" + b + "','" + c + "','" + d + "','" + e + "','" + f + "','" + g + "','" + h + "','" + i + "')");
    }
}