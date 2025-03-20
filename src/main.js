import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

// // Global nesnesi yoksa, window nesnesini global olarak tanımlarız 
// if (typeof global === 'undefined') {
//     window.global = window;
// }

const API_KEY = "49387941-e00fdaa64f5dbf31f27188f8a"; // pixabay API anahtarı

const form = document.querySelector("form");
const gallery = document.getElementById("gallery");
const loader = document.querySelector(".loader");

form.addEventListener("submit", (event) => {
    event.preventDefault();

    loader.style.display = 'inline';

    // kullanıcının aradığı kelimeyi alıyoruz
    let word = document.getElementById("form-input").value.trim();

    // girilen bir kelime yoksa, hata mesajı gösteriyoruz
    if (word === "") {
        loader.style.display = 'none';
        iziToast.warning({
            title: 'Caution',
            message: 'The input field cannot be empty. Enter word!',
        });
        return; // uyarı mesajını gösterdikten sonra fonksiyonu durduruyoruz.
    }

    // pixabay API'si için URL'yi oluşturuyoruz
    // URL'lerde boşluk veya özel karakterler içeren bir değer gönderdiğinde sorun çıkabilir. bunun için encodeURIComponent kullanıyoruz. (genel bir js fonksiyonudur)
    const url = `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(word)}&image_type=photo&orientation=horizontal&safesearch=true`;

    gallery.innerHTML = ""; // önceki sonuçları temizliyoruz

    fetch(url)
        .then(response => response.json()) // yanıtı json formatında alıyoruz.
        .then(data => {
            loader.style.display = 'none';

            if (data.hits.length === 0) {
                iziToast.error({
                    title: 'Error',
                    message: 'Sorry, there are no images matching your search query. Please try again!',
                }); // kullanıcının aradığı kelimeye karşılık görsel yoksa hata mesajı gösteriliyor
            } else {
                // her bir resmin görünmesi için döngü başlatıyoruz
                data.hits.forEach(image => {
                    // her resim için kart oluşturma
                    const card = document.createElement("a");
                    card.href = image.largeImageURL;
                    card.classList.add("gallery-item");

                    const img = document.createElement("img");
                    img.src = image.webformatURL;
                    img.alt = image.tags;
                    card.appendChild(img);

                    // resim bilgilerini içeren div oluşturuyoruz.
                    const info = document.createElement("div");
                    info.classList.add("gallery-info");
                    info.innerHTML = `
                    <ul class="info-ul">
                    <li class="info-li">Likes ${image.likes}</li>
                    <li class="info-li">Views ${image.views}</li>
                    <li class="info-li">Comments ${image.comments}</li>
                    <li class="info-li">Downloads ${image.downloads}</li>
                    </ul>`;

                    card.appendChild(info);
                    gallery.appendChild(card);
                });

                // SimpleLightbox'ı başlat
                const lightbox = new SimpleLightbox(".gallery-item", {
                    captions: true,
                    captionsData: "alt",
                    captionDelay: 250,
                });

                // Lightbox'ı yeniden başlatıyoruz
                lightbox.refresh();
            }
        })
        .catch(error => {
            console.error("Hata:", error);
            iziToast.error({
                title: 'Hata',
                message: "Bir hata oluştu. Lütfen daha sonra tekrar deneyin!", // API çağrısı sırasında hata olursa (fetch işlemi sırasında)
            });
        });
})


