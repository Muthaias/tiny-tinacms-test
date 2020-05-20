const fs = require("fs");
const fetch = require("node-fetch");

const imageUrls = [
    "https://images.unsplash.com/photo-1553531384-411a247ccd73",
    "https://images.unsplash.com/photo-1542359649-31e03cd4d909",
    "https://images.unsplash.com/photo-1515552726023-7125c8d07fb3",
    "https://images.unsplash.com/photo-1512036666432-2181c1f26420",
    "https://images.unsplash.com/photo-1521336575822-6da63fb45455",
    "https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81",
    "https://images.unsplash.com/photo-1547469447-4afec158715b",
    "https://images.unsplash.com/photo-1501555088652-021faa106b9b",
    "https://images.unsplash.com/photo-1587502624372-45627391a31f",
    "https://images.unsplash.com/photo-1510662145379-13537db782dc",
    "https://images.unsplash.com/photo-1504851149312-7a075b496cc7",
    "https://images.unsplash.com/photo-1527610276295-f4c1b38decc5",
    "https://images.unsplash.com/photo-1501761095094-94d36f57edbb",
    "https://images.unsplash.com/photo-1504598318550-17eba1008a68",
    "https://images.unsplash.com/photo-1499756630622-6a7fd76720ab",
    "https://images.unsplash.com/photo-1500964757637-c85e8a162699",
    "https://images.unsplash.com/photo-1482398650355-d4c6462afa0e",
    "https://images.unsplash.com/photo-1492133969098-09ba49699f47",
    "https://images.unsplash.com/photo-1495756650324-e45118cb3e35",
];

function htmlToMd(content) {
    content = content.replace(/\<h(\d)\>(.*?)\<\/h\d\>/g, (match, header, content) => {
        const headerType = parseInt(header);
        return "#".repeat(headerType) + " " + content;
    });
    content = content.replace(/<p>(.*?)<\/p>/g, (match, content) => {
        return content + "\n\n";
    });
    return content;
}

function firstHeader(content) {
    const match = content.match(/#+\s*(.+)/);
    return match ? match[1] : "No header";
}

async function getRandomContent() {
    try {
        const data = await fetch("https://loripsum.net/api/3/medium/headers");
        const text = await data.text();
        const content = htmlToMd(text);
        return content;
    } catch (e) {
        throw new Error("Could not get content!");
    }
}

function getRandomImage(option) {
    const optionQuery = option && Object.keys(option).map((key) => key + "=" + option[key]).join("&");
    const imageUrl = imageUrls[Math.floor((imageUrls.length - 1) * Math.random())];
    return imageUrl + (optionQuery ? "?" + optionQuery : "");
}

async function generateMockPosts(idPrefix = "post", numberOfPosts = 5) {
    const posts = [];
    for (let p = 0; p < numberOfPosts; p++) {
        const content = await getRandomContent();
        const secondaryContent = await getRandomContent();
        const title = firstHeader(content);
        const imageUrl = getRandomImage({
            auto: "format",
            fit: "crop",
            w: 1200,
            h: 300,
            q: 60,
        });
        const contentBlocks = [
            {
                name: "Title",
                type: "title",
                title: title,
                imageUrl: imageUrl,
            },
            {
                name: "Content",
                type: "text",
                text: content,
            },
            {
                name: "Gallery",
                type: "gallery",
                height: "150px",
                images: Array.from({length: 3}).map((_, index) => ({
                    title: "Image " + index,
                    imageUrl: getRandomImage({
                        auto: "format",
                        fit: "crop",
                        h: 150,
                        q: 60,
                    })
                }))
            },
            {
                name: "Secondary content",
                type: "text",
                text: secondaryContent,
            },
        ];
        posts.push({
            id: idPrefix + "_" + p,
            title,
            contentBlocks,
            author: "",
        });
    }
    return posts;
}

async function saveMockData() {
    try {
        const posts = await generateMockPosts();
        const pages = await generateMockPosts("page");
        const menus = [
            {
                "name": "Main",
                "entries": pages.map(page => ({
                    name: page.title.split(" ").slice(0,3).join(" "),
                    key: page.id,
                    link: "/page/" + page.id,
                })),
                "tags": [],
                "id": "_menu:mainmenu",
                "index": 0
            }
        ];
        const authors = [];
        const data = {
            posts,
            pages,
            menus,
            authors,
        }
        fs.writeFileSync("./data/data.json", JSON.stringify(data, undefined, "    "))
    } catch (e) {
        console.log(e.message);
    }
}

saveMockData();