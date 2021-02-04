const request = require("request-promise");
const cheerio = require("cheerio");
 
async function main() {
 const result = await request.get("http://codingwithstefan.com/table-example");
 const $ = cheerio.load(result);
 const scrapedData = [];
 const tableHeaders = [];
 $("body > table > tbody > tr").each((index, element) => {
   if (index === 0) {
     const ths = $(element).find("th");
     $(ths).each((i, element) => {
       tableHeaders.push(
         $(element)
           .text()
           .toLowerCase()
       );
     });
     return true;
   }
   const tds = $(element).find("td");
   const tableRow = {};
   $(tds).each((i, element) => {
     tableRow[tableHeaders[i]] = $(element).text();
   });
   scrapedData.push(tableRow);
 });
 console.log(scrapedData);
}
 
main();