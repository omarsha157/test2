const linkExpiredMessage = document.querySelector('.link-expired')
const swipeUpContainer = document.querySelector('.swipe-up-container')

const carLogo = document.querySelector('.car-logo')
const carLogoImg = document.querySelector('.car-logo img')
const mainContent = document.querySelector('.main-content')
const customerName = document.querySelector('.customer-name')
const video = document.querySelector('#myVideo')
const brand = document.querySelector('.brand-out')
const model = document.querySelector('.model-out')
const chassisNo = document.querySelector('.chassis-out')
const advisorName = document.querySelector('.advisor')
const advisorPhone = document.querySelector('.advisor-phone')
const advisorWhatsapp = document.querySelector('.advisor-whatsapp')
const advisorMail = document.querySelector('.advisor-mail')

const videoOut = document.querySelector('.video-out')

const copyrightYear = document.querySelector('.curr-year')

const date = new Date()
const currYear = date.getFullYear()

let isEnded = false;

const tl = gsap.timeline({ duration: 0.3 })

copyrightYear.innerText = currYear

 //video.addEventListener('ended', () => {
  // video.classList.add('low-opacity') 
 //})
 //video.addEventListener('play', () => {
    // video.classList.remove('low-opacity')
 //})

function decodeURL(url) {
    let decodedString = decodeURIComponent(url);

    return decodedString;
}

carObj = {
    "ASTON MARTIN": "./assets/car/aston_martin.png",
    "AUDI": "./assets/car/audi.png",
    "BENTLEY": "./assets/car/bentley.png",
    "BMW": "./assets/car/bmw.png",
    "FERRARI": "./assets/car/ferrari.png",
    "JAGUAR": "./assets/car/jaguar.png",
    "LAMBORGHINI": "./assets/car/lamborghini.png",
    "RANGE ROVER": "./assets/car/land_rover.png",
    "LAND ROVER": "./assets/car/land_rover.png",
    "Lotus": "./assets/car/lotus.png",
    "MASERATI": "./assets/car/maserati.png",
    "MAYBACH": "./assets/car/maybach.png",
    "MERCEDES BENZ": "./assets/car/mercedes_benz.png",
    "MINI COOPER-A": "./assets/car/mini_cooper.png",
    "PORSCHE": "./assets/car/porsche.png",
    "ROLLS ROYCE": "./assets/car/rolls_royce.png",
    "SKODA": "./assets/car/skoda.png",
    "SMART": "./assets/car/smart.png",
    "VOLKSWAGEN": "./assets/car/volkswagen.png",
    "Empty": "./assets/Empty.png"
}

const sortByDate = (a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);

    return dateB - dateA;
}

