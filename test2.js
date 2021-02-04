
const express = require('express'); 
const puppeteer = require('puppeteer')
require('dotenv').config()
const axios = require('axios');
var fs = require("fs")
const app = express();


// app.get('/', function (req, res) {
//    res.send(process.env.EMAIL)
// })

app.post('/', function (req, res) {

  let autoLogin = async() => {
    
        axios.get('https://10minutemail.net/address.api.php')
        .then(async function (response) {
            // handle success
            let mail  = response.data.mail_get_mail
            let link  = response.data.permalink.url
            let key  = response.data.permalink.key

            console.log(mail)
            const browser = await puppeteer.launch({
                headless: false,
            })
            const page = await browser.newPage()
            await page.goto('https://workshop.simsimi.com/en/login')
            
            await page.evaluate(() => {
                let elements = document.getElementsByClassName('_2B0VZ_t8');
                elements[1].click()
            });
            await page.click("input[type='email']")
            await page.keyboard.type(mail)

            await page.click("input[type='password']")
            await page.keyboard.type("11111111")

            await page.click("button[type='submit']")

            const page2 = await browser.newPage()
            await page2.goto(link)
            await page2.click("input[name='key']")
            await page2.keyboard.type(key)
            await page2.click("input[type='submit']")
            const getData = async() => {
                return await page2.evaluate(async () => {
                    return await new Promise(resolve => {
                        setTimeout(() => {
                            fetch('https://10minutemail.net/mailbox.ajax.php')
                            .then(response => response.text())
                            .then(data => {
                                link2 = "https://10minutemail.net/"+(data.match(/<a href='(.+?)'/i)[1]);
                                resolve(link2)
                            });
                        }, 3000)
                    })
                })
              } 
            await page2.waitForTimeout(3000);
            let link2 =await getData()
            
            const page3 = await browser.newPage()
            await page3.goto(link2)
            
            const getData2 = async() => {
                return await page3.evaluate(async () => {
                    return await new Promise(resolve => {
                        setTimeout(() => {
                            let link3 = document.evaluate("/html/body/div[1]/div[4]/div/div/div[4]/div/p[3]/a/text()", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent 
                            const regex = /"(.+?)"/gm;
                            console.log(link3.replaceAll(regex, '')) 
                            window.open(link3.replaceAll(regex, ''))
                            resolve()
                        }, 3000)
                        
                    })
                })
            } 
            let link4 =await getData2()
            const page4 = await browser.newPage()
            await page4.goto('https://workshop.simsimi.com/en/login')
            await page4.click("input[type='email']")
            await page4.keyboard.type(mail)

            await page4.click("input[type='password']")
            await page4.keyboard.type("11111111")

await page4.click("button[type='submit']")
            await page4.waitForNavigation()
            await page4.waitForTimeout(3000);
            // await page4.click("#usename")
            const elements = await page4.$x('/html/body/div[1]/div/div[2]/div/div/form/div[1]/div[3]/input')
            await elements[0].click() 
            await page4.keyboard.type("123123")
            const elements1 = await page4.$x('/html/body/div[1]/div/div[2]/div/div/form/div[2]/div[1]/input') 
            await elements1[0].click() 
            await page4.keyboard.type("123123")

            const elements2 = await page4.$x('/html/body/div[1]/div/div[2]/div/div/form/div[2]/div[2]/div/div/button')
            await elements2[0].click()  
            const elements3 = await page4.$x('/html/body/div[1]/div/div[2]/div/div/form/div[2]/div[2]/div/div/ul/li[1]/span/span')
            await elements3[0].click() 
            
            await page4.select('#industryCategory', 'ic_gaming')
            await page4.select('#organizationSize', 'os_19')
            await page4.select('#jobRole', 'jr_academic')
            await page4.select('#devSkill', 'ed_c1')
            await page4.select('#platform', 'ep_c1')
            const elements4 = await page4.$x('/html/body/div[1]/div/div[2]/div/div/form/button')
            await elements4[0].click() 
            await page4.waitForTimeout(5000);

            const elements5 = await page4.$x('/html/body/div[1]/div/div[2]/div/div[1]/div/div[2]/label/span')
            await elements5[0].click() 
            
            const inner_html = await page4.$eval("._1byA3pNg", e => e.innerHTML);
            fs.appendFile('input.txt', inner_html, function (err) {});
        })
    }
    
  
})
// app.post('/rep', function (req, res) {
//   // var myHeaders = new fetch.Headers();
//   // myHeaders.append("Host", "www.simsimi.com");
//   // myHeaders.append("Connection", "keep-alive");
//   // myHeaders.append("Accept", "application/json, text/plain, */");
//   // myHeaders.append("sec-ch-ua-mobile", "?0");
//   // myHeaders.append("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36");
//   // myHeaders.append("Sec-Fetch-Site", "same-origin");
//   // myHeaders.append("Sec-Fetch-Mode", "cors");
//   // myHeaders.append("Sec-Fetch-Dest", "empty");
//   // myHeaders.append("Referer", "https://www.simsimi.com/chat");
//   // myHeaders.append("Accept-Encoding", "gzip, deflate, br");
//   // myHeaders.append("Accept-Language", "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5");
//   // myHeaders.append("Cookie", "i18n_redirected=fr; dotcom_session_key=s%3AcHFSn6BOLEZYsAmcy4LSBzJBjItBWqI-.DsLPh7toYC8sLsAUtY8c6MiJsonyJ9XUOmoFQykgf%2FE; languageCode=vn");

//   // var requestOptions = {
//   //   method: 'GET',
//   //   headers: myHeaders,
//   //   redirect: 'follow'
//   // };

//   // return fetch(`https://www.simsimi.com/api/chats?lc=vn&ft=1&normalProb=2&reqText=123&talkCnt=0`, requestOptions)
//   // .then(response => response.text())
//   // .then(result => {
//   //   console.log(result)
//   // })
//   // .catch(error => console.log('error', error));
  
//   const options = {
//     url: 'https://www.simsimi.com/api/chats?lc=vn&ft=1&normalProb=2&reqText=123&talkCnt=0',
//     headers: {
//       'Host': 'www.simsimi.com',
//       'Connection' :'keep-alive',
//       'Accept' :'application/json, text/plain, */',
//       'sec-ch-ua-mobile' :'?0',
//       'User-Agent' :'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36',
//       'Sec-Fetch-Site' :'same-origin',
//       'Sec-Fetch-Mode' :'cors',
//       'Sec-Fetch-Dest' :'empty',
//       'Referer' :'https://www.simsimi.com/chat',
//       'Accept-Encoding' :'gzip, deflate, br',
//       'Accept-Language' :'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',

//       'Cookie' :"_gid=GA1.2.180844490.1611199902; _ga=GA1.2.1132711408.1611199902; dotcom_session_key=s%3ARyw51cbZIF_u1WnueaF6ae9F_J2BHs9W.gV%2FnuVKJORzOet5GaULBXFbeauZd2%2FFNUHmGnBIwi6k; _gat=1; i18n_redirected=en;"
//     }
//     };
     
//     function callback(error, response, body) {
//     console.log(body);
//     }
     
//     request(options, callback);
// })
app.listen(200);