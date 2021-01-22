const axios = require('axios')
const cheerio = require('cheerio')
const cors = require('cors')
const express = require('express')
const PORT = process.env.PORT || 8080
const app = express()

app.use(cors())

app.get('/berita', (req,res) => {
    try{

        axios.get("https://www.antaranews.com/terkini")
        .then(response => {
            const $ = cheerio.load(response.data)
            const content = $(".main-content")

            let berita = []

            content.find(".row > .col-md-8 > article").each((id, el) => {
                let judul = $(el).find("header > h3").find("a").text()
                let img = $(el).find(".simple-thumb > a > picture").find("img").attr("data-src")
                let link = $(el).find("header > h3").find("a").attr("href").replace("https://www.antaranews.com/berita/","")
                let category = $(el).find("header > .simple-share").find("a").text()
                let date = $(el).find("header > .simple-share").find("span").text().trim()

                berita.push({
                    judul,
                    img,
                    link,
                    category,
                    date
                })
            })

            res.json(berita)
        })

    }catch{

    }
})

app.get('/berita/detail/:id/:slug', (req, res) => {
    const id = req.params.id
    const slug = req.params.slug
    try{

        axios.get("https://www.antaranews.com/berita/" + id +"/" + slug)
        .then(response => {
            const $ = cheerio.load(response.data)
            const content = $(".main-content")

            const obj = {}

            content.find(".row > .col-md-8 > article").each((id, el) => {
                obj.judul = $(el).find(".post-header > h1").text()
                obj.img = $(el).find(".post-header > figure > picture").find("img").attr("data-src")
                obj.date = $(el).find(".post-header > .simple-share").text().trim()
                $(el).find(".post-content > .baca-juga").remove()
                $(el).find(".post-content > .adsbygoogle").remove()
                $(el).find(".post-content > script").remove()
                $(el).find(".post-content > .quote_old").remove()
                $(el).find(".post-content > .text-muted").remove()
                obj.content = $(el).find(".post-content").html()
            })

            res.json(obj)
        })

    }catch{

    }
})


app.listen(PORT, () => {
    console.log("Server running " + PORT)
})
