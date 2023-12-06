const burger = document.querySelector('.burger');
const menu = document.querySelector('.menu');

function toggleMenu() {
    burger.classList.toggle('open');
    menu.classList.toggle('open');
}