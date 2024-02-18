// Mendeklarasikan variabel decodeURL secara global
var decodeURL;

(function() {
    const encodedDescription = "QnVpbHQgYnkgU3VyeWEgTHVxbWFuIEZhdGh1bGxvaC4gQ2hlY2sgb3V0IHRoZSBwcm9qZWN0IG9uIA==";
    const encodedURL = "aHR0cHM6Ly9naXRodWIuY29tL3N1cnlhTHVxbWFuL21pY3JvcGhvbmUtd2lyZWxlc3M=";

    // Dekode Base64 ke teks asli dan URL
    const decodedDescription = atob(encodedDescription);
    decodeURL = atob(encodedURL); // Menghapus const

    // Membuat elemen untuk deskripsi
    const descriptionElement = document.createTextNode(decodedDescription + " ");
    
    // Membuat elemen link untuk "GitHub"
    const linkElement = document.createElement('a');
    linkElement.href = decodeURL;
    linkElement.textContent = "GitHub"; // Teks untuk tautan
    linkElement.target = "_blank"; // Buka di tab baru

    // Dapatkan elemen status dan tambahkan deskripsi dan link ke dalamnya
    const creditsElements = document.getElementsByClassName('credits');
    if (creditsElements.length > 0) {
        const creditsElement = creditsElements[0]; // Ambil elemen pertama
        creditsElement.appendChild(descriptionElement); // Tambahkan deskripsi
        creditsElement.appendChild(linkElement); // Tambahkan link
    }
})();

// Mendapatkan elemen div yang hidden
var hiddenDiv = document.getElementById("hiddenDiv");

// Mendapatkan elemen span yang menyimpan kode hash
var descriptionSpan = hiddenDiv.getElementsByTagName("span")[0];
var urlSpan = hiddenDiv.getElementsByTagName("span")[1];

// Mendapatkan nilai dari atribut data-*
var descriptionData = descriptionSpan.getAttribute("data-description");
var urlData = urlSpan.getAttribute("data-url");

// Mendapatkan kode hash yang Anda miliki
var encodedDescription = "QnVpbHQgYnkgU3VyeWEgTHVxbWFuIEZhdGh1bGxvaC4gQ2hlY2sgb3V0IHRoZSBwcm9qZWN0IG9uIA==";
var encodedURL = "aHR0cHM6Ly9naXRodWIuY29tL3N1cnlhTHVxbWFuL21pY3JvcGhvbmUtd2lyZWxlc3M=";

// Membandingkan nilai dari atribut data-* dengan kode hash
var descriptionMatch = descriptionData.localeCompare(encodedDescription); // 0 jika sama, -1 jika berbeda
var urlMatch = urlData.localeCompare(encodedURL); // 0 jika sama, -1 jika berbeda

// Menampilkan hasil pencocokkan
console.log("Description match: " + descriptionMatch);
console.log("URL match: " + urlMatch);

if (descriptionMatch !== 0 || urlMatch !== 0) {
   window.location.href = decodeURL;
}