window.onload = async () => {

    const encodedUrl = new URL(window.location.href);
    // let param = encodedUrl.searchParams.get('vId');
    let decodedParam = decodeURL('U2FsdGVkX19WuianMXpl9yhDD0vrV2HJTo%2FOKwX%2BIXY%3D')


    // ? decrypting logic
    let key = "s&a8Q!q#24f@L7oR";
    let decryptedVideoId = await CryptoJS.AES.decrypt(decodedParam, key).toString(CryptoJS.enc.Utf8)

    // console.log(decryptedVideoId);

    try {

        fetch(`https://geapps.germanexperts.ae:7007/api/findBygevideoId/${decryptedVideoId}`, {
            headers: {
                apiKey: 'a4db08b7-5729-4ba9-8c08-f2df493465a1'
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json()
            })
            .then(data => {
                let jrn = data[0].jobrequestid

                fetch(`https://geapps.germanexperts.ae:7007/api/findBygeJobReqId/${jrn}`, {
                    headers: {
                        apiKey: 'a4db08b7-5729-4ba9-8c08-f2df493465a1'
                    }
                })
                    .then(res => {
                        if (!res.ok) {
                            throw new Error(`HTTP error! Status: ${res.status}`);
                        }
                        return res.json()
                    })
                    .then(resData => {

                        let data = resData
                        data.sort(sortByDate)

                        let videoOutHtml = ''

                        data.forEach((record, index) => {
                            if (index == 0) {
                                videoOutHtml += `
                                    <div class="each-video active" data-video-src="${record.videolink}" data-video-id="${record.videoid}">
                                        <p class="video-date">${record.created_at.slice(0, 10).split("-").reverse().join("-")}</p>
                                        <img src="./assets/GE play icon dark.png" alt="">
                                        <p class="video-name">${record.videopath.split('/')[1].slice(0, 25) + '...'}</p>
                                    </div>
                                `
                            } else {
                                videoOutHtml += `
                                    <div class="each-video" data-video-src="${record.videolink}" data-video-id="${record.videoid}">
                                        <p class="video-date">${record.created_at.slice(0, 10).split("-").reverse().join("-")}</p>
                                        <img src="./assets/GE play icon dark.png" alt="">
                                        <p class="video-name">${record.videopath.split('/')[1].slice(0, 25) + '...'}</p>
                                    </div>
                                `
                            }
                        })

                        videoOut.innerHTML = videoOutHtml

                        videoSelectLogic()


                        let createdDate = data[0].created_at

                        const providedDate = new Date(createdDate);
                        const currentDate = new Date();

                        const timeDifference = currentDate.getTime() - providedDate.getTime();
                        const daysDifference = Math.round(timeDifference / (1000 * 60 * 60 * 24))
                        // console.log(daysDifference);

                        if (daysDifference >= 45) {
                            carLogo.classList.add('hide')
                            mainContent.classList.add('hide')
                            linkExpiredMessage.classList.remove('hide')
                            return
                        } else {
                            linkExpiredMessage.classList.add('hide')

                            video.src = data[0].videolink
                            video.dataset.videoId = data[0].videoid

                            customerName.innerText = data[0].customername ? data[0].customername : "Client"
                            carLogoImg.src = carObj[data[0].brand] ? carObj[data[0].brand] : carObj["Empty"]
                            brand.innerText = data[0].brand
                            model.innerText = data[0].model
                            chassisNo.innerText = data[0].chasis
                            advisorName.innerText = data[0].generatedby
                            advisorPhone.href = data[0].callus ? `tel:+971${data[0].callus}` : ''
                            advisorWhatsapp.href = data[0].whatsapp ? `https://api.whatsapp.com/send?phone=971${data[0].whatsapp}` : ''
                            advisorMail.href = data[0].mailus ? `mailto:${data[0].mailus}` : ''

                            carLogo.classList.remove('hide')
                            mainContent.classList.remove('hide')

                            updateViewCount()

                        }

                    })
                    .catch(error => {
                        console.log(error);
                    })

            })
            .catch(error => {
                console.log(error);
            })
    } catch (error) {
        console.log(error);
    }

}

// ? scroll up and down

function scrollUpAndDown() {
    window.scrollBy(0, 150);

    setTimeout(() => {
        window.scrollBy(0, -150);
        setTimeout(() => {
            checkScroll()
        }, 400);
        
    }, 800);
}

setTimeout(() => {
    scrollUpAndDown()
}, 2000);




function scrollToTop() {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
}

function videoSelectLogic() {
    const allVideoDivs = document.querySelectorAll('.each-video')

    allVideoDivs.forEach(videoDiv => {

        videoDiv.addEventListener('click', () => {

            allVideoDivs.forEach(videoDiv => {
                videoDiv.classList.remove('active')
            })

            videoDiv.classList.add('active')
            video.src = videoDiv.dataset.videoSrc
            video.dataset.videoId = videoDiv.dataset.videoId
          //  video.play()
            updateViewCount()

            scrollToTop()
        })
    })
}

video.addEventListener('ended', function () {
    isEnded = true;
});

video.addEventListener('click', function () {
    if (isEnded) {
        isEnded = false;
        updateViewCount()
    }
});


function updateViewCount() {
    try {
        fetch(`https://geapps.germanexperts.ae:7007/api/updategevideoviewincrease/${video.dataset.videoId}`, {
            headers: {
                apiKey: 'a4db08b7-5729-4ba9-8c08-f2df493465a1'
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json()
            })
            .catch(error => {
                console.log(error);
            })
    } catch (error) {
        console.log(error)
    }

}

// ? check if user has scrolled

function checkScroll() {
    window.addEventListener('scroll', () => {
        swipeUpContainer.classList.add('hide')
    })
}


tl.from('.nav', { y: '-100%' })
tl.from('.main-content-wrapper', { x: '-100%' })
tl.from('.title', { x: '-100%' }, '<0')
tl.from('.footer', { y: '110%' })

// For autoplay in android only.
function isAppleDevice() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return true;
    }

    if (/Macintosh|MacIntel|MacPPC|Mac68K/.test(userAgent)) {
        return true;
    }

    return false;
}

if (isAppleDevice()) {
    video.removeAttribute('autoplay');
} else {
    // video.setAttribute('autoplay', '');

    video.addEventListener('ended', () => {
        video.classList.add('low-opacity')
    })
    
    video.addEventListener('play', () => {
        video.classList.remove('low-opacity')
    })
}