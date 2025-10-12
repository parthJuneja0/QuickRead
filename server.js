const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// POST endpoint to fetch news
app.post("/fetch-news", async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }

    try {
        // Launch puppeteer
        const browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: "domcontentloaded" });

        // Extract news details (generic selectors)
        const newsData = await page.evaluate(() => {
            const title = document.querySelector("h1")?.innerText || null;
            const author =
                document.querySelector("[rel='author']")?.innerText ||
                document.querySelector(".author")?.innerText ||
                null;
            const date =
                document.querySelector("time")?.getAttribute("datetime") ||
                document.querySelector(".date")?.innerText ||
                null;

            // Combine all paragraphs
            const content = Array.from(document.querySelectorAll("p"))
                .map(p => p.innerText)
                .join("\n\n");

            return { title, author, date, content };
        });

        await browser.close();

        res.json(newsData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch news" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
