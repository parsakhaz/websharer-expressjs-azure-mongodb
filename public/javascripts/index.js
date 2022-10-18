
async function previewUrl() {
    let url = document.getElementById("urlInput").value;
    try {
        let response = await fetch("api/v1/urls/preview?url=" + url).catch(err => displayPreviews('fetch error: ' + err))
        if (!response.ok) {
            throw new Error("error: " + response.status)
        }
        let previewText = await response.text().catch(err => displayPreviews('response error: ' + err))
        console.log(previewText)
        displayPreviews(previewText)
    } catch (err) {
        displayPreviews('caught error: ' + err)
    }
}


function displayPreviews(previewHTML) {
    document.getElementById("url_previews").innerHTML = previewHTML;
}
