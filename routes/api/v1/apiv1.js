import express from 'express';
import fetch from 'node-fetch';
import parser from 'node-html-parser'
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res) {
  res.send('respond with a resource');
});

router.get('/urls/preview', async function (req, res) {
  let url = req.query.url
  let response = await fetch(url).catch(err => displayPreviews('fetch error: ' + err))
  let pageText = await response.text().catch(err => displayPreviews('parser error: ' + err))
  let htmlPage = parser.parse(pageText)
  let htmlReturn = ""
  htmlReturn += `
  <br/><div style="max-width: 400px; border: solid 1px; text-align: center;"> `

  let OGurlElement = htmlPage.querySelector('[property="og:url"]')
  const OGurl = OGurlElement ? OGurlElement.getAttribute('content') : url
  OGurl ? htmlReturn += '<a href="' + OGurl + '">' : null

  let titleElement = htmlPage.querySelector('[property="og:title"]')
  let titleContent = titleElement ? titleElement.getAttribute('content') : null
  let titleElementFallback = htmlPage.querySelector('title')
  let titleElementText = titleElementFallback ? htmlPage.querySelector('title').textContent : null
  let title = ''
  if (titleContent != null || '') {
    title = titleContent
  } else if (titleElementText != null || '') {
    title = titleElementText
  } else {
    title = url
  }
  title ? htmlReturn += '<p><strong>' + title + '</strong></p>' : null

  let imageElement = htmlPage.querySelector('[property="og:image"]')
  const image = imageElement ? imageElement.getAttribute('content') : ''
  image ? htmlReturn += '<img src="' + image + '" style="max-height: 300px; max-width: 270px;">' : null

  htmlReturn += '</a>'

  let descriptionElement = htmlPage.querySelector('[property="og:description"]')
  const description = descriptionElement ? descriptionElement.getAttribute('content') : null
  description ? htmlReturn += '<p>' + description + '</p>' : null

  let bootstrapElements = htmlPage.querySelectorAll("link")
  let hasBootstrap = false;
  let bootstrap = null
  for (let i = 0; i < bootstrapElements.length; i++) {
    if (bootstrapElements[i].getAttribute('href').includes('css/bootstrap')) {
      hasBootstrap = true
      bootstrap = "<p>Website utilizes bootstrap: " + hasBootstrap + "</p>"
    }
  }
  hasBootstrap ? htmlReturn += bootstrap : null
  htmlReturn += '</div>'

  console.log(htmlReturn)
  res.type("html")
  res.send(htmlReturn)
});

export default router;
