const url = "https://www.youtube.com/watch?v=ZxXI9xxVa3g";
fetch(url).then(r => r.text()).then(html => {
    const regexes = [
        /"lengthSeconds":"(\d+)"/,
        /\\"lengthSeconds\\":\\"(\d+)\\"/,
        /"lengthSeconds":(\d+)/,
        /lengthSeconds\\":\\"(\d+)\\"/
    ];

    for (const regex of regexes) {
        const match = html.match(regex);
        if (match && match[1]) {
            console.log("Matched regex:", regex, "value:", parseInt(match[1], 10));
            break;
        }
    }

    const metaMatch = html.match(/itemprop="duration" content="PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?"/);
    if (metaMatch) {
        const hours = parseInt(metaMatch[1] || '0', 10);
        const minutes = parseInt(metaMatch[2] || '0', 10);
        const seconds = parseInt(metaMatch[3] || '0', 10);
        console.log("Matched meta duration, value:", hours * 3600 + minutes * 60 + seconds);
    }
});
