

export function getLivephoto() {
    document.querySelectorAll("thyuu-livephoto").forEach((element) => {
        const photoUrl = element.getAttribute("photo-url");
        const videoUrl = element.getAttribute("video-url");
        const photoArn = element.getAttribute("photo-arn");
        var livephoto = `<thyuu-embed class="thyuu-noone thyuu-icon-image">链接不存在<thyuu-embed>`
        if (photoUrl && videoUrl) {
            livephoto = `
             <thyuu-embed 
             class="thyuu-livephoto">
             <div data-live-photo 
                 data-photo-src="${photoUrl}" 
                 data-video-src="${videoUrl}" 
                 style="aspect-ratio: ${photoArn}"></div></thyuu-embed>
            `;
        }
        element.insertAdjacentHTML('afterend', livephoto);
        element.remove();
    });

}