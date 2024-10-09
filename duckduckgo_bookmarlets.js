javascript: (async function () {
    async function scrape() {
        let results = [];
        var scrap = document.querySelectorAll('li[data-layout="organic"] article')
        scrap.forEach(function(ele) {
            let titleElement = ele.querySelector('h2 a');
            let title = titleElement ? titleElement.textContent : null;

            let link = titleElement ? titleElement.href : null;

            let descriptionElement = ele.querySelector('article>div>div>div>span');
            console.log(descriptionElement);
            let description = descriptionElement ? descriptionElement.textContent : null;

            results.push({
                title: title,
                link: link,
                description: description
            })
        });

        console.log(results);
        return results;
    }

    const data = await scrape();

    const csvText = "Title,Link,Description\n" +
        data.map(e => `"${e.title ? e.title.replace(/"/g, '""') : ''}","${e.link ? e.link.replace(/"/g, '""') : ''}","${e.description ? e.description.replace(/"/g, '""') : ''}"`).join("\n");

    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvText);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "results.csv");
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);


});