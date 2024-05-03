# codelist.cc-Scraper
Scraping from site codelist.cc and auto Post to Wordpress 


DEMO : https://imutasi.com


# Requirements 

you must install plugin `WordPress REST API Authentication` and create JWT Authetication


Link : https://wordpress.org/plugins/wp-rest-api-authentication/


# Running 

change `config.ts` 

```javascript
module.exports = {
    Authorization_Key: "", // this is from WordPress REST API Authentication` and create Basic Authetication
    siteUrl: "https://nulled.imtaqin.id", // your wp site
    howManyPages: 1, // how many pages that you will scrape , 1 is mean just 1 page
    safeLinks: true, // set true to use safelink api
    safeLinkUrlApi: "https://safelink?api=apikey&url=",
};
```
Install dependencies :

```bash
npm install
```

run with tsx

```bash
npx tsx main.ts
```


### NOTE : 

This is completly free script, and educational purpose only, i wrote this code in my freetime

feel free to contribute