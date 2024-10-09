javascript: (async function () {
    function createPopup() {
        const popup = document.createElement("div");
        popup.style.position = "fixed";
        popup.style.top = "50%";
        popup.style.left = "50%";
        popup.style.transform = "translate(-50%, -50%)";
        popup.style.backgroundColor = "white";
        popup.style.border = "1px solid black";
        popup.style.padding = "20px";
        popup.style.zIndex = "10000";

        const select = document.createElement("select");
        const options = [10, 20, 50, 100];
        options.forEach(optionValue => {
            const option = document.createElement("option");
            option.value = optionValue;
            option.textContent = optionValue;
            select.appendChild(option);
        });
        popup.appendChild(select);

        const button = document.createElement("button");
        button.textContent = "Lancer le scraping";
        
        button.onclick = async function () {
            const n = parseInt(select.value, 10);
            const data = await scrape(n);
            toCSV(data)
            document.body.removeChild(popup);
        };

        popup.appendChild(button);
        document.body.appendChild(popup);
    }

    async function moreResult(){
        const button = document.getElementById('more-results');
        if (button) {
            button.click();
        } else {
            console.log("No button");
        }
    }

    async function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function scrape(n) {
        let results = [];
        var scrap = document.querySelectorAll('li[data-layout="organic"] article');
        while(scrap.length < n){
            await moreResult();
            await wait(2000);
            var scrap = document.querySelectorAll('li[data-layout="organic"] article');
        }
        console.log(scrap.length);
        scrap.forEach(function(ele) {
            let titleElement = ele.querySelector('h2 a');
            let title = titleElement ? titleElement.textContent : null;

            let link = titleElement ? titleElement.href : null;

            let descriptionElement = ele.querySelector('article>div>div>div>span');
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

    async function toCSV(data) {
        const csvText = "Title,Link,Description\n" +
        data.map(e => `"${e.title ? e.title.replace(/"/g, '""') : ''}","${e.link ? e.link.replace(/"/g, '""') : ''}","${e.description ? e.description.replace(/"/g, '""') : ''}"`).join("\n");

        const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvText);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "results.csv");
        document.body.appendChild(link);

        link.click();
        document.body.removeChild(link);
    }

    createPopup();

});