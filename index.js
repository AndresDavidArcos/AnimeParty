const d = document;
let animeUrl = "",
videoFounded = false;

const currentUrl = window.location.href;
const verifyUrl = "https://www3.animeflv.net/ver/";

if (window.frameElement === null && currentUrl.startsWith(verifyUrl)) {
    animeUrl = currentUrl;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    //chatView insert
    const $chatIframe = d.createElement('iframe');
    $chatIframe.src = chrome.runtime.getURL('chatView.html');
    $chatIframe.style.width = `${viewportWidth * 0.2}px`;
    $chatIframe.style.height = `${viewportHeight * 0.7}px`;
    $chatIframe.style.position = 'absolute';
    $chatIframe.style.top = '100px';
    $chatIframe.style.right = '-100px';    
    const $animeNews = d.querySelector(".CpCnC"); 
    $animeNews.style.top = "700px"
    $animeNews.insertAdjacentElement('beforebegin', $chatIframe);

    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
        console.log("mensaje recibido en index.js: ", msg)
        switch (msg.type) {
            case "urlRequest":
                sendResponse(animeUrl);
                break;

            default:
                break;
        }
    })

} 


d.querySelectorAll("video").forEach((item) => {
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
        switch (msg.type) {
            case "videoRequest":
                const videoProviderServer = new URL(new URL(item.src).origin).hostname;
                let videoProvider = "";
                switch (videoProviderServer) {
                    case "vidcache.net":
                        videoProvider = "YourUpload";
                        break;
                    case "streamwish.to":
                        videoProvider = "SW";
                        break;                        
                
                    default:
                        break;
                }
                sendResponse(videoProvider);
                break;
        
            default:
                break;
        }
    })
    item.addEventListener("play", function() {
        chrome.runtime.sendMessage({ type: "playback", state: "play" });
    });
        
    item.addEventListener("pause", function() {
        chrome.runtime.sendMessage({ type: "playback", state: "pause" });
     });
        
     item.addEventListener("seeked", function() {
        chrome.runtime.sendMessage({ type: "videoTimeChange", time: item.currentTime });
  });   
});

