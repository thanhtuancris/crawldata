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
        'Cookie': 'ASP.NET_SessionId=5jtqmk45okxr5n2yrlekrb55'
    }
};
    request(options, function (error, response, html) {
        if(response){
            const $ = cheerio.load(html)
            let data = [];
            let tableHeaders = [];
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
// app.post('/lichthi', async function (req, res) {
//     let id = req.body.id;
//     var options = {
//       'method': 'GET',
//       'url': `http://dkmh.tnut.edu.vn/Default.aspx?page=xemlichthi&id=${id}`,
//       'headers': {
//         'Cookie': 'ASP.NET_SessionId=5jtqmk45okxr5n2yrlekrb55'
//       }
//     };
//     request(options, async function (error, response, html) {
//         if(response){
//             const $ = cheerio.load(html)
//             let data = [];
//             let tableHeaders = [];
//             $("#ctl00_ContentPlaceHolder1_ctl00_gvXem>tbody>tr").each((index, element) => {
//                 if(index === 0){
//                     let th = $(element).find("th");
//                     $(th).each(function(i, e){
//                         let rs = $(e).text()
//                         tableHeaders.push(rs)
//                     })
//                 }
//                 let td = $(element).find("td").find("span")
//                 let tableRow = {}
//                 $(td).each(function (i, ele) {
//                     tableRow[tableHeaders[i]] = $(ele).text();
//                 })
//                 data.push(tableRow)
//             });
//             let result = JSON.stringify(data)
//             res.status(200).json({
//                 data: JSON.parse(result)
//             })
//         }
//     });
// })
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
            res.status(200).json({
                status: "OK",
                data: result
            })
        }
    });
})

app.post('/profile', async function (req, res){
    let id = req.body.id;
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
                    "ctl00$ContentPlaceHolder1$ctl00$txtTaiKhoa":'K175520201095',
                    "ctl00$ContentPlaceHolder1$ctl00$txtMatKhau":'hienkeo1808',
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
                    "ctl00$ContentPlaceHolder1$ctl00$txtTaiKhoa":'K175520201095',
                    "ctl00$ContentPlaceHolder1$ctl00$txtMatKhau":'hienkeo1808',
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
app.listen(port, host, () => {
    console.log("Server running - port " + port);
});
