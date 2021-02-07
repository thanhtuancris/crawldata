let request = require('request');
const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');
const { parseHTML } = require('cheerio');
const { type } = require('os');
const app = express()
const host = "0.0.0.0";
const port = 3000;

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.post('/tkb', async function (req, res) {
    let id = req.body.id;
    var options = {
    'method': 'GET',
    'url': `http://dkmh.tnut.edu.vn/Default.aspx?page=thoikhoabieu&id=${id}`,
    'headers': {
        // 'Cookie': 'ASP.NET_SessionId=5jtqmk45okxr5n2yrlekrb55'
    }
};
    request(options, function (error, response, html) {
        if(response){
            const $ = cheerio.load(html)
            let data = [];
            $('#ctl00_ContentPlaceHolder1_ctl00_Table1').each((index, element) => {
                let td = $(element).find("tbody").find("tr").find("td")
                $(td).each(function(i,e) {
                    var onmouseover = $(this).attr("onmouseover")
                    if(onmouseover){
                        var regex = /ddrivetip\((.+?)\)/gm;
                        var match ="["+ regex.exec(onmouseover)[1] + "]";
                        let dt = JSON.parse(match.split("'").join('"'))
                        data.push(dt)
                    }
                });
            })
            let obj
            let rs_data = []
            for(let i = 0; i < data.length; i++){
                obj = {
                    "loailich": "LichHoc",
                    "hocphan": data[i][1],
                    "mamon": data[i][2],
                    "lop": data[i][0],
                    "thu": data[i][3],
                    "diadiem": data[i][5],
                    "tietbatdau": data[i][6],
                    "sotiet": data[i][7],
                    "giaovien": data[i][8],
                    'batdautu': data[i][9],
                    'den': data[i][10],
                }
                rs_data.push(obj)
                obj.tiethoc = obj.tietbatdau +"-"+ parseInt(parseInt(obj.tietbatdau) + parseInt(obj.sotiet) -1)
            }
            res.status(200).json({
                status: "OK",
                data: rs_data
            })
        }
    });
})
async function tkb(){
    let username = "K175520201095";
    let password = "hienkeo1808";
    const browser = await puppeteer.launch({
        headless: false,
    })
    const page = await browser.newPage()
    await page.goto('http://dkmh.tnut.edu.vn/')
    const USER_SELECTOR = '#ctl00_ContentPlaceHolder1_ctl00_ucDangNhap_txtTaiKhoa'
    const PASSWORD_SELECTOR = '#ctl00_ContentPlaceHolder1_ctl00_ucDangNhap_txtMatKhau'
    const BUTTON_LOGIN_SELECTOR = '#ctl00_ContentPlaceHolder1_ctl00_ucDangNhap_btnDangNhap'
    await page.click(USER_SELECTOR)
    await page.keyboard.type(username)
    await page.waitForTimeout(1000)
    await page.click(PASSWORD_SELECTOR)
    await page.keyboard.type(password)
    await page.waitForTimeout(1000)
    await page.click(BUTTON_LOGIN_SELECTOR)
    await page.waitForTimeout(2000)
    const elements = await page.$x('//*[@id="ctl00_menu_lblThoiKhoaBieu"]')
    await elements[0].click() 
    await page.waitForTimeout(1000)
    await page.select('#ctl00_ContentPlaceHolder1_ctl00_ddlChonNHHK', '20201')
    await page.waitForTimeout(1000)
    await page.select('#ctl00_ContentPlaceHolder1_ctl00_ddlLoai', '1')
    await page.waitForTimeout(1000)
    // const ele2 = await page.$x('//*[@id="ctl00_ContentPlaceHolder1_ctl00_rad_ThuTiet"]')
    // await ele2[0].click() 
    // await page.waitForTimeout(1000)
    // const lichhoc = await page.evaluate(async function(){
    //     let element = document.getElementsById('ctl00_ContentPlaceHolder1_ctl00_pnlHeader')
    // })
}
app.post('/lichthi', async function (req, res) {
    let id = req.body.id;
    var options = {
      'method': 'GET',
      'url': `http://dkmh.tnut.edu.vn/Default.aspx?page=xemlichthi&id=${id}`,
      'headers': {
        'Cookie': 'ASP.NET_SessionId=5jtqmk45okxr5n2yrlekrb55'
      }
    };
    request(options, async function (error, response, html) {
        if(response){
            const $ = cheerio.load(html)
            let data = []
            let temp = []
            let a = $("#ctl00_ContentPlaceHolder1_ctl00_gvXem>tbody>tr>td").each(function (index, element){
                let rs = $(element).find("span")
                let b = $(rs).text()
                temp.push(b);
                if((index +1) % 12 ==0){
                    data.push(temp)
                    temp = [];
                }
            })
            let obj;
            let result = []
            for(let i = 0; i< data.length; i++){
                obj = {
                    "loailich": "LichThi",
                    "stt": data[i][0],
                    "hocphan": data[i][2],
                    "mamon": data[i][1],
                    "thoigian": data[i][6],
                    "diadiem": data[i][9],
                    "sotiet": data[i][8],
                    "tietbd": data[i][7],
                    "ghepthi": data[i][3],
                    "tothi": data[i][4],
                    "soluong": data[i][5],
                    "ghichu": data[i][10]
                }
                result.push(obj)
            }
            let options2 = {

            }
            res.status(200).json({
                status: "OK",
                data: result
            })
        }
    });
})
app.post('/profile', async function (req, res){
    let id = req.body.id;
    let password = req.body.password;
    var options = {
      'method': 'GET',
      'url': 'http://dkmh.tnut.edu.vn/Default.aspx?page=gioithieu',
      'headers': {

      }
    };
    request(options, function (error, response, html) {
        if(response){
            let $ = cheerio.load(html)
            let a = $('#__VIEWSTATE').attr('value')
            let options2 = {
                'method': 'POST',
                'url': 'http://dkmh.tnut.edu.vn/default.aspx?page=dangnhap',
                'headers': {
                    "Host":'dkmh.tnut.edu.vn',
                    "Connection":'keep-alive',
                    "Upgrade-Insecure-Requests":'1',
                    "Origin":'http://dkmh.tnut.edu.vn',
                   "Content-Type":'multipart/form-data; boundary=----WebKitFormBoundaryltfmpHCvU9QNzQzY',
                   "User-Agent":'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36',
                    "Accept":'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                    "Referer":'http://dkmh.tnut.edu.vn/default.aspx?page=dangnhap',
                   "Accept-Encoding":'',
                    "Accept-Language":'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
                },
                form: {
                    "__EVENTTARGET":'',
                    "__EVENTARGUMENT":'',
                    "__VIEWSTATE": a,
                    "__VIEWSTATEGENERATOR": 'CA0B0334',
                    "ctl00$ContentPlaceHolder1$ctl00$txtTaiKhoa":id,
                    "ctl00$ContentPlaceHolder1$ctl00$txtMatKhau":password,
                    "ctl00$ContentPlaceHolder1$ctl00$btnDangNhap":'Đăng Nhập'
                }
            }
            request(options2, function(err,ress,html2){
                if(ress){
                    let cookie = ress.headers['set-cookie']
                    cookie = cookie.toString()
                    let rs_cookie = cookie.replace("; path=/; HttpOnly", "")
                    setTimeout(function(){
                        let options3 = {
                            'method': 'GET',
                            'url': 'http://dkmh.tnut.edu.vn/default.aspx?page=gioithieu',
                            'headers': {
                                "Host":'dkmh.tnut.edu.vn',
                                "Connection":'keep-alive',
                                "Upgrade-Insecure-Requests":'1',
                               "User-Agent":'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36',
                                "Accept":'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                                "Referer":'http://dkmh.tnut.edu.vn/default.aspx?page=dangnhap',
                               "Accept-Encoding":'',
                                "Accept-Language":'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
                                "Cookie": rs_cookie
                            },
                        }
                        request(options3, function(errr, rss, html3){
                            if(rss){
                                let options4 = {
                                    'method': 'GET',
                                    'url': 'http://dkmh.tnut.edu.vn/Default.aspx?page=xemlichthi',
                                    'headers': {
                                        "Host":'dkmh.tnut.edu.vn',
                                        "Connection":'keep-alive',
                                        "Upgrade-Insecure-Requests":'1',
                                       "User-Agent":'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36',
                                        "Accept":'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                                        "Referer":'http://dkmh.tnut.edu.vn/default.aspx?page=gioithieu',
                                       "Accept-Encodidng":'',
                                        "Accept-Lanadguage":'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
                                        "Cookie": rs_cookie
                                    },
                                }
                                request(options4, function(error, rsss, html4) {
                                    if(rsss){
                                        let data = []
                                        let $ =  cheerio.load(html4)
                                        let ttcn = $(".infor-member > .center > table > tbody")
                                        let dt = $(ttcn).find("tr").find("td").find("span")
                                        $(dt).each(function(i,e){
                                            let b = $(e).text()
                                            data.push(b)
                                        })
                                        let obj = {
                                            "Mã sinh viên": data[1],
                                            "Tên sinh viên": data[3],
                                            "Phái": data[5],
                                            "Nơi sinh": data[7],
                                            "Lớp": data[9],
                                            "Ngành": data[11],
                                            "Khoa": data[13],
                                            "Hệ đào tạo": data[15],
                                            "Khóa học": data[17],
                                            "Cố vấn học tập": data[19]
                                        }
                                        res.status(200).json({
                                            status: "OK",
                                            data: obj
                                        })
                                    }
                                })
                            }
                        })
                    }, 3000);
                  
                }
            });
        }
       
        
    });
    
});
app.post('/diem', async function (req, res){

    let id = req.body.id;
    let password = req.body.password;
    var options = {
      'method': 'GET',
      'url': 'http://dkmh.tnut.edu.vn/Default.aspx?page=gioithieu',
      'headers': {

      }
    };
    request(options, function (error, response, html) {
        if(response){
            let $ = cheerio.load(html)
            let a = $('#__VIEWSTATE').attr('value')
            let options2 = {
                'method': 'POST',
                'url': 'http://dkmh.tnut.edu.vn/default.aspx?page=dangnhap',
                'headers': {
                    "Host":'dkmh.tnut.edu.vn',
                    "Connection":'keep-alive',
                    "Upgrade-Insecure-Requests":'1',
                    "Origin":'http://dkmh.tnut.edu.vn',
                   "Content-Type":'multipart/form-data; boundary=----WebKitFormBoundaryltfmpHCvU9QNzQzY',
                   "User-Agent":'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36',
                    "Accept":'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                    "Referer":'http://dkmh.tnut.edu.vn/default.aspx?page=dangnhap',
                   "Accept-Encoding":'',
                    "Accept-Language":'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
                },
                form: {
                    "__EVENTTARGET":'',
                    "__EVENTARGUMENT":'',
                    "__VIEWSTATE": a,
                    "__VIEWSTATEGENERATOR": 'CA0B0334',
                    "ctl00$ContentPlaceHolder1$ctl00$txtTaiKhoa":id,
                    "ctl00$ContentPlaceHolder1$ctl00$txtMatKhau":password,
                    "ctl00$ContentPlaceHolder1$ctl00$btnDangNhap":'Đăng Nhập'
                }
            }
            request(options2, function(err,ress,html2){
                if(ress){
                    let cookie = ress.headers['set-cookie']
                    cookie = cookie.toString()
                    let rs_cookie = cookie.replace("; path=/; HttpOnly", "")
                    setTimeout(function(){
                        let options3 = {
                            'method': 'GET',
                            'url': 'http://dkmh.tnut.edu.vn/default.aspx?page=gioithieu',
                            'headers': {
                                "Host":'dkmh.tnut.edu.vn',
                                "Connection":'keep-alive',
                                "Upgrade-Insecure-Requests":'1',
                               "User-Agent":'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36',
                                "Accept":'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                                "Referer":'http://dkmh.tnut.edu.vn/default.aspx?page=dangnhap',
                               "Accept-Encoding":'',
                                "Accept-Language":'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
                                "Cookie": rs_cookie
                            },
                        }
                        request(options3, function(errr, rss, html3){
                            if(rss){
                                let options4 = {
                                    'method': 'GET',
                                    'url': 'http://dkmh.tnut.edu.vn/Default.aspx?page=xemdiemthi',
                                    'headers': {
                                        "Host":'dkmh.tnut.edu.vn',
                                        "Connection":'keep-alive',
                                        "Upgrade-Insecure-Requests":'1',
                                       "User-Agent":'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36',
                                        "Accept":'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                                        "Referer":'http://dkmh.tnut.edu.vn/default.aspx?page=gioithieu',
                                       "Accept-Encodidng":'',
                                        "Accept-Lanadguage":'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
                                        "Cookie": rs_cookie
                                    },
                                }
                                request(options4, function(error, rsss, html4) {
                                    if(rsss){
                                        let $ = cheerio.load(html4)
                                        let b = $('#__VIEWSTATE').attr('value')
                                        let options5 = {
                                            'method': 'POST',
                                            'url': 'http://dkmh.tnut.edu.vn/Default.aspx?page=xemdiemthi',
                                            'headers': {
                                                "Host":'dkmh.tnut.edu.vn',
                                                "Connection":'keep-alive',
                                                "Upgrade-Insecure-Requests":'1',
                                                "Origin":'http://dkmh.tnut.edu.vn',
                                               "Content-Type":'multipart/form-data; boundary=----WebKitFormBoundaryltfmpHCvU9QNzQzY',
                                               "User-Agent":'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36',
                                                "Accept":'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                                                "Referer":'http://dkmh.tnut.edu.vn/Default.aspx?page=xemdiemthi',
                                               "Accept-Encoding":'',
                                                "Accept-Language":'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
                                                "Cookie": rs_cookie
                                            },
                                            form: {
                                                "__EVENTTARGET":'ctl00$ContentPlaceHolder1$ctl00$lnkChangeview2',
                                                "__EVENTARGUMENT":'',
                                                "__VIEWSTATE": b,
                                                "__VIEWSTATEGENERATOR": 'CA0B0334',
                                                "ctl00$ContentPlaceHolder1$ctl00$txtChonHK":'',
                                            }
                                        }
                                        request(options5, function(errors, results, html5){
                                            let $ = cheerio.load(html5);
                                            let data = []
                                            let temp = []
                                            let choose = req.body.choose
                                            if(choose == "all"){
                                                $("#ctl00_ContentPlaceHolder1_ctl00_div1 > table > tbody > .row-diem > td > span").each(function(i,e){
                                                    let rs = $(e).text()
                                                    temp.push(rs);
                                                    if((i + 1) % 13 == 0){
                                                        data.push(temp)
                                                        temp = [];
                                                    }
                                                })    
                                                let obj
                                                let result = []
                                                for(let i = 0; i< data.length; i++){
                                                    obj = {
                                                        "stt": data[i][0],
                                                        "hocphan": data[i][2],
                                                        "mamon": data[i][1],
                                                        "sotc": data[i][3],
                                                        "%kt": data[i][4],
                                                        "%thi": data[i][5],
                                                        "diemqt": data[i][6].trim(),
                                                        "thiL1": data[i][7].trim(),
                                                        "thiL2": data[i][8].trim(),
                                                        "tk1(10)": data[i][9].trim(),
                                                        "tk(10)": data[i][10].trim(),
                                                        "tk1(CH)": data[i][11],
                                                        "tk(CH)": data[i][12],
                                                    }
                                                    result.push(obj)
                                                }
                                                res.status(200).json({
                                                    status: "OK",
                                                    data: result
                                                })
                                            }
                                            if(choose == "tb"){
                                                let arr = []
                                                let tem= []
                                                $("#ctl00_ContentPlaceHolder1_ctl00_div1 > table > tbody > tr").each(function(index, element) {
                                                    let a = $(element).attr("class")
                                                    if(a == 'row-diemTK'){
                                                        $(element).find("td").find("span").each(function(i,e){
                                                            let rs = $(e).text()
                                                            if((i + 1) % 2 == 0){
                                                                tem.push(rs);
                                                            }
                                                        })
                                                    }
                                                    if(a == 'title-hk-diem'){
                                                        if(tem.length> 0){
                                                            arr.push(tem)
                                                            tem = []
                                                        }
                                                    }
                                                })
                                                if(tem.length> 0){
                                                    arr.push(tem)
                                                }
                                                let obj
                                                let result = []
                                                for(let i = 0; i< arr.length; i++){
                                                    obj = {
                                                       "Điểm trung bình học kỳ hệ 10/100" : arr[i][0].trim(), 
                                                       "Điểm trung bình tích lũy" : arr[i][1].trim(), 
                                                       "Điểm trung bình tích lũy (hệ 4)" : arr[i][2].trim(), 
                                                       "Số tín chỉ đạt" : arr[i][3], 
                                                       "Số tín chỉ tích lũy" : arr[i][4], 
                                                       "Phân Loại ĐTB HK" : arr[i][5], 
                                                       "Điểm Trung Bình Rèn Luyện HK" : arr[i][6], 
                                                       "Phân Loại ĐTBRL HK" : arr[i][7], 
                                                    }
                                                    result.push(obj)
                                                }
                                                res.status(200).json({
                                                    status: "OK",
                                                    data: result
                                                })
                                            }
                                        });
                                    }
                                })
                            }
                        })
                    }, 3000);
                  
                }
            });
        }
       
        
    });
    
});
app.post('/ngoaikhoa', async function(req,res){
    let id = req.body.id;
    let option = {
        'method': 'GET',
        'url': `https://qlsv.tnut.edu.vn/hoat-dong/diem-ca-nhan/${id}.html`,
        'headers': {
            "Host":'qlsv.tnut.edu.vn',
            "Connection":'keep-alive',
            "sec-ch-ua":'"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
            "sec-ch-ua-mobile":'?0',
            "Upgrade-Insecure-Requests":'1',
            "User-Agent":'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36',
            "Accept":'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            "Sec-Fetch-Site":'none',
            "Sec-Fetch-Mode":'navigate',
            "Sec-Fetch-User":'?1',
            "Sec-Fetch-Dest":'document',
            "Accept-Encoding":'',
            "Accept-Language":'en-US,en;q=0.9'
        }
    }
    request(option, async function (err, response, html){
        if(response){
            let $ = cheerio.load(html)
            let a = $("#__layout > div > section > main > div.bgw.p-10.el-row > div.p-r-5.min-height-70vh.el-col.el-col-18 > div > div.bg-info.text-white.p-15.text-center.std-info.el-row > div.text-uppercase.el-col.el-col-16")
            let ten = $(a).find("h1").text()
            let lop = $(a).find("h2").text()
            let diem =  $(a).find("h3").find("span").text()
            diem = diem.split('')
            let hoatdong = $("#__layout > div > section > main > div.bgw.p-10.el-row > div.p-r-5.min-height-70vh.el-col.el-col-18 > div > div.el-table.el-table--fit.el-table--enable-row-hover.el-table--enable-row-transition > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr").each(function(index, element){
                let b = $(element).find("td").find("span").text()
            })
            return
            let obj1 = {
                "hovaten": ten,
                "lop": lop,
                "tongdukien": diem[0],
                "diemngoaikhoa": diem[1],
                "choduyet": diem[2]
            }
            res.status(200).json({
                status: "OK",
                data: obj1
            })
        }
    })
})

