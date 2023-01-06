async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}
function exporter() {
	var list = document.querySelectorAll('ytd-playlist-video-renderer')
	var result = 'title,channel,info'

	for (let i = 0; i < list.length; i++) {
		try {
			const item = list[i]
			const title = item.querySelector('#video-title').innerText
			result += `\n${title}`
			const channel_name = item.querySelector('#channel-name').querySelector('a').innerText
			result += `,${channel_name}`
			const info = [...item.querySelector('#video-info').children].map((element) => element.innerText).join('')
			result += `,${info}`
		} catch (err) {
			result += `,error: ${JSON.stringify(err)}`
		}
	}
	return result
}
function getTitle() {
  return document.title;
}
const btn = document.getElementById('changeColor')
btn.onclick = async function() {
	const tab = await getCurrentTab()
	if (tab) {
		chrome.scripting.executeScript({
			func: exporter,
			target: {tabId: tab.id}
		}, (results) => {
			console.log('results', results)
			const data = results[0].result
			var blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
			var url = URL.createObjectURL(blob);

			// Create a link to download it
			var pom = document.createElement('a');
			pom.href = url;
			pom.setAttribute('download', `${tab.title}.csv`);
			pom.click();
		})
	}
}