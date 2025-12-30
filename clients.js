const clientImages = [
    "client1.jpg",
    "client2.jpg",
    "client3.jpg",
    "client4.jpg",
    "client5.jpg",
    "client1.jpg"
];

document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('.client-img img');
    
    images.forEach((img, index) => {
        if (clientImages[index]) {
            img.src = clientImages[index];
            img.onload = () => { img.alt = "Partner Avatar"; }; 
        }
    });
});