app.post('/test', async function(req,res){
    let id = req.body.id;
    let password = req.body.password;
    var options = {
      'method': 'GET',
      'url': 'http://dkmh.tnut.edu.vn/Default.aspx?page=gioithieu',
      'headers': {

      }
    };
    request(options, function (error, response, html) {
        if(response){
            let $ = cheerio.load(html)
            let a = $('#__VIEWSTATE').attr('value')
            let options2 = {
                'method': 'POST',
                'url': 'http://dkmh.tnut.edu.vn/default.aspx?page=dangnhap',
                'headers': {
                    "Host":'dkmh.tnut.edu.vn',
                    "Connection":'keep-alive',
                    "Upgrade-Insecure-Requests":'1',
                    "Origin":'http://dkmh.tnut.edu.vn',
                   "Content-Type":'multipart/form-data; boundary=----WebKitFormBoundaryltfmpHCvU9QNzQzY',
                   "User-Agent":'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36',
                    "Accept":'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                    "Referer":'http://dkmh.tnut.edu.vn/default.aspx?page=dangnhap',
                   "Accept-Encoding":'',
                    "Accept-Language":'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
                },
                form: {
                    "__EVENTTARGET":'',
                    "__EVENTARGUMENT":'',
                    "__VIEWSTATE": a,
                    "__VIEWSTATEGENERATOR": 'CA0B0334',
                    "ctl00$ContentPlaceHolder1$ctl00$txtTaiKhoa":id,
                    "ctl00$ContentPlaceHolder1$ctl00$txtMatKhau":password,
                    "ctl00$ContentPlaceHolder1$ctl00$btnDangNhap":'Đăng Nhập'
                }
            }
            request(options2, function(err,ress,html2){
                if(ress){
                    let cookie = ress.headers['set-cookie']
                    cookie = cookie.toString()
                    let rs_cookie = cookie.replace("; path=/; HttpOnly", "")
                    setTimeout(function(){
                        let options3 = {
                            'method': 'GET',
                            'url': 'http://dkmh.tnut.edu.vn/default.aspx?page=gioithieu',
                            'headers': {
                                "Host":'dkmh.tnut.edu.vn',
                                "Connection":'keep-alive',
                                "Upgrade-Insecure-Requests":'1',
                               "User-Agent":'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36',
                                "Accept":'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                                "Referer":'http://dkmh.tnut.edu.vn/default.aspx?page=dangnhap',
                               "Accept-Encoding":'',
                                "Accept-Language":'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
                                "Cookie": rs_cookie
                            },
                        }
                        request(options3, function(errr, rss, html3){
                            if(rss){
                                let options4 = {
                                    'method': 'GET',
                                    'url': 'http://dkmh.tnut.edu.vn/Default.aspx?page=thoikhoabieu',
                                    'headers': {
                                        "Host":'dkmh.tnut.edu.vn',
                                        "Connection":'keep-alive',
                                        "Upgrade-Insecure-Requests":'1',
                                       "User-Agent":'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36',
                                        "Accept":'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                                        "Referer":'http://dkmh.tnut.edu.vn/default.aspx?page=gioithieu',
                                       "Accept-Encodidng":'',
                                        "Accept-Lanadguage":'en-US,en;q=0.9',
                                        "Cookie": rs_cookie
                                    },
                                }
                                request(options4, function(error, rsss, html4) {
                                    if(rsss){
                                        let array = [];
                                        let rs_tuan
                                        let $ = cheerio.load(html4)
                                        let viewstate = $('#__VIEWSTATE').attr('value')
                                        let tuan = $('#ctl00_ContentPlaceHolder1_ctl00_ddlTuan').find("option")
                                       
                                        $(tuan).each(function(i,e){
                                            rs_tuan = $(e).attr('value')
                                            array.push(rs_tuan)
                                        })
                                        for(let i = 0; i<array.length; i++){
                                            let options5 = {
                                                'method': 'POST',
                                                'url': 'http://dkmh.tnut.edu.vn/default.aspx?page=dangnhap',
                                                'headers': {
                                                    "Host":'dkmh.tnut.edu.vn',
                                                    "Connection":'keep-alive',
                                                    "Upgrade-Insecure-Requests":'1',
                                                    "Origin":'http://dkmh.tnut.edu.vn',
                                                    "Content-Type":'multipart/form-data; boundary=----WebKitFormBoundaryEhFD8OH34ghoQiar',
                                                    "User-Agent":'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36',
                                                    "Accept":'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                                                    "Referer":'http://dkmh.tnut.edu.vn/Default.aspx?page=thoikhoabieu',
                                                    "Accept-Encoding":'',
                                                    "Accept-Language":'en-US,en;q=0.9',
                                                    "Cookie":rs_cookie
                                                },
                                                form: {
                                                    "__EVENTTARGET":'ctl00$ContentPlaceHolder1$ctl00$ddlTuan',
                                                    "__EVENTARGUMENT":'',
                                                    "__VIEWSTATE": viewstate,
                                                    "ctl00$ContentPlaceHolder1$ctl00$ddlChonNHHK":'20202',
                                                    "__VIEWSTATEGENERATOR": 'CA0B0334',
                                                    "ctl00$ContentPlaceHolder1$ctl00$ddlLoai":'0',
                                                    "ctl00$ContentPlaceHolder1$ctl00$ddlTuan":array[i]
                                                }
                                            }
                                            request(options5, function(error, rssss, html5){
                                                if(rssss){
                                                    fs.writeFile('12.txt', rssss.body, function(er,rs){
                                                        
                                                    })
                                                }
                                            })
                                        }
                                    }
                                })
                            }
                        })
                    }, 3000);
                  
                }
            });
        }
    });
})
app.post('/test2',async function(req, res){
    let username = "K175520201095";
    let password = "hienkeo1808";
    const browser = await puppeteer.launch({
        headless: false,
    })
    const page = await browser.newPage()
    await page.goto('http://dkmh.tnut.edu.vn/')
    const USER_SELECTOR = '#ctl00_ContentPlaceHolder1_ctl00_ucDangNhap_txtTaiKhoa'
    const PASSWORD_SELECTOR = '#ctl00_ContentPlaceHolder1_ctl00_ucDangNhap_txtMatKhau'
    const BUTTON_LOGIN_SELECTOR = '#ctl00_ContentPlaceHolder1_ctl00_ucDangNhap_btnDangNhap'
    await page.click(USER_SELECTOR)
    await page.keyboard.type(username)
    await page.waitForTimeout(1000)
    await page.click(PASSWORD_SELECTOR)
    await page.keyboard.type(password)
    await page.waitForTimeout(1000)
    await page.click(BUTTON_LOGIN_SELECTOR)
    await page.waitForTimeout(2000)
    const elements = await page.$x('//*[@id="ctl00_menu_lblThoiKhoaBieu"]')
    await elements[0].click() 
    await page.waitForTimeout(1000)
    await page.select('#ctl00_ContentPlaceHolder1_ctl00_ddlChonNHHK', '20201')
    await page.waitForTimeout(1000)
    let option
    let week = await page.evaluate(async () => {
        let arr = []
        const id_selector = document.querySelector('#ctl00_ContentPlaceHolder1_ctl00_ddlTuan');
        const options = id_selector.querySelectorAll('option');
        for(let i = 0; i<options.length; i++){
            option = options[i].value
            arr.push(option)
        }
        return arr
    });
    let b
    for(let i = 0; i < week.length; i++){
        b = await page.select('#ctl00_ContentPlaceHolder1_ctl00_ddlTuan', week[i])
    }
    await page.waitForTimeout(1000)
    console.log(b);
    
})
app.listen(port, host, () => {
    console.log("Server running - port " + port);
});